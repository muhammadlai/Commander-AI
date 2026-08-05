import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Workflow, 
  Brain, 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Database, 
  Layers, 
  Plus, 
  RefreshCw, 
  Search, 
  Trash2, 
  ChevronRight, 
  Activity, 
  GitBranch, 
  ShieldCheck,
  Terminal,
  Code2,
  BookOpen,
  Send,
  Sliders
} from 'lucide-react';
import { 
  Workflow as WorkflowType, 
  WorkflowStep, 
  SharedMemoryEntry, 
  CommandHistoryItem, 
  SubAgent, 
  SubAgentId,
  WorkflowTaskType
} from '../types';
import { workflowService } from '../services/workflowService';
import { sharedMemoryService } from '../services/sharedMemoryService';
import { agentService } from '../services/agentService';
import { apiService } from '../services/apiService';
import { CommanderAvatar } from '../components/CommanderAvatar';

interface CommandCenterViewProps {
  onNavigateCommander: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ onNavigateCommander }) => {
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [memoryEntries, setMemoryEntries] = useState<SharedMemoryEntry[]>([]);
  const [agents, setAgents] = useState<SubAgent[]>([]);
  
  // Quick Prompt Input for Planning Engine
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Search and Filter states
  const [memorySearch, setMemorySearch] = useState('');
  const [selectedMemoryCategory, setSelectedMemoryCategory] = useState<string>('all');
  
  // Shared Memory Modal
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemVal, setNewMemVal] = useState('');
  const [newMemCategory, setNewMemCategory] = useState<SharedMemoryEntry['category']>('context');
  const [newMemTags, setNewMemTags] = useState('');

  const refreshData = () => {
    setWorkflows(workflowService.getWorkflows());
    setCommandHistory(workflowService.getCommandHistory());
    setMemoryEntries(sharedMemoryService.getMemory());
    setAgents(agentService.getAgents());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      setAgents(agentService.getAgents());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  // Trigger Commander Planning Engine & Execution
  const handleTriggerPlan = async (promptToRun?: string) => {
    const goalText = promptToRun || customGoalInput.trim();
    if (!goalText) return;

    setIsPlanning(true);
    setExecutionMessage('Commander AI CEO is decomposing goal into agent workflow steps...');

    try {
      // 1. Plan
      const newWf = workflowService.planWorkflow(goalText);
      setWorkflows(workflowService.getWorkflows());
      setActiveWorkflowId(newWf.id);
      setCustomGoalInput('');

      setExecutionMessage(`Workflow planned with ${newWf.steps.length} steps. Initiating agent execution chain...`);

      // 2. Execute
      await workflowService.executeWorkflow(
        newWf.id,
        (_updatedWf, _step) => {
          setWorkflows(workflowService.getWorkflows());
          setAgents(agentService.getAgents());
        },
        (id, status, task) => {
          agentService.setAgentStatus(id, status, task);
          setAgents(agentService.getAgents());
        }
      );

      refreshData();
      setExecutionMessage('Workflow completed successfully across all assigned agents.');
      setTimeout(() => setExecutionMessage(null), 4000);
    } catch (err: any) {
      setExecutionMessage(`Workflow execution failed: ${err.message}`);
    } finally {
      setIsPlanning(false);
    }
  };

  // Retry Failed Step
  const handleRetryStep = async (wfId: string, stepId: string) => {
    try {
      setExecutionMessage('Retrying step execution...');
      await workflowService.retryWorkflowStep(wfId, stepId, (id, status, task) => {
        agentService.setAgentStatus(id, status, task);
        setAgents(agentService.getAgents());
      });
      refreshData();
      setExecutionMessage('Step retried successfully.');
      setTimeout(() => setExecutionMessage(null), 3000);
    } catch (err: any) {
      setExecutionMessage(`Retry failed: ${err.message}`);
    }
  };

  // Add Shared Memory
  const handleSaveNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemKey || !newMemVal) return;

    const tagsArray = newMemTags.split(',').map(t => t.trim()).filter(Boolean);
    sharedMemoryService.writeMemory(
      newMemKey.trim().toLowerCase().replace(/\s+/g, '_'),
      newMemVal,
      newMemCategory,
      'commander',
      tagsArray,
      'User created memory entry via Command Center.'
    );

    refreshData();
    setNewMemKey('');
    setNewMemVal('');
    setNewMemTags('');
    setShowAddMemoryModal(false);
    apiService.logActivity('Added Shared Memory Entry', 'note', `Key: ${newMemKey}`);
  };

  const handleDeleteMemory = (id: string) => {
    sharedMemoryService.deleteMemory(id);
    refreshData();
  };

  // Metrics
  const runningTasksCount = workflows.flatMap(w => w.steps).filter(s => s.status === 'running' || s.status === 'retrying').length;
  const completedTasksCount = workflows.flatMap(w => w.steps).filter(s => s.status === 'completed').length;
  const failedTasksCount = workflows.flatMap(w => w.steps).filter(s => s.status === 'failed').length;

  const filteredMemory = memoryEntries.filter(m => {
    const matchesCat = selectedMemoryCategory === 'all' || m.category === selectedMemoryCategory;
    const matchesSearch = 
      m.key.toLowerCase().includes(memorySearch.toLowerCase()) ||
      m.value.toLowerCase().includes(memorySearch.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(memorySearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getTaskTypeBadge = (type: WorkflowTaskType) => {
    switch (type) {
      case 'Research':
        return 'bg-violet-950 text-violet-300 border-violet-800';
      case 'Coding':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'Planning':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'Writing':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Automation':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'Memory':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'Call Preparation':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'Project Management':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <CommanderAvatar size="lg" state={isPlanning ? 'thinking' : 'idle'} className="hidden sm:block" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI CEO COMMAND CENTER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                  LOCAL ENGINE ONLINE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Autonomous Workflow & Multi-Agent Orchestration
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Commander AI CEO analyzes high-level goals, builds multi-step execution plans, assigns sub-tasks across 8 specialist agents, and syncs findings to shared memory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateCommander}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" /> Back to Commander Chat
            </button>
            <button
              onClick={() => agentService.runHealthCheck()}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4" /> Run Agent Diagnostics
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Workflows</div>
            <div className="text-xl font-black text-cyan-400 mt-0.5">{workflows.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Running Tasks</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{runningTasksCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Completed Tasks</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{completedTasksCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Shared Memories</div>
            <div className="text-xl font-black text-violet-400 mt-0.5">{memoryEntries.length}</div>
          </div>
        </div>
      </div>

      {/* Execution Alert Banner */}
      {executionMessage && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{executionMessage}</span>
          </div>
          <button onClick={() => setExecutionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Commander CEO Goal Planning Engine Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-slate-100">Commander Goal Planning Engine</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Multi-Agent Task Decomposition</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customGoalInput}
            onChange={e => setCustomGoalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTriggerPlan()}
            placeholder="Describe high-level goal (e.g., 'Build new authentication feature with code refactor & security audit')..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleTriggerPlan()}
            disabled={isPlanning || !customGoalInput.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            {isPlanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Planning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" /> Execute Multi-Agent Plan
              </>
            )}
          </button>
        </div>

        {/* Quick Example Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-mono text-slate-500">Preset Goal Workflows:</span>
          <button
            onClick={() => handleTriggerPlan('Build full-stack feature with code architecture, research benchmarks, and security audit.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            ⚡ Full-Stack Code & Audit
          </button>
          <button
            onClick={() => handleTriggerPlan('Draft sales pitch deck and prepare executive client meeting agenda.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            💼 Pitch & Call Preparation
          </button>
          <button
            onClick={() => handleTriggerPlan('Automate recurring system health diagnostics and save logs to memory.')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            🔄 Automation & Memory Sync
          </button>
        </div>
      </div>

      {/* VISUAL ANIMATED TASK FLOW DIAGRAM */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-slate-100">Live Visual Task Flow Animation</h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
            Commander ➔ Agents ➔ Shared Memory ➔ Complete
          </span>
        </div>

        {activeWorkflow ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">ACTIVE WORKFLOW #{activeWorkflow.id}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                  activeWorkflow.status === 'completed' 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                    : activeWorkflow.status === 'running' 
                    ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {activeWorkflow.status}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-semibold">{activeWorkflow.goal}</p>
            </div>

            {/* Visual Node Diagram */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[700px] flex items-center justify-between relative px-6 py-8 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-12 right-12 h-1 bg-slate-800 -translate-y-1/2 z-0" />

                {/* Node 1: Commander CEO */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Bot className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 font-mono">Commander</span>
                  <span className="text-[10px] text-slate-500 font-mono">AI CEO</span>
                </div>

                <ChevronRight className="w-6 h-6 text-slate-600 z-10" />

                {/* Node Steps representing active/past steps */}
                {activeWorkflow.steps.map((step, idx) => {
                  const isCurrent = activeWorkflow.currentStepIndex === idx && activeWorkflow.status === 'running';
                  const isDone = step.status === 'completed';
                  const isFailed = step.status === 'failed';

                  return (
                    <React.Fragment key={step.id}>
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : isCurrent
                            ? 'bg-amber-950/90 border-amber-400 text-amber-400 animate-bounce shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                            : isFailed
                            ? 'bg-rose-950/90 border-rose-500 text-rose-400'
                            : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                          <span className="text-[10px] font-mono font-bold uppercase">{step.agentId}</span>
                          <span className="text-[9px] font-mono opacity-80">{step.taskType}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-300 max-w-[100px] text-center line-clamp-1">
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {isDone ? `${step.executionTimeMs}ms` : isCurrent ? 'Processing...' : 'Queued'}
                        </span>
                      </div>
                      {idx < activeWorkflow.steps.length - 1 && (
                        <ChevronRight className={`w-6 h-6 z-10 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                      )}
                    </React.Fragment>
                  );
                })}

                <ChevronRight className="w-6 h-6 text-slate-600 z-10" />

                {/* Node Final: Shared Memory & Commander Report */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${
                    activeWorkflow.status === 'completed'
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 font-mono">Shared Memory</span>
                  <span className="text-[10px] text-slate-500 font-mono">Report Ready</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No active workflow selected.</p>
        )}
      </div>

      {/* WORKFLOW QUEUE & EXECUTION DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Workflows List */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-cyan-400" /> Workflow Queue ({workflows.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {workflows.map(wf => {
              const isActive = wf.id === activeWorkflow?.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">#{wf.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      wf.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {wf.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2">{wf.userPrompt}</p>
                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>{wf.steps.length} Specialist Steps</span>
                    <span>{new Date(wf.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Workflow Step Breakdown & Logs */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {activeWorkflow ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">WORKFLOW EXECUTION STEPS</span>
                    <span className="text-[11px] font-mono text-slate-500">#{activeWorkflow.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-100 mt-0.5">{activeWorkflow.goal}</h3>
                </div>
              </div>

              {/* Steps Detailed Table / Cards */}
              <div className="space-y-3">
                {activeWorkflow.steps.map((step, idx) => (
                  <div key={step.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getTaskTypeBadge(step.taskType)}`}>
                          {step.taskType}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          Agent: <span className="text-cyan-400 font-bold uppercase">{step.agentId}</span>
                        </span>
                        {step.status === 'failed' ? (
                          <button
                            onClick={() => handleRetryStep(activeWorkflow.id, step.id)}
                            className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" /> Retry Step
                          </button>
                        ) : (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                            step.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {step.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">{step.description}</p>

                    {step.output && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                        <div className="text-[10px] text-emerald-400 font-bold">✓ OUTPUT SUMMARY:</div>
                        <p>{step.output}</p>
                      </div>
                    )}

                    {step.errorDetails && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300 space-y-1">
                        <div className="text-[10px] text-rose-400 font-bold">✕ ERROR LOG:</div>
                        <p>{step.errorDetails}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Execution Logs Feed */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Commander Execution Stream Logs
                  </span>
                  <span>{activeWorkflow.logs.length} entries</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 text-[11px] text-slate-300 pt-1">
                  {activeWorkflow.logs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-relaxed font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-xs italic">Select a workflow to view step details.</p>
          )}
        </div>
      </div>

      {/* SPECIALIST AGENT WORKFORCE MATRIX */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-slate-100">Specialist Agent Details & Task Queues</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">8 Registered AI CEO Sub-Agents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{agent.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{agent.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                    agent.status === 'Busy' || agent.status === 'Thinking'
                      ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                {/* Health & Metrics */}
                <div className="space-y-2 text-[11px] font-mono border-t border-slate-800/80 pt-2.5">
                  <div className="flex justify-between text-slate-400">
                    <span>System Health</span>
                    <span className="text-emerald-400 font-bold">{agent.health}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${agent.health}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Completed Tasks</span>
                    <span className="text-cyan-400 font-bold">{agent.completedTasksCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Activity</span>
                    <span className="text-slate-300">{agent.lastActivity}</span>
                  </div>
                </div>

                {/* Task Queue */}
                <div className="mt-3 text-[11px] font-mono">
                  <span className="text-slate-500">Active Task Queue ({agent.taskQueue.length}):</span>
                  {agent.taskQueue.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {agent.taskQueue.map((t, tIdx) => (
                        <li key={tIdx} className="text-[10px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate">
                          • {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic mt-0.5">Queue empty</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOCAL SHARED MEMORY SYSTEM */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-extrabold text-slate-100">Local Shared Memory System</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Agents write task progress, code snippets, and context notes directly to shared client-side memory.
            </p>
          </div>

          <button
            onClick={() => setShowAddMemoryModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" /> Save New Memory Entry
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={memorySearch}
              onChange={e => setMemorySearch(e.target.value)}
              placeholder="Search keys, values, tags..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['all', 'context', 'task_progress', 'research', 'notes', 'general'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedMemoryCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono capitalize transition-all shrink-0 ${
                  selectedMemoryCategory === cat 
                    ? 'bg-violet-950 text-violet-300 border border-violet-800 font-bold' 
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Shared Memory Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemory.map(entry => (
            <div key={entry.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-violet-400">key: {entry.key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                      {entry.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(entry.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {entry.value}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  Agent: <span className="text-cyan-400 font-bold uppercase">{entry.createdByAgentId}</span>
                </span>
                <div className="flex items-center gap-1">
                  {entry.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 bg-slate-900 rounded text-slate-400 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMAND DECISION HISTORY LOG */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-slate-100">Commander Decision & History Log</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-bold">{commandHistory.length} Recorded Commands</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">User Command</th>
                <th className="py-2.5 px-3">Commander Decision</th>
                <th className="py-2.5 px-3">Agents Chain</th>
                <th className="py-2.5 px-3">Execution Latency</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {commandHistory.map(cmd => (
                <tr key={cmd.id} className="hover:bg-slate-950/40">
                  <td className="py-3 px-3 font-semibold text-slate-200 max-w-[200px] truncate">{cmd.userCommand}</td>
                  <td className="py-3 px-3 text-slate-400 max-w-[250px] truncate">{cmd.decisionReasoning}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      {cmd.assignedAgents.map((ag, aIdx) => (
                        <span key={aIdx} className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold uppercase">
                          {ag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{cmd.executionTimeMs}ms</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                      {cmd.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shared Memory Modal */}
      {showAddMemoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-violet-400" /> Save Shared Memory Entry
            </h3>

            <form onSubmit={handleSaveNewMemory} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 mb-1 block">Memory Key Identifier</label>
                <input
                  type="text"
                  required
                  value={newMemKey}
                  onChange={e => setNewMemKey(e.target.value)}
                  placeholder="e.g. system_auth_policy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Category</label>
                <select
                  value={newMemCategory}
                  onChange={e => setNewMemCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="context">Context</option>
                  <option value="task_progress">Task Progress</option>
                  <option value="research">Research</option>
                  <option value="notes">Notes</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Memory Content / Value</label>
                <textarea
                  required
                  rows={4}
                  value={newMemVal}
                  onChange={e => setNewMemVal(e.target.value)}
                  placeholder="Write memory entry details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newMemTags}
                  onChange={e => setNewMemTags(e.target.value)}
                  placeholder="e.g. auth, security, rbac"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
