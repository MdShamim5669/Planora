'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event, ApiResponse } from '@/types';
import { EventCard } from '@/features/events/components/EventCard';
import { EventFilters, EventFilterState } from '@/features/events/components/EventFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SplitText } from '@/components/ui/SplitText';
import { DecryptedText } from '@/components/ui/DecryptedText';
import { ChevronLeft, ChevronRight, Compass, Calendar, Sparkles } from 'lucide-react';

export default function EventsCatalogPage() {
  const [filters, setFilters] = useState<EventFilterState>({
    search: '',
    type: '',
  });
  const [page, setPage] = useState<number>(1);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ['events-catalog', filters, page],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;

      const res = await api.get<ApiResponse<Event[]>>('/events', { params });
      return res.data;
    },
  });

  const events = data?.data || [];
  const meta = data?.meta;

  const handleReset = () => {
    setFilters({ search: '', type: '' });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with Ambient Glow & CTAs */}
      <div className="relative mb-10">
        <div className="absolute -top-12 -left-12 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
              </span>
              <Compass className="w-3.5 h-3.5" />
              <DecryptedText
                text="Planora Discovery Catalog"
                speed={35}
                maxIterations={10}
                encryptedClassName="text-indigo-400 font-mono"
              />
            </div>

            <SplitText
              as="h1"
              text="Explore All Events"
              splitBy="words"
              variant="slide-up"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
            />
            <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
              Discover verified community meetups, tech hackathons, and exclusive private masterclasses across Bangladesh.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link href="/dashboard/events">
              <Button
                variant="primary"
                size="md"
                className="shadow-lg shadow-indigo-500/25"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Host an Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <EventFilters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        onReset={handleReset}
        totalResults={meta?.total ?? events.length}
      />

      {/* Event Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-border h-80 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="We couldn't find any events matching your search criteria. Try modifying your search or filters."
          action={
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <p className="text-xs text-muted">
            Showing <span className="font-semibold text-foreground">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-semibold text-foreground">
              {Math.min(page * limit, meta.total)}
            </span>{' '}
            of <span className="font-semibold text-foreground">{meta.total}</span> events
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <span className="text-xs font-semibold px-3 text-muted">
              Page {page} of {meta.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
