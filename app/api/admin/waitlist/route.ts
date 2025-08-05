import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { WaitlistEntry } from '@/types';

/**
 * Get all waitlist entries with full details for admin dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // In production, add authentication/authorization here
    // For now, we'll assume this is an admin endpoint

    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') as 'A' | 'B' | null;
    const format = searchParams.get('format') as 'json' | 'csv' | null;

    const allEntries = await storage.getWaitlistEntries();
    const entries = variant ? allEntries.filter(entry => entry.variant === variant) : allEntries;

    // Sort by timestamp (newest first)
    const sortedEntries = entries.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (format === 'csv') {
      return exportAsCSV(sortedEntries);
    }

    return NextResponse.json({
      entries: sortedEntries,
      count: entries.length,
      totalCount: allEntries.length,
      variants: {
        A: allEntries.filter(e => e.variant === 'A').length,
        B: allEntries.filter(e => e.variant === 'B').length,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving admin waitlist data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Export waitlist entries as CSV
 */
function exportAsCSV(entries: WaitlistEntry[]): NextResponse {
  const headers = ['ID', 'Email', 'Variant', 'Timestamp', 'User Agent', 'Referrer'];

  const csvContent = [
    headers.join(','),
    ...entries.map(entry =>
      [
        entry.id,
        `"${entry.email}"`, // Wrap email in quotes to handle commas
        entry.variant,
        entry.timestamp.toISOString(),
        `"${entry.userAgent || ''}"`,
        `"${entry.referrer || ''}"`,
      ].join(',')
    ),
  ].join('\n');

  const filename = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
