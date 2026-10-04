'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Participation, ApiResponse } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Ticket, ExternalLink, Calendar, MapPin, Globe } from 'lucide-react';

export default function MyRegistrationsPage() {
  const { data: participations, isLoading } = useQuery({
    queryKey: ['my-participations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Participation[]>>('/participations/mine');
      return res.data.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Event Registrations</h1>
        <p className="text-sm text-muted">Track your registration status, event passes, and venue access.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : participations?.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-7 h-7" />}
          title="No event registrations yet"
          description="Explore our public and private events catalog to register and secure your spot."
          action={
            <Link href="/events">
              <Button>Browse Events</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {participations?.map((part) => {
            const ev = part.event;
            if (!ev) return null;

            return (
              <div
                key={part.id}
                className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="status" status={part.status} />
                    <Badge variant={ev.visibility === 'PUBLIC' ? 'public' : 'private'} />
                    <Badge variant={ev.fee === 0 ? 'free' : 'paid'} amount={ev.fee} />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    <Link
                      href={`/events/${ev.id}`}
                      className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      {ev.title} <ExternalLink className="w-3.5 h-3.5 text-muted" />
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(ev.eventDate)}
                    </span>

                    {part.status === 'APPROVED' ? (
                      ev.eventLink ? (
                        <a
                          href={ev.eventLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          <Globe className="w-3.5 h-3.5 text-emerald-500" />
                          Join Online Session
                        </a>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {ev.venue || 'Venue TBD'}
                        </span>
                      )
                    ) : (
                      <span className="text-amber-700 italic">
                        {part.status === 'PENDING'
                          ? 'Venue & session link visible after host approval'
                          : 'Access not permitted'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/events/${ev.id}`}>
                    <Button variant="outline" size="sm">
                      View Event
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
