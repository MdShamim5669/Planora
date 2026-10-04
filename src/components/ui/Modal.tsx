'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog card */}
      <div
        className={cn(
          'relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border p-6 z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-foreground p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {title && <h2 className="text-xl font-bold text-foreground pr-8">{title}</h2>}
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};
