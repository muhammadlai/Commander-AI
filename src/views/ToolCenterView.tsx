import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Play, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Search, 
  Filter, 
  RotateCcw,
  Code2,
  Cpu,
  Layers,
  FileText,
  CheckSquare,
  Folder,
  Brain,
  Calculator,
  Workflow,
  FileBarChart
} from 'lucide-react';
import { toolEngineService } from '../services/toolEngineService';
import { ToolDefinition, ToolExecutionRecord, ToolPermissionLevel } from '../types';

export const ToolCenterView: React.FC = () => {
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [history, setHistory] = useState<ToolExecutionRecord[]>([]);
  const [stats, setStats] = useState({ totalInstalled: 8, activeTools: 8, totalExecutions: 0, successRate: 100 });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Test Tool Modal State
  const [activeTestTool, setActiveTestTool] = useState<ToolDefinition | null>(null);
  const [testPayload, setTestPayload] = useState<string>('{\n  "action": "list"\n}');
  const [isExecutingTest, setIsExecutingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setTools(toolEngineService.getInstalledTools());
    setHistory(toolEngineService.getExecutionHistory());
    setStats(toolEngineService.getToolStats());
  };

  const handleRunTest = async () => {
    if (!activeTestTool) return;
    setIsExecutingTest(true);
    setTestResult(null);

    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(testPayload);
      } catch {
        parsedPayload = { query: testPayload };
      }

      const res = await toolEngineService.executeTool(
        activeTestTool.id,
        parsedPayload,
        activeTestTool.permissionLevel
      );
      setTestResult(res);
      refreshData();
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsExecutingTest(false);
    }
  };

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'CheckSquare': return CheckSquare;
      case 'Folder': return Folder;
      case 'Search': return Search;
      case 'Brain': return Brain;
      case 'Calculator': return Calculator;
      case 'Workflow': return Workflow;
      case 'FileBarChart': return FileBarChart;
      default: return Wrench;
    }
  };

  const filteredTools = tools
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">TOOL ENGINE CENTER</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold">
                MODULAR ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Autonomous execution tools for Commander AI OS • Sandbox Isolated • Zero Egress
            </p>
          </div>
        </div>

        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700 self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" /> Refresh Diagnostics
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Installed Tools</span>
            <span className="text-xl font-bold font-mono text-cyan-300">{stats.totalInstalled} Tools</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active Status</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{stats.activeTools} / {stats.totalInstalled} Operational</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Executions</span>
            <span className="text-xl font-bold font-mono text-indigo-300">{stats.totalExecutions} Invocations</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Success Rate</span>
            <span className="text-xl font-bold font-mono text-amber-300">{stats.successRate}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'productivity', 'data', 'system', 'ai', 'utilities'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTools.map((tool) => {
          const IconComp = getToolIcon(tool.icon);
          const isError = tool.status === 'error';

          return (
            <div
              key={tool.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 group-hover:border-cyan-500/50">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-950 border border-slate-800 text-slate-400">
                      {tool.version}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      tool.permissionLevel === 'admin'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : tool.permissionLevel === 'system'
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {tool.permissionLevel}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Avg Latency:</span>
                  <span className="text-slate-300 font-semibold">{tool.executionTimeMs}ms</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Usage Count:</span>
                  <span className="text-cyan-400 font-bold">{tool.usageCount} calls</span>
                </div>

                <button
                  onClick={() => {
                    setActiveTestTool(tool);
                    setTestPayload('{\n  "action": "list"\n}');
                    setTestResult(null);
                  }}
                  className="w-full mt-2 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-cyan-300" /> Test Run
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution History Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold font-mono uppercase text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Tool Execution Audit History
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Showing last {history.length} operations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Tool Name</th>
                <th className="py-2 px-3">Permission</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Execution Time</th>
                <th className="py-2 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{rec.toolName}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 uppercase">
                      {rec.permissionLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      rec.status === 'success'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{rec.executionTimeMs} ms</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] text-slate-500 truncate max-w-xs block ml-auto">
                      {JSON.stringify(rec.inputParams)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide-over for Tool Testing */}
      {activeTestTool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <Play className="w-5 h-5 fill-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Manual Run: {activeTestTool.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">Permission Level: {activeTestTool.permissionLevel.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTestTool(null)}
                className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                JSON Input Payload Parameters:
              </label>
              <textarea
                rows={4}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              onClick={handleRunTest}
              disabled={isExecutingTest}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isExecutingTest ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              {isExecutingTest ? 'Executing Tool...' : 'Execute Tool Payload'}
            </button>

            {/* Test Execution Output */}
            {testResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs max-h-60 overflow-y-auto custom-scrollbar">
                <span className="text-emerald-400 font-bold block uppercase text-[10px]">
                  Execution Result ({testResult.executionTimeMs || 0}ms)
                </span>
                <pre className="text-slate-300 whitespace-pre-wrap text-[11px]">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
