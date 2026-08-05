import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  PlayCircle, 
  FolderGit2, 
  Star, 
  GitFork, 
  RefreshCw, 
  LogOut, 
  ShieldCheck, 
  Activity, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Settings, 
  Code2, 
  Search, 
  FileText, 
  MessageSquare, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  Shield,
  Tag,
  Zap
} from 'lucide-react';
import { 
  githubAccountService, 
  githubService, 
  githubSyncService 
} from '../services/githubWorkspace';
import { 
  GitHubAccountInfo, 
  GitHubRepoItem, 
  GitHubCommitItem, 
  GitHubPullRequestItem, 
  GitHubIssueItem, 
  GitHubWorkflowItem, 
  GitHubSyncLog,
  GitHubReleaseItem
} from '../types';

export function GitHubWorkspaceView() {
  const [account, setAccount] = useState<GitHubAccountInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'repositories' | 'commits' | 'prs' | 'issues' | 'actions' | 'sync-logs'>('dashboard');

  // Data states
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [commits, setCommits] = useState<GitHubCommitItem[]>([]);
  const [prs, setPrs] = useState<GitHubPullRequestItem[]>([]);
  const [issues, setIssues] = useState<GitHubIssueItem[]>([]);
  const [workflows, setWorkflows] = useState<GitHubWorkflowItem[]>([]);
  const [releases, setReleases] = useState<GitHubReleaseItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<GitHubSyncLog[]>([]);

  // Action / Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Confirmation Modals for Write Actions
  const [showCreateBranchModal, setShowCreateBranchModal] = useState(false);
  const [targetRepo, setTargetRepo] = useState('commander-ai-os');
  const [newBranchName, setNewBranchName] = useState('');

  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitRepo, setCommitRepo] = useState('commander-ai-os');
  const [commitBranch, setCommitBranch] = useState('main');
  const [commitMsg, setCommitMsg] = useState('');

  const [showPRModal, setShowPRModal] = useState(false);
  const [prRepo, setPrRepo] = useState('commander-ai-os');
  const [prTitle, setPrTitle] = useState('');
  const [prHeadBranch, setPrHeadBranch] = useState('feat/github-workspace');

  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    const acc = githubAccountService.getAccount();
    setAccount(acc);

    setSyncLogs(githubSyncService.getLogs());

    if (githubAccountService.isConnected()) {
      try { setRepos(await githubService.getRepositories()); } catch {}
      try { setCommits(await githubService.getCommits()); } catch {}
      try { setPrs(await githubService.getPullRequests()); } catch {}
      try { setIssues(await githubService.getIssues()); } catch {}
      try { setWorkflows(await githubService.getWorkflows()); } catch {}
      try { setReleases(await githubService.getReleases()); } catch {}
    }
  };

  const handleManualSync = async (entity: any = 'all') => {
    setIsSyncing(true);
    setStatusMessage(`Synchronizing GitHub ${entity}...`);
    const success = await githubSyncService.triggerSync(entity);
    setIsSyncing(false);
    if (success) {
      setStatusMessage('GitHub sync completed successfully!');
    } else {
      setStatusMessage('GitHub sync failed. Check OAuth tokens.');
    }
    await refreshAllData();
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleReconnect = async () => {
    await githubAccountService.connectGitHubAccount();
    await handleManualSync();
  };

  const handleDisconnect = async () => {
    await githubAccountService.disconnectGitHubAccount();
    await refreshAllData();
  };

  // Write Action Handlers with Confirmation Guard
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName) return;

    try {
      await githubService.createBranch(targetRepo, newBranchName);
      setShowCreateBranchModal(false);
      setNewBranchName('');
      setStatusMessage(`Branch "${newBranchName}" created successfully on ${targetRepo}!`);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Branch creation failed');
    }
  };

  const handleCommitChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMsg) return;

    try {
      await githubService.commitChanges(commitRepo, commitBranch, commitMsg);
      setShowCommitModal(false);
      setCommitMsg('');
      setStatusMessage(`Changes committed to ${commitRepo} [${commitBranch}]!`);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Commit failed');
    }
  };

  const handleCreatePR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prTitle) return;

    try {
      await githubService.createPullRequest(prRepo, prTitle, prHeadBranch, 'main');
      setShowPRModal(false);
      setPrTitle('');
      setStatusMessage(`Pull Request "${prTitle}" opened successfully!`);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Pull request creation failed');
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                GitHub Workspace <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Official OAuth Connected</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                GitHub REST & GraphQL API bridge for repositories, branches, commits, PRs, issues & Actions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleManualSync('all')}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-purple-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync GitHub'}
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            {statusMessage}
          </div>
        )}

        {/* Connected Account Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={account?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={account?.username}
              className="w-14 h-14 rounded-2xl border-2 border-purple-500/40 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">@{account?.username || 'aitzazji91'}</h3>
                <span className="text-xs text-slate-400 font-medium">({account?.name})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  account?.tokenStatus === 'valid'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  OAuth Valid
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{account?.bio}</p>
              <p className="text-xs text-slate-500 mt-1">
                {account?.publicRepos} Public Repos • {account?.totalPrivateRepos} Private Repos • Granted Scopes: <span className="text-purple-400 font-mono font-medium">{account?.scopes.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setShowCreateBranchModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              + Create Branch
            </button>
            <button
              onClick={() => setShowCommitModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <GitCommit className="w-3.5 h-3.5" />
              + Commit Changes
            </button>
            <button
              onClick={() => setShowPRModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              + Open PR
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('repositories')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'repositories'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            Repositories ({repos.length})
          </button>

          <button
            onClick={() => setActiveTab('commits')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'commits'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            Commits ({commits.length})
          </button>

          <button
            onClick={() => setActiveTab('prs')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'prs'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            Pull Requests ({prs.length})
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'issues'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Issues ({issues.length})
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'actions'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Actions / Workflows ({workflows.length})
          </button>

          <button
            onClick={() => setActiveTab('sync-logs')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sync-logs'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Sync Logs
          </button>
        </div>

        {/* TAB CONTENTS */}

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Active Repositories Overview */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-purple-400" />
                    Featured Repositories
                  </h3>
                  <button onClick={() => setActiveTab('repositories')} className="text-xs text-purple-400 hover:underline font-semibold">
                    View All ({repos.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {repos.slice(0, 4).map((repo) => (
                    <div key={repo.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 transition space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 truncate">{repo.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                          {repo.language}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{repo.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {repo.starsCount}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-cyan-400" /> {repo.forksCount}</span>
                        <span className="text-emerald-400 font-bold">Health: {repo.healthScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Commits & PRs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GitCommit className="w-4 h-4 text-cyan-400" /> Recent Commits
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {commits.slice(0, 3).map((c) => (
                      <div key={c.sha} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                        <p className="text-xs font-medium text-slate-200 line-clamp-1">{c.message}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{c.author}</span>
                          <span className="text-cyan-400">#{c.sha}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GitPullRequest className="w-4 h-4 text-emerald-400" /> Open Pull Requests
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {prs.slice(0, 3).map((pr) => (
                      <div key={pr.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                        <p className="text-xs font-semibold text-white line-clamp-1">#{pr.number} {pr.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{pr.repoName}</span>
                          <span className="text-emerald-400 font-bold">{pr.reviewStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contribution Activity Graph Mock / Placeholder */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  GitHub Contribution Activity (Year 2026)
                </h3>
                <p className="text-xs text-slate-400">1,842 contributions in the last year across public and private repositories.</p>
                <div className="grid grid-cols-12 gap-1.5 pt-2">
                  {Array.from({ length: 48 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-4 rounded ${
                        idx % 7 === 0 ? 'bg-emerald-500' :
                        idx % 3 === 0 ? 'bg-emerald-600/70' :
                        idx % 2 === 0 ? 'bg-emerald-900/40' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Workflow Status & Release Pipeline */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-purple-400" />
                    GitHub Actions Workflows
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    100% Passing
                  </span>
                </div>

                <div className="space-y-3">
                  {workflows.map((wf) => (
                    <div key={wf.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{wf.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[10px] font-mono text-slate-500">
                        Run #{wf.runNumber} on <span className="text-purple-300">{wf.branch}</span> • {wf.repoName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Release */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  Latest Release
                </h3>
                {releases[0] && (
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{releases[0].tagName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(releases[0].publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{releases[0].name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{releases[0].body}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: REPOSITORIES */}
        {activeTab === 'repositories' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
                GitHub Repositories Browser
              </h3>
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 w-full sm:w-64"
              />
            </div>

            <div className="space-y-3">
              {repos
                .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((repo) => (
                  <div key={repo.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-purple-300">{repo.fullName}</span>
                        {repo.isPrivate && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Private
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-500">Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs text-slate-300">{repo.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-4">
                        <span>Language: <strong className="text-slate-200">{repo.language}</strong></span>
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {repo.starsCount}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-cyan-400" /> {repo.forksCount}</span>
                        <span>Default Branch: <strong className="text-purple-300">{repo.defaultBranch}</strong></span>
                      </div>
                      <span className="text-emerald-400 font-bold">Health Score: {repo.healthScore}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: COMMITS */}
        {activeTab === 'commits' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-cyan-400" />
                Commit History across Repositories
              </h3>
              <button
                onClick={() => setShowCommitModal(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                + Commit Changes
              </button>
            </div>

            <div className="space-y-3 font-mono">
              {commits.map((c) => (
                <div key={c.sha} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 font-bold">[{c.repoName}] {c.message}</span>
                    <span className="text-slate-500">{new Date(c.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Author: {c.author}</span>
                    <span>Commit SHA: <strong className="text-purple-400">{c.sha}</strong> (+{c.additions} / -{c.deletions})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PULL REQUESTS */}
        {activeTab === 'prs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-emerald-400" />
                Pull Requests Manager
              </h3>
              <button
                onClick={() => setShowPRModal(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                + Open Pull Request
              </button>
            </div>

            <div className="space-y-3">
              {prs.map((pr) => (
                <div key={pr.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">#{pr.number} {pr.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      pr.state === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      pr.state === 'merged' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {pr.state}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400">
                    Repository: <span className="text-purple-300">{pr.repoName}</span> • Branch: <span className="text-cyan-400">{pr.headBranch}</span> → <span className="text-slate-200">{pr.baseBranch}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                    <span>Opened by: @{pr.author}</span>
                    <span>Review: <strong className="text-emerald-400 uppercase">{pr.reviewStatus}</strong> ({pr.commentsCount} comments)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ISSUES */}
        {activeTab === 'issues' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Issue Tracker
              </h3>
            </div>

            <div className="space-y-3">
              {issues.map((iss) => (
                <div key={iss.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-amber-300">#{iss.number} {iss.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {iss.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {iss.labels.map(l => (
                      <span key={l} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                        {l}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                    <span>Assigned: {iss.assignee || 'Unassigned'}</span>
                    <span>Created: {new Date(iss.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ACTIONS */}
        {activeTab === 'actions' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-purple-400" />
                GitHub Actions & CI/CD Pipelines
              </h3>
            </div>

            <div className="space-y-3 font-mono">
              {workflows.map((wf) => (
                <div key={wf.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">{wf.name}</h4>
                    <p className="text-[11px] text-slate-400">Repo: {wf.repoName} | Branch: {wf.branch}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Run #{wf.runNumber} {wf.conclusion}
                    </span>
                    <p className="text-[10px] text-slate-500">{new Date(wf.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SYNC LOGS */}
        {activeTab === 'sync-logs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                GitHub REST / GraphQL Sync Audit
              </h3>
            </div>
            <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto">
              {syncLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-slate-300 font-semibold">[{log.entity.toUpperCase()}]</span>
                    <span className="text-slate-400">{log.message}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: CREATE BRANCH */}
        {showCreateBranchModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCreateBranch} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  Create Git Branch
                </h3>
                <button type="button" onClick={() => setShowCreateBranchModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs leading-relaxed">
                <span className="font-bold">Confirmation Guard:</span> Commander creates branches directly in your GitHub repository.
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Repository:</label>
                  <select
                    value={targetRepo}
                    onChange={(e) => setTargetRepo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    {repos.map(r => (
                      <option key={r.id} value={r.name}>{r.fullName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">New Branch Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="feat/workspace-integration"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowCreateBranchModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-xs transition">
                  Confirm & Create Branch
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: COMMIT CHANGES */}
        {showCommitModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCommitChanges} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-cyan-400" />
                  Commit Changes
                </h3>
                <button type="button" onClick={() => setShowCommitModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Repository:</label>
                  <select
                    value={commitRepo}
                    onChange={(e) => setCommitRepo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    {repos.map(r => (
                      <option key={r.id} value={r.name}>{r.fullName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Branch:</label>
                  <input
                    type="text"
                    value={commitBranch}
                    onChange={(e) => setCommitBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Commit Message:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="feat(core): implement GitHub REST connector"
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowCommitModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition">
                  Confirm Commit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: CREATE PULL REQUEST */}
        {showPRModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCreatePR} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-emerald-400" />
                  Open Pull Request
                </h3>
                <button type="button" onClick={() => setShowPRModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">PR Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="feat: Add GitHub Workspace and Repository Center"
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Head Branch:</label>
                  <input
                    type="text"
                    value={prHeadBranch}
                    onChange={(e) => setPrHeadBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowPRModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition">
                  Confirm Open PR
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
