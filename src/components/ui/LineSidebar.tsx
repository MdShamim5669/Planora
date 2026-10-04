'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import './LineSidebar.css';

export type FalloffType = 'linear' | 'smooth' | 'sharp';
export type LineSidebarItem = string | { label: string; href?: string };

const FALLOFF_CURVES: Record<FalloffType, (p: number) => number> = {
  linear: (p: number) => p,
  smooth: (p: number) => p * p * (3 - 2 * p),
  sharp: (p: number) => p * p * p,
};

const DEFAULT_ITEMS: LineSidebarItem[] = [
  'Overview',
  'Components',
  'Animations',
  'Backgrounds',
  'Showcase',
  'Playground',
  'Templates',
  'Changelog',
  'Community',
  'Resources',
  'Documentation',
  'Support',
];

export interface LineSidebarProps {
  /** Array of labels or { label, href } entries rendered as sidebar */
  items?: LineSidebarItem[];
  /** Color items and markers shift toward as cursor gets close */
  accentColor?: string;
  /** Resting color of item labels */
  textColor?: string;
  /** Resting color of leading marker lines */
  markerColor?: string;
  /** Show the zero-padded index before each label */
  showIndex?: boolean;
  /** Show marker lines (and short ticks) beside each item */
  showMarker?: boolean;
  /** Vertical distance in pixels within which cursor influences an item */
  proximityRadius?: number;
  /** Maximum horizontal shift in pixels the label slides at full proximity */
  maxShift?: number;
  /** Curve mapping cursor distance to proximity effect */
  falloff?: FalloffType;
  /** Length in pixels of the marker line */
  markerLength?: number;
  /** Gap in pixels between labels and markers */
  markerGap?: number;
  /** Length of in-between ticks as a fraction of markerLength */
  tickScale?: number;
  /** When true, in-between ticks also grow with cursor proximity */
  scaleTick?: boolean;
  /** Vertical gap between items in pixels */
  itemGap?: number;
  /** Font size of labels in rem */
  fontSize?: number;
  /** Transition duration in milliseconds for proximity response */
  smoothing?: number;
  /** Index of item selected on mount */
  defaultActive?: number | null;
  /** Called when an item is clicked */
  onItemClick?: (index: number, label: string) => void;
  /** Additional CSS classes for outer wrapper */
  className?: string;
}

export const LineSidebar: React.FC<LineSidebarProps> = ({
  items = DEFAULT_ITEMS,
  accentColor = '#4F46E5',
  textColor = '#64748B',
  markerColor = '#CBD5E1',
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 20,
  falloff = 'smooth',
  markerLength = 40,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 16,
  fontSize = 0.95,
  smoothing = 100,
  defaultActive = null,
  onItemClick,
  className = '',
}) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const activeRef = useRef<number | null>(defaultActive);
  const smoothingRef = useRef<number>(smoothing);
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultActive);

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Single rAF loop that eases every item's --effect toward its target using
  // frame-rate independent exponential smoothing.
  const runFrame = useCallback(
    (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const tau = Math.max(smoothingRef.current, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      let moving = false;
      const itemsList = itemRefs.current;
      for (let i = 0; i < itemsList.length; i++) {
        const el = itemsList[i];
        if (!el) continue;
        const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
        const cur = currentRef.current[i] || 0;
        const next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        currentRef.current[i] = value;
        el.style.setProperty('--effect', value.toFixed(4));
        if (!settled) moving = true;
      }

      rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
    },
    []
  );

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }

    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const itemsList = itemRefs.current;
      for (let i = 0; i < itemsList.length; i++) {
        const el = itemsList[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop]
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      setActiveIndex(index);
      onItemClick?.(index, label);
    },
    [onItemClick]
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    []
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={
        {
          '--accent-color': accentColor,
          '--text-color': textColor,
          '--marker-color': markerColor,
          '--marker-length': `${markerLength}px`,
          '--marker-gap': `${markerGap}px`,
          '--tick-scale': tickScale,
          '--max-shift': `${maxShift}px`,
          '--item-gap': `${itemGap}px`,
          '--font-size': `${fontSize}rem`,
          '--smoothing': `${smoothing}ms`,
        } as React.CSSProperties
      }
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((item, index) => {
          const label = typeof item === 'string' ? item : item.label;
          const href = typeof item === 'string' ? undefined : item.href;

          const content = (
            <span className="line-sidebar__label">
              {showIndex && (
                <span className="line-sidebar__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              <span className="line-sidebar__text">{label}</span>
            </span>
          );

          return (
            <li
              key={`${label}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="line-sidebar__item"
              aria-current={activeIndex === index ? 'true' : undefined}
              onClick={() => handleClick(index, label)}
            >
              {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
              {href ? (
                <Link href={href} className="line-sidebar__link">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default LineSidebar;
