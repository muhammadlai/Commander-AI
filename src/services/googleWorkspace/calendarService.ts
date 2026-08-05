import { CalendarEventItem } from '../../types';
import { googleAccountService } from './googleAccountService';

const CALENDAR_STORAGE_KEY = 'commander_calendar_events_v1';

const INITIAL_EVENTS: CalendarEventItem[] = [
  {
    id: 'evt-201',
    title: 'Executive AI Strategy Sync',
    start: new Date(Date.now() + 3600000 * 3).toISOString(),
    end: new Date(Date.now() + 3600000 * 4).toISOString(),
    location: 'Google Meet (meet.google.com/cmd-exec-sync)',
    attendees: ['aitzazji91@gmail.com', 'sarah.jenkins@company.io', 'cto@company.io'],
    description: 'Quarterly review of Commander AI Operating System deployment and model latency metrics.',
    status: 'confirmed'
  },
  {
    id: 'evt-202',
    title: 'Product Engineering Standup',
    start: new Date(Date.now() + 86400000 * 1 + 3600000 * 2).toISOString(),
    end: new Date(Date.now() + 86400000 * 1 + 3600000 * 2.5).toISOString(),
    location: 'Room 4B / Meet',
    attendees: ['aitzazji91@gmail.com', 'lead-dev@company.io'],
    description: 'Sprint planning and feature review for Plugin Engine v2.',
    status: 'confirmed'
  },
  {
    id: 'evt-203',
    title: 'Investor Quarterly Briefing',
    start: new Date(Date.now() + 86400000 * 3).toISOString(),
    end: new Date(Date.now() + 86400000 * 3 + 3600000 * 1.5).toISOString(),
    location: 'Virtual Conference',
    attendees: ['aitzazji91@gmail.com', 'investors@fund.com'],
    description: 'Presentation of growth metrics and enterprise deployment pipeline.',
    status: 'tentative'
  }
];

class CalendarService {
  private events: CalendarEventItem[] = [];

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CALENDAR_STORAGE_KEY);
      if (stored) {
        try {
          this.events = JSON.parse(stored);
        } catch {
          this.events = INITIAL_EVENTS;
        }
      } else {
        this.events = INITIAL_EVENTS;
        this.saveEvents();
      }
    } else {
      this.events = INITIAL_EVENTS;
    }
  }

  private saveEvents() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(this.events));
    }
  }

  public async getCalendarEvents(): Promise<CalendarEventItem[]> {
    if (!googleAccountService.checkPermission('calendar.readonly')) {
      throw new Error('Calendar permission "calendar.readonly" not granted.');
    }
    return [...this.events];
  }

  public async createCalendarEvent(title: string, startIso: string, durationMins: number = 30, description?: string, attendees: string[] = []): Promise<CalendarEventItem> {
    if (!googleAccountService.checkPermission('calendar.events')) {
      throw new Error('Calendar permission "calendar.events" not granted.');
    }

    const startDate = new Date(startIso);
    const endDate = new Date(startDate.getTime() + durationMins * 60000);

    const newEvent: CalendarEventItem = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      location: 'Google Meet',
      attendees: Array.from(new Set(['aitzazji91@gmail.com', ...attendees])),
      description: description || 'Created via Commander AI OS',
      status: 'confirmed'
    };

    this.events.push(newEvent);
    this.saveEvents();

    return newEvent;
  }
}

export const calendarService = new CalendarService();
