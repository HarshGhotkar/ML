"""
tests/test_permission_gate.py
Safety & Permission Gate tests for AdaptiveCloud.
Verifies that:
1. No playbook action executes without explicit human approval.
2. Rejection results in zero execution and records the decision.
3. Expiry halts pending actions when timeout elapses.
4. Scope limits and protected target allowlists block out-of-scope/protected targets.
5. Dry-run mode produces auditable simulation without destructive changes.
"""
from __future__ import annotations

import tempfile
import time
import unittest
from pathlib import Path

from core.healing_playbooks import BlockIPPlaybook, PlaybookSafetyVeto
from core.incident_store import IncidentStore


class TestPermissionGate(unittest.TestCase):

    def setUp(self) -> None:
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tmp_dir.name) / "test_incidents.db"
        self.store = IncidentStore(self.db_path)

        # Baseline test incident
        self.test_incident = {
            "incident_id": "inc-test-001",
            "source": "simulated",
            "host_id": "host-laptop-02",
            "features": {"cpu": 30.0, "ram": 50.0, "failed_logins": 50, "inbound_traffic": 120.0, "active_connections": 40},
            "tier1_family": "brute_force",
            "tier1_confidence": 0.95,
            "tier2_technique": "T1110.004",
            "tier2_confidence": 0.92,
            "rca": {"summary": "Brute force test", "probable_root_cause": "Weak password"},
            "recommended_actions": [
                {
                    "action_id": "ACT_BLOCK_SOURCE_IP",
                    "name": "Host Firewall Dynamic Inbound Block",
                    "description": "Block attacking IP",
                    "risk_level": "low",
                    "reversible": True,
                    "rollback_steps": "Remove block rule",
                    "expected_outcome": "Logins blocked",
                }
            ],
            "status": "awaiting_approval",
            "execution_log": [],
            "approval": {"decided_by": None, "decision": None, "decided_at": None, "comment": None},
            "created_epoch": time.time(),
        }

    def tearDown(self) -> None:
        import gc
        gc.collect()
        try:
            self.tmp_dir.cleanup()
        except Exception:
            pass

    def test_no_execution_while_awaiting_approval(self) -> None:
        """In awaiting_approval state, execution_log must remain empty."""
        saved = self.store.save_incident(self.test_incident)
        self.assertEqual(saved["status"], "awaiting_approval")
        self.assertEqual(len(saved["execution_log"]), 0)
        self.assertIsNone(saved["approval"]["decision"])

    def test_rejection_executes_nothing(self) -> None:
        """Rejecting an incident must update status to rejected and execute zero commands."""
        self.store.save_incident(self.test_incident)

        rejected = self.store.reject_action(
            incident_id="inc-test-001",
            decided_by="Auditor Alice",
            comment="Rejected due to maintenance window.",
        )

        self.assertEqual(rejected["status"], "rejected")
        self.assertEqual(rejected["approval"]["decision"], "rejected")
        self.assertEqual(rejected["approval"]["decided_by"], "Auditor Alice")
        self.assertEqual(len(rejected["execution_log"]), 0)

    def test_timeout_expiration_halts_action(self) -> None:
        """Incidents exceeding timeout window must transition to expired with no action taken."""
        stale_incident = dict(self.test_incident)
        stale_incident["incident_id"] = "inc-stale-002"
        stale_incident["created_epoch"] = time.time() - 400 # 400 seconds ago

        self.store.save_incident(stale_incident)
        expired_ids = self.store.check_expirations(timeout_seconds=300)

        self.assertIn("inc-stale-002", expired_ids)
        stale_rec = self.store.get_incident("inc-stale-002")
        self.assertEqual(stale_rec["status"], "expired")
        self.assertEqual(stale_rec["approval"]["decision"], "expired")
        self.assertEqual(len(stale_rec["execution_log"]), 0)

    def test_approval_authorizes_scoped_execution(self) -> None:
        """Explicit approval must execute the action under dry-run and run verification."""
        self.store.save_incident(self.test_incident)

        approved = self.store.approve_and_execute(
            incident_id="inc-test-001",
            action_ids=["ACT_BLOCK_SOURCE_IP"],
            decided_by="Operator Bob",
            comment="Confirmed brute force attack. Authorized block.",
            dry_run=True,
        )

        self.assertEqual(approved["status"], "verified")
        self.assertEqual(approved["approval"]["decision"], "approved")
        self.assertEqual(len(approved["execution_log"]), 1)
        self.assertTrue(approved["execution_log"][0]["dry_run"])
        self.assertIn("netsh advfirewall", approved["execution_log"][0]["command"])
        self.assertIsNotNone(approved["verification_result"])
        self.assertTrue(approved["verification_result"]["verified"])

    def test_guardrails_veto_protected_targets(self) -> None:
        """Guardrail layer must reject actions targeting protected hosts or IPs."""
        playbook = BlockIPPlaybook()

        # Targeting localhost / hub host
        with self.assertRaises(PlaybookSafetyVeto):
            playbook.execute(target_host="127.0.0.1", params={"src_ip": "198.51.100.45"})

        # Targeting protected IP allowlist
        with self.assertRaises(PlaybookSafetyVeto):
            playbook.execute(target_host="host-laptop-02", params={"src_ip": "127.0.0.1"})

    def test_rollback_reverts_state(self) -> None:
        """Rollback must revert executed rules and update status to rolled_back."""
        self.store.save_incident(self.test_incident)
        self.store.approve_and_execute(
            incident_id="inc-test-001",
            decided_by="Operator",
            dry_run=True,
        )

        rolled_back = self.store.rollback_action(
            incident_id="inc-test-001",
            decided_by="Operator",
            dry_run=True,
        )

        self.assertEqual(rolled_back["status"], "rolled_back")
        # Rollback log appended
        self.assertEqual(len(rolled_back["execution_log"]), 2)
        self.assertEqual(rolled_back["execution_log"][1]["status"], "rolled_back")


if __name__ == "__main__":
    unittest.main()
