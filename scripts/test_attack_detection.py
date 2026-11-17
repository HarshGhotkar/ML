import requests
import json

cloud_url = "http://13.126.201.190/api/v1/ingest"

# Simulate Endpoint Node "FINANCE-PC-02" experiencing a rogue cryptomining attack
attack_payload = {
    "host_id": "host-laptop-03",
    "hostname": "FINANCE-PC-02",
    "os_version": "Windows 11 Pro",
    "cpu_percent": 94.5,
    "memory_percent": 88.0,
    "disk_percent": 62.0,
    "active_connections": 48,
    "top_processes": [
        {"name": "xmrig-daemon.exe", "pid": 5812, "cpu_percent": 74.5},
        {"name": "stratum-worker.exe", "pid": 5813, "cpu_percent": 15.2},
        {"name": "system", "pid": 4, "cpu_percent": 2.1},
    ],
}

print("[*] Simulating high-CPU cryptomining attack telemetry on FINANCE-PC-02...")
resp = requests.post(cloud_url, json=attack_payload, timeout=10)
print(f"[+] Response from AWS: {resp.status_code} - {resp.json()}")

# Query pending incidents on AWS
inc_res = requests.get("http://13.126.201.190/incidents?status=awaiting_approval")
incidents = inc_res.json()
print(f"\n[+] Total Incidents Awaiting Approval on AWS: {len(incidents)}")
if incidents:
    latest = incidents[0]
    print(f"  Incident ID   : {latest.get('incident_id')}")
    print(f"  Target Host   : {latest.get('host_id')}")
    print(f"  Threat Family : {latest.get('tier1_family')} (Confidence: {latest.get('tier1_confidence')})")
    print(f"  ATT&CK Tech   : {latest.get('tier2_technique')}")
    print(f"  Root Cause    : {latest.get('rca', {}).get('probable_root_cause')}")
    print(f"  Recommended   : {[a['name'] for a in latest.get('recommended_actions', [])]}")
