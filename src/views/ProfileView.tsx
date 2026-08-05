import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Key, 
  Camera, 
  Check, 
  LogOut, 
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, session, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [role, setRole] = useState(user?.role || 'Architect');
  const [isSaved, setIsSaved] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name, email, avatar, role: role as any });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-profile">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <UserCircle className="w-6 h-6 text-cyan-400" />
          User Profile & Credentials
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Stored identity, login provider credentials, and active session tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Avatar Selection (1 col) */}
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-6 text-center">
          <div className="relative inline-block mx-auto">
            <img
              src={avatar || user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] mx-auto"
            />
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-400">
              <Camera className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-100">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 uppercase font-semibold">
                {user?.provider} OAuth
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Quick Avatar Selector */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
              Select Profile Picture Avatar
            </label>
            <div className="flex items-center justify-center gap-2">
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    avatar === url ? 'border-cyan-400 scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details Form & Session Security (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Edit Stored Profile Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Login Provider</label>
                <input
                  type="text"
                  disabled
                  value={`${user?.provider.toUpperCase()} OAuth`}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono backdrop-blur-sm"
                >
                  <option value="Administrator" className="bg-slate-900 text-slate-200">Administrator</option>
                  <option value="Architect" className="bg-slate-900 text-slate-200">Architect</option>
                  <option value="Engineer" className="bg-slate-900 text-slate-200">Engineer</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono text-slate-500">
                Created Date: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-3">
                {isSaved && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile Updated
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </form>

          {/* Active Session Info */}
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                Active OAuth Session Token
              </h3>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 hover:bg-rose-900/60 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Session ID:</span>
                <span className="text-cyan-400 truncate max-w-xs">{session?.id}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Token Signature:</span>
                <span className="text-slate-400 truncate max-w-xs">{session?.token}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Client Device:</span>
                <span className="text-slate-200">{session?.device}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">IP Address:</span>
                <span className="text-slate-200">{session?.ipAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
