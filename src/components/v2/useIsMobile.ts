'use client';

import { useSyncExternalStore } from 'react';

/** Matches the app's single mobile/tablet breakpoint (globals.css uses the
 * same 860px cutoff for the hamburger nav, stacked About cards, etc.). */
const QUERY = '(max-width: 860px)';

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * True below the app's mobile/tablet breakpoint. SSR and first paint assume
 * desktop so server and client markup match; the real value resolves on the
 * client right after hydration (same pattern as `usePerfTier`).
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
