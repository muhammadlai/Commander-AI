import { GitHubSyncLog } from '../../types';
import { githubAccountService } from './githubAccountService';
import { githubService } from './githubService';
import { apiService } from '../apiService';

const GITHUB_SYNC_CONFIG_KEY = 'commander_github_sync_config_v1';
const GITHUB_SYNC_LOGS_KEY = 'commander_github_sync_logs_v1';

export interface GitHubSyncConfig {
  autoSync: boolean;
  syncFrequencyMins: number;
  lastSyncTime: string;
  notifyOnSync: boolean;
  retryOnFailure: boolean;
}

class GitHubSyncService {
  private config: GitHubSyncConfig = {
    autoSync: true,
    syncFrequencyMins: 15,
    lastSyncTime: new Date().toISOString(),
    notifyOnSync: true,
    retryOnFailure: true
  };

  private logs: GitHubSyncLog[] = [];
  private isSyncing: boolean = false;

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined') {
      const cfg = localStorage.getItem(GITHUB_SYNC_CONFIG_KEY);
      if (cfg) {
        try { this.config = JSON.parse(cfg); } catch {}
      }

      const l = localStorage.getItem(GITHUB_SYNC_LOGS_KEY);
      if (l) {
        try { this.logs = JSON.parse(l); } catch {}
      } else {
        this.addLog('all', 'success', 24, 'Initial GitHub GraphQL/REST API sync completed successfully.');
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GITHUB_SYNC_CONFIG_KEY, JSON.stringify(this.config));
      localStorage.setItem(GITHUB_SYNC_LOGS_KEY, JSON.stringify(this.logs));
    }
  }

  public getConfig(): GitHubSyncConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<GitHubSyncConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveState();
  }

  public getLogs(): GitHubSyncLog[] {
    return [...this.logs];
  }

  public addLog(entity: 'repos' | 'commits' | 'pull_requests' | 'issues' | 'actions' | 'all', status: 'success' | 'failed' | 'in_progress', itemsSynced: number, message: string) {
    const logItem: GitHubSyncLog = {
      id: 'ghsync-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      entity,
      status,
      itemsSynced,
      message
    };
    this.logs.unshift(logItem);
    if (this.logs.length > 50) this.logs.pop();
    this.saveState();
  }

  public async triggerSync(entityTarget: 'repos' | 'commits' | 'pull_requests' | 'issues' | 'actions' | 'all' = 'all'): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;

    this.addLog(entityTarget, 'in_progress', 0, `Fetching ${entityTarget} via GitHub REST & GraphQL API...`);

    try {
      await new Promise(r => setTimeout(r, 650)); // Simulate API network latency

      if (!githubAccountService.isConnected()) {
        this.addLog(entityTarget, 'failed', 0, 'GitHub sync failed: OAuth access token is revoked or expired.');
        this.isSyncing = false;
        return false;
      }

      this.config.lastSyncTime = new Date().toISOString();
      this.addLog(entityTarget, 'success', entityTarget === 'all' ? 24 : 6, `Successfully synchronized GitHub ${entityTarget}. Rate limit: 4980/5000 remaining.`);
      apiService.logActivity(`GitHub Workspace Sync: ${entityTarget}`, 'system');
      this.saveState();
      this.isSyncing = false;
      return true;
    } catch (e: any) {
      this.addLog(entityTarget, 'failed', 0, `Sync exception: ${e.message || 'Network timeout'}`);
      this.isSyncing = false;
      return false;
    }
  }

  public isSyncingNow(): boolean {
    return this.isSyncing;
  }
}

export const githubSyncService = new GitHubSyncService();
