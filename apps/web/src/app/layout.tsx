import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Decora — Redesign Your Home with AI',
    template: '%s · Decora',
  },
  description:
    "Nigeria's first AI-powered interior design platform. Photo of your room in, photorealistic redesign out — with real Naira prices and local suppliers.",
  openGraph: {
    title: 'Decora — Redesign Your Home with AI',
    description:
      "Photo in, redesign out. Real Naira prices. Real Nigerian suppliers.",
    locale: 'en_NG',
    siteName: 'Decora',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F0F0F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
