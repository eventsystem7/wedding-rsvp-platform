import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "./components/MobileNav";

export const metadata: Metadata = {
  title: "Wedding RSVP",
  description: "Manage your wedding RSVPs with WhatsApp integration",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pb-20 md:pb-0">{children}
        <MobileNav />
      </body>
    </html>
  );
}
