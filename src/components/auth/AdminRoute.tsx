'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-muted">Checking administrator privileges...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
