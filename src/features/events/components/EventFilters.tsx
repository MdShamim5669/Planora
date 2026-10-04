'use client';

import React, { useRef } from 'react';
import {
  Search,
  RotateCcw,
  Sparkles,
  Globe,
  CreditCard,
  Lock,
  ShieldCheck,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface EventFilterState {
  search: string;
  type: string;
}

interface EventFiltersProps {
  filters: EventFilterState;
  onChange: (newFilters: EventFilterState) => void;
  onReset: () => void;
  totalResults?: number;
}

interface FilterChip {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'All Gatherings', value: '', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'public-free', label: 'Public Free', value: 'PUBLIC_FREE', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'public-paid', label: 'Public Paid', value: 'PUBLIC_PAID', icon: <CreditCard className="w-3.5 h-3.5" /> },
  { id: 'private-free', label: 'Private Free', value: 'PRIVATE_FREE', icon: <Lock className="w-3.5 h-3.5" /> },
  { id: 'private-paid', label: 'Private Paid', value: 'PRIVATE_PAID', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = Boolean(filters.search || filters.type);

  const handleChipClick = (value: string) => {
    onChange({
      ...filters,
      type: filters.type === value ? '' : value,
    });
  };

  const handleClearSearch = () => {
    onChange({ ...filters, search: '' });
    inputRef.current?.focus();
  };

  return (
    <div className="relative mb-10">
      {/* Subtle Ambient Backlight Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl pointer-events-none -z-10" />

      {/* Main Luxury Filter Card Frame */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-4">
        {/* Top Row: Search Input & Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Enhanced Search Field with Inset Glass Effect */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search className="w-4 h-4" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Search events by title, organizer, or keywords..."
              className="w-full pl-10 pr-10 py-3 bg-slate-50/90 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
            />

            {/* Clear Search "X" Button */}
            {filters.search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Selector Dropdown with Custom Icon */}
          <div className="relative md:w-56 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>

            <select
              value={filters.type}
              onChange={(e) => onChange({ ...filters, type: e.target.value })}
              className="w-full pl-9 pr-9 py-3 text-sm font-semibold bg-slate-50/90 hover:bg-slate-50 focus:bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl appearance-none outline-none transition-all cursor-pointer"
            >
              <option value="">All Formats</option>
              <option value="PUBLIC_FREE">Public (Free)</option>
              <option value="PUBLIC_PAID">Public (Paid)</option>
              <option value="PRIVATE_FREE">Private (Free)</option>
              <option value="PRIVATE_PAID">Private (Paid)</option>
            </select>

            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={onReset}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-2xl transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </motion.button>
          )}
        </div>

        {/* Bottom Row: Quick Filter Category Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter by:
            </span>

            {FILTER_CHIPS.map((chip) => {
              const isSelected = filters.type === chip.value;

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleChipClick(chip.value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none',
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02]'
                      : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 hover:border-slate-300'
                  )}
                >
                  <span className={cn(isSelected ? 'text-indigo-400' : 'text-slate-500')}>
                    {chip.icon}
                  </span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results Badge */}
          {typeof totalResults === 'number' && (
            <div className="text-xs font-medium text-slate-500">
              Found <span className="font-bold text-slate-900">{totalResults}</span> events
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
