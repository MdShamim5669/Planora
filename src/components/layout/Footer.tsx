'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LineSidebar } from '@/components/ui/LineSidebar';
import {
  Calendar,
  Heart,
  Github,
  Mail,
  ExternalLink,
  ShieldCheck,
  Code2,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  Globe,
  Linkedin,
  Instagram,
} from 'lucide-react';

const PLATFORM_NAV_ITEMS = [
  { label: 'Explore Events', href: '/events' },
  { label: 'Host an Event', href: '/dashboard/events' },
  { label: 'My Registrations', href: '/dashboard/participations' },
  { label: 'Invitations Inbox', href: '/dashboard/invitations' },
  { label: 'Payment History', href: '/dashboard/payments' },
  { label: 'User Profile', href: '/dashboard/profile' },
];

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const activeNavIndex = PLATFORM_NAV_ITEMS.findIndex(
    (item) => item.href === pathname
  );

  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-indigo-50/50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-100">
          {/* Column 1: Brand & Creator Profile (Span 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Plan<span className="text-indigo-600">ora</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              A secure, enterprise-ready event management platform for hosting and attending public, private, free, and paid events with automated SSLCommerz payments.
            </p>

            {/* Developer Card Badge */}
            <div className="pt-2">
              <div className="inline-flex flex-col p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-sm shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      MS
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">Md. Samim</h5>
                      <span className="text-[10px] text-slate-500">Full-Stack Engineer & Creator</span>
                    </div>
                  </div>

                  <a
                    href="https://mdsamim.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  >
                    <Globe className="w-2.5 h-2.5" />
                    <span>Portfolio</span>
                  </a>
                </div>

                {/* Social Icon Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-200/70 text-xs">
                  {/* Website */}
                  <a
                    href="https://mdsamim.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Portfolio Website"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-xs transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/md-samim5669/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0A66C2] hover:border-blue-300 hover:shadow-xs transition-all"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/MdShamim5669"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-400 hover:shadow-xs transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="https://x.com/MDSAMIMxq"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="X (Twitter)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-slate-400 hover:shadow-xs transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sh4mim.py/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram Profile"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#E4405F] hover:border-pink-300 hover:shadow-xs transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:Tamjisulislamsamim@gmail.com"
                    title="Send Email"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-xs transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Navigation (LineSidebar from React Bits) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Platform
            </h4>
            <LineSidebar
              items={PLATFORM_NAV_ITEMS}
              accentColor="#4F46E5"
              textColor="#64748B"
              markerColor="#CBD5E1"
              showIndex={true}
              showMarker={true}
              proximityRadius={75}
              maxShift={12}
              falloff="smooth"
              markerLength={24}
              markerGap={6}
              tickScale={0.5}
              scaleTick={true}
              itemGap={8}
              fontSize={0.875}
              smoothing={100}
              defaultActive={activeNavIndex >= 0 ? activeNavIndex : null}
              className="mt-1"
            />
          </div>

          {/* Column 3: Connect & Social Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-4">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Developer & Social
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://mdsamim.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  <span>Portfolio Web</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/md-samim5669/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-[#0A66C2] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A66C2]" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/MDSAMIMxq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-slate-950 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-slate-400 group-hover:fill-slate-950" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X / Twitter</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/sh4mim.py/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-[#E4405F] transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E4405F]" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MdShamim5669/Planora-Server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  <span>Planora Server Repo</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Architecture & Tech References */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-4">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              Stack & Security
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>SSLCommerz Hosted Checkout</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-500">
                <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Neon PostgreSQL (Serverless)</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Next.js 14 App Router</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-500">
                <Code2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>TanStack Query v5 + Axios</span>
              </li>
              <li className="pt-2 text-xs">
                <span className="text-slate-400">Security:</span>{' '}
                <span className="font-semibold text-slate-700">HS256 JWT & RBAC</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <p>© {currentYear} Planora Event Management Platform. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 font-medium text-slate-600">
              <span>Engineered with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>by</span>
              <a
                href="https://mdsamim.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
              >
                Md. Samim
              </a>
            </p>

            {/* Quick Micro-links in footer credit */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-slate-400">
              <a
                href="https://www.linkedin.com/in/md-samim5669/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com/MDSAMIMxq"
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="hover:text-slate-900 transition-colors"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/sh4mim.py/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="hover:text-[#E4405F] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/MdShamim5669"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="hover:text-slate-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
