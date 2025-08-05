/**
 * Safe analytics component
 * Replaces dangerouslySetInnerHTML with a safer approach
 */

import Script from 'next/script';

interface AnalyticsProps {
  isProduction?: boolean;
}

export function Analytics({ isProduction = false }: AnalyticsProps) {
  if (!isProduction) {
    return null;
  }

  return (
    <>
      {/* Google Analytics - Replace with your actual GA4 measurement ID */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}

/**
 * Development analytics component for testing
 */
export function DevAnalytics() {
  return (
    <Script id="dev-analytics" strategy="afterInteractive">
      {`
        console.log('Analytics initialized in development mode');
        // Add any development-specific analytics here
      `}
    </Script>
  );
}

/**
 * Privacy-focused analytics component
 */
export function PrivacyAnalytics() {
  return (
    <Script id="privacy-analytics" strategy="afterInteractive">
      {`
        // Privacy-focused analytics implementation
        // This could integrate with privacy-first analytics services
        console.log('Privacy-focused analytics initialized');
        
        // Example: Simple page view tracking without personal data
        if (typeof window !== 'undefined') {
          const pageData = {
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100), // Truncated for privacy
          };
          
          // Send to your privacy-focused analytics endpoint
          fetch('/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event: 'page_view',
              variant: 'A', // or get from your A/B testing logic
              ...pageData
            })
          }).catch(err => console.log('Analytics error:', err));
        }
      `}
    </Script>
  );
}
