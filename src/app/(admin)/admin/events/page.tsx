'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event, ApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Search, Star, Trash2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminEventsModerationPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-events', search, page],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event[]>>('/admin/events', {
        params: { search: search || undefined, page, limit },
      });
      return res.data;
    },
  });

  const events = data?.data || [];
  const meta = data?.meta;

  const handleToggleFeature = async (event: Event) => {
    try {
      const res = await api.patch(`/admin/events/${event.id}/feature`);
      toast.success(res.data?.message || 'Featured status updated');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle featured status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this event as Admin?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      toast.success('Event permanently deleted by Admin');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Moderate Events</h1>
          <p className="text-sm text-muted">Manage all hosted gatherings, feature key events, and enforce rules.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border">
        <Input
          placeholder="Filter by event title, organizer, or venue..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No events match the search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted uppercase bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">Event Title</th>
                  <th className="px-6 py-3.5">Organizer</th>
                  <th className="px-6 py-3.5">Type & Fee</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                        <Link href={`/events/${ev.id}`} className="hover:text-primary transition-colors truncate">
                          {ev.title}
                        </Link>
                        <ExternalLink className="w-3.5 h-3.5 text-muted shrink-0" />
                      </div>
                      {ev.isFeatured && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                          ⭐ Featured on Hero
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium text-foreground">{ev.organizer?.name || 'Unknown'}</p>
                      <p className="text-muted">{ev.organizer?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant={ev.visibility === 'PUBLIC' ? 'public' : 'private'} />
                        <Badge variant={ev.fee === 0 ? 'free' : 'paid'} amount={ev.fee} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {formatDate(ev.eventDate, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ev.visibility === 'PUBLIC' && (
                          <Button
                            variant={ev.isFeatured ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleToggleFeature(ev)}
                            className="text-xs"
                            leftIcon={
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  ev.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                                }`}
                              />
                            }
                          >
                            {ev.isFeatured ? 'Unfeature' : 'Feature'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ev.id)}
                          className="text-destructive hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>
              Page {page} of {meta.totalPages} ({meta.total} events)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
