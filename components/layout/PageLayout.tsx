'use client';

import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  variant?: 'company' | 'employee';
}

export function PageLayout({ children, title, variant = 'company' }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant={variant}
      />

      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
