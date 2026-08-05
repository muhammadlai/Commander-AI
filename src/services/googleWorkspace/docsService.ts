import { DocMetadataItem } from '../../types';
import { googleAccountService } from './googleAccountService';

const DOCS_STORAGE_KEY = 'commander_docs_metadata_v1';

const INITIAL_DOCS: DocMetadataItem[] = [
  {
    id: 'file-301',
    title: 'Commander AI Operating System Architecture & Specs',
    author: 'Aitzaz CEO',
    lastModified: new Date(Date.now() - 3600000 * 4).toISOString(),
    wordCount: 4250,
    characterCount: 28400,
    headings: [
      '1. Executive Summary',
      '2. Core Commander Decision Engine Architecture',
      '3. Modular Plugin Framework & Dynamic Sandbox',
      '4. Google Workspace OAuth 2.0 Integration',
      '5. Long-term Memory Vector & Key-Value Vault'
    ]
  },
  {
    id: 'doc-402',
    title: 'OAuth 2.0 & Workspace Security Policy Manual',
    author: 'Security Ops',
    lastModified: new Date(Date.now() - 86400000 * 3).toISOString(),
    wordCount: 1890,
    characterCount: 12400,
    headings: [
      '1. Scope & Access Control',
      '2. Token Lifecycle & Expiration Guards',
      '3. Zero Password Persistence Strategy'
    ]
  }
];

class DocsService {
  private docs: DocMetadataItem[] = [];

  constructor() {
    this.loadDocs();
  }

  private loadDocs() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DOCS_STORAGE_KEY);
      if (stored) {
        try {
          this.docs = JSON.parse(stored);
        } catch {
          this.docs = INITIAL_DOCS;
        }
      } else {
        this.docs = INITIAL_DOCS;
        this.saveDocs();
      }
    } else {
      this.docs = INITIAL_DOCS;
    }
  }

  private saveDocs() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(this.docs));
    }
  }

  public async getDocMetadata(docId?: string): Promise<DocMetadataItem[]> {
    if (!googleAccountService.checkPermission('documents.readonly')) {
      throw new Error('Google Docs permission "documents.readonly" not granted.');
    }
    if (docId) {
      return this.docs.filter(d => d.id === docId);
    }
    return [...this.docs];
  }
}

export const docsService = new DocsService();
