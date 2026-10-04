'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'line' | 'segmented';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className,
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex p-1 bg-slate-100/80 backdrop-blur-xs rounded-xl border border-slate-200/60',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 select-none',
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px]',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <div className={cn('border-b border-slate-200 flex space-x-6', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative pb-3 text-sm font-semibold transition-all duration-150 inline-flex items-center gap-2 border-b-2 -mb-[1px]',
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-600 font-medium">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: pills
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 select-none border',
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

Tabs.displayName = 'Tabs';
export default Tabs;
