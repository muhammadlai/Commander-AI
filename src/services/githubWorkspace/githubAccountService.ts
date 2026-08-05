import { GitHubAccountInfo } from '../../types';

const GITHUB_ACCOUNT_KEY = 'commander_github_account_v1';

class GitHubAccountService {
  private accountInfo: GitHubAccountInfo | null = null;

  constructor() {
    this.loadAccount();
  }

  private loadAccount() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GITHUB_ACCOUNT_KEY);
      if (stored) {
        try {
          this.accountInfo = JSON.parse(stored);
        } catch {
          this.accountInfo = this.getDefaultAccount();
        }
      } else {
        this.accountInfo = this.getDefaultAccount();
        this.saveAccount();
      }
    } else {
      this.accountInfo = this.getDefaultAccount();
    }
  }

  private getDefaultAccount(): GitHubAccountInfo {
    return {
      username: 'aitzazji91',
      name: 'Aitzaz CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      bio: 'Lead AI Systems Architect & Founder of Commander OS',
      publicRepos: 18,
      totalPrivateRepos: 12,
      connectedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      tokenStatus: 'valid',
      scopes: [
        'repo',
        'read:user',
        'user:email',
        'workflow',
        'write:packages',
        'admin:repo_hook'
      ]
    };
  }

  public saveAccount() {
    if (typeof window !== 'undefined' && this.accountInfo) {
      localStorage.setItem(GITHUB_ACCOUNT_KEY, JSON.stringify(this.accountInfo));
    }
  }

  public getAccount(): GitHubAccountInfo | null {
    return this.accountInfo;
  }

  public isConnected(): boolean {
    return !!this.accountInfo && this.accountInfo.tokenStatus !== 'revoked';
  }

  public async connectGitHubAccount(): Promise<GitHubAccountInfo> {
    this.accountInfo = this.getDefaultAccount();
    this.accountInfo.connectedAt = new Date().toISOString();
    this.accountInfo.tokenStatus = 'valid';
    this.saveAccount();
    return this.accountInfo;
  }

  public async disconnectGitHubAccount(): Promise<void> {
    if (this.accountInfo) {
      this.accountInfo.tokenStatus = 'revoked';
      this.saveAccount();
    }
  }

  public checkPermission(permissionScope: string): boolean {
    if (!this.isConnected() || !this.accountInfo) return false;
    // Map internal permission checks
    const p = permissionScope.toLowerCase();
    if (p.includes('read') || p.includes('repo')) {
      return this.accountInfo.scopes.includes('repo') || this.accountInfo.scopes.includes('read:user');
    }
    if (p.includes('create') || p.includes('commit') || p.includes('write')) {
      return this.accountInfo.scopes.includes('repo');
    }
    return true;
  }
}

export const githubAccountService = new GitHubAccountService();
