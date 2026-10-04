import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null, formatPattern = 'MMM d, yyyy h:mm a'): string {
  if (!dateString) return 'Date TBD';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatPattern);
  } catch {
    return 'Invalid Date';
  }
}

export function formatCurrency(amount: number | string | undefined | null): string {
  const num = Number(amount || 0);
  return `${num.toLocaleString()} BDT`;
}
