import { User, Session, UserSettings, Project, ActivityLog, SystemMetrics, ChatMessage, Conversation, CommanderTask, PinnedNote } from '../types';

const STORAGE_KEYS = {
  USER: 'commander_preview_user',
  SESSION: 'commander_preview_session',
  SETTINGS: 'commander_preview_settings',
  PROJECTS: 'commander_preview_projects',
  ACTIVITY: 'commander_preview_activity',
  CONVERSATIONS: 'commander_preview_conversations',
  TASKS: 'commander_preview_tasks',
  NOTES: 'commander_preview_notes',
};

const DEFAULT_USER: User = {
  id: 'usr_aitzaz_01',
  name: 'Aitzaz',
  email: 'aitzaz@commander.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  provider: 'google',
  role: 'Architect',
  createdAt: new Date().toISOString(),
  status: 'active',
};

const DEFAULT_SESSION: Session = {
  id: 'sess_preview_9921',
  userId: 'usr_aitzaz_01',
  token: 'mock_jwt_token_preview_mode',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
  device: 'Chrome Preview Environment',
  ipAddress: '127.0.0.1 (Local Mock)',
  active: true,
};

const DEFAULT_SETTINGS: UserSettings = {
  id: 'sett_01',
  userId: 'usr_aitzaz_01',
  theme: 'dark',
  accentColor: 'cyan',
  language: 'en',
  fontSize: 'medium',
  animationSpeed: 'normal',
  showAvatar: true,
  enableVoice: true,
  emailNotifications: true,
  pushNotifications: true,
  securityAlerts: true,
  desktopNotifications: true,
  soundEffects: true,
  autoSave: true,
  debugMode: false,

  aiProvider: 'gemini',
  geminiModel: 'gemini-3.6-flash',
  openaiModel: 'gpt-4o-mini',
  anthropicModel: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  maxTokens: 2048,
  streamingEnabled: true,
  aiPersonality: 'Executive CEO',
  responseLength: 'Balanced',
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    name: 'Neural Agent Bus',
    description: 'High-throughput event streaming architecture for multi-agent coordination.',
    status: 'active',
    techStack: ['TypeScript', 'FastAPI', 'PostgreSQL', 'Redis'],
    lastUpdated: new Date(Date.now() - 3600000 * 2).toISOString(),
    deploymentUrl: 'https://agent-bus.commander.ai',
    repositoryUrl: 'https://github.com/commander-ai/neural-agent-bus',
    stars: 142,
  },
  {
    id: 'proj-02',
    name: 'Vector Knowledge Indexer',
    description: 'Automated document ingestion and hybrid dense-sparse vector indexing engine.',
    status: 'in_progress',
    techStack: ['Python', 'Qdrant', 'FastAPI', 'Docker'],
    lastUpdated: new Date(Date.now() - 3600000 * 14).toISOString(),
    repositoryUrl: 'https://github.com/commander-ai/vector-indexer',
    stars: 89,
  },
  {
    id: 'proj-03',
    name: 'Commander Core UI',
    description: 'Next.js 15 & React 19 micro-frontend dashboard for system orchestration.',
    status: 'active',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    lastUpdated: new Date(Date.now() - 3600000 * 28).toISOString(),
    deploymentUrl: 'https://app.commander.ai',
    repositoryUrl: 'https://github.com/commander-ai/core-ui',
    stars: 310,
  },
  {
    id: 'proj-04',
    name: 'Auth Security Gateway',
    description: 'OAuth2 / OpenID Connect proxy with session revocation and rate limiting.',
    status: 'planning',
    techStack: ['Go', 'PostgreSQL', 'Docker Compose'],
    lastUpdated: new Date(Date.now() - 3600000 * 48).toISOString(),
    repositoryUrl: 'https://github.com/commander-ai/auth-gateway',
    stars: 45,
  },
];

const DEFAULT_ACTIVITY: ActivityLog[] = [
  {
    id: 'act-01',
    userId: 'usr_aitzaz_01',
    userName: 'Aitzaz',
    action: 'Commander AI Core Activated',
    category: 'system',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1',
    details: 'Commander personal AI assistant online and listening',
  },
  {
    id: 'act-02',
    userId: 'usr_aitzaz_01',
    userName: 'Aitzaz',
    action: 'Updated Theme Settings',
    category: 'settings',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    ipAddress: '127.0.0.1',
    details: 'Switched accent color to Cyber Cyan',
  },
  {
    id: 'act-03',
    userId: 'usr_aitzaz_01',
    userName: 'Aitzaz',
    action: 'Created Project "Neural Agent Bus"',
    category: 'project',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    ipAddress: '127.0.0.1',
    details: 'Initial commit & container configuration registered',
  },
];

const DEFAULT_TASKS: CommanderTask[] = [
  { id: 'task-1', title: 'Review Neural Agent Bus microservice architecture', completed: true, priority: 'high' },
  { id: 'task-2', title: 'Deploy Commander AI Core v1.1 update', completed: false, priority: 'high' },
  { id: 'task-3', title: 'Optimize vector database query latency below 15ms', completed: false, priority: 'medium' },
  { id: 'task-4', title: 'Audit OAuth2 token revocation endpoints', completed: false, priority: 'low' },
];

const DEFAULT_PINNED_NOTES: PinnedNote[] = [
  {
    id: 'note-1',
    title: 'Commander System Core Architecture',
    content: 'Commander is your dedicated personal AI assistant. All sub-modules operate on high-performance event streaming via local memory.',
    category: 'Architecture',
    pinned: true,
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Performance Benchmark Goals',
    content: 'Target response token generation < 40ms. Keep active context footprint under 128KB for instant client-side retrieval.',
    category: 'Metrics',
    pinned: true,
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-01',
    title: 'System Setup & Activation',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'commander',
        text: "Greetings Aitzaz. I am **Commander**, your personal AI assistant. I am fully active and initialized. How can I assist with your projects or tasks today?",
        timestamp: '09:00 AM',
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: "Hi Commander, give me an overview of our current system status.",
        timestamp: '09:01 AM',
      },
      {
        id: 'msg-3',
        sender: 'commander',
        text: "Certainly, Aitzaz! Here is your system snapshot:\n\n- **System Status**: 🟢 Operational (100% Uptime)\n- **Active Engine**: Commander AI Core v1.1\n- **Active Projects**: 4 Registered Microservices\n- **Memory Context**: 14.2 KB allocated\n\nAll systems are performing optimally. What would you like to build or inspect next?",
        timestamp: '09:01 AM',
      },
    ],
  },
];

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export const apiService = {
  // System Metrics
  getSystemStatus: async (): Promise<SystemMetrics> => {
    return {
      cpuUsage: Math.floor(Math.random() * 5) + 2,
      memoryUsage: Math.floor(Math.random() * 15) + 165,
      activeSessions: 1,
      systemStatus: 'Operational',
      uptimeSeconds: 18400,
      version: '1.1.0-alpha',
    };
  },

  // Auth & Session
  getSession: async (): Promise<{ user: User; session: Session }> => {
    const user = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const session = getItem<Session>(STORAGE_KEYS.SESSION, DEFAULT_SESSION);
    return { user, session };
  },

  login: async (provider: 'google' | 'github', name?: string, email?: string): Promise<{ user: User; session: Session }> => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || 'Aitzaz',
      email: email || 'aitzaz@commander.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      provider,
      role: 'Architect',
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const newSession: Session = {
      id: 'sess_' + Math.random().toString(36).substring(2, 9),
      userId: newUser.id,
      token: 'jwt_mock_' + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      device: 'Chrome Preview Mode',
      ipAddress: '127.0.0.1',
      active: true,
    };

    setItem(STORAGE_KEYS.USER, newUser);
    setItem(STORAGE_KEYS.SESSION, newSession);

    // Add activity log
    const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 7),
      userId: newUser.id,
      userName: newUser.name,
      action: `OAuth Login (${provider.toUpperCase()})`,
      category: 'auth',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: `User session created via ${provider}`,
    };
    setItem(STORAGE_KEYS.ACTIVITY, [newLog, ...logs]);

    return { user: newUser, session: newSession };
  },

  logout: async (): Promise<{ success: boolean }> => {
    const session = getItem<Session>(STORAGE_KEYS.SESSION, DEFAULT_SESSION);
    session.active = false;
    setItem(STORAGE_KEYS.SESSION, session);

    const user = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 7),
      userId: user.id,
      userName: user.name,
      action: 'Session Terminated',
      category: 'auth',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: 'User signed out in preview mode',
    };
    setItem(STORAGE_KEYS.ACTIVITY, [newLog, ...logs]);

    return { success: true };
  },

  // User Profile
  getUserProfile: async (): Promise<User> => {
    return getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
  },

  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    const current = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.USER, updated);

    const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 7),
      userId: updated.id,
      userName: updated.name,
      action: 'Updated Profile Information',
      category: 'settings',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: `Updated name to "${updated.name}"`,
    };
    setItem(STORAGE_KEYS.ACTIVITY, [newLog, ...logs]);

    return updated;
  },

  // User Settings
  getSettings: async (): Promise<UserSettings> => {
    return getItem<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  updateSettings: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
    const current = getItem<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.SETTINGS, updated);

    const user = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 7),
      userId: user.id,
      userName: user.name,
      action: 'Updated User Preferences',
      category: 'settings',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: `Theme: ${updated.theme}, Accent: ${updated.accentColor}, Lang: ${updated.language}`,
    };
    setItem(STORAGE_KEYS.ACTIVITY, [newLog, ...logs]);

    return updated;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    return getItem<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const newProject: Project = {
      id: 'proj-' + Math.random().toString(36).substring(2, 7),
      name: projectData.name || 'New Microservice',
      description: projectData.description || 'Modular component for Commander AI system.',
      status: projectData.status || 'active',
      techStack: projectData.techStack && projectData.techStack.length > 0 ? projectData.techStack : ['TypeScript', 'React'],
      lastUpdated: new Date().toISOString(),
      repositoryUrl: projectData.repositoryUrl || 'https://github.com/commander-ai/' + (projectData.name ? projectData.name.toLowerCase().replace(/\s+/g, '-') : 'new-repo'),
      stars: 1,
    };

    const currentProjects = getItem<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    const updatedProjects = [newProject, ...currentProjects];
    setItem(STORAGE_KEYS.PROJECTS, updatedProjects);

    const user = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 7),
      userId: user.id,
      userName: user.name,
      action: `Created Project "${newProject.name}"`,
      category: 'project',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: `Stack: ${newProject.techStack.join(', ')}`,
    };
    setItem(STORAGE_KEYS.ACTIVITY, [newLog, ...logs]);

    return newProject;
  },

  deleteProject: async (id: string): Promise<{ success: boolean }> => {
    const currentProjects = getItem<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    const target = currentProjects.find(p => p.id === id);
    const updatedProjects = currentProjects.filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PROJECTS, updatedProjects);

    if (target) {
      const user = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
      const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
      const newLog: ActivityLog = {
        id: 'act-' + Math.random().toString(36).substring(2, 7),
        userId: user.id,
        userName: user.name,
        action: `Deleted Project "${target.name}"`,
        category: 'project',
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1',
        details: `Project ID: ${id}`,
      };
      setItem(STORAGE_KEYS.ACTIVITY, [newLog, ...logs]);
    }

    return { success: true };
  },

  // Tasks
  getTasks: async (): Promise<CommanderTask[]> => {
    return getItem<CommanderTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
  },

  toggleTask: async (id: string): Promise<CommanderTask[]> => {
    const tasks = getItem<CommanderTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setItem(STORAGE_KEYS.TASKS, updated);
    return updated;
  },

  addTask: async (title: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<CommanderTask[]> => {
    const tasks = getItem<CommanderTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    const newTask: CommanderTask = {
      id: 'task-' + Math.random().toString(36).substring(2, 7),
      title,
      completed: false,
      priority,
    };
    const updated = [newTask, ...tasks];
    setItem(STORAGE_KEYS.TASKS, updated);
    return updated;
  },

  deleteTask: async (id: string): Promise<CommanderTask[]> => {
    const tasks = getItem<CommanderTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    const updated = tasks.filter(t => t.id !== id);
    setItem(STORAGE_KEYS.TASKS, updated);
    return updated;
  },

  // Pinned Notes
  getPinnedNotes: async (): Promise<PinnedNote[]> => {
    return getItem<PinnedNote[]>(STORAGE_KEYS.NOTES, DEFAULT_PINNED_NOTES);
  },

  addNote: async (title: string, content: string, category = 'General'): Promise<PinnedNote[]> => {
    const notes = getItem<PinnedNote[]>(STORAGE_KEYS.NOTES, DEFAULT_PINNED_NOTES);
    const newNote: PinnedNote = {
      id: 'note-' + Math.random().toString(36).substring(2, 7),
      title,
      content,
      category,
      pinned: true,
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setItem(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  deleteNote: async (id: string): Promise<PinnedNote[]> => {
    const notes = getItem<PinnedNote[]>(STORAGE_KEYS.NOTES, DEFAULT_PINNED_NOTES);
    const updated = notes.filter(n => n.id !== id);
    setItem(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  // Conversations & Chat
  getConversations: async (): Promise<Conversation[]> => {
    return getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
  },

  saveConversation: async (conv: Conversation): Promise<Conversation[]> => {
    const list = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
    const idx = list.findIndex(c => c.id === conv.id);
    let updated: Conversation[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = { ...conv, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...conv, updatedAt: new Date().toISOString() }, ...list];
    }
    setItem(STORAGE_KEYS.CONVERSATIONS, updated);
    return updated;
  },

  deleteConversation: async (id: string): Promise<Conversation[]> => {
    const list = getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
    const updated = list.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CONVERSATIONS, updated);
    return updated;
  },

  // Intelligent Response Generator for Commander AI
  generateCommanderResponse: async (userQuery: string, history: ChatMessage[] = [], userName = 'Aitzaz'): Promise<string> => {
    const query = userQuery.toLowerCase().trim();

    // Context aware response construction
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings')) {
      return `Hello **${userName}**! Commander AI is active and at your service. How can I assist you with your projects, code, or tasks today?`;
    }

    if (query.includes('status') || query.includes('health') || query.includes('system')) {
      return `Here is your current **Commander AI System Status**, ${userName}:\n\n- ⚡ **Core Engine**: Commander v1.1 Operational\n- ⏱️ **Latency**: 18ms\n- 💾 **Local Memory**: 28.4 KB context active\n- 🛡️ **Security**: Zero leaks, client sandbox active\n\nAll tasks and services are running smoothly!`;
    }

    if (query.includes('project') || query.includes('code') || query.includes('repo')) {
      return `I analyzed your project registry for **${userName}**:\n\n1. **Neural Agent Bus** — *Active* (TS / FastAPI / Redis)\n2. **Vector Knowledge Indexer** — *In Progress* (Qdrant / Python)\n3. **Commander Core UI** — *Active* (React / Vite)\n4. **Auth Gateway** — *Planning* (Go / Docker)\n\nWould you like me to generate code or architect a new microservice for your stack?`;
    }

    if (query.includes('task') || query.includes('todo') || query.includes('schedule')) {
      return `Here are your pending tasks for today, **${userName}**:\n\n- [ ] Deploy Commander AI Core v1.1 update\n- [ ] Optimize vector database query latency below 15ms\n- [ ] Audit OAuth2 token revocation endpoints\n\nLet me know if you would like me to mark any task complete or break down steps for you.`;
    }

    if (query.includes('who are you') || query.includes('what are you') || query.includes('commander')) {
      return `I am **Commander**, your personal AI software architect and assistant. I am designed to collaborate directly with you (${userName}) to write high-quality code, orchestrate system components, manage project pipelines, and streamline your workflow in real time.`;
    }

    if (query.includes('react') || query.includes('typescript') || query.includes('function') || query.includes('code')) {
      return `Here is a clean TypeScript example for your project, **${userName}**:\n\n\`\`\`typescript\ninterface CommanderEvent {\n  id: string;\n  payload: Record<string, unknown>;\n  timestamp: number;\n}\n\nexport function processEvent(event: CommanderEvent): void {\n  console.log(\`[Commander] Event \${event.id} processed at \${new Date(event.timestamp).toISOString()}\`);\n}\n\`\`\`\n\nLet me know if you would like me to adapt this to your current component hierarchy!`;
    }

    // Default intelligent response
    return `Understood, **${userName}**. I have processed your input: *"${userQuery}"*.\n\nAs your personal assistant, I am ready to:\n\n1. Write and refactor high-performance code.\n2. Help design architecture patterns and data models.\n3. Track your daily development goals and tasks.\n\nHow would you like to proceed?`;
  },

  // Activity Log
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    return getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
  },

  logActivity: async (action: string, category: ActivityLog['category'], details?: string): Promise<ActivityLog> => {
    const user = getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 7),
      userId: user.id,
      userName: user.name,
      action: action || 'System Action',
      category: category || 'system',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: details || '',
    };

    const logs = getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY);
    const updatedLogs = [newLog, ...logs];
    setItem(STORAGE_KEYS.ACTIVITY, updatedLogs);

    return newLog;
  },
};

