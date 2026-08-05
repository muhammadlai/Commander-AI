import { VirtualFileItem } from '../types';
import { apiService } from './apiService';

const VIRTUAL_FS_STORAGE_KEY = 'commander_virtual_fs_v1';

const INITIAL_FILESYSTEM: VirtualFileItem[] = [
  {
    id: 'folder-doc',
    name: 'Documents',
    type: 'folder',
    parentId: null,
    sizeBytes: 0,
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'folder-proj',
    name: 'Projects',
    type: 'folder',
    parentId: null,
    sizeBytes: 0,
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'folder-sys',
    name: 'System_Logs',
    type: 'folder',
    parentId: null,
    sizeBytes: 0,
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'file-01',
    name: 'architecture_v1.md',
    type: 'file',
    parentId: 'folder-doc',
    sizeBytes: 2420,
    mimeType: 'text/markdown',
    tags: ['architecture', 'commander', 'system'],
    content: `# Commander AI OS Architecture Spec
- **Role**: AI CEO & System Orchestrator
- **Sub-Agents**: Atlas, Nova, Forge, Titan, Vault, Echo, Orbit, Sentinel
- **Tool Engine**: 8 Modular Tools (Notes, Task, File, Search, Memory, Calc, Workflow, Report)
- **Memory Architecture**: Long-Term Storage with 8 Memory Types`,
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'file-02',
    name: 'project_roadmap.json',
    type: 'file',
    parentId: 'folder-proj',
    sizeBytes: 1540,
    mimeType: 'application/json',
    tags: ['roadmap', 'sprint'],
    content: `{\n  "phase": "3.2",\n  "milestone": "AI OS Tool Engine & Memory",\n  "status": "In Development",\n  "completion": 95\n}`,
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'file-03',
    name: 'security_audit.log',
    type: 'file',
    parentId: 'folder-sys',
    sizeBytes: 3120,
    mimeType: 'text/plain',
    tags: ['security', 'sentinel', 'audit'],
    content: `[AUDIT LOG - SENTINEL]
[00:01:12] Sandbox initialized. Zero external egress violations.
[00:01:14] Tool permission levels verified: System, User, Admin.
[00:01:18] Local virtual file system isolation: Active.`,
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

class VirtualFileService {
  private items: VirtualFileItem[] = [];

  constructor() {
    this.loadFS();
  }

  private loadFS() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(VIRTUAL_FS_STORAGE_KEY);
      if (stored) {
        try {
          this.items = JSON.parse(stored);
        } catch {
          this.items = INITIAL_FILESYSTEM;
        }
      } else {
        this.items = INITIAL_FILESYSTEM;
        this.saveFS();
      }
    } else {
      this.items = INITIAL_FILESYSTEM;
    }
  }

  private saveFS() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIRTUAL_FS_STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  public getItems(parentId: string | null = null): VirtualFileItem[] {
    return this.items.filter(item => item.parentId === parentId);
  }

  public getAllFiles(): VirtualFileItem[] {
    return [...this.items];
  }

  public createFile(name: string, content: string, parentId: string | null = null, mimeType: string = 'text/plain'): VirtualFileItem {
    const newItem: VirtualFileItem = {
      id: 'file-' + Math.random().toString(36).substring(2, 8),
      name,
      type: 'file',
      parentId,
      sizeBytes: new Blob([content]).size,
      mimeType,
      content,
      tags: ['local'],
      updatedAt: new Date().toISOString()
    };

    this.items.push(newItem);
    this.saveFS();
    apiService.logActivity(`Virtual File Created: ${name}`, 'project', `Path: ${parentId || 'root'}`);
    return newItem;
  }

  public createFolder(name: string, parentId: string | null = null): VirtualFileItem {
    const newFolder: VirtualFileItem = {
      id: 'folder-' + Math.random().toString(36).substring(2, 8),
      name,
      type: 'folder',
      parentId,
      sizeBytes: 0,
      updatedAt: new Date().toISOString()
    };

    this.items.push(newFolder);
    this.saveFS();
    apiService.logActivity(`Virtual Folder Created: ${name}`, 'project', `Path: ${parentId || 'root'}`);
    return newFolder;
  }

  public renameItem(id: string, newName: string): VirtualFileItem {
    const item = this.items.find(i => i.id === id);
    if (!item) throw new Error(`File item ${id} not found.`);
    item.name = newName;
    item.updatedAt = new Date().toISOString();
    this.saveFS();
    return item;
  }

  public deleteItem(id: string): void {
    // Delete target and any child items recursively
    const toDelete = new Set<string>([id]);
    
    let changed = true;
    while (changed) {
      changed = false;
      this.items.forEach(item => {
        if (item.parentId && toDelete.has(item.parentId) && !toDelete.has(item.id)) {
          toDelete.add(item.id);
          changed = true;
        }
      });
    }

    this.items = this.items.filter(item => !toDelete.has(item.id));
    this.saveFS();
    apiService.logActivity(`Virtual FS Deleted Item: ${id}`, 'project');
  }

  public moveItem(id: string, newParentId: string | null): VirtualFileItem {
    const item = this.items.find(i => i.id === id);
    if (!item) throw new Error(`File item ${id} not found.`);
    item.parentId = newParentId;
    item.updatedAt = new Date().toISOString();
    this.saveFS();
    return item;
  }

  public searchFiles(query: string): VirtualFileItem[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return this.items.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  public getRecentFiles(limit: number = 5): VirtualFileItem[] {
    return this.items
      .filter(i => i.type === 'file')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }
}

export const virtualFileService = new VirtualFileService();
