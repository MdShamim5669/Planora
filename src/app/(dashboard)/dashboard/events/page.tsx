'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event, ApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateEventModal } from '@/features/dashboard/components/CreateEventModal';
import { formatDate } from '@/lib/utils';
import { Plus, Users, Edit3, Trash2, CalendarCheck2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyCreatedEventsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event[]>>('/events/mine');
      return res.data.data || [];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also remove associated registrations.')) {
      return;
    }
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Created Events</h1>
          <p className="text-sm text-muted">Manage events you are hosting and moderate participant access.</p>
        </div>
        <Link href="/dashboard/events/create">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create New Event
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : events?.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck2 className="w-7 h-7" />}
          title="You haven't hosted any events yet"
          description="Create your first event to start accepting registrations, verifying attendees, and hosting sessions."
          action={
            <Button
              onClick={() => {
                setEventToEdit(null);
                setModalOpen(true);
              }}
            >
              Host Your First Event
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {events?.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={ev.visibility === 'PUBLIC' ? 'public' : 'private'} />
                  <Badge variant={ev.fee === 0 ? 'free' : 'paid'} amount={ev.fee} />
                  {ev.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  <Link href={`/events/${ev.id}`} className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                    {ev.title} <ExternalLink className="w-3.5 h-3.5 text-muted" />
                  </Link>
                </h3>

                <p className="text-xs text-muted flex items-center gap-2">
                  <span>{formatDate(ev.eventDate)}</span>
                  <span>•</span>
                  <span>{ev.venue || (ev.eventLink ? 'Online Event' : 'Venue TBD')}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                <Link href={`/dashboard/events/${ev.id}/participants`}>
                  <Button variant="outline" size="sm" leftIcon={<Users className="w-4 h-4 text-primary" />}>
                    Participants ({ev._count?.participations || 0})
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEventToEdit(ev);
                    setModalOpen(true);
                  }}
                  leftIcon={<Edit3 className="w-4 h-4 text-slate-500" />}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(ev.id)}
                  className="text-destructive hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CreateEventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={refetch}
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  );
}
