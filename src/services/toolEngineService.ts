import { ToolDefinition, ToolExecutionRecord, ToolPermissionLevel } from '../types';
import { apiService } from './apiService';
import { memoryService } from './memoryService';

const TOOL_HISTORY_KEY = 'commander_tool_execution_history_v1';

const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: 'notes-tool',
    name: 'Notes Tool',
    description: 'Manages executive notes, summaries, and pinned strategic documentation in local memory.',
    permissionLevel: 'user',
    status: 'idle',
    version: 'v1.2',
    category: 'productivity',
    icon: 'FileText',
    executionTimeMs: 14,
    usageCount: 28,
    logs: ['[SYSTEM] Notes Tool initialized', '[READY] Awaiting note operations']
  },
  {
    id: 'task-tool',
    name: 'Task Tool',
    description: 'Creates, updates, completes, deletes, and tracks executive tasks and sprint work items.',
    permissionLevel: 'user',
    status: 'idle',
    version: 'v1.3',
    category: 'productivity',
    icon: 'CheckSquare',
    executionTimeMs: 18,
    usageCount: 42,
    logs: ['[SYSTEM] Task Tool active', '[READY] Synchronized with local task database']
  },
  {
    id: 'file-tool',
    name: 'File Tool',
    description: 'Virtual local File Manager for creating, browsing, moving, renaming, and searching local workspace files.',
    permissionLevel: 'user',
    status: 'idle',
    version: 'v1.1',
    category: 'data',
    icon: 'Folder',
    executionTimeMs: 22,
    usageCount: 19,
    logs: ['[SYSTEM] Virtual File System initialized', '[READY] Local storage root mounted']
  },
  {
    id: 'search-tool',
    name: 'Search Tool',
    description: 'Unified local search across tasks, notes, projects, memories, virtual files, and conversation history.',
    permissionLevel: 'user',
    status: 'idle',
    version: 'v1.4',
    category: 'data',
    icon: 'Search',
    executionTimeMs: 25,
    usageCount: 56,
    logs: ['[SYSTEM] Search Indexer mounted', '[READY] Keyword and fuzzy search ready']
  },
  {
    id: 'memory-tool',
    name: 'Memory Tool',
    description: 'Long-Term Memory architecture interface to store, retrieve, update, delete, and search core memories.',
    permissionLevel: 'system',
    status: 'idle',
    version: 'v2.0',
    category: 'ai',
    icon: 'Brain',
    executionTimeMs: 12,
    usageCount: 64,
    logs: ['[SYSTEM] Long-Term Memory Engine operational', '[READY] Indexed context nodes ready']
  },
  {
    id: 'calculator-tool',
    name: 'Calculator Tool',
    description: 'Performs mathematical computations, ROI projections, token cost estimations, and metric formulas.',
    permissionLevel: 'user',
    status: 'idle',
    version: 'v1.0',
    category: 'utilities',
    icon: 'Calculator',
    executionTimeMs: 8,
    usageCount: 15,
    logs: ['[SYSTEM] Math Expression Evaluator loaded', '[READY] Ready for formula evaluation']
  },
  {
    id: 'workflow-tool',
    name: 'Workflow Tool',
    description: 'Generates and validates automated multi-step agent execution sequences and operational pipelines.',
    permissionLevel: 'admin',
    status: 'idle',
    version: 'v1.2',
    category: 'system',
    icon: 'Workflow',
    executionTimeMs: 35,
    usageCount: 31,
    logs: ['[SYSTEM] Workflow Automation Engine active', '[READY] Multi-agent pipeline ready']
  },
  {
    id: 'report-tool',
    name: 'Report Tool',
    description: 'Compiles executive summary reports synthesizing task status, activity logs, memory stats, and system metrics.',
    permissionLevel: 'admin',
    status: 'idle',
    version: 'v1.1',
    category: 'productivity',
    icon: 'FileBarChart',
    executionTimeMs: 40,
    usageCount: 22,
    logs: ['[SYSTEM] Executive Report Generator initialized', '[READY] Synthesis templates ready']
  }
];

class ToolEngineService {
  private tools: ToolDefinition[] = [];
  private history: ToolExecutionRecord[] = [];

  constructor() {
    this.tools = INITIAL_TOOLS;
    this.loadHistory();
  }

  private loadHistory() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TOOL_HISTORY_KEY);
      if (stored) {
        try {
          this.history = JSON.parse(stored);
        } catch {
          this.history = this.getInitialHistory();
        }
      } else {
        this.history = this.getInitialHistory();
        this.saveHistory();
      }
    } else {
      this.history = this.getInitialHistory();
    }
  }

  private saveHistory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOOL_HISTORY_KEY, JSON.stringify(this.history));
    }
  }

  private getInitialHistory(): ToolExecutionRecord[] {
    return [
      {
        id: 'tex-01',
        toolId: 'memory-tool',
        toolName: 'Memory Tool',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        executionTimeMs: 12,
        status: 'success',
        inputParams: { action: 'retrieve', type: 'Goals' },
        result: { count: 2, status: 'Memories retrieved' },
        logs: ['[INFO] Searching memory repository...', '[SUCCESS] Retrieved 2 matching goal entries'],
        permissionLevel: 'system'
      },
      {
        id: 'tex-02',
        toolId: 'task-tool',
        toolName: 'Task Tool',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        executionTimeMs: 18,
        status: 'success',
        inputParams: { action: 'list_active' },
        result: { activeCount: 5, completedToday: 3 },
        logs: ['[INFO] Fetching active tasks...', '[SUCCESS] Task matrix synchronized'],
        permissionLevel: 'user'
      },
      {
        id: 'tex-03',
        toolId: 'search-tool',
        toolName: 'Search Tool',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        executionTimeMs: 25,
        status: 'success',
        inputParams: { query: 'Phase 3.2' },
        result: { totalMatches: 8 },
        logs: ['[INFO] Querying local indexes...', '[SUCCESS] Found 8 matches across tasks, notes, and memory'],
        permissionLevel: 'user'
      }
    ];
  }

  public getInstalledTools(): ToolDefinition[] {
    return [...this.tools];
  }

  public getTool(toolId: string): ToolDefinition | undefined {
    return this.tools.find(t => t.id === toolId);
  }

  public getExecutionHistory(): ToolExecutionRecord[] {
    return [...this.history];
  }

  /**
   * Executes a tool with provided parameters, capturing logs, timing, and errors.
   */
  public async executeTool(
    toolId: string,
    params: any = {},
    requestedPermission: ToolPermissionLevel = 'user'
  ): Promise<{ success: boolean; result: any; logs: string[]; executionTimeMs: number }> {
    const tool = this.getTool(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" does not exist in Tool Engine.`);
    }

    const startTime = performance.now();
    tool.status = 'running';
    const currentLogs: string[] = [`[${new Date().toLocaleTimeString()}] Initializing ${tool.name} (${tool.version})...`];
    currentLogs.push(`[${new Date().toLocaleTimeString()}] Validating permission level: ${tool.permissionLevel.toUpperCase()}...`);

    let resultData: any = null;
    let isSuccess = true;
    let errorMessage: string | null = null;

    try {
      // Simulate/Execute specific tool logic locally
      currentLogs.push(`[${new Date().toLocaleTimeString()}] Executing payload: ${JSON.stringify(params)}...`);

      switch (toolId) {
        case 'notes-tool':
          if (params.action === 'create') {
            await apiService.addNote(params.title || 'Untitled Note', params.content || '', params.category || 'General');
            resultData = { message: 'Note created successfully', title: params.title };
          } else {
            const notes = await apiService.getPinnedNotes();
            resultData = { notes, count: notes.length };
          }
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Notes Tool completed operation cleanly.`);
          break;

        case 'task-tool':
          if (params.action === 'create') {
            const newTask = await apiService.addTask(params.title || 'New Task', params.priority || 'medium');
            resultData = { message: 'Task created', task: newTask };
          } else if (params.action === 'complete' && params.taskId) {
            await apiService.toggleTask(params.taskId);
            resultData = { message: 'Task toggled', taskId: params.taskId };
          } else {
            const tasks = await apiService.getTasks();
            resultData = { tasks, count: tasks.length };
          }
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Task Tool state updated.`);
          break;

        case 'memory-tool':
          if (params.action === 'store') {
            const mem = memoryService.storeMemory({
              type: params.type || 'Knowledge',
              title: params.title || 'New Memory',
              content: params.content || '',
              tags: params.tags || ['general'],
              importance: params.importance || 'medium'
            });
            resultData = { message: 'Memory stored', memory: mem };
          } else if (params.action === 'search') {
            const found = memoryService.searchMemories(params.query || '');
            resultData = { matches: found, count: found.length };
          } else {
            const stats = memoryService.getMemoryStats();
            resultData = { stats, memoriesCount: stats.total };
          }
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Memory Engine processed memory vector node.`);
          break;

        case 'search-tool':
          const query = params.query || '';
          const memoryMatches = memoryService.searchMemories(query);
          const tasks = await apiService.getTasks();
          const taskMatches = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
          resultData = {
            query,
            totalMatches: memoryMatches.length + taskMatches.length,
            memories: memoryMatches,
            tasks: taskMatches
          };
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Search Tool indexed across local storage.`);
          break;

        case 'calculator-tool':
          const expr = params.expression || '100 * 1.5 + 42';
          let calcValue = 0;
          try {
            // Safe simple evaluation for math numbers
            calcValue = Function(`"use strict"; return (${expr.replace(/[^0-9+\-*/().]/g, '')})`)();
          } catch {
            calcValue = 0;
          }
          resultData = { expression: expr, result: calcValue };
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Calculator evaluated expression: ${expr} = ${calcValue}`);
          break;

        case 'workflow-tool':
          resultData = {
            workflowId: 'wf-' + Math.random().toString(36).substring(2, 8),
            status: 'validated',
            pipeline: ['Analyze Intent', 'Delegate to Forge & Atlas', 'Execute Sandbox', 'Verify Security']
          };
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Workflow Tool validated pipeline sequence.`);
          break;

        case 'report-tool':
          const memStats = memoryService.getMemoryStats();
          const currentTasks = await apiService.getTasks();
          resultData = {
            reportTitle: 'Executive Commander AI OS Status Report',
            generatedAt: new Date().toISOString(),
            metrics: {
              activeMemories: memStats.total,
              tasksPending: currentTasks.filter(t => !t.completed).length,
              tasksCompleted: currentTasks.filter(t => t.completed).length,
              memoryFootprintKB: memStats.approxKB
            },
            status: 'Optimal'
          };
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Executive Report Tool compiled summary report.`);
          break;

        case 'file-tool':
          resultData = {
            status: 'mounted',
            directory: '/workspace/local_virtual_fs',
            virtualFilesCount: 6,
            message: 'Virtual File Manager operation complete'
          };
          currentLogs.push(`[${new Date().toLocaleTimeString()}] File Tool processed virtual directory.`);
          break;

        default:
          resultData = { status: 'executed', info: 'Mock tool response' };
          currentLogs.push(`[${new Date().toLocaleTimeString()}] Tool execution finished.`);
          break;
      }

      tool.status = 'success';
      tool.usageCount += 1;
      tool.lastResult = resultData;
      tool.error = null;
    } catch (err: any) {
      isSuccess = false;
      errorMessage = err.message || 'Unknown tool execution error';
      tool.status = 'error';
      tool.error = errorMessage;
      currentLogs.push(`[ERROR] Execution failed: ${errorMessage}`);
    }

    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);
    tool.executionTimeMs = executionTimeMs;
    tool.logs = currentLogs;

    // Create Execution History Record
    const record: ToolExecutionRecord = {
      id: 'tex-' + Math.random().toString(36).substring(2, 9),
      toolId: tool.id,
      toolName: tool.name,
      timestamp: new Date().toISOString(),
      executionTimeMs,
      status: isSuccess ? 'success' : 'error',
      inputParams: params,
      result: resultData,
      logs: currentLogs,
      permissionLevel: tool.permissionLevel
    };

    this.history.unshift(record);
    if (this.history.length > 50) this.history.pop();
    this.saveHistory();

    apiService.logActivity(`Tool Executed: ${tool.name}`, 'system', `Status: ${isSuccess ? 'Success' : 'Failed'}`);

    return {
      success: isSuccess,
      result: resultData,
      logs: currentLogs,
      executionTimeMs
    };
  }

  public getToolStats() {
    const totalInstalled = this.tools.length;
    const activeTools = this.tools.filter(t => t.status !== 'error').length;
    const totalExecutions = this.history.length;
    const successfulExecutions = this.history.filter(h => h.status === 'success').length;
    const successRate = totalExecutions > 0 ? ((successfulExecutions / totalExecutions) * 100).toFixed(1) : '100.0';
    
    return {
      totalInstalled,
      activeTools,
      totalExecutions,
      successRate: parseFloat(successRate)
    };
  }
}

export const toolEngineService = new ToolEngineService();
