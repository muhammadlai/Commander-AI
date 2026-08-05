import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Users,
  FolderGit2, 
  Activity, 
  Settings, 
  UserCircle, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  FileText,
  Workflow,
  Layers,
  Wrench,
  Brain,
  Puzzle,
  Globe
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { NavView } from '../types';

export type { NavView };

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenCommanderNotice: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenCommanderNotice,
  collapsed,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'commander', label: 'Commander CEO', icon: Bot, isPhase12: true },
    { id: 'google-workspace', label: 'Google Workspace', icon: Globe, badge: 'OAuth 2.0' },
    { id: 'github-workspace', label: 'GitHub Workspace', icon: FolderGit2, badge: 'GitHub API' },
    { id: 'repository-center', label: 'Repository Center', icon: FolderGit2, badge: 'Code Health' },
    { id: 'plugin-center', label: 'Plugin Center', icon: Puzzle, badge: 'Extensible' },
    { id: 'tool-center', label: 'Tool Engine', icon: Wrench, badge: '8 Tools' },
    { id: 'memory-center', label: 'Memory Center', icon: Brain, badge: 'Indexed' },
    { id: 'workspace', label: 'Workspace', icon: Layers, badge: 'Files' },
    { id: 'command-center', label: 'Command Center', icon: Workflow, badge: 'CEO Engine' },
    { id: 'agent-center', label: 'Agent Center', icon: Users, badge: '8 Agents' },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'notes', label: 'Notes & Tasks', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <aside
      id="commander-sidebar"
      className={`relative flex flex-col justify-between h-screen bg-slate-950 text-slate-200 border-r border-slate-800 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Bot className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold tracking-wider text-slate-100 text-base leading-none">
                  COMMANDER <span className="text-cyan-400 font-extrabold">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest mt-1 uppercase">
                  OS Foundation v1.1
                </span>
              </div>
            )}
          </div>
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5 mt-2" id="sidebar-nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isCommander = item.id === 'commander';
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => {
                  onSelectView(item.id as NavView);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                    : isCommander
                    ? 'text-cyan-300 hover:bg-slate-900 hover:text-cyan-200'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : isCommander ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {/* Commander Active Badge */}
                {!collapsed && isCommander && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/80 uppercase font-bold animate-pulse">
                    AI ACTIVE
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                    {item.label} {isCommander ? '(AI Active)' : ''}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] mb-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Phase 1.1 Ready
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-slate-500 text-[11px] leading-tight">
              Enterprise Foundation Core Active.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="System Phase 1.1 Active"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
