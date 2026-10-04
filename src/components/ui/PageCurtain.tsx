'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Calendar } from 'lucide-react';

interface PageCurtainContextType {
  triggerCurtain: (callback?: () => void) => void;
  isCurtainActive: boolean;
}

const PageCurtainContext = createContext<PageCurtainContextType>({
  triggerCurtain: () => {},
  isCurtainActive: false,
});

export const usePageCurtain = () => useContext(PageCurtainContext);

export interface PageCurtainProps {
  children?: React.ReactNode;
}

export const PageCurtainProvider: React.FC<PageCurtainProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  const triggerCurtain = (callback?: () => void) => {
    setIsActive(true);
    setTimeout(() => {
      if (callback) callback();
      setTimeout(() => {
        setIsActive(false);
      }, 500);
    }, 450);
  };

  // Brief initial page load entrance
  useEffect(() => {
    setIsActive(true);
    const timer = setTimeout(() => setIsActive(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <PageCurtainContext.Provider value={{ triggerCurtain, isCurtainActive: isActive }}>
      {children}
      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Primary Planora Brand Layer (Deep Slate) */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-[#0F172A] flex items-center justify-center"
            >
              {/* Center Planora Brand Glow & Monogram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Plan<span className="text-[#6366F1]">ora</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Secondary Accent Layer (Vibrant Indigo-Violet Slanted Lip) */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
              className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#6366F1] opacity-40 mix-blend-overlay pointer-events-none"
            />
          </div>
        )}
      </AnimatePresence>
    </PageCurtainContext.Provider>
  );
};

export default PageCurtainProvider;
