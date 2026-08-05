import { SharedMemoryEntry, SubAgentId } from '../types';

const SHARED_MEMORY_STORAGE_KEY = 'commander_preview_shared_memory';

const INITIAL_MEMORY: SharedMemoryEntry[] = [
  {
    id: 'mem-001',
    key: 'system_architecture_spec',
    value: 'Commander AI operates as the primary AI CEO. All specialist agents (Atlas, Nova, Forge, Titan, Vault, Echo, Orbit, Sentinel) report execution metrics to Commander.',
    category: 'context',
    createdByAgentId: 'commander',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ['architecture', 'system', 'ceo'],
    notes: 'Core system definition node.',
  },
  {
    id: 'mem-002',
    key: 'sprint_active_backlog',
    value: 'Phase 2.2 Sprint: 1) Workflow Engine, 2) Shared Memory Sync, 3) Visual Command Center, 4) Retry Error Handler.',
    category: 'task_progress',
    createdByAgentId: 'atlas',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    tags: ['sprint', 'atlas', 'tasks'],
    notes: 'Atlas active task tracking.',
  },
  {
    id: 'mem-003',
    key: 'research_benchmarks_multiagent',
    value: 'Multi-agent sequential delegation reduces token hallucination by 68% and improves task completion velocity by 3.2x.',
    category: 'research',
    createdByAgentId: 'nova',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    tags: ['research', 'benchmarks', 'nova'],
    notes: 'Nova research summary note.',
  },
  {
    id: 'mem-004',
    key: 'security_sandbox_governance',
    value: 'Client-side local storage active. Zero external API leaks detected. All sandbox permissions validated.',
    category: 'general',
    createdByAgentId: 'sentinel',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    tags: ['security', 'sentinel', 'audit'],
    notes: 'Sentinel security compliance memo.',
  },
];

class SharedMemoryService {
  private memory: SharedMemoryEntry[] = [];

  constructor() {
    this.loadMemory();
  }

  private loadMemory() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SHARED_MEMORY_STORAGE_KEY);
      if (stored) {
        try {
          this.memory = JSON.parse(stored);
        } catch {
          this.memory = INITIAL_MEMORY;
        }
      } else {
        this.memory = INITIAL_MEMORY;
        this.saveMemory();
      }
    } else {
      this.memory = INITIAL_MEMORY;
    }
  }

  private saveMemory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SHARED_MEMORY_STORAGE_KEY, JSON.stringify(this.memory));
    }
  }

  public getMemory(): SharedMemoryEntry[] {
    return [...this.memory];
  }

  public getMemoryByKey(key: string): SharedMemoryEntry | undefined {
    return this.memory.find(m => m.key === key);
  }

  public writeMemory(
    key: string,
    value: string,
    category: SharedMemoryEntry['category'],
    createdByAgentId: SubAgentId | 'commander',
    tags: string[] = [],
    notes?: string
  ): SharedMemoryEntry {
    const existingIndex = this.memory.findIndex(m => m.key === key);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated: SharedMemoryEntry = {
        ...this.memory[existingIndex],
        value,
        category,
        createdByAgentId,
        updatedAt: now,
        tags: Array.from(new Set([...this.memory[existingIndex].tags, ...tags])),
        notes: notes || this.memory[existingIndex].notes,
      };
      this.memory[existingIndex] = updated;
      this.saveMemory();
      return updated;
    } else {
      const newEntry: SharedMemoryEntry = {
        id: 'mem-' + Math.random().toString(36).substring(2, 9),
        key,
        value,
        category,
        createdByAgentId,
        createdAt: now,
        updatedAt: now,
        tags,
        notes,
      };
      this.memory = [newEntry, ...this.memory];
      this.saveMemory();
      return newEntry;
    }
  }

  public deleteMemory(id: string): SharedMemoryEntry[] {
    this.memory = this.memory.filter(m => m.id !== id);
    this.saveMemory();
    return this.getMemory();
  }

  public clearMemory(): SharedMemoryEntry[] {
    this.memory = [];
    this.saveMemory();
    return [];
  }
}

export const sharedMemoryService = new SharedMemoryService();
