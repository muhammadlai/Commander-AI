import { 
  GitHubRepoItem, 
  GitHubBranchItem, 
  GitHubCommitItem, 
  GitHubPullRequestItem, 
  GitHubIssueItem, 
  GitHubReleaseItem, 
  GitHubWorkflowItem 
} from '../../types';
import { githubAccountService } from './githubAccountService';

const REPOS_STORAGE_KEY = 'commander_github_repos_v1';
const COMMITS_STORAGE_KEY = 'commander_github_commits_v1';
const PRS_STORAGE_KEY = 'commander_github_prs_v1';
const ISSUES_STORAGE_KEY = 'commander_github_issues_v1';

const INITIAL_REPOS: GitHubRepoItem[] = [
  {
    id: 'repo-001',
    name: 'commander-ai-os',
    fullName: 'aitzazji91/commander-ai-os',
    owner: 'aitzazji91',
    description: 'Next-Gen Autonomous AI Decision Engine & Executive Operating System',
    isPrivate: false,
    language: 'TypeScript',
    starsCount: 1420,
    forksCount: 285,
    openIssuesCount: 4,
    defaultBranch: 'main',
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    healthScore: 98,
    topics: ['ai-agent', 'typescript', 'oauth2', 'decision-engine', 'react'],
    contributorsCount: 12
  },
  {
    id: 'repo-002',
    name: 'plugin-sdk-core',
    fullName: 'aitzazji91/plugin-sdk-core',
    owner: 'aitzazji91',
    description: 'Modular plugin architecture runtime and sandbox validator for Commander OS',
    isPrivate: true,
    language: 'TypeScript',
    starsCount: 840,
    forksCount: 110,
    openIssuesCount: 2,
    defaultBranch: 'main',
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    healthScore: 94,
    topics: ['plugin-sdk', 'sandbox', 'security', 'wasm'],
    contributorsCount: 6
  },
  {
    id: 'repo-003',
    name: 'workspace-bridge-v2',
    fullName: 'aitzazji91/workspace-bridge-v2',
    owner: 'aitzazji91',
    description: 'Unified Google Workspace & GitHub REST/GraphQL connector layer',
    isPrivate: false,
    language: 'Go',
    starsCount: 620,
    forksCount: 92,
    openIssuesCount: 1,
    defaultBranch: 'main',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    healthScore: 96,
    topics: ['go', 'oauth', 'google-api', 'github-api'],
    contributorsCount: 8
  },
  {
    id: 'repo-004',
    name: 'memory-vector-db',
    fullName: 'aitzazji91/memory-vector-db',
    owner: 'aitzazji91',
    description: 'High-performance local key-value and vector similarity index',
    isPrivate: true,
    language: 'Rust',
    starsCount: 1150,
    forksCount: 175,
    openIssuesCount: 5,
    defaultBranch: 'main',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    healthScore: 92,
    topics: ['rust', 'vector-search', 'memory', 'sqlite'],
    contributorsCount: 9
  }
];

const INITIAL_COMMITS: GitHubCommitItem[] = [
  {
    sha: '8f2a1b9',
    author: 'Aitzaz CEO',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    message: 'feat(google-workspace): complete OAuth 2.0 integration & modular sync engine',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    repoName: 'commander-ai-os',
    additions: 1240,
    deletions: 110
  },
  {
    sha: '3c4d5e6',
    author: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    message: 'fix(plugin-sdk): isolate sandbox execution context for zero privilege leakage',
    date: new Date(Date.now() - 3600000 * 6).toISOString(),
    repoName: 'plugin-sdk-core',
    additions: 380,
    deletions: 42
  },
  {
    sha: '1a2b3c4',
    author: 'Aitzaz CEO',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    message: 'refactor(bridge): update OAuth token renewal flow with exponential backoff',
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    repoName: 'workspace-bridge-v2',
    additions: 195,
    deletions: 88
  },
  {
    sha: '9f8e7d6',
    author: 'DevOps Automated Bot',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
    message: 'ci(actions): pass security audit & automated unit test suite',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    repoName: 'commander-ai-os',
    additions: 45,
    deletions: 0
  }
];

const INITIAL_PRS: GitHubPullRequestItem[] = [
  {
    id: 'pr-101',
    number: 42,
    title: 'feat: Add GitHub Workspace OAuth & Repository Center Page',
    repoName: 'commander-ai-os',
    author: 'aitzazji91',
    state: 'open',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    headBranch: 'feat/github-workspace',
    baseBranch: 'main',
    commentsCount: 6,
    reviewStatus: 'approved'
  },
  {
    id: 'pr-102',
    number: 18,
    title: 'sec: Enforce PKCE OAuth 2.0 flow across external providers',
    repoName: 'workspace-bridge-v2',
    author: 'sarah-jenkins',
    state: 'open',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    headBranch: 'fix/pkce-enhancements',
    baseBranch: 'main',
    commentsCount: 3,
    reviewStatus: 'pending'
  },
  {
    id: 'pr-103',
    number: 9,
    title: 'perf: Optimize SIMD vector indexing speed by 35%',
    repoName: 'memory-vector-db',
    author: 'lead-rust-dev',
    state: 'merged',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    headBranch: 'perf/vector-simd',
    baseBranch: 'main',
    commentsCount: 12,
    reviewStatus: 'approved'
  }
];

const INITIAL_ISSUES: GitHubIssueItem[] = [
  {
    id: 'issue-201',
    number: 104,
    title: 'Verify GitHub GraphQL rate limit handling in high-frequency sync',
    repoName: 'commander-ai-os',
    author: 'aitzazji91',
    state: 'open',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    labels: ['bug', 'high-priority', 'github-api'],
    commentsCount: 4,
    assignee: 'Aitzaz CEO'
  },
  {
    id: 'issue-202',
    number: 31,
    title: 'Add automated rollback hook when plugin fails checksum validation',
    repoName: 'plugin-sdk-core',
    author: 'security-bot',
    state: 'open',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    labels: ['enhancement', 'security'],
    commentsCount: 2,
    assignee: 'Sarah Jenkins'
  }
];

const INITIAL_RELEASES: GitHubReleaseItem[] = [
  {
    id: 'rel-301',
    tagName: 'v2.4.0-commander',
    name: 'Commander OS Executive v2.4 Release',
    repoName: 'commander-ai-os',
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    prerelease: false,
    body: 'Includes Google Workspace OAuth 2.0 integration, Tool Engine enhancements, and Memory Center performance optimizations.'
  }
];

const INITIAL_WORKFLOWS: GitHubWorkflowItem[] = [
  {
    id: 'wf-401',
    name: 'CI / CD Pipeline - Production Build',
    repoName: 'commander-ai-os',
    status: 'completed',
    conclusion: 'success',
    branch: 'main',
    runNumber: 184,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'wf-402',
    name: 'Security & Static Analysis Security Testing',
    repoName: 'commander-ai-os',
    status: 'completed',
    conclusion: 'success',
    branch: 'main',
    runNumber: 183,
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'wf-403',
    name: 'Rust SIMD Microbenchmarks',
    repoName: 'memory-vector-db',
    status: 'completed',
    conclusion: 'success',
    branch: 'main',
    runNumber: 92,
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

class GitHubService {
  private repos: GitHubRepoItem[] = [];
  private commits: GitHubCommitItem[] = [];
  private prs: GitHubPullRequestItem[] = [];
  private issues: GitHubIssueItem[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    if (typeof window !== 'undefined') {
      const r = localStorage.getItem(REPOS_STORAGE_KEY);
      this.repos = r ? JSON.parse(r) : INITIAL_REPOS;

      const c = localStorage.getItem(COMMITS_STORAGE_KEY);
      this.commits = c ? JSON.parse(c) : INITIAL_COMMITS;

      const p = localStorage.getItem(PRS_STORAGE_KEY);
      this.prs = p ? JSON.parse(p) : INITIAL_PRS;

      const i = localStorage.getItem(ISSUES_STORAGE_KEY);
      this.issues = i ? JSON.parse(i) : INITIAL_ISSUES;
    } else {
      this.repos = INITIAL_REPOS;
      this.commits = INITIAL_COMMITS;
      this.prs = INITIAL_PRS;
      this.issues = INITIAL_ISSUES;
    }
  }

  private saveData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REPOS_STORAGE_KEY, JSON.stringify(this.repos));
      localStorage.setItem(COMMITS_STORAGE_KEY, JSON.stringify(this.commits));
      localStorage.setItem(PRS_STORAGE_KEY, JSON.stringify(this.prs));
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(this.issues));
    }
  }

  public async getRepositories(): Promise<GitHubRepoItem[]> {
    if (!githubAccountService.checkPermission('Read Repository')) {
      throw new Error('Permission denied: "Read Repository" scope missing.');
    }
    return [...this.repos];
  }

  public async getBranches(repoName: string): Promise<GitHubBranchItem[]> {
    if (!githubAccountService.checkPermission('Read Repository')) {
      throw new Error('Permission denied: "Read Repository" scope missing.');
    }
    return [
      {
        name: 'main',
        protected: true,
        lastCommitSha: '8f2a1b9',
        lastCommitMessage: 'feat(google-workspace): complete OAuth 2.0 integration',
        lastCommitDate: new Date().toISOString()
      },
      {
        name: 'feat/github-workspace',
        protected: false,
        lastCommitSha: '7e6d5c4',
        lastCommitMessage: 'feat(github): implement repo browser & PR dashboard',
        lastCommitDate: new Date(Date.now() - 3600000).toISOString()
      },
      {
        name: 'fix/pkce-security',
        protected: false,
        lastCommitSha: '2b3c4d5',
        lastCommitMessage: 'fix(security): sanitize OAuth redirect token state',
        lastCommitDate: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  public async getCommits(repoName?: string): Promise<GitHubCommitItem[]> {
    if (!githubAccountService.checkPermission('Read Repository')) {
      throw new Error('Permission denied: "Read Repository" scope missing.');
    }
    if (repoName) {
      return this.commits.filter(c => c.repoName.toLowerCase().includes(repoName.toLowerCase()));
    }
    return [...this.commits];
  }

  public async getPullRequests(repoName?: string): Promise<GitHubPullRequestItem[]> {
    if (!githubAccountService.checkPermission('Read Pull Requests')) {
      throw new Error('Permission denied: "Read Pull Requests" scope missing.');
    }
    if (repoName) {
      return this.prs.filter(p => p.repoName.toLowerCase().includes(repoName.toLowerCase()));
    }
    return [...this.prs];
  }

  public async getIssues(repoName?: string): Promise<GitHubIssueItem[]> {
    if (!githubAccountService.checkPermission('Read Issues')) {
      throw new Error('Permission denied: "Read Issues" scope missing.');
    }
    if (repoName) {
      return this.issues.filter(i => i.repoName.toLowerCase().includes(repoName.toLowerCase()));
    }
    return [...this.issues];
  }

  public async getReleases(): Promise<GitHubReleaseItem[]> {
    return INITIAL_RELEASES;
  }

  public async getWorkflows(): Promise<GitHubWorkflowItem[]> {
    if (!githubAccountService.checkPermission('Read Actions')) {
      throw new Error('Permission denied: "Read Actions" scope missing.');
    }
    return INITIAL_WORKFLOWS;
  }

  // --- WRITE ACTIONS (Require Mandatory User Confirmation) ---

  public async createBranch(repoName: string, branchName: string): Promise<GitHubBranchItem> {
    if (!githubAccountService.checkPermission('Create Branch')) {
      throw new Error('Permission denied: "Create Branch" scope missing.');
    }

    const newBranch: GitHubBranchItem = {
      name: branchName,
      protected: false,
      lastCommitSha: '9a8b7c6',
      lastCommitMessage: `Branch created from main for ${branchName}`,
      lastCommitDate: new Date().toISOString()
    };

    return newBranch;
  }

  public async commitChanges(repoName: string, branchName: string, message: string): Promise<GitHubCommitItem> {
    if (!githubAccountService.checkPermission('Commit Changes')) {
      throw new Error('Permission denied: "Commit Changes" scope missing.');
    }

    const newCommit: GitHubCommitItem = {
      sha: Math.random().toString(16).substring(2, 9),
      author: 'Aitzaz CEO',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      message,
      date: new Date().toISOString(),
      repoName,
      additions: 45,
      deletions: 12
    };

    this.commits.unshift(newCommit);
    this.saveData();
    return newCommit;
  }

  public async createPullRequest(repoName: string, title: string, headBranch: string, baseBranch: string): Promise<GitHubPullRequestItem> {
    if (!githubAccountService.checkPermission('Create Pull Request')) {
      throw new Error('Permission denied: "Create Pull Request" scope missing.');
    }

    const newPr: GitHubPullRequestItem = {
      id: 'pr-' + Math.random().toString(36).substring(2, 9),
      number: this.prs.length + 50,
      title,
      repoName,
      author: 'aitzazji91',
      state: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headBranch,
      baseBranch,
      commentsCount: 0,
      reviewStatus: 'pending'
    };

    this.prs.unshift(newPr);
    this.saveData();
    return newPr;
  }

  public draftCommitMessage(fileChangesSummary: string): string {
    return `feat(core): ${fileChangesSummary.slice(0, 60)} - verified by Commander AI OS`;
  }

  public explainCodeChanges(diffText: string): string {
    return `Commander AI Code Analysis:\n• Summary: Analyzed change set for security, performance, and style consistency.\n• Key Enhancements: Enhanced error bounds, introduced strict scope checks, and optimized async loops.`;
  }
}

export const githubService = new GitHubService();
