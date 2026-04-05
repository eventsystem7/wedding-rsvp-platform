'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-rose-900 mb-2 md:mb-4">💍 Wedding RSVP</h1>
          <p className="text-lg md:text-xl text-rose-700">Manage your wedding with ease</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          <Link href="/login">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 hover:shadow-xl transition cursor-pointer active:scale-95">
              <h2 className="text-xl md:text-2xl font-bold text-rose-900 mb-2 md:mb-4">👤 Login</h2>
              <p className="text-sm md:text-base text-gray-600">Sign in to manage your wedding events</p>
            </div>
          </Link>

          <Link href="/register">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 hover:shadow-xl transition cursor-pointer active:scale-95">
              <h2 className="text-xl md:text-2xl font-bold text-rose-900 mb-2 md:mb-4">✍️ Register</h2>
              <p className="text-sm md:text-base text-gray-600">Create a new account to get started</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
