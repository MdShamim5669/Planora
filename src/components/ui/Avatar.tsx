'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  variant?: 'circle' | 'rounded';
}

const colorPalette = [
  'from-indigo-500 to-purple-600 text-white',
  'from-blue-500 to-cyan-600 text-white',
  'from-emerald-500 to-teal-600 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-rose-500 to-pink-600 text-white',
  'from-violet-500 to-fuchsia-600 text-white',
];

function getGradient(name?: string) {
  if (!name) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  variant = 'circle',
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  const initials = getInitials(name);
  const gradient = getGradient(name);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 font-medium select-none shadow-xs',
        variant === 'circle' ? 'rounded-full' : 'rounded-xl',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setImageError(true)}
          className={cn(
            'w-full h-full object-cover',
            variant === 'circle' ? 'rounded-full' : 'rounded-xl'
          )}
        />
      ) : initials ? (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center bg-gradient-to-tr',
            gradient,
            variant === 'circle' ? 'rounded-full' : 'rounded-xl'
          )}
        >
          {initials}
        </div>
      ) : (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center bg-slate-100 text-slate-400',
            variant === 'circle' ? 'rounded-full' : 'rounded-xl'
          )}
        >
          <User className="w-1/2 h-1/2" />
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white',
            statusColors[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
export default Avatar;
