export const APP_CONFIG = {
  appName: 'Commander AI',
  phase: 'Phase 1.1 — Foundation',
  version: '1.1.0-alpha',
  author: 'Enterprise AI Architecture Team',
  commanderActiveNotice: 'Commander AI will be activated in Phase 1.2.',
  
  defaultUser: {
    id: 'usr_aitzaz_01',
    name: 'Aitzaz',
    email: 'aitzaz@commander.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    provider: 'google' as const,
    role: 'Architect' as const,
    createdAt: new Date().toISOString(),
    status: 'active' as const,
  },

  languages: [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
  ],

  accents: [
    { id: 'cyan', name: 'Cyber Cyan', primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
    { id: 'violet', name: 'Neon Violet', primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
    { id: 'emerald', name: 'Emerald Green', primary: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    { id: 'amber', name: 'Amber Glow', primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { id: 'rose', name: 'Rose Quartz', primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  ],
};
