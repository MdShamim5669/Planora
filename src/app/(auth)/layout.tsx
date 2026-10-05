import React from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50/70 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. Luminous Ambient Lighting & Radial Aura */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 2. Delicate Geometric Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f10c_1px,transparent_1px),linear-gradient(to_bottom,#6366f10c_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
              <Calendar className="w-7 h-7" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Plan<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ora</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Sparkles className="w-2.5 h-2.5 fill-current" /> Event OS
            </span>
          </div>
        </Link>
      </div>

      {/* Main Glassmorphic Card Frame */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10 px-4 sm:px-0">
        <div className="relative">
          {/* Subtle Ambient Glow Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/15 rounded-[2rem] blur-lg pointer-events-none" />

          {/* Actual Card */}
          <div className="relative bg-white/95 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl shadow-indigo-900/10 rounded-3xl border border-slate-200/90">
            {children}
          </div>
        </div>

        {/* Security & Trust Footer */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
