/**
 * Commander AI Operating System — Foundation (Phase 1.1)
 * 
 * Enterprise-ready modular React micro-frontend architecture with Express server API,
 * PostgreSQL schema definitions, Google & GitHub OAuth integration, and futuristic UI layout.
 */

import React, { useState } from 'react';
import { AuthProviderComponent, useAuth } from './auth/AuthContext';
import { Sidebar, NavView } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { CommanderNoticeModal } from './components/CommanderNoticeModal';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './views/DashboardView';
import { CommanderView } from './views/CommanderView';
import { WorkspaceView } from './views/WorkspaceView';
import { CommandCenterView } from './views/CommandCenterView';
import { ProjectsView } from './views/ProjectsView';
import { ActivityView } from './views/ActivityView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { NotesTasksView } from './views/NotesTasksView';
import { AgentCenterView } from './views/AgentCenterView';
import { ToolCenterView } from './views/ToolCenterView';
import { MemoryCenterView } from './views/MemoryCenterView';
import { PluginCenterView } from './views/PluginCenterView';
import { GoogleWorkspaceView } from './views/GoogleWorkspaceView';
import { GitHubWorkspaceView } from './views/GitHubWorkspaceView';
import { RepositoryCenterView } from './views/RepositoryCenterView';
import { useCommander } from './hooks/useCommander';

function CommanderMainApp() {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const { 
    settings, 
    updateTheme, 
    isCommanderNoticeOpen, 
    setIsCommanderNoticeOpen,
    openCommanderNotice 
  } = useCommander();

  const { user, isAuthModalOpen, setAuthModalOpen } = useAuth();

  const activeUser = user || {
    id: 'usr_aitzaz_01',
    name: 'Aitzaz',
    email: 'aitzaz@commander.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    provider: 'google' as const,
    role: 'Architect' as const,
    createdAt: new Date().toISOString(),
    status: 'active' as const,
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigateView={(view) => setCurrentView(view)}
            onOpenCommanderNotice={openCommanderNotice}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        );
      case 'commander':
        return <CommanderView user={activeUser} />;
      case 'google-workspace':
        return <GoogleWorkspaceView />;
      case 'tool-center':
        return <ToolCenterView />;
      case 'memory-center':
        return <MemoryCenterView />;
      case 'plugin-center':
        return <PluginCenterView />;
      case 'workspace':
        return <WorkspaceView onNavigateCommander={() => setCurrentView('commander')} />;
      case 'command-center':
        return <CommandCenterView onNavigateCommander={() => setCurrentView('commander')} />;
      case 'agent-center':
        return <AgentCenterView />;
      case 'projects':
        return <ProjectsView />;
      case 'notes':
        return <NotesTasksView />;
      case 'activity':
        return <ActivityView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <DashboardView
            onNavigateView={(view) => setCurrentView(view)}
            onOpenCommanderNotice={openCommanderNotice}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Left Modular Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        onOpenCommanderNotice={openCommanderNotice}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Stage */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNav
          theme={settings.theme}
          onToggleTheme={() => updateTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onSelectView={(view) => setCurrentView(view)}
        />

        {/* View Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Commander Phase 1.2 Notice Modal */}
      <CommanderNoticeModal
        isOpen={isCommanderNoticeOpen}
        onClose={() => setIsCommanderNoticeOpen(false)}
      />

      {/* OAuth Sign-In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProviderComponent>
      <CommanderMainApp />
    </AuthProviderComponent>
  );
}
