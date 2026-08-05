import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Brain, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Bot, 
  Database, 
  ChevronRight, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  Terminal, 
  FileText,
  Target,
  Edit3
} from 'lucide-react';
import { Workflow, WorkflowStep, SubAgent } from '../types';
import { workflowService } from '../services/workflowService';
import { agentService } from '../services/agentService';
import { commanderMemoryService } from '../services/commanderMemoryService';
import { sharedMemoryService } from '../services/sharedMemoryService';
import { CommanderAvatar } from '../components/CommanderAvatar';

interface WorkspaceViewProps {
  onNavigateCommander: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onNavigateCommander }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [memoryState, setMemoryState] = useState(commanderMemoryService.getMemory());

  // Goal Editing
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(memoryState.activeGoal);

  // New Goal / Custom Execution
  const [customPrompt, setCustomPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const refreshData = () => {
    const list = workflowService.getWorkflows();
    setWorkflows(list);
    setAgents(agentService.getAgents());
    const mem = commanderMemoryService.getMemory();
    setMemoryState(mem);
    setGoalInput(mem.activeGoal);
  };

  useEffect(() => {
    refreshData();
    const timer = setInterval(() => {
      setAgents(agentService.getAgents());
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    commanderMemoryService.setActiveGoal(goalInput.trim());
    setIsEditingGoal(false);
    refreshData();
  };

  const handleStartWorkflow = async (promptOverride?: string) => {
    const textToRun = promptOverride || customPrompt.trim();
    if (!textToRun) return;

    setIsExecuting(true);
    setExecutionLog('Commander CEO is synthesizing intent and establishing agent pipeline...');

    try {
      commanderMemoryService.recordCommand(textToRun, 'Workspace Action');
      commanderMemoryService.setActiveGoal(textToRun);

      const newWf = workflowService.planWorkflow(textToRun);
      setWorkflows(workflowService.getWorkflows());
      setActiveWorkflowId(newWf.id);
      setCustomPrompt('');

      setExecutionLog(`Execution plan constructed with ${newWf.steps.length} sub-tasks. Initiating agent delegation...`);

      await workflowService.executeWorkflow(
        newWf.id,
        (_updatedWf) => {
          setWorkflows(workflowService.getWorkflows());
          setAgents(agentService.getAgents());
        },
        (id, status, task) => {
          agentService.setAgentStatus(id, status, task);
          setAgents(agentService.getAgents());
        }
      );

      refreshData();
      setExecutionLog('Workspace execution plan completed successfully across all assigned agents.');
      setTimeout(() => setExecutionLog(null), 4000);
    } catch (err: any) {
      setExecutionLog(`Execution failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Progress metrics
  const totalSteps = activeWorkflow ? activeWorkflow.steps.length : 0;
  const completedSteps = activeWorkflow ? activeWorkflow.steps.filter(s => s.status === 'completed').length : 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <CommanderAvatar size="lg" state={isExecuting ? 'thinking' : 'idle'} className="hidden sm:block" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> AI CEO WORKSPACE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                  ORCHESTRATOR ONLINE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Goal Execution & Multi-Agent Planning Workspace
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Centralized command hub tracking high-level organizational goals, active workflows, real-time agent execution timelines, and merged memory results.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateCommander}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" /> Talk to Commander CEO
            </button>
            <button
              onClick={() => handleStartWorkflow('Execute high-performance system optimization and code refactor.')}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Trigger Default Goal
            </button>
          </div>
        </div>

        {/* Workspace Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Active Goal Status</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5 truncate">{memoryState.activeGoal}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Plan Progress</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{progressPercent}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Active Sub-Tasks</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{totalSteps}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Vector Memory Nodes</div>
            <div className="text-xl font-black text-violet-400 mt-0.5">{memoryState.indexedContextNodes}</div>
          </div>
        </div>
      </div>

      {/* Execution Alert Banner */}
      {executionLog && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{executionLog}</span>
          </div>
          <button onClick={() => setExecutionLog(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* CURRENT GOAL CARD & EDITING */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-slate-100">Primary Organizational Goal</h2>
          </div>
          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> {isEditingGoal ? 'Cancel' : 'Edit Goal'}
          </button>
        </div>

        {isEditingGoal ? (
          <form onSubmit={handleSaveGoal} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
              placeholder="Enter active organizational goal..."
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer"
            >
              Update Goal Memory
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-100 leading-snug">{memoryState.activeGoal}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                <span>Session: <strong className="text-cyan-400">{memoryState.currentSessionId}</strong></span>
                <span>•</span>
                <span>Synced: {memoryState.lastSyncTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-mono font-bold uppercase">
                ACTIVE PIPELINE
              </span>
            </div>
          </div>
        )}

        {/* Quick Trigger Execution Form */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-xs font-mono text-slate-400 block mb-2">Execute New Sub-Goal Pipeline:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStartWorkflow()}
              placeholder="Input custom execution objective..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleStartWorkflow()}
              disabled={isExecuting || !customPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Execute Goal
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTION PLAN & ACTIVE WORKFLOW BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Workflows List & Goal Select */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Planned Workflows ({workflows.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {workflows.map(wf => {
              const isActive = wf.id === activeWorkflow?.id;
              const completedCount = wf.steps.filter(s => s.status === 'completed').length;
              const stepPercent = Math.round((completedCount / wf.steps.length) * 100);

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
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">#{wf.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      wf.status === 'completed' 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                    }`}>
                      {wf.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-semibold line-clamp-2">{wf.userPrompt}</p>

                  {/* Step Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Progress</span>
                      <span>{stepPercent}% ({completedCount}/{wf.steps.length})</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${stepPercent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Plan Steps & Smart Planner Details */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {activeWorkflow ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">EXECUTION PLAN</span>
                    <span className="text-[11px] font-mono text-slate-500">#{activeWorkflow.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-100 mt-0.5">{activeWorkflow.goal}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{activeWorkflow.estimatedCompletionTimeSec}s Est. Duration
                  </div>
                </div>
              </div>

              {/* Sub-Tasks Execution Plan Cards */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Smart Task Decomposition ({activeWorkflow.steps.length} Sub-Tasks)
                </h4>

                <div className="space-y-3">
                  {activeWorkflow.steps.map((step, idx) => (
                    <div key={step.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <h5 className="text-xs font-bold text-slate-100">{step.title}</h5>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            step.priority === 'High' 
                              ? 'bg-rose-950 text-rose-300 border-rose-800' 
                              : step.priority === 'Medium'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            Priority: {step.priority || 'Medium'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            Diff: {step.difficulty || 'Medium'}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                            step.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400">{step.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1.5">
                          Assigned Agent: <strong className="text-cyan-400 uppercase">{step.agentId}</strong>
                        </span>
                        <span>Time: {step.executionTimeMs ? `${step.executionTimeMs}ms` : `~${step.estimatedTimeSec || 3}s`}</span>
                      </div>

                      {step.output && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                          <div className="text-[10px] text-emerald-400 font-bold mb-1">✓ EXECUTION OUTPUT RESULT:</div>
                          <p>{step.output}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Execution Logs */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Commander Execution Log Stream
                  </span>
                  <span>{activeWorkflow.logs.length} events</span>
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
            <p className="text-slate-500 text-xs italic">Select a planned workflow to view details.</p>
          )}
        </div>
      </div>

      {/* AGENT EXECUTION TIMELINE */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-slate-100">Specialist Agent Timeline & Delegation Matrix</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Live Agent Synchronization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.map(ag => (
            <div key={ag.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={ag.avatar} alt={ag.name} className="w-8 h-8 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{ag.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{ag.role}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">{ag.performanceScore}% Score</span>
              </div>

              {/* Execution history timeline snippet */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <div className="text-slate-500 font-bold">Recent Executions:</div>
                {ag.executionHistory && ag.executionHistory.length > 0 ? (
                  ag.executionHistory.slice(0, 2).map((ex, exIdx) => (
                    <div key={exIdx} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
                      <div className="flex justify-between text-slate-300">
                        <span className="font-bold truncate max-w-[120px]">{ex.taskTitle}</span>
                        <span className="text-cyan-400">{ex.durationMs}ms</span>
                      </div>
                      <div className="text-slate-500 line-clamp-1">{ex.outputSummary}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No execution history recorded.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
