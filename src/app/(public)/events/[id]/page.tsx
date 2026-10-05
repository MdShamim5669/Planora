'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event, Review, ApiResponse, Participation } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ReviewList } from '@/features/events/components/ReviewList';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Calendar,
  MapPin,
  Globe,
  User,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. Fetch Event Details
  const { data: event, isLoading: eventLoading, refetch: refetchEvent } = useQuery({
    queryKey: ['event-details', eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event>>(`/events/${eventId}`);
      return res.data.data;
    },
  });

  // 2. Fetch Event Reviews
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['event-reviews', eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ reviews: Review[]; averageRating?: number | null; reviewCount?: number } | Review[]>>(`/events/${eventId}/reviews`);
      return res.data;
    },
  });

  // 3. Fetch User's Participation Status for this Event if logged in
  const { data: userParticipation, refetch: refetchParticipation } = useQuery({
    queryKey: ['user-participation', eventId, user?.id],
    enabled: !!isAuthenticated && !!user,
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<Participation[]>>('/participations/mine');
        const myParticipations = res.data.data || [];
        return myParticipations.find((p) => p.eventId === eventId) || null;
      } catch {
        return null;
      }
    },
  });

  if (eventLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">Event not found</h2>
        <p className="mt-2 text-sm text-muted">The event you are looking for does not exist or has been removed.</p>
        <Link href="/events" className="mt-6 inline-block">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isHost = user && user.id === event.organizerId;
  const isPast = new Date(event.eventDate).getTime() < Date.now();
  const status = userParticipation?.status;
  const isApproved = status === 'APPROVED';
  const isPending = status === 'PENDING';
  const isRejected = status === 'REJECTED';
  const isBanned = status === 'BANNED';

  // Masked Location/Link Rule
  const canSeePrivateDetails = event.visibility === 'PUBLIC' || isHost || isApproved;

  // Handle Event Action: Join or Pay & Join
  const handleAction = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to join this event');
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    if (isHost) {
      router.push(`/dashboard/events/${eventId}/participants`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (event.fee > 0) {
        // Paid Event -> Initiate SSLCommerz Payment
        const res = await api.post<ApiResponse<{ gatewayUrl: string; tranId: string }>>('/payments/init', {
          eventId: event.id,
        });

        if (res.data.success && res.data.data?.gatewayUrl) {
          toast.success('Redirecting to SSLCommerz Payment Gateway...');
          window.location.href = res.data.data.gatewayUrl;
        } else {
          toast.error('Unable to initialize payment session');
        }
      } else {
        // Free Event -> Join directly
        await api.post(`/events/${eventId}/join`);
        if (event.visibility === 'PUBLIC') {
          toast.success('Joined successfully! Your spot is confirmed.');
        } else {
          toast.success('Request submitted! Waiting for host approval.');
        }
        refetchParticipation();
        refetchEvent();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to complete registration';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine Exact PRD Button Label
  const getButtonConfig = () => {
    if (isHost) {
      return {
        label: 'Manage Event & Participants',
        icon: <Settings className="w-4 h-4" />,
        variant: 'outline' as const,
        disabled: false,
      };
    }

    if (isApproved) {
      return {
        label: 'Joined',
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    if (isPending) {
      return {
        label: 'Request pending',
        icon: <Clock className="w-4 h-4 text-amber-500" />,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    if (isRejected) {
      return {
        label: 'Your request was rejected',
        icon: null,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    if (isBanned) {
      return {
        label: 'You are banned from this event',
        icon: null,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    if (isPast) {
      return {
        label: 'Event has ended',
        icon: null,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    // Unregistered state: Exact PRD Button Labels
    if (event.visibility === 'PUBLIC' && event.fee === 0) {
      return { label: 'Join', icon: null, variant: 'primary' as const, disabled: false };
    }
    if (event.visibility === 'PUBLIC' && event.fee > 0) {
      return {
        label: 'Pay & Join',
        icon: <CreditCard className="w-4 h-4" />,
        variant: 'primary' as const,
        disabled: false,
      };
    }
    if (event.visibility === 'PRIVATE' && event.fee === 0) {
      return { label: 'Request to Join', icon: <Lock className="w-4 h-4" />, variant: 'primary' as const, disabled: false };
    }
    return {
      label: 'Pay & Request',
      icon: <CreditCard className="w-4 h-4" />,
      variant: 'primary' as const,
      disabled: false,
    };
  };

  const btnConfig = getButtonConfig();
  const reviewsPayload: any = reviewsData?.data;
  const reviews: Review[] = Array.isArray(reviewsPayload)
    ? reviewsPayload
    : Array.isArray(reviewsPayload?.reviews)
    ? reviewsPayload.reviews
    : [];
  const avgRating =
    typeof reviewsPayload?.averageRating === 'number'
      ? reviewsPayload.averageRating
      : reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;
  const totalReviews =
    typeof reviewsPayload?.reviewCount === 'number'
      ? reviewsPayload.reviewCount
      : reviews.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to catalog
      </Link>

      {/* Main Event Card */}
      <div className="bg-white rounded-3xl border border-border shadow-sm relative overflow-hidden">
        {/* Event Banner Image */}
        {(event.bannerImage || event.imageUrl || event.coverImage) && (
          <div className="relative w-full h-56 sm:h-72 md:h-80 bg-slate-900 overflow-hidden">
            <img
              src={event.bannerImage || event.imageUrl || event.coverImage || ''}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 sm:left-10 z-10 flex flex-wrap items-center gap-2">
              <Badge variant={event.visibility === 'PUBLIC' ? 'public' : 'private'} />
              <Badge variant={event.fee === 0 ? 'free' : 'paid'} amount={event.fee} />
              {event.isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-400 text-slate-950 shadow-sm">
                  ⭐ Featured Event
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10">
          {/* Badges fallback if no image */}
          {!(event.bannerImage || event.imageUrl || event.coverImage) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={event.visibility === 'PUBLIC' ? 'public' : 'private'} />
              <Badge variant={event.fee === 0 ? 'free' : 'paid'} amount={event.fee} />
              {event.isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                  ⭐ Featured Event
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {event.title}
          </h1>

        {/* Host Meta */}
        <div className="mt-4 flex items-center gap-3 text-sm text-muted">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
            {event.organizer?.name ? event.organizer.name.charAt(0) : 'H'}
          </div>
          <div>
            <p className="font-semibold text-foreground">{event.organizer?.name || 'Event Host'}</p>
            <p className="text-xs text-muted">Organizer</p>
          </div>
        </div>

        {/* Schedule & Location Details Box */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-border">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center shadow-xs border border-border shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase">Date & Time</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(event.eventDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center shadow-xs border border-border shrink-0">
              {event.eventLink && !event.venue ? <Globe className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase">
                {event.eventLink && !event.venue ? 'Virtual Access' : 'Location & Venue'}
              </p>

              {canSeePrivateDetails ? (
                event.eventLink ? (
                  <a
                    href={event.eventLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5"
                  >
                    Open Session Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-foreground mt-0.5">{event.venue || 'TBD'}</p>
                )
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5 text-sm font-medium text-amber-700">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Visible after approval</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted uppercase font-semibold">Registration Fee</p>
            <p className="text-2xl font-black text-foreground">
              {event.fee === 0 ? 'Free' : formatCurrency(event.fee)}
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <Button
              size="lg"
              variant={btnConfig.variant}
              disabled={btnConfig.disabled}
              isLoading={isSubmitting}
              onClick={handleAction}
              leftIcon={btnConfig.icon}
              className="w-full sm:w-auto px-8"
            >
              {btnConfig.label}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 pt-8 border-t border-border">
          <h3 className="text-lg font-bold text-foreground mb-3">About this Event</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </div>
    </div>

      {/* Reviews Section */}
      <ReviewList
        eventId={eventId}
        reviews={reviews}
        avgRating={avgRating}
        totalReviews={totalReviews}
        onRefresh={() => {
          refetchReviews();
          refetchEvent();
        }}
        canWriteReview={isApproved && isPast}
      />
    </div>
  );
}
