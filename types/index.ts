// Common types
export type Variant = 'A' | 'B';
export type EventType = 'page_view' | 'signup_attempt' | 'signup_success' | 'button_click';

// User and analytics types
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  variant: Variant;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  variant: Variant;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  variant: Variant;
  timestamp: Date;
  sessionId: string;
  userAgent?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

export interface ABTestConfig {
  enabled: boolean;
  trafficSplit: Record<Variant, number>;
}

export interface ConversionMetrics {
  variant: Variant;
  pageViews: number;
  signups: number;
  conversionRate: number;
  lastUpdated: Date;
}

// Analytics dashboard types
export interface MetricsData {
  metrics: Record<Variant, ConversionMetrics>;
  summary: {
    totalEvents: number;
    totalWaitlistEntries: number;
    uniqueSessions: Record<Variant, number> & { total: number };
    trafficSplit: Record<Variant, number>;
  };
  lastUpdated: string;
}

// Component props types
export interface LandingPageProps {
  variant: Variant;
  sessionId: string;
}

export interface HeroSectionProps {
  variant: Variant;
  onSignupClick: () => void;
}

export interface FeaturesSectionProps {
  variant: Variant;
}

export interface CTASectionProps {
  variant: Variant;
  onSignupClick: () => void;
}

export interface WaitlistFormProps {
  variant: Variant;
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export interface SuccessMessageProps {
  variant: Variant;
  email: string;
  onClose: () => void;
}
