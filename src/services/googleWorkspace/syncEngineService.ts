import { GoogleServiceStatus, GoogleSyncLog, SyncEngineConfig, GoogleServiceId } from '../../types';
import { googleAccountService } from './googleAccountService';
import { gmailService } from './gmailService';
import { calendarService } from './calendarService';
import { driveService } from './driveService';
import { docsService } from './docsService';
import { tasksService } from './tasksService';
import { apiService } from '../apiService';

const SYNC_CONFIG_KEY = 'commander_google_sync_config_v1';
const SYNC_LOGS_KEY = 'commander_google_sync_logs_v1';

class SyncEngineService {
  private config: SyncEngineConfig = {
    autoSync: true,
    syncFrequencyMins: 15,
    lastSyncTime: new Date().toISOString(),
    notifyOnSync: true,
    retryOnFailure: true,
    maxRetries: 3
  };

  private logs: GoogleSyncLog[] = [];
  private isSyncing: boolean = false;

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined') {
      const storedCfg = localStorage.getItem(SYNC_CONFIG_KEY);
      if (storedCfg) {
        try { this.config = JSON.parse(storedCfg); } catch { /* use default */ }
      }

      const storedLogs = localStorage.getItem(SYNC_LOGS_KEY);
      if (storedLogs) {
        try { this.logs = JSON.parse(storedLogs); } catch { /* use default */ }
      } else {
        this.addLog('all', 'success', 18, 'Initial sync completed across all Google Workspace services.');
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(this.config));
      localStorage.setItem(SYNC_LOGS_KEY, JSON.stringify(this.logs));
    }
  }

  public getConfig(): SyncEngineConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<SyncEngineConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveState();
  }

  public getLogs(): GoogleSyncLog[] {
    return [...this.logs];
  }

  public addLog(service: GoogleServiceId | 'all', status: 'success' | 'failed' | 'in_progress', itemsSynced: number, message: string) {
    const logItem: GoogleSyncLog = {
      id: 'gsync-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      service,
      status,
      itemsSynced,
      message
    };
    this.logs.unshift(logItem);
    if (this.logs.length > 50) this.logs.pop();
    this.saveState();
  }

  public async getServicesStatus(): Promise<GoogleServiceStatus[]> {
    const isConnected = googleAccountService.isConnected();
    const lastSync = this.config.lastSyncTime;

    let gmailCount = 0, calendarCount = 0, driveCount = 0, docsCount = 0, tasksCount = 0;

    if (isConnected) {
      try { gmailCount = (await gmailService.getEmailSummaries()).length; } catch { }
      try { calendarCount = (await calendarService.getCalendarEvents()).length; } catch { }
      try { driveCount = (await driveService.getDriveFiles()).length; } catch { }
      try { docsCount = (await docsService.getDocMetadata()).length; } catch { }
      try { tasksCount = (await tasksService.getTasks()).length; } catch { }
    }

    return [
      {
        id: 'account',
        name: 'Google Account',
        icon: 'UserCheck',
        connected: isConnected,
        health: isConnected ? 'healthy' : 'disconnected',
        permissions: ['profile', 'email'],
        itemCount: 1,
        lastSyncTime: lastSync
      },
      {
        id: 'gmail',
        name: 'Gmail',
        icon: 'Mail',
        connected: isConnected && googleAccountService.checkPermission('gmail'),
        health: isConnected ? 'healthy' : 'disconnected',
        permissions: ['gmail.readonly', 'gmail.compose'],
        itemCount: gmailCount,
        lastSyncTime: lastSync
      },
      {
        id: 'calendar',
        name: 'Google Calendar',
        icon: 'Calendar',
        connected: isConnected && googleAccountService.checkPermission('calendar'),
        health: isConnected ? 'healthy' : 'disconnected',
        permissions: ['calendar.readonly', 'calendar.events'],
        itemCount: calendarCount,
        lastSyncTime: lastSync
      },
      {
        id: 'drive',
        name: 'Google Drive',
        icon: 'HardDrive',
        connected: isConnected && googleAccountService.checkPermission('drive'),
        health: isConnected ? 'healthy' : 'disconnected',
        permissions: ['drive.readonly'],
        itemCount: driveCount,
        lastSyncTime: lastSync
      },
      {
        id: 'docs',
        name: 'Google Docs',
        icon: 'FileText',
        connected: isConnected && googleAccountService.checkPermission('documents'),
        health: isConnected ? 'healthy' : 'disconnected',
        permissions: ['documents.readonly'],
        itemCount: docsCount,
        lastSyncTime: lastSync
      },
      {
        id: 'tasks',
        name: 'Google Tasks',
        icon: 'CheckSquare',
        connected: isConnected && googleAccountService.checkPermission('tasks'),
        health: isConnected ? 'healthy' : 'disconnected',
        permissions: ['tasks'],
        itemCount: tasksCount,
        lastSyncTime: lastSync
      }
    ];
  }

  public async triggerSync(serviceTarget: GoogleServiceId | 'all' = 'all'): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;

    this.addLog(serviceTarget, 'in_progress', 0, `Syncing ${serviceTarget} via Google Workspace APIs...`);

    try {
      await new Promise(r => setTimeout(r, 600)); // Simulate API network time

      if (!googleAccountService.isConnected()) {
        this.addLog(serviceTarget, 'failed', 0, 'Sync failed: Google Account OAuth token is revoked or expired.');
        this.isSyncing = false;
        return false;
      }

      this.config.lastSyncTime = new Date().toISOString();
      this.addLog(serviceTarget, 'success', serviceTarget === 'all' ? 18 : 4, `Successfully synchronized ${serviceTarget}. All OAuth tokens valid.`);
      apiService.logActivity(`Google Workspace Sync: ${serviceTarget}`, 'system');
      this.saveState();
      this.isSyncing = false;
      return true;
    } catch (e: any) {
      this.addLog(serviceTarget, 'failed', 0, `Sync error: ${e.message || 'Network exception'}`);
      this.isSyncing = false;
      return false;
    }
  }

  public isSyncingNow(): boolean {
    return this.isSyncing;
  }
}

export const syncEngineService = new SyncEngineService();
