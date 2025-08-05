'use client';

import { useState, useEffect } from 'react';
import { WaitlistEntry, Variant } from '@/types';
import { Download, Users, Filter, RefreshCw } from 'lucide-react';

interface WaitlistData {
  entries: WaitlistEntry[];
  count: number;
  totalCount: number;
  variants: {
    A: number;
    B: number;
  };
  lastUpdated: string;
}

/**
 * Admin dashboard for viewing and exporting waitlist data
 */
export default function DashboardPage() {
  const [data, setData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | 'all'>('all');
  const [exporting, setExporting] = useState(false);

  /**
   * Fetch waitlist data from API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedVariant !== 'all') {
        params.append('variant', selectedVariant);
      }
      
      const response = await fetch(`/api/admin/waitlist?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch waitlist data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export waitlist data as CSV
   */
  const exportCSV = async () => {
    try {
      setExporting(true);
      
      const params = new URLSearchParams({ format: 'csv' });
      if (selectedVariant !== 'all') {
        params.append('variant', selectedVariant);
      }
      
      const response = await fetch(`/api/admin/waitlist?${params}`);
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    fetchData();
  }, [selectedVariant]);

  // Listen for waitlist updates to refresh data automatically
  useEffect(() => {
    const handleWaitlistUpdate = () => {
      fetchData();
    };

    window.addEventListener('waitlist-updated', handleWaitlistUpdate);
    return () => {
      window.removeEventListener('waitlist-updated', handleWaitlistUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Waitlist Dashboard</h1>
          <p className="text-gray-600">
            Manage and export waitlist entries from your A/B testing campaigns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalCount || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">A</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Variant A</p>
                <p className="text-2xl font-bold text-gray-900">{data?.variants.A || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">B</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Variant B</p>
                <p className="text-2xl font-bold text-gray-900">{data?.variants.B || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-2xl font-bold text-gray-900">{data?.count || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <label htmlFor="variant-filter" className="text-sm font-medium text-gray-700">
                Filter by variant:
              </label>
              <select
                id="variant-filter"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as Variant | 'all')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Variants</option>
                <option value="A">Variant A</option>
                <option value="B">Variant B</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={exportCSV}
                disabled={exporting || !data?.entries.length}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Download className={`h-4 w-4 ${exporting ? 'animate-pulse' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Waitlist Entries ({data?.count || 0})
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {data?.lastUpdated ? formatTimestamp(data.lastUpdated) : 'Never'}
            </p>
          </div>
          
          {data?.entries.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.variant === 'A' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          Variant {entry.variant}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(entry.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {entry.userAgent || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {entry.referrer || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No entries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedVariant === 'all' 
                  ? 'No waitlist entries have been created yet.' 
                  : `No entries found for variant ${selectedVariant}.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}