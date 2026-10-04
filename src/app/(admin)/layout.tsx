'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Users, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Moderate Events', href: '/admin/events', icon: Calendar },
    { name: 'User Directory', href: '/admin/users', icon: Users },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Admin Sidebar */}
            <aside className="w-full lg:w-64 bg-white rounded-2xl border border-purple-100 p-4 h-fit shrink-0 shadow-sm">
              <div className="px-3 py-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  Admin Panel
                </div>
              </div>

              <nav className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                          : 'text-foreground hover:bg-purple-50 hover:text-purple-700'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-muted')} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-muted hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to User Dashboard
                </Link>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full min-w-0">{children}</main>
          </div>
        </div>
        <Footer />
      </div>
    </AdminRoute>
  );
}
