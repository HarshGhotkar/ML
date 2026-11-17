import os
import sys
import time
import paramiko

PEM_PATH = "deploy/adaptivecloud-key.pem"
HOST_IP = "13.126.201.190"

def get_ssh():
    key = paramiko.RSAKey.from_private_key_file(PEM_PATH)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST_IP, username="ubuntu", pkey=key, timeout=45, banner_timeout=60, auth_timeout=60)
    return ssh

def main():
    print(f"[*] Connecting to AWS EC2 instance {HOST_IP}...")
    ssh = get_ssh()

    # 1. Install missing backend requirements
    print("[*] Installing Python backend requirements (greenlet, python-jose, pydantic-settings, etc.)...")
    install_cmd = (
        "sudo /opt/adaptivecloud/.venv/bin/pip install "
        "greenlet 'python-jose[cryptography]' python-multipart pydantic-settings "
        "httpx websockets aiosqlite 'sqlalchemy[asyncio]' 'passlib[bcrypt]'"
    )
    stdin, stdout, stderr = ssh.exec_command(install_cmd)
    exit_status = stdout.channel.recv_exit_status()
    print(f"[+] Pip install finished with code: {exit_status}")

    # 2. Setup adaptivecloud-backend.service (FastAPI core backend on port 8000)
    print("[*] Creating /etc/systemd/system/adaptivecloud-backend.service...")
    backend_service = """[Unit]
Description=AdaptiveCloud FastAPI Production Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/adaptivecloud/backend
Environment=PYTHONPATH=/opt/adaptivecloud:/opt/adaptivecloud/backend
Environment=DATABASE_URL=sqlite+aiosqlite:////opt/adaptivecloud/backend/adaptivecloud.db
ExecStart=/opt/adaptivecloud/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
"""
    sftp = ssh.open_sftp()
    with sftp.file("/tmp/adaptivecloud-backend.service", "w") as f:
        f.write(backend_service)

    # 3. Setup Nginx with complete routing
    print("[*] Creating /etc/nginx/sites-available/default with complete routing...")
    nginx_conf = """server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /opt/adaptivecloud/frontend/dist;
    index index.html;

    # Dynamic Telemetry Hub & RCA Permission Gate (Port 8001)
    location /incidents {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v1/incidents {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v1/ingest {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ingest {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /hosts {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /info {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /peers {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /telemetry {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Stream (Port 8000)
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # FastAPI Core Backend (Port 8000)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Single Page React Application
    location / {
        try_files $uri $uri/ /index.html;
    }
}
"""
    with sftp.file("/tmp/default_nginx", "w") as f:
        f.write(nginx_conf)

    # 4. Activate systemd services and nginx
    print("[*] Moving configs and restarting services on EC2...")
    cmds = (
        "sudo mv /tmp/adaptivecloud-backend.service /etc/systemd/system/adaptivecloud-backend.service && "
        "sudo mv /tmp/default_nginx /etc/nginx/sites-available/default && "
        "sudo systemctl daemon-reload && "
        "sudo systemctl enable adaptivecloud-backend && "
        "sudo systemctl restart adaptivecloud-backend && "
        "sudo systemctl restart adaptivecloud-hub && "
        "sudo nginx -t && "
        "sudo systemctl restart nginx"
    )
    stdin, stdout, stderr = ssh.exec_command(cmds)
    exit_status = stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    print(stderr.read().decode())
    print(f"[+] Services restart finished with code: {exit_status}")

    # 5. Sync frontend dist
    print("[*] Syncing compiled frontend/dist to EC2...")
    local_dist = os.path.abspath("frontend/dist")
    remote_dist = "/opt/adaptivecloud/frontend/dist"

    ssh.exec_command(f"sudo mkdir -p {remote_dist} && sudo chown -R ubuntu:ubuntu /opt/adaptivecloud/frontend")

    uploaded = 0
    for root, dirs, files in os.walk(local_dist):
        rel = os.path.relpath(root, local_dist).replace("\\", "/")
        target_dir = f"{remote_dist}/{rel}".rstrip("/.")
        try:
            sftp.mkdir(target_dir)
        except IOError:
            pass

        for file in files:
            local_file = os.path.join(root, file)
            remote_file = f"{target_dir}/{file}"
            sftp.put(local_file, remote_file)
            uploaded += 1

    print(f"[+] Successfully uploaded {uploaded} frontend dist files!")
    sftp.close()

    # 6. Verify endpoints
    print("[*] Verifying endpoints on EC2...")
    time.sleep(2)
    verify_cmd = (
        "echo '=== Hub Info ===' && curl -s http://127.0.0.1:8001/info | cut -c 1-100 && "
        "echo '' && echo '=== FastAPI Health ===' && curl -s http://127.0.0.1:8000/api/v1/health | cut -c 1-100 && "
        "echo '' && echo '=== FastAPI Dashboard Summary ===' && curl -s http://127.0.0.1:8000/api/v1/dashboard/summary | cut -c 1-100 && "
        "echo '' && echo '=== Nginx Proxy Health ===' && curl -sk https://127.0.0.1/api/v1/health | cut -c 1-100 && "
        "echo '' && echo '=== Nginx Index ===' && curl -sk https://127.0.0.1/ | grep -o '<title>.*</title>'"
    )
    stdin, stdout, stderr = ssh.exec_command(verify_cmd)
    print(stdout.read().decode())

    ssh.close()
    print("[+] Cloud deployment successfully completed!")

if __name__ == "__main__":
    main()
