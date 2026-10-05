'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag, Lock, Globe } from 'lucide-react';
import { AssistantEventCardData } from '@/lib/assistantApi';

interface AssistantEventCardProps {
  event: AssistantEventCardData;
}

export const AssistantEventCard: React.FC<AssistantEventCardProps> = ({ event }) => {
  const isFree = Number(event.fee) === 0;
  
  // Format date nicely
  let formattedDate = event.eventDate;
  try {
    const d = new Date(event.eventDate);
    formattedDate = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch (err) {
    // fallback to raw string
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OWNER':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">Your Event</span>;
      case 'APPROVED':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Joined</span>;
      case 'PENDING':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Requested</span>;
      case 'REJECTED':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Rejected</span>;
      case 'BANNED':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Banned</span>;
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 text-left">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isFree
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              }`}
            >
              {isFree ? 'Free' : `${event.fee} BDT`}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {event.visibility === 'PUBLIC' ? (
                <>
                  <Globe className="w-2.5 h-2.5" /> Public
                </>
              ) : (
                <>
                  <Lock className="w-2.5 h-2.5" /> Private
                </>
              )}
            </span>
          </div>
          {event.yourStatus && event.yourStatus !== 'NONE' && getStatusBadge(event.yourStatus)}
        </div>

        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.title}
        </h4>

        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.organizer.name}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white transition-all duration-200"
        >
          <span>View event</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
