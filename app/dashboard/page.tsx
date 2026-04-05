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
      setEvents(data);
    } catch (error) {
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-rose-900">💍 Wedding RSVP</h1>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Events</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-6 py-3 md:py-2 rounded-lg font-medium text-base md:text-sm transition"
          >
            {showCreateForm ? 'Cancel' : '+ New Event'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Groom's Name"
                  value={formData.groomName}
                  onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Bride's Name"
                  value={formData.brideName}
                  onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-base"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Event Location"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-3 px-4 rounded-lg transition text-base"
              >
                Create Event
              </button>
            </form>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg">No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 hover:shadow-xl active:scale-95 transition cursor-pointer h-full">
                  <h3 className="text-lg md:text-xl font-bold text-rose-900 mb-2">
                    {event.groomName} & {event.brideName}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2">
                    📍 {event.eventLocation}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    📅 {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <div className="bg-rose-50 p-3 md:p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
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
