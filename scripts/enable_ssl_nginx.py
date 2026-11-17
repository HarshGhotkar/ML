import paramiko

pem_path = "deploy/adaptivecloud-key.pem"
host_ip = "13.126.201.190"

key = paramiko.RSAKey.from_private_key_file(pem_path)
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host_ip, username="ubuntu", pkey=key, timeout=10)

print("[*] Generating self-signed SSL certificate for 13.126.201.190...")
gen_cert_cmd = (
    "sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 "
    "-keyout /etc/ssl/private/nginx-selfsigned.key "
    "-out /etc/ssl/certs/nginx-selfsigned.crt "
    "-subj '/C=IN/ST=Maharashtra/L=Mumbai/O=AdaptiveCloud/CN=13.126.201.190'"
)
stdin, stdout, stderr = ssh.exec_command(gen_cert_cmd)
stdout.channel.recv_exit_status()

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

    location / {
        try_files $uri $uri/ /index.html;
    }

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
}
"""

sftp = ssh.open_sftp()
with sftp.file("/tmp/default_nginx_ssl", "w") as f:
    f.write(nginx_conf)
sftp.close()

stdin, stdout, stderr = ssh.exec_command("sudo mv /tmp/default_nginx_ssl /etc/nginx/sites-available/default && sudo nginx -t && sudo systemctl restart nginx")
print(stdout.read().decode())
print(stderr.read().decode())

stdin, stdout, stderr = ssh.exec_command("sudo netstat -tlpn | grep nginx")
print("[+] Listening Nginx ports:")
print(stdout.read().decode())

ssh.close()
print("[+] SSL setup and Nginx reload complete!")
