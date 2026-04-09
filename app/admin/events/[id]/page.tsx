'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Guest {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface EventDetail {
  id: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  location: string;
  guests: Guest[];
}

export default function AdminEventDetail() {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    // בדוק אם המשתמש מחובר כ-admin
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    // טען את פרטי האירוע
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const data = await response.json();
      setEvent(data.event);
    } catch (err) {
      setError('שגיאה בטעינת האירוע');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-700 text-lg">טוען אירוע...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
            {error || 'אירוע לא נמצא'}
          </div>
          <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700">
            ← חזור ל-Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const confirmedCount = event.guests.filter(g => g.status === 'confirmed').length;
  const declinedCount = event.guests.filter(g => g.status === 'declined').length;
  const pendingCount = event.guests.filter(g => g.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              💍 {event.groomName} & {event.brideName}
            </h1>
            <p className="text-purple-700">
              📅 {new Date(event.eventDate).toLocaleDateString('he-IL')} | 📍 {event.location}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            ✖️ Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Guests</h3>
            <p className="text-3xl font-bold text-purple-900">{event.guests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Declined</h3>
            <p className="text-3xl font-bold text-red-600">{declinedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {event.guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-purple-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{guest.name}</td>
                    <td className="px-6 py-4 text-gray-600">{guest.phone}</td>
                    <td className="px-6 py-4">
                      {guest.status === 'confirmed' && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✅ Confirmed
                        </span>
                      )}
                      {guest.status === 'declined' && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          ❌ Declined
                        </span>
                      )}
                      {guest.status === 'pending' && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700 font-medium">
            ← חזור ל-Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
