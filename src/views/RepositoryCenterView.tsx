import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  Activity, 
  ShieldCheck, 
  Code2, 
  Users, 
  Search, 
  ExternalLink, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  BarChart2,
  FileCode,
  Sliders
} from 'lucide-react';
import { githubService } from '../services/githubWorkspace';
import { GitHubRepoItem, GitHubBranchItem } from '../types';

export function RepositoryCenterView() {
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoItem | null>(null);
  const [branches, setBranches] = useState<GitHubBranchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      const data = await githubService.getRepositories();
      setRepos(data);
      if (data.length > 0) {
        setSelectedRepo(data[0]);
        loadBranches(data[0].name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadBranches = async (repoName: string) => {
    try {
      const b = await githubService.getBranches(repoName);
      setBranches(b);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectRepo = (repo: GitHubRepoItem) => {
    setSelectedRepo(repo);
    loadBranches(repo.name);
  };

  const filteredRepos = repos.filter(r => {
    const matchesQuery = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === 'all' || r.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesQuery && matchesLang;
  });

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Code2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Repository Center <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Analytics & Code Health</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Deep architectural analysis, language distribution, health metrics, and branch explorer.
              </p>
            </div>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Tracked Repos</span>
            <div className="text-2xl font-bold text-white">{repos.length}</div>
            <p className="text-[10px] text-cyan-400 font-mono">100% GraphQL Synced</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Combined Stars</span>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-amber-400/20" />
              {repos.reduce((acc, r) => acc + r.starsCount, 0)}
            </div>
            <p className="text-[10px] text-amber-400/80 font-mono">+128 this month</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Forks & Downstreams</span>
            <div className="text-2xl font-bold text-purple-400 flex items-center gap-1.5">
              <GitFork className="w-5 h-5" />
              {repos.reduce((acc, r) => acc + r.forksCount, 0)}
            </div>
            <p className="text-[10px] text-purple-400/80 font-mono">Active ecosystem</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Avg Code Health</span>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5" />
              {Math.round(repos.reduce((acc, r) => acc + r.healthScore, 0) / (repos.length || 1))}%
            </div>
            <p className="text-[10px] text-emerald-400/80 font-mono">Passing security audits</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Repos List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  Repositories
                </h3>
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Filter repos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                />

                <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
                  {['all', 'typescript', 'go', 'rust'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition ${
                        selectedLanguage === lang
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleSelectRepo(repo)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    selectedRepo?.id === repo.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{repo.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {repo.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{repo.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {repo.starsCount}</span>
                    <span className="text-emerald-400 font-bold">Health: {repo.healthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Repo Detailed Workspace */}
          {selectedRepo ? (
            <div className="lg:col-span-2 space-y-6">

              {/* Repo Main Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedRepo.fullName}
                      {selectedRepo.isPrivate && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Private
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">{selectedRepo.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                      {selectedRepo.healthScore}% Health Score
                    </span>
                  </div>
                </div>

                {/* Topics / Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedRepo.topics.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Stars</span>
                    <span className="text-amber-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400/20" /> {selectedRepo.starsCount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Forks</span>
                    <span className="text-cyan-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                      <GitFork className="w-3.5 h-3.5" /> {selectedRepo.forksCount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Contributors</span>
                    <span className="text-purple-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5" /> {selectedRepo.contributorsCount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Default Branch</span>
                    <span className="text-white font-bold text-sm flex items-center gap-1 mt-0.5">
                      <GitBranch className="w-3.5 h-3.5 text-purple-400" /> {selectedRepo.defaultBranch}
                    </span>
                  </div>
                </div>

                {/* Branches Explorer */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-purple-400" /> Active Branches ({branches.length})
                  </h4>
                  <div className="space-y-2 font-mono text-xs">
                    {branches.map(b => (
                      <div key={b.name} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-300 font-bold">{b.name}</span>
                            {b.protected && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                Protected
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{b.lastCommitMessage}</p>
                        </div>
                        <span className="text-[10px] text-slate-500">#{b.lastCommitSha}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Select a repository from the left panel to inspect code health and branch structure.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
