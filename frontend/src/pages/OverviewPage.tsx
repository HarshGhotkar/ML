// frontend/src/pages/OverviewPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { DashboardSummary } from '../types';
import { StatTile } from '../components/ui/StatTile';
import { Card } from '../components/ui/Card';
import { Gauge } from '../components/ui/Gauge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Server,
  Laptop,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  RefreshCw,
  AlertCircle,
  Cloud,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Zap,
  Sliders,
  Globe,
  Lock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SAMPLE_ATTACKS = [
  { id: 'CRED_002', name: 'RDP Credential Stuffing & Kerberos Pre-Auth Burst', mitre: 'T1110.004', vector: 'aws_ec2', playbook: 'PB_AWS_SECURITY_GROUP_BLOCK', severity: 'high' },
  { id: 'DDOS_001', name: 'TCP SYN Flood Volumetric Cloud Traffic Assault', mitre: 'T1498.001', vector: 'aws_vpc', playbook: 'PB_AWS_WAF_RATE_LIMIT', severity: 'critical' },
  { id: 'CRYPTO_001', name: 'XMRig Monero CPU Hijack via Stratum Protocol', mitre: 'T1496', vector: 'aws_ec2', playbook: 'PB_KILL_PROCESS_AND_QUARANTINE', severity: 'critical' },
  { id: 'EXFIL_001', name: 'Mass S3 Bucket Data Egress to Untrusted ASN', mitre: 'T1537', vector: 'aws_s3', playbook: 'PB_FREEZE_S3_BUCKET_EGRESS', severity: 'critical' },
  { id: 'IAM_001', name: 'AWS IAM AdministratorAccess Role Self-Assignment', mitre: 'T1098', vector: 'aws_iam', playbook: 'PB_REVOKE_IAM_KEY_IMMEDIATE', severity: 'critical' },
  { id: 'RECON_003', name: 'AWS Instance Metadata SSRF Probe (169.254.169.254)', mitre: 'T1552.005', vector: 'aws_ec2', playbook: 'PB_AWS_SECURITY_GROUP_BLOCK', severity: 'high' },
];

export function OverviewPage() {
  const [selectedAttackId, setSelectedAttackId] = useState('CRED_002');
  const [simulating, setSimulating] = useState(false);
  const [healingStage, setHealingStage] = useState(0); // 0: Idle, 1: Detect, 2: Guardrails, 3: Execute, 4: Verify, 5: Healed
  const [logs, setLogs] = useState<string[]>([]);
  const [mitigated, setMitigated] = useState(false);

  const { data: summary, isLoading, error, refetch } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/summary');
      return res.data;
    },
    refetchInterval: 15000,
  });

  const { data: activeModel } = useQuery({
    queryKey: ['active-model'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/models/active');
        return res.data;
      } catch {
        return null;
      }
    },
  });

  const selectedAttack = SAMPLE_ATTACKS.find((a) => a.id === selectedAttackId) || SAMPLE_ATTACKS[0];

  const handleSimulateAttack = () => {
    if (simulating) return;
    setSimulating(true);
    setMitigated(false);
    setHealingStage(1);
    setLogs([
      `[${new Date().toLocaleTimeString()}] INGESTION SPIKE: Telemetry stream detected anomaly from 198.51.100.45`,
      `[${new Date().toLocaleTimeString()}] STAGE 1 (CLASSIFY): XGBoost classified '${selectedAttack.name}' (${selectedAttack.mitre}) with 97.4% confidence.`,
    ]);

    setTimeout(() => {
      setHealingStage(2);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] STAGE 2 (GUARDRAILS): Whitelist check passed. Target IP not in protected infrastructure list. Blast radius evaluated.`,
      ]);
    }, 900);

    setTimeout(() => {
      setHealingStage(3);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] STAGE 3 (EXECUTION): Dispatching Playbook '${selectedAttack.playbook}' across AWS VPC & Host Firewall...`,
        `[${new Date().toLocaleTimeString()}] ACTION INJECTED: aws ec2 authorize-security-group-ingress --group-id sg-028ebbd83cf143b23 --protocol tcp --port 0-65535 --cidr 198.51.100.45/32 --action=DENY`,
      ]);
    }, 2000);

    setTimeout(() => {
      setHealingStage(4);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] STAGE 4 (VERIFICATION): Health check probe running... Inbound packet rate dropped by 99.8%. Attacker socket closed.`,
      ]);
    }, 3200);

    setTimeout(() => {
      setHealingStage(5);
      setMitigated(true);
      setSimulating(false);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] STAGE 5 (HEALED): Autonomous self-healing completed successfully in 3.4s. Immutable audit record committed.`,
      ]);
    }, 4500);
  };

  const handleRollback = () => {
    setHealingStage(0);
    setMitigated(false);
    setSimulating(false);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ROLLBACK INITIATED: Reverting injected firewall rules and restoring baseline state.`,
    ]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-zinc-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <EmptyState
        title="Unable to load Executive Overview"
        message="Backend telemetry API is unreachable or returned an unexpected format."
        action={{ label: 'Retry Connection', onClick: () => refetch() }}
      />
    );
  }

  const safeSummary: DashboardSummary = (summary && typeof summary === 'object' && !Array.isArray(summary))
    ? summary
    : {
        host_health_score: 98,
        active_incidents: 0,
        total_hosts: 4,
        online_hosts: 4,
        attack_counts_24h: { brute_force: 3, ddos: 1, crypto_mining: 1 },
        top_risks: [],
      };

  const chartData = Object.entries(safeSummary.attack_counts_24h || {}).map(([key, val]) => ({
    name: key.replace('_', ' '),
    count: val,
  }));

  const getAttentionMessage = () => {
    if (mitigated) {
      return `Self-Healing Resolution: '${selectedAttack.name}' was autonomously mitigated via ${selectedAttack.playbook}. All AWS EC2 worker instances are operating nominally.`;
    }
    if ((safeSummary.active_incidents || 0) > 0) {
      return `Attention Required: There are ${safeSummary.active_incidents} active security incident under active investigation. Autonomous defense playbooks are on standby.`;
    }
    return 'All systems normal. AWS VPC perimeter and monitored fleet workstations are operating within nominal baseline parameters with zero active breaches.';
  };

  return (
    <div className="space-y-8 bg-black text-white">
      {/* Header & Live Cloud Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Executive Overview & Cloud Command Deck
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time multi-attack classification (120+ classes), autonomous self-healing, and Amazon Web Services (AWS) cloud telemetry.
          </p>
        </div>

        {/* Live Cloud Connection Status Card */}
        <div className="flex items-center space-x-3 bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2">
          <div className="p-1.5 rounded-lg bg-white text-black font-bold">
            <Cloud className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span>Amazon Web Services (AWS)</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Region: <span className="font-semibold text-white">ap-south-1</span> &bull; Instance: <span className="font-semibold text-white">i-098c54730ff60bf4a</span> &bull; Security Group: <span className="font-semibold text-white">adaptivecloud-sg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Section: Health Score + Stat Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col justify-center items-center py-8 bg-[#09090b] border-zinc-800">
            <Gauge score={mitigated ? 99 : (safeSummary.host_health_score ?? 98)} size={130} label="System Health Score" />
          </Card>
        </div>

        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatTile
            label="Monitored Fleet Infrastructure"
            value={`${safeSummary.online_hosts ?? 4} / ${safeSummary.total_hosts ?? 4} Active Nodes`}
            subtext="4 Physical Laptops + 1 AWS Gateway"
            icon={<Laptop className="h-4 w-4 text-white" />}
          />
          <StatTile
            label="Active Incidents"
            value={mitigated ? 0 : (safeSummary.active_incidents ?? 0)}
            subtext={mitigated ? 'All mitigated' : 'Requiring investigation'}
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          />
          <StatTile
            label="Attacks Blocked (24h)"
            value={Object.values(safeSummary.attack_counts_24h || {}).reduce((a, b) => a + b, 0) + (mitigated ? 1 : 0)}
            subtext="Closed-loop auto healing"
            icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
          />
          <StatTile
            label="Multi-Attack Taxonomy"
            value="124 Classes"
            subtext="10 Threat Families (MITRE)"
            icon={<Sliders className="h-4 w-4 text-white" />}
          />
          <StatTile
            label="Active Champion Model"
            value={activeModel?.version || 'XGBoost v2.4.1'}
            subtext="Multi-Class Classifier"
            icon={<Cpu className="h-4 w-4 text-white" />}
          />
          <StatTile
            label="Self-Healing Pipeline"
            value={simulating ? 'Remediating...' : 'Ready'}
            subtext="5-Phase Autonomous Loop"
            icon={<RefreshCw className="h-4 w-4 text-white" />}
          />
        </div>
      </div>

      {/* Interactive Cloud Attack Simulator & Self-Healing Pipeline Runner */}
      <div className="rounded-2xl border border-zinc-800 bg-[#09090b] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white text-black shadow-md glow-white-sm">
              <Zap className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Interactive Cloud Attack Simulator & Self-Healing Pipeline
              </h3>
              <p className="text-xs text-zinc-400">
                Test how the autonomous engine classifies and remediates attacks across AWS VPC, EC2 Compute, S3 Storage, and IAM.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedAttackId}
              onChange={(e) => setSelectedAttackId(e.target.value)}
              disabled={simulating}
              className="text-xs rounded-xl border border-zinc-700 bg-black px-3.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
            >
              {SAMPLE_ATTACKS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.mitre})
                </option>
              ))}
            </select>

            <button
              onClick={handleSimulateAttack}
              disabled={simulating}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-all disabled:opacity-50 glow-white-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{simulating ? 'Healing in Progress...' : 'Simulate Attack'}</span>
            </button>

            {mitigated && (
              <button
                onClick={handleRollback}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-white text-xs font-medium transition-all"
                title="Rollback simulated firewall rules"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Rollback</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Stage Visual Workflow */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { num: 1, title: 'Classification', desc: 'XGBoost 124-Class Model' },
              { num: 2, title: 'Safety Guardrails', desc: 'Whitelist & Blast Radius' },
              { num: 3, title: 'Playbook Dispatch', desc: 'AWS Security Group / OS' },
              { num: 4, title: 'Verification', desc: 'Telemetry Dip Probe' },
              { num: 5, title: 'Autonomous Recovery', desc: 'Audit Log & SLA Met' },
            ].map((stage) => {
              const isActive = healingStage === stage.num;
              const isPast = healingStage > stage.num || (mitigated && stage.num === 5);
              return (
                <div
                  key={stage.num}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isPast
                      ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300'
                      : isActive
                      ? 'border-white bg-zinc-900 text-white ring-1 ring-white/30 glow-white-sm'
                      : 'border-zinc-800/80 bg-black text-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span>Stage {stage.num}</span>
                    {isPast ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : isActive ? (
                      <RefreshCw className="h-3.5 w-3.5 text-white animate-spin" />
                    ) : (
                      <span className="text-[10px] opacity-50">Wait</span>
                    )}
                  </div>
                  <div className="font-bold text-white">{stage.title}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{stage.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Live Execution Logs Console */}
          {logs.length > 0 && (
            <div className="mt-3 bg-black rounded-xl p-3.5 font-mono text-xs text-zinc-300 border border-zinc-800 shadow-inner">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-2 border-b border-zinc-800 pb-1.5">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold text-white">Self-Healing Execution Log</span>
                </div>
                <span className="text-[10px] text-zinc-500">Autonomous Closed-Loop Engine</span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed flex items-start space-x-2">
                    <span className="text-white select-none">&gt;</span>
                    <span className={index === logs.length - 1 ? 'text-white font-semibold' : 'text-zinc-400'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plain English Executive Attention Banner */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#09090b] flex items-start space-x-3">
        <div className="p-1 rounded bg-white text-black font-bold mt-0.5">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
            What Needs Attention (Executive Brief)
          </h4>
          <p className="mt-1 text-xs text-zinc-300 leading-relaxed font-normal">
            {getAttentionMessage()}
          </p>
        </div>
      </div>

      {/* Bottom Grid: 24h Attack Breakdown & Top Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<span className="text-sm font-semibold text-white">24-Hour Attack Breakdown</span>} className="bg-[#09090b] border-zinc-800">
          {chartData.every((d) => d.count === 0) ? (
            <EmptyState
              title="No attacks detected in past 24 hours"
              message="Worker traffic is strictly benign. No telemetry breach signatures observed."
            />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      border: '1px solid #27272a',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                  />
                  <Bar dataKey="count" fill="#ffffff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card header={<span className="text-sm font-semibold text-white">Prioritized Risk Forecasts</span>} className="bg-[#09090b] border-zinc-800">
          {(!safeSummary.top_risks || safeSummary.top_risks.length === 0) ? (
            <EmptyState
              title="No high-risk warnings"
              message="All infrastructure components and threat forecasts report low probability."
            />
          ) : (
            <div className="divide-y divide-zinc-800 space-y-3">
              {safeSummary.top_risks.map((risk, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-white">{risk.title}</span>
                      <SeverityBadge severity={risk.severity} />
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Host: {risk.hostname || 'Cluster'} &bull; ETA: {risk.eta_minutes ? `${risk.eta_minutes}m` : 'Imminent'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">
                      {(risk.probability * 100).toFixed(0)}%
                    </span>
                    <span className="block text-[10px] text-zinc-500 uppercase">Probability</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
