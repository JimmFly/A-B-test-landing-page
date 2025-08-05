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
   * @param includeTestSessions Whether to include test sessions in the results
   */
  async getEvents(includeTestSessions: boolean = false): Promise<AnalyticsEvent[]> {
    if (includeTestSessions) {
      return [...this.events];
    }

    // Filter out test sessions
    return this.events.filter(event => {
      return !event.metadata?.isTestSession;
    });
  }

  /**
   * Get all waitlist entries
   * @param includeTestSessions Whether to include entries from test sessions
   */
  async getWaitlistEntries(includeTestSessions: boolean = false): Promise<WaitlistEntry[]> {
    if (includeTestSessions) {
      return [...this.waitlistEntries];
    }

    // Filter out entries from test sessions
    return this.waitlistEntries.filter(entry => {
      // Check if the entry has a sessionId in metadata that matches a test session
      if (!entry.metadata?.sessionId) return true;

      // Look for a matching event with this sessionId that is marked as a test session
      const matchingEvent = this.events.find(
        event => event.sessionId === entry.metadata?.sessionId && event.metadata?.isTestSession
      );

      return !matchingEvent;
    });
  }

  /**
   * Get events by type
   * @param type The event type to filter by
   * @param includeTestSessions Whether to include test sessions in the results
   */
  async getEventsByType(
    type: AnalyticsEvent['type'],
    includeTestSessions: boolean = false
  ): Promise<AnalyticsEvent[]> {
    return this.events.filter(event => {
      const typeMatch = event.type === type;
      if (includeTestSessions) {
        return typeMatch;
      }
      return typeMatch && !event.metadata?.isTestSession;
    });
  }

  /**
   * Get events by variant
   * @param variant The variant to filter by
   * @param includeTestSessions Whether to include test sessions in the results
   */
  async getEventsByVariant(
    variant: 'A' | 'B',
    includeTestSessions: boolean = false
  ): Promise<AnalyticsEvent[]> {
    return this.events.filter(event => {
      const variantMatch = event.variant === variant;
      if (includeTestSessions) {
        return variantMatch;
      }
      return variantMatch && !event.metadata?.isTestSession;
    });
  }

  /**
   * Calculate conversion metrics
   * @param includeTestSessions Whether to include test sessions in the metrics
   */
  async getConversionMetrics(
    includeTestSessions: boolean = false
  ): Promise<{ A: ConversionMetrics; B: ConversionMetrics }> {
    // Filter events to exclude test sessions unless explicitly included
    const validEvents = includeTestSessions
      ? this.events
      : this.events.filter(e => !e.metadata?.isTestSession);

    const pageViewsA = validEvents.filter(e => e.type === 'page_view' && e.variant === 'A').length;
    const pageViewsB = validEvents.filter(e => e.type === 'page_view' && e.variant === 'B').length;

    const signupsA = validEvents.filter(
      e => e.type === 'signup_success' && e.variant === 'A'
    ).length;
    const signupsB = validEvents.filter(
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
   * @param variant Optional variant to filter by
   * @param includeTestSessions Whether to include test sessions in the count
   */
  async getUniqueSessionsCount(
    variant?: 'A' | 'B',
    includeTestSessions: boolean = false
  ): Promise<number> {
    // First filter by variant if specified
    let filteredEvents = variant ? this.events.filter(e => e.variant === variant) : this.events;

    // Then filter out test sessions if needed
    if (!includeTestSessions) {
      filteredEvents = filteredEvents.filter(e => !e.metadata?.isTestSession);
    }

    const uniqueSessions = new Set(filteredEvents.map(e => e.sessionId));
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
  referrer?: string,
  metadata?: Record<string, unknown>
): Promise<WaitlistEntry> {
  return {
    id: `wl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    variant,
    timestamp: new Date(),
    userAgent,
    referrer,
    metadata,
  };
}
