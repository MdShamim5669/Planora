'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event, Participation, Invitation, ApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { ShinyText } from '@/components/ui/ShinyText';
import { SplitText } from '@/components/ui/SplitText';
import {
  CalendarCheck2,
  Ticket,
  Mail,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Compass,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  // 1. My Events
  const { data: myEvents } = useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event[]>>('/events/mine');
      return res.data.data || [];
    },
  });

  // 2. My Participations
  const { data: myParticipations } = useQuery({
    queryKey: ['my-participations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Participation[]>>('/participations/mine');
      return res.data.data || [];
    },
  });

  // 3. My Invitations
  const { data: myInvitations } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Invitation[]>>('/invitations/mine');
      return res.data.data || [];
    },
  });

  const eventsCount = myEvents?.length || 0;
  const participationsCount = myParticipations?.length || 0;
  const invitationsCount = myInvitations?.filter((i) => i.status === 'PENDING').length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <ShinyText text="Planora Live Dashboard" speed={4} shimmerColor="rgba(255, 255, 255, 1)" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <SplitText
              as="span"
              text={`Welcome back, ${user?.name || 'Explorer'}!`}
              splitBy="words"
              variant="slide-up"
              trigger="mount"
            />
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Manage your scheduled events, verify incoming attendee requests, and track your active community passes all in one place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/dashboard/events">
              <Button
                variant="white"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4 text-indigo-700" />}
                className="shadow-xl"
              >
                Host New Event
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="glass"
                size="md"
                leftIcon={<Compass className="w-4 h-4 text-white" />}
              >
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/events"
          className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <p className="mt-4 text-xs font-semibold text-muted uppercase">My Created Events</p>
          <p className="text-3xl font-black text-foreground mt-1">
            <CountUp to={eventsCount} duration={1.2} />
          </p>
        </Link>

        <Link
          href="/dashboard/participations"
          className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="mt-4 text-xs font-semibold text-muted uppercase">Event Registrations</p>
          <p className="text-3xl font-black text-foreground mt-1">
            <CountUp to={participationsCount} duration={1.2} />
          </p>
        </Link>

        <Link
          href="/dashboard/invitations"
          className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="mt-4 text-xs font-semibold text-muted uppercase">Pending Invitations</p>
          <p className="text-3xl font-black text-foreground mt-1">
            <CountUp to={invitationsCount} duration={1.2} />
          </p>
        </Link>
      </div>
    </div>
  );
}
