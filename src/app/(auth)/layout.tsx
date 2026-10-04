import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            Plan<span className="text-primary">ora</span>
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
