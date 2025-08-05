import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { AnalyticsEvent } from '@/types';
import { analyticsRateLimiter, getClientIP } from '@/lib/rate-limit';
import {
  validateVariant,
  validateUserAgent,
  validateReferrer,
  validatePayloadSize,
} from '@/lib/validation';

/**
 * Handle POST request to store analytics event
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    if (analyticsRateLimiter.isRateLimited(clientIP)) {
      const resetTime = analyticsRateLimiter.getResetTime(clientIP);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': analyticsRateLimiter.getRemainingRequests(clientIP).toString(),
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }

    const requestBody = await request.json();

    // Validate payload size
    if (!validatePayloadSize(requestBody, 5)) {
      return NextResponse.json(
        {
          error: 'Request payload too large',
        },
        { status: 413 }
      );
    }

    const eventData: AnalyticsEvent = requestBody;

    // Validate required fields
    if (!eventData.type || !eventData.variant) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Enhanced variant validation
    const variantValidation = validateVariant(eventData.variant);
    if (!variantValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid variant',
        },
        { status: 400 }
      );
    }

    // Sanitize optional fields
    const userAgentValidation = validateUserAgent(eventData.userAgent);
    const referrerValidation = validateReferrer(eventData.referrer);

    const sanitizedEventData = {
      ...eventData,
      userAgent: userAgentValidation.sanitized,
      referrer: referrerValidation.sanitized,
    };

    // Store the event
    await storage.storeEvent(sanitizedEventData);

    // Add rate limit headers to response
    const remaining = analyticsRateLimiter.getRemainingRequests(clientIP);
    const resetTime = analyticsRateLimiter.getResetTime(clientIP);

    return NextResponse.json(
      { success: true },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error storing analytics event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle GET request to retrieve analytics events
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') as 'A' | 'B' | null;
    const type = searchParams.get('type') as AnalyticsEvent['type'] | null;
    // Check if test sessions should be included
    const includeTestSessions = searchParams.get('include_test_sessions') === 'true';

    let events: AnalyticsEvent[];

    if (variant && type) {
      // Filter by both variant and type
      const allEvents = await storage.getEvents(includeTestSessions);
      events = allEvents.filter(e => e.variant === variant && e.type === type);
    } else if (variant) {
      events = await storage.getEventsByVariant(variant, includeTestSessions);
    } else if (type) {
      events = await storage.getEventsByType(type, includeTestSessions);
    } else {
      events = await storage.getEvents(includeTestSessions);
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving analytics events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
