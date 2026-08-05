import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Mail, 
  Calendar, 
  HardDrive, 
  FileText, 
  CheckSquare, 
  UserCheck, 
  RefreshCw, 
  LogOut, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Send, 
  Sliders, 
  FileCode, 
  ArrowUpRight, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Settings,
  Bell
} from 'lucide-react';
import { 
  googleAccountService, 
  gmailService, 
  calendarService, 
  driveService, 
  docsService, 
  tasksService, 
  syncEngineService 
} from '../services/googleWorkspace';
import { 
  GoogleAccountInfo, 
  GoogleServiceStatus, 
  GmailSummaryItem, 
  CalendarEventItem, 
  DriveFileItem, 
  DocMetadataItem, 
  GoogleTaskItem, 
  GoogleSyncLog, 
  SyncEngineConfig,
  GoogleServiceId
} from '../types';

export function GoogleWorkspaceView() {
  const [account, setAccount] = useState<GoogleAccountInfo | null>(null);
  const [servicesStatus, setServicesStatus] = useState<GoogleServiceStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'gmail' | 'calendar' | 'drive' | 'tasks' | 'sync-logs' | 'settings'>('overview');
  
  // Data states
  const [emails, setEmails] = useState<GmailSummaryItem[]>([]);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [docs, setDocs] = useState<DocMetadataItem[]>([]);
  const [tasks, setTasks] = useState<GoogleTaskItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<GoogleSyncLog[]>([]);
  const [syncConfig, setSyncConfig] = useState<SyncEngineConfig>(syncEngineService.getConfig());

  // Search & Action States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals for Actions Requiring Confirmation
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftRecipient, setDraftRecipient] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 16));

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    const acc = googleAccountService.getAccount();
    setAccount(acc);

    const statuses = await syncEngineService.getServicesStatus();
    setServicesStatus(statuses);

    setSyncLogs(syncEngineService.getLogs());
    setSyncConfig(syncEngineService.getConfig());

    if (googleAccountService.isConnected()) {
      try { setEmails(await gmailService.getEmailSummaries()); } catch {}
      try { setEvents(await calendarService.getCalendarEvents()); } catch {}
      try { setFiles(await driveService.getDriveFiles()); } catch {}
      try { setDocs(await docsService.getDocMetadata()); } catch {}
      try { setTasks(await tasksService.getTasks()); } catch {}
    }
  };

  const handleManualSync = async (service: GoogleServiceId | 'all' = 'all') => {
    setIsSyncing(true);
    setStatusMessage(`Synchronizing ${service}...`);
    const success = await syncEngineService.triggerSync(service);
    setIsSyncing(false);
    if (success) {
      setStatusMessage('Sync completed successfully!');
    } else {
      setStatusMessage('Sync failed. Please check token permissions.');
    }
    await refreshAllData();
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleReconnect = async () => {
    await googleAccountService.connectGoogleAccount();
    await handleManualSync();
  };

  const handleDisconnect = async () => {
    await googleAccountService.disconnectGoogleAccount();
    await refreshAllData();
  };

  // Gmail Draft Action with Mandatory Confirmation
  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftRecipient || !draftSubject) return;

    try {
      await gmailService.draftEmail(draftRecipient, draftSubject, draftBody);
      setShowDraftModal(false);
      setDraftRecipient('');
      setDraftSubject('');
      setDraftBody('');
      setStatusMessage('Gmail draft created successfully for user review!');
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create email draft');
    }
  };

  // Calendar Event Action with Confirmation
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    try {
      await calendarService.createCalendarEvent(eventTitle, eventDate);
      setShowEventModal(false);
      setEventTitle('');
      setStatusMessage('Calendar event scheduled successfully!');
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create calendar event');
    }
  };

  // Task Creation Action
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    try {
      await tasksService.addTask(newTaskTitle);
      setShowTaskModal(false);
      setNewTaskTitle('');
      setStatusMessage('Google Task added successfully!');
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create Google task');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await tasksService.toggleTaskStatus(taskId);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Task status update failed');
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Google Workspace Integration <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">OAuth 2.0 Connected</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Official Google Workspace APIs bridge for Gmail, Calendar, Drive, Docs, and Tasks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleManualSync('all')}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-cyan-500/10"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Workspace'}
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            {statusMessage}
          </div>
        )}

        {/* Account Connection Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={account?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={account?.name}
              className="w-14 h-14 rounded-2xl border-2 border-cyan-500/40 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{account?.name || 'Aitzaz CEO'}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  account?.tokenStatus === 'valid'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  Token: {account?.tokenStatus}
                </span>
              </div>
              <p className="text-sm font-mono text-slate-400 mt-0.5">{account?.email || 'aitzazji91@gmail.com'}</p>
              <p className="text-xs text-slate-500 mt-1">
                Scopes Granted: <span className="text-cyan-400 font-mono font-medium">{account?.scopes.length || 9} Scopes</span> • Connected {new Date(account?.connectedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {googleAccountService.isConnected() ? (
              <>
                <button
                  onClick={handleReconnect}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  Refresh Token
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect Google
                </button>
              </>
            ) : (
              <button
                onClick={handleReconnect}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>

        {/* Modular Connected Services Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {servicesStatus.map((service) => (
            <div
              key={service.id}
              onClick={() => {
                if (service.id === 'gmail') setActiveTab('gmail');
                else if (service.id === 'calendar') setActiveTab('calendar');
                else if (service.id === 'drive' || service.id === 'docs') setActiveTab('drive');
                else if (service.id === 'tasks') setActiveTab('tasks');
                else setActiveTab('overview');
              }}
              className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 cursor-pointer transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-slate-800 rounded-xl text-cyan-400 group-hover:scale-110 transition">
                  {service.id === 'account' && <UserCheck className="w-4 h-4" />}
                  {service.id === 'gmail' && <Mail className="w-4 h-4 text-red-400" />}
                  {service.id === 'calendar' && <Calendar className="w-4 h-4 text-blue-400" />}
                  {service.id === 'drive' && <HardDrive className="w-4 h-4 text-emerald-400" />}
                  {service.id === 'docs' && <FileText className="w-4 h-4 text-amber-400" />}
                  {service.id === 'tasks' && <CheckSquare className="w-4 h-4 text-sky-400" />}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  service.connected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'
                }`} />
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">{service.name}</h4>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">{service.itemCount} items synced</p>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{service.permissions.length} Scopes</span>
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition" />
              </div>
            </div>
          ))}
        </div>

        {/* Primary View Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Activity
          </button>

          <button
            onClick={() => setActiveTab('gmail')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'gmail'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            Gmail ({emails.length})
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'calendar'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Calendar ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            Drive & Docs ({files.length})
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
            Google Tasks ({tasks.length})
          </button>

          <button
            onClick={() => setActiveTab('sync-logs')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sync-logs'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Sync Logs ({syncLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            Settings
          </button>
        </div>

        {/* Tab Content Panes */}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Executive Gmail Summaries Widget */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400" />
                    Latest Gmail Executive Summaries
                  </h3>
                  <button
                    onClick={() => setShowDraftModal(true)}
                    className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Draft Email
                  </button>
                </div>

                <div className="space-y-3">
                  {emails.slice(0, 3).map((email) => (
                    <div key={email.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{email.sender}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <h4 className="text-xs font-medium text-cyan-300">{email.subject}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{email.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar & Tasks Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-400" /> Google Calendar
                    </h4>
                    <button
                      onClick={() => setShowEventModal(true)}
                      className="text-[11px] text-cyan-400 hover:underline font-semibold"
                    >
                      + Schedule
                    </button>
                  </div>
                  <div className="space-y-2">
                    {events.slice(0, 2).map((evt) => (
                      <div key={evt.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                        <p className="text-xs font-semibold text-slate-200">{evt.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(evt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {evt.location || 'Google Meet'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-sky-400" /> Google Tasks
                    </h4>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="text-[11px] text-cyan-400 hover:underline font-semibold"
                    >
                      + Add Task
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => handleToggleTask(task.id)}
                            className="w-3.5 h-3.5 accent-cyan-500 rounded cursor-pointer"
                          />
                          <span className={`text-xs ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Sync Engine Widget & System Status */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Sync Engine
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Auto Sync:</span>
                    <span className="font-semibold text-white">{syncConfig.autoSync ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Frequency:</span>
                    <span className="font-semibold text-cyan-400">{syncConfig.syncFrequencyMins} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Last Sync:</span>
                    <span className="font-mono text-slate-300">{new Date(syncConfig.lastSyncTime).toLocaleTimeString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleManualSync('all')}
                  disabled={isSyncing}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  Trigger Manual Sync Now
                </button>
              </div>

              {/* OAuth Security & Scopes Audit */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  OAuth 2.0 Token Audit
                </h3>
                <p className="text-xs text-slate-400">
                  Commander uses official OAuth 2.0 PKCE flow. Secrets and raw passwords are never exposed or saved.
                </p>
                <div className="space-y-1.5 pt-1">
                  {account?.scopes.map((s) => (
                    <div key={s} className="px-2.5 py-1 bg-slate-950 border border-slate-800/80 rounded text-[10px] font-mono text-slate-400 truncate">
                      {s.replace('https://www.googleapis.com/auth/', '')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GMAIL */}
        {activeTab === 'gmail' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Gmail Integration</h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowDraftModal(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-red-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Draft Email (User Review)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {emails.map((email) => (
                <div key={email.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{email.sender} <span className="text-slate-500 font-normal">({email.senderEmail})</span></span>
                    <span className="text-xs text-slate-500 font-mono">{new Date(email.date).toLocaleString()}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-cyan-300">{email.subject}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{email.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Google Calendar Agenda</h3>
              </div>
              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Calendar Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div key={evt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {evt.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-cyan-400">
                    {new Date(evt.start).toLocaleString()} - {new Date(evt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {evt.description && <p className="text-xs text-slate-400">{evt.description}</p>}
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Attendees: {evt.attendees.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DRIVE & DOCS */}
        {activeTab === 'drive' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  Google Drive Files
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.map((f) => (
                  <div key={f.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                    <p className="text-xs font-semibold text-white truncate">{f.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Owner: {f.owner} • Modified {new Date(f.modifiedTime).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Google Docs Metadata & Outlines
                </h3>
              </div>
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-cyan-300">{doc.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{doc.wordCount} words • {doc.characterCount} characters</p>
                    <div className="pt-2 border-t border-slate-800/80">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Outline Headings:</p>
                      <div className="space-y-1 text-xs text-slate-300 font-mono">
                        {doc.headings.map((h) => (
                          <div key={h}>{h}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TASKS */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Google Tasks Manager</h3>
              </div>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Google Task
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.map((t) => (
                <div key={t.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.status === 'completed'}
                      onChange={() => handleToggleTask(t.id)}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                    <div>
                      <p className={`text-xs font-semibold ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </p>
                      {t.notes && <p className="text-[11px] text-slate-400 mt-0.5">{t.notes}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Due: {new Date(t.due || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SYNC LOGS */}
        {activeTab === 'sync-logs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Google Workspace Synchronization Logs
              </h3>
            </div>
            <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto">
              {syncLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      log.status === 'in_progress' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-slate-300 font-semibold">[{log.service.toUpperCase()}]</span>
                    <span className="text-slate-400">{log.message}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Google Workspace Sync & OAuth Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Sync Options</h4>
                
                <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-white block">Auto Sync Background Process</span>
                    <span className="text-[10px] text-slate-400">Keep Google items synchronized automatically</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncConfig.autoSync}
                    onChange={(e) => syncEngineService.updateConfig({ autoSync: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-semibold text-white block">Sync Frequency</span>
                  <select
                    value={syncConfig.syncFrequencyMins}
                    onChange={(e) => syncEngineService.updateConfig({ syncFrequencyMins: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value={5}>Every 5 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every hour</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Security Controls</h4>
                <button
                  onClick={handleReconnect}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconnect / Refresh OAuth Credentials
                </button>

                <button
                  onClick={handleDisconnect}
                  className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Revoke OAuth Access & Disconnect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Draft Email (User Confirmation Required) */}
        {showDraftModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCreateDraft} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  Draft Gmail Email
                </h3>
                <button type="button" onClick={() => setShowDraftModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs leading-relaxed">
                <span className="font-bold">Confirmation Rule:</span> Commander creates drafts directly in your Gmail account. Emails are never sent automatically without user approval.
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">To (Recipient Email):</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@company.io"
                    value={draftRecipient}
                    onChange={(e) => setDraftRecipient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Subject:</label>
                  <input
                    type="text"
                    required
                    placeholder="Executive Summary Review"
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Body Content:</label>
                  <textarea
                    rows={4}
                    placeholder="Enter email content here..."
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowDraftModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-red-500/20">
                  Create Gmail Draft
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Schedule Calendar Event */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCreateEvent} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Schedule Google Calendar Event
                </h3>
                <button type="button" onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Event Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="AI Operating System Review"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Date & Time:</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowEventModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition">
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Add Google Task */}
        {showTaskModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCreateTask} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-sky-400" />
                  Add Google Task
                </h3>
                <button type="button" onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Task Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="Review architecture document"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-sky-500/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
