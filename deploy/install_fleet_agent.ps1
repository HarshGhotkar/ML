# AdaptiveCloud 1-Click Fleet Agent Installer
# Run in PowerShell:
# powershell -ExecutionPolicy Bypass -File install_agent_on_any_laptop.ps1

param(
    [string]$CloudUrl = "http://13.126.201.190/api/v1/ingest"
)

$AgentDir = "$env:LOCALAPPDATA\AdaptiveAgent"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "     ADAPTIVECLOUD: 1-CLICK FLEET AGENT INSTALLER (AWS CLOUD)        " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Target AWS Hub : $CloudUrl" -ForegroundColor Green
Write-Host "  Install Path   : $AgentDir" -ForegroundColor Green
Write-Host ""

# 1. Detect Python
$pyCmd = $null
if (Get-Command "python" -ErrorAction SilentlyContinue) {
    $pyCmd = "python"
} elseif (Get-Command "py" -ErrorAction SilentlyContinue) {
    $pyCmd = "py"
} else {
    Write-Host "[-] Python is not detected on this computer." -ForegroundColor Red
    Write-Host "    Please install Python from https://www.python.org/downloads/ (check 'Add python.exe to PATH')" -ForegroundColor Yellow
    Write-Host "    or run: winget install Python.Python.3.12" -ForegroundColor Yellow
    exit 1
}

Write-Host "[*] Found Python: $pyCmd" -ForegroundColor Green
Write-Host "[*] Installing required collector packages (psutil, requests)..." -ForegroundColor Cyan
& $pyCmd -m pip install --quiet psutil requests

# 2. Create agent directory
if (-not (Test-Path $AgentDir)) {
    New-Item -ItemType Directory -Path $AgentDir -Force | Out-Null
}

# 3. Generate fleet_agent.py
$agentScript = @"
import time
import socket
import platform
import psutil
import requests
import json
from datetime import datetime

CLOUD_URL = "$CloudUrl"
HOSTNAME = socket.gethostname()
HOST_ID = f"host-{HOSTNAME.lower()}"
OS_INFO = f"{platform.system()} {platform.release()} ({platform.machine()})"

print(f"===========================================================")
print(f"  AdaptiveCloud Real-Time Agent Active for: {HOSTNAME}")
print(f"  Streaming hardware telemetry to: {CLOUD_URL}")
print(f"===========================================================")

while True:
    try:
        cpu = psutil.cpu_percent(interval=1)
        mem = psutil.virtual_memory().percent
        try:
            disk = psutil.disk_usage("C:\\").percent
        except Exception:
            disk = 50.0

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
            "host_id": HOST_ID,
            "hostname": HOSTNAME,
            "os_version": OS_INFO,
            "cpu_percent": cpu,
            "memory_percent": mem,
            "disk_percent": disk,
            "active_connections": conns,
            "top_processes": top_procs,
        }

        resp = requests.post(CLOUD_URL, json=payload, timeout=8)
        if resp.status_code == 200:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Telemetry synced to AWS -> CPU: {cpu}% | RAM: {mem}% | Conns: {conns}")
        else:
            print(f"Server response: {resp.status_code}")
    except Exception as e:
        print(f"Sync retry: {e}")

    time.sleep(10)
"@

$agentScript | Out-File -FilePath "$AgentDir\fleet_agent.py" -Encoding utf8

# 4. Create background runner
@"
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "$pyCmd `"$AgentDir\fleet_agent.py`"", 0, False
"@ | Out-File -FilePath "$AgentDir\run_background.vbs" -Encoding utf8

# 5. Create launcher batch file
@"
@echo off
TITLE AdaptiveCloud Fleet Agent - $env:COMPUTERNAME
$pyCmd "$AgentDir\fleet_agent.py"
pause
"@ | Out-File -FilePath "$AgentDir\start_agent_visible.bat" -Encoding utf8

Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   SUCCESS: THIS LAPTOP IS NOW CONNECTED TO ADAPTIVECLOUD ON AWS!    " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  To view telemetry stream : $AgentDir\start_agent_visible.bat" -ForegroundColor Cyan
Write-Host "  Cloud Web Dashboard      : http://13.126.201.190/monitoring" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green

# Launch the agent now
Start-Process -FilePath $pyCmd -ArgumentList "`"$AgentDir\fleet_agent.py`""
Write-Host "[+] Agent process launched and transmitting live metrics to AWS!" -ForegroundColor Green
