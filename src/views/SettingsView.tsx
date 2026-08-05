import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Globe, 
  Palette, 
  Bell, 
  ShieldCheck, 
  Database, 
  Sliders,
  Check,
  Type,
  Zap,
  Bot,
  Mic,
  Volume2,
  Cpu,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Puzzle,
  RefreshCw
} from 'lucide-react';
import { useCommander } from '../hooks/useCommander';
import { APP_CONFIG } from '../config/appConfig';
import { ThemeMode, AccentColor, AppLanguage, FontSize, AnimationSpeed, AIProvider, AIPersonality, ResponseLength } from '../types';
import { aiProviderService, ProviderTestResult } from '../services/aiProviderService';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateTheme, 
    updateAccent, 
    updateLanguage, 
    updateFontSize,
    updateAnimationSpeed,
    updateAiSettings,
    toggleSettingBool
  } = useCommander();

  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<ProviderTestResult | null>(null);

  const handleTestConnection = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const res = await aiProviderService.testProviderConnection(settings);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.',
        provider: settings.aiProvider,
        latencyMs: 0
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-settings">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" />
            Commander AI Settings & LLM Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure AI Provider models, API credentials, reasoning personalities, streaming options, and system UI settings.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Active Provider: <strong className="uppercase font-bold text-slate-100">{settings.aiProvider}</strong></span>
        </div>
      </div>

      {/* SECTION 1: AI PROVIDER & LLM ENGINE SETTINGS (PRIMARY HIGHLIGHT) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Modular LLM Provider System</h3>
              <p className="text-xs text-slate-400">Select active Large Language Model provider and API configuration.</p>
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isTestingKey}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            {isTestingKey ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Sparkles className="w-4 h-4 text-cyan-400" />}
            {isTestingKey ? 'Testing Connection...' : 'Test Provider Connection'}
          </button>
        </div>

        {/* Connection Test Result Feedback Banner */}
        {testResult && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono animate-fadeIn ${
            testResult.success
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
              Provider: {testResult.provider}
            </span>
          </div>
        )}

        {/* 1.1 Provider Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'gemini', name: 'Google Gemini', desc: 'Native Gemini 3.6 Flash & Pro models', icon: '✦', defaultModel: 'gemini-3.6-flash' },
            { id: 'openai', name: 'OpenAI GPT', desc: 'GPT-4o & GPT-4o-mini models', icon: '⚡', defaultModel: 'gpt-4o-mini' },
            { id: 'anthropic', name: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet & Haiku models', icon: '🧠', defaultModel: 'claude-3-5-sonnet-20241022' },
          ].map((prov) => {
            const isSelected = settings.aiProvider === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => updateAiSettings({ aiProvider: prov.id as AIProvider })}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500 text-slate-100 shadow-[0_0_20px_rgba(6,182,212,0.2)] font-semibold'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{prov.icon}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{prov.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{prov.desc}</p>
                </div>
                
                {isSelected && (
                  <span className="mt-3 inline-block text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    ● ACTIVE PROVIDER
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1.2 Model & API Keys Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Active Model Selector */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Active Model Selection ({settings.aiProvider.toUpperCase()})
            </label>
            
            {settings.aiProvider === 'gemini' && (
              <select
                value={settings.geminiModel || 'gemini-3.6-flash'}
                onChange={(e) => updateAiSettings({ geminiModel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended Default)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Reasoning)</option>
              </select>
            )}

            {settings.aiProvider === 'openai' && (
              <select
                value={settings.openaiModel || 'gpt-4o-mini'}
                onChange={(e) => updateAiSettings({ openaiModel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast & Efficient)</option>
                <option value="gpt-4o">gpt-4o (Flagship Multimodal)</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy Standard)</option>
              </select>
            )}

            {settings.aiProvider === 'anthropic' && (
              <select
                value={settings.anthropicModel || 'claude-3-5-sonnet-20241022'}
                onChange={(e) => updateAiSettings({ anthropicModel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet (High Intelligence)</option>
                <option value="claude-3-haiku-20240307">claude-3-haiku (Ultra Fast)</option>
              </select>
            )}

            <p className="text-[10px] text-slate-400 font-mono">
              Model parameters will adjust temperature and maximum tokens automatically.
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                {settings.aiProvider.toUpperCase()} Custom API Key
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">Stored locally</span>
            </label>

            {settings.aiProvider === 'gemini' && (
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  placeholder="Leave blank to use system environment default key"
                  value={settings.geminiApiKey || ''}
                  onChange={(e) => updateAiSettings({ geminiApiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {settings.aiProvider === 'openai' && (
              <div className="relative">
                <input
                  type={showOpenAIKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={settings.openaiApiKey || ''}
                  onChange={(e) => updateAiSettings({ openaiApiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showOpenAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {settings.aiProvider === 'anthropic' && (
              <div className="relative">
                <input
                  type={showAnthropicKey ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={settings.anthropicApiKey || ''}
                  onChange={(e) => updateAiSettings({ anthropicApiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showAnthropicKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            <p className="text-[10px] text-slate-400 font-mono">
              Keys are encrypted in browser local memory. Never sent to any unverified endpoints.
            </p>
          </div>

        </div>

        {/* 1.3 LLM Parameters & Personality Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Temperature Slider */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">Temperature</span>
              <span className="font-mono text-cyan-400 font-bold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => updateAiSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Precise (0.0)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>

          {/* Max Tokens Input */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">Max Tokens</span>
              <span className="font-mono text-cyan-400 font-bold">{settings.maxTokens}</span>
            </div>
            <input
              type="range"
              min="512"
              max="4096"
              step="256"
              value={settings.maxTokens}
              onChange={(e) => updateAiSettings({ maxTokens: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>512 tokens</span>
              <span>4096 tokens</span>
            </div>
          </div>

          {/* Streaming Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Streaming Output</span>
              <span className="text-[10px] text-slate-400">Stream response tokens live</span>
            </div>
            <input
              type="checkbox"
              checked={settings.streamingEnabled}
              onChange={(e) => updateAiSettings({ streamingEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Response Length */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">Response Length</span>
            <div className="grid grid-cols-3 gap-1">
              {(['Concise', 'Balanced', 'Detailed'] as ResponseLength[]).map((len) => (
                <button
                  key={len}
                  onClick={() => updateAiSettings({ responseLength: len })}
                  className={`py-1 px-1.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                    settings.responseLength === len
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 1.4 Commander Personality */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            Commander AI CEO Personality Style
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'Executive CEO', label: 'Executive CEO', desc: 'Authoritative, decisive & strategic' },
              { id: 'Friendly Mentor', label: 'Friendly Mentor', desc: 'Supportive, encouraging & approachable' },
              { id: 'Strategic Operations', label: 'Strategic Ops', desc: 'Data-driven & operationally rigorous' },
              { id: 'Technical Architect', label: 'Tech Architect', desc: 'Precise, code-deep & security-focused' },
            ].map((p) => {
              const isSelected = settings.aiPersonality === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => updateAiSettings({ aiPersonality: p.id as AIPersonality })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-slate-100 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>{p.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Appearance & Interface Toggles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Theme Mode Switcher */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Theme Display Mode</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'light', label: 'Light Mode', icon: Sun },
                { id: 'system', label: 'System Default', icon: Sliders },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = settings.theme === mode.id;
                return (
                  <button
                    key={mode.id}
                    id={`btn-theme-${mode.id}`}
                    onClick={() => updateTheme(mode.id as ThemeMode)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <span className="text-xs font-mono">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Accent Color Palette */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Futuristic Accent Palette</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {APP_CONFIG.accents.map((acc) => {
                const isSelected = settings.accentColor === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => updateAccent(acc.id as AccentColor)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-slate-100 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: acc.primary }}
                      ></span>
                      <span className="text-xs font-mono">{acc.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Avatar & Voice Toggles */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">AI Assistant Display Controls</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Avatar Animation</span>
                    <span className="text-[10px] text-slate-400">Show 3D animated AI head</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showAvatar}
                  onChange={() => toggleSettingBool('showAvatar')}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Voice AI Module</span>
                    <span className="text-[10px] text-slate-400">Enable speech synthesis & mic</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableVoice}
                  onChange={() => toggleSettingBool('enableVoice')}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): System Notifications */}
        <div className="space-y-6">
          
          {/* Notifications Toggles */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">Notification Channels</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Email Alerts</span>
                  <span className="text-[10px] text-slate-400">Security & audit summaries</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => toggleSettingBool('emailNotifications')}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Security Alerts</span>
                  <span className="text-[10px] text-slate-400">Revocation & auth warnings</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.securityAlerts}
                  onChange={() => toggleSettingBool('securityAlerts')}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Desktop Push</span>
                  <span className="text-[10px] text-slate-400">Browser background notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.desktopNotifications}
                  onChange={() => toggleSettingBool('desktopNotifications')}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Sound Effects</span>
                  <span className="text-[10px] text-slate-400">Audio chimes for voice & AI messages</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={() => toggleSettingBool('soundEffects')}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Plugin Framework Settings */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Plugin Settings</h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                Framework
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Strict Permissions</span>
                  <span className="text-[10px] text-slate-400">Enforce manifest permission audits</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Auto Update Plugins</span>
                  <span className="text-[10px] text-slate-400">Automatically patch installed extensions</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Plugin Logs Engine</span>
                  <span className="text-[10px] text-slate-400">Capture lifecycle & execution events</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Developer Mode</span>
                  <span className="text-[10px] text-slate-400">Enable local extension package testing</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* System Specs */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Database className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-100">Core Architecture</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">AI Engine:</span>
                <span className="text-cyan-400 font-bold uppercase">{settings.aiProvider} LLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Model:</span>
                <span className="text-emerald-400 font-bold">{settings.geminiModel || 'gemini-3.6-flash'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avatar Engine:</span>
                <span className="text-indigo-400 font-bold">Animated Vector Visor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voice Interface:</span>
                <span className="text-emerald-400 font-bold">Web Speech API</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

