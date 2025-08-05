'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assignVariant, getSessionId } from '@/lib/ab-testing';
import { trackEvent } from '@/lib/analytics';
import { isClient } from '@/utils';

/**
 * Main page that handles A/B test routing
 * Automatically redirects users to either landing-a or landing-b based on A/B test assignment
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isClient()) {
      // Get or create session ID
      const sessionId = getSessionId();

      // Assign user to A/B test variant
      const variant = assignVariant({
        enabled: true,
        trafficSplit: { A: 50, B: 50 }, // 50/50 split
      });

      // Track the assignment
      trackEvent({
        type: 'page_view',
        variant,
        sessionId,
        userAgent: navigator.userAgent,
        metadata: {
          url: window.location.href,
          referrer: document.referrer,
          assignment: 'ab_test_redirect',
        },
      });

      // Redirect to appropriate landing page
      router.replace(`/landing-${variant.toLowerCase()}`);
    }
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-secondary-600 rounded-full animate-spin mx-auto"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        {/* Loading Text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Soku AI</h1>
        <p className="text-gray-600 animate-pulse">Preparing your personalized experience...</p>

        {/* Fallback Link */}
        <div className="mt-8 space-x-4">
          <a
            href="/landing-a"
            className="text-primary-600 hover:text-primary-700 underline text-sm"
          >
            Continue to Landing A
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/landing-b"
            className="text-secondary-600 hover:text-secondary-700 underline text-sm"
          >
            Continue to Landing B
          </a>
        </div>
      </div>
    </div>
  );
}
