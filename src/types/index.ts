export type AuthProvider = 'google' | 'github' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: AuthProvider;
  role: 'Administrator' | 'Architect' | 'Engineer';
  createdAt: string;
  status: 'active' | 'offline' | 'busy';
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  device: string;
  ipAddress: string;
  active: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentColor = 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja';
export type FontSize = 'small' | 'medium' | 'large';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type VoiceStatus = 'Ready' | 'Listening...' | 'Thinking...' | 'Speaking...' | 'Disconnected';
export type CommanderStatus = 'Ready' | 'Listening' | 'Thinking' | 'Responding' | 'Offline';

export type AIProvider = 'gemini' | 'openai' | 'anthropic';
export type AIPersonality = 'Executive CEO' | 'Friendly Mentor' | 'Strategic Operations' | 'Technical Architect';
export type ResponseLength = 'Concise' | 'Balanced' | 'Detailed';

export interface UserSettings {
  id: string;
  userId: string;
  theme: ThemeMode;
  accentColor: AccentColor;
  language: AppLanguage;
  fontSize: FontSize;
  animationSpeed: AnimationSpeed;
  showAvatar: boolean;
  enableVoice: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  securityAlerts: boolean;
  desktopNotifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  debugMode: boolean;
  
  // AI Provider & LLM Configuration
  aiProvider: AIProvider;
  geminiApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiModel?: string;
  openaiModel?: string;
  anthropicModel?: string;
  temperature: number;
  maxTokens: number;
  streamingEnabled: boolean;
  aiPersonality: AIPersonality;
  responseLength: ResponseLength;
}

export type NavView = 
  | 'dashboard' 
  | 'commander' 
  | 'google-workspace'
  | 'github-workspace'
  | 'repository-center'
  | 'tool-center' 
  | 'memory-center' 
  | 'plugin-center'
  | 'workspace' 
  | 'command-center' 
  | 'agent-center' 
  | 'projects' 
  | 'notes' 
  | 'activity' 
  | 'settings' 
  | 'profile';

// GitHub Integration Types
export interface GitHubAccountInfo {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  totalPrivateRepos: number;
  connectedAt: string;
  tokenStatus: 'valid' | 'expiring' | 'expired' | 'revoked';
  scopes: string[];
}

export interface GitHubRepoItem {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  description: string;
  isPrivate: boolean;
  language: string;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  defaultBranch: string;
  updatedAt: string;
  healthScore: number;
  topics: string[];
  contributorsCount: number;
}

export interface GitHubBranchItem {
  name: string;
  protected: boolean;
  lastCommitSha: string;
  lastCommitMessage: string;
  lastCommitDate: string;
}

export interface GitHubCommitItem {
  sha: string;
  author: string;
  authorAvatar: string;
  message: string;
  date: string;
  repoName: string;
  additions: number;
  deletions: number;
}

export interface GitHubPullRequestItem {
  id: string;
  number: number;
  title: string;
  repoName: string;
  author: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
  updatedAt: string;
  headBranch: string;
  baseBranch: string;
  commentsCount: number;
  reviewStatus: 'approved' | 'changes_requested' | 'pending';
}

export interface GitHubIssueItem {
  id: string;
  number: number;
  title: string;
  repoName: string;
  author: string;
  state: 'open' | 'closed';
  createdAt: string;
  labels: string[];
  commentsCount: number;
  assignee?: string;
}

export interface GitHubReleaseItem {
  id: string;
  tagName: string;
  name: string;
  repoName: string;
  publishedAt: string;
  prerelease: boolean;
  body: string;
}

export interface GitHubWorkflowItem {
  id: string;
  name: string;
  repoName: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'neutral' | null;
  branch: string;
  runNumber: number;
  updatedAt: string;
}

export interface GitHubSyncLog {
  id: string;
  timestamp: string;
  entity: 'repos' | 'commits' | 'pull_requests' | 'issues' | 'actions' | 'all';
  status: 'success' | 'failed' | 'in_progress';
  itemsSynced: number;
  message: string;
}

export type GoogleServiceId = 'account' | 'gmail' | 'calendar' | 'drive' | 'docs' | 'tasks';

export interface GoogleAccountInfo {
  email: string;
  name: string;
  avatarUrl: string;
  connectedAt: string;
  tokenStatus: 'valid' | 'expiring' | 'expired' | 'revoked';
  expiresInSeconds: number;
  scopes: string[];
}

export interface GoogleServiceStatus {
  id: GoogleServiceId;
  name: string;
  icon: string;
  connected: boolean;
  health: 'healthy' | 'warning' | 'error' | 'disconnected';
  permissions: string[];
  itemCount: number;
  lastSyncTime: string;
}

export interface GmailSummaryItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  unread: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'Primary' | 'Updates' | 'Promotions';
}

export interface CalendarEventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  attendees: string[];
  description?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'pdf';
  modifiedTime: string;
  sizeBytes: number;
  owner: string;
  webViewLink: string;
}

export interface DocMetadataItem {
  id: string;
  title: string;
  author: string;
  lastModified: string;
  wordCount: number;
  characterCount: number;
  headings: string[];
}

export interface GoogleTaskItem {
  id: string;
  title: string;
  due?: string;
  status: 'needsAction' | 'completed';
  notes?: string;
}

export interface GoogleSyncLog {
  id: string;
  timestamp: string;
  service: GoogleServiceId | 'all';
  status: 'success' | 'failed' | 'in_progress';
  itemsSynced: number;
  message: string;
}

export interface SyncEngineConfig {
  autoSync: boolean;
  syncFrequencyMins: number;
  lastSyncTime: string;
  notifyOnSync: boolean;
  retryOnFailure: boolean;
  maxRetries: number;
}

export type PluginStatus = 'enabled' | 'disabled' | 'installing' | 'updating' | 'available';
export type PluginHealth = 'healthy' | 'degraded' | 'error' | 'inactive';
export type PluginCategory = 'google' | 'productivity' | 'developer' | 'communication' | 'data' | 'system' | 'utilities';

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: PluginCategory;
  icon: string;
  permissions: string[];
  status: PluginStatus;
  health: PluginHealth;
  installed: boolean;
  autoUpdate: boolean;
  lastUpdate: string;
  executionTimeMs: number;
  usageCount: number;
  rating: number;
  logs: string[];
  config?: Record<string, any>;
}

export interface PluginLogRecord {
  id: string;
  pluginId: string;
  pluginName: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export type ToolPermissionLevel = 'system' | 'user' | 'admin';
export type ToolStatus = 'idle' | 'running' | 'success' | 'error';
export type ToolCategory = 'productivity' | 'data' | 'system' | 'ai' | 'utilities';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  permissionLevel: ToolPermissionLevel;
  status: ToolStatus;
  version: string;
  category: ToolCategory;
  icon: string;
  executionTimeMs: number;
  usageCount: number;
  logs: string[];
  lastResult?: any;
  error?: string | null;
}

export interface ToolExecutionRecord {
  id: string;
  toolId: string;
  toolName: string;
  timestamp: string;
  executionTimeMs: number;
  status: 'success' | 'error';
  inputParams: any;
  result: any;
  logs: string[];
  permissionLevel: ToolPermissionLevel;
}

export type MemoryType = 
  | 'User Profile' 
  | 'Projects' 
  | 'Conversations' 
  | 'Goals' 
  | 'Preferences' 
  | 'Notes' 
  | 'Tasks' 
  | 'Knowledge';

export type MemoryImportance = 'low' | 'medium' | 'high';

export interface LongTermMemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  importance: MemoryImportance;
  createdAt: string;
  updatedAt: string;
  sourceAgent?: string;
  metadata?: Record<string, any>;
}

export interface VirtualFileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  sizeBytes: number;
  mimeType?: string;
  content?: string;
  tags?: string[];
  updatedAt: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  type: 'task' | 'note' | 'project' | 'memory' | 'file' | 'conversation';
  updatedAt: string;
  metadata?: any;
}

export type ProjectStatus = 'active' | 'in_progress' | 'archived' | 'planning';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  lastUpdated: string;
  deploymentUrl?: string;
  repositoryUrl?: string;
  stars?: number;
}

export type ActivityCategory = 'auth' | 'settings' | 'project' | 'system' | 'security' | 'task' | 'note' | 'conversation';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: ActivityCategory;
  timestamp: string;
  ipAddress: string;
  details?: string;
}

export type SubAgentId = 'atlas' | 'nova' | 'forge' | 'titan' | 'vault' | 'echo' | 'orbit' | 'sentinel';
export type AgentStatus = 'Online' | 'Busy' | 'Offline' | 'Disabled' | 'Thinking';

export type ReasoningStage = 
  | 'Analyze'
  | 'Think'
  | 'Plan'
  | 'Delegate'
  | 'Execute'
  | 'Review'
  | 'Respond';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface AgentExecutionRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  durationMs: number;
  status: 'success' | 'failed';
  timestamp: string;
  outputSummary: string;
}

export type WorkflowTaskType = 
  | 'Research' 
  | 'Coding' 
  | 'Planning' 
  | 'Writing' 
  | 'Automation' 
  | 'Memory' 
  | 'Call Preparation' 
  | 'Project Management';

export interface SubAgent {
  id: SubAgentId;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  color: string;
  status: AgentStatus;
  health: number;
  isEnabled: boolean;
  completedTasksCount: number;
  currentTask?: string;
  description: string;
  capabilities: string[];
  taskQueue: string[];
  lastActivity: string;
  executionTimeMs: number;
  performanceScore: number;
  executionHistory: AgentExecutionRecord[];
}

export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying';

export interface WorkflowStep {
  id: string;
  agentId: SubAgentId;
  taskType: WorkflowTaskType;
  title: string;
  description: string;
  status: WorkflowStepStatus;
  output?: string;
  executionTimeMs?: number;
  retryCount: number;
  errorDetails?: string;
  difficulty?: DifficultyLevel;
  priority?: PriorityLevel;
  estimatedTimeSec?: number;
}

export interface CommanderMemoryState {
  currentSessionId: string;
  activeGoal: string;
  frequentlyUsedCommands: { command: string; count: number; category: string }[];
  recentTasksSummary: string[];
  pinnedNotesCount: number;
  indexedContextNodes: number;
  lastSyncTime: string;
}

export interface Workflow {
  id: string;
  userPrompt: string;
  goal: string;
  steps: WorkflowStep[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  estimatedCompletionTimeSec: number;
  currentStepIndex: number;
  logs: string[];
}

export interface SharedMemoryEntry {
  id: string;
  key: string;
  value: string;
  category: 'general' | 'context' | 'task_progress' | 'notes' | 'code' | 'research';
  createdByAgentId: SubAgentId | 'commander';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes?: string;
}

export interface CommandHistoryItem {
  id: string;
  userCommand: string;
  decisionReasoning: string;
  assignedAgents: SubAgentId[];
  workflowId?: string;
  executionTimeMs: number;
  status: 'success' | 'failed' | 'retried';
  resultSummary: string;
  timestamp: string;
}

export interface AgentTaskDelegation {
  id: string;
  agentId: SubAgentId;
  taskTitle: string;
  status: 'queued' | 'delegated' | 'processing' | 'completed' | 'failed';
  delegatedAt: string;
  completedAt?: string;
  resultSummary?: string;
  userQuery: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'commander';
  text: string;
  timestamp: string;
  isCode?: boolean;
  delegatedAgentId?: SubAgentId;
  delegatedAgentName?: string;
  delegationStatus?: 'delegating' | 'processing' | 'completed';
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
  summary?: string;
}

export interface CommanderTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: string;
}

export interface PinnedNote {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  updatedAt: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeSessions: number;
  systemStatus: 'Operational' | 'Degraded' | 'Maintenance';
  uptimeSeconds: number;
  version: string;
}
