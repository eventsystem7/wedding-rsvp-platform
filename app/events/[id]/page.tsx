'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CSVImport } from '@/app/components/CSVImport';
import { StatsCard } from '@/app/components/StatsCard';

interface Guest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  status: 'pending' | 'confirmed' | 'declined';
  sentAt?: string;
  respondedAt?: string;
}

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchGuests() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/guests?eventId=${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setGuests(data);
        }
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchGuests();
    }
  }, [eventId, refreshTrigger]);

  async function handleImport(guestsToAdd: any[]) {
    try {
      setIsImporting(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: parseInt(eventId), guests: guestsToAdd }),
      });

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        setShowUploadForm(false);
      }
    } catch (error) {
      console.error('Failed to upload guests:', error);
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSendWhatsApp() {
    try {
      setIsSending(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: parseInt(eventId) }),
      });

      if (res.ok) {
        alert('Messages sent!');
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to send messages:', error);
    } finally {
      setIsSending(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-rose-600 hover:text-rose-700 font-medium text-sm md:text-base">
            ← Back
          </Link>
          <h1 className="text-lg md:text-2xl font-bold text-rose-900">💍 Wedding RSVP</h1>
          <div className="w-8 md:w-20"></div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        <StatsCard eventId={parseInt(eventId)} refreshTrigger={refreshTrigger} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Guests</h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleSendWhatsApp}
              disabled={isSending || guests.length === 0}
              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 md:px-6 py-3 md:py-2 rounded-lg font-medium disabled:bg-gray-400 transition text-sm md:text-base"
            >
              {isSending ? 'Sending...' : '📱 Send WhatsApp'}
            </button>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-4 md:px-6 py-3 md:py-2 rounded-lg font-medium transition text-sm md:text-base"
            >
              {showUploadForm ? 'Cancel' : '+ Upload CSV'}
            </button>
          </div>
        </div>

        {showUploadForm && (
          <div className="mb-6">
            <CSVImport onImport={handleImport} isLoading={isImporting} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-rose-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Sent</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Replied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm text-gray-900 font-medium">{guest.name}</td>
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm text-gray-600">{guest.phone}</td>
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm">
                      <span
                        className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                          guest.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : guest.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm text-gray-600">
                      {guest.sentAt ? '✓' : '-'}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm text-gray-600">
                      {guest.respondedAt ? '✓' : '-'}
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      No guests found. Start by uploading a CSV!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
