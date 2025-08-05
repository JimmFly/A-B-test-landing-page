import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

/**
 * Handle GET request to retrieve conversion metrics
 */
export async function GET(_request: NextRequest) {
  try {
    const metrics = await storage.getConversionMetrics();

    // Add additional statistics
    const uniqueSessionsA = await storage.getUniqueSessionsCount('A');
    const uniqueSessionsB = await storage.getUniqueSessionsCount('B');
    const totalUniqueSessions = await storage.getUniqueSessionsCount();

    const allEvents = await storage.getEvents();
    const waitlistEntries = await storage.getWaitlistEntries();

    const response = {
      metrics,
      summary: {
        totalEvents: allEvents.length,
        totalWaitlistEntries: waitlistEntries.length,
        uniqueSessions: {
          A: uniqueSessionsA,
          B: uniqueSessionsB,
          total: totalUniqueSessions,
        },
        trafficSplit: {
          A: totalUniqueSessions > 0 ? (uniqueSessionsA / totalUniqueSessions) * 100 : 0,
          B: totalUniqueSessions > 0 ? (uniqueSessionsB / totalUniqueSessions) * 100 : 0,
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error retrieving conversion metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle DELETE request to clear all analytics data (for testing)
 */
export async function DELETE(_request: NextRequest) {
  try {
    await storage.clearAll();
    return NextResponse.json({ success: true, message: 'All data cleared' }, { status: 200 });
  } catch (error) {
    console.error('Error clearing analytics data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
