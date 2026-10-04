'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, Radio } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';

export interface HeroParallaxLayersProps {
  imageSrc?: string;
  title?: string;
  date?: string;
  location?: string;
  badge?: string;
  eventId?: string;
  fee?: number | string;
  visibility?: string;
  attendeeCount?: string;
  className?: string;
}

export const HeroParallaxLayers: React.FC<HeroParallaxLayersProps> = ({
  imageSrc = '/images/hero-event.jpg',
  title = 'Tech Summit Bangladesh 2026',
  date = 'Oct 19, 2026',
  location = 'BICC Auditorium, Dhaka',
  badge = 'Featured Stage',
  eventId,
  fee = 1500,
  visibility = 'PUBLIC',
  attendeeCount = '1,200+',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt / 3D tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D Card Rotation based on mouse position
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ['-7deg', '7deg']);

  // Parallax offsets for distinct layers (higher depth = moves more)
  const layerGlowX = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const layerGlowY = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12]);

  const layerImageX = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);
  const layerImageY = useTransform(smoothMouseY, [-0.5, 0.5], [-6, 6]);

  const layerChipsX = useTransform(smoothMouseX, [-0.5, 0.5], [14, -14]);
  const layerChipsY = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);

  const layerCardX = useTransform(smoothMouseX, [-0.5, 0.5], [20, -20]);
  const layerCardY = useTransform(smoothMouseY, [-0.5, 0.5], [18, -18]);

  // Scroll Parallax Integration
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
  });

  const scrollImageY = useTransform(smoothScroll, [0, 1], ['0%', '12%']);
  const scrollCardY = useTransform(smoothScroll, [0, 1], ['0%', '-15%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isFree = Number(fee) === 0;
  const formattedFee = isFree ? 'Free' : `PAID ${Number(fee).toLocaleString()} BDT`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative w-full select-none perspective-[1200px]', className)}
    >
      {/* Layer 0: Ambient Multi-tone Parallax Halo (-40px depth) */}
      <motion.div
        style={{
          x: layerGlowX,
          y: layerGlowY,
        }}
        className="absolute -inset-6 bg-gradient-to-tr from-indigo-500/30 via-purple-500/25 to-pink-500/20 rounded-[36px] blur-2xl pointer-events-none -z-10 transform-gpu"
      />

      {/* Main 3D Card Shell with Perspective */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-3xl p-2.5 bg-gradient-to-b from-indigo-500/35 via-white/85 to-slate-200/90 shadow-2xl shadow-indigo-500/20 border border-white/85 backdrop-blur-xl group transition-shadow duration-300 hover:shadow-indigo-500/30"
      >
        {/* Layer 1: Base Viewport & Image Canvas */}
        <div className="relative rounded-[22px] overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-[16/11]">
          {/* Parallax Image Canvas */}
          <motion.div
            style={{
              x: layerImageX,
              y: scrollImageY,
              scale: 1.05,
            }}
            className="w-full h-full transform-gpu"
          >
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </motion.div>

          {/* Vignette & Cinematic Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

          {/* Layer 2: Floating Chips with Opposite Parallax (+35px depth) */}
          {/* Top-Left: Live Attendees Pill */}
          <motion.div
            style={{
              x: layerChipsX,
              y: layerChipsY,
              translateZ: 35,
            }}
            className="absolute top-4 left-4 z-20 pointer-events-none transform-gpu"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg shadow-black/40">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>{attendeeCount} Attending</span>
            </div>
          </motion.div>

          {/* Top-Right: Featured Badge */}
          <motion.div
            style={{
              x: layerChipsX,
              y: layerChipsY,
              translateZ: 40,
            }}
            className="absolute top-4 right-4 z-20 pointer-events-none transform-gpu"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{badge}</span>
            </div>
          </motion.div>

          {/* Middle Floating Pill: Location */}
          <motion.div
            style={{
              x: layerChipsX,
              y: layerChipsY,
              translateZ: 25,
            }}
            className="absolute bottom-24 left-4 z-20 hidden sm:block pointer-events-none transform-gpu"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/20 text-white/95 text-xs shadow-md">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{location}</span>
            </div>
          </motion.div>

          {/* Layer 3: Floating Interactive Ticket Pass (+60px depth) */}
          <motion.div
            style={{
              x: layerCardX,
              y: scrollCardY,
              translateZ: 60,
            }}
            className="absolute bottom-4 left-4 right-4 z-30 transform-gpu"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-2xl shadow-black/25 flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white hover:border-indigo-300">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {visibility}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      isFree
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    )}
                  >
                    {formattedFee}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Official Keynote · SSLCommerz Secured</span>
                </p>
              </div>

              <Link
                href={eventId ? `/events/${eventId}` : '/events'}
                className="shrink-0"
              >
                <Button
                  size="sm"
                  className="shadow-md shadow-indigo-500/25 text-xs px-4"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Join Event
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroParallaxLayers;
