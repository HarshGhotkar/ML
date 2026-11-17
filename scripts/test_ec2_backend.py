import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('13.126.201.190', username='ubuntu', pkey=paramiko.RSAKey.from_private_key_file('deploy/adaptivecloud-key.pem'))

cmd = """cd /opt/adaptivecloud/backend && /opt/adaptivecloud/.venv/bin/python -c "import app.main; print('Successfully imported app.main!')" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Stdout:", stdout.read().decode())
print("Stderr:", stderr.read().decode())
ssh.close()
