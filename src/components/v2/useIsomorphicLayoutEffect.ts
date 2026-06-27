'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — avoids React's
 * SSR warning while still letting GSAP set its initial (hidden) state before the
 * browser paints, so reveals never flash their final frame first.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
