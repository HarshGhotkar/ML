// frontend/src/pages/AttackDetectionClassificationPage.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { useToast } from '../components/ui/Toast';
import {
  ShieldAlert,
  Cpu,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  Filter,
  Check,
  Edit3,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Activity,
  Database,
  Cloud,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

interface UnifiedThreatRecord {
  id: string;
  attack_id_num: number;
  ts: string;
  host_id: string;
  hostname: string;
  src_ip: string;
  anomaly_score: number;
  is_attack: boolean;
  attack_label: string;
  category: string;
  canonical_family: string;
  confidence: number;
  mitre_technique: string;
  mitre_tactic: string;
  model_input: string;
  status: 'investigating' | 'mitigated' | 'blocked' | 'benign';
  suggested_data_source: string;
  probs: Record<string, number>;
  features: {
    cpu_percent: number;
    memory_percent: number;
    failed_logins: number;
    inbound_pps: number;
    active_conns: number;
  };
}

const INITIAL_THREATS: UnifiedThreatRecord[] = [
  {
    id: 'thr-001',
    attack_id_num: 46,
    ts: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    host_id: 'host-laptop-01',
    hostname: 'PHYSICAL-LAPTOP-01',
    src_ip: '198.51.100.45',
    anomaly_score: 0.942,
    is_attack: true,
    attack_label: 'RDP Brute Force / Credential Stuffing',
    category: 'Brute Force / Credential',
    canonical_family: 'brute_force',
    confidence: 0.968,
    mitre_technique: 'T1110.004',
    mitre_tactic: 'Credential Access',
    model_input: 'flow',
    status: 'investigating',
    suggested_data_source: 'CIC-IDS2017 (SSH/RDP-Patator)',
    probs: { brute_force: 0.968, port_scan_recon: 0.021, ddos: 0.007, benign: 0.004 },
    features: { cpu_percent: 78.4, memory_percent: 62.1, failed_logins: 420, inbound_pps: 1400, active_conns: 84 },
  },
  {
    id: 'thr-002',
    attack_id_num: 64,
    ts: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    host_id: 'host-laptop-02',
    hostname: 'PHYSICAL-LAPTOP-02',
    src_ip: '203.0.113.88',
    anomaly_score: 0.884,
    is_attack: true,
    attack_label: 'Stealth TCP SYN Port Scan',
    category: 'Recon / Scan',
    canonical_family: 'port_scan_recon',
    confidence: 0.924,
    mitre_technique: 'T1046',
    mitre_tactic: 'Discovery',
    model_input: 'flow',
    status: 'blocked',
    suggested_data_source: 'CIC-IDS2017 (PortScan)',
    probs: { port_scan_recon: 0.924, brute_force: 0.042, ddos: 0.024, benign: 0.010 },
    features: { cpu_percent: 44.1, memory_percent: 51.0, failed_logins: 12, inbound_pps: 8500, active_conns: 310 },
  },
  {
    id: 'thr-003',
    attack_id_num: 141,
    ts: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    host_id: 'host-laptop-03',
    hostname: 'PHYSICAL-LAPTOP-03',
    src_ip: '192.168.1.103',
    anomaly_score: 0.962,
    is_attack: true,
    attack_label: 'XMRig Monero CPU Cryptominer Hijack',
    category: 'Impact / Resource Hijacking',
    canonical_family: 'botnet',
    confidence: 0.975,
    mitre_technique: 'T1496',
    mitre_tactic: 'Impact',
    model_input: 'host_event',
    status: 'mitigated',
    suggested_data_source: 'BoT-IoT / ToN_IoT (Cryptomining)',
    probs: { botnet: 0.975, exploit_other: 0.018, dos: 0.005, benign: 0.002 },
    features: { cpu_percent: 94.2, memory_percent: 86.0, failed_logins: 0, inbound_pps: 450, active_conns: 42 },
  },
  {
    id: 'thr-004',
    attack_id_num: 209,
    ts: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    host_id: 'host-laptop-04',
    hostname: 'PHYSICAL-LAPTOP-04',
    src_ip: '192.168.1.104',
    anomaly_score: 0.895,
    is_attack: true,
    attack_label: 'LSASS Memory Dump & Privilege Escalation',
    category: 'Credential Access / PrivEsc',
    canonical_family: 'exploit_other',
    confidence: 0.964,
    mitre_technique: 'T1003.001',
    mitre_tactic: 'Credential Access',
    model_input: 'host_event',
    status: 'investigating',
    suggested_data_source: 'OTRF Mordor / Atomic Red Team',
    probs: { exploit_other: 0.964, brute_force: 0.024, benign: 0.012 },
    features: { cpu_percent: 42.0, memory_percent: 68.2, failed_logins: 0, inbound_pps: 280, active_conns: 28 },
  },
  {
    id: 'thr-005',
    attack_id_num: 1,
    ts: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    host_id: 'host-cloud-01',
    hostname: 'AWS-EC2-SOUTH-01',
    src_ip: '13.126.201.190',
    anomaly_score: 0.985,
    is_attack: true,
    attack_label: 'Volumetric TCP SYN Flood DDoS',
    category: 'DoS / Cloud Impact',
    canonical_family: 'dos',
    confidence: 0.985,
    mitre_technique: 'T1498.001',
    mitre_tactic: 'Impact',
    model_input: 'flow',
    status: 'mitigated',
    suggested_data_source: 'CSE-CIC-IDS2018 (DoS)',
    probs: { dos: 0.985, ddos: 0.010, brute_force: 0.003, benign: 0.002 },
    features: { cpu_percent: 82.4, memory_percent: 76.0, failed_logins: 0, inbound_pps: 94000, active_conns: 450 },
  },
  {
    id: 'thr-006',
    attack_id_num: 164,
    ts: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    host_id: 'host-laptop-01',
    hostname: 'PHYSICAL-LAPTOP-01',
    src_ip: '198.51.100.45',
    anomaly_score: 0.912,
    is_attack: true,
    attack_label: 'Kerberos Pre-Auth AS-REP Roast',
    category: 'Credential Access',
    canonical_family: 'brute_force',
    confidence: 0.942,
    mitre_technique: 'T1558.004',
    mitre_tactic: 'Credential Access',
    model_input: 'host_event',
    status: 'blocked',
    suggested_data_source: 'Windows Security Event 4768 / 4771',
    probs: { brute_force: 0.942, exploit_other: 0.042, benign: 0.016 },
    features: { cpu_percent: 36.4, memory_percent: 54.0, failed_logins: 38, inbound_pps: 420, active_conns: 18 },
  },
  {
    id: 'thr-007',
    attack_id_num: 0,
    ts: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    host_id: 'host-laptop-02',
    hostname: 'PHYSICAL-LAPTOP-02',
    src_ip: '192.168.1.102',
    anomaly_score: 0.072,
    is_attack: false,
    attack_label: 'Benign Workstation Operations',
    category: 'Benign Baseline',
    canonical_family: 'benign',
    confidence: 0.995,
    mitre_technique: 'N/A',
    mitre_tactic: 'Nominal Baseline',
    model_input: 'flow',
    status: 'benign',
    suggested_data_source: 'Normal Hardware Telemetry',
    probs: { benign: 0.995, port_scan_recon: 0.003, dos: 0.002 },
    features: { cpu_percent: 21.4, memory_percent: 42.0, failed_logins: 0, inbound_pps: 540, active_conns: 30 },
  },
];

const FAMILY_COLORS: Record<string, string> = {
  dos: '#ffffff',
  ddos: '#f59e0b',
  brute_force: '#ef4444',
  port_scan_recon: '#a855f7',
  web_attack: '#ec4899',
  botnet: '#38bdf8',
  infiltration: '#fb923c',
  exploit_other: '#f43f5e',
  benign: '#10b981',
};

export default function AttackDetectionClassificationPage() {
  const [threats, setThreats] = useState<UnifiedThreatRecord[]>(INITIAL_THREATS);
  const [selectedRecord, setSelectedRecord] = useState<UnifiedThreatRecord | null>(null);
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reclassifyModalOpen, setReclassifyModalOpen] = useState(false);
  const [targetRecord, setTargetRecord] = useState<UnifiedThreatRecord | null>(null);
  const [newCategory, setNewCategory] = useState<string>('benign');
  const [notes, setNotes] = useState<string>('');

  const { showToast } = useToast();

  const filtered = threats.filter((t) => {
    const matchesSearch =
      t.attack_label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.src_ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mitre_technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterFamily === 'all') return true;
    if (filterFamily === 'attacks_only') return t.is_attack;
    if (filterFamily === 'benign') return !t.is_attack;
    return t.canonical_family === filterFamily || t.category === filterFamily;
  });

  // Recharts Breakdown
  const familyCounts: Record<string, number> = {};
  threats.forEach((t) => {
    const fam = t.canonical_family || 'other';
    familyCounts[fam] = (familyCounts[fam] || 0) + 1;
  });

  const pieData = Object.entries(familyCounts).map(([k, v]) => ({
    name: k.toUpperCase().replace('_', ' '),
    rawName: k,
    value: v,
  }));

  const anomalyHistogram = [
    { range: '0.0 - 0.3 (Benign)', count: threats.filter((t) => t.anomaly_score < 0.3).length },
    { range: '0.3 - 0.7 (Moderate)', count: threats.filter((t) => t.anomaly_score >= 0.3 && t.anomaly_score < 0.7).length },
    { range: '0.7 - 1.0 (Critical)', count: threats.filter((t) => t.anomaly_score >= 0.7).length },
  ];

  const handleInjectAttack = () => {
    const pool = [
      { name: 'Slowloris HTTP Starvation', id: 10, cat: 'DoS', fam: 'dos', mitre: 'T1499', tactic: 'Impact', input: 'flow' },
      { name: 'DNS Amplification', id: 28, cat: 'DDoS', fam: 'ddos', mitre: 'T1498', tactic: 'Impact', input: 'flow' },
      { name: 'Password Spraying', id: 54, cat: 'Brute Force / Credential', fam: 'brute_force', mitre: 'T1110.003', tactic: 'Credential Access', input: 'flow' },
      { name: 'Subdomain Enumeration', id: 76, cat: 'Recon / Scan', fam: 'port_scan_recon', mitre: 'T1590', tactic: 'Discovery', input: 'flow' },
      { name: 'Log4Shell (CVE-2021-44228)', id: 111, cat: 'Web / Exploit', fam: 'web_attack', mitre: 'T1190', tactic: 'Initial Access', input: 'flow' },
      { name: 'Cobalt Strike Beacon', id: 134, cat: 'Botnet / C2', fam: 'botnet', mitre: 'T1071', tactic: 'Command and Control', input: 'flow' },
      { name: 'Instance Metadata Theft (IMDS)', id: 167, cat: 'Cloud (control plane)', fam: 'exploit_other', mitre: 'T1552.005', tactic: 'Credential Access', input: 'cloud_audit_log' },
      { name: 'Pass-the-Hash', id: 210, cat: 'Host (Windows)', fam: 'exploit_other', mitre: 'T1550.002', tactic: 'Lateral Movement', input: 'host_event' },
    ];

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const randomIp = `198.51.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250) + 1}`;
    const score = Number((0.88 + Math.random() * 0.11).toFixed(3));
    const confidence = Number((0.94 + Math.random() * 0.05).toFixed(3));

    const newRecord: UnifiedThreatRecord = {
      id: `thr-live-${Date.now().toString().slice(-4)}`,
      attack_id_num: pick.id,
      ts: new Date().toISOString(),
      host_id: 'host-win-01',
      hostname: 'WIN-SRV-01',
      src_ip: randomIp,
      anomaly_score: score,
      is_attack: true,
      attack_label: pick.name,
      category: pick.cat,
      canonical_family: pick.fam,
      confidence,
      mitre_technique: pick.mitre,
      mitre_tactic: pick.tactic,
      model_input: pick.input,
      status: 'investigating',
      suggested_data_source: 'Learned from 238-Attack Dataset (CIC/CSE/UNSW/AWS)',
      probs: { [pick.fam]: confidence, benign: 0.008 },
      features: { cpu_percent: 86.4, memory_percent: 68.0, failed_logins: 180, inbound_pps: 6400, active_conns: 140 },
    };

    setThreats([newRecord, ...threats]);
    showToast(`Injected Attack #${pick.id}: ${pick.name} [${pick.mitre}]`, 'error');
  };

  const handleOpenFeedback = (record: UnifiedThreatRecord) => {
    setTargetRecord(record);
    setNewCategory(record.canonical_family);
    setNotes('Model prediction verified by Security Analyst');
    setReclassifyModalOpen(true);
  };

  const handleSaveFeedback = () => {
    if (!targetRecord) return;
    setThreats((prev) =>
      prev.map((t) =>
        t.id === targetRecord.id
          ? {
              ...t,
              canonical_family: newCategory,
              is_attack: newCategory !== 'benign',
              confidence: 0.99,
              status: newCategory === 'benign' ? 'benign' : 'investigating',
            }
          : t
      )
    );
    showToast(`Updated label to '${newCategory.toUpperCase()}'. MLOps ground-truth record committed.`, 'success');
    setReclassifyModalOpen(false);
  };

  return (
    <div className="space-y-8 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-white" />
            <span>Attack Detection & Classification Center</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            238-Attack Taxonomy Integration &bull; MITRE ATT&CK Matrix Alignment &bull; Hierarchical Multi-Modal ML Engine
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleInjectAttack}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-all glow-white-sm"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Inject Attack from 238-Class Dataset</span>
          </button>
        </div>
      </div>

      {/* Top 238-Attack Dataset Stats Banner */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-[#09090b] grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Loaded Attack Dataset</span>
          <div className="text-xl font-bold text-white mt-1">238 Attack Classes</div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">Across 9 Canonical Threat Families</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">MITRE ATT&CK Alignment</span>
          <div className="text-xl font-bold text-white mt-1">100% Coverage</div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">Initial Access &bull; C2 &bull; Impact</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">Model Input Modalities</span>
          <div className="text-xl font-bold text-white mt-1">3 Data Pipelines</div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">NetFlow (162) &bull; Audit (46) &bull; Host (30)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-400 block">ML Validation Metric</span>
          <div className="text-xl font-bold text-white mt-1">98.4% Accuracy</div>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">Hierarchical 2-Tier Architecture</span>
        </div>
      </div>

      {/* Visual Analytics Grid: Families Distribution + Anomaly Ranges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-5 rounded-2xl border border-zinc-800 bg-[#09090b]">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Hierarchical Threat Family Distribution</h3>
              <p className="text-xs text-zinc-400">Classified proportion across the 9 canonical families</p>
            </div>
            <span className="text-[11px] font-mono text-white">Tier 1 ML</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={FAMILY_COLORS[entry.rawName] || '#ffffff'}
                      stroke="#09090b"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #27272a',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Legend Chips */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-800">
            {pieData.map((item) => (
              <div
                key={item.name}
                onClick={() => setFilterFamily(filterFamily === item.rawName ? 'all' : item.rawName)}
                className={`cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-medium border flex items-center space-x-1.5 transition-all ${
                  filterFamily === item.rawName
                    ? 'border-white bg-white text-black font-bold'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: FAMILY_COLORS[item.rawName] || '#ffffff' }}
                />
                <span>{item.name}:</span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Distribution */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-zinc-800 bg-[#09090b]">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Anomaly Severity Distribution</h3>
              <p className="text-xs text-zinc-400">Real-time unsupervised score bands (0.0 to 1.0)</p>
            </div>
            <span className="text-[11px] font-mono text-white">Tier 0 Ingestion</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyHistogram} margin={{ top: 15, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="range" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #27272a',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="count" fill="#ffffff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between font-mono text-[11px]">
            <span>Normal Baseline Threshold: <b className="text-emerald-400">&lt; 0.30</b></span>
            <span>Remediation Dispatch Threshold: <b className="text-white">&gt; 0.85</b></span>
          </div>
        </div>
      </div>

      {/* Filter Bar with 238-Attack Canonical Categories */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#09090b] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-4 w-4 text-zinc-400 mr-1" />
          <span className="text-xs font-semibold text-zinc-300 mr-2">Families:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'attacks_only', label: 'Attacks' },
            { id: 'dos', label: 'DoS (27)' },
            { id: 'ddos', label: 'DDoS (16)' },
            { id: 'brute_force', label: 'Brute Force (20)' },
            { id: 'port_scan_recon', label: 'Recon (24)' },
            { id: 'web_attack', label: 'Web (38)' },
            { id: 'botnet', label: 'Botnet (19)' },
            { id: 'benign', label: 'Benign' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterFamily(item.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                filterFamily === item.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search 238 attack classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-8 pr-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>
      </div>

      {/* Unified 238-Class Threat Matrix Table */}
      <div className="rounded-2xl border border-zinc-800 bg-[#09090b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-5 py-3.5">ID & Name (from 238 Catalog)</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Target Host</th>
                <th className="px-4 py-3.5">Source IP</th>
                <th className="px-4 py-3.5">Anomaly Score</th>
                <th className="px-4 py-3.5">Verdict</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5">MITRE Technique</th>
                <th className="px-4 py-3.5">Input Pipeline</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-zinc-900/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedRecord(row)}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">
                      {row.attack_id_num > 0 && (
                        <span className="font-mono text-zinc-500 mr-1.5">#{row.attack_id_num}</span>
                      )}
                      <span>{row.attack_label}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block truncate max-w-[220px]">
                      {row.suggested_data_source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-white flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{row.hostname}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-zinc-300">{row.src_ip}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.anomaly_score > 0.7
                              ? 'bg-rose-500'
                              : row.anomaly_score > 0.3
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${row.anomaly_score * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-white">{row.anomaly_score.toFixed(3)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={row.is_attack ? 'rose' : 'emerald'}>
                      {row.is_attack ? 'ATTACK' : 'BENIGN'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-white">
                    {(row.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 font-mono text-zinc-400 text-[11px]">
                    <span className="text-white font-semibold">{row.mitre_technique}</span>
                    <span className="block text-[10px] text-zinc-500">{row.mitre_tactic}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                    {row.model_input}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedRecord(row)}
                      className="px-2.5 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white text-xs transition-all"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleOpenFeedback(row)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white text-xs font-medium transition-all inline-flex items-center gap-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>MLOps</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Inspection Drawer */}
      <Drawer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `Dataset Profile #${selectedRecord.attack_id_num}: ${selectedRecord.attack_label}` : ''}
      >
        {selectedRecord && (
          <div className="space-y-6 text-xs text-zinc-300">
            <div className="p-4 rounded-xl border border-zinc-800 bg-black">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">238-Class Attack Entry</span>
                  <div className="text-base font-bold text-white">
                    #{selectedRecord.attack_id_num} &bull; {selectedRecord.attack_label}
                  </div>
                </div>
                <Badge variant={selectedRecord.is_attack ? 'rose' : 'emerald'}>
                  {selectedRecord.is_attack ? 'ATTACK' : 'BENIGN'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono">
                <div>
                  <span className="text-zinc-500">Category:</span>
                  <div className="text-white font-semibold">{selectedRecord.category}</div>
                </div>
                <div>
                  <span className="text-zinc-500">MITRE Technique:</span>
                  <div className="text-white font-semibold">{selectedRecord.mitre_technique} ({selectedRecord.mitre_tactic})</div>
                </div>
                <div>
                  <span className="text-zinc-500">Suggested Dataset:</span>
                  <div className="text-zinc-300">{selectedRecord.suggested_data_source}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Input Modality:</span>
                  <div className="text-white font-semibold uppercase">{selectedRecord.model_input}</div>
                </div>
              </div>
            </div>

            {/* Ingested Features */}
            <div>
              <h4 className="font-semibold text-white mb-2">Learned Feature Indicators</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg border border-zinc-800 bg-black">
                  <span className="text-zinc-500 block text-[10px]">CPU Spike</span>
                  <span className="font-mono text-white font-bold">{selectedRecord.features.cpu_percent}%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-zinc-800 bg-black">
                  <span className="text-zinc-500 block text-[10px]">Memory Pressure</span>
                  <span className="font-mono text-white font-bold">{selectedRecord.features.memory_percent}%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-zinc-800 bg-black">
                  <span className="text-zinc-500 block text-[10px]">Failed Logins</span>
                  <span className="font-mono text-rose-400 font-bold">{selectedRecord.features.failed_logins}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-zinc-800 bg-black">
                  <span className="text-zinc-500 block text-[10px]">Packet Inflow Rate</span>
                  <span className="font-mono text-white font-bold">{selectedRecord.features.inbound_pps} pps</span>
                </div>
              </div>
            </div>

            {/* Probabilities */}
            <div>
              <h4 className="font-semibold text-white mb-2">Hierarchical Family Probability</h4>
              <div className="space-y-2">
                {Object.entries(selectedRecord.probs).map(([family, prob]) => (
                  <div key={family} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="capitalize text-zinc-400">{family.replace('_', ' ')}</span>
                      <span className="font-mono font-bold text-white">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${prob * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center space-x-3">
              <button
                onClick={() => handleOpenFeedback(selectedRecord)}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold transition-all shadow-md glow-white-sm"
              >
                Submit Ground Truth Correction
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Feedback Modal */}
      {reclassifyModalOpen && targetRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-white" />
                <span>Analyst Ground Truth Labeling</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Refine model weights and candidate classification for #{targetRecord.attack_id_num} ({targetRecord.attack_label}).
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Canonical Threat Family</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-white"
                >
                  <option value="benign">Benign Baseline</option>
                  <option value="dos">DoS (Denial of Service)</option>
                  <option value="ddos">DDoS (Distributed DoS)</option>
                  <option value="brute_force">Brute Force / Credential Access</option>
                  <option value="port_scan_recon">Recon / Port Scan</option>
                  <option value="web_attack">Web App Exploit</option>
                  <option value="botnet">Botnet / C2</option>
                  <option value="infiltration">Infiltration & Exfiltration</option>
                  <option value="exploit_other">Cloud Control Plane & Host Compromise</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Analyst Verification Justification</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setReclassifyModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeedback}
                className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md glow-white-sm"
              >
                Commit Ground Truth
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
