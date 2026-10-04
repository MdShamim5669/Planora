'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DecryptedTextProps {
  /** The final text to reveal */
  text: string;
  /** Speed of the scramble effect in milliseconds */
  speed?: number;
  /** Maximum number of scramble iterations per character */
  maxIterations?: number;
  /** Whether characters resolve sequentially */
  sequential?: boolean;
  /** Direction from which characters reveal */
  revealDirection?: 'start' | 'end' | 'center';
  /** Characters to use during scrambling */
  characters?: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Custom CSS classes for currently scrambled characters */
  encryptedClassName?: string;
  /** Animate when entering viewport ('view') or on hover ('hover') */
  animateOn?: 'view' | 'hover';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = 'text-indigo-400 opacity-75 font-mono',
  animateOn = 'view',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const hasAnimatedRef = useRef<boolean>(false);

  const getRandomChar = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const length = text.length;
    const iterations = new Array(length).fill(0);
    const resolved = new Array(length).fill(false);

    const interval = setInterval(() => {
      let allResolved = true;

      const nextChars = text.split('').map((char, index) => {
        if (char === ' ') return ' ';

        // Sequential resolution ordering
        let canResolve = false;
        if (!sequential) {
          canResolve = true;
        } else if (revealDirection === 'start') {
          canResolve = index === 0 || resolved[index - 1];
        } else if (revealDirection === 'end') {
          canResolve = index === length - 1 || resolved[index + 1];
        } else {
          // center
          const mid = Math.floor(length / 2);
          const dist = Math.abs(index - mid);
          canResolve = dist === 0 || resolved[index - 1] || resolved[index + 1];
        }

        if (canResolve && iterations[index] >= maxIterations) {
          resolved[index] = true;
          return char;
        }

        if (canResolve) {
          iterations[index]++;
        }

        allResolved = false;
        return getRandomChar();
      });

      setDisplayText(nextChars.join(''));

      if (allResolved || resolved.every(Boolean)) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, sequential, revealDirection, getRandomChar, isScrambling]);

  useEffect(() => {
    if (animateOn === 'view' && isInView && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      scramble();
    }
  }, [isInView, animateOn, scramble]);

  return (
    <span
      ref={containerRef}
      className={cn('inline-block', className)}
      onMouseEnter={animateOn === 'hover' ? scramble : undefined}
      aria-label={text}
    >
      <span aria-hidden="true">
        {displayText.split('').map((char, i) => {
          const isDecrypted = char === text[i];
          return (
            <span
              key={i}
              className={cn(
                'inline-block transition-colors duration-150',
                !isDecrypted && encryptedClassName
              )}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
};

export default DecryptedText;
