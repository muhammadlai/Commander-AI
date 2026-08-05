import { GoogleTaskItem } from '../../types';
import { googleAccountService } from './googleAccountService';

const TASKS_STORAGE_KEY = 'commander_google_tasks_v1';

const INITIAL_TASKS: GoogleTaskItem[] = [
  {
    id: 'gtask-501',
    title: 'Review Q3 Executive Board Presentation',
    due: new Date(Date.now() + 86400000 * 1).toISOString(),
    status: 'needsAction',
    notes: 'Cross-check EBITDA projections on slide 12 with Sarah'
  },
  {
    id: 'gtask-502',
    title: 'Verify Google Workspace OAuth 2.0 Token Scopes',
    due: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'completed',
    notes: 'OAuth setup verified and stored token lifecycle verified'
  },
  {
    id: 'gtask-503',
    title: 'Approve Enterprise MSA Draft from Marcus',
    due: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'needsAction',
    notes: 'Contract duration set to 24 months'
  },
  {
    id: 'gtask-504',
    title: 'Deploy Plugin Engine v2.4 to Staging',
    due: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'needsAction',
    notes: 'Verify marketplace install and disable hooks'
  }
];

class TasksService {
  private tasks: GoogleTaskItem[] = [];

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        try {
          this.tasks = JSON.parse(stored);
        } catch {
          this.tasks = INITIAL_TASKS;
        }
      } else {
        this.tasks = INITIAL_TASKS;
        this.saveTasks();
      }
    } else {
      this.tasks = INITIAL_TASKS;
    }
  }

  private saveTasks() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks));
    }
  }

  public async getTasks(): Promise<GoogleTaskItem[]> {
    if (!googleAccountService.checkPermission('tasks')) {
      throw new Error('Google Tasks permission "tasks" not granted.');
    }
    return [...this.tasks];
  }

  public async toggleTaskStatus(taskId: string): Promise<GoogleTaskItem> {
    if (!googleAccountService.checkPermission('tasks')) {
      throw new Error('Google Tasks permission "tasks" not granted.');
    }
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error(`Task ${taskId} not found.`);

    task.status = task.status === 'completed' ? 'needsAction' : 'completed';
    this.saveTasks();
    return task;
  }

  public async addTask(title: string, notes?: string, due?: string): Promise<GoogleTaskItem> {
    if (!googleAccountService.checkPermission('tasks')) {
      throw new Error('Google Tasks permission "tasks" not granted.');
    }

    const newTask: GoogleTaskItem = {
      id: 'gtask-' + Math.random().toString(36).substring(2, 9),
      title,
      status: 'needsAction',
      notes: notes || 'Created via Commander OS',
      due: due || new Date(Date.now() + 86400000).toISOString()
    };

    this.tasks.unshift(newTask);
    this.saveTasks();
    return newTask;
  }
}

export const tasksService = new TasksService();
