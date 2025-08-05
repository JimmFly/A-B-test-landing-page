/**
 * Safe structured data component for SEO
 * Replaces dangerouslySetInnerHTML with a safer approach
 */

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  // Sanitize and validate the structured data
  const sanitizedData = sanitizeStructuredData(data);

  return (
    <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(sanitizedData)}
    </Script>
  );
}

/**
 * Sanitize structured data to prevent XSS
 */
function sanitizeStructuredData(data: Record<string, any>): Record<string, any> {
  const allowedKeys = [
    '@context',
    '@type',
    'name',
    'description',
    'applicationCategory',
    'operatingSystem',
    'offers',
    'aggregateRating',
    'price',
    'priceCurrency',
    'ratingValue',
    'ratingCount',
  ];

  function sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters and limit length
      return value.replace(/[<>"'&]/g, '').substring(0, 500);
    }

    if (typeof value === 'number') {
      // Ensure numbers are within reasonable bounds
      return Math.max(0, Math.min(value, 999999));
    }

    if (Array.isArray(value)) {
      return value.slice(0, 10).map(sanitizeValue);
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        if (allowedKeys.includes(key)) {
          sanitized[key] = sanitizeValue(val);
        }
      }
      return sanitized;
    }

    return value;
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (allowedKeys.includes(key)) {
      sanitized[key] = sanitizeValue(value);
    }
  }

  return sanitized;
}

/**
 * Pre-defined safe structured data for the application
 */
export const sokuAIStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Soku AI',
  description: 'AI-powered marketing automation platform for SMBs',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free waitlist signup',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '1000',
  },
};
