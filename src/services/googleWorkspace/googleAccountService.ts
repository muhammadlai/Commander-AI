import { GoogleAccountInfo, GoogleServiceStatus } from '../../types';

const ACCOUNT_STORAGE_KEY = 'commander_google_account_v1';

class GoogleAccountService {
  private accountInfo: GoogleAccountInfo | null = null;

  constructor() {
    this.loadAccount();
  }

  private loadAccount() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
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

  private getDefaultAccount(): GoogleAccountInfo {
    return {
      email: 'aitzazji91@gmail.com',
      name: 'Aitzaz CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      connectedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      tokenStatus: 'valid',
      expiresInSeconds: 3540,
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/documents.readonly',
        'https://www.googleapis.com/auth/tasks'
      ]
    };
  }

  public saveAccount() {
    if (typeof window !== 'undefined' && this.accountInfo) {
      localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(this.accountInfo));
    }
  }

  public getAccount(): GoogleAccountInfo | null {
    return this.accountInfo;
  }

  public isConnected(): boolean {
    return !!this.accountInfo && this.accountInfo.tokenStatus !== 'revoked';
  }

  public async connectGoogleAccount(): Promise<GoogleAccountInfo> {
    this.accountInfo = this.getDefaultAccount();
    this.accountInfo.connectedAt = new Date().toISOString();
    this.accountInfo.tokenStatus = 'valid';
    this.accountInfo.expiresInSeconds = 3600;
    this.saveAccount();
    return this.accountInfo;
  }

  public async disconnectGoogleAccount(): Promise<void> {
    if (this.accountInfo) {
      this.accountInfo.tokenStatus = 'revoked';
      this.saveAccount();
    }
  }

  public async refreshToken(): Promise<boolean> {
    if (!this.accountInfo) return false;
    this.accountInfo.tokenStatus = 'valid';
    this.accountInfo.expiresInSeconds = 3600;
    this.saveAccount();
    return true;
  }

  public checkPermission(scopeNeeded: string): boolean {
    if (!this.isConnected() || !this.accountInfo) return false;
    return this.accountInfo.scopes.some(s => s.toLowerCase().includes(scopeNeeded.toLowerCase()));
  }
}

export const googleAccountService = new GoogleAccountService();
