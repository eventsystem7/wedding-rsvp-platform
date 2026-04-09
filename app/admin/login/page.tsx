'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // הסיסמה הנכונה - AeG!g3248@E!G
      if (password === 'AeG!g3248@E!G') {
        // שמור את ה-token ב-localStorage
        localStorage.setItem('adminToken', 'admin_authenticated_' + Date.now());
        localStorage.setItem('adminLoginTime', Date.now().toString());
        router.push('/admin/dashboard');
      } else {
        setError('סיסמה שגויה');
      }
    } catch (err) {
      setError('שגיאה בהכנסה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">🔐 Admin Login</h1>
          <p className="text-gray-600">Enter administrator password</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Administrator Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'מאמת...' : 'כניסה לאדמין'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm">
            ← חזור לעמוד הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
