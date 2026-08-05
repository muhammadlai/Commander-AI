import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  ShieldAlert, 
  Key, 
  Settings, 
  FolderGit2, 
  Terminal,
  Filter,
  MessageSquare,
  CheckSquare,
  FileText,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useCommander } from '../hooks/useCommander';
import { ActivityCategory } from '../types';

export const ActivityView: React.FC = () => {
  const { activityLogs } = useCommander();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'auth': return <Key className="w-4 h-4 text-cyan-400" />;
      case 'settings': return <Settings className="w-4 h-4 text-amber-400" />;
      case 'project': return <FolderGit2 className="w-4 h-4 text-emerald-400" />;
      case 'security': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'note': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'conversation': return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      default: return <Terminal className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (category: ActivityCategory) => {
    switch (category) {
      case 'auth': return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'settings': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'project': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'security': return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'task': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'note': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'conversation': return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      default: return 'bg-indigo-950 text-indigo-400 border-indigo-800';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-activity">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-indigo-400" />
            Commander System Activity Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual chronological timeline of system events, AI chats, task updates, note updates, and settings changes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>{activityLogs.length} Total Events Logged</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search timeline action, user, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'auth', 'settings', 'project', 'system', 'task', 'note', 'conversation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize whitespace-nowrap border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Activity Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl relative">
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 space-y-8">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative pl-6 sm:pl-8 group">
              
              {/* Node Icon Circle */}
              <div className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-800 group-hover:border-cyan-500 flex items-center justify-center shadow-lg transition-colors">
                {getCategoryIcon(log.category)}
              </div>

              {/* Event Content Card */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getCategoryBadgeClass(log.category)}`}>
                      {log.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{log.action}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                {log.details && (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                    {log.details}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-cyan-400" /> Logged by {log.userName}
                  </span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>

            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No matching activity events found for category filter "{categoryFilter}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
