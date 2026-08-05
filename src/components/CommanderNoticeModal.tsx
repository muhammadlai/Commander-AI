import React from 'react';
import { Bot, Sparkles, Lock, ArrowRight, ShieldCheck, Cpu, Network, Zap } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

interface CommanderNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommanderNoticeModal: React.FC<CommanderNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div 
        id="modal-commander-phase12-notice"
        className="w-full max-w-lg bg-[#0a0a10]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden text-slate-100"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Bot className="w-8 h-8 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 backdrop-blur-sm">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            PHASE 1.1 ARCHITECTURE READY
          </div>
        </div>

        {/* Core Notice Message */}
        <div className="space-y-3 mb-6">
          <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Commander Engine Status
          </h3>
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-mono text-sm leading-relaxed shadow-inner">
            <p className="font-semibold text-cyan-300 text-base mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              "{APP_CONFIG.commanderActiveNotice}"
            </p>
            <p className="text-xs text-slate-400 font-sans mt-2">
              Phase 1.1 has established the foundational microservices, user profiles, session state, PostgreSQL database schema, and dashboard architecture.
            </p>
          </div>
        </div>

        {/* Phase 1.2 Feature Roadmap Teaser */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Phase 1.2 Upcoming Modules Preview
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Cpu className="w-4 h-4 text-cyan-400 mb-1.5" />
              <span className="font-semibold text-slate-200 block">Agent Core</span>
              <span className="text-[10px] text-slate-400">Autonomous Task Loops</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Network className="w-4 h-4 text-purple-400 mb-1.5" />
              <span className="font-semibold text-slate-200 block">Memory Graph</span>
              <span className="text-[10px] text-slate-400">Persistent Vector DB</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Zap className="w-4 h-4 text-emerald-400 mb-1.5" />
              <span className="font-semibold text-slate-200 block">Voice & Vision</span>
              <span className="text-[10px] text-slate-400">Multimodal Interface</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            id="btn-close-commander-notice"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            Acknowledge & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
