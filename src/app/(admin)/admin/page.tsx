'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AdminStats, ApiResponse } from '@/types';
import { Users, Calendar, Ticket, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<AdminStats>>('/admin/stats');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          Planora Administrator Console
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Platform Metrics Overview</h1>
        <p className="text-sm text-muted mt-1">
          Monitor system volume, user growth, total hosted sessions, and processed payment tickets.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <p className="mt-4 text-xs font-semibold text-muted uppercase">Total Users</p>
            <p className="text-3xl font-black text-foreground mt-1">{stats?.totalUsers || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="mt-4 text-xs font-semibold text-muted uppercase">Total Events</p>
            <p className="text-3xl font-black text-foreground mt-1">{stats?.totalEvents || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <p className="mt-4 text-xs font-semibold text-muted uppercase">Participations</p>
            <p className="text-3xl font-black text-foreground mt-1">{stats?.totalParticipations || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="mt-4 text-xs font-semibold text-muted uppercase">Successful Payments</p>
            <p className="text-3xl font-black text-foreground mt-1">{stats?.totalPayments || 0}</p>
          </div>
        </div>
      )}

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Link
          href="/admin/events"
          className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:border-purple-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Moderate Events</h3>
            <ArrowRight className="w-5 h-5 text-muted group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="mt-2 text-sm text-muted">
            Toggle the homepage Featured Event banner, review all public and private events, or delete violating entries.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:border-purple-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">User Directory</h3>
            <ArrowRight className="w-5 h-5 text-muted group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="mt-2 text-sm text-muted">
            View all registered users across the platform, verify roles, and check registration dates.
          </p>
        </Link>
      </div>
    </div>
  );
}
