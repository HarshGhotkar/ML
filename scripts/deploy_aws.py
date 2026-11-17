import os
import sys
import time
import base64
from pathlib import Path
from dotenv import load_dotenv
import boto3

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env.aws")

AWS_REGION = os.environ.get("AWS_DEFAULT_REGION", "ap-south-1")
AMI_ID = "ami-09d8c1e69d114dbf7"  # Ubuntu 24.04 LTS Noble in ap-south-1
INSTANCE_TYPE = "t3.micro"  # Free Tier eligible (2 vCPUs)
KEY_NAME = "adaptivecloud-key"
SG_NAME = "adaptivecloud-sg"
TAG_NAME = "AdaptiveCloud-Central-Hub"

ec2_client = boto3.client(
    "ec2",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION,
)
ec2_resource = boto3.resource(
    "ec2",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION,
)

print(f"[*] Initializing AWS deployment in region: {AWS_REGION}...")

# 1. Key Pair
pem_path = ROOT_DIR / "deploy" / f"{KEY_NAME}.pem"
pem_path.parent.mkdir(parents=True, exist_ok=True)

try:
    key_pairs = ec2_client.describe_key_pairs(KeyNames=[KEY_NAME])["KeyPairs"]
    print(f"[+] Key Pair '{KEY_NAME}' already exists in AWS.")
except ec2_client.exceptions.ClientError:
    print(f"[*] Creating new Key Pair '{KEY_NAME}'...")
    new_key = ec2_client.create_key_pair(KeyName=KEY_NAME, KeyType="rsa")
    pem_path.write_text(new_key["KeyMaterial"], encoding="utf-8")
    print(f"[+] Saved private key to: {pem_path}")

# 2. VPC & Security Group
vpcs = ec2_client.describe_vpcs(Filters=[{"Name": "isDefault", "Values": ["true"]}])["Vpcs"]
if not vpcs:
    raise RuntimeError("Default VPC not found in region.")
vpc_id = vpcs[0]["VpcId"]
print(f"[+] Using Default VPC: {vpc_id}")

try:
    sgs = ec2_client.describe_security_groups(
        Filters=[{"Name": "group-name", "Values": [SG_NAME]}, {"Name": "vpc-id", "Values": [vpc_id]}]
    )["SecurityGroups"]
    if sgs:
        sg_id = sgs[0]["GroupId"]
        print(f"[+] Found existing Security Group: {sg_id} ({SG_NAME})")
    else:
        raise ec2_client.exceptions.ClientError({"Error": {"Code": "NotFound"}}, "describe_security_groups")
except Exception:
    print(f"[*] Creating Security Group '{SG_NAME}'...")
    res = ec2_client.create_security_group(
        GroupName=SG_NAME,
        Description="Security Group for AdaptiveCloud Central Platform and Fleet Agents",
        VpcId=vpc_id,
    )
    sg_id = res["GroupId"]
    print(f"[+] Created Security Group: {sg_id}")

    # Authorize ingress ports
    ip_permissions = [
        {"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "SSH"}]},
        {"IpProtocol": "tcp", "FromPort": 80, "ToPort": 80, "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "HTTP Dashboard"}]},
        {"IpProtocol": "tcp", "FromPort": 443, "ToPort": 443, "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "HTTPS"}]},
        {"IpProtocol": "tcp", "FromPort": 8000, "ToPort": 8000, "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "FastAPI Backend"}]},
        {"IpProtocol": "tcp", "FromPort": 8001, "ToPort": 8001, "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "Hub & RCA API"}]},
        {"IpProtocol": "tcp", "FromPort": 5173, "ToPort": 5173, "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "Vite Dev Port"}]},
    ]
    ec2_client.authorize_security_group_ingress(GroupId=sg_id, IpPermissions=ip_permissions)
    print("[+] Ingress rules configured (Ports 22, 80, 443, 8000, 8001, 5173).")

# 3. User Data Cloud-Init Script
user_data_script = """#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

echo "=== [0/6] Enabling Swap Space ===" >> /var/log/adaptivecloud-init.log
fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

echo "=== [1/6] Installing OS Packages ===" >> /var/log/adaptivecloud-init.log
apt-get update -y
apt-get install -y git python3 python3-pip python3-venv curl nginx net-tools sqlite3

echo "=== [2/6] Cloning Repository ===" >> /var/log/adaptivecloud-init.log
mkdir -p /opt/adaptivecloud
cd /opt/adaptivecloud
git clone https://github.com/pradnyandongre24-creator/adaptivecloud-security.git .

echo "=== [3/6] Setting Up Python Environment ===" >> /var/log/adaptivecloud-init.log
python3 -m venv /opt/adaptivecloud/.venv
/opt/adaptivecloud/.venv/bin/pip install --upgrade pip
/opt/adaptivecloud/.venv/bin/pip install psutil requests tenacity python-dotenv fastapi uvicorn xgboost scikit-learn pydantic sqlalchemy aiosqlite structlog prometheus-fastapi-instrumentator passlib bcrypt

echo "=== [4/6] Creating Hub & RCA Systemd Service ===" >> /var/log/adaptivecloud-init.log
cat << 'EOF' > /etc/systemd/system/adaptivecloud-hub.service
[Unit]
Description=AdaptiveCloud Central Telemetry Hub, RCA Engine & Approval Gate
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/adaptivecloud
Environment=AGENT_PORT=8001
Environment=PYTHONPATH=/opt/adaptivecloud
ExecStart=/opt/adaptivecloud/.venv/bin/python agent/simulate_all_laptops.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable adaptivecloud-hub
systemctl restart adaptivecloud-hub

echo "=== [5/6] Installing Node.js & Building Frontend ===" >> /var/log/adaptivecloud-init.log
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

cd /opt/adaptivecloud/frontend
npm install --production=false
npm run build

echo "=== [6/6] Configuring Nginx Web Reverse Proxy ===" >> /var/log/adaptivecloud-init.log
cat << 'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /opt/adaptivecloud/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /incidents {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/v1/incidents {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/v1/ingest {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ingest {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /hosts {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /info {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /peers {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /telemetry {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

systemctl restart nginx
echo "=== AdaptiveCloud Cloud Deployment Complete ===" >> /var/log/adaptivecloud-init.log
"""

# Check if an instance with this tag is already running
existing = ec2_client.describe_instances(
    Filters=[
        {"Name": "tag:Name", "Values": [TAG_NAME]},
        {"Name": "instance-state-name", "Values": ["pending", "running"]},
    ]
)["Reservations"]

if existing and existing[0]["Instances"]:
    inst = existing[0]["Instances"][0]
    instance_id = inst["InstanceId"]
    pub_ip = inst.get("PublicIpAddress", "Pending")
    print(f"[+] Found existing running instance: {instance_id}")
    print(f"[+] Public IP: {pub_ip}")
else:
    print(f"[*] Launching new EC2 instance ({INSTANCE_TYPE}) with Ubuntu 24.04 LTS...")
    run_args = {
        "ImageId": AMI_ID,
        "InstanceType": INSTANCE_TYPE,
        "KeyName": KEY_NAME,
        "SecurityGroupIds": [sg_id],
        "MinCount": 1,
        "MaxCount": 1,
        "UserData": user_data_script,
        "BlockDeviceMappings": [
            {
                "DeviceName": "/dev/sda1",
                "Ebs": {
                    "VolumeSize": 20,
                    "VolumeType": "gp3",
                    "DeleteOnTermination": True,
                },
            }
        ],
        "TagSpecifications": [
            {
                "ResourceType": "instance",
                "Tags": [{"Key": "Name", "Value": TAG_NAME}],
            }
        ],
    }

    inst_res = ec2_client.run_instances(**run_args)
    instance_id = inst_res["Instances"][0]["InstanceId"]
    print(f"[+] EC2 Instance created: {instance_id}. Waiting for instance to start...")

    # Wait for running state
    waiter = ec2_client.get_waiter("instance_running")
    waiter.wait(InstanceIds=[instance_id])

    desc = ec2_client.describe_instances(InstanceIds=[instance_id])["Reservations"][0]["Instances"][0]
    pub_ip = desc.get("PublicIpAddress")
    print(f"[+] Instance {instance_id} is RUNNING!")
    print(f"[+] Public IPv4 Address: {pub_ip}")

# Save deployment info locally
info_path = ROOT_DIR / "deploy" / "aws_deployment_info.json"
import json
info = {
    "instance_id": instance_id,
    "public_ip": pub_ip,
    "region": AWS_REGION,
    "dashboard_url": f"http://{pub_ip}",
    "hub_api_url": f"http://{pub_ip}:8001",
    "ingest_url": f"http://{pub_ip}/api/v1/ingest",
}
info_path.write_text(json.dumps(info, indent=2), encoding="utf-8")
print(f"[+] Deployment metadata saved to: {info_path}")
print("======================================================================")
print(f"  AWS Cloud Dashboard URL : http://{pub_ip}")
print(f"  Hub Telemetry API       : http://{pub_ip}:8001")
print(f"  Fleet Ingest Endpoint   : http://{pub_ip}/api/v1/ingest")
print("======================================================================")
