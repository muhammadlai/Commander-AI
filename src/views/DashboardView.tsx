import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Activity, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Server,
  Terminal,
  Clock,
  ExternalLink,
  MessageSquare,
  Pin,
  Plus,
  Zap,
  Calendar,
  Trash2,
  Users
} from 'lucide-react';
import { CommanderAvatar } from '../components/CommanderAvatar';
import { QuickStatsCard } from '../components/QuickStatsCard';
import { useCommander } from '../hooks/useCommander';
import { useAuth } from '../auth/AuthContext';
import { apiService } from '../services/apiService';
import { agentService } from '../services/agentService';
import { Conversation, PinnedNote } from '../types';
import { NavView } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigateView: (view: NavView) => void;
  onOpenCommanderNotice: () => void;
  onOpenAuthModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateView,
  onOpenCommanderNotice,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const { projects, activityLogs, metrics } = useCommander();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Good Morning');

  const [recentChats, setRecentChats] = useState<Conversation[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Update real-time clock and greeting
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      
      let g = 'Good Morning';
      if (hours >= 12 && hours < 17) g = 'Good Afternoon';
      else if (hours >= 17) g = 'Good Evening';
      setGreeting(g);

      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load chats & notes
  useEffect(() => {
    async function loadData() {
      const convs = await apiService.getConversations();
      setRecentChats(convs.slice(0, 3));

      const notes = await apiService.getPinnedNotes();
      setPinnedNotes(notes);
    }
    loadData();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const updated = await apiService.addNote(newNoteTitle.trim(), newNoteContent.trim() || 'No detail content added.');
    setPinnedNotes(updated);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const handleDeleteNote = async (id: string) => {
    const updated = await apiService.deleteNote(id);
    setPinnedNotes(updated);
  };

  const userName = user?.name || 'Aitzaz';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-dashboard">
      
      {/* Top Greeting & Live Clock Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
                <Bot className="w-3.5 h-3.5" /> COMMANDER AI ONLINE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {currentTime}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {currentDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-400">{userName}.</span>
            </h1>

            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Commander AI is initialized and ready to write code, manage tasks, and optimize your systems.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <CommanderAvatar
              state="idle"
              size="lg"
              showStatusLabel={true}
              onClick={() => onNavigateView('commander')}
            />

            <div className="flex flex-col gap-2">
              <button
                id="btn-hero-launch-commander"
                onClick={() => onNavigateView('commander')}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Bot className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Start AI Chat
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateView('projects')}
                className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                Projects ({projects.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-cyan-400" /> Quick Actions
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateView('commander')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Ask Commander
          </button>
          <button
            onClick={() => onNavigateView('agent-center')}
            className="px-3 py-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-violet-400" /> Agent Center
          </button>
          <button
            onClick={() => onNavigateView('projects')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> New Project
          </button>
          <button
            onClick={() => onNavigateView('activity')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> System Audit
          </button>
        </div>
      </div>

      {/* AI CEO Agent Operations Widget */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold uppercase">
                8 SPECIALIST AGENTS REGISTERED
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                COMMANDER CEO ACTIVE
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-100">AI CEO Specialist Agent Workforce</h3>
            <p className="text-xs text-slate-300 mt-1">
              Atlas (PM), Nova (Research), Forge (Dev), Titan (Sales), Vault (Memory), Echo (Calls), Orbit (Automation), Sentinel (Security).
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateView('agent-center')}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 group cursor-pointer shrink-0"
        >
          Manage Agent Operations
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Telemetry Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatsCard
          title="CPU Telemetry"
          value={`${metrics.cpuUsage}%`}
          subtitle="Container Load Normal"
          icon={<Cpu className="w-5 h-5 text-cyan-400" />}
          trend="Optimal"
          trendDirection="up"
        />
        <QuickStatsCard
          title="Memory Footprint"
          value={`${metrics.memoryUsage} MB`}
          subtitle="Allocated Engine RAM"
          icon={<Server className="w-5 h-5 text-indigo-400" />}
          trend="-12 MB"
          trendDirection="up"
        />
        <QuickStatsCard
          title="Active Projects"
          value={projects.length}
          subtitle="Indexed Microservices"
          icon={<Layers className="w-5 h-5 text-emerald-400" />}
          trend="+1 Added"
          trendDirection="up"
        />
        <QuickStatsCard
          title="Commander State"
          value="Active"
          subtitle="Personal Assistant Ready"
          icon={<Bot className="w-5 h-5 text-cyan-400 animate-pulse" />}
          trend="Online"
          trendDirection="up"
        />
      </div>

      {/* Main Grid: Recent Chats & Pinned Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Chats Section */}
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" /> Recent AI Chats
            </h3>
            <button
              onClick={() => onNavigateView('commander')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Open Commander →
            </button>
          </div>

          <div className="space-y-3">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onNavigateView('commander')}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 mt-0.5 group-hover:scale-110 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {chat.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {chat.messages[chat.messages.length - 1]?.text || 'No messages yet.'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Notes Section */}
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Pin className="w-5 h-5 text-amber-400" /> Pinned System Notes
            </h3>
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Note
            </button>
          </div>

          {/* Add Note Form */}
          {isAddingNote && (
            <form onSubmit={handleAddNote} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <input
                type="text"
                placeholder="Note Title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
              <textarea
                placeholder="Content detail..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 group relative space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{note.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60">
                      {note.category}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Projects Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Registered System Projects
            </h3>
            <p className="text-xs text-slate-400">Microservice registry for Commander AI orchestration</p>
          </div>
          <button
            onClick={() => onNavigateView('projects')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            Manage All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {projects.slice(0, 4).map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-100">{proj.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50 uppercase">
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{proj.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.slice(0, 2).map((tech) => (
                    <span key={tech} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                {proj.repositoryUrl && (
                  <a
                    href={proj.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
