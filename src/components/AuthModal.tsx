import React, { useState } from 'react';
import { X, Github, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { AuthProvider } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<AuthProvider>('google');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (provider: AuthProvider) => {
    const name = customName.trim() || undefined;
    const email = customEmail.trim() || undefined;
    await login(provider, name, email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div 
        id="modal-oauth-login"
        className="w-full max-w-md bg-[#0a0a10]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative text-slate-100 overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 mx-auto mb-3 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Commander AI Authentication</h3>
          <p className="text-xs text-slate-400 mt-1">
            Sign in via OAuth provider to auto-create user profile and session token.
          </p>
        </div>

        {/* Optional Custom Profile Fields */}
        <div className="space-y-3 mb-6 bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
            Optional Profile Attributes Override
          </label>
          <input
            type="text"
            placeholder="User Full Name (e.g. Sarah Connor)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
          />
          <input
            type="email"
            placeholder="User Email (e.g. sarah@commander.ai)"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
          />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          {/* Google Login */}
          <button
            id="btn-oauth-google"
            disabled={isLoading}
            onClick={() => handleSignIn('google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-md group disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google OAuth</span>
          </button>

          {/* GitHub Login */}
          <button
            id="btn-oauth-github"
            disabled={isLoading}
            onClick={() => handleSignIn('github')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-sm transition-all shadow-md group disabled:opacity-50"
          >
            <Github className="w-5 h-5 shrink-0 text-slate-100" />
            <span>Continue with GitHub OAuth</span>
          </button>
        </div>

        {/* Security Footer Note */}
        <p className="text-[11px] text-slate-500 text-center mt-6">
          Encrypted session tokens are managed server-side. No sensitive credentials hardcoded.
        </p>
      </div>
    </div>
  );
};
