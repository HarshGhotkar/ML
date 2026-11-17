// frontend/src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  ShieldAlert,
  Search,
  TrendingUp,
  Wrench,
  ShieldCheck,
  BrainCircuit,
  FileSpreadsheet,
  Cloud,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Live Cloud Monitoring', path: '/monitoring', icon: Activity },
  { name: 'Attack Detection & Classification', path: '/detections', icon: ShieldAlert },
  { name: 'RCA & Cloud Self-Healing', path: '/rca', icon: Search },
  { name: 'Threat Prediction', path: '/predictions', icon: TrendingUp },
  { name: 'Predictive Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Autonomous Playbooks & Remediation', path: '/responses', icon: ShieldCheck },
  { name: 'ML & Adaptive Learning', path: '/learning', icon: BrainCircuit },
  { name: 'Reports & Audit Logs', path: '/reports', icon: FileSpreadsheet },
];

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#27272a] bg-black flex flex-col h-screen select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#27272a] space-x-3 bg-black">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shadow-md glow-white-sm">
          <Cloud className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-white">AdaptiveCloud</span>
          <span className="block text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Zero-Trust SecOps</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin bg-black">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md glow-white-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/90 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#27272a] bg-[#09090b]">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>AWS Region</span>
          <span className="text-white font-semibold">ap-south-1</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mt-1">
          <span>EC2 Core Node</span>
          <span className="text-white font-semibold">i-098c54730ff60bf4a</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mt-1">
          <span>Shield Mode</span>
          <span className="text-white font-semibold">Autonomous Active</span>
        </div>
      </div>
    </aside>
  );
}
