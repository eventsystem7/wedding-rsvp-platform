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
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-pink-50 pb-20">
      <nav className="bg-rose-600 p-4 text-white flex justify-between items-center shadow-md">
        <Link href="/dashboard" className="font-bold">← Back</Link>
        <h1 className="text-xl font-bold">Event Management</h1>
        <div className="w-10"></div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <StatsCard eventId={parseInt(eventId)} />

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold shadow-lg"
          >
            {showUploadForm ? 'Cancel' : '+ Add Guests (CSV)'}
          </button>
        </div>

        {showUploadForm && (
          <div className="mb-6 bg-white p-4 rounded-xl shadow-inner">
            <CSVImport onImport={handleImport} isLoading={isImporting} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-rose-100">
              <tr>
                <th className="p-4 text-rose-900">Name</th>
                <th className="p-4 text-rose-900">Phone</th>
                <th className="p-4 text-rose-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {guests.map((g: any) => (
                <tr key={g.id}>
                  <td className="p-4 font-medium">{g.name}</td>
                  <td className="p-4 text-gray-600">{g.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      g.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      g.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {g.status}
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
