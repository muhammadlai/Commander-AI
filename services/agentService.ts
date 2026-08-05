import { SubAgent, SubAgentId, AgentStatus, AgentTaskDelegation } from '../types';
import { apiService } from './apiService';

const AGENTS_STORAGE_KEY = 'commander_preview_agents';
const DELEGATIONS_STORAGE_KEY = 'commander_preview_delegations';

export const INITIAL_AGENTS: SubAgent[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'Project Manager',
    specialty: 'Project Roadmaps & Task Breakdown',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    color: 'cyan',
    status: 'Online',
    health: 98,
    isEnabled: true,
    completedTasksCount: 42,
    description: 'Orchestrates project milestones, sprint tasks, timelines, and team resource allocation.',
    capabilities: ['Sprint Planning', 'Task Breakdown', 'Milestone Tracking', 'Resource Allocation'],
    taskQueue: ['Finalize Phase 2.2 roadmap', 'Review resource utilization matrix'],
    lastActivity: '2 mins ago',
    executionTimeMs: 840,
    performanceScore: 99.1,
    executionHistory: [
      { id: 'ex-101', taskId: 'task-atlas-1', taskTitle: 'Roadmap Milestone Decomposition', durationMs: 840, status: 'success', timestamp: '1 hour ago', outputSummary: 'Created 4-sprint milestone plan with dependency graph.' }
    ]
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Research Specialist',
    specialty: 'Deep Technical Research & Data Synthesis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    color: 'violet',
    status: 'Online',
    health: 100,
    isEnabled: true,
    completedTasksCount: 38,
    description: 'Conducts automated web/paper research, market trend synthesis, and competitive audits.',
    capabilities: ['Market Intelligence', 'Literature Review', 'Competitor Audits', 'Data Synthesis'],
    taskQueue: ['Synthesize LLM latency benchmarks'],
    lastActivity: '5 mins ago',
    executionTimeMs: 1120,
    performanceScore: 98.7,
    executionHistory: [
      { id: 'ex-102', taskId: 'task-nova-1', taskTitle: 'LLM Agent Framework Comparative Study', durationMs: 1120, status: 'success', timestamp: '2 hours ago', outputSummary: 'Synthesized 5 multi-agent frameworks.' }
    ]
  },
  {
    id: 'forge',
    name: 'Forge',
    role: 'Software Developer',
    specialty: 'Full-Stack Code Architecture & Debugging',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    color: 'emerald',
    status: 'Online',
    health: 96,
    isEnabled: true,
    completedTasksCount: 89,
    description: 'Generates production TypeScript/Python code, refactors components, and debugs system issues.',
    capabilities: ['Full-Stack Coding', 'Bug Root-Cause Analysis', 'Refactoring', 'API Schema Specs'],
    taskQueue: ['Refactor Workflow Engine state listeners'],
    lastActivity: '1 min ago',
    executionTimeMs: 1450,
    performanceScore: 99.4,
    executionHistory: [
      { id: 'ex-103', taskId: 'task-forge-1', taskTitle: 'Refactor Vector Indexing Service', durationMs: 1450, status: 'success', timestamp: '30 mins ago', outputSummary: 'Optimized Qdrant batch insertions by 34%.' }
    ]
  },
  {
    id: 'titan',
    name: 'Titan',
    role: 'Sales Assistant',
    specialty: 'Pitch Decks & Client Pipeline Strategy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    color: 'amber',
    status: 'Online',
    health: 95,
    isEnabled: true,
    completedTasksCount: 27,
    description: 'Drafts persuasive sales pitches, generates client proposals, and optimizes deal funnels.',
    capabilities: ['Pitch Deck Drafts', 'Deal Qualification', 'Client Proposals', 'Value Propositioning'],
    taskQueue: [],
    lastActivity: '18 mins ago',
    executionTimeMs: 920,
    performanceScore: 97.5,
    executionHistory: [
      { id: 'ex-104', taskId: 'task-titan-1', taskTitle: 'Enterprise License Proposal Draft', durationMs: 920, status: 'success', timestamp: '3 hours ago', outputSummary: 'Generated tier 1 client proposal deck.' }
    ]
  },
  {
    id: 'vault',
    name: 'Vault',
    role: 'Memory Manager',
    specialty: 'Knowledge Ingestion & Vector Context',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    color: 'rose',
    status: 'Online',
    health: 99,
    isEnabled: true,
    completedTasksCount: 64,
    description: 'Indexes documents, extracts long-term context, and performs semantic retrieval for Commander.',
    capabilities: ['Context Ingestion', 'Semantic Retrieval', 'Knowledge Graph', 'Doc Memory Storage'],
    taskQueue: ['Index active shared memory entries'],
    lastActivity: 'Just now',
    executionTimeMs: 480,
    performanceScore: 99.8,
    executionHistory: [
      { id: 'ex-105', taskId: 'task-vault-1', taskTitle: 'Index Security Governance Rules', durationMs: 480, status: 'success', timestamp: '10 mins ago', outputSummary: 'Indexed security rules into vector store.' }
    ]
  },
  {
    id: 'echo',
    name: 'Echo',
    role: 'Call Assistant',
    specialty: 'Meeting Summarization & Call Prep',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    color: 'sky',
    status: 'Online',
    health: 97,
    isEnabled: true,
    completedTasksCount: 31,
    description: 'Synthesizes audio/video call transcripts, drafts agendas, and extracts key action items.',
    capabilities: ['Transcript Summarization', 'Agenda Prep', 'Action Extraction', 'Call Briefings'],
    taskQueue: [],
    lastActivity: '32 mins ago',
    executionTimeMs: 760,
    performanceScore: 98.2,
    executionHistory: [
      { id: 'ex-106', taskId: 'task-echo-1', taskTitle: 'Executive Call Agenda Briefing', durationMs: 760, status: 'success', timestamp: '4 hours ago', outputSummary: 'Extracted 3 action items from call transcript.' }
    ]
  },
  {
    id: 'orbit',
    name: 'Orbit',
    role: 'Automation Engine',
    specialty: 'Workflow Pipelines & Trigger Scheduling',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    color: 'indigo',
    status: 'Online',
    health: 94,
    isEnabled: true,
    completedTasksCount: 53,
    description: 'Orchestrates background scripts, automated recurring cron jobs, and task pipeline triggers.',
    capabilities: ['Pipeline Orchestration', 'Cron Automation', 'Trigger Webhooks', 'Batch Ops'],
    taskQueue: ['Monitor 15-min agent health check cron'],
    lastActivity: '12 mins ago',
    executionTimeMs: 650,
    performanceScore: 97.9,
    executionHistory: [
      { id: 'ex-107', taskId: 'task-orbit-1', taskTitle: 'Health Cron Pipeline Trigger', durationMs: 650, status: 'success', timestamp: '15 mins ago', outputSummary: 'Scheduled recurring background cron job.' }
    ]
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Security & Compliance',
    specialty: 'Threat Audit & Access Permissions',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    color: 'red',
    status: 'Online',
    health: 100,
    isEnabled: true,
    completedTasksCount: 48,
    description: 'Audits authorization rules, validates security tokens, and monitors for system anomaly alerts.',
    capabilities: ['Vulnerability Audit', 'Role Permission Check', 'Token Validation', 'Threat Monitoring'],
    taskQueue: [],
    lastActivity: '4 mins ago',
    executionTimeMs: 620,
    performanceScore: 100.0,
    executionHistory: [
      { id: 'ex-108', taskId: 'task-sentinel-1', taskTitle: 'Sandbox Permission Audit', durationMs: 620, status: 'success', timestamp: '25 mins ago', outputSummary: 'Audited RBAC rules with 0 critical findings.' }
    ]
  },
];

const INITIAL_DELEGATIONS: AgentTaskDelegation[] = [
  {
    id: 'del-01',
    agentId: 'forge',
    taskTitle: 'Refactor Vector Indexing Pipeline',
    status: 'completed',
    delegatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
    resultSummary: 'Optimized batch vector insertions by 34%. Refactored async worker pools.',
    userQuery: 'Forge, optimize our Qdrant vector indexer pipeline.',
  },
  {
    id: 'del-02',
    agentId: 'nova',
    taskTitle: 'Research Competitor Multi-Agent Frameworks',
    status: 'completed',
    delegatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 11.5).toISOString(),
    resultSummary: 'Synthesized 5 industry agent frameworks with comparative matrix on latency and autonomy.',
    userQuery: 'Nova, summarize top open-source multi-agent frameworks.',
  },
  {
    id: 'del-03',
    agentId: 'atlas',
    taskTitle: 'Generate Phase 2.2 Milestone Timeline',
    status: 'completed',
    delegatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 23.6).toISOString(),
    resultSummary: 'Created 4-phase milestone chart with task breakdowns for core AI CEO delegation.',
    userQuery: 'Atlas, plan our Phase 2 development sprint.',
  },
];

class AgentManagerService {
  private agents: SubAgent[] = [];
  private delegations: AgentTaskDelegation[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined') {
      const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
      if (storedAgents) {
        try {
          this.agents = JSON.parse(storedAgents);
        } catch {
          this.agents = INITIAL_AGENTS;
        }
      } else {
        this.agents = INITIAL_AGENTS;
        this.saveAgents();
      }

      const storedDelegations = localStorage.getItem(DELEGATIONS_STORAGE_KEY);
      if (storedDelegations) {
        try {
          this.delegations = JSON.parse(storedDelegations);
        } catch {
          this.delegations = INITIAL_DELEGATIONS;
        }
      } else {
        this.delegations = INITIAL_DELEGATIONS;
        this.saveDelegations();
      }
    } else {
      this.agents = INITIAL_AGENTS;
      this.delegations = INITIAL_DELEGATIONS;
    }
  }

  private saveAgents() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(this.agents));
    }
  }

  private saveDelegations() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DELEGATIONS_STORAGE_KEY, JSON.stringify(this.delegations));
    }
  }

  public getAgents(): SubAgent[] {
    return [...this.agents];
  }

  public getAgentById(id: SubAgentId): SubAgent | undefined {
    return this.agents.find(a => a.id === id);
  }

  public getDelegations(): AgentTaskDelegation[] {
    return [...this.delegations];
  }

  // Agent State Toggles
  public toggleAgentEnabled(id: SubAgentId): SubAgent[] {
    this.agents = this.agents.map(agent => {
      if (agent.id === id) {
        const isEnabled = !agent.isEnabled;
        const status: AgentStatus = isEnabled ? 'Online' : 'Disabled';
        return { ...agent, isEnabled, status };
      }
      return agent;
    });
    this.saveAgents();
    apiService.logActivity(`Agent Toggle Enabled/Disabled`, 'system', `Agent: ${id}`);
    return this.getAgents();
  }

  public setAgentStatus(id: SubAgentId, status: AgentStatus, currentTask?: string): SubAgent[] {
    this.agents = this.agents.map(agent => {
      if (agent.id === id) {
        return { 
          ...agent, 
          status, 
          currentTask: currentTask !== undefined ? currentTask : agent.currentTask,
          lastActivity: 'Just now'
        };
      }
      return agent;
    });
    this.saveAgents();
    return this.getAgents();
  }

  public runHealthCheck(id?: SubAgentId): SubAgent[] {
    this.agents = this.agents.map(agent => {
      if (!id || agent.id === id) {
        if (!agent.isEnabled) return agent;
        const health = Math.min(100, Math.max(90, Math.floor(92 + Math.random() * 8)));
        return { ...agent, health, status: 'Online', currentTask: undefined };
      }
      return agent;
    });
    this.saveAgents();
    apiService.logActivity(`Ran Agent Health Diagnostics`, 'system', id ? `Agent ID: ${id}` : 'All Agents Verified');
    return this.getAgents();
  }

  // COMMANDER DECISION ENGINE
  // Analyzes user prompt and routes to the appropriate specialist agent
  public routeTask(userPrompt: string): SubAgent {
    const promptLower = userPrompt.toLowerCase();

    // Available enabled agents
    const enabledAgents = this.agents.filter(a => a.isEnabled);
    if (enabledAgents.length === 0) {
      // Fallback if all disabled
      return this.agents[0];
    }

    // 1. Forge - Coding / Tech / Debug
    if (
      promptLower.match(/(code|build|bug|refactor|typescript|javascript|python|api|function|component|database|sql|fix|git|repo|app|develop|backend|frontend)/i) &&
      this.isAgentAvailable('forge')
    ) {
      return this.getAgentById('forge')!;
    }

    // 2. Nova - Research / Analyze
    if (
      promptLower.match(/(research|search|study|analyze|investigate|market|trend|competitor|find info|literature|paper|data|benchmark)/i) &&
      this.isAgentAvailable('nova')
    ) {
      return this.getAgentById('nova')!;
    }

    // 3. Atlas - Project / Task / Roadmap
    if (
      promptLower.match(/(project|task|roadmap|plan|milestone|schedule|sprint|deadline|organize|backlog|track|workflow plan)/i) &&
      this.isAgentAvailable('atlas')
    ) {
      return this.getAgentById('atlas')!;
    }

    // 4. Titan - Sales / Client / Pitch
    if (
      promptLower.match(/(sale|pitch|client|deal|proposal|lead|revenue|funnel|marketing|pricing|value prop|contract)/i) &&
      this.isAgentAvailable('titan')
    ) {
      return this.getAgentById('titan')!;
    }

    // 5. Vault - Memory / Indexing / Context
    if (
      promptLower.match(/(remember|memory|store|knowledge|context|retrieve|index|doc|document|recall|save note|vault)/i) &&
      this.isAgentAvailable('vault')
    ) {
      return this.getAgentById('vault')!;
    }

    // 6. Echo - Call / Meeting / Transcript
    if (
      promptLower.match(/(call|meeting|transcript|agenda|interview|speak|notes from call|audio|discussion)/i) &&
      this.isAgentAvailable('echo')
    ) {
      return this.getAgentById('echo')!;
    }

    // 7. Orbit - Automation / Cron / Trigger
    if (
      promptLower.match(/(automate|cron|pipeline|trigger|repeat|workflow script|batch|background job|schedule task)/i) &&
      this.isAgentAvailable('orbit')
    ) {
      return this.getAgentById('orbit')!;
    }

    // 8. Sentinel - Security / Audit / Auth
    if (
      promptLower.match(/(security|audit|permission|auth|encrypt|vulnerability|key|shield|token|access control|threat)/i) &&
      this.isAgentAvailable('sentinel')
    ) {
      return this.getAgentById('sentinel')!;
    }

    // General Fallback based on enabled agents
    return enabledAgents[0];
  }

  private isAgentAvailable(id: SubAgentId): boolean {
    const agent = this.getAgentById(id);
    return !!(agent && agent.isEnabled && agent.status !== 'Disabled');
  }

  // EXECUTE DELEGATION SIMULATION
  public async executeDelegatedTask(
    userPrompt: string,
    onProgressUpdate?: (status: 'delegating' | 'processing' | 'completed', stepText: string, agent: SubAgent) => void
  ): Promise<{ agent: SubAgent; responseText: string; delegationId: string }> {
    const assignedAgent = this.routeTask(userPrompt);

    const delegationId = 'del-' + Math.random().toString(36).substring(2, 8);
    const taskTitle = this.extractTaskTitle(userPrompt);

    // Create Delegation Record
    const newDelegation: AgentTaskDelegation = {
      id: delegationId,
      agentId: assignedAgent.id,
      taskTitle,
      status: 'delegated',
      delegatedAt: new Date().toISOString(),
      userQuery: userPrompt,
    };

    this.delegations = [newDelegation, ...this.delegations];
    this.saveDelegations();

    // Step 1: Commander Logs & Notify Delegating
    await apiService.logActivity(
      `Commander delegated task to ${assignedAgent.name}`,
      'conversation',
      `Target Agent: ${assignedAgent.name} (${assignedAgent.role}) | Task: ${taskTitle}`
    );

    if (onProgressUpdate) {
      onProgressUpdate(
        'delegating',
        `Commander identified task scope. Delegating execution to ${assignedAgent.name} [${assignedAgent.role}]...`,
        assignedAgent
      );
    }

    // Step 2: Transition Agent to Thinking / Busy
    this.setAgentStatus(assignedAgent.id, 'Thinking', taskTitle);

    // Simulated short delay for animation
    await new Promise(res => setTimeout(res, 900));

    this.setAgentStatus(assignedAgent.id, 'Busy', taskTitle);

    if (onProgressUpdate) {
      onProgressUpdate(
        'processing',
        `${assignedAgent.name} is processing the request using ${assignedAgent.capabilities[0]}...`,
        assignedAgent
      );
    }

    await new Promise(res => setTimeout(res, 1400));

    // Step 3: Generate Agent Specialized Result
    const agentResult = this.generateSpecializedAgentResponse(assignedAgent, userPrompt);

    // Step 4: Mark Agent Task Completed
    this.agents = this.agents.map(a => {
      if (a.id === assignedAgent.id) {
        const newRecord = {
          id: 'ex-' + Math.random().toString(36).substring(2, 7),
          taskId: delegationId,
          taskTitle,
          durationMs: 1400 + Math.floor(Math.random() * 500),
          status: 'success' as const,
          timestamp: 'Just now',
          outputSummary: agentResult.summary
        };
        const updatedHistory = [newRecord, ...(a.executionHistory || [])].slice(0, 10);
        return {
          ...a,
          status: 'Online',
          completedTasksCount: a.completedTasksCount + 1,
          currentTask: undefined,
          executionHistory: updatedHistory,
          lastActivity: 'Just now'
        };
      }
      return a;
    });
    this.saveAgents();

    // Step 5: Mark Delegation Completed
    this.delegations = this.delegations.map(d => {
      if (d.id === delegationId) {
        return {
          ...d,
          status: 'completed',
          completedAt: new Date().toISOString(),
          resultSummary: agentResult.summary,
        };
      }
      return d;
    });
    this.saveDelegations();

    // Log Completion
    await apiService.logActivity(
      `${assignedAgent.name} completed task`,
      'task',
      `Delegation ID: ${delegationId} | Result: ${agentResult.summary}`
    );

    if (onProgressUpdate) {
      onProgressUpdate(
        'completed',
        `${assignedAgent.name} finished task. Commander synthesizing final report.`,
        assignedAgent
      );
    }

    return {
      agent: assignedAgent,
      responseText: agentResult.fullReport,
      delegationId,
    };
  }

  private extractTaskTitle(prompt: string): string {
    const clean = prompt.trim().replace(/^commander,\s*/i, '');
    if (clean.length <= 40) return clean;
    return clean.substring(0, 37) + '...';
  }

  private generateSpecializedAgentResponse(agent: SubAgent, userPrompt: string): { summary: string; fullReport: string } {
    switch (agent.id) {
      case 'forge':
        return {
          summary: 'Generated clean code architecture & executed component refactoring.',
          fullReport: `### 🛠️ Code Execution Report — **Forge** (Software Developer)
          
**Task Scope:** ${userPrompt}
**Status:** ✅ Successfully Generated & Verified

\`\`\`typescript
// High-Performance Event Handler Pipeline
export async function executeEnginePipeline(payload: Record<string, any>) {
  const startTime = performance.now();
  
  // Verify token authorization & payload integrity
  if (!payload || !payload.sessionId) {
    throw new Error('Invalid engine payload schema');
  }

  // Simulated micro-task processing
  const executionLatency = Math.round(performance.now() - startTime);
  return {
    status: 'success',
    latencyMs: executionLatency,
    timestamp: new Date().toISOString()
  };
}
\`\`\`

**Execution Summary:**
- Verified TypeScript types & module dependencies.
- Zero runtime errors detected in sandbox build environment.
- Code ready for immediate deployment to Core UI.`,
        };

      case 'nova':
        return {
          summary: 'Synthesized deep market and technical research analysis.',
          fullReport: `### 🔬 Deep Research Brief — **Nova** (Research Specialist)

**Research Focus:** ${userPrompt}
**Status:** 📊 Comprehensive Synthesis Completed

**Key Findings:**
1. **Industry Benchmark:** Multi-agent delegation architectures reduce task resolution latency by up to 42% compared to single-prompt monolithic pipelines.
2. **Context Efficiency:** Specialized role domain prompts preserve token budget and reduce hallucination rates by 68%.
3. **Strategic Recommendation:** Maintain strict Commander CEO top-level routing with specialist execution agents.

*Sources Analyzed:* 14 Academic papers, GitHub benchmark repositories, and internal vector memory logs.`,
        };

      case 'atlas':
        return {
          summary: 'Structured project milestones, sprint backlog, and task breakdown.',
          fullReport: `### 📋 Project Management Plan — **Atlas** (Project Manager)

**Project Objective:** ${userPrompt}
**Status:** 🚀 Milestone Breakdown Formatted

**Sprint Roadmap Breakdown:**
- [x] **Phase 1: Architecture & Sub-Agent Registration** (Completed)
- [ ] **Phase 2: Commander CEO Decision Engine & Task Delegation** (In Progress)
- [ ] **Phase 3: Agent Center Dashboard & Live Execution Logs** (Queued)
- [ ] **Phase 4: Multi-Agent Parallel Execution Simulation** (Planned)

**Resource Allocation:** Assigned to Forge (Dev), Nova (Research), and Sentinel (Security). Estimated Sprint Velocity: 48 Story Points.`,
        };

      case 'titan':
        return {
          summary: 'Drafted high-converting sales pitch deck and deal pipeline proposition.',
          fullReport: `### 💼 Sales Pitch & Client Brief — **Titan** (Sales Assistant)

**Target Opportunity:** ${userPrompt}
**Status:** 🎯 Pitch Proposal Generated

**Value Proposition:**
> *"Commander AI provides an enterprise-grade AI CEO agent that coordinates specialist sub-agents with 100% data governance, zero external vendor lock-in, and instant real-time response."*

**Proposed Deal Pipeline:**
1. **Executive Demo:** Live Agent Center showcase with instant task delegation.
2. **Security Audit:** Sentinel compliance verification.
3. **Closing Offer:** Custom Enterprise License with dedicated SLA guarantees.`,
        };

      case 'vault':
        return {
          summary: 'Indexed context documents into vector memory and retrieved semantic context.',
          fullReport: `### 🔒 Knowledge Base Indexing — **Vault** (Memory Manager)

**Context Query:** ${userPrompt}
**Status:** 🧠 Context Retrieval & Vector Store Synced

**Retrieved Knowledge Nodes:**
- \`node_arch_001\`: Commander system architecture specs & state hydration rules.
- \`node_settings_042\`: User customization preferences (Dark theme, Cyan accent).
- \`node_history_099\`: Prior agent execution logs & performance metrics.

*Memory Index Health:* 99.8% vector similarity density with instant sub-5ms lookup time.`,
        };

      case 'echo':
        return {
          summary: 'Extracted meeting transcript agenda and key action items.',
          fullReport: `### 🎙️ Call & Meeting Summary — **Echo** (Call Assistant)

**Meeting Subject:** ${userPrompt}
**Status:** 📝 Transcript Analyzed & Action Items Extracted

**Executive Summary:**
Discussed multi-agent delegation strategy with Commander acting as the primary AI CEO interface. Verified that end users interact exclusively with Commander.

**Action Items:**
1. **Atlas**: Monitor milestone deadlines in Agent Center.
2. **Forge**: Maintain clean TypeScript code compilation across all modules.
3. **Sentinel**: Ensure local sandbox data privacy.`,
        };

      case 'orbit':
        return {
          summary: 'Configured automated workflow pipeline script and trigger cron schedules.',
          fullReport: `### ⚡ Automation Workflow Brief — **Orbit** (Automation Engine)

**Workflow Target:** ${userPrompt}
**Status:** 🔄 Pipeline Script Generated & Scheduled

\`\`\`yaml
# Commander Automated Pipeline Schedule
name: Agent-Health-Sync-Cron
on:
  schedule:
    - cron: '*/15 * * * *'
jobs:
  agent_check:
    runs-on: commander-local-node
    steps:
      - name: Trigger Agent Diagnostics
        run: agentManager.runHealthCheck()
\`\`\`

**Pipeline Status:** Scheduled and active in background worker process.`,
        };

      case 'sentinel':
      default:
        return {
          summary: 'Audited role permissions, access control, and security compliance.',
          fullReport: `### 🛡️ Security Audit Report — **Sentinel** (Security & Compliance)

**Audit Target:** ${userPrompt}
**Status:** 🔒 0 Critical Vulnerabilities Detected

**Security Audit Findings:**
- **Data Governance:** 100% Mock Client-Side Sandbox Storage (No external leak points).
- **Authentication:** OAuth & JWT local session tokens verified.
- **Access Control:** User \`Aitzaz\` authenticated as Administrator / Architect.

*Compliance Status:* Fully compliant with system security guidelines.`,
        };
    }
  }
}

export const agentService = new AgentManagerService();
