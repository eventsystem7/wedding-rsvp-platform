'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: number;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventLocation: string;
  guests?: any[];
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    eventDate: '',
    eventLocation: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          groomName: '',
          brideName: '',
          eventDate: '',
          eventLocation: '',
        });
        setShowCreateForm(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/');
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <nav className="bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">💍 Wedding RSVP</h1>
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-gray-100 active:scale-95 text-rose-600 px-4 md:px-6 py-2 rounded-lg font-semibold text-sm md:text-base transition shadow-md"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Events</h2>
            <p className="text-gray-600">Manage your wedding RSVPs with ease</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-95 text-white px-6 py-3 rounded-lg font-semibold text-base transition shadow-lg"
          >
            {showCreateForm ? '✕ Cancel' : '+ New Event'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-l-4 border-rose-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Groom's Name"
                  value={formData.groomName}
                  onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Bride's Name"
                  value={formData.brideName}
                  onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Event Location"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-95 text-white font-bold py-3 px-4 rounded-lg transition text-base shadow-lg"
              >
                Create Event
              </button>
            </form>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <p className="text-2xl text-gray-600 mb-4">No events yet</p>
            <p className="text-gray-500 mb-6">Create your first event to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl active:scale-95 transition cursor-pointer h-full border-t-4 border-rose-600">
                  <h3 className="text-xl font-bold text-rose-900 mb-3">
                    {event.groomName} & {event.brideName}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <span className="text-lg mr-2">📍</span> {event.eventLocation}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="text-lg mr-2">📅</span> {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
                    <p className="text-sm text-gray-700 font-semibold">
                      👥 {event.guests?.length || 0} Guests
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
