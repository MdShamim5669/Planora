'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Check, Users, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { SplitText } from '@/components/ui/SplitText';

interface GatheringPlan {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  price: string;
  priceUnit?: string;
  targetAudience: string;
  hasToggle?: boolean;
  buttonText: string;
  buttonHref: string;
  features: Array<{
    text: string;
    isNew?: boolean;
  }>;
}

const GATHERING_PLANS: GatheringPlan[] = [
  {
    id: 'public-free',
    name: 'Public Free',
    subtitle: 'Free for open communities',
    badge: '1 - 10k',
    price: '৳0',
    priceUnit: 'free forever',
    targetAudience: 'For students, open-source & meetups',
    buttonText: 'Get started with Free',
    buttonHref: '/dashboard/events/create?type=PUBLIC&fee=FREE',
    features: [
      { text: 'Unlimited free attendees' },
      { text: 'Instant QR digital pass' },
      { text: 'Public search & calendar listing' },
      { text: 'Community open discussion' },
    ],
  },
  {
    id: 'public-paid',
    name: 'Public Paid',
    subtitle: 'Ticketed & revenue summits',
    badge: '500+ scale',
    price: '৳1,500',
    priceUnit: 'avg. per ticket',
    targetAudience: 'For conferences, workshops & festivals',
    hasToggle: true,
    buttonText: 'Get started with Pro',
    buttonHref: '/dashboard/events/create?type=PUBLIC&fee=PAID',
    features: [
      { text: 'Everything in Public Free' },
      { text: 'SSLCommerz automated BDT checkout' },
      { text: 'Host approval or instant pass', isNew: true },
      { text: 'Custom promo codes & tiers', isNew: true },
    ],
  },
  {
    id: 'private-free',
    name: 'Private Free',
    subtitle: 'Confidential & unlisted',
    badge: 'By Invite',
    price: 'Invite',
    priceUnit: 'masked venue',
    targetAudience: 'For internal teams & secret gatherings',
    buttonText: 'Host Private Event',
    buttonHref: '/dashboard/events/create?type=PRIVATE&fee=FREE',
    features: [
      { text: 'Masked venue until approved' },
      { text: 'One-time secure invite tokens' },
      { text: 'Host guest vetting & gatekeeping' },
      { text: 'Zero public feed discovery' },
    ],
  },
  {
    id: 'private-paid',
    name: 'Private Paid',
    subtitle: 'Vetted executive roundtables',
    badge: 'VIP 50+',
    price: 'VIP',
    priceUnit: 'custom tier',
    targetAudience: 'For closed high-ticket masterclasses',
    buttonText: 'Apply for VIP Access',
    buttonHref: '/dashboard/events/create?type=PRIVATE&fee=PAID',
    features: [
      { text: 'Everything from Private Free' },
      { text: 'Two-tier verification (Pay + Host)' },
      { text: 'Guest NDA & confidentiality' },
      { text: 'Dedicated host concierge manager' },
    ],
  },
];

export const GatheringTypesComparison: React.FC = () => {
  // Card index 1 (Public Paid) is active (black) by default
  const [activeCard, setActiveCard] = useState<number>(1);
  const [payoutToggle, setPayoutToggle] = useState<boolean>(true);

  // Fetch live gathering plans from backend API with fallback
  const { data: plansData } = useQuery({
    queryKey: ['gathering-plans'],
    queryFn: async () => {
      const res = await api.get('/events/plans');
      return res.data?.data as GatheringPlan[];
    },
    initialData: GATHERING_PLANS,
  });

  const plans = plansData || GATHERING_PLANS;

  return (
    <div className="w-full">
      {/* Section Header matching clean reference aesthetic */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <SplitText
          as="h2"
          text="Designed for Every Gathering Type"
          splitBy="words"
          variant="slide-up"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        />
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
          From open-source meetups to high-stakes executive summits. Automated safeguards for every format.
        </p>
      </div>

      {/* 4 Cards Grid - Compact Height matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isActive = activeCard === index;

          return (
            <motion.div
              key={plan.id}
              onClick={() => setActiveCard(index)}
              onMouseEnter={() => setActiveCard(index)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'relative rounded-2xl p-5 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 border select-none overflow-hidden',
                isActive
                  ? 'bg-[#0B0F19] text-white border-slate-800 shadow-xl shadow-indigo-950/40 ring-1 ring-white/10 lg:scale-[1.02] z-10'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-xs'
              )}
            >
              {/* Animated Motion Border Beam on Active Card */}
              {isActive && (
                <BorderBeam
                  size={260}
                  duration={10}
                  delay={0}
                  borderWidth={2}
                  colorFrom="#6366F1"
                  colorTo="#EC4899"
                />
              )}

              {/* Top Accent line if Active */}
              {isActive && (
                <div className="absolute -top-px left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              )}

              <div>
                {/* Header Row: Title & Attendee Badge */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={cn(
                      'text-lg font-bold tracking-tight',
                      isActive ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    {plan.name}
                  </h3>

                  {plan.badge && (
                    <div
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0 border',
                        isActive
                          ? 'bg-slate-900 text-slate-300 border-slate-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      )}
                    >
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{plan.badge}</span>
                    </div>
                  )}
                </div>

                {/* Subtitle / Toggle */}
                {plan.hasToggle && isActive ? (
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-900/90 border border-slate-800 mb-3 text-[11px]">
                    <span className="text-slate-300 font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-400" />
                      Instant Payout
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPayoutToggle(!payoutToggle);
                      }}
                      className="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-blue-600"
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out',
                          payoutToggle ? 'translate-x-3' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                ) : (
                  <p
                    className={cn(
                      'text-[11px] font-normal mb-3 truncate',
                      isActive ? 'text-slate-400' : 'text-slate-500'
                    )}
                  >
                    {plan.subtitle}
                  </p>
                )}

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span
                    className={cn(
                      'text-3xl sm:text-4xl font-black tracking-tight',
                      isActive ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.priceUnit && (
                    <span
                      className={cn(
                        'text-[11px] font-normal',
                        isActive ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      {plan.priceUnit}
                    </span>
                  )}
                </div>

                {/* Target Audience */}
                <p
                  className={cn(
                    'text-[11px] leading-snug mb-4 h-8 flex items-center',
                    isActive ? 'text-slate-400' : 'text-slate-500'
                  )}
                >
                  {plan.targetAudience}
                </p>

                {/* CTA Button */}
                <Link
                  href={plan.buttonHref}
                  onClick={(e) => e.stopPropagation()}
                  className="block mb-4 relative z-20"
                >
                  <button
                    type="button"
                    className={cn(
                      'w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer',
                      isActive
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                        : 'border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                    )}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </Link>

                {/* Divider */}
                <div
                  className={cn(
                    'h-px w-full mb-4',
                    isActive ? 'bg-slate-800/80' : 'bg-slate-100'
                  )}
                />

                {/* Concise Feature Checklist */}
                <ul className="space-y-2 text-[11px]">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check
                        className={cn(
                          'w-3.5 h-3.5 shrink-0',
                          isActive ? 'text-blue-400' : 'text-slate-700'
                        )}
                      />
                      <span
                        className={cn(
                          'truncate',
                          isActive ? 'text-slate-300' : 'text-slate-600'
                        )}
                      >
                        {feature.text}
                      </span>

                      {feature.isNew && (
                        <span
                          className={cn(
                            'text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ml-auto shrink-0',
                            isActive
                              ? 'bg-blue-500/25 text-blue-300 border border-blue-400/30'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          )}
                        >
                          NEW
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GatheringTypesComparison;
