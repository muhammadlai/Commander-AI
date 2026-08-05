import { GmailSummaryItem } from '../../types';
import { googleAccountService } from './googleAccountService';

const GMAIL_STORAGE_KEY = 'commander_gmail_summaries_v1';

const INITIAL_EMAILS: GmailSummaryItem[] = [
  {
    id: 'msg-101',
    sender: 'Sarah Jenkins (VP Strategy)',
    senderEmail: 'sarah.jenkins@company.io',
    subject: 'Q3 Board Presentation Draft & Financial Outlook',
    snippet: 'Hi Commander team, I have attached the updated Q3 deck. Please review the EBITDA projections and let me know if we need to adjust slide 12.',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    unread: true,
    priority: 'high',
    category: 'Primary'
  },
  {
    id: 'msg-102',
    sender: 'DevOps Automated Alerts',
    senderEmail: 'alerts@cloud.internal',
    subject: '[RESOLVED] Latency spike in US-East Kubernetes Cluster',
    snippet: 'System metric alert: Latency peak reached 240ms at 08:30 UTC. Auto-scaling policy expanded replicas from 4 to 12. Normal operation restored.',
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    unread: false,
    priority: 'medium',
    category: 'Updates'
  },
  {
    id: 'msg-103',
    sender: 'Marcus Vance (Legal Counsel)',
    senderEmail: 'marcus@vance-law.com',
    subject: 'Finalized Enterprise Software Licensing Agreement',
    snippet: 'Attached is the executed MSA with the enterprise client. Terms are set for 24 months with annual renewal triggers.',
    date: new Date(Date.now() - 3600000 * 12).toISOString(),
    unread: true,
    priority: 'high',
    category: 'Primary'
  },
  {
    id: 'msg-104',
    sender: 'Google Workspace Team',
    senderEmail: 'workspace-noreply@google.com',
    subject: 'Security Audit Passed: OAuth Scopes Verified',
    snippet: 'Your application Commander AI OS successfully passed security verification for Gmail API & Workspace scopes.',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    unread: false,
    priority: 'low',
    category: 'Updates'
  }
];

class GmailService {
  private emails: GmailSummaryItem[] = [];

  constructor() {
    this.loadEmails();
  }

  private loadEmails() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GMAIL_STORAGE_KEY);
      if (stored) {
        try {
          this.emails = JSON.parse(stored);
        } catch {
          this.emails = INITIAL_EMAILS;
        }
      } else {
        this.emails = INITIAL_EMAILS;
        this.saveEmails();
      }
    } else {
      this.emails = INITIAL_EMAILS;
    }
  }

  private saveEmails() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GMAIL_STORAGE_KEY, JSON.stringify(this.emails));
    }
  }

  public async getEmailSummaries(): Promise<GmailSummaryItem[]> {
    if (!googleAccountService.checkPermission('gmail.readonly')) {
      throw new Error('Gmail permission "gmail.readonly" not granted.');
    }
    return [...this.emails];
  }

  public async searchEmails(query: string): Promise<GmailSummaryItem[]> {
    const q = query.toLowerCase();
    const all = await this.getEmailSummaries();
    return all.filter(e => 
      e.subject.toLowerCase().includes(q) || 
      e.snippet.toLowerCase().includes(q) || 
      e.sender.toLowerCase().includes(q)
    );
  }

  public async draftEmail(to: string, subject: string, body: string): Promise<{ draftId: string; status: string }> {
    if (!googleAccountService.checkPermission('gmail.compose')) {
      throw new Error('Gmail permission "gmail.compose" not granted.');
    }

    const newDraft: GmailSummaryItem = {
      id: 'draft-' + Math.random().toString(36).substring(2, 9),
      sender: 'Commander AI (Draft for User)',
      senderEmail: 'me@commander.ai',
      subject: `[DRAFT] ${subject}`,
      snippet: `To: ${to} | Body: ${body.substring(0, 100)}...`,
      date: new Date().toISOString(),
      unread: false,
      priority: 'medium',
      category: 'Primary'
    };

    this.emails.unshift(newDraft);
    this.saveEmails();

    return {
      draftId: newDraft.id,
      status: 'Draft created in Gmail Inbox for user review/send.'
    };
  }
}

export const gmailService = new GmailService();
