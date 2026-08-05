import { toolEngineService } from './toolEngineService';
import { memoryService } from './memoryService';
import { virtualFileService } from './fileService';
import { pluginService } from './pluginService';
import { apiService } from './apiService';
import { 
  googleAccountService, 
  gmailService, 
  calendarService, 
  driveService, 
  docsService, 
  tasksService 
} from './googleWorkspace';

export interface DecisionResult {
  analyzedIntent: string;
  retrievedMemories: any[];
  executedTools: {
    toolId: string;
    toolName: string;
    success: boolean;
    result: any;
    logs: string[];
    executionTimeMs: number;
  }[];
  pluginContext: {
    detectedPluginId?: string;
    pluginName?: string;
    status?: string;
    requiresAction?: boolean;
    notice?: string;
  };
  augmentedContextPrompt: string;
}

class CommanderDecisionEngine {
  /**
   * Intelligently processes user input, retrieves relevant memory, selects & executes tools/plugins, and prepares augmented prompt.
   */
  public async processDecisionPipeline(userQuery: string): Promise<DecisionResult> {
    const qLower = userQuery.toLowerCase();
    
    // 1. Analyze Intent
    let analyzedIntent = 'General Executive Command';
    if (qLower.includes('gmail') || qLower.includes('email') || qLower.includes('inbox') || qLower.includes('mail')) {
      analyzedIntent = 'Google Workspace - Gmail Operations';
    } else if (qLower.includes('calendar') || qLower.includes('schedule') || qLower.includes('event') || qLower.includes('meeting')) {
      analyzedIntent = 'Google Workspace - Calendar Operations';
    } else if (qLower.includes('drive') || qLower.includes('gdrive') || qLower.includes('cloud file')) {
      analyzedIntent = 'Google Workspace - Drive Operations';
    } else if (qLower.includes('doc') || qLower.includes('gdoc') || qLower.includes('outline')) {
      analyzedIntent = 'Google Workspace - Docs Operations';
    } else if (qLower.includes('google task') || qLower.includes('gtask')) {
      analyzedIntent = 'Google Workspace - Tasks Operations';
    } else if (qLower.includes('task') || qLower.includes('todo') || qLower.includes('check')) {
      analyzedIntent = 'Task Management & Execution';
    } else if (qLower.includes('note') || qLower.includes('memo') || qLower.includes('write')) {
      analyzedIntent = 'Note Creation & Knowledge Archiving';
    } else if (qLower.includes('memory') || qLower.includes('remember') || qLower.includes('profile') || qLower.includes('goal')) {
      analyzedIntent = 'Long-Term Memory Search & Store';
    } else if (qLower.includes('search') || qLower.includes('find') || qLower.includes('where')) {
      analyzedIntent = 'Global Cross-Domain Search';
    } else if (qLower.includes('file') || qLower.includes('folder') || qLower.includes('directory')) {
      analyzedIntent = 'Virtual File System Management';
    } else if (qLower.includes('calc') || qLower.includes('math') || qLower.includes('roi') || /[0-9]+\s*[\+\-\*\/]\s*[0-9]+/.test(qLower)) {
      analyzedIntent = 'Mathematical & Financial Computation';
    } else if (qLower.includes('report') || qLower.includes('status') || qLower.includes('metrics')) {
      analyzedIntent = 'Executive Report Synthesis';
    } else if (qLower.includes('workflow') || qLower.includes('automate') || qLower.includes('pipeline')) {
      analyzedIntent = 'Workflow Automation Setup';
    }

    // 2. Check Memory for Relevant Context
    const retrievedMemories = memoryService.searchMemories(userQuery);
    const pinnedMemories = memoryService.getMemories().filter(m => m.pinned);
    
    // Combine top 3 relevant memories + pinned memories
    const memoryContextList = Array.from(
      new Set([...pinnedMemories, ...retrievedMemories.slice(0, 3)])
    );

    // 3. Plugin Engine Checks
    let pluginContext: DecisionResult['pluginContext'] = {};
    const pluginMappings: { keywords: string[]; pluginId: string }[] = [
      { keywords: ['github', 'repo', 'pull request', 'issue', 'commit'], pluginId: 'github-plugin' },
      { keywords: ['gmail', 'email', 'inbox', 'mail'], pluginId: 'gmail-plugin' },
      { keywords: ['gdrive', 'google drive', 'docs', 'cloud file'], pluginId: 'gdrive-plugin' },
      { keywords: ['calendar', 'agenda', 'schedule', 'event', 'meeting'], pluginId: 'calendar-plugin' },
      { keywords: ['slack', 'channel', 'slack message'], pluginId: 'slack-plugin' },
      { keywords: ['discord', 'server', 'guild'], pluginId: 'discord-plugin' },
      { keywords: ['notion', 'wiki', 'notion page'], pluginId: 'notion-plugin' },
      { keywords: ['crm', 'deal', 'leads', 'client pipeline'], pluginId: 'crm-plugin' },
      { keywords: ['browse', 'scrape', 'webpage', 'dom'], pluginId: 'browser-plugin' }
    ];

    for (const mapping of pluginMappings) {
      if (mapping.keywords.some(k => qLower.includes(k))) {
        const plugin = pluginService.getPlugin(mapping.pluginId);
        if (plugin) {
          pluginContext.detectedPluginId = plugin.id;
          pluginContext.pluginName = plugin.name;
          pluginContext.status = plugin.status;

          if (!plugin.installed || plugin.status === 'disabled') {
            pluginContext.requiresAction = true;
            pluginContext.notice = `[PLUGIN REQUIRED] ${plugin.name} is required for this action. Current Status: ${plugin.installed ? 'Disabled' : 'Not Installed'}. Commander should ask the user if they would like to ${plugin.installed ? 'enable' : 'install'} it.`;
          } else {
            // Execute plugin action cleanly
            await pluginService.executePlugin(plugin.id, 'command_query', { query: userQuery });
            pluginContext.notice = `[PLUGIN ACTIVE] Executed request via ${plugin.name} (v${plugin.version}).`;
          }
        }
        break;
      }
    }

    // 4. Intelligently Select and Execute Required Tools
    const executedTools: DecisionResult['executedTools'] = [];

    // Helper to execute tool and append
    const runTool = async (toolId: string, params: any) => {
      try {
        const toolDef = toolEngineService.getTool(toolId);
        if (!toolDef) return;
        const toolRes = await toolEngineService.executeTool(toolId, params, toolDef.permissionLevel);
        executedTools.push({
          toolId,
          toolName: toolDef.name,
          success: toolRes.success,
          result: toolRes.result,
          logs: toolRes.logs,
          executionTimeMs: toolRes.executionTimeMs
        });
      } catch (err) {
        console.error(`Error running tool ${toolId}:`, err);
      }
    };

    // Decision Logic for Tool Selection
    if (analyzedIntent === 'Google Workspace - Gmail Operations') {
      try {
        const emailSummaries = await gmailService.getEmailSummaries();
        executedTools.push({
          toolId: 'gmail-workspace-tool',
          toolName: 'Gmail API Integration',
          success: true,
          result: emailSummaries,
          logs: [`Retrieved ${emailSummaries.length} Gmail executive summaries via OAuth 2.0.`],
          executionTimeMs: 120
        });
      } catch (err: any) {
        executedTools.push({
          toolId: 'gmail-workspace-tool',
          toolName: 'Gmail API Integration',
          success: false,
          result: { error: err.message },
          logs: [err.message],
          executionTimeMs: 40
        });
      }
    } else if (analyzedIntent === 'Google Workspace - Calendar Operations') {
      try {
        const events = await calendarService.getCalendarEvents();
        executedTools.push({
          toolId: 'calendar-workspace-tool',
          toolName: 'Google Calendar API Integration',
          success: true,
          result: events,
          logs: [`Retrieved ${events.length} Google Calendar agenda events via OAuth 2.0.`],
          executionTimeMs: 110
        });
      } catch (err: any) {
        executedTools.push({
          toolId: 'calendar-workspace-tool',
          toolName: 'Google Calendar API Integration',
          success: false,
          result: { error: err.message },
          logs: [err.message],
          executionTimeMs: 35
        });
      }
    } else if (analyzedIntent === 'Google Workspace - Drive Operations') {
      try {
        const files = await driveService.getDriveFiles();
        executedTools.push({
          toolId: 'drive-workspace-tool',
          toolName: 'Google Drive API Integration',
          success: true,
          result: files,
          logs: [`Retrieved ${files.length} Drive files via OAuth 2.0.`],
          executionTimeMs: 140
        });
      } catch (err: any) {
        executedTools.push({
          toolId: 'drive-workspace-tool',
          toolName: 'Google Drive API Integration',
          success: false,
          result: { error: err.message },
          logs: [err.message],
          executionTimeMs: 30
        });
      }
    } else if (analyzedIntent === 'Google Workspace - Docs Operations') {
      try {
        const docs = await docsService.getDocMetadata();
        executedTools.push({
          toolId: 'docs-workspace-tool',
          toolName: 'Google Docs API Integration',
          success: true,
          result: docs,
          logs: [`Retrieved metadata for ${docs.length} Google Docs.`],
          executionTimeMs: 95
        });
      } catch (err: any) {
        executedTools.push({
          toolId: 'docs-workspace-tool',
          toolName: 'Google Docs API Integration',
          success: false,
          result: { error: err.message },
          logs: [err.message],
          executionTimeMs: 25
        });
      }
    } else if (analyzedIntent === 'Google Workspace - Tasks Operations') {
      try {
        const gtasks = await tasksService.getTasks();
        executedTools.push({
          toolId: 'tasks-workspace-tool',
          toolName: 'Google Tasks API Integration',
          success: true,
          result: gtasks,
          logs: [`Retrieved ${gtasks.length} Google Tasks.`],
          executionTimeMs: 80
        });
      } catch (err: any) {
        executedTools.push({
          toolId: 'tasks-workspace-tool',
          toolName: 'Google Tasks API Integration',
          success: false,
          result: { error: err.message },
          logs: [err.message],
          executionTimeMs: 20
        });
      }
    } else if (analyzedIntent === 'Task Management & Execution') {
      if (qLower.includes('create') || qLower.includes('add')) {
        await runTool('task-tool', { action: 'create', title: userQuery.replace(/create task|add task/gi, '').trim() || 'New Task' });
      } else {
        await runTool('task-tool', { action: 'list' });
      }
    } else if (analyzedIntent === 'Note Creation & Knowledge Archiving') {
      if (qLower.includes('create') || qLower.includes('save') || qLower.includes('write')) {
        await runTool('notes-tool', { action: 'create', title: 'Executive Memo', content: userQuery });
      } else {
        await runTool('notes-tool', { action: 'list' });
      }
    } else if (analyzedIntent === 'Long-Term Memory Search & Store') {
      await runTool('memory-tool', { action: 'search', query: userQuery });
    } else if (analyzedIntent === 'Global Cross-Domain Search') {
      await runTool('search-tool', { query: userQuery });
    } else if (analyzedIntent === 'Virtual File System Management') {
      await runTool('file-tool', { action: 'list' });
    } else if (analyzedIntent === 'Mathematical & Financial Computation') {
      const match = userQuery.match(/[0-9\.\+\-\*\/\(\)\s]+/);
      const expr = match ? match[0].trim() : '100 * 1.5 + 42';
      await runTool('calculator-tool', { expression: expr });
    } else if (analyzedIntent === 'Executive Report Synthesis') {
      await runTool('report-tool', { query: userQuery });
    } else if (analyzedIntent === 'Workflow Automation Setup') {
      await runTool('workflow-tool', { query: userQuery });
    } else {
      // Default: Run Memory Tool for context & Search Tool if keywords match
      await runTool('memory-tool', { action: 'search', query: userQuery });
    }

    // 5. Automatically save key findings to memory if user requested storing knowledge
    if (qLower.includes('remember') || qLower.includes('save to memory') || qLower.includes('store this')) {
      memoryService.storeMemory({
        type: 'Knowledge',
        title: 'User Instruction Memo',
        content: userQuery,
        tags: ['user', 'instruct', 'auto-saved'],
        importance: 'high'
      });
    }

    // 6. Synthesize Augmented Prompt for LLM Execution
    const memoryString = memoryContextList
      .map(m => `- [${m.type}] ${m.title}: ${m.content}`)
      .join('\n');

    const toolOutputsString = executedTools
      .map(t => `[TOOL: ${t.toolName} (${t.success ? 'Success' : 'Failed'})]: ${JSON.stringify(t.result)}`)
      .join('\n');

    const augmentedContextPrompt = `
COMMANDER DECISION ENGINE ANALYSIS:
- Identified Intent: ${analyzedIntent}
- Long-Term Memory Context (Retrieved ${memoryContextList.length} nodes):
${memoryString || 'None'}

- Executed Tools Output (${executedTools.length} tools executed):
${toolOutputsString || 'No direct tool invocation required.'}

- Plugin Engine Status:
${pluginContext.notice || 'No specific plugin activation needed.'}

USER EXECUTIVE COMMAND: "${userQuery}"

Instructions for Commander AI CEO:
Integrate the retrieved long-term memories, tool execution outputs, and plugin status into your authoritative executive response. Speak directly to the user as their AI CEO.
If a plugin is required but disabled or not installed, explicitly mention it (e.g. "${pluginContext.pluginName} is currently disabled. Would you like me to enable it?")
`.trim();

    return {
      analyzedIntent,
      retrievedMemories: memoryContextList,
      executedTools,
      pluginContext,
      augmentedContextPrompt
    };
  }
}

export const decisionEngine = new CommanderDecisionEngine();
