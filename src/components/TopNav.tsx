import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  CheckCircle2, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ThemeMode } from '../types';

interface TopNavProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAuthModal: () => void;
  onSelectView: (view: 'profile' | 'settings' | 'activity') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  theme,
  onToggleTheme,
  onOpenAuthModal,
  onSelectView,
}) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Phase 1.1 Foundation initialized', time: 'Just now', type: 'system' },
    { id: 2, text: 'PostgreSQL DB models registered', time: '10m ago', type: 'database' },
    { id: 3, text: 'OAuth Session validation active', time: '1h ago', type: 'auth' },
  ];

  return (
    <header id="commander-topnav" className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Search Bar & Phase Badge */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="topnav-search-input"
            type="text"
            placeholder="Search projects, logs, schemas, system settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-12 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Phase Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 font-mono text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          PHASE 1.1 ONLINE
        </div>

        {/* Dark/Light Quick Switch */}
        <button
          id="btn-toggle-theme-top"
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-topnav-notifications"
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-400 font-mono">
                  System Logs & Notifications
                </h4>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full font-mono border border-cyan-800/50">
                  3 New
                </span>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-slate-200 text-xs leading-snug">{n.text}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  onSelectView('activity');
                }}
                className="w-full mt-3 py-1.5 text-center text-xs text-cyan-400 hover:text-cyan-300 font-medium border-t border-slate-800/80 block"
              >
                View Full Activity Log →
              </button>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        {user ? (
          <div className="relative">
            <button
              id="btn-topnav-user-menu"
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</span>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">{user.provider} Auth</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-200">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-slate-100">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 bg-slate-800 text-cyan-400 rounded border border-slate-700">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSelectView('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 text-left transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  User Profile
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSelectView('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 text-left transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Settings & Security
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 text-left transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            id="btn-topnav-login"
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <LogIn className="w-4 h-4" />
            Sign In (OAuth)
          </button>
        )}
      </div>
    </header>
  );
};
