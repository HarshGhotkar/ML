import socket
import platform
import psutil
import requests
import json

cloud_url = "http://13.126.201.190/api/v1/ingest"

hostname = socket.gethostname()
os_version = f"{platform.system()} {platform.release()} ({platform.machine()})"
cpu = psutil.cpu_percent(interval=1)
mem = psutil.virtual_memory().percent
disk = psutil.disk_usage("C:\\").percent
try:
    conns = len(psutil.net_connections(kind="inet"))
except Exception:
    conns = len(psutil.pids()) // 2

procs = []
for p in psutil.process_iter(["pid", "name", "cpu_percent"]):
    try:
        procs.append({
            "pid": p.info["pid"],
            "name": p.info["name"] or "process",
            "cpu_percent": round(p.info["cpu_percent"] or 0.0, 1),
        })
    except Exception:
        pass
top_procs = sorted(procs, key=lambda x: x["cpu_percent"], reverse=True)[:5]

payload = {
    "host_id": "host-laptop-01",
    "hostname": hostname,
    "os_version": os_version,
    "cpu_percent": cpu,
    "memory_percent": mem,
    "disk_percent": disk,
    "active_connections": conns,
    "top_processes": top_procs,
}

print(f"[*] Transmitting live telemetry from {hostname} to AWS Cloud: {cloud_url}...")
resp = requests.post(cloud_url, json=payload, timeout=10)
print(f"[+] AWS Response Code: {resp.status_code}")
print(f"[+] AWS Response Body: {resp.json()}")
