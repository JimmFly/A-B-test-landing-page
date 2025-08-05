import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { AnalyticsEvent } from '@/types';

/**
 * Handle POST request to store analytics event
 */
export async function POST(request: NextRequest) {
  try {
    const eventData: AnalyticsEvent = await request.json();

    // Validate required fields
    if (!eventData.type || !eventData.variant || !eventData.sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store the event
    await storage.storeEvent(eventData);

    return NextResponse.json({ success: true }, { status: 201 });
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

    let events: AnalyticsEvent[];

    if (variant && type) {
      // Filter by both variant and type
      const allEvents = await storage.getEvents();
      events = allEvents.filter(e => e.variant === variant && e.type === type);
    } else if (variant) {
      events = await storage.getEventsByVariant(variant);
    } else if (type) {
      events = await storage.getEventsByType(type);
    } else {
      events = await storage.getEvents();
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving analytics events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
