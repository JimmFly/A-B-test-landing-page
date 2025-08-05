import { NextRequest, NextResponse } from 'next/server';
import { storage, generateWaitlistEntry } from '@/lib/storage';
import { waitlistRateLimiter, getClientIP } from '@/lib/rate-limit';
import {
  validateEmail,
  validateVariant,
  validateUserAgent,
  validateReferrer,
  validatePayloadSize,
} from '@/lib/validation';

/**
 * Handle POST request to add user to waitlist
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    if (waitlistRateLimiter.isRateLimited(clientIP)) {
      const resetTime = waitlistRateLimiter.getResetTime(clientIP);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': waitlistRateLimiter.getRemainingRequests(clientIP).toString(),
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
          error: 'Request payload too large.',
        },
        { status: 413 }
      );
    }

    const { email, variant, userAgent, referrer } = requestBody;

    // Validate required fields
    if (!email || !variant) {
      return NextResponse.json(
        {
          error: 'Missing required information. Please provide your email address.',
        },
        { status: 400 }
      );
    }

    // Enhanced email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          error: emailValidation.error || 'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    // Enhanced variant validation
    const variantValidation = validateVariant(variant);
    if (!variantValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Something went wrong. Please refresh the page and try again.',
        },
        { status: 400 }
      );
    }

    // Sanitize optional fields
    const userAgentValidation = validateUserAgent(userAgent);
    const referrerValidation = validateReferrer(referrer);

    const sanitizedUserAgent = userAgentValidation.sanitized;
    const sanitizedReferrer = referrerValidation.sanitized;

    // Get session ID from cookies
    const sessionId = request.cookies.get('session_id')?.value;
    const isTestSession = request.cookies.get('test_session')?.value === 'true';

    // Generate waitlist entry with sanitized data and session metadata
    const entry = await generateWaitlistEntry(
      email,
      variant,
      sanitizedUserAgent,
      sanitizedReferrer,
      { sessionId, isTestSession }
    );

    // Store the entry
    await storage.storeWaitlistEntry(entry);

    // Add rate limit headers to response
    const remaining = waitlistRateLimiter.getRemainingRequests(clientIP);
    const resetTime = waitlistRateLimiter.getResetTime(clientIP);

    return NextResponse.json(
      {
        success: true,
        entry: {
          id: entry.id,
          email: entry.email,
          variant: entry.variant,
          timestamp: entry.timestamp,
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error adding to waitlist:', error);

    // Handle duplicate email error
    if (error instanceof Error && error.message === 'Email already registered') {
      return NextResponse.json(
        {
          error:
            "Good news! You're already on our waitlist. We'll notify you as soon as we launch!",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Oops! Something went wrong on our end. Please try again in a moment.',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET request to retrieve waitlist entries
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') as 'A' | 'B' | null;

    const allEntries = await storage.getWaitlistEntries();
    const entries = variant ? allEntries.filter(entry => entry.variant === variant) : allEntries;

    // Return entries without sensitive information
    const sanitizedEntries = entries.map(entry => ({
      id: entry.id,
      variant: entry.variant,
      timestamp: entry.timestamp,
      // Don't expose email addresses in GET requests for privacy
    }));

    return NextResponse.json(
      {
        entries: sanitizedEntries,
        count: entries.length,
        totalCount: allEntries.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving waitlist entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
