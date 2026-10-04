'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, Globe, ArrowRight, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

// Generate deterministic thematic gradient covers based on event title
function getCoverTheme(title: string) {
  const t = title.toLowerCase();
  if (t.includes('design') || t.includes('ui/ux')) {
    return {
      gradient: 'from-purple-900 via-indigo-950 to-pink-950',
      badge: '🎨 Design',
      accent: 'from-purple-500 to-pink-500',
    };
  }
  if (t.includes('hack') || t.includes('open source')) {
    return {
      gradient: 'from-emerald-950 via-slate-900 to-teal-950',
      badge: '⚡ Hackathon',
      accent: 'from-emerald-500 to-teal-500',
    };
  }
  if (t.includes('cyber') || t.includes('security')) {
    return {
      gradient: 'from-slate-950 via-blue-950 to-slate-900',
      badge: '🛡️ Security',
      accent: 'from-blue-500 to-cyan-500',
    };
  }
  if (t.includes('summit') || t.includes('leadership')) {
    return {
      gradient: 'from-indigo-950 via-slate-900 to-purple-950',
      badge: '🚀 Summit',
      accent: 'from-amber-500 to-orange-500',
    };
  }
  if (t.includes('flutter') || t.includes('mobile')) {
    return {
      gradient: 'from-blue-950 via-indigo-950 to-cyan-950',
      badge: '📱 Mobile',
      accent: 'from-cyan-500 to-blue-500',
    };
  }
  return {
    gradient: 'from-slate-900 via-indigo-950 to-slate-950',
    badge: '💻 Tech Meetup',
    accent: 'from-indigo-500 to-purple-500',
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const feeNumber = Number(event.fee);
  const isFree = feeNumber === 0;
  const isOnline = !!event.eventLink && !event.venue;
  const theme = getCoverTheme(event.title);

  return (
    <div
      className={`group relative flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 ${
        featured ? 'ring-2 ring-indigo-500/30 border-indigo-300' : ''
      }`}
    >
      {/* Top Banner Cover */}
      <div className={`relative w-full h-44 bg-gradient-to-br ${theme.gradient} overflow-hidden shrink-0`}>
        {/* Render Cloudinary banner image if present */}
        {(event.bannerImage || event.imageUrl || event.coverImage) ? (
          <img
            src={event.bannerImage || event.imageUrl || event.coverImage || ''}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Subtle geometric pattern overlay for fallback gradient */
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <Badge variant={event.visibility === 'PUBLIC' ? 'public' : 'private'} />
          <Badge
            variant={isFree ? 'free' : 'paid'}
            amount={!isFree ? feeNumber : undefined}
          />
        </div>

        {/* Theme Category Chip */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur-md text-white border border-white/20">
            {theme.badge}
          </span>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs z-10">
          <span className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            {formatDate(event.eventDate)}
          </span>

          {event.isFeatured && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
              <Sparkles className="w-2.5 h-2.5 fill-current" /> Featured
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/events/${event.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 tracking-tight leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.description || 'Join this curated event to connect, learn, and collaborate with industry leaders and peers.'}
          </p>
        </div>

        {/* Location meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          {isOnline ? (
            <>
              <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate font-medium text-emerald-700">Online Interactive Event</span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium text-slate-600">{event.venue || 'Venue in Dhaka'}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={event.organizer?.name || 'Organizer'} size="xs" />
          <div className="min-w-0">
            <span className="block text-xs font-semibold text-slate-800 truncate">
              {event.organizer?.name || 'Organizer'}
            </span>
          </div>
        </div>

        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-all text-xs"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
