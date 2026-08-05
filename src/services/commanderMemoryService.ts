import { CommanderMemoryState } from '../types';
import { apiService } from './apiService';

const COMMANDER_MEMORY_KEY = 'commander_preview_memory_state';

const INITIAL_MEMORY_STATE: CommanderMemoryState = {
  currentSessionId: 'sess-' + Math.random().toString(36).substring(2, 8),
  activeGoal: 'Build Autonomous AI CEO Multi-Agent Brain with Execution Workflows',
  frequentlyUsedCommands: [
    { command: 'Build full-stack feature with code architecture & security audit', count: 18, category: 'Coding & Audit' },
    { command: 'Draft pitch deck & client meeting agenda', count: 14, category: 'Sales & Call' },
    { command: 'Automate system health diagnostics & save logs to memory', count: 12, category: 'Automation' },
    { command: 'Audit system permissions & index security compliance', count: 9, category: 'Security' },
    { command: 'Synthesize LLM latency benchmarks & vector context', count: 7, category: 'Research' }
  ],
  recentTasksSummary: [
    'Refactored Vector Indexing Pipeline for Forge (Completed)',
    'Synthesized Multi-Agent Framework Comparative Matrix for Nova (Completed)',
    'Generated Sprint Roadmap for Atlas (Completed)',
    'Indexed System Security Policies in Shared Memory for Vault (Completed)'
  ],
  pinnedNotesCount: 4,
  indexedContextNodes: 128,
  lastSyncTime: 'Just now'
};

class CommanderMemoryService {
  private memoryState: CommanderMemoryState = INITIAL_MEMORY_STATE;

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COMMANDER_MEMORY_KEY);
      if (stored) {
        try {
          this.memoryState = JSON.parse(stored);
        } catch {
          this.memoryState = INITIAL_MEMORY_STATE;
        }
      } else {
        this.saveState();
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMMANDER_MEMORY_KEY, JSON.stringify(this.memoryState));
    }
  }

  public getMemory(): CommanderMemoryState {
    return { ...this.memoryState };
  }

  public setActiveGoal(goal: string): CommanderMemoryState {
    this.memoryState.activeGoal = goal;
    this.memoryState.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveState();
    apiService.logActivity('Commander Memory Updated Active Goal', 'note', `Goal: ${goal}`);
    return this.getMemory();
  }

  public recordCommand(commandText: string, category: string = 'General'): CommanderMemoryState {
    const existing = this.memoryState.frequentlyUsedCommands.find(c => c.command.toLowerCase() === commandText.toLowerCase());
    if (existing) {
      existing.count += 1;
    } else {
      this.memoryState.frequentlyUsedCommands.unshift({
        command: commandText,
        count: 1,
        category
      });
      // Limit to top 10
      if (this.memoryState.frequentlyUsedCommands.length > 10) {
        this.memoryState.frequentlyUsedCommands.pop();
      }
    }
    this.memoryState.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveState();
    return this.getMemory();
  }

  public addRecentTask(taskSummary: string): CommanderMemoryState {
    this.memoryState.recentTasksSummary = [
      taskSummary,
      ...this.memoryState.recentTasksSummary.slice(0, 9)
    ];
    this.memoryState.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveState();
    return this.getMemory();
  }

  public incrementIndexedNodes(count: number = 1): CommanderMemoryState {
    this.memoryState.indexedContextNodes += count;
    this.memoryState.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveState();
    return this.getMemory();
  }
}

export const commanderMemoryService = new CommanderMemoryService();
