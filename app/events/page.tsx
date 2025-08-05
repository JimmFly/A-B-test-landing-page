'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsEvent, EventType, Variant } from '@/types';
import { formatDate } from '@/utils';

/**
 * Events Page - Displays all analytics events with filtering options
 */
export default function EventsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [variantFilter, setVariantFilter] = useState<Variant | 'all'>('all');
  const [includeTestSessions, setIncludeTestSessions] = useState<boolean>(false);

  /**
   * Fetch events data with optional filters
   */
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters based on filters
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (variantFilter !== 'all') params.append('variant', variantFilter);
      params.append('include_test_sessions', includeTestSessions.toString());

      const response = await fetch(`/api/analytics?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to load events data');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, variantFilter, includeTestSessions]);

  // Initial data fetch and refresh interval
  useEffect(() => {
    fetchEvents();

    // Set up auto-refresh every 5 seconds
    const intervalId = setInterval(() => {
      fetchEvents();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchEvents]);

  // Animation variants
  const containerAnimations = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemAnimations = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Event type to display name mapping
  const eventTypeLabels: Record<EventType, string> = {
    page_view: 'Page View',
    signup_attempt: 'Signup Attempt',
    signup_success: 'Signup Success',
    button_click: 'Button Click',
    ab_test_assignment: 'A/B Test Assignment',
  };

  // Event type to badge color mapping
  const eventTypeColors: Record<EventType, string> = {
    page_view: 'bg-blue-100 text-blue-800',
    signup_attempt: 'bg-yellow-100 text-yellow-800',
    signup_success: 'bg-green-100 text-green-800',
    button_click: 'bg-purple-100 text-purple-800',
    ab_test_assignment: 'bg-gray-100 text-gray-800',
  };

  // Render loading state
  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading events data...</h2>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block rounded-full h-12 w-12 bg-red-100 text-red-500 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
          <button
            onClick={fetchEvents}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events Log</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">Real-time event tracking for A/B testing campaigns</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">
                    Auto-refresh: 5s
                    {lastUpdated && (
                      <span className="ml-2">• Last updated: {formatDate(lastUpdated)}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={fetchEvents}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as EventType | 'all')}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Event Types</option>
                <option value="page_view">Page View</option>
                <option value="signup_attempt">Signup Attempt</option>
                <option value="signup_success">Signup Success</option>
                <option value="button_click">Button Click</option>
                <option value="ab_test_assignment">A/B Test Assignment</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="variantFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Variant
              </label>
              <select
                id="variantFilter"
                value={variantFilter}
                onChange={e => setVariantFilter(e.target.value as Variant | 'all')}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Variants</option>
                <option value="A">Variant A</option>
                <option value="B">Variant B</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-3 mt-6">
                <input
                  type="checkbox"
                  checked={includeTestSessions}
                  onChange={e => setIncludeTestSessions(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Include Test Sessions
                  <span className="ml-1 text-xs text-gray-500">(Direct access sessions)</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Events
              {events.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({events.length} {events.length === 1 ? 'event' : 'events'})
                </span>
              )}
            </h2>
          </div>

          {events.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {typeFilter !== 'all' || variantFilter !== 'all'
                  ? 'Try changing your filters or generate some events by interacting with the landing pages.'
                  : 'Generate some events by interacting with the landing pages.'}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerAnimations}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-200"
            >
              {events.map(event => (
                <motion.div
                  key={event.id}
                  variants={itemAnimations}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventTypeColors[event.type]}`}
                        >
                          {eventTypeLabels[event.type]}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Variant {event.variant}
                        </span>
                        {event.metadata?.isTestSession === true && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Test Session
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Session ID:</span> {event.sessionId}
                      </div>
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Metadata
                          </h4>
                          <div className="mt-1 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 text-sm">
                            {Object.entries(event.metadata).map(([key, value]) => (
                              <div key={key} className="truncate">
                                <span className="font-medium text-gray-900">{key}:</span>{' '}
                                <span className="text-gray-500">
                                  {typeof value === 'string' ? value : JSON.stringify(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(new Date(event.timestamp))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
