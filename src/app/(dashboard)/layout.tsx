'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            <main className="flex-1 w-full min-w-0">{children}</main>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
