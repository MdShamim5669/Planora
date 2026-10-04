'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Invitation, ApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Mail, Check, X, CreditCard, ExternalLink, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyInvitationsPage() {
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: invitations, isLoading, refetch } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Invitation[]>>('/invitations/mine');
      return res.data.data || [];
    },
  });

  const handleAccept = async (inv: Invitation) => {
    setActingId(inv.id);
    try {
      if (inv.event && inv.event.fee > 0) {
        // Paid Event -> SSLCommerz checkout
        const res = await api.post<ApiResponse<{ gatewayUrl: string }>>('/payments/init', {
          eventId: inv.eventId,
          invitationId: inv.id,
        });
        if (res.data.data?.gatewayUrl) {
          toast.success('Redirecting to payment gateway...');
          window.location.href = res.data.data.gatewayUrl;
          return;
        }
      } else {
        // Free Event -> Instant accept
        await api.post(`/invitations/${inv.id}/accept`);
        toast.success('Invitation accepted! Spot confirmed.');
        refetch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setActingId(null);
    }
  };

  const handleDecline = async (invId: string) => {
    setActingId(invId);
    try {
      await api.post(`/invitations/${invId}/decline`);
      toast.success('Invitation declined');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to decline invitation');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Received Invitations</h1>
        <p className="text-sm text-muted">Review private event invites sent to your email.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : invitations?.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-7 h-7" />}
          title="No invitations received"
          description="When event organizers invite you to their private or public gatherings, they will appear here."
        />
      ) : (
        <div className="space-y-4">
          {invitations?.map((inv) => {
            const ev = inv.event;
            if (!ev) return null;
            const isPending = inv.status === 'PENDING';
            const isPaid = ev.fee > 0;

            return (
              <div
                key={inv.id}
                className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="status" status={inv.status} />
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
                    <span>Fee: {ev.fee === 0 ? 'Free' : formatCurrency(ev.fee)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPending ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAccept(inv)}
                        isLoading={actingId === inv.id}
                        leftIcon={isPaid ? <CreditCard className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      >
                        {isPaid ? 'Pay & Accept' : 'Accept'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(inv.id)}
                        disabled={actingId === inv.id}
                        leftIcon={<X className="w-4 h-4 text-muted" />}
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted italic">
                      Responded: {formatDate(inv.respondedAt || inv.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
