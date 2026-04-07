'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CSVImport } from '../../components/CSVImport';
import { StatsCard } from '../../components/StatsCard';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/guests?eventId=${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setGuests(data.guests || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (eventId) loadData();
  }, [eventId, router]);

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
        setShowUploadForm(false);
        // Reload guests
        const guestRes = await fetch(`/api/guests?eventId=${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (guestRes.ok) {
          const data = await guestRes.json();
          setGuests(data.guests || []);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  }

  async function handleContactPicker() {
    try {
      // Check if the browser supports Contact Picker API
      if (!('contacts' in navigator && 'select' in navigator.contacts)) {
        alert('Contact picker is not supported on this device/browser.');
        return;
      }

      const props = ['name', 'tel'];
      const opts = { multiple: true };
      
      // @ts-ignore
      const contacts = await navigator.contacts.select(props, opts);
      
      if (contacts.length > 0) {
        const formatted = contacts.map((c: any) => ({
          name: c.name[0],
          phone: c.tel[0].replace(/\D/g, '') // Clean phone number
        }));
        handleImport(formatted);
      }
    } catch (err) {
      console.error('Contact picker error:', err);
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
        alert('WhatsApp messages sent!');
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send WhatsApp messages');
    } finally {
      setIsSending(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-pink-50 pb-20">
      <nav className="bg-gradient-to-r from-rose-600 to-pink-600 p-4 text-white flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="font-bold flex items-center">
          <span className="mr-1">←</span> Back
        </Link>
        <h1 className="text-xl font-bold">Event Management</h1>
        <div className="w-10"></div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <StatsCard eventId={parseInt(eventId)} />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-white text-rose-600 py-3 rounded-2xl font-bold shadow-md border-2 border-rose-100 flex flex-col items-center justify-center hover:bg-rose-50 active:scale-95 transition"
          >
            <span className="text-xl">📄</span>
            <span className="text-xs mt-1">Upload CSV</span>
          </button>
          <button 
            onClick={handleContactPicker}
            className="bg-rose-600 text-white py-3 rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center active:scale-95 transition hover:bg-rose-700"
          >
            <span className="text-xl">📱</span>
            <span className="text-xs mt-1">Add from Phone</span>
          </button>
        </div>

        {showUploadForm && (
          <div className="mb-6 bg-white p-4 rounded-xl shadow-inner border-l-4 border-rose-600">
            <CSVImport onImport={handleImport} isLoading={isImporting} />
          </div>
        )}

        {guests.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200">
            <button 
              onClick={handleSendWhatsApp}
              disabled={isSending}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <span className="text-xl">📱</span>
              {isSending ? 'Sending...' : 'Send WhatsApp Invites'}
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-rose-100 p-4">
            <h2 className="text-lg font-bold text-rose-900">Guest List ({guests.length})</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-rose-50 border-b border-rose-200">
              <tr>
                <th className="p-4 text-rose-900 font-bold">Name</th>
                <th className="p-4 text-rose-900 font-bold">Phone</th>
                <th className="p-4 text-rose-900 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {guests.map((g: any) => (
                <tr key={g.id} className="hover:bg-rose-50 transition">
                  <td className="p-4 font-medium">{g.name}</td>
                  <td className="p-4 text-gray-600">{g.phone}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      g.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      g.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-400 italic">No guests yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
