import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Power, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Terminal, 
  Filter, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  Zap,
  Globe,
  GitBranch,
  Mail,
  HardDrive,
  Calendar,
  MessageSquare,
  Disc,
  BookOpen,
  Users,
  FolderTree,
  Send
} from 'lucide-react';
import { pluginService } from '../services/pluginService';
import { PluginItem, PluginCategory, PluginStatus, PluginLogRecord } from '../types';

export function PluginCenterView() {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [logs, setLogs] = useState<PluginLogRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace' | 'recent' | 'logs'>('installed');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<PluginItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPlugins(pluginService.getPlugins());
    setLogs(pluginService.getLogs());
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-5 h-5 text-cyan-400" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-purple-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-red-400" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-emerald-400" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-amber-400" />;
      case 'Disc': return <Disc className="w-5 h-5 text-indigo-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-pink-400" />;
      case 'Users': return <Users className="w-5 h-5 text-teal-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'FolderTree': return <FolderTree className="w-5 h-5 text-yellow-400" />;
      case 'Send': return <Send className="w-5 h-5 text-sky-400" />;
      default: return <Puzzle className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleToggleEnable = async (plugin: PluginItem) => {
    setIsProcessing(plugin.id);
    try {
      if (plugin.status === 'enabled') {
        await pluginService.disablePlugin(plugin.id);
      } else {
        await pluginService.enablePlugin(plugin.id);
      }
      refreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleInstall = async (pluginId: string) => {
    setIsProcessing(pluginId);
    try {
      await pluginService.installPlugin(pluginId);
      refreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUpdate = async (pluginId: string) => {
    setIsProcessing(pluginId);
    try {
      await pluginService.updatePlugin(pluginId);
      refreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemove = async (pluginId: string) => {
    setIsProcessing(pluginId);
    try {
      await pluginService.removePlugin(pluginId);
      if (selectedPlugin?.id === pluginId) setSelectedPlugin(null);
      refreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  const stats = pluginService.getPluginStats();

  // Filtering
  const filteredPlugins = plugins.filter(plugin => {
    const matchesTab = 
      activeTab === 'installed' ? plugin.installed :
      activeTab === 'marketplace' ? !plugin.installed :
      activeTab === 'recent' ? plugin.installed : true;

    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    
    const matchesSearch = searchQuery === '' || 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.permissions.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'google', label: 'Google Workspace' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'developer', label: 'Developer Tools' },
    { id: 'communication', label: 'Communication' },
    { id: 'data', label: 'Data & Analytics' },
    { id: 'system', label: 'System Bridge' },
    { id: 'utilities', label: 'Utilities' }
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Puzzle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Plugin Framework <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">v2.4 Extensible Engine</span>
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Manage modular extension packages, local service bridges, and permissions for Commander OS.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Refresh Engine
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Installed Extensions</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalInstalled}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Puzzle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Active / Enabled</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.totalEnabled}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Power className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Marketplace Ready</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{stats.totalAvailable}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <Download className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Executions</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.totalExecutions}</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('installed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'installed'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Installed Plugins ({stats.totalInstalled})
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'marketplace'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Download className="w-4 h-4" />
              Marketplace ({stats.totalAvailable})
            </button>

            <button
              onClick={() => setActiveTab('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'recent'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Recently Updated
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Execution Logs ({logs.length})
            </button>
          </div>

          {/* Search Bar */}
          {activeTab !== 'logs' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search plugins & permissions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
              />
            </div>
          )}
        </div>

        {/* Category Pills (Only for Plugin Lists) */}
        {activeTab !== 'logs' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-semibold'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        {activeTab === 'logs' ? (
          /* Execution Logs Stream */
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Live Plugin Engine Execution Stream
              </h3>
              <span className="text-xs text-slate-500 font-mono">{logs.length} events logged</span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No plugin execution logs recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5 font-mono text-xs max-h-[500px] overflow-y-auto pr-2">
                {logs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.level === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        log.level === 'warn' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        log.level === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {log.level}
                      </span>
                      <span className="font-semibold text-slate-300">[{log.pluginName}]</span>
                      <span className="text-slate-400">{log.message}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Plugin Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlugins.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
                <Puzzle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No plugins matched your filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-3 text-xs text-cyan-400 hover:underline font-semibold"
                >
                  Clear search and category filters
                </button>
              </div>
            ) : (
              filteredPlugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between transition group relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                    plugin.status === 'enabled' ? 'bg-emerald-500' :
                    plugin.status === 'disabled' ? 'bg-slate-700' :
                    'bg-cyan-500'
                  }`} />

                  <div>
                    {/* Plugin Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl group-hover:scale-105 transition">
                          {getIconComponent(plugin.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-base group-hover:text-cyan-300 transition flex items-center gap-2">
                            {plugin.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono text-slate-400">{plugin.version}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-500">{plugin.author}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 ${
                        plugin.status === 'enabled'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : plugin.status === 'disabled'
                          ? 'bg-slate-800/80 text-slate-400 border-slate-700/50'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      }`}>
                        {plugin.status === 'enabled' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {plugin.status === 'disabled' && <Power className="w-3 h-3 text-slate-500" />}
                        {plugin.status === 'available' && <Download className="w-3 h-3 text-cyan-400" />}
                        <span className="capitalize">{plugin.status}</span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {plugin.description}
                    </p>

                    {/* Permissions Badges */}
                    <div className="mb-4">
                      <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-500" /> Required Permissions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {plugin.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded text-[10px] font-mono"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Controls */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>{plugin.executionTimeMs}ms avg</span>
                      <span>•</span>
                      <span>{plugin.usageCount} calls</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* View Details Modal Trigger */}
                      <button
                        onClick={() => setSelectedPlugin(plugin)}
                        className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                        title="View Manifest & Settings"
                      >
                        Details
                      </button>

                      {/* Enable / Disable Button */}
                      {plugin.installed ? (
                        <>
                          <button
                            onClick={() => handleToggleEnable(plugin)}
                            disabled={isProcessing === plugin.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                              plugin.status === 'enabled'
                                ? 'bg-slate-800 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 hover:border hover:border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            {plugin.status === 'enabled' ? 'Disable' : 'Enable'}
                          </button>

                          <button
                            onClick={() => handleUpdate(plugin.id)}
                            disabled={isProcessing === plugin.id}
                            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 rounded-lg text-xs transition"
                            title="Check & Update Plugin"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing === plugin.id ? 'animate-spin' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleRemove(plugin.id)}
                            disabled={isProcessing === plugin.id}
                            className="p-1.5 bg-slate-800/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition"
                            title="Remove Plugin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        /* Install Button */
                        <button
                          onClick={() => handleInstall(plugin.id)}
                          disabled={isProcessing === plugin.id}
                          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {isProcessing === plugin.id ? 'Installing...' : 'Install'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Plugin Details Modal */}
        {selectedPlugin && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-800 border border-slate-700/60 rounded-xl">
                    {getIconComponent(selectedPlugin.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPlugin.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-cyan-400">{selectedPlugin.version}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">Author: {selectedPlugin.author}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlugin(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Plugin Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Plugin Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  {selectedPlugin.description}
                </p>
              </div>

              {/* Manifest Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">HEALTH</span>
                  <span className="text-emerald-400 font-semibold uppercase">{selectedPlugin.health}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">STATUS</span>
                  <span className="text-cyan-400 font-semibold uppercase">{selectedPlugin.status}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">AVG EXECUTION</span>
                  <span className="text-amber-400 font-semibold">{selectedPlugin.executionTimeMs} ms</span>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Required Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlugin.permissions.map((p) => (
                    <span key={p} className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md text-xs font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Internal Logs */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Internal Plugin Logs</h4>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1 max-h-36 overflow-y-auto">
                  {selectedPlugin.logs.map((log, idx) => (
                    <div key={idx} className="text-slate-400">{log}</div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedPlugin(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
                >
                  Close
                </button>

                {selectedPlugin.installed ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleEnable(selectedPlugin)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedPlugin.status === 'enabled'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {selectedPlugin.status === 'enabled' ? 'Disable Plugin' : 'Enable Plugin'}
                    </button>
                    <button
                      onClick={() => handleRemove(selectedPlugin.id)}
                      className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 rounded-lg text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleInstall(selectedPlugin.id)}
                    className="px-5 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-lg text-sm transition"
                  >
                    Install Plugin
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
