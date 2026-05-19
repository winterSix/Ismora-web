'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  cubicBezier,
  type MotionValue,
} from 'framer-motion';
import {
  FEATURE_PANELS,
  PanelCopy,
  PanelMedia,
  type FeaturePanel,
} from './featureParts';
import { FeatureSection } from './FeatureSection';

const N = FEATURE_PANELS.length; // 3
const R = 0.18; // length of each cross-swap transition (in scroll progress)
const H = (1 - (N - 1) * R) / N; // length each panel rests centred

// Scroll-progress windows for each transition: [start, end]
const TRANS: [number, number][] = [];
for (let k = 0; k < N - 1; k++) {
  const s = (k + 1) * H + k * R;
  TRANS.push([s, s + R]);
}

const S = 90; // cross-swap slide distance, % of each half's width
const EASE = cubicBezier(0.42, 0, 0.2, 1); // smooth ease-in-out

/** Per-panel keyframes for the left half x, right half x, and opacity. */
function keyframes(i: number) {
  if (i === 0) {
    return {
      inp: [0, TRANS[0][0], TRANS[0][1]],
      lX: ['0%', '0%', `${S}%`],
      rX: ['0%', '0%', `-${S}%`],
      op: [1, 1, 0],
    };
  }
  if (i === N - 1) {
    const k = i - 1;
    return {
      inp: [TRANS[k][0], TRANS[k][1], 1],
      lX: [`-${S}%`, '0%', '0%'],
      rX: [`${S}%`, '0%', '0%'],
      op: [0, 1, 1],
    };
  }
  const ke = i - 1;
  const kx = i;
  return {
    inp: [TRANS[ke][0], TRANS[ke][1], TRANS[kx][0], TRANS[kx][1]],
    lX: [`-${S}%`, '0%', '0%', `${S}%`],
    rX: [`${S}%`, '0%', '0%', `-${S}%`],
    op: [0, 1, 1, 0],
  };
}

function PinnedPanel({
  panel,
  i,
  progress,
}: {
  panel: FeaturePanel;
  i: number;
  progress: MotionValue<number>;
}) {
  const { inp, lX, rX, op } = keyframes(i);
  const leftX = useTransform(progress, inp, lX, { ease: EASE });
  const rightX = useTransform(progress, inp, rX, { ease: EASE });
  const opacity = useTransform(progress, inp, op);
  const pointerEvents = useTransform(opacity, [0, 0.6, 1], [
    'none',
    'none',
    'auto',
  ]);
  const visibility = useTransform(opacity, [0, 0.015, 1], [
    'hidden',
    'visible',
    'visible',
  ]);

  const leftIsMedia = panel.imageSide === 'left';
  const media = <PanelMedia image={panel.image} imageAlt={panel.imageAlt} />;
  const copy = (
    <PanelCopy
      tag={panel.tag}
      title={panel.title}
      paragraph={panel.paragraph}
      items={panel.items}
    />
  );

  return (
    <motion.div
      style={{ opacity, visibility, zIndex: i, pointerEvents }}
      className="absolute inset-0 flex items-center"
    >
      <div className="shell grid w-full grid-cols-2 items-center gap-[100px]">
        <motion.div
          style={{ x: leftX, willChange: 'transform' }}
          className="flex justify-center"
        >
          {leftIsMedia ? media : copy}
        </motion.div>
        <motion.div
          style={{ x: rightX, willChange: 'transform' }}
          className="flex justify-center"
        >
          {leftIsMedia ? copy : media}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Mounted only when the pinned experience is active, so `useScroll` always
 * initialises with its target element present in the DOM.
 */
function PinnedFeatures() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // Ease the raw scroll progress through a spring so the cross-swap glides
  // smoothly toward the scroll position instead of snapping 1:1 with wheel
  // ticks — this is what gives the buttery "smooth scrolling" feel.
  // Tight spring: smooths scroll jitter but responds almost immediately so
  // there's no perceptible input lag when you reach / scroll the section.
  const progress = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 46,
    mass: 0.18,
    restDelta: 0.001,
  });

  return (
    <div
      ref={wrapRef}
      id="insights"
      style={{ height: `${N * 100}vh`, background: '#0e0e0e' }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: '#0e0e0e' }}
      >
        {FEATURE_PANELS.map((p, i) => (
          <PinnedPanel key={p.id} panel={p} i={i} progress={progress} />
        ))}
      </div>
    </div>
  );
}

export function FeatureScroll() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () =>
      setEnabled(
        window.matchMedia('(min-width: 1024px)').matches &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mobile / reduced-motion: fall back to the stacked sections.
  if (!enabled || prefersReduced) {
    return (
      <>
        {FEATURE_PANELS.map((p) => (
          <FeatureSection key={p.id} {...p} />
        ))}
      </>
    );
  }

  return <PinnedFeatures />;
}
