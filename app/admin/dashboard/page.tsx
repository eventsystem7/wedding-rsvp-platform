'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  location: string;
  createdBy: string;
  guests?: number;
  responses?: number;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // בדוק אם המשתמש מחובר כ-admin
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    // טען את כל האירועים
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError('שגיאה בטעינת האירועים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">🔐 Admin Dashboard</h1>
            <p className="text-purple-700">כל האירועים בשביל מנהלים</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            ✖️ Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-purple-900">{events.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Guests</h3>
            <p className="text-3xl font-bold text-purple-900">
              {events.reduce((sum, e) => sum + (e.guests || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Responses</h3>
            <p className="text-3xl font-bold text-purple-900">
              {events.reduce((sum, e) => sum + (e.responses || 0), 0)}
            </p>
          </div>
        </div>

        {/* Events Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">טוען אירועים...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">אין אירועים עדיין</p>
            <Link href="/login" className="text-purple-600 hover:text-purple-700">
              צור אירוע חדש
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Event</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Guests</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Responses</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Created By</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {event.groomName} & {event.brideName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(event.eventDate).toLocaleDateString('he-IL')}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{event.location}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {event.guests || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {event.responses || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{event.createdBy}</td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/events/${event.id}`} className="text-purple-600 hover:text-purple-700 font-medium">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            ← חזור לעמוד הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
