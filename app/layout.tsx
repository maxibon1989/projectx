import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/contexts/AppContext';

export const metadata: Metadata = {
  title: 'Home Planner',
  description: 'Shared family home coordination and planning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
