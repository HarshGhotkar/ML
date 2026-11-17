// frontend/src/components/layout/TopBar.tsx
import React from 'react';
import { Sun, Moon, LogOut, Shield } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useLiveChannel } from '../../hooks/useLiveChannel';
import { StatusDot } from '../ui/StatusDot';

export function TopBar() {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { status: wsStatus } = useLiveChannel('live');

  return (
    <header className="h-16 border-b border-[#27272a] bg-black px-6 flex items-center justify-between z-10 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-[#09090b] text-xs text-zinc-300">
          <StatusDot status={wsStatus === 'connected' ? 'online' : wsStatus === 'connecting' ? 'pending' : 'offline'} pulse={wsStatus === 'connected'} />
          <span className="capitalize font-mono text-[11px] text-white">
            {wsStatus === 'connected' ? 'Live Stream Active' : wsStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User profile & Role badge */}
        {user && (
          <div className="flex items-center space-x-3 pl-4 border-l border-zinc-800">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{user.username}</span>
              <div className="flex justify-end mt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-black">
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  {((user && user.role) ? user.role : 'ADMIN').toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
