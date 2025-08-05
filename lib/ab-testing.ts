import Cookies from 'js-cookie';
import { ABTestConfig } from '@/types';

const AB_TEST_COOKIE = 'ab_test_variant';
const SESSION_COOKIE = 'session_id';

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  let sessionId = Cookies.get(SESSION_COOKIE);
  if (!sessionId) {
    sessionId = generateSessionId();
    Cookies.set(SESSION_COOKIE, sessionId, { expires: 30 }); // 30 days
  }
  return sessionId;
}

/**
 * Assign user to A/B test variant based on configuration
 */
export function assignVariant(
  config: ABTestConfig = { enabled: true, trafficSplit: { A: 50, B: 50 } }
): 'A' | 'B' {
  // Check if user already has a variant assigned
  const existingVariant = Cookies.get(AB_TEST_COOKIE) as 'A' | 'B' | undefined;
  if (existingVariant && (existingVariant === 'A' || existingVariant === 'B')) {
    return existingVariant;
  }

  // If A/B testing is disabled, default to variant A
  if (!config.enabled) {
    const variant = 'A';
    Cookies.set(AB_TEST_COOKIE, variant, { expires: 30 });
    return variant;
  }

  // Assign variant based on traffic split
  const random = Math.random() * 100;
  const variant = random < config.trafficSplit.A ? 'A' : 'B';

  // Store variant in cookie for consistency
  Cookies.set(AB_TEST_COOKIE, variant, { expires: 30 }); // 30 days

  return variant;
}

/**
 * Get current user's variant
 */
export function getCurrentVariant(): 'A' | 'B' | null {
  const variant = Cookies.get(AB_TEST_COOKIE) as 'A' | 'B' | undefined;
  return variant || null;
}

/**
 * Clear A/B test data (useful for testing)
 */
export function clearABTestData(): void {
  Cookies.remove(AB_TEST_COOKIE);
  Cookies.remove(SESSION_COOKIE);
}

/**
 * Check if user is in specific variant
 */
export function isVariant(variant: 'A' | 'B'): boolean {
  return getCurrentVariant() === variant;
}
