'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import { Event } from '@/types';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import Button from './Button';

export interface EventCardProps {
  event: Event;
  showHost?: boolean;
  showAction?: boolean;
  actionText?: string;
  variant?: 'grid' | 'horizontal';
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  showHost = true,
  showAction = true,
  actionText = 'View Details',
  variant = 'grid',
  className,
}) => {
  const isFree = Number(event.fee) === 0;
  const isPrivate = event.type === 'PRIVATE';
  const participantCount = event._count?.participations || 0;
  const capacity = event.capacity || 0;
  const percentFilled = capacity > 0 ? Math.min(100, Math.round((participantCount / capacity) * 100)) : 0;

  return (
    <div
      className={cn(
        'group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1 transition-all duration-300 flex flex-col',
        variant === 'horizontal' && 'md:flex-row',
        className
      )}
    >
      {/* Cover image or sleek gradient banner */}
      <div
        className={cn(
          'relative w-full h-48 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 overflow-hidden shrink-0',
          variant === 'horizontal' && 'md:w-64 md:h-full min-h-[200px]'
        )}
      >
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-end p-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-900 to-black">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <span className="relative text-white/40 text-xs font-mono tracking-widest uppercase">
              Planora Event
            </span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant={isPrivate ? 'private' : 'public'} />
          <Badge
            variant={isFree ? 'free' : 'paid'}
            amount={!isFree ? Number(event.fee) : undefined}
          />
        </div>

        {/* Featured Ribbon if applicable */}
        {event.isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Location meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2.5">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1 max-w-[150px] truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/events/${event.id}`}>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Capacity Progress Bar */}
          {capacity > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  {participantCount} of {capacity} spots
                </span>
                <span className="font-semibold text-slate-700">{percentFilled}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    percentFilled >= 90
                      ? 'bg-rose-500'
                      : percentFilled >= 70
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  )}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer: Host & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between gap-3">
          {showHost && event.host ? (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar
                src={event.host.avatarUrl}
                name={event.host.name}
                size="sm"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {event.host.name}
                </p>
                <p className="text-[10px] text-slate-400">Host</p>
              </div>
            </div>
          ) : (
            <div className="text-xs font-semibold text-slate-800">
              {isFree ? (
                <span className="text-emerald-600 font-bold">Free</span>
              ) : (
                <span>{formatCurrency(Number(event.fee))}</span>
              )}
            </div>
          )}

          {showAction && (
            <Link href={`/events/${event.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {actionText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.displayName = 'EventCard';
export default EventCard;
