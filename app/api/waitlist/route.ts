import { NextRequest, NextResponse } from 'next/server';
import { storage, generateWaitlistEntry } from '@/lib/storage';
import { isValidEmail } from '@/utils';

/**
 * Handle POST request to add user to waitlist
 */
export async function POST(request: NextRequest) {
  try {
    const { email, variant, userAgent, referrer } = await request.json();

    // Validate required fields
    if (!email || !variant) {
      return NextResponse.json({ error: 'Email and variant are required' }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate variant
    if (variant !== 'A' && variant !== 'B') {
      return NextResponse.json({ error: 'Invalid variant. Must be A or B' }, { status: 400 });
    }

    // Generate waitlist entry
    const entry = await generateWaitlistEntry(email, variant, userAgent, referrer);

    // Store the entry
    await storage.storeWaitlistEntry(entry);

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
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to waitlist:', error);

    // Handle duplicate email error
    if (error instanceof Error && error.message === 'Email already registered') {
      return NextResponse.json(
        { error: 'This email is already registered for the waitlist' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
