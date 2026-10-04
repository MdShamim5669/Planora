'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Globe,
  Lock,
  DollarSign,
  Gift,
  UploadCloud,
  X,
  Calendar,
  MapPin,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  Users,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type GatheringTier = 'PUBLIC_FREE' | 'PUBLIC_PAID' | 'PRIVATE_FREE' | 'PRIVATE_PAID';

const TIER_DETAILS: Record<
  GatheringTier,
  {
    title: string;
    subtitle: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    isPaid: boolean;
    defaultFee: number;
    badge: string;
    icon: React.ElementType;
    accentColor: string;
    borderActive: string;
    badgeColor: string;
    description: string;
    perks: string[];
    safeguards: string;
  }
> = {
  PUBLIC_FREE: {
    title: 'Public Free',
    subtitle: 'Free for open communities',
    visibility: 'PUBLIC',
    isPaid: false,
    defaultFee: 0,
    badge: 'Open Community',
    icon: Globe,
    accentColor: 'text-blue-600',
    borderActive: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Perfect for student hackathons, open-source meetups, and free public community gatherings.',
    perks: [
      'Unlimited free attendees',
      'Instant QR digital pass issued on signup',
      'Public discovery & calendar listing',
      'Open community discussion thread',
    ],
    safeguards: 'Instant pass auto-granted with zero payment friction.',
  },
  PUBLIC_PAID: {
    title: 'Public Paid',
    subtitle: 'Ticketed & revenue summits',
    visibility: 'PUBLIC',
    isPaid: true,
    defaultFee: 1500,
    badge: 'Monetized Summit',
    icon: DollarSign,
    accentColor: 'text-indigo-600',
    borderActive: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Ideal for conferences, workshops, masterclasses, and music/cultural festivals.',
    perks: [
      'SSLCommerz automated BDT payments (bKash, Nagad, Cards)',
      'Instant payment verification & automated PDF ticket',
      'Tiered pricing & promo codes',
      'Direct payout to host bank/MFS account',
    ],
    safeguards: 'Encrypted SSLCommerz transaction gateway with IPN verification.',
  },
  PRIVATE_FREE: {
    title: 'Private Free',
    subtitle: 'Confidential & unlisted',
    visibility: 'PRIVATE',
    isPaid: false,
    defaultFee: 0,
    badge: 'Confidential',
    icon: Lock,
    accentColor: 'text-amber-600',
    borderActive: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Designed for secret masterminds, closed developer roundtables, and team retreats.',
    perks: [
      'Masked venue address until guest is approved',
      'One-time secure invite tokens for guests',
      'Host attendee vetting & gatekeeper approval',
      'Hidden from public search, tags & catalog feeds',
    ],
    safeguards: 'Zero public feed discovery; venue concealed until host approves RSVP.',
  },
  PRIVATE_PAID: {
    title: 'Private Paid (VIP)',
    subtitle: 'Vetted executive roundtables',
    visibility: 'PRIVATE',
    isPaid: true,
    defaultFee: 3500,
    badge: 'VIP Roundtable',
    icon: ShieldCheck,
    accentColor: 'text-purple-600',
    borderActive: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/30',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'For high-ticket masterminds, investor dinners, and invitation-only executive summits.',
    perks: [
      'Two-tier gatekeeping (Host Approval + Paid Checkout)',
      'Concealed venue address & confidentiality safeguard',
      'Attendee profile vetting prior to payment link issuance',
      'Direct host concierge control',
    ],
    safeguards: 'Attendees must be vetted and approved before payment unlocks.',
  },
};

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  eventDate: z.string().min(1, 'Event date and time is required'),
  venue: z.string().optional(),
  eventLink: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  fee: z.coerce.number().min(0, 'Fee cannot be negative'),
});

type EventFormValues = z.infer<typeof eventSchema>;

function CreateEventStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial query parameters
  const typeParam = searchParams.get('type') || searchParams.get('visibility');
  const feeParam = searchParams.get('fee') || searchParams.get('feeType');

  const resolveInitialTier = (): GatheringTier => {
    const isPrivate = typeParam?.toUpperCase() === 'PRIVATE';
    const isPaid = feeParam?.toUpperCase() === 'PAID' || Number(feeParam) > 0;

    if (isPrivate && isPaid) return 'PRIVATE_PAID';
    if (isPrivate) return 'PRIVATE_FREE';
    if (isPaid) return 'PUBLIC_PAID';
    return 'PUBLIC_FREE';
  };

  const [selectedTier, setSelectedTier] = useState<GatheringTier>(resolveInitialTier);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTierConfig = TIER_DETAILS[selectedTier];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      eventDate: '',
      venue: '',
      eventLink: '',
      visibility: activeTierConfig.visibility,
      fee: activeTierConfig.defaultFee,
    },
  });

  // When tier changes, synchronize visibility and fee
  const handleTierSelect = (tier: GatheringTier) => {
    setSelectedTier(tier);
    const config = TIER_DETAILS[tier];
    setValue('visibility', config.visibility);
    setValue('fee', config.isPaid ? (watch('fee') > 0 ? watch('fee') : config.defaultFee) : 0);
  };

  useEffect(() => {
    const tier = resolveInitialTier();
    handleTierSelect(tier);
  }, [typeParam, feeParam]);

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Banner image must be under 5MB');
      return;
    }

    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      let uploadedUrl: string | null = null;

      // 1. Upload banner to Cloudinary if selected
      if (bannerFile) {
        const formData = new FormData();
        formData.append('banner', bannerFile);
        const uploadRes = await api.post('/events/upload-banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data?.data?.url) {
          uploadedUrl = uploadRes.data.data.url;
        }
      }

      // 2. Publish event to backend
      const payload = {
        title: data.title,
        description: data.description,
        eventDate: new Date(data.eventDate).toISOString(),
        venue: data.venue || null,
        eventLink: data.eventLink || null,
        visibility: selectedTier.startsWith('PRIVATE') ? 'PRIVATE' : 'PUBLIC',
        fee: activeTierConfig.isPaid ? Number(data.fee) : 0,
        imageUrl: uploadedUrl,
        bannerImage: uploadedUrl,
      };

      const res = await api.post('/events', payload);
      toast.success(`${activeTierConfig.title} event published successfully!`);
      router.push(`/dashboard/events`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header & Breadcrumb */}
      <div>
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to My Events</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Create an Event
              </h1>
              <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full border', activeTierConfig.badgeColor)}>
                {activeTierConfig.badge}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Select your gathering architecture and configure automated ticketing, privacy, and host moderation.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: The 4 Gathering Format Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Step 1: Choose Gathering Architecture
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(Object.keys(TIER_DETAILS) as GatheringTier[]).map((tierKey) => {
            const tier = TIER_DETAILS[tierKey];
            const isSelected = selectedTier === tierKey;
            const Icon = tier.icon;

            return (
              <div
                key={tierKey}
                onClick={() => handleTierSelect(tierKey)}
                className={cn(
                  'cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between select-none relative',
                  isSelected
                    ? tier.borderActive
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-indigo-600">
                    <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center border',
                        isSelected ? 'bg-white shadow-2xs' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', tier.accentColor)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{tier.title}</h4>
                      <span className="text-[10px] text-slate-500">{tier.isPaid ? 'Ticketed' : 'Free Entry'}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{tier.subtitle}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tier.visibility}</span>
                  <span className="font-bold text-slate-800">
                    {tier.isPaid ? `৳${tier.defaultFee.toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Main Event Details Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Tier Active Context Banner */}
        <div className={cn('p-4 rounded-2xl border flex items-start gap-3', activeTierConfig.badgeColor)}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-slate-900">
              Configured Format: {activeTierConfig.title} ({activeTierConfig.visibility})
            </p>
            <p className="text-slate-600">{activeTierConfig.description}</p>
            <p className="font-semibold text-slate-700 pt-1">
              Safeguard: {activeTierConfig.safeguards}
            </p>
          </div>
        </div>

        {/* Banner Cover Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Event Banner Cover
          </label>

          {bannerPreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[21/9] max-h-64 w-full bg-slate-900 group">
              <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setBannerFile(null);
                  setBannerPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                title="Remove Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Click to upload cover banner
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG or WEBP up to 5MB (16:9 or 21:9 recommended)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerSelect}
            className="hidden"
          />
        </div>

        {/* Title */}
        <Input
          label="Event Title"
          placeholder="e.g. Dhaka Next.js & AI Developers Summit 2026"
          {...register('title')}
          error={errors.title?.message}
          required
        />

        {/* Description */}
        <Textarea
          label="Event Description & Agenda"
          placeholder="Provide complete event details, schedule, speaker bios, and participant requirements..."
          rows={4}
          {...register('description')}
          error={errors.description?.message}
          required
        />

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            type="datetime-local"
            label="Date & Time"
            {...register('eventDate')}
            error={errors.eventDate?.message}
            required
          />

          {/* Pricing Config based on Tier */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Ticket Fee (BDT)
            </label>
            {activeTierConfig.isPaid ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={1}
                    step={50}
                    placeholder="1500"
                    {...register('fee')}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px]">Presets:</span>
                  {[500, 1000, 1500, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setValue('fee', amt)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium transition-colors"
                    >
                      ৳{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm font-semibold flex items-center justify-between">
                <span>Free Entry (৳0)</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Community Free
                </span>
              </div>
            )}
            {errors.fee && <p className="text-xs text-red-500 mt-1">{errors.fee.message}</p>}
          </div>
        </div>

        {/* Location & Virtual Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input
              label={
                selectedTier.startsWith('PRIVATE')
                  ? 'Physical Venue Address (Masked Until Approved)'
                  : 'Physical Venue Address'
              }
              placeholder="e.g. BICC Auditorium, Agargaon, Dhaka"
              {...register('venue')}
              error={errors.venue?.message}
            />
            {selectedTier.startsWith('PRIVATE') && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3 shrink-0" />
                Venue is hidden from public feeds and revealed upon host RSVP approval.
              </p>
            )}
          </div>

          <Input
            label="Virtual Event Link (Optional)"
            placeholder="e.g. https://meet.google.com/abc-defg-hij"
            {...register('eventLink')}
            error={errors.eventLink?.message}
          />
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/dashboard/events" className="w-full sm:w-auto">
            <Button variant="secondary" type="button" className="w-full">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto px-8 shadow-lg shadow-indigo-600/25"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Publish {activeTierConfig.title} Event
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 mt-3 font-medium">Loading Event Studio...</p>
        </div>
      }
    >
      <CreateEventStudio />
    </Suspense>
  );
}
