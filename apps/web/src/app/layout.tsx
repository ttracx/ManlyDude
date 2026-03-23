import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ManlyDude - AI-Powered Strength Training',
  description: 'Your AI-powered strength training and fitness coaching platform.',
};

/** Root layout for the ManlyDude web app */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
