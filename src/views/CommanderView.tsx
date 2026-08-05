import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Square, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  RotateCcw, 
  Mic, 
  Volume2, 
  Sparkles, 
  Cpu, 
  CheckSquare, 
  Square as SquareIcon, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  X,
  Pin,
  Search,
  Edit2,
  Archive,
  FileText,
  HardDrive,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, Conversation, CommanderTask, User, AvatarState, ReasoningStage } from '../types';
import { apiService } from '../services/apiService';
import { agentService } from '../services/agentService';
import { commanderMemoryService } from '../services/commanderMemoryService';
import { aiProviderService } from '../services/aiProviderService';
import { decisionEngine } from '../services/decisionEngine';
import { useCommander } from '../hooks/useCommander';
import { CommanderAvatar } from '../components/CommanderAvatar';
import { VoiceControls } from '../components/VoiceControls';
import { voiceService } from '../services/voiceService';

interface CommanderViewProps {
  user: User;
}

export const CommanderView: React.FC<CommanderViewProps> = ({ user }) => {
  const { settings } = useCommander();

  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  
  // Search & Filter state for Conversation History Drawer
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  // Commander AI status & Reasoning Pipeline
  const [commanderStatus, setCommanderStatus] = useState<'Idle' | 'Thinking' | 'Typing'>('Idle');
  const [reasoningStage, setReasoningStage] = useState<ReasoningStage>('Analyze');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isTypingStream, setIsTypingStream] = useState<boolean>(false);
  const abortControllerRef = useRef<boolean>(false);

  // Reasoning Pipeline Stages list for UI rendering
  const REASONING_STAGES: ReasoningStage[] = ['Analyze', 'Think', 'Plan', 'Delegate', 'Execute', 'Review', 'Respond'];

  // Panel state: Tasks, Memory, Voice
  const [tasks, setTasks] = useState<CommanderTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [memoryKB, setMemoryKB] = useState<number>(28.4);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Calculate Avatar state
  const getAvatarState = (): AvatarState => {
    const vStatus = voiceService.getStatus();
    if (vStatus === 'Listening...') return 'listening';
    if (commanderStatus === 'Thinking') return 'thinking';
    if (commanderStatus === 'Typing' || vStatus === 'Speaking...') return 'speaking';
    return 'idle';
  };

  const currentAvatarState = getAvatarState();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial conversation, tasks, memory size
  useEffect(() => {
    async function init() {
      const convs = await apiService.getConversations();
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConvId(convs[0].id);
        setMessages(convs[0].messages);
      } else {
        await handleNewConversation();
      }

      const currentTasks = await apiService.getTasks();
      setTasks(currentTasks);
    }
    init();
  }, []);

  // Recalculate memory size based on messages
  useEffect(() => {
    const totalChars = messages.reduce((acc, m) => acc + m.text.length, 0);
    const kb = (totalChars * 2) / 1024 + 14.2; // Base system allocation + chat tokens
    setMemoryKB(parseFloat(kb.toFixed(1)));
  }, [messages]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, commanderStatus]);

  // Handle switching conversation
  const handleSelectConversation = (conv: Conversation) => {
    setActiveConvId(conv.id);
    setMessages(conv.messages);
    setIsHistoryDrawerOpen(false);
  };

  // Start new conversation
  const handleNewConversation = async () => {
    const newConv: Conversation = {
      id: 'conv-' + Math.random().toString(36).substring(2, 7),
      title: 'New Executive Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      isArchived: false,
      messages: [
        {
          id: 'msg-init-' + Date.now(),
          sender: 'commander',
          text: `Greetings **${user.name}**. Commander AI is online using the **${settings.aiProvider.toUpperCase()}** (${settings.geminiModel || 'gemini-3.6-flash'}) LLM Engine. How can I assist you with your projects, multi-agent workflows, or architecture today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    const updated = await apiService.saveConversation(newConv);
    setConversations(updated);
    setActiveConvId(newConv.id);
    setMessages(newConv.messages);
  };

  // Clear chat messages
  const handleClearChat = async () => {
    if (!activeConvId) return;
    const initialMsg: ChatMessage = {
      id: 'msg-init-' + Date.now(),
      sender: 'commander',
      text: `Chat history cleared. I am ready for your next command, **${user.name}**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);

    const targetConv = conversations.find(c => c.id === activeConvId);
    if (targetConv) {
      const updatedConv = { ...targetConv, messages: [initialMsg] };
      const list = await apiService.saveConversation(updatedConv);
      setConversations(list);
    }
  };

  // Toggle Pin Conversation
  const handleTogglePin = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedConvs = conversations.map(c => 
      c.id === convId ? { ...c, isPinned: !c.isPinned } : c
    );
    setConversations(updatedConvs);
    const target = updatedConvs.find(c => c.id === convId);
    if (target) await apiService.saveConversation(target);
  };

  // Toggle Archive Conversation
  const handleToggleArchive = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedConvs = conversations.map(c => 
      c.id === convId ? { ...c, isArchived: !c.isArchived } : c
    );
    setConversations(updatedConvs);
    const target = updatedConvs.find(c => c.id === convId);
    if (target) await apiService.saveConversation(target);
  };

  // Delete Conversation
  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = conversations.filter(c => c.id !== convId);
    setConversations(filtered);
    await apiService.deleteConversation(convId);
    if (activeConvId === convId) {
      if (filtered.length > 0) {
        setActiveConvId(filtered[0].id);
        setMessages(filtered[0].messages);
      } else {
        await handleNewConversation();
      }
    }
  };

  // Save Conversation Title Rename
  const handleSaveTitle = async (convId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTitle.trim()) return;
    const updatedConvs = conversations.map(c => 
      c.id === convId ? { ...c, title: editingTitle.trim() } : c
    );
    setConversations(updatedConvs);
    setEditingConvId(null);
    const target = updatedConvs.find(c => c.id === convId);
    if (target) await apiService.saveConversation(target);
  };

  // Summarize Conversation
  const handleSummarizeConversation = async () => {
    if (messages.length <= 1 || isSummarizing) return;
    setIsSummarizing(true);
    try {
      const conversationText = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
      const prompt = `Synthesize a 2-bullet executive summary of this conversation:\n\n${conversationText}`;
      const summary = await aiProviderService.generateResponse(prompt, settings, []);
      
      const targetConv = conversations.find(c => c.id === activeConvId);
      if (targetConv) {
        const updatedConv = { ...targetConv, summary };
        const list = await apiService.saveConversation(updatedConv);
        setConversations(list);
      }
    } catch (err) {
      console.error('Failed to generate conversation summary:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Send Message with Real LLM Provider Integration & Reasoning Pipeline
  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || isTypingStream) return;

    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customQuery) setInput('');

    // Trigger Commander CEO Thinking & Reasoning Pipeline
    setCommanderStatus('Thinking');
    setReasoningStage('Analyze');
    abortControllerRef.current = false;

    // Save command to memory
    commanderMemoryService.recordCommand(textToSend.trim());

    // Save title if it's first user message
    let title = conversations.find(c => c.id === activeConvId)?.title || 'New Session';
    if (messages.length <= 1) {
      title = textToSend.trim().substring(0, 28) + (textToSend.length > 28 ? '...' : '');
    }

    // Step 1: Analyze & Route to Agent
    setReasoningStage('Think');
    const assignedAgent = agentService.routeTask(textToSend);

    const commanderMsgId = 'msg-c-' + Date.now();
    const initialCommanderMsg: ChatMessage = {
      id: commanderMsgId,
      sender: 'commander',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      delegatedAgentId: assignedAgent.id,
      delegatedAgentName: `${assignedAgent.name} (${assignedAgent.role})`,
      delegationStatus: 'delegating',
    };

    setMessages(prev => [...prev, initialCommanderMsg]);

    try {
      // Step 2: Create Execution Plan
      setReasoningStage('Plan');
      await new Promise(res => setTimeout(res, 300));
      
      // Step 3: Execute Task via Specialist Sub-Agent Delegation
      setReasoningStage('Delegate');
      const { responseText: agentReport } = await agentService.executeDelegatedTask(
        textToSend,
        (status, _stepText, agent) => {
          if (status === 'processing') setReasoningStage('Execute');
          setMessages(prev =>
            prev.map(m =>
              m.id === commanderMsgId
                ? {
                    ...m,
                    delegatedAgentId: agent.id,
                    delegatedAgentName: `${agent.name} (${agent.role})`,
                    delegationStatus: status,
                  }
                : m
            )
          );
        }
      );

      if (abortControllerRef.current) return;

      // Step 4: Execute Decision Engine (Tool Engine Selection & Long-Term Memory Retrieval)
      setReasoningStage('Review');
      const decisionResult = await decisionEngine.processDecisionPipeline(textToSend);

      // Step 5: Synthesize Final CEO Executive Response using Real LLM Provider
      setReasoningStage('Respond');
      setCommanderStatus('Typing');
      setIsTypingStream(true);

      const systemContextPrompt = `You are Commander AI, the intelligent AI CEO of Commander AI OS.
Evaluating report from specialist sub-agent ${assignedAgent.name} (${assignedAgent.role}) for request: "${textToSend}".

${decisionResult.augmentedContextPrompt}

Sub-Agent Report:
${agentReport}

Instructions:
1. Synthesize an authoritative, executive-level final response for user ${user.name}.
2. Speak directly as Commander (the AI CEO). Incorporate sub-agent report and tool/memory execution findings cleanly.
3. Use clear Markdown formatting with structured headers and concise bullet points.`;

      let accumulatedText = '';

      if (settings.streamingEnabled) {
        await aiProviderService.generateResponse(
          systemContextPrompt,
          settings,
          messages,
          (chunk) => {
            if (abortControllerRef.current) return;
            accumulatedText += chunk;
            setMessages(prev =>
              prev.map(m =>
                m.id === commanderMsgId
                  ? { ...m, text: accumulatedText, delegationStatus: 'completed' }
                  : m
              )
            );
          }
        );
      } else {
        accumulatedText = await aiProviderService.generateResponse(
          systemContextPrompt,
          settings,
          messages
        );
        setMessages(prev =>
          prev.map(m =>
            m.id === commanderMsgId
              ? { ...m, text: accumulatedText, delegationStatus: 'completed' }
              : m
          )
        );
      }

      setCommanderStatus('Idle');
      setIsTypingStream(false);

      // Save updated conversation to storage
      const finalMsgList = [
        ...newMessages,
        {
          ...initialCommanderMsg,
          text: accumulatedText || agentReport,
          delegationStatus: 'completed' as const,
        },
      ];

      const updatedConv: Conversation = {
        id: activeConvId,
        title,
        messages: finalMsgList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const convList = await apiService.saveConversation(updatedConv);
      setConversations(convList);

    } catch (err) {
      console.error('Commander processing error:', err);
      setCommanderStatus('Idle');
      setIsTypingStream(false);
    }
  };

  // Stop generating
  const handleStopGenerating = () => {
    abortControllerRef.current = true;
    setCommanderStatus('Idle');
    setIsTypingStream(false);
  };

  // Regenerate last response
  const handleRegenerate = () => {
    const lastUserIndex = [...messages].reverse().findIndex(m => m.sender === 'user');
    if (lastUserIndex !== -1) {
      const actualIndex = messages.length - 1 - lastUserIndex;
      const lastUserMsg = messages[actualIndex];
      const trimmed = messages.slice(0, actualIndex + 1);
      setMessages(trimmed);
      handleSend(lastUserMsg.text);
    }
  };

  // Copy message text
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Task Handlers
  const handleToggleTask = async (id: string) => {
    const updated = await apiService.toggleTask(id);
    setTasks(updated);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const updated = await apiService.addTask(newTaskTitle.trim());
    setTasks(updated);
    setNewTaskTitle('');
  };

  const handleDeleteTask = async (id: string) => {
    const updated = await apiService.deleteTask(id);
    setTasks(updated);
  };

  // Filtered Conversations List
  const filteredConversations = conversations
    .filter(c => activeTab === 'archived' ? c.isArchived : !c.isArchived)
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase())));

  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const unpinnedConversations = filteredConversations.filter(c => !c.isPinned);

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
      
      {/* Main Workspace Column */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        
        {/* Chat Top Header */}
        <div className="h-14 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-100 transition-colors"
              title="Toggle Conversation History Drawer"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100 tracking-wide">COMMANDER AI</h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {settings.aiProvider.toUpperCase()} ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  {activeConv?.title || 'Executive Session'} • Context: {memoryKB} KB
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Summarize Conversation */}
            <button
              onClick={handleSummarizeConversation}
              disabled={messages.length <= 1 || isSummarizing}
              className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
              title="Generate Executive Summary of Conversation"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear Current Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* New Conversation */}
            <button
              onClick={handleNewConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Session</span>
            </button>

            {/* Toggle Commander Right Panel */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-slate-100 transition-colors"
              title={isRightPanelOpen ? "Close Commander Panel" : "Open Commander Panel"}
            >
              {isRightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Executive Summary Banner (If present) */}
        {activeConv?.summary && (
          <div className="bg-cyan-950/40 border-b border-cyan-500/30 p-3 px-6 text-xs font-mono text-cyan-200 flex items-start gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-cyan-300 block uppercase text-[10px]">Session Executive Summary:</strong>
              <div className="text-slate-300 mt-0.5 whitespace-pre-line">{activeConv.summary}</div>
            </div>
          </div>
        )}

        {/* History Drawer Overlay (Mobile/Slide-out) */}
        {isHistoryDrawerOpen && (
          <div className="absolute inset-y-0 left-0 w-80 bg-slate-950 border-r border-slate-800 z-40 p-4 flex flex-col shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Session History
              </h4>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            {/* Active / Archived Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-3 text-xs font-mono">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'active' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'archived' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Archived
              </button>
            </div>

            <button
              onClick={handleNewConversation}
              className="w-full flex items-center justify-center gap-2 py-2 mb-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Start New Session
            </button>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              
              {/* Pinned Section */}
              {pinnedConversations.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block px-1">
                    📌 Pinned Sessions
                  </span>
                  {pinnedConversations.map(c => renderConvItem(c))}
                </div>
              )}

              {/* Unpinned Section */}
              <div className="space-y-1">
                {pinnedConversations.length > 0 && (
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block px-1 pt-2">
                    Recent Sessions
                  </span>
                )}
                {unpinnedConversations.map(c => renderConvItem(c))}
              </div>

              {filteredConversations.length === 0 && (
                <p className="text-xs text-slate-500 font-mono text-center py-6">No sessions found.</p>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'}`}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  {isUser ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover border border-cyan-500/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative rounded-2xl p-4 text-sm leading-relaxed border transition-all ${
                    isUser
                      ? 'bg-cyan-950/40 border-cyan-500/30 text-slate-100 rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Sender & Timestamp */}
                  <div className="flex items-center justify-between gap-4 mb-2 border-b border-slate-800/60 pb-1.5 text-[11px] font-mono">
                    <span className={isUser ? 'text-cyan-400 font-semibold' : 'text-slate-400 font-semibold flex items-center gap-1'}>
                      {!isUser && <Sparkles className="w-3 h-3 text-cyan-400" />}
                      {isUser ? user.name : 'Commander AI (CEO)'}
                    </span>
                    <span className="text-slate-500">{msg.timestamp}</span>
                  </div>

                  {/* Delegated Sub-Agent Indicator Badge */}
                  {!isUser && msg.delegatedAgentName && (
                    <div className="mb-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${msg.delegationStatus === 'completed' ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'}`}></span>
                        <span className="text-slate-400">Delegated Specialist:</span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                          {msg.delegatedAgentName}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                        msg.delegationStatus === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                      }`}>
                        {msg.delegationStatus === 'completed' ? '✅ Executed' : '⏳ Processing'}
                      </span>
                    </div>
                  )}

                  {/* Body / Markdown */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl">
                    <Markdown>{msg.text || (isTypingStream && msg.id === messages[messages.length - 1]?.id ? '...' : '')}</Markdown>
                  </div>

                  {/* Copy & Actions Bar */}
                  <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                      title="Copy message"
                    >
                      {copiedMsgId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {!isUser && (
                      <button
                        onClick={handleRegenerate}
                        disabled={isTypingStream}
                        className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-mono disabled:opacity-40 cursor-pointer"
                        title="Regenerate Response"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking / Reasoning Pipeline Stage Indicator */}
          {commanderStatus === 'Thinking' && (
            <div className="flex flex-col gap-3 max-w-3xl mr-auto p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">COMMANDER THINKING ENGINE</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Stage: {reasoningStage}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Commander evaluates intent, searches memory, delegates to specialist agent, and synthesizes output.</p>
                </div>
              </div>

              {/* Visual Pipeline Stepper */}
              <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/80">
                {REASONING_STAGES.map((stg, sIdx) => {
                  const currentIdx = REASONING_STAGES.indexOf(reasoningStage);
                  const isDone = sIdx < currentIdx;
                  const isCurrent = sIdx === currentIdx;

                  return (
                    <div key={stg} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                        isDone ? 'bg-emerald-400' : isCurrent ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'
                      }`} />
                      <span className={`text-[9px] font-mono uppercase ${
                        isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-600'
                      }`}>
                        {stg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice UI Module Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 shrink-0">
          <VoiceControls
            onTranscriptReceived={(transcript) => handleSend(transcript)}
          />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder={`Ask Commander AI anything... (e.g. "Create a task breakdown", "Review memory")`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTypingStream}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
            />

            {isTypingStream ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.2)] cursor-pointer"
              >
                <Square className="w-4 h-4 fill-rose-400" /> Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            )}
          </form>
        </div>
      </div>

      {/* COMMANDER RIGHT PANEL SIDEBAR */}
      {isRightPanelOpen && (
        <div className="w-80 bg-slate-950 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0">
          
          {/* Header Panel */}
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Commander Panel
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              v1.2 ACTIVE
            </span>
          </div>

          {/* Commander AI Animated Holographic Avatar */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center justify-center relative shadow-lg">
            <CommanderAvatar
              state={currentAvatarState}
              size="lg"
              showStatusLabel={true}
            />
          </div>

          {/* Current Status Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Engine Status</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-100">{commanderStatus}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                commanderStatus === 'Idle'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : commanderStatus === 'Thinking'
                  ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                  : 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse'
              }`}>
                {commanderStatus}
              </span>
            </div>
          </div>

          {/* Local Memory Size Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Memory Context
              </span>
              <span className="text-cyan-400 font-bold">{memoryKB} KB</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (memoryKB / 128) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">128 KB Local Context Ceiling</p>
          </div>

          {/* Today's Tasks */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> Executive Tasks
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {tasks.filter(t => t.completed).length}/{tasks.length}
              </span>
            </div>

            {/* Task list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 group">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-start gap-2 text-left flex-1 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <SquareIcon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add task form */}
            <form onSubmit={handleAddTask} className="flex gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Add task for Commander..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Active LLM Provider Specs */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">LLM Provider Specs</span>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Provider:</span>
              <span className="text-cyan-400 font-bold uppercase">{settings.aiProvider}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Model:</span>
              <span className="text-emerald-400 font-semibold">{settings.geminiModel || 'gemini-3.6-flash'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Temperature:</span>
              <span className="text-slate-400">{settings.temperature}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Personality:</span>
              <span className="text-indigo-300">{settings.aiPersonality}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );

  // Helper render for conversation list items
  function renderConvItem(c: Conversation) {
    const isEditing = editingConvId === c.id;

    return (
      <div
        key={c.id}
        onClick={() => handleSelectConversation(c)}
        className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all border cursor-pointer ${
          activeConvId === c.id
            ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 font-medium shadow-[0_0_12px_rgba(6,182,212,0.15)]'
            : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
        }`}
      >
        <div className="min-w-0 flex-1 pr-2">
          {isEditing ? (
            <form onSubmit={(e) => handleSaveTitle(c.id, e)} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                autoFocus
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500 rounded px-2 py-0.5 text-xs text-slate-100 font-mono focus:outline-none"
              />
              <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                {c.isPinned && <Pin className="w-3 h-3 text-cyan-400 shrink-0 fill-cyan-400" />}
                <p className="truncate font-semibold">{c.title}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                {c.messages.length} msgs • {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => handleTogglePin(c.id, e)}
            className={`p-1 rounded hover:bg-slate-800 ${c.isPinned ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-200'}`}
            title={c.isPinned ? "Unpin" : "Pin"}
          >
            <Pin className="w-3 h-3" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingConvId(c.id);
              setEditingTitle(c.title);
            }}
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800"
            title="Rename"
          >
            <Edit2 className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => handleToggleArchive(c.id, e)}
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800"
            title={c.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => handleDeleteConversation(c.id, e)}
            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
};

