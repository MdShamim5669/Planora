'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Participation, Invitation, Event, ApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { InviteUserModal } from '@/features/dashboard/components/InviteUserModal';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, UserPlus, Check, X, Ban, Mail, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventParticipantsManagementPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // 1. Fetch Event Info
  const { data: event } = useQuery({
    queryKey: ['event-details', eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event>>(`/events/${eventId}`);
      return res.data.data;
    },
  });

  // 2. Fetch Event Participants
  const { data: participants, isLoading, refetch } = useQuery({
    queryKey: ['event-participants', eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Participation[]>>(`/events/${eventId}/participants`);
      return res.data.data || [];
    },
  });

  // 3. Fetch Sent Invitations
  const { data: invitations, refetch: refetchInvitations } = useQuery({
    queryKey: ['event-sent-invitations', eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Invitation[]>>(`/events/${eventId}/invitations`);
      return res.data.data || [];
    },
  });

  // Moderation Actions
  const handleModerate = async (partId: string, action: 'approve' | 'reject' | 'ban') => {
    try {
      await api.post(`/participations/${partId}/${action}`);
      toast.success(`Participant status updated to ${action.toUpperCase()}`);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} participant`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground font-semibold mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Events
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Participant Management</h1>
            <p className="text-sm text-muted mt-0.5">
              Review and moderate attendees for <span className="font-semibold text-foreground">{event?.title}</span>
            </p>
          </div>

          <Button onClick={() => setInviteModalOpen(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            Invite by Email
          </Button>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Registered Attendees</h3>
          </div>
          <span className="text-xs font-semibold text-muted">
            Total: {participants?.length || 0}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : participants?.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No participants registered yet"
              description="Share your event link or invite colleagues directly by email."
            />
          </div>
        ) : (
          <div className="divide-y divide-border overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted uppercase bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3">Attendee</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Registration Date</th>
                  <th className="px-6 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {participants?.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{part.user?.name || 'User'}</div>
                      <div className="text-xs text-muted">{part.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="status" status={part.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {formatDate(part.createdAt, 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {part.status !== 'APPROVED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleModerate(part.id, 'approve')}
                            className="text-xs text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200"
                            leftIcon={<Check className="w-3.5 h-3.5 text-emerald-600" />}
                          >
                            Approve
                          </Button>
                        )}
                        {part.status !== 'REJECTED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleModerate(part.id, 'reject')}
                            className="text-xs text-red-700 hover:bg-red-50 hover:border-red-200"
                            leftIcon={<X className="w-3.5 h-3.5 text-red-600" />}
                          >
                            Reject
                          </Button>
                        )}
                        {part.status !== 'BANNED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModerate(part.id, 'ban')}
                            className="text-xs text-slate-600 hover:bg-slate-100"
                            leftIcon={<Ban className="w-3.5 h-3.5" />}
                          >
                            Ban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sent Invitations List */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-foreground">Sent Invitations</h3>
          </div>
          <span className="text-xs font-semibold text-muted">
            Total: {invitations?.length || 0}
          </span>
        </div>

        {invitations?.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted">
            No invitations sent for this event yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {invitations?.map((inv) => (
              <div key={inv.id} className="px-6 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.invitee?.name || inv.invitee?.email}</p>
                  <p className="text-xs text-muted">Sent on {formatDate(inv.createdAt, 'MMM d, yyyy')}</p>
                </div>
                <Badge variant="status" status={inv.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {inviteModalOpen && (
        <InviteUserModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          eventId={eventId}
          onSuccess={() => {
            refetchInvitations();
            refetch();
          }}
        />
      )}
    </div>
  );
}
