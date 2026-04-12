import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "./components/MobileNav";

export const metadata: Metadata = {
  title: "Wedding RSVP",
  description: "Manage your wedding RSVPs with WhatsApp integration",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wedding RSVP"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Wedding RSVP" />
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
          }
        `}} />
      </head>
      <body className="bg-gradient-to-br from-pink-50 to-rose-50">
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
