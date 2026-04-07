'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function RSVPPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const phone = searchParams.get('phone');

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'declined'>('pending');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const res = await fetch(`/api/rsvp?eventId=${eventId}&phone=${phone}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
          if (data.guestStatus) setStatus(data.guestStatus);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (eventId && phone) fetchEventDetails();
  }, [eventId, phone]);

  async function handleRSVP(newStatus: 'confirmed' | 'declined') {
    try {
      setSubmitting(true);
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, phone, status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        setCompleted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-pink-50">💍 Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center text-red-600">Event not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-rose-100">
        <span className="text-5xl mb-4 block">💌</span>
        <h1 className="text-3xl font-bold text-rose-900 mb-2">You're Invited!</h1>
        <p className="text-gray-600 mb-6 text-lg">
          We would love to celebrate with you at the wedding of
        </p>
        
        <div className="bg-rose-50 py-6 rounded-2xl mb-8 border border-rose-200">
          <h2 className="text-2xl font-extrabold text-rose-800">
            {event.groomName} & {event.brideName}
          </h2>
          <div className="mt-4 text-gray-700">
            <p className="font-semibold">📍 {event.eventLocation}</p>
            <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
          </div>
        </div>

        {completed ? (
          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 animate-bounce">
            <p className="text-green-800 font-bold text-xl">Thank You!</p>
            <p className="text-green-700 mt-2">
              Your response ({status}) has been saved.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-bold text-gray-800 mb-4 italic text-lg">Will you be attending?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRSVP('confirmed')}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all text-lg"
              >
                ✅ Yes, I'm coming!
              </button>
              <button
                onClick={() => handleRSVP('declined')}
                disabled={submitting}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl shadow-md transform active:scale-95 transition-all text-lg"
              >
                ❌ Sorry, I can't
              </button>
            </div>
            {submitting && <p className="text-gray-400 animate-pulse mt-2">Saving your response...</p>}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-400">
          Powered by Wedding RSVP Platform 💍
        </div>
      </div>
    </div>
  );
}
