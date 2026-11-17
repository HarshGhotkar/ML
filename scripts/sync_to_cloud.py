import os
import sys
from pathlib import Path
import paramiko

ROOT_DIR = Path(__file__).resolve().parent.parent
pem_path = ROOT_DIR / "deploy" / "adaptivecloud-key.pem"
host_ip = "13.126.201.190"

key = paramiko.RSAKey.from_private_key_file(str(pem_path))
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host_ip, username="ubuntu", pkey=key, timeout=10)

# Grant ubuntu user write permission to /opt/adaptivecloud
stdin, stdout, stderr = ssh.exec_command("sudo chown -R ubuntu:ubuntu /opt/adaptivecloud")
stdout.channel.recv_exit_status()

sftp = ssh.open_sftp()

print("[*] Connected via SFTP. Syncing latest code and pre-built frontend...")

# Helper to put directory recursively
def sftp_put_dir(local_dir: Path, remote_dir: str):
    try:
        sftp.mkdir(remote_dir)
    except Exception:
        pass
    for item in local_dir.iterdir():
        remote_path = f"{remote_dir}/{item.name}"
        if item.is_dir():
            sftp_put_dir(item, remote_path)
        else:
            print(f"  Uploading: {item.name}")
            sftp.put(str(item), remote_path)

# 1. Sync updated Python core files
print("[*] Uploading core/incident_store.py...")
sftp.put(str(ROOT_DIR / "core" / "incident_store.py"), "/opt/adaptivecloud/core/incident_store.py")

print("[*] Uploading agent/simulate_all_laptops.py...")
sftp.put(str(ROOT_DIR / "agent" / "simulate_all_laptops.py"), "/opt/adaptivecloud/agent/simulate_all_laptops.py")

# 2. Sync pre-built frontend/dist
print("[*] Uploading compiled React bundle frontend/dist...")
sftp_put_dir(ROOT_DIR / "frontend" / "dist", "/opt/adaptivecloud/frontend/dist")

# Ensure installer scripts are in dist
sftp.put(str(ROOT_DIR / "install_agent_on_any_laptop.ps1"), "/opt/adaptivecloud/frontend/dist/install_fleet_agent.ps1")
sftp.put(str(ROOT_DIR / "install_agent_on_any_laptop.ps1"), "/opt/adaptivecloud/frontend/dist/install_agent_on_any_laptop.ps1")

sftp.close()

# 3. Restart services on the cloud server
print("[*] Restarting adaptivecloud-hub, adaptivecloud-backend, and nginx...")
stdin, stdout, stderr = ssh.exec_command("sudo systemctl restart adaptivecloud-hub && sudo systemctl restart adaptivecloud-backend && sudo systemctl restart nginx")
print(stdout.read().decode())
print(stderr.read().decode())

# Check status
stdin, stdout, stderr = ssh.exec_command("curl -s http://127.0.0.1:8001/info")
print("[+] Hub /info response from AWS server:")
print(stdout.read().decode())

ssh.close()
print("[+] Sync completed successfully!")
