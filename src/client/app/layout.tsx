"use client";

import React from 'react';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/context/auth';

// This component wraps the interactive parts of the layout
const LayoutWrapper = ({ getChildren }: { getChildren: () => React.ReactNode }) => {
  "use client"
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-margin duration-300`}>
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">
          {getChildren()}
        </main>
      </div>
    </div>
  );
}

// The main layout remains a server component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutWrapper getChildren={() => children} />
        </AuthProvider>
      </body>
    </html>
  );
}