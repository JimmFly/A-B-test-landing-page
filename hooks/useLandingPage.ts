import { useState, useEffect, useCallback } from 'react';
import { assignVariant, getSessionId } from '@/lib/ab-testing';
import {
  trackPageView,
  trackButtonClick,
  trackSignupAttempt,
  trackSignupSuccess,
  submitWaitlistEntry,
} from '@/lib/analytics';
import { isClient } from '@/utils';
import { Variant } from '@/types';

interface UseLandingPageProps {
  variant: Variant;
}

interface UseLandingPageReturn {
  showWaitlistForm: boolean;
  showSuccessMessage: boolean;
  userEmail: string;
  sessionId: string;
  handleSignupClick: () => void;
  handleWaitlistSubmit: (email: string) => Promise<void>;
  setShowWaitlistForm: (show: boolean) => void;
  setShowSuccessMessage: (show: boolean) => void;
}

/**
 * Custom hook for landing page logic and state management
 * Reduces code duplication between landing page variants
 */
export function useLandingPage({ variant }: UseLandingPageProps): UseLandingPageReturn {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (isClient()) {
      // Initialize session and track page view
      const session = getSessionId();
      setSessionId(session);

      // Assign variant based on current variant
      const trafficSplit = variant === 'A' ? { A: 100, B: 0 } : { A: 0, B: 100 };
      assignVariant({ enabled: true, trafficSplit });

      // Track page view
      trackPageView(variant, session);
    }
  }, [variant]);

  /**
   * Handle signup button click with tracking
   */
  const handleSignupClick = useCallback(() => {
    if (sessionId) {
      trackButtonClick(variant, sessionId, 'signup-cta');
    }
    setShowWaitlistForm(true);
  }, [sessionId, variant]);

  /**
   * Handle waitlist form submission with error handling
   */
  const handleWaitlistSubmit = useCallback(
    async (email: string) => {
      if (sessionId) {
        trackSignupAttempt(variant, sessionId, email);
      }

      try {
        await submitWaitlistEntry(email, variant);

        if (sessionId) {
          trackSignupSuccess(variant, sessionId, email);
        }

        setUserEmail(email);
        setShowWaitlistForm(false);
        setShowSuccessMessage(true);
      } catch (error) {
        // Re-throw the error so the form component can handle it
        throw error;
      }
    },
    [sessionId, variant]
  );

  return {
    showWaitlistForm,
    showSuccessMessage,
    userEmail,
    sessionId,
    handleSignupClick,
    handleWaitlistSubmit,
    setShowWaitlistForm,
    setShowSuccessMessage,
  };
}
