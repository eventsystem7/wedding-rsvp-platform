import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "./components/MobileNav";

export const metadata: Metadata = {
  title: "Wedding RSVP",
  description: "Manage your wedding RSVPs with WhatsApp integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-pink-50 to-rose-50">
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
