'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarCheck2,
  Ticket,
  Mail,
  CreditCard,
  User as UserIcon,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Events',
      href: '/dashboard/events',
      icon: CalendarCheck2,
    },
    {
      name: 'My Registrations',
      href: '/dashboard/participations',
      icon: Ticket,
    },
    {
      name: 'Invitations',
      href: '/dashboard/invitations',
      icon: Mail,
    },
    {
      name: 'Payment Records',
      href: '/dashboard/payments',
      icon: CreditCard,
    },
    {
      name: 'Profile Settings',
      href: '/dashboard/profile',
      icon: UserIcon,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-border p-4 h-fit shrink-0 shadow-sm">
      <div className="px-3 py-2 mb-2">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
          User Dashboard
        </h3>
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
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-foreground hover:bg-slate-100'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-muted')} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {user?.role === 'ADMIN' && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="px-3 py-1 mb-2">
            <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Administration
            </h3>
          </div>
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname.startsWith('/admin')
                ? 'bg-purple-600 text-white'
                : 'text-purple-700 hover:bg-purple-50'
            )}
          >
            <ShieldAlert className="w-4 h-4" />
            Admin Panel
          </Link>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href="/events"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-muted hover:text-primary transition-colors"
        >
          <Compass className="w-4 h-4" />
          Browse Public Events
        </Link>
      </div>
    </aside>
  );
};
