'use client';

import React, { useEffect, useState } from 'react';

interface Stats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
}

interface StatsCardProps {
  eventId: number;
  refreshTrigger?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ eventId, refreshTrigger = 0 }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/guests?eventId=${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        setStats(data.stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, [eventId, refreshTrigger]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading stats...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!stats) return null;

  const confirmationRate = stats.total > 0 
    ? Math.round((stats.confirmed / stats.total) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-gray-600 text-sm font-semibold">Total</p>
        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-gray-600 text-sm font-semibold">Confirmed</p>
        <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-gray-600 text-sm font-semibold">Declined</p>
        <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-gray-600 text-sm font-semibold">Pending</p>
        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        <p className="text-xs text-gray-500 mt-1">{confirmationRate}% confirmed</p>
      </div>
    </div>
  );
};
