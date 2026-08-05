import { 
  Workflow, 
  WorkflowStep, 
  WorkflowTaskType, 
  CommandHistoryItem, 
  SubAgentId, 
  SubAgent 
} from '../types';
import { sharedMemoryService } from './sharedMemoryService';
import { apiService } from './apiService';

const WORKFLOWS_STORAGE_KEY = 'commander_preview_workflows';
const COMMAND_HISTORY_KEY = 'commander_preview_command_history';

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    userPrompt: 'Commander, plan and execute the Phase 2 multi-agent workflow architecture.',
    goal: 'Design and deploy multi-agent workflow orchestration with shared memory sync.',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 4.8).toISOString(),
    estimatedCompletionTimeSec: 12,
    currentStepIndex: 3,
    logs: [
      'Commander initialized multi-agent workflow engine.',
      'Step 1 [Atlas]: Structured project roadmap and sub-task dependencies.',
      'Step 2 [Nova]: Conducted comparative benchmarks on agent execution velocity.',
      'Step 3 [Forge]: Implemented TypeScript Workflow Engine & Shared Memory Service.',
      'Workflow completed successfully across 3 specialist agents.'
    ],
    steps: [
      {
        id: 'step-101',
        agentId: 'atlas',
        taskType: 'Project Management',
        title: 'Milestone Roadmap & Task Breakdown',
        description: 'Decompose task into structured sub-tasks and assign specialist agents.',
        status: 'completed',
        output: 'Roadmap generated with 4 sprint phases and agent resource allocations.',
        executionTimeMs: 840,
        retryCount: 0,
      },
      {
        id: 'step-102',
        agentId: 'nova',
        taskType: 'Research',
        title: 'Multi-Agent Framework Benchmarks',
        description: 'Research latency, token efficiency, and error rates of agent chains.',
        status: 'completed',
        output: 'Research synthesis verified 3.2x speedup in agent sequential processing.',
        executionTimeMs: 1120,
        retryCount: 0,
      },
      {
        id: 'step-103',
        agentId: 'forge',
        taskType: 'Coding',
        title: 'Workflow Engine Implementation',
        description: 'Build modular TypeScript services for workflow queue and state tracking.',
        status: 'completed',
        output: 'Workflow engine and shared memory services compiled cleanly.',
        executionTimeMs: 1450,
        retryCount: 0,
      }
    ]
  },
  {
    id: 'wf-002',
    userPrompt: 'Commander, audit system permissions and index security policies.',
    goal: 'Audit role permissions and store security compliance policies in shared memory.',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 11.9).toISOString(),
    estimatedCompletionTimeSec: 8,
    currentStepIndex: 2,
    logs: [
      'Commander initialized security audit workflow.',
      'Step 1 [Sentinel]: Audited RBAC role permissions and local storage boundaries.',
      'Step 2 [Vault]: Ingested security policies into local shared memory store.',
      'Workflow completed with 0 critical security alerts.'
    ],
    steps: [
      {
        id: 'step-201',
        agentId: 'sentinel',
        taskType: 'Planning',
        title: 'System Access & Role Permission Audit',
        description: 'Verify token authorization, user role RBAC, and client-side sandbox.',
        status: 'completed',
        output: '100% compliant with local sandbox data governance standard.',
        executionTimeMs: 620,
        retryCount: 0,
      },
      {
        id: 'step-202',
        agentId: 'vault',
        taskType: 'Memory',
        title: 'Shared Memory Security Indexing',
        description: 'Write verified security parameters to shared memory context.',
        status: 'completed',
        output: 'Indexed key `security_sandbox_governance` in shared memory.',
        executionTimeMs: 480,
        retryCount: 0,
      }
    ]
  }
];

const INITIAL_COMMAND_HISTORY: CommandHistoryItem[] = [
  {
    id: 'cmd-101',
    userCommand: 'Commander, plan and execute the Phase 2 multi-agent workflow architecture.',
    decisionReasoning: 'Commander AI CEO analyzed requirement and generated a 3-agent chain: Atlas (Roadmap) → Nova (Research) → Forge (Code).',
    assignedAgents: ['atlas', 'nova', 'forge'],
    workflowId: 'wf-001',
    executionTimeMs: 3410,
    status: 'success',
    resultSummary: 'Phase 2 workflow architecture compiled successfully with shared memory integration.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cmd-102',
    userCommand: 'Commander, audit system permissions and index security policies.',
    decisionReasoning: 'Commander routed to Sentinel for security audit, then Vault for memory indexing.',
    assignedAgents: ['sentinel', 'vault'],
    workflowId: 'wf-002',
    executionTimeMs: 1100,
    status: 'success',
    resultSummary: 'Security audit complete. Policy cached in local shared memory.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

class WorkflowEngineService {
  private workflows: Workflow[] = [];
  private commandHistory: CommandHistoryItem[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined') {
      const storedWorkflows = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
      if (storedWorkflows) {
        try {
          this.workflows = JSON.parse(storedWorkflows);
        } catch {
          this.workflows = INITIAL_WORKFLOWS;
        }
      } else {
        this.workflows = INITIAL_WORKFLOWS;
        this.saveWorkflows();
      }

      const storedHistory = localStorage.getItem(COMMAND_HISTORY_KEY);
      if (storedHistory) {
        try {
          this.commandHistory = JSON.parse(storedHistory);
        } catch {
          this.commandHistory = INITIAL_COMMAND_HISTORY;
        }
      } else {
        this.commandHistory = INITIAL_COMMAND_HISTORY;
        this.saveHistory();
      }
    } else {
      this.workflows = INITIAL_WORKFLOWS;
      this.commandHistory = INITIAL_COMMAND_HISTORY;
    }
  }

  private saveWorkflows() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(this.workflows));
    }
  }

  private saveHistory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(this.commandHistory));
    }
  }

  public getWorkflows(): Workflow[] {
    return [...this.workflows];
  }

  public getWorkflowById(id: string): Workflow | undefined {
    return this.workflows.find(w => w.id === id);
  }

  public getCommandHistory(): CommandHistoryItem[] {
    return [...this.commandHistory];
  }

  // COMMANDER PLANNING ENGINE
  // Analyzes prompt and decomposes into a multi-step workflow assigned to appropriate agents
  public planWorkflow(userPrompt: string): Workflow {
    const promptLower = userPrompt.toLowerCase();
    const workflowId = 'wf-' + Math.random().toString(36).substring(2, 8);
    const now = new Date().toISOString();

    const steps: WorkflowStep[] = [];

    // Analyze intent to construct intelligent agent chains:
    
    // Case A: Full-Stack Feature or Code Building
    if (promptLower.match(/(build|create|code|develop|feature|app|refactor|system|pipeline)/i)) {
      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'atlas',
        taskType: 'Project Management',
        title: 'Project Roadmap & Dependency Mapping',
        description: 'Define sprint milestones and sub-task specifications.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Medium',
        priority: 'High',
        estimatedTimeSec: 3
      });

      if (promptLower.match(/(research|analyze|study|trend|data)/i)) {
        steps.push({
          id: 'step-' + Math.random().toString(36).substring(2, 6),
          agentId: 'nova',
          taskType: 'Research',
          title: 'Technical Research & Best Practices',
          description: 'Synthesize library capabilities and architectural benchmarks.',
          status: 'pending',
          retryCount: 0,
          difficulty: 'Hard',
          priority: 'Medium',
          estimatedTimeSec: 4
        });
      }

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'forge',
        taskType: 'Coding',
        title: 'Code Generation & Implementation',
        description: 'Write TypeScript code components and refactor handlers.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Hard',
        priority: 'High',
        estimatedTimeSec: 5
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'sentinel',
        taskType: 'Planning',
        title: 'Security Compliance Audit',
        description: 'Verify role permissions and sandbox data safety.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Easy',
        priority: 'Medium',
        estimatedTimeSec: 2
      });
    }
    // Case B: Sales, Client or Pitch
    else if (promptLower.match(/(pitch|client|sales|deal|proposal|marketing)/i)) {
      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'nova',
        taskType: 'Research',
        title: 'Client & Market Intelligence',
        description: 'Analyze target company profile and value drivers.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Medium',
        priority: 'Medium',
        estimatedTimeSec: 3
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'titan',
        taskType: 'Writing',
        title: 'Draft Pitch Proposal',
        description: 'Draft persuasive sales proposal and value proposition.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Hard',
        priority: 'High',
        estimatedTimeSec: 4
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'echo',
        taskType: 'Call Preparation',
        title: 'Executive Demo & Agenda Prep',
        description: 'Synthesize meeting agenda and talking points.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Easy',
        priority: 'Medium',
        estimatedTimeSec: 2
      });
    }
    // Case C: Automation or Cron
    else if (promptLower.match(/(automate|cron|pipeline|schedule|repeat|trigger)/i)) {
      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'atlas',
        taskType: 'Planning',
        title: 'Workflow Trigger Specifications',
        description: 'Define execution frequency and error notification rules.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Easy',
        priority: 'Medium',
        estimatedTimeSec: 2
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'orbit',
        taskType: 'Automation',
        title: 'Configure Background Pipeline',
        description: 'Schedule automated background jobs and event triggers.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Medium',
        priority: 'High',
        estimatedTimeSec: 3
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'vault',
        taskType: 'Memory',
        title: 'Persist Pipeline Metadata',
        description: 'Index pipeline logs into shared vector memory.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Easy',
        priority: 'Low',
        estimatedTimeSec: 2
      });
    }
    // Default Generic CEO Multi-Agent Workflow (Nova -> Forge -> Vault)
    else {
      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'nova',
        taskType: 'Research',
        title: 'Contextual Research & Scope Breakdown',
        description: 'Gather domain knowledge and structure goal requirements.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Medium',
        priority: 'Medium',
        estimatedTimeSec: 3
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'forge',
        taskType: 'Coding',
        title: 'Technical Execution & Generation',
        description: 'Process technical specifications and generate solution.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Hard',
        priority: 'High',
        estimatedTimeSec: 4
      });

      steps.push({
        id: 'step-' + Math.random().toString(36).substring(2, 6),
        agentId: 'vault',
        taskType: 'Memory',
        title: 'Store Results in Shared Memory',
        description: 'Index execution outcome for future contextual recall.',
        status: 'pending',
        retryCount: 0,
        difficulty: 'Easy',
        priority: 'Low',
        estimatedTimeSec: 2
      });
    }

    const workflow: Workflow = {
      id: workflowId,
      userPrompt,
      goal: `Commander AI CEO execution plan for: "${userPrompt}"`,
      steps,
      status: 'pending',
      createdAt: now,
      estimatedCompletionTimeSec: steps.length * 3,
      currentStepIndex: 0,
      logs: [`Commander initialized plan with ${steps.length} specialist agent steps.`],
    };

    this.workflows = [workflow, ...this.workflows];
    this.saveWorkflows();
    return workflow;
  }

  // EXECUTE WORKFLOW
  public async executeWorkflow(
    workflowId: string,
    onStepChange?: (workflow: Workflow, activeStep: WorkflowStep) => void,
    updateAgentStatusFn?: (id: SubAgentId, status: any, currentTask?: string) => void
  ): Promise<Workflow> {
    let wf = this.getWorkflowById(workflowId);
    if (!wf) throw new Error('Workflow not found');

    wf.status = 'running';
    wf.logs.push(`[${new Date().toLocaleTimeString()}] Commander CEO started workflow execution.`);
    this.saveWorkflows();

    const startTime = performance.now();
    const assignedAgentIds: SubAgentId[] = Array.from(new Set(wf.steps.map(s => s.agentId)));

    for (let i = 0; i < wf.steps.length; i++) {
      wf.currentStepIndex = i;
      const step = wf.steps[i];
      step.status = 'running';

      wf.logs.push(`[${new Date().toLocaleTimeString()}] Step ${i + 1}/${wf.steps.length}: Delegated to agent [${step.agentId.toUpperCase()}] — ${step.title}`);
      this.saveWorkflows();

      if (updateAgentStatusFn) {
        updateAgentStatusFn(step.agentId, 'Thinking', step.title);
      }

      if (onStepChange) onStepChange(wf, step);

      // Simulate step execution delay
      await new Promise(res => setTimeout(res, 1200));

      if (updateAgentStatusFn) {
        updateAgentStatusFn(step.agentId, 'Busy', step.title);
      }

      // Simulated chance of failure for retry testing if step explicitly requests error
      const simulateFailure = step.title.toLowerCase().includes('fail_test') && step.retryCount === 0;

      if (simulateFailure) {
        step.status = 'failed';
        step.errorDetails = 'Simulated connection timeout during step execution.';
        step.retryCount += 1;
        wf.logs.push(`[${new Date().toLocaleTimeString()}] ❌ Step ${i + 1} failed: ${step.errorDetails}. Auto-scheduling retry...`);
        this.saveWorkflows();

        if (updateAgentStatusFn) {
          updateAgentStatusFn(step.agentId, 'Online');
        }

        // Retry Step Automatically
        step.status = 'retrying';
        wf.logs.push(`[${new Date().toLocaleTimeString()}] 🔄 Retrying step ${i + 1} with agent [${step.agentId.toUpperCase()}]...`);
        this.saveWorkflows();

        await new Promise(res => setTimeout(res, 1000));
      }

      // Complete Step
      const stepExecutionTime = Math.round(900 + Math.random() * 600);
      step.status = 'completed';
      step.executionTimeMs = stepExecutionTime;
      step.output = `Executed ${step.taskType} task: "${step.title}". Results validated by ${step.agentId.toUpperCase()}.`;

      wf.logs.push(`[${new Date().toLocaleTimeString()}] ✅ Step ${i + 1} completed in ${stepExecutionTime}ms.`);

      // Write agent findings to Shared Memory
      sharedMemoryService.writeMemory(
        `wf_${wf.id}_step_${i + 1}_${step.agentId}`,
        step.output,
        'task_progress',
        step.agentId,
        [step.taskType.toLowerCase(), step.agentId],
        `Output generated during workflow ${wf.id}`
      );

      if (updateAgentStatusFn) {
        updateAgentStatusFn(step.agentId, 'Online');
      }

      this.saveWorkflows();
    }

    const totalExecutionTimeMs = Math.round(performance.now() - startTime);

    wf.status = 'completed';
    wf.completedAt = new Date().toISOString();
    wf.logs.push(`[${new Date().toLocaleTimeString()}] 🎉 Multi-agent workflow completed successfully in ${(totalExecutionTimeMs / 1000).toFixed(1)}s.`);
    this.saveWorkflows();

    // Log to Command History
    const historyItem: CommandHistoryItem = {
      id: 'cmd-' + Math.random().toString(36).substring(2, 8),
      userCommand: wf.userPrompt,
      decisionReasoning: `Commander AI CEO decomposed request into a ${wf.steps.length}-step agent workflow across: ${assignedAgentIds.join(', ')}.`,
      assignedAgents: assignedAgentIds,
      workflowId: wf.id,
      executionTimeMs: totalExecutionTimeMs,
      status: 'success',
      resultSummary: `All ${wf.steps.length} workflow steps completed successfully. Shared memory updated.`,
      timestamp: new Date().toISOString(),
    };

    this.commandHistory = [historyItem, ...this.commandHistory];
    this.saveHistory();

    await apiService.logActivity(
      'Commander completed multi-agent workflow',
      'task',
      `Workflow ID: ${wf.id} | Steps: ${wf.steps.length} | Agents: ${assignedAgentIds.join(', ')}`
    );

    return wf;
  }

  // Retry Failed Step
  public async retryWorkflowStep(
    workflowId: string,
    stepId: string,
    updateAgentStatusFn?: (id: SubAgentId, status: any, currentTask?: string) => void
  ): Promise<Workflow> {
    const wf = this.getWorkflowById(workflowId);
    if (!wf) throw new Error('Workflow not found');

    const step = wf.steps.find(s => s.id === stepId);
    if (!step) throw new Error('Step not found');

    step.status = 'retrying';
    step.retryCount += 1;
    wf.logs.push(`[${new Date().toLocaleTimeString()}] Manual retry triggered for step "${step.title}" [${step.agentId.toUpperCase()}].`);
    this.saveWorkflows();

    if (updateAgentStatusFn) {
      updateAgentStatusFn(step.agentId, 'Thinking', `Retrying: ${step.title}`);
    }

    await new Promise(res => setTimeout(res, 1200));

    step.status = 'completed';
    step.executionTimeMs = 950;
    step.output = `Retried task successfully. Output verified by ${step.agentId.toUpperCase()}.`;
    step.errorDetails = undefined;

    wf.logs.push(`[${new Date().toLocaleTimeString()}] ✅ Retry successful for step "${step.title}".`);

    // Check if all steps completed
    if (wf.steps.every(s => s.status === 'completed')) {
      wf.status = 'completed';
      wf.completedAt = new Date().toISOString();
    }

    this.saveWorkflows();

    if (updateAgentStatusFn) {
      updateAgentStatusFn(step.agentId, 'Online');
    }

    return wf;
  }

  public clearHistory(): void {
    this.commandHistory = [];
    this.saveHistory();
  }
}

export const workflowService = new WorkflowEngineService();
