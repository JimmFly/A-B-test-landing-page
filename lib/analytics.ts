import { AnalyticsEvent, WaitlistEntry, Variant, MetricsData } from '@/types';

/**
 * Track analytics event
 */
export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
  try {
    const eventData: AnalyticsEvent = {
      ...event,
      id: generateEventId(),
      timestamp: new Date(),
    };

    // Send to analytics API
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(variant: Variant, sessionId: string): void {
  trackEvent({
    type: 'page_view',
    variant,
    sessionId,
    userAgent: navigator.userAgent,
    metadata: {
      url: window.location.href,
      referrer: document.referrer,
    },
  });
}

/**
 * Track signup attempt
 */
export function trackSignupAttempt(variant: Variant, sessionId: string, email: string): void {
  trackEvent({
    type: 'signup_attempt',
    variant,
    sessionId,
    userAgent: navigator.userAgent,
    metadata: {
      email,
    },
  });
}

/**
 * Track signup success
 */
export function trackSignupSuccess(variant: Variant, sessionId: string, email: string): void {
  trackEvent({
    type: 'signup_success',
    variant,
    sessionId,
    userAgent: navigator.userAgent,
    metadata: {
      email,
    },
  });
}

/**
 * Track button click
 */
export function trackButtonClick(variant: Variant, sessionId: string, buttonId: string): void {
  trackEvent({
    type: 'button_click',
    variant,
    sessionId,
    userAgent: navigator.userAgent,
    metadata: {
      buttonId,
    },
  });
}

/**
 * Submit waitlist entry
 */
export async function submitWaitlistEntry(email: string, variant: Variant): Promise<WaitlistEntry> {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      variant,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit waitlist entry');
  }

  return response.json();
}

/**
 * Generate unique event ID
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get conversion metrics
 */
/**
 * Get conversion metrics for A/B testing dashboard
 */
export async function getConversionMetrics(): Promise<MetricsData> {
  const response = await fetch('/api/analytics/metrics');
  if (!response.ok) {
    throw new Error('Failed to fetch conversion metrics');
  }
  return response.json();
}
