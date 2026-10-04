'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event, ApiResponse } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HeroEditorialStagger } from '@/components/ui/HeroEditorialStagger';
import { HeroParallaxLayers } from '@/components/ui/HeroParallaxLayers';
import { UpcomingSlider } from '@/features/events/components/UpcomingSlider';
import { GatheringTypesComparison } from '@/features/events/components/GatheringTypesComparison';
import { CountUp } from '@/components/ui/CountUp';
import { SplitText } from '@/components/ui/SplitText';
import { ShinyText } from '@/components/ui/ShinyText';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Users,
  Compass,
  ArrowRight,
  Lock,
  Globe,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  // 1. Fetch Featured Event
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-event'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event>>('/events/featured');
      return res.data.data;
    },
  });

  // 2. Fetch Upcoming 9 Events for Slider
  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Event[]>>('/events/upcoming');
      return res.data.data || [];
    },
  });

  const featured = featuredData;

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* 1. Ultra-Premium Hero Banner with Rich Multi-Stop Gradient Background */}
      <section className="relative overflow-hidden pt-14 md:pt-24 pb-20 border-b border-indigo-100/80 bg-gradient-to-b from-indigo-50/90 via-purple-50/50 to-white">
        {/* Luminous Radial Aura from Top */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.22),rgba(255,255,255,0))] pointer-events-none -z-10" />

        {/* Multi-tone Ambient Lighting Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-[15%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[-5%] left-[25%] w-[450px] h-[450px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Subtle Geometric Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f10c_1px,transparent_1px),linear-gradient(to_bottom,#6366f10c_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_75%,transparent_100%)] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Copy (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Live Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-indigo-200/80 shadow-xs text-xs font-semibold text-indigo-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Next-Gen Event Platform</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-normal">Live Across Bangladesh</span>
              </div>

              {/* Main Headline with Editorial Stagger Reveal */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
                <HeroEditorialStagger
                  lines={['Host and Attend Events', 'with Confidence.']}
                  highlight="Confidence."
                />
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                From open community meetups to exclusive private leadership summits. Planora delivers seamless ticket booking, host approval controls, and secure BDT payments via SSLCommerz.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore All Events
                  </Button>
                </Link>
                <Link href="/dashboard/events" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-white/90 hover:bg-white text-slate-800 border-indigo-200/90 shadow-sm backdrop-blur-xs"
                    leftIcon={<Calendar className="w-4 h-4 text-indigo-600" />}
                  >
                    Host an Event
                  </Button>
                </Link>
              </div>

              {/* Social Proof & Rating Cluster */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-indigo-500 text-white text-[11px] font-bold">
                    TA
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-purple-500 text-white text-[11px] font-bold">
                    NJ
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-emerald-500 text-white text-[11px] font-bold">
                    FK
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-amber-500 text-white text-[11px] font-bold">
                    SI
                  </div>
                </div>
                <div className="text-xs text-slate-600 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="text-amber-400 font-bold text-sm tracking-tighter">★★★★★</span>
                    <span className="font-bold text-slate-800">4.9 / 5</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">
                      <CountUp to={2500} separator="," duration={2} />+ Attendees & Hosts
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-indigo-100/90 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-indigo-100/80 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Host Access Moderation</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-indigo-100/80 shadow-2xs">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>SSLCommerz Secured</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-indigo-100/80 shadow-2xs">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Private Invite Links</span>
                </div>
              </div>
            </div>

            {/* Right: Modern Luxury Hero Parallax Layers (@motion/hero-parallax-layers) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <HeroParallaxLayers
                imageSrc={featured?.coverImage || '/images/hero-event.jpg'}
                title={featured?.title || 'Tech Summit Bangladesh 2026'}
                date={featured?.eventDate ? formatDate(featured.eventDate) : 'Oct 19, 2026'}
                location={featured?.venue || featured?.location || 'BICC Auditorium, Dhaka'}
                badge="Featured Stage"
                eventId={featured?.id}
                fee={featured?.fee ?? 1500}
                visibility={featured?.visibility || 'PUBLIC'}
                attendeeCount={featured?._count?.participations ? `${featured._count.participations}+` : '1,200+'}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Upcoming Events Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              Upcoming Calendar
            </div>
            <SplitText
              as="h2"
              text="Happening Next on Planora"
              splitBy="words"
              variant="slide-up"
              className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
            />
            <p className="text-sm text-muted mt-1">
              Top curated sessions scheduled for the upcoming weeks.
            </p>
          </div>

          <Link href="/events" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <UpcomingSlider events={upcomingEvents || []} />
        )}
      </section>

      {/* 3. The 4 Planora Gathering Types (Reference Pricing-Style Architecture) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GatheringTypesComparison />
      </section>

      {/* 4. Host Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-indigo-500/25 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle background glow circle */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <SplitText
              as="h2"
              text="Ready to Host Your Next Event?"
              splitBy="words"
              variant="slide-up"
              className="text-3xl sm:text-4xl font-black tracking-tight"
            />
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed font-normal">
              <ShinyText
                text="Create an event in 2 minutes. Manage guest lists, review attendee requests, and automate tickets effortlessly."
                speed={6}
                shimmerColor="rgba(255, 255, 255, 0.95)"
              />
            </p>
          </div>
          <Link href="/dashboard/events" className="shrink-0 relative z-10">
            <Button
              variant="white"
              size="lg"
              className="text-indigo-700 px-6 py-3 text-base shadow-2xl"
              rightIcon={<ArrowRight className="w-4 h-4 text-indigo-700" />}
            >
              Create an Event
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
