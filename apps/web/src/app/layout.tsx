import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ManlyDude - AI Strength Training',
  description: 'AI-powered strength training and fitness coaching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
