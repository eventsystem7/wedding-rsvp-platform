'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/dashboard' ? 'text-rose-600' : 'text-gray-600'
          }`}
        >
          <span className="text-2xl">📋</span>
          <span className="text-xs mt-1">Events</span>
        </Link>
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/profile' ? 'text-rose-600' : 'text-gray-600'
          }`}
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};
