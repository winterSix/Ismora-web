'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface RevealOptions {
  /** Vertical offset (px) the targets rise from. */
  y?: number;
  /** Optional scale to grow from (e.g. 0.92). */
  scale?: number;
  /** Optional blur (px) to clear from. */
  blur?: number;
  duration?: number;
  /** Gap between successive targets. */
  stagger?: number;
  /** Delay before the timeline starts. */
  delay?: number;
  ease?: string;
}

/**
 * Plays a one-shot, staggered GSAP entrance over every `[data-reveal]` element
 * inside the returned scope the first time `active` flips true. Because the
 * panel stays mounted (the parent only toggles its opacity), the reveal fires
 * exactly once — when the section actually comes on screen.
 *
 * Attach the returned ref to a wrapper, and mark the elements you want revealed
 * with `data-reveal`.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  opts: RevealOptions = {}
) {
  const scope = useRef<T>(null);
  const played = useRef(false);
  const {
    y = 28,
    scale,
    blur,
    duration = 0.7,
    stagger = 0.12,
    delay = 0,
    ease = 'power3.out',
  } = opts;

  useIsomorphicLayoutEffect(() => {
    if (!active || played.current || !scope.current) return;
    played.current = true;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (!targets.length) return;

      const fromVars: gsap.TweenVars = { opacity: 0, y };
      const toVars: gsap.TweenVars = { opacity: 1, y: 0, duration, ease, stagger, delay };
      if (scale != null) {
        fromVars.scale = scale;
        toVars.scale = 1;
      }
      if (blur != null) {
        fromVars.filter = `blur(${blur}px)`;
        toVars.filter = 'blur(0px)';
        toVars.clearProps = 'filter';
      }

      gsap.set(targets, fromVars);
      gsap.to(targets, toVars);
    }, scope);

    return () => ctx.revert();
  }, [active]);

  return scope;
}
