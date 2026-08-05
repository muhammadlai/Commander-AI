import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Power, 
  Play, 
  Square, 
  Zap, 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  ChevronRight,
  Terminal,
  FileCode,
  SearchCode,
  Briefcase,
  Database,
  PhoneCall,
  Share2,
  Lock
} from 'lucide-react';
import { SubAgent, SubAgentId, AgentStatus, AgentTaskDelegation } from '../types';
import { agentService } from '../services/agentService';

export const AgentCenterView: React.FC = () => {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [delegations, setDelegations] = useState<AgentTaskDelegation[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<SubAgentId | null>(null);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [testPrompt, setTestPrompt] = useState('');
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAgents(agentService.getAgents());
    setDelegations(agentService.getDelegations());
  };

  const handleToggleEnable = (id: SubAgentId) => {
    const updated = agentService.toggleAgentEnabled(id);
    setAgents(updated);
  };

  const handleToggleStatus = (id: SubAgentId, currentStatus: AgentStatus) => {
    const nextStatus: AgentStatus = currentStatus === 'Online' ? 'Offline' : 'Online';
    const updated = agentService.setAgentStatus(id, nextStatus);
    setAgents(updated);
  };

  const handleRunGlobalHealthCheck = () => {
    setIsDiagnosticRunning(true);
    setTimeout(() => {
      const updated = agentService.runHealthCheck();
      setAgents(updated);
      setIsDiagnosticRunning(false);
    }, 1200);
  };

  const handleRunSingleAgentHealth = (id: SubAgentId) => {
    const updated = agentService.runHealthCheck(id);
    setAgents(updated);
  };

  const handleExecuteSimulatedTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;

    setIsExecutingTest(true);
    setTestResult('Commander analyzing request & routing to specialist agent...');

    try {
      const result = await agentService.executeDelegatedTask(testPrompt, (status, text) => {
        setTestResult(`[${status.toUpperCase()}] ${text}`);
      });

      setTestResult(`✅ Task delegated to ${result.agent.name} (${result.agent.role}). Result: ${result.responseText}`);
      setTestPrompt('');
      refreshData();
    } catch {
      setTestResult('Task execution failed.');
    } finally {
      setIsExecutingTest(false);
    }
  };

  // Color helper mappings for borders, glow, and badges
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          bg: 'bg-cyan-950/40',
          text: 'text-cyan-400',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
          badge: 'bg-cyan-950 text-cyan-400 border-cyan-800',
          bar: 'bg-cyan-400',
        };
      case 'violet':
        return {
          border: 'border-violet-500/40 hover:border-violet-400',
          bg: 'bg-violet-950/40',
          text: 'text-violet-400',
          glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
          badge: 'bg-violet-950 text-violet-400 border-violet-800',
          bar: 'bg-violet-400',
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          bg: 'bg-emerald-950/40',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          badge: 'bg-emerald-950 text-emerald-400 border-emerald-800',
          bar: 'bg-emerald-400',
        };
      case 'amber':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          bg: 'bg-amber-950/40',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
          badge: 'bg-amber-950 text-amber-400 border-amber-800',
          bar: 'bg-amber-400',
        };
      case 'rose':
        return {
          border: 'border-rose-500/40 hover:border-rose-400',
          bg: 'bg-rose-950/40',
          text: 'text-rose-400',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
          badge: 'bg-rose-950 text-rose-400 border-rose-800',
          bar: 'bg-rose-400',
        };
      case 'sky':
        return {
          border: 'border-sky-500/40 hover:border-sky-400',
          bg: 'bg-sky-950/40',
          text: 'text-sky-400',
          glow: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]',
          badge: 'bg-sky-950 text-sky-400 border-sky-800',
          bar: 'bg-sky-400',
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/40 hover:border-indigo-400',
          bg: 'bg-indigo-950/40',
          text: 'text-indigo-400',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
          badge: 'bg-indigo-950 text-indigo-400 border-indigo-800',
          bar: 'bg-indigo-400',
        };
      case 'red':
      default:
        return {
          border: 'border-red-500/40 hover:border-red-400',
          bg: 'bg-red-950/40',
          text: 'text-red-400',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
          badge: 'bg-red-950 text-red-400 border-red-800',
          bar: 'bg-red-400',
        };
    }
  };

  const getAgentIcon = (id: SubAgentId) => {
    switch (id) {
      case 'atlas': return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'nova': return <SearchCode className="w-5 h-5 text-violet-400" />;
      case 'forge': return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'titan': return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'vault': return <Database className="w-5 h-5 text-rose-400" />;
      case 'echo': return <PhoneCall className="w-5 h-5 text-sky-400" />;
      case 'orbit': return <Share2 className="w-5 h-5 text-indigo-400" />;
      case 'sentinel': return <Lock className="w-5 h-5 text-red-400" />;
      default: return <Cpu className="w-5 h-5 text-cyan-400" />;
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'Online':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Online</span>;
      case 'Busy':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>Busy</span>;
      case 'Thinking':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>Thinking</span>;
      case 'Disabled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900 text-slate-500 border border-slate-800">Disabled</span>;
      case 'Offline':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-950 text-slate-400 border border-slate-800">Offline</span>;
    }
  };

  // Filtered Agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === 'online') return matchesSearch && agent.status === 'Online';
    if (filterCategory === 'busy') return matchesSearch && (agent.status === 'Busy' || agent.status === 'Thinking');
    if (filterCategory === 'disabled') return matchesSearch && !agent.isEnabled;
    return matchesSearch;
  });

  const activeAgentsCount = agents.filter(a => a.isEnabled && a.status === 'Online').length;
  const busyAgentsCount = agents.filter(a => a.status === 'Busy' || a.status === 'Thinking').length;
  const totalCompletedTasks = agents.reduce((sum, a) => sum + a.completedTasksCount, 0);
  const avgHealth = Math.round(agents.reduce((sum, a) => sum + a.health, 0) / (agents.length || 1));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-agent-center">
      
      {/* Operations Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI CEO ORCHESTRATION HUB
            </span>
            <span className="text-xs font-mono text-slate-400">Phase 2.1 Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Agent Operations Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Commander receives all user requests and delegates task execution to specialized agents. The user never chats directly with sub-agents.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunGlobalHealthCheck}
            disabled={isDiagnosticRunning}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin text-cyan-400' : ''}`} />
            {isDiagnosticRunning ? 'Running Diagnostics...' : 'Run Global Health Check'}
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Active Agents</span>
            <div className="text-2xl font-black text-slate-100 mt-1 flex items-baseline gap-2">
              {activeAgentsCount} <span className="text-xs font-mono text-slate-500">/ {agents.length} Registered</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Currently Processing</span>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-baseline gap-2">
              {busyAgentsCount} <span className="text-xs font-mono text-slate-500">In Task Execution</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950 border border-amber-800 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Avg System Health</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-2">
              {avgHealth}% <span className="text-xs font-mono text-slate-500">Nominal</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Total Delegations</span>
            <div className="text-2xl font-black text-violet-400 mt-1 flex items-baseline gap-2">
              {totalCompletedTasks} <span className="text-xs font-mono text-slate-500">Tasks Executed</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-violet-950 border border-violet-800 text-violet-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Simulated Delegation Test Trigger */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Test Commander Decision Engine Delegation
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Directly routes prompts to specialist agent</span>
        </div>

        <form onSubmit={handleExecuteSimulatedTest} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. Forge, write a typescript validation function OR Nova, research market trends..."
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            disabled={isExecutingTest}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            type="submit"
            disabled={isExecutingTest || !testPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isExecutingTest ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
            Delegate Task
          </button>
        </form>

        {testResult && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed animate-fadeIn">
            {testResult}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter agents by name, role, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Agents' },
            { id: 'online', label: 'Online Only' },
            { id: 'busy', label: 'Processing' },
            { id: 'disabled', label: 'Disabled' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* AGENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAgents.map((agent) => {
          const colors = getColorClasses(agent.color);
          const icon = getAgentIcon(agent.id);

          return (
            <div
              key={agent.id}
              className={`p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border ${colors.border} ${colors.glow} transition-all duration-300 relative flex flex-col justify-between group hover:-translate-y-1`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                        {icon}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {agent.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 block">
                        {agent.role}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(agent.status)}
                </div>

                {/* Health Meter Bar */}
                <div className="space-y-1 my-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Agent Health</span>
                    <span className={`font-bold ${colors.text}`}>{agent.health}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} transition-all duration-500`}
                      style={{ width: `${agent.health}%` }}
                    ></div>
                  </div>
                </div>

                {/* Description & Specialty */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                  {agent.description}
                </p>

                {/* Capabilities Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-slate-400"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Current Active Task if Busy */}
                {agent.currentTask && (
                  <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[11px] font-mono mb-4 flex items-center gap-2 animate-pulse">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Active: {agent.currentTask}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                
                <div className="flex items-center gap-2">
                  {/* Start/Stop Toggle */}
                  <button
                    onClick={() => handleToggleStatus(agent.id, agent.status)}
                    disabled={!agent.isEnabled}
                    className={`p-2 rounded-xl border transition-all ${
                      agent.status === 'Online'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-200'
                    } disabled:opacity-40 cursor-pointer`}
                    title={agent.status === 'Online' ? "Pause Agent" : "Start Agent"}
                  >
                    <Power className="w-3 h-3" />
                  </button>

                  {/* Single Health Check */}
                  <button
                    onClick={() => handleRunSingleAgentHealth(agent.id)}
                    disabled={!agent.isEnabled}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-all disabled:opacity-40 cursor-pointer"
                    title="Health Diagnostic"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                {/* Enable/Disable Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] font-mono text-slate-400">
                    {agent.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={agent.isEnabled}
                    onChange={() => handleToggleEnable(agent.id)}
                    className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  />
                </label>

              </div>
            </div>
          );
        })}
      </div>

      {/* TASK DELEGATION HISTORY LOGS */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> Commander Delegation Execution History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of tasks Commander routed to specialist agents and completed outputs.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{delegations.length} Logs</span>
        </div>

        <div className="space-y-3">
          {delegations.map((del) => {
            const agent = agents.find(a => a.id === del.agentId);
            const colors = getColorClasses(agent?.color || 'cyan');

            return (
              <div
                key={del.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${colors.badge}`}>
                      {agent?.name || del.agentId} ({agent?.role || 'Agent'})
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-100">{del.taskTitle}</h4>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {new Date(del.delegatedAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/50 text-xs text-slate-300 font-mono">
                  <span className="text-slate-500 block mb-1">User Query: "{del.userQuery}"</span>
                  <span className="text-cyan-300">{del.resultSummary || 'Task completed successfully.'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
