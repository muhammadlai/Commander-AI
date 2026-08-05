import { LongTermMemoryItem, MemoryType, MemoryImportance } from '../types';
import { apiService } from './apiService';

const LONG_TERM_MEMORY_STORAGE_KEY = 'commander_long_term_memory_v2';

const DEFAULT_MEMORIES: LongTermMemoryItem[] = [
  {
    id: 'mem-usr-01',
    type: 'User Profile',
    title: 'Executive User Identity & Role',
    content: 'User: Aitzaz (Lead Systems Architect & Founder). Primary Focus: Autonomous AI OS Architecture, High-Performance Micro-Services, Multi-Agent Governance, and Executive Intelligence.',
    tags: ['user', 'profile', 'architect', 'owner'],
    pinned: true,
    importance: 'high',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Commander',
    metadata: { role: 'Architect', email: 'aitzaz@commander.ai' }
  },
  {
    id: 'mem-goal-01',
    type: 'Goals',
    title: 'Phase 3.2 AI OS Autonomous Tool Engine & Memory',
    content: 'Goal: Evolve Commander into a true AI Operating System featuring a modular Tool Engine (8 local tools), long-term memory store, decision engine, virtual local file system, and unified search.',
    tags: ['goals', 'roadmap', 'phase3.2', 'ai-os'],
    pinned: true,
    importance: 'high',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Commander'
  },
  {
    id: 'mem-proj-01',
    type: 'Projects',
    title: 'Commander AI OS Engine Architecture',
    content: 'Core architecture includes 8 sub-agents (Atlas, Nova, Forge, Titan, Vault, Echo, Orbit, Sentinel), React 18 modular micro-frontend, Express API layer, and local encrypted state persistence.',
    tags: ['projects', 'architecture', 'react', 'express'],
    pinned: true,
    importance: 'high',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Forge'
  },
  {
    id: 'mem-pref-01',
    type: 'Preferences',
    title: 'Executive LLM & UI Preferences',
    content: 'Active LLM Provider: Gemini (gemini-3.6-flash). Temperature: 0.7. Output Style: Executive CEO (Authoritative, structured markdown with bullet points). Theme: Dark Slate Cyan.',
    tags: ['preferences', 'llm', 'gemini', 'theme'],
    pinned: false,
    importance: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Commander'
  },
  {
    id: 'mem-knw-01',
    type: 'Knowledge',
    title: 'Multi-Agent Governance & Safety Policy',
    content: 'All tools must operate strictly in local sandboxes without unauthorized external egress. Tool permissions are categorized into System, User, and Admin tiers with audited logs.',
    tags: ['knowledge', 'governance', 'security', 'sandbox'],
    pinned: false,
    importance: 'high',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Sentinel'
  },
  {
    id: 'mem-task-01',
    type: 'Tasks',
    title: 'Phase 3.2 Verification & Integration Checklist',
    content: '1. Verify 8 tools in Tool Engine. 2. Verify CRUD in Memory Center. 3. Validate Virtual File Manager. 4. Verify Unified Search Engine. 5. Confirm local mock storage compliance.',
    tags: ['tasks', 'checklist', 'verification'],
    pinned: false,
    importance: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Atlas'
  },
  {
    id: 'mem-note-01',
    type: 'Notes',
    title: 'Executive Memory Synchronization Note',
    content: 'Long-term memories are dynamically indexed and weighted by relevancy during Commander decision execution. Memories tagged "high" receive priority context injection.',
    tags: ['notes', 'indexing', 'context'],
    pinned: false,
    importance: 'low',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Echo'
  },
  {
    id: 'mem-conv-01',
    type: 'Conversations',
    title: 'Strategic Planning Session Summary',
    content: 'User requested multi-agent coordination for code refactoring and memory persistence. Commander delegated task matrix to Forge and Atlas, output saved to long-term memory.',
    tags: ['conversations', 'summary', 'delegation'],
    pinned: false,
    importance: 'medium',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
    sourceAgent: 'Commander'
  }
];

class LongTermMemoryService {
  private memories: LongTermMemoryItem[] = [];

  constructor() {
    this.loadMemories();
  }

  private loadMemories() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LONG_TERM_MEMORY_STORAGE_KEY);
      if (stored) {
        try {
          this.memories = JSON.parse(stored);
        } catch {
          this.memories = DEFAULT_MEMORIES;
        }
      } else {
        this.memories = DEFAULT_MEMORIES;
        this.saveMemories();
      }
    } else {
      this.memories = DEFAULT_MEMORIES;
    }
  }

  private saveMemories() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LONG_TERM_MEMORY_STORAGE_KEY, JSON.stringify(this.memories));
    }
  }

  public getMemories(type?: MemoryType, filterQuery?: string): LongTermMemoryItem[] {
    let result = [...this.memories];

    if (type) {
      result = result.filter(m => m.type === type);
    }

    if (filterQuery && filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort: Pinned first, then high importance, then newest
    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const importanceOrder: Record<MemoryImportance, number> = { high: 3, medium: 2, low: 1 };
      if (importanceOrder[a.importance] !== importanceOrder[b.importance]) {
        return importanceOrder[b.importance] - importanceOrder[a.importance];
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  public storeMemory(item: {
    type: MemoryType;
    title: string;
    content: string;
    tags?: string[];
    pinned?: boolean;
    importance?: MemoryImportance;
    sourceAgent?: string;
    metadata?: Record<string, any>;
  }): LongTermMemoryItem {
    const newItem: LongTermMemoryItem = {
      id: 'mem-' + Math.random().toString(36).substring(2, 9),
      type: item.type,
      title: item.title,
      content: item.content,
      tags: item.tags || ['general'],
      pinned: item.pinned || false,
      importance: item.importance || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceAgent: item.sourceAgent || 'Commander',
      metadata: item.metadata
    };

    this.memories.unshift(newItem);
    this.saveMemories();
    apiService.logActivity(`Stored Memory: ${newItem.title}`, 'note', `Type: ${newItem.type}`);
    return newItem;
  }

  public updateMemory(id: string, updates: Partial<LongTermMemoryItem>): LongTermMemoryItem {
    const index = this.memories.findIndex(m => m.id === id);
    if (index === -1) throw new Error(`Memory with ID ${id} not found.`);

    this.memories[index] = {
      ...this.memories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveMemories();
    apiService.logActivity(`Updated Memory: ${this.memories[index].title}`, 'note', `Type: ${this.memories[index].type}`);
    return this.memories[index];
  }

  public deleteMemory(id: string): void {
    const target = this.memories.find(m => m.id === id);
    this.memories = this.memories.filter(m => m.id !== id);
    this.saveMemories();
    if (target) {
      apiService.logActivity(`Deleted Memory: ${target.title}`, 'note', `Type: ${target.type}`);
    }
  }

  public togglePinMemory(id: string): LongTermMemoryItem {
    const item = this.memories.find(m => m.id === id);
    if (!item) throw new Error(`Memory with ID ${id} not found.`);
    item.pinned = !item.pinned;
    item.updatedAt = new Date().toISOString();
    this.saveMemories();
    return item;
  }

  public searchMemories(query: string): LongTermMemoryItem[] {
    return this.getMemories(undefined, query);
  }

  public getMemoryStats() {
    const total = this.memories.length;
    const pinned = this.memories.filter(m => m.pinned).length;
    const highImportance = this.memories.filter(m => m.importance === 'high').length;
    const recent = this.memories.filter(m => {
      const diffHours = (Date.now() - new Date(m.createdAt).getTime()) / (1000 * 3600);
      return diffHours <= 48;
    }).length;

    const byType: Record<string, number> = {};
    this.memories.forEach(m => {
      byType[m.type] = (byType[m.type] || 0) + 1;
    });

    const totalCharacters = this.memories.reduce((acc, m) => acc + m.title.length + m.content.length, 0);
    const approxKB = (totalCharacters / 1024).toFixed(1);

    return {
      total,
      pinned,
      highImportance,
      recent,
      byType,
      approxKB: parseFloat(approxKB)
    };
  }
}

export const memoryService = new LongTermMemoryService();
