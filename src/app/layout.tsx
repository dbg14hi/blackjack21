import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blackjack Game',
  description: 'A fun blackjack game built with Next.js',
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