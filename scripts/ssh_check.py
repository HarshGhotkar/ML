import os
import sys
import time
from pathlib import Path
import paramiko

ROOT_DIR = Path(__file__).resolve().parent.parent
pem_path = ROOT_DIR / "deploy" / "adaptivecloud-key.pem"
host_ip = "13.126.201.190"

key = paramiko.RSAKey.from_private_key_file(str(pem_path))
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

print(f"Connecting to {host_ip} via SSH...")
max_retries = 10
for i in range(max_retries):
    try:
        ssh.connect(host_ip, username="ubuntu", pkey=key, timeout=10)
        print("Connected successfully via SSH!")
        break
    except Exception as e:
        print(f"Retry {i+1}/{max_retries}: {e}")
        time.sleep(5)
else:
    print("Could not connect after retries.")
    sys.exit(1)

stdin, stdout, stderr = ssh.exec_command("cat /var/log/adaptivecloud-init.log 2>/dev/null || echo 'No log yet'")
print("\n--- Init Log Tail ---")
print(stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command("systemctl is-active adaptivecloud-hub 2>/dev/null; systemctl is-active nginx 2>/dev/null")
print("--- Service Status (Hub / Nginx) ---")
print(stdout.read().decode())

ssh.close()
