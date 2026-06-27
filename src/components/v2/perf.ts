'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   Device performance tiering.

   The site stacks many WebGL canvases and a heavy live hero.
   On integrated / low-power GPUs that combination drops frames,
   so we detect a rough capability tier once on the client and
   scale the expensive knobs (pixel ratio, antialias, terrain
   density) to match. Capable machines are unaffected.
   ============================================================ */

export type PerfTier = {
  /** Coarse bucket. 'low' machines also get the static hero fallback. */
  level: 'low' | 'high';
  /** [min, max] device-pixel-ratio cap handed to each <Canvas>. */
  dpr: [number, number];
  /** Whether MSAA is worth its cost on this device. */
  antialias: boolean;
  /** Segment counts for the hero terrain plane (x, y). */
  terrain: [number, number];
  /** User asked the OS to minimise motion — drop the animated hero. */
  reducedMotion: boolean;
};

const HIGH: PerfTier = {
  level: 'high',
  dpr: [1, 1.75],
  antialias: true,
  terrain: [220, 135],
  reducedMotion: false,
};

const LOW: PerfTier = {
  level: 'low',
  dpr: [1, 1.25],
  antialias: false,
  terrain: [120, 75],
  reducedMotion: false,
};

/** Synchronous, best-effort capability probe. Client-only. */
function probe(): PerfTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return HIGH;

  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Heuristics that correlate with weak GPUs without a benchmark:
  //  • few logical cores (integrated laptops, low-end machines)
  //  • little reported device memory
  //  • coarse pointer (most phones/tablets) at small width
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const coarse =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const lowEnd = cores <= 4 || mem <= 4 || (coarse && window.innerWidth < 900);

  const base = lowEnd ? LOW : HIGH;
  return { ...base, reducedMotion };
}

// useSyncExternalStore needs a stable snapshot reference (it must return the
// same object until something actually changes), so the probe is memoised and
// only re-run when the reduced-motion preference flips.
let cachedTier: PerfTier | null = null;

function getSnapshot(): PerfTier {
  if (!cachedTier) cachedTier = probe();
  return cachedTier;
}

function getServerSnapshot(): PerfTier {
  return HIGH;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = () => {
    cachedTier = probe();
    onChange();
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/**
 * Returns the device tier. SSR and the first client paint use the HIGH default
 * so server and client markup match; the real tier is resolved on the client
 * immediately after hydration and stays in sync with the reduced-motion query.
 */
export function usePerfTier(): PerfTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
