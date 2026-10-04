'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

export interface HoldToConfirmProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onConfirm: () => void;
  holdDuration?: number; // duration in ms, default 1500
  label?: string;
  confirmedLabel?: string;
  variant?: 'primary' | 'danger' | 'outline';
  icon?: React.ReactNode;
}

export const HoldToConfirm: React.FC<HoldToConfirmProps> = ({
  onConfirm,
  holdDuration = 1500,
  label = 'Hold to Confirm',
  confirmedLabel = 'Confirmed!',
  variant = 'primary',
  icon,
  className,
  disabled,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (disabled || isCompleted) return;
    setIsHolding(true);
    controls.start({
      width: '100%',
      transition: { duration: holdDuration / 1000, ease: 'linear' },
    });

    timerRef.current = setTimeout(() => {
      setIsCompleted(true);
      setIsHolding(false);
      onConfirm();
      setTimeout(() => {
        setIsCompleted(false);
        controls.set({ width: '0%' });
      }, 2000);
    }, holdDuration);
  };

  const cancelHold = () => {
    if (isCompleted) return;
    setIsHolding(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    controls.start({
      width: '0%',
      transition: { duration: 0.2, ease: 'easeOut' },
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const variantStyles = {
    primary: {
      btn: 'bg-white text-slate-800 border-indigo-200 hover:border-indigo-400 shadow-sm',
      progress: 'bg-gradient-to-r from-indigo-600 to-indigo-500',
      activeText: 'text-white',
    },
    danger: {
      btn: 'bg-white text-rose-700 border-rose-200 hover:border-rose-400 shadow-sm',
      progress: 'bg-gradient-to-r from-rose-600 to-rose-500',
      activeText: 'text-white',
    },
    outline: {
      btn: 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400',
      progress: 'bg-slate-800',
      activeText: 'text-white',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <motion.button
      type="button"
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl border text-sm font-semibold select-none overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed',
        currentVariant.btn,
        className
      )}
    >
      {/* Background Animated Progress Bar */}
      <motion.div
        initial={{ width: '0%' }}
        animate={controls}
        className={cn('absolute left-0 top-0 bottom-0 pointer-events-none', currentVariant.progress)}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {isCompleted ? (
          <>
            <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
            <span className="text-emerald-700 font-bold">{confirmedLabel}</span>
          </>
        ) : (
          <>
            {isHolding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              icon
            )}
            <span className={cn(isHolding ? 'font-bold' : '')}>
              {isHolding ? 'Keep holding...' : label}
            </span>
          </>
        )}
      </span>
    </motion.button>
  );
};

export default HoldToConfirm;
