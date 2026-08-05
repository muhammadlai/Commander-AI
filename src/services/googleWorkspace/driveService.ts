import { DriveFileItem } from '../../types';
import { googleAccountService } from './googleAccountService';

const DRIVE_STORAGE_KEY = 'commander_drive_files_v1';

const INITIAL_FILES: DriveFileItem[] = [
  {
    id: 'file-301',
    name: 'Commander_AI_Operating_System_Architecture.gdoc',
    mimeType: 'document',
    modifiedTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    sizeBytes: 124500,
    owner: 'Aitzaz CEO',
    webViewLink: 'https://docs.google.com/document/d/1commander_arch/edit'
  },
  {
    id: 'file-302',
    name: 'Q3_Financial_Projections_Enterprise.gsheet',
    mimeType: 'spreadsheet',
    modifiedTime: new Date(Date.now() - 3600000 * 18).toISOString(),
    sizeBytes: 489000,
    owner: 'Sarah Jenkins',
    webViewLink: 'https://docs.google.com/spreadsheets/d/1q3_sheets/edit'
  },
  {
    id: 'file-303',
    name: 'Executive_Board_Deck_2026.gslides',
    mimeType: 'presentation',
    modifiedTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    sizeBytes: 8520000,
    owner: 'Aitzaz CEO',
    webViewLink: 'https://docs.google.com/presentation/d/1board_deck/edit'
  },
  {
    id: 'file-304',
    name: 'OAuth_2.0_Security_Compliance_Audit.pdf',
    mimeType: 'pdf',
    modifiedTime: new Date(Date.now() - 86400000 * 5).toISOString(),
    sizeBytes: 2450000,
    owner: 'Security Ops',
    webViewLink: 'https://drive.google.com/file/d/1oauth_pdf/view'
  },
  {
    id: 'file-305',
    name: 'Commander_System_Backups',
    mimeType: 'folder',
    modifiedTime: new Date(Date.now() - 86400000 * 1).toISOString(),
    sizeBytes: 0,
    owner: 'System Auto',
    webViewLink: 'https://drive.google.com/drive/folders/1backup_folder'
  }
];

class DriveService {
  private files: DriveFileItem[] = [];

  constructor() {
    this.loadFiles();
  }

  private loadFiles() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DRIVE_STORAGE_KEY);
      if (stored) {
        try {
          this.files = JSON.parse(stored);
        } catch {
          this.files = INITIAL_FILES;
        }
      } else {
        this.files = INITIAL_FILES;
        this.saveFiles();
      }
    } else {
      this.files = INITIAL_FILES;
    }
  }

  private saveFiles() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRIVE_STORAGE_KEY, JSON.stringify(this.files));
    }
  }

  public async getDriveFiles(): Promise<DriveFileItem[]> {
    if (!googleAccountService.checkPermission('drive.readonly')) {
      throw new Error('Drive permission "drive.readonly" not granted.');
    }
    return [...this.files];
  }

  public async searchDriveFiles(query: string): Promise<DriveFileItem[]> {
    const q = query.toLowerCase();
    const files = await this.getDriveFiles();
    return files.filter(f => f.name.toLowerCase().includes(q) || f.owner.toLowerCase().includes(q));
  }
}

export const driveService = new DriveService();
