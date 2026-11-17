"""
agent/simulate_all_laptops.py
Multi-Laptop Simulator & Telemetry Hub for AdaptiveCloud.
Runs on your single laptop and makes ALL 4 PHYSICAL LAPTOPS LIVE!
- Laptop #1: Streams your actual physical hardware CPU, RAM, and processes.
- Laptop #2, #3, #4: Stream live simulated physical laptop telemetry.

Usage:
    python agent/simulate_all_laptops.py
"""

from __future__ import annotations

import collections
import json
import logging
import os
import platform
import socket
import sys
import threading
import time
import urllib.parse
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Any

# Ensure repository root is on sys.path
_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from core.incident_store import incident_store
from core.rca_engine import rca_engine
from core.tier_classifiers import tier_classifiers

try:
    import psutil
except ImportError:
    print("[INIT] Installing psutil...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psutil"])
    import psutil

PORT = int(os.environ.get("AGENT_PORT", "8001"))
HOST = "0.0.0.0"
HISTORY_LEN = 30

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("MultiLaptopSimulator")

# Storage for all 4 laptops
fleet_history: dict[str, collections.deque[dict[str, Any]]] = {
    "host-laptop-01": collections.deque(maxlen=HISTORY_LEN),
    "host-laptop-02": collections.deque(maxlen=HISTORY_LEN),
    "host-laptop-03": collections.deque(maxlen=HISTORY_LEN),
    "host-laptop-04": collections.deque(maxlen=HISTORY_LEN),
}
dynamic_peers: dict[str, dict[str, Any]] = {}
fleet_lock = threading.Lock()

HOSTNAME = socket.gethostname()
LOCAL_IP = "127.0.0.1"
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    LOCAL_IP = s.getsockname()[0]
    s.close()
except Exception:
    pass

OS_DETAILS = f"{platform.system()} {platform.release()} ({platform.machine()})"
CPU_CORES = psutil.cpu_count(logical=True) or 4
RAM_TOTAL_GB = round(psutil.virtual_memory().total / (1024 ** 3), 1)


def generate_fleet_snapshots() -> None:
    """Collect real telemetry for Laptop 1, and simulated hardware telemetry for Laptops 2-4."""
    now_ts = time.time()
    iso_ts = datetime.now(timezone.utc).isoformat()

    # LAPTOP 1: Real Local Hardware
    real_cpu = psutil.cpu_percent(interval=None)
    real_mem = psutil.virtual_memory().percent
    real_disk = psutil.disk_usage("C:\\" if os.name == "nt" else "/").percent
    try:
        real_conns = len(psutil.net_connections(kind="inet"))
    except Exception:
        real_conns = len(psutil.pids()) // 2

    real_procs = []
    for proc in psutil.process_iter(["pid", "name", "cpu_percent"]):
        try:
            pinfo = proc.info
            real_procs.append({
                "pid": pinfo["pid"],
                "name": pinfo["name"] or "process",
                "cpu_percent": round(pinfo["cpu_percent"] or 0.0, 1),
            })
        except Exception:
            pass
    real_procs = sorted(real_procs, key=lambda x: x["cpu_percent"], reverse=True)[:5]

    snap_1 = {
        "id": f"m-1-{int(now_ts * 1000)}",
        "host_id": "host-laptop-01",
        "ts": iso_ts,
        "cpu": round(real_cpu, 1),
        "mem": round(real_mem, 1),
        "disk": round(real_disk, 1),
        "conn_count": real_conns,
        "load": round(real_cpu / 25.0, 2),
        "extra": {"top_cpu_processes": real_procs},
    }

    # LAPTOP 2: Lab Workstation A (Port Scan activity)
    t = now_ts / 4
    snap_2 = {
        "id": f"m-2-{int(now_ts * 1000)}",
        "host_id": "host-laptop-02",
        "ts": iso_ts,
        "cpu": round(58.0 + 8.0 * ((t % 3) - 1.5), 1),
        "mem": 72.4,
        "disk": 61.2,
        "conn_count": 182,
        "load": 2.1,
        "extra": {
            "top_cpu_processes": [
                {"name": "nmap_probe.exe", "pid": 8840, "cpu_percent": 24.2},
                {"name": "svchost.exe", "pid": 1044, "cpu_percent": 12.8},
                {"name": "chrome.exe", "pid": 6320, "cpu_percent": 6.4},
            ]
        },
    }

    # LAPTOP 3: Dev Workstation B (XMRig Cryptominer)
    snap_3 = {
        "id": f"m-3-{int(now_ts * 1000)}",
        "host_id": "host-laptop-03",
        "ts": iso_ts,
        "cpu": round(92.0 + 3.0 * ((t % 2) - 1.0), 1),
        "mem": 86.5,
        "disk": 48.0,
        "conn_count": 42,
        "load": 3.8,
        "extra": {
            "top_cpu_processes": [
                {"name": "xmrig-daemon", "pid": 4912, "cpu_percent": 68.5},
                {"name": "stratum-worker", "pid": 4913, "cpu_percent": 14.2},
                {"name": "containerd", "pid": 890, "cpu_percent": 4.5},
            ]
        },
    }

    # LAPTOP 4: Field Workstation C (LSASS Dump)
    snap_4 = {
        "id": f"m-4-{int(now_ts * 1000)}",
        "host_id": "host-laptop-04",
        "ts": iso_ts,
        "cpu": round(42.0 + 5.0 * ((t % 4) - 2.0), 1),
        "mem": 68.2,
        "disk": 55.4,
        "conn_count": 28,
        "load": 1.4,
        "extra": {
            "top_cpu_processes": [
                {"name": "lsass.exe (Audit)", "pid": 680, "cpu_percent": 18.2},
                {"name": "mimikatz_probe.exe", "pid": 7420, "cpu_percent": 9.4},
                {"name": "powershell.exe", "pid": 3204, "cpu_percent": 6.8},
            ]
        },
    }

    with fleet_lock:
        fleet_history["host-laptop-01"].append(snap_1)
        fleet_history["host-laptop-02"].append(snap_2)
        fleet_history["host-laptop-03"].append(snap_3)
        fleet_history["host-laptop-04"].append(snap_4)


def background_loop() -> None:
    psutil.cpu_percent(interval=0.5)
    for _ in range(10):
        generate_fleet_snapshots()
        time.sleep(0.1)

    while True:
        try:
            generate_fleet_snapshots()
            logger.info(
                "Streaming 4 Laptops -> L1 (You): %4.1f%% | L2: %4.1f%% | L3: %4.1f%% | L4: %4.1f%%",
                fleet_history["host-laptop-01"][-1]["cpu"],
                fleet_history["host-laptop-02"][-1]["cpu"],
                fleet_history["host-laptop-03"][-1]["cpu"],
                fleet_history["host-laptop-04"][-1]["cpu"],
            )
        except Exception as e:
            logger.error("Simulator error: %s", e)
        time.sleep(2.0)


class MultiLaptopHandler(BaseHTTPRequestHandler):
    def _set_cors(self, content_type: str = "application/json") -> None:
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Content-Type", content_type)
        self.end_headers()

    def do_OPTIONS(self) -> None:
        self._set_cors()

    def do_POST(self) -> None:
        clean = self.path.split("?")[0]
        content_len = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_len) if content_len > 0 else b"{}"
        try:
            body = json.loads(post_data.decode("utf-8")) if post_data else {}
        except Exception:
            body = {}

        # Ingestion from fleet endpoint nodes: POST /api/v1/ingest or /ingest
        if clean in ("/api/v1/ingest", "/ingest"):
            host_id = body.get("host_id") or body.get("agent_id") or "host-laptop-remote"
            now_ts = time.time()
            iso_ts = datetime.now(timezone.utc).isoformat()

            raw_cpu = float(body.get("cpu_percent", body.get("cpu", 15.0)))
            raw_mem = float(body.get("memory_percent", body.get("mem", 45.0)))
            raw_disk = float(body.get("disk_percent", body.get("disk", 50.0)))
            conns = int(body.get("active_connections", body.get("conn_count", 25)))
            
            # Determine real client IP forwarding through Nginx
            forwarded_ip = self.headers.get("X-Forwarded-For") or self.headers.get("X-Real-IP")
            if forwarded_ip:
                client_ip = forwarded_ip.split(",")[0].strip()
            else:
                client_ip = self.client_address[0] if hasattr(self, "client_address") and self.client_address else "13.126.201.190"

            is_l1 = (host_id == "host-laptop-01")
            client_hostname = "ASUS VivoBook (Primary Physical Node)" if is_l1 else body.get("hostname", host_id)
            hostname = client_hostname
            client_ip_display = "AWS Cloud Uplink (13.126.201.190)" if (client_ip in ("127.0.0.1", "localhost") or is_l1) else f"{client_ip} ➔ AWS Cloud"

            snap = {
                "id": f"m-{host_id}-{int(now_ts * 1000)}",
                "host_id": host_id,
                "ts": iso_ts,
                "cpu": round(raw_cpu, 1),
                "mem": round(raw_mem, 1),
                "disk": round(raw_disk, 1),
                "conn_count": conns,
                "load": round(raw_cpu / 25.0, 2),
                "extra": {
                    "top_cpu_processes": body.get("top_processes", []),
                    "hostname": client_hostname,
                    "ip_address": client_ip_display,
                    "cloud_provider": "AWS EC2 (ap-south-1)",
                },
            }

            with fleet_lock:
                if host_id not in fleet_history:
                    fleet_history[host_id] = collections.deque(maxlen=HISTORY_LEN)
                fleet_history[host_id].append(snap)
                dynamic_peers[host_id] = {
                    "hostname": client_hostname,
                    "display_label": "Physical Hardware ➔ AWS Cloud Connected (ap-south-1)" if is_l1 else f"{client_hostname} (Physical Node ➔ AWS Synced)",
                    "ip_address": client_ip_display,
                    "os_version": body.get("os_version", "Windows 11 Pro (Physical Bare-Metal)"),
                    "cpu": round(raw_cpu, 1),
                    "mem": round(raw_mem, 1),
                    "last_seen": iso_ts,
                    "cloud_provider": "AWS EC2 ap-south-1",
                }

            # 2-Tier threat classification & RCA
            feature_vector = {
                "cpu": raw_cpu,
                "ram": raw_mem,
                "failed_logins": int(body.get("event_log_errors_1m", body.get("failed_logins", 0))),
                "inbound_traffic": float(body.get("net_bytes_recv_sec", body.get("inbound_traffic", 100.0))),
                "active_connections": conns,
                "src_ip": client_ip,
            }
            classification = tier_classifiers.classify(feature_vector)
            family = classification.get("tier1_family", classification.get("family", "benign"))
            conf = float(classification.get("tier1_confidence", classification.get("confidence", 0.0)))
            tech = classification.get("tier2_technique")
            tech_conf = classification.get("tier2_confidence")

            if family != "benign" and conf >= 0.70:
                rca = rca_engine.analyze(
                    features=feature_vector,
                    tier1_family=family,
                    tier1_confidence=conf,
                    tier2_technique=tech,
                    tier2_confidence=tech_conf,
                    host_id=host_id,
                )
                inc_id = f"inc-{host_id}-{int(now_ts * 1000)}"
                incident = {
                    "incident_id": inc_id,
                    "timestamp": iso_ts,
                    "source": "live",
                    "host_id": f"{hostname} ({client_ip})",
                    "tier1_family": family,
                    "tier1_confidence": conf,
                    "tier2_technique": tech,
                    "tier2_confidence": tech_conf,
                    "status": "awaiting_approval",
                    "features": feature_vector,
                    "rca": rca,
                    "recommended_actions": rca.get("recommended_actions", []),
                    "approval": {"decided_by": None, "decision": None, "decided_at": None, "comment": None},
                    "execution_log": [],
                    "outcome_summary": f"Incident detected on {hostname}: {rca.get('summary', '')}",
                    "created_epoch": now_ts,
                }
                incident_store.save_incident(incident)

            self._set_cors()
            self.wfile.write(json.dumps({"status": "accepted", "metric_id": snap["id"]}).encode("utf-8"))
            return

        # Permission Gate: POST /incidents/{id}/approve
        if "/approve" in clean:
            parts = clean.strip("/").split("/")
            # e.g. incidents/inc-001/approve
            inc_id = parts[1] if len(parts) >= 3 else parts[0]
            try:
                action_ids = body.get("action_ids")
                decided_by = body.get("decided_by", "Operator")
                comment = body.get("comment", "")
                dry_run = body.get("dry_run", True)

                updated = incident_store.approve_and_execute(
                    incident_id=inc_id,
                    action_ids=action_ids,
                    decided_by=decided_by,
                    comment=comment,
                    dry_run=dry_run,
                )
                self._set_cors()
                self.wfile.write(json.dumps(updated).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(400)
                self._set_cors()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        # Permission Gate: POST /incidents/{id}/reject
        if "/reject" in clean:
            parts = clean.strip("/").split("/")
            inc_id = parts[1] if len(parts) >= 3 else parts[0]
            try:
                decided_by = body.get("decided_by", "Operator")
                comment = body.get("comment", "")

                updated = incident_store.reject_action(
                    incident_id=inc_id,
                    decided_by=decided_by,
                    comment=comment,
                )
                self._set_cors()
                self.wfile.write(json.dumps(updated).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(400)
                self._set_cors()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        # Rollback: POST /incidents/{id}/rollback
        if "/rollback" in clean:
            parts = clean.strip("/").split("/")
            inc_id = parts[1] if len(parts) >= 3 else parts[0]
            try:
                decided_by = body.get("decided_by", "Operator")
                comment = body.get("comment", "")
                dry_run = body.get("dry_run", True)

                updated = incident_store.rollback_action(
                    incident_id=inc_id,
                    decided_by=decided_by,
                    comment=comment,
                    dry_run=dry_run,
                )
                self._set_cors()
                self.wfile.write(json.dumps(updated).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(400)
                self._set_cors()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        self.send_response(404)
        self.end_headers()

    def do_GET(self) -> None:
        parsed_url = urllib.parse.urlparse(self.path)
        clean = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # GET /incidents or /api/v1/incidents
        if clean in ("/incidents", "/api/v1/incidents"):
            self._set_cors()
            incident_store.check_expirations(timeout_seconds=300)
            family = query_params.get("family", [None])[0]
            status_param = query_params.get("status", [None])[0]
            source = query_params.get("source", [None])[0]
            limit_param = int(query_params.get("limit", ["100"])[0])

            items = incident_store.list_incidents(
                family=family,
                status=status_param,
                source=source,
                limit=limit_param,
            )
            self.wfile.write(json.dumps(items).encode("utf-8"))
            return

        # GET /incidents/{id}
        if clean.startswith("/incidents/") or clean.startswith("/api/v1/incidents/"):
            parts = clean.strip("/").split("/")
            inc_id = parts[-1]
            inc = incident_store.get_incident(inc_id)
            if inc:
                self._set_cors()
                self.wfile.write(json.dumps(inc).encode("utf-8"))
            else:
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Incident {inc_id} not found"}).encode("utf-8"))
            return

        if clean in ("/", "/info", "/status"):
            self._set_cors()
            info = {
                "status": "online",
                "hostname": "ASUS VivoBook (Primary Physical Node)",
                "display_label": "Physical Hardware ➔ AWS Cloud Connected (ap-south-1)",
                "ip_address": "AWS Cloud Uplink (13.126.201.190)",
                "cloud_provider": "AWS EC2",
                "cloud_region": "ap-south-1 (Mumbai)",
                "cloud_instance_id": "i-098c54730ff60bf4a",
                "os_version": "Windows 11 Pro (Physical Bare-Metal)",
                "is_physical": True,
                "active_laptops": 4,
            }
            self.wfile.write(json.dumps(info).encode("utf-8"))
            return

        if clean in ("/peers", "/peer-laptops"):
            self._set_cors()
            l1_cpu = round(fleet_history["host-laptop-01"][-1]["cpu"], 1) if (fleet_history.get("host-laptop-01") and len(fleet_history["host-laptop-01"]) > 0) else 14.5
            l1_mem = round(fleet_history["host-laptop-01"][-1]["mem"], 1) if (fleet_history.get("host-laptop-01") and len(fleet_history["host-laptop-01"]) > 0) else 68.2
            peers = {
                "host-laptop-01": {
                    "hostname": "ASUS VivoBook (Primary Physical Node)",
                    "display_label": "Physical Hardware ➔ AWS Cloud Connected (ap-south-1)",
                    "ip_address": "AWS Cloud Uplink (13.126.201.190)",
                    "os_version": "Windows 11 Pro (Physical Bare-Metal)",
                    "cpu": l1_cpu,
                    "mem": l1_mem,
                    "cloud_provider": "AWS EC2 ap-south-1",
                },
                "host-laptop-02": {
                    "hostname": "LAB-WORKSTATION-A",
                    "display_label": "Lab Workstation A (Physical Node ➔ AWS Synced)",
                    "ip_address": "192.168.1.102 ➔ AWS Synced",
                    "os_version": "Windows 11 Enterprise",
                    "cpu": 64,
                    "mem": 72,
                    "cloud_provider": "AWS EC2 ap-south-1",
                },
                "host-laptop-03": {
                    "hostname": "DEV-WORKSTATION-B",
                    "display_label": "Dev Workstation B (Physical Linux ➔ AWS Synced)",
                    "ip_address": "192.168.1.103 ➔ AWS Synced",
                    "os_version": "Ubuntu 24.04 LTS",
                    "cpu": 94,
                    "mem": 86,
                    "cloud_provider": "AWS EC2 ap-south-1",
                },
                "host-laptop-04": {
                    "hostname": "FIELD-WORKSTATION-C",
                    "display_label": "Field Workstation C (Physical Node ➔ AWS Synced)",
                    "ip_address": "192.168.1.104 ➔ AWS Synced",
                    "os_version": "Windows 10 Pro",
                    "cpu": 42,
                    "mem": 68,
                    "cloud_provider": "AWS EC2 ap-south-1",
                },
            }
            with fleet_lock:
                peers.update(dynamic_peers)
            self.wfile.write(json.dumps(peers).encode("utf-8"))
            return

        # Dynamic metrics for any host (built-in or remote physical laptops)
        if clean.startswith("/hosts/") and clean.endswith("/metrics"):
            parts = clean.strip("/").split("/")
            card_id = parts[1] if len(parts) >= 2 else ""
            with fleet_lock:
                pts = list(fleet_history.get(card_id, []))
            self._set_cors()
            payload = {
                "host_id": card_id,
                "status": "online" if pts else "idle",
                "points": pts,
                "latest": pts[-1] if pts else {},
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format: str, *args: Any) -> None:
        pass


def seed_initial_incidents() -> None:
    """Pre-seed representative incidents covering all sources, families, and approval statuses."""
    existing = incident_store.list_incidents(limit=5)
    if len(existing) >= 3:
        return

    logger.info("Initializing baseline incidents in SQLite store...")
    samples = [
        {
            "incident_id": "inc-live-001",
            "source": "live",
            "host_id": "PHYSICAL-LAPTOP-01 (Host Laptop - Windows 11)",
            "tier1_family": "brute_force",
            "tier1_confidence": 0.968,
            "tier2_technique": "T1110.004 (Credential Stuffing)",
            "tier2_confidence": 0.942,
            "status": "awaiting_approval",
            "features": {"cpu": 24.5, "ram": 52.0, "failed_logins": 42, "inbound_traffic": 140.0, "active_connections": 54, "src_ip": "198.51.100.45"},
            "approval": {"decided_by": None, "decision": None, "decided_at": None, "comment": None},
            "execution_log": [],
            "outcome_summary": "High-confidence credential attack detected. Awaiting operator authorization before firewall block.",
        },
        {
            "incident_id": "inc-sim-002",
            "source": "simulated",
            "host_id": "GCP-VM-EU-02 (Google Cloud VPC Gateway)",
            "tier1_family": "ddos",
            "tier1_confidence": 0.985,
            "tier2_technique": "T1498.001 (Direct Network Flood)",
            "tier2_confidence": 0.970,
            "status": "verified",
            "features": {"cpu": 82.4, "ram": 64.0, "failed_logins": 0, "inbound_traffic": 94000.0, "active_connections": 380, "src_ip": "198.51.100.88"},
            "approval": {"decided_by": "SecOps Lead", "decision": "approved", "decided_at": "2026-11-15T02:00:00Z", "comment": "Approved Cloud Armor edge rate-limit."},
            "execution_log": [
                {
                    "action_id": "ACT_GCP_ARMOR_RATE_LIMIT",
                    "command": "gcloud compute security-policies rules create 1000 --security-policy=cloud-armor-adaptive-waf --src-ip-ranges=198.51.100.0/24 --action=rate-based-ban",
                    "dry_run": True,
                    "status": "simulated",
                    "result": "Rate-limit policy deployed across Google edge POPs in 380ms.",
                    "duration_ms": 380.0,
                    "executed_at": "2026-11-15T02:00:01Z",
                }
            ],
            "verification_result": {
                "verified": True,
                "probe": "GCP Cloud Monitoring Edge Packet Probe",
                "metrics_before": {"inbound_traffic_pps": 94000},
                "metrics_after": {"inbound_traffic_pps": 110},
                "message": "Traffic rate normalized to 110 pkts/s (99.8% reduction).",
            },
            "outcome_summary": "Approved by SecOps Lead. Cloud Armor edge rate-limit verified active.",
        },
        {
            "incident_id": "inc-sim-003",
            "source": "simulated",
            "host_id": "PHYSICAL-LAPTOP-03 (Dev Workstation B - Ubuntu)",
            "tier1_family": "cryptomining",
            "tier1_confidence": 0.975,
            "tier2_technique": "T1496 (Resource Hijacking)",
            "tier2_confidence": 0.960,
            "status": "awaiting_approval",
            "features": {"cpu": 94.2, "ram": 86.0, "failed_logins": 0, "inbound_traffic": 180.0, "active_connections": 45, "pid": 4912, "process_name": "xmrig"},
            "approval": {"decided_by": None, "decision": None, "decided_at": None, "comment": None},
            "execution_log": [],
            "outcome_summary": "Rogue mining daemon identified consuming 94% CPU. Awaiting permission to terminate PID 4912.",
        },
        {
            "incident_id": "inc-live-004",
            "source": "live",
            "host_id": "PHYSICAL-LAPTOP-04 (Field Workstation C)",
            "tier1_family": "privilege_escalation",
            "tier1_confidence": 0.964,
            "tier2_technique": "T1003.001 (LSASS Memory Dump)",
            "tier2_confidence": 0.935,
            "status": "rejected",
            "features": {"cpu": 48.0, "ram": 62.0, "failed_logins": 2, "inbound_traffic": 110.0, "active_connections": 22},
            "approval": {"decided_by": "Compliance Officer", "decision": "rejected", "decided_at": "2026-11-15T01:45:00Z", "comment": "Authorized internal red team penetration test. No action permitted."},
            "execution_log": [],
            "outcome_summary": "Operator rejected countermeasure. Host remains uninhibited for audit.",
        },
        {
            "incident_id": "inc-sim-005",
            "source": "simulated",
            "host_id": "PHYSICAL-LAPTOP-02 (Lab Workstation A)",
            "tier1_family": "port_scan",
            "tier1_confidence": 0.924,
            "tier2_technique": "T1046 (Network Service Scanning)",
            "tier2_confidence": 0.910,
            "status": "expired",
            "features": {"cpu": 22.0, "ram": 48.0, "failed_logins": 0, "inbound_traffic": 340.0, "active_connections": 185},
            "approval": {"decided_by": "System Watchdog", "decision": "expired", "decided_at": "2026-11-15T01:30:00Z", "comment": "Approval window elapsed without human authorization."},
            "execution_log": [],
            "outcome_summary": "Permission gate timed out (300s). No defensive action taken.",
        },
    ]

    for s in samples:
        rca = rca_engine.analyze(
            features=s["features"],
            tier1_family=s["tier1_family"],
            tier1_confidence=s["tier1_confidence"],
            tier2_technique=s["tier2_technique"],
            tier2_confidence=s["tier2_confidence"],
            host_id=s["host_id"],
        )
        s["rca"] = rca
        s["recommended_actions"] = rca["recommended_actions"]
        incident_store.save_incident(s)


def main() -> None:
    banner = f"""
======================================================================
      ADAPTIVECLOUD MULTI-LAPTOP FLEET SIMULATOR v2.5.0
======================================================================
  [+] Host Laptop (You) : {HOSTNAME} ({LOCAL_IP})
  [+] Simulated Fleet   : 4 Physical Laptops Streaming Simultaneously!
  [+] Hub API Port      : http://localhost:{PORT}
  [+] Status            : ALL 4 CARDS ON YOUR SCREEN ARE NOW LIVE!
======================================================================
"""
    print(banner)

    seed_initial_incidents()

    collector_thread = threading.Thread(target=background_loop, daemon=True)
    collector_thread.start()

    server = HTTPServer((HOST, PORT), MultiLaptopHandler)
    logger.info("Serving all 4 laptops on port %d...", PORT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nSimulator stopped.")
        server.server_close()


if __name__ == "__main__":
    main()
