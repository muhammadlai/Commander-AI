import { PluginItem, PluginLogRecord, PluginStatus, PluginHealth, PluginCategory } from '../types';
import { apiService } from './apiService';

const PLUGIN_STORAGE_KEY = 'commander_plugins_registry_v1';
const PLUGIN_LOGS_STORAGE_KEY = 'commander_plugin_logs_v1';

const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'google-plugin',
    name: 'Google Workspace Plugin',
    version: 'v2.1.0',
    author: 'Commander AI Labs',
    description: 'Provides unified local bridge for Google Search, Docs, and Workspace operations.',
    category: 'google',
    icon: 'Search',
    permissions: ['google.read', 'google.search', 'workspace.access'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 2).toISOString(),
    executionTimeMs: 18,
    usageCount: 142,
    rating: 4.9,
    logs: ['[INIT] Google Workspace Plugin loaded', '[HEALTH] API Bridge healthy'],
    config: { defaultSearchRegion: 'global', cacheTimeoutMs: 300000 }
  },
  {
    id: 'github-plugin',
    name: 'GitHub Plugin',
    version: 'v1.8.4',
    author: 'Commander Developer Network',
    description: 'Integrates local repo inspection, issue management, PR reviews, and CI workflow status.',
    category: 'developer',
    icon: 'GitBranch',
    permissions: ['repo.read', 'issues.write', 'pulls.read'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 4).toISOString(),
    executionTimeMs: 24,
    usageCount: 98,
    rating: 4.8,
    logs: ['[INIT] GitHub Plugin mounted', '[AUTH] Mock GitHub Token active'],
    config: { defaultRepo: 'commander-ai/core', autoCheckPRs: true }
  },
  {
    id: 'gmail-plugin',
    name: 'Gmail Plugin',
    version: 'v2.0.1',
    author: 'Commander Communications',
    description: 'Executive email synthesis, priority inbox indexing, draft creation, and auto-summarization.',
    category: 'google',
    icon: 'Mail',
    permissions: ['mail.read', 'mail.send', 'mail.drafts'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 1).toISOString(),
    executionTimeMs: 15,
    usageCount: 86,
    rating: 4.7,
    logs: ['[INIT] Gmail Plugin synchronized', '[INDEX] 14 executive threads cached'],
    config: { prioritySenderFilter: 'executive', autoSummarizeLength: 'short' }
  },
  {
    id: 'gdrive-plugin',
    name: 'Google Drive Plugin',
    version: 'v1.5.2',
    author: 'Commander Storage',
    description: 'Cloud document tree indexing, file search, folder mirroring, and permissions manager.',
    category: 'google',
    icon: 'HardDrive',
    permissions: ['drive.readonly', 'drive.file', 'drive.metadata'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: false,
    lastUpdate: new Date(Date.now() - 86400000 * 6).toISOString(),
    executionTimeMs: 32,
    usageCount: 64,
    rating: 4.6,
    logs: ['[INIT] Google Drive Plugin active', '[SYNC] Root folder indexed'],
    config: { syncIntervalMins: 15, maxCacheMB: 50 }
  },
  {
    id: 'calendar-plugin',
    name: 'Calendar Plugin',
    version: 'v1.4.0',
    author: 'Commander Productivity',
    description: 'Executive agenda management, smart time-blocking, meeting conflict resolution, and reminders.',
    category: 'productivity',
    icon: 'Calendar',
    permissions: ['calendar.read', 'calendar.events', 'notifications.push'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 3).toISOString(),
    executionTimeMs: 12,
    usageCount: 110,
    rating: 4.9,
    logs: ['[INIT] Calendar Plugin synchronized', '[AGENDA] 4 meetings today'],
    config: { bufferTimeMinutes: 10, timezone: 'UTC-7' }
  },
  {
    id: 'slack-plugin',
    name: 'Slack Plugin',
    version: 'v1.6.0',
    author: 'Commander Comms',
    description: 'Real-time channel messaging, direct message dispatch, thread summary, and status updates.',
    category: 'communication',
    icon: 'MessageSquare',
    permissions: ['channels.read', 'chat.write', 'users.read'],
    status: 'disabled',
    health: 'inactive',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 8).toISOString(),
    executionTimeMs: 20,
    usageCount: 35,
    rating: 4.5,
    logs: ['[SHUTDOWN] Slack Plugin placed in inactive standby'],
    config: { defaultChannel: '#commander-ops', notifyMentionsOnly: true }
  },
  {
    id: 'discord-plugin',
    name: 'Discord Plugin',
    version: 'v1.2.1',
    author: 'Commander Community',
    description: 'Community server monitoring, automated announcements, and role permissions manager.',
    category: 'communication',
    icon: 'Disc',
    permissions: ['guilds.read', 'messages.send', 'webhooks.manage'],
    status: 'disabled',
    health: 'inactive',
    installed: true,
    autoUpdate: false,
    lastUpdate: new Date(Date.now() - 86400000 * 12).toISOString(),
    executionTimeMs: 28,
    usageCount: 19,
    rating: 4.4,
    logs: ['[SHUTDOWN] Discord Plugin disabled by user'],
    config: { botStatus: 'Online', guildId: '987654321' }
  },
  {
    id: 'notion-plugin',
    name: 'Notion Plugin',
    version: 'v1.9.0',
    author: 'Commander Knowledge',
    description: 'Workspace page sync, database query, board management, and page template generator.',
    category: 'productivity',
    icon: 'BookOpen',
    permissions: ['notion.read', 'notion.write', 'databases.query'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 2).toISOString(),
    executionTimeMs: 22,
    usageCount: 78,
    rating: 4.8,
    logs: ['[INIT] Notion Plugin synchronized', '[DB] Executive Wiki connected'],
    config: { defaultDatabase: 'Roadmap & Specs' }
  },
  {
    id: 'crm-plugin',
    name: 'CRM Plugin',
    version: 'v2.2.0',
    author: 'Commander Enterprise',
    description: 'Client pipeline tracking, deal status forecasting, lead scoring, and account activity logs.',
    category: 'data',
    icon: 'Users',
    permissions: ['crm.leads', 'crm.deals', 'crm.analytics'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 5).toISOString(),
    executionTimeMs: 30,
    usageCount: 52,
    rating: 4.7,
    logs: ['[INIT] CRM Plugin loaded', '[PIPELINE] $1.2M active deals tracked'],
    config: { currency: 'USD', minDealScore: 70 }
  },
  {
    id: 'browser-plugin',
    name: 'Browser Web Automation Plugin',
    version: 'v1.3.5',
    author: 'Commander Web Labs',
    description: 'Headless DOM scraping, link verification, webpage snapshotting, and web content extraction.',
    category: 'utilities',
    icon: 'Globe',
    permissions: ['web.fetch', 'dom.extract', 'cookies.manage'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 3).toISOString(),
    executionTimeMs: 45,
    usageCount: 88,
    rating: 4.6,
    logs: ['[INIT] Browser Plugin initialized', '[SANDBOX] Headless engine ready'],
    config: { userAgent: 'Commander-Web-Agent/2.0', timeoutMs: 10000 }
  },
  {
    id: 'fs-plugin',
    name: 'File System Bridge Plugin',
    version: 'v2.0.0',
    author: 'Commander System Core',
    description: 'Deep virtual file system indexing, batch file transformation, and archive processing.',
    category: 'system',
    icon: 'FolderTree',
    permissions: ['fs.read', 'fs.write', 'fs.index'],
    status: 'enabled',
    health: 'healthy',
    installed: true,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 1).toISOString(),
    executionTimeMs: 10,
    usageCount: 165,
    rating: 4.9,
    logs: ['[INIT] File System Bridge mounted', '[VIRTUAL] Root file system connected'],
    config: { maxFileSizeMB: 100, allowBatchOperations: true }
  },
  {
    id: 'email-plugin',
    name: 'Universal Email Dispatcher Plugin',
    version: 'v1.1.0',
    author: 'Commander Comms',
    description: 'SMTP/IMAP bridge for multi-provider email dispatch and automated response pipelines.',
    category: 'communication',
    icon: 'Send',
    permissions: ['smtp.send', 'imap.fetch'],
    status: 'available',
    health: 'inactive',
    installed: false,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 10).toISOString(),
    executionTimeMs: 0,
    usageCount: 0,
    rating: 4.3,
    logs: ['[MARKETPLACE] Ready for installation'],
    config: { defaultPort: 587, ssl: true }
  },
  {
    id: 'search-engine-plugin',
    name: 'Executive Web Search Plugin',
    version: 'v2.5.0',
    author: 'Commander AI Labs',
    description: 'Multi-source real-time search aggregation, academic paper index, and news intelligence.',
    category: 'data',
    icon: 'Search',
    permissions: ['search.aggregate', 'news.fetch'],
    status: 'available',
    health: 'inactive',
    installed: false,
    autoUpdate: true,
    lastUpdate: new Date(Date.now() - 86400000 * 7).toISOString(),
    executionTimeMs: 0,
    usageCount: 0,
    rating: 4.9,
    logs: ['[MARKETPLACE] Ready for installation'],
    config: { safeSearch: true, maxResults: 20 }
  }
];

class PluginManagerService {
  private plugins: PluginItem[] = [];
  private logs: PluginLogRecord[] = [];

  constructor() {
    this.loadPlugins();
  }

  private loadPlugins() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PLUGIN_STORAGE_KEY);
      if (stored) {
        try {
          this.plugins = JSON.parse(stored);
        } catch {
          this.plugins = INITIAL_PLUGINS;
        }
      } else {
        this.plugins = INITIAL_PLUGINS;
        this.savePlugins();
      }

      const storedLogs = localStorage.getItem(PLUGIN_LOGS_STORAGE_KEY);
      if (storedLogs) {
        try {
          this.logs = JSON.parse(storedLogs);
        } catch {
          this.logs = [];
        }
      }
    } else {
      this.plugins = INITIAL_PLUGINS;
    }
  }

  private savePlugins() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLUGIN_STORAGE_KEY, JSON.stringify(this.plugins));
      localStorage.setItem(PLUGIN_LOGS_STORAGE_KEY, JSON.stringify(this.logs));
    }
  }

  public addLog(pluginId: string, level: 'info' | 'warn' | 'error' | 'success', message: string) {
    const plugin = this.getPlugin(pluginId);
    const pluginName = plugin ? plugin.name : pluginId;
    const logRec: PluginLogRecord = {
      id: 'plog-' + Math.random().toString(36).substring(2, 9),
      pluginId,
      pluginName,
      timestamp: new Date().toISOString(),
      level,
      message
    };

    this.logs.unshift(logRec);
    if (this.logs.length > 100) this.logs.pop();

    if (plugin) {
      plugin.logs.unshift(`[${new Date().toLocaleTimeString()}] [${level.toUpperCase()}] ${message}`);
      if (plugin.logs.length > 20) plugin.logs.pop();
    }

    this.savePlugins();
  }

  public getPlugins(): PluginItem[] {
    return [...this.plugins];
  }

  public getPlugin(pluginId: string): PluginItem | undefined {
    return this.plugins.find(p => p.id === pluginId);
  }

  public getLogs(): PluginLogRecord[] {
    return [...this.logs];
  }

  // Lifecycle Methods
  public initialize(pluginId: string): void {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) return;
    plugin.health = 'healthy';
    this.addLog(pluginId, 'info', `Initialized plugin version ${plugin.version}`);
  }

  public async enablePlugin(pluginId: string): Promise<PluginItem> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found.`);

    plugin.status = 'enabled';
    plugin.health = 'healthy';
    this.addLog(pluginId, 'success', `Plugin enabled and mounted into Commander runtime.`);
    apiService.logActivity(`Enabled Plugin: ${plugin.name}`, 'system');
    this.savePlugins();
    return plugin;
  }

  public async disablePlugin(pluginId: string): Promise<PluginItem> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found.`);

    plugin.status = 'disabled';
    plugin.health = 'inactive';
    this.addLog(pluginId, 'warn', `Plugin disabled and placed in standby.`);
    apiService.logActivity(`Disabled Plugin: ${plugin.name}`, 'system');
    this.savePlugins();
    return plugin;
  }

  public async installPlugin(pluginId: string): Promise<PluginItem> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found.`);

    plugin.status = 'installing';
    this.addLog(pluginId, 'info', `Installing plugin package from marketplace...`);

    // Simulate install time
    await new Promise(r => setTimeout(r, 800));

    plugin.installed = true;
    plugin.status = 'enabled';
    plugin.health = 'healthy';
    plugin.lastUpdate = new Date().toISOString();
    this.addLog(pluginId, 'success', `Plugin installed successfully and enabled.`);
    apiService.logActivity(`Installed Plugin: ${plugin.name}`, 'system');
    this.savePlugins();
    return plugin;
  }

  public async updatePlugin(pluginId: string): Promise<PluginItem> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found.`);

    plugin.status = 'updating';
    this.addLog(pluginId, 'info', `Updating plugin package...`);

    await new Promise(r => setTimeout(r, 600));

    const patchNum = parseInt(plugin.version.split('.').pop() || '0') + 1;
    const parts = plugin.version.split('.');
    parts[parts.length - 1] = patchNum.toString();
    plugin.version = parts.join('.');

    plugin.status = 'enabled';
    plugin.health = 'healthy';
    plugin.lastUpdate = new Date().toISOString();
    this.addLog(pluginId, 'success', `Plugin updated to version ${plugin.version}`);
    apiService.logActivity(`Updated Plugin: ${plugin.name}`, 'system');
    this.savePlugins();
    return plugin;
  }

  public async removePlugin(pluginId: string): Promise<PluginItem> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found.`);

    plugin.installed = false;
    plugin.status = 'available';
    plugin.health = 'inactive';
    this.addLog(pluginId, 'warn', `Plugin removed from Commander OS runtime.`);
    apiService.logActivity(`Removed Plugin: ${plugin.name}`, 'system');
    this.savePlugins();
    return plugin;
  }

  public async executePlugin(pluginId: string, action: string, params: any = {}): Promise<any> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found.`);

    if (!plugin.installed || plugin.status !== 'enabled') {
      throw new Error(`Plugin "${plugin.name}" is currently disabled or not installed.`);
    }

    const start = performance.now();
    this.addLog(pluginId, 'info', `Executing action "${action}" with parameters: ${JSON.stringify(params)}`);

    let result = {
      pluginId,
      pluginName: plugin.name,
      action,
      executedAt: new Date().toISOString(),
      status: 'success',
      data: { message: `Executed ${action} via ${plugin.name} (Mock API Bridge)`, params }
    };

    const duration = Math.round(performance.now() - start);
    plugin.executionTimeMs = duration;
    plugin.usageCount += 1;
    this.savePlugins();

    return result;
  }

  public healthCheck(pluginId: string): PluginHealth {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) return 'error';
    return plugin.health;
  }

  public getPluginStats() {
    const installed = this.plugins.filter(p => p.installed);
    const enabled = installed.filter(p => p.status === 'enabled');
    const available = this.plugins.filter(p => !p.installed);
    const totalExecutions = installed.reduce((acc, p) => acc + p.usageCount, 0);

    return {
      totalInstalled: installed.length,
      totalEnabled: enabled.length,
      totalAvailable: available.length,
      totalExecutions
    };
  }
}

export const pluginService = new PluginManagerService();
