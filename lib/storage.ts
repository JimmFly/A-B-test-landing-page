import { AnalyticsEvent, WaitlistEntry, ConversionMetrics } from '@/types';

// In-memory storage (in production, use a real database)
class InMemoryStorage {
  private events: AnalyticsEvent[] = [];
  private waitlistEntries: WaitlistEntry[] = [];

  /**
   * Store analytics event
   */
  async storeEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
  }

  /**
   * Store waitlist entry
   */
  async storeWaitlistEntry(entry: WaitlistEntry): Promise<void> {
    // Check if email already exists
    const existingEntry = this.waitlistEntries.find(e => e.email === entry.email);
    if (existingEntry) {
      throw new Error('Email already registered');
    }
    this.waitlistEntries.push(entry);
  }

  /**
   * Get all events
   */
  async getEvents(): Promise<AnalyticsEvent[]> {
    return [...this.events];
  }

  /**
   * Get all waitlist entries
   */
  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return [...this.waitlistEntries];
  }

  /**
   * Get events by type
   */
  async getEventsByType(type: AnalyticsEvent['type']): Promise<AnalyticsEvent[]> {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Get events by variant
   */
  async getEventsByVariant(variant: 'A' | 'B'): Promise<AnalyticsEvent[]> {
    return this.events.filter(event => event.variant === variant);
  }

  /**
   * Calculate conversion metrics
   */
  async getConversionMetrics(): Promise<{ A: ConversionMetrics; B: ConversionMetrics }> {
    const pageViewsA = this.events.filter(e => e.type === 'page_view' && e.variant === 'A').length;
    const pageViewsB = this.events.filter(e => e.type === 'page_view' && e.variant === 'B').length;

    const signupsA = this.events.filter(
      e => e.type === 'signup_success' && e.variant === 'A'
    ).length;
    const signupsB = this.events.filter(
      e => e.type === 'signup_success' && e.variant === 'B'
    ).length;

    const conversionRateA = pageViewsA > 0 ? (signupsA / pageViewsA) * 100 : 0;
    const conversionRateB = pageViewsB > 0 ? (signupsB / pageViewsB) * 100 : 0;

    return {
      A: {
        variant: 'A',
        pageViews: pageViewsA,
        signups: signupsA,
        conversionRate: conversionRateA,
        lastUpdated: new Date(),
      },
      B: {
        variant: 'B',
        pageViews: pageViewsB,
        signups: signupsB,
        conversionRate: conversionRateB,
        lastUpdated: new Date(),
      },
    };
  }

  /**
   * Clear all data (useful for testing)
   */
  async clearAll(): Promise<void> {
    this.events = [];
    this.waitlistEntries = [];
  }

  /**
   * Get unique sessions count
   */
  async getUniqueSessionsCount(variant?: 'A' | 'B'): Promise<number> {
    const events = variant ? this.events.filter(e => e.variant === variant) : this.events;
    const uniqueSessions = new Set(events.map(e => e.sessionId));
    return uniqueSessions.size;
  }
}

// Export singleton instance
export const storage = new InMemoryStorage();

// Helper functions
export async function generateWaitlistEntry(
  email: string,
  variant: 'A' | 'B',
  userAgent?: string,
  referrer?: string
): Promise<WaitlistEntry> {
  return {
    id: `wl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    variant,
    timestamp: new Date(),
    userAgent,
    referrer,
  };
}
