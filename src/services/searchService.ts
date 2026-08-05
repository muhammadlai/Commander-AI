import { SearchResultItem } from '../types';
import { apiService } from './apiService';
import { memoryService } from './memoryService';
import { virtualFileService } from './fileService';

class UnifiedSearchService {
  public async searchAll(query: string): Promise<{
    query: string;
    totalCount: number;
    results: SearchResultItem[];
    byCategory: {
      tasks: SearchResultItem[];
      notes: SearchResultItem[];
      projects: SearchResultItem[];
      memories: SearchResultItem[];
      files: SearchResultItem[];
      conversations: SearchResultItem[];
    };
  }> {
    if (!query.trim()) {
      return {
        query: '',
        totalCount: 0,
        results: [],
        byCategory: { tasks: [], notes: [], projects: [], memories: [], files: [], conversations: [] }
      };
    }

    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // 1. Search Tasks
    const tasks = await apiService.getTasks();
    const taskResults: SearchResultItem[] = tasks
      .filter(t => t.title.toLowerCase().includes(q))
      .map(t => ({
        id: `sr-task-${t.id}`,
        title: t.title,
        snippet: `Task Status: ${t.completed ? 'Completed' : 'Pending'} • Priority: ${t.priority.toUpperCase()}`,
        type: 'task' as const,
        updatedAt: t.createdAt || new Date().toISOString(),
        metadata: t
      }));
    results.push(...taskResults);

    // 2. Search Notes
    const notes = await apiService.getPinnedNotes();
    const noteResults: SearchResultItem[] = notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .map(n => ({
        id: `sr-note-${n.id}`,
        title: n.title,
        snippet: n.content.substring(0, 100) + (n.content.length > 100 ? '...' : ''),
        type: 'note' as const,
        updatedAt: n.updatedAt,
        metadata: n
      }));
    results.push(...noteResults);

    // 3. Search Projects
    const projects = await apiService.getProjects();
    const projectResults: SearchResultItem[] = projects
      .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .map(p => ({
        id: `sr-proj-${p.id}`,
        title: p.name,
        snippet: p.description,
        type: 'project' as const,
        updatedAt: p.lastUpdated,
        metadata: p
      }));
    results.push(...projectResults);

    // 4. Search Long-Term Memories
    const memories = memoryService.searchMemories(q);
    const memoryResults: SearchResultItem[] = memories.map(m => ({
      id: `sr-mem-${m.id}`,
      title: m.title,
      snippet: `[${m.type}] ${m.content.substring(0, 100)}${m.content.length > 100 ? '...' : ''}`,
      type: 'memory' as const,
      updatedAt: m.updatedAt,
      metadata: m
    }));
    results.push(...memoryResults);

    // 5. Search Virtual Files
    const files = virtualFileService.searchFiles(q);
    const fileResults: SearchResultItem[] = files.map(f => ({
      id: `sr-file-${f.id}`,
      title: f.name,
      snippet: f.type === 'folder' ? 'Virtual Folder' : (f.content ? f.content.substring(0, 100) : 'File Item'),
      type: 'file' as const,
      updatedAt: f.updatedAt,
      metadata: f
    }));
    results.push(...fileResults);

    // 6. Search Chat Conversations
    const conversations = await apiService.getConversations();
    const convResults: SearchResultItem[] = conversations
      .filter(c => c.title.toLowerCase().includes(q) || c.messages.some(m => m.text.toLowerCase().includes(q)))
      .map(c => ({
        id: `sr-conv-${c.id}`,
        title: c.title,
        snippet: `Session with ${c.messages.length} messages`,
        type: 'conversation' as const,
        updatedAt: c.updatedAt,
        metadata: c
      }));
    results.push(...convResults);

    return {
      query,
      totalCount: results.length,
      results,
      byCategory: {
        tasks: taskResults,
        notes: noteResults,
        projects: projectResults,
        memories: memoryResults,
        files: fileResults,
        conversations: convResults
      }
    };
  }
}

export const searchService = new UnifiedSearchService();
