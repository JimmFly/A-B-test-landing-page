'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getConversionMetrics } from '@/lib/analytics';
import { formatPercentage, formatDate } from '@/utils';
import { MetricsData } from '@/types';

/**
 * Analytics dashboard for A/B test results
 */
export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch analytics data
   */
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConversionMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all data
   */
  const clearData = async () => {
    if (
      confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')
    ) {
      try {
        await fetch('/api/analytics/metrics', { method: 'DELETE' });
        await fetchMetrics();
      } catch {
        setError('Failed to clear data');
      }
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  // Memoize loading component
  const loadingComponent = useMemo(
    () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    ),
    []
  );

  // Memoize error component
  const errorComponent = useMemo(
    () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button onClick={fetchMetrics} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    ),
    [error, fetchMetrics]
  );

  // Memoize calculated values
  const { metricsData, summary, winningVariant, conversionDiff } = useMemo(() => {
    if (!metrics)
      return { metricsData: null, summary: null, winningVariant: 'A', conversionDiff: 0 };

    const { metrics: metricsData, summary } = metrics;
    const winningVariant = metricsData.A.conversionRate > metricsData.B.conversionRate ? 'A' : 'B';
    const conversionDiff = Math.abs(metricsData.A.conversionRate - metricsData.B.conversionRate);

    return { metricsData, summary, winningVariant, conversionDiff };
  }, [metrics]);

  // Memoize animation configurations
  const cardAnimations = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    }),
    []
  );

  const variantAnimations = useMemo(
    () => ({
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.4 },
    }),
    []
  );

  const summaryAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4, duration: 0.3 },
    }),
    []
  );

  // Early returns after all hooks
  if (loading && !metrics) {
    return loadingComponent;
  }

  if (error) {
    return errorComponent;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">A/B Test Analytics</h1>
              <p className="text-gray-600 mt-1">
                Real-time performance metrics for landing page variants
              </p>
            </div>
            <div className="flex space-x-4">
              <button onClick={fetchMetrics} disabled={loading} className="btn-outline">
                {loading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
              <button
                onClick={clearData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🗑️ Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div {...cardAnimations} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{summary?.totalEvents || 0}</div>
            <div className="text-gray-600">Total Events</div>
          </motion.div>

          <motion.div
            {...cardAnimations}
            transition={{ ...cardAnimations.transition, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="text-2xl font-bold text-green-600">
              {summary?.totalWaitlistEntries || 0}
            </div>
            <div className="text-gray-600">Total Signups</div>
          </motion.div>

          <motion.div
            {...cardAnimations}
            transition={{ ...cardAnimations.transition, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="text-2xl font-bold text-blue-600">
              {summary?.uniqueSessions?.total || 0}
            </div>
            <div className="text-gray-600">Unique Sessions</div>
          </motion.div>

          <motion.div
            {...cardAnimations}
            transition={{ ...cardAnimations.transition, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="text-2xl font-bold text-purple-600">
              {winningVariant} {conversionDiff > 0 ? `+${formatPercentage(conversionDiff)}` : ''}
            </div>
            <div className="text-gray-600">Leading Variant</div>
          </motion.div>
        </div>

        {/* A/B Test Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Variant A */}
          <motion.div
            {...variantAnimations}
            className={`bg-white p-8 rounded-xl shadow-sm border-2 ${
              winningVariant === 'A' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Landing Page A</h2>
              {winningVariant === 'A' && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  🏆 Winner
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Page Views</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metricsData?.A.pageViews || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Signups</span>
                <span className="text-2xl font-bold text-green-600">
                  {metricsData?.A.signups || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="text-3xl font-bold text-blue-600">
                  {formatPercentage(metricsData?.A.conversionRate || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Traffic Split</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPercentage(summary?.trafficSplit.A || 0)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Design: Clean, professional, automation-focused
              </div>
            </div>
          </motion.div>

          {/* Variant B */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-white p-8 rounded-xl shadow-sm border-2 ${
              winningVariant === 'B' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Landing Page B</h2>
              {winningVariant === 'B' && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  🏆 Winner
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Page Views</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metricsData?.B.pageViews || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Signups</span>
                <span className="text-2xl font-bold text-green-600">
                  {metricsData?.B?.signups || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="text-3xl font-bold text-blue-600">
                  {formatPercentage(metricsData?.B.conversionRate || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Traffic Split</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPercentage(summary?.trafficSplit.B || 0)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Design: Aggressive, urgency-driven, conversion-focused
              </div>
            </div>
          </motion.div>
        </div>

        {/* Test Results Summary */}
        <motion.div {...summaryAnimation} className="bg-white p-8 rounded-xl shadow-sm border">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Test Results Summary</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPercentage(conversionDiff)}
              </div>
              <div className="text-gray-600">Conversion Rate Difference</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {summary?.uniqueSessions?.total && summary?.uniqueSessions?.total > 0
                  ? Math.round(
                      ((summary?.totalWaitlistEntries || 0) / summary.uniqueSessions.total) * 100
                    )
                  : 0}
                %
              </div>
              <div className="text-gray-600">Overall Conversion Rate</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {(summary?.uniqueSessions?.total || 0) > 100 ? 'Significant' : 'Collecting Data'}
              </div>
              <div className="text-gray-600">Statistical Significance</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
            <ul className="text-gray-700 space-y-1">
              {(summary?.uniqueSessions?.total || 0) < 100 && (
                <li>
                  • Continue collecting data for statistical significance (need 100+ sessions)
                </li>
              )}
              {conversionDiff > 1 && (
                <li>
                  • Variant {winningVariant} shows {formatPercentage(conversionDiff)} higher
                  conversion rate
                </li>
              )}
              {conversionDiff < 0.5 && (summary?.uniqueSessions?.total || 0) > 100 && (
                <li>• Conversion rates are very close - consider testing different elements</li>
              )}
              <li>• Monitor user behavior and feedback for qualitative insights</li>
            </ul>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Last updated: {metrics?.lastUpdated ? formatDate(new Date(metrics.lastUpdated)) : 'Never'}{' '}
          • Auto-refreshes every 30 seconds
        </div>
      </div>
    </div>
  );
}
