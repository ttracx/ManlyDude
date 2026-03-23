import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'ManlyDude - AI-Powered Strength Training',
  description: 'Your AI-powered strength training and fitness coaching platform.',
};

/** Root layout for the ManlyDude web app */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-gray-900 antialiased">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
