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
// Holds are kept tiny so the S cross-swap is almost always in motion as you
// scroll — that's what makes the pinned section feel like it's responding to
// scroll rather than sitting frozen.
const H = 0.07; // brief rest each panel sits centred
const R = (1 - N * H) / (N - 1); // each cross-swap transition fills the rest

// Scroll-progress windows for each transition: [start, end]
const TRANS: [number, number][] = [];
for (let k = 0; k < N - 1; k++) {
  const s = (k + 1) * H + k * R;
  TRANS.push([s, s + R]);
}

const S = 90; // horizontal slide distance, % of each half's width
const A = 42; // vertical arc amplitude, % of each half's height (the "S" bend)
const EASE = cubicBezier(0.42, 0, 0.2, 1); // smooth ease-in-out

const mid = (k: number) => (TRANS[k][0] + TRANS[k][1]) / 2;

/** Per-panel keyframes for the left half x, right half x, and opacity. */
/**
 * S cross-swap: a half slides horizontally while arcing vertically through a
 * mid-transition point, so the outgoing and incoming trajectories trace an "S".
 * Left half bends one way, right half bends the opposite way.
 */
function keyframes(i: number) {
  if (i === 0) {
    // exits via transition 0
    const s = TRANS[0][0];
    const m = mid(0);
    const e = TRANS[0][1];
    return {
      inp: [0, s, m, e],
      lX: ['0%', '0%', `${S * 0.55}%`, `${S}%`],
      lY: ['0%', '0%', `${A}%`, '0%'],
      rX: ['0%', '0%', `-${S * 0.55}%`, `-${S}%`],
      rY: ['0%', '0%', `-${A}%`, '0%'],
      op: [1, 1, 0.55, 0],
    };
  }
  if (i === N - 1) {
    // enters via the last transition
    const k = i - 1;
    const s = TRANS[k][0];
    const m = mid(k);
    const e = TRANS[k][1];
    return {
      inp: [s, m, e, 1],
      lX: [`-${S}%`, `-${S * 0.55}%`, '0%', '0%'],
      lY: ['0%', `-${A}%`, '0%', '0%'],
      rX: [`${S}%`, `${S * 0.55}%`, '0%', '0%'],
      rY: ['0%', `${A}%`, '0%', '0%'],
      op: [0, 0.55, 1, 1],
    };
  }
  // middle panel: enters via transition (i-1), exits via transition i
  const ke = i - 1;
  const kx = i;
  return {
    inp: [
      TRANS[ke][0],
      mid(ke),
      TRANS[ke][1],
      TRANS[kx][0],
      mid(kx),
      TRANS[kx][1],
    ],
    lX: [
      `-${S}%`,
      `-${S * 0.55}%`,
      '0%',
      '0%',
      `${S * 0.55}%`,
      `${S}%`,
    ],
    lY: ['0%', `-${A}%`, '0%', '0%', `${A}%`, '0%'],
    rX: [`${S}%`, `${S * 0.55}%`, '0%', '0%', `-${S * 0.55}%`, `-${S}%`],
    rY: ['0%', `${A}%`, '0%', '0%', `-${A}%`, '0%'],
    op: [0, 0.55, 1, 1, 0.55, 0],
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
  const { inp, lX, lY, rX, rY, op } = keyframes(i);
  const leftX = useTransform(progress, inp, lX, { ease: EASE });
  const leftY = useTransform(progress, inp, lY, { ease: EASE });
  const rightX = useTransform(progress, inp, rX, { ease: EASE });
  const rightY = useTransform(progress, inp, rY, { ease: EASE });
  const opacity = useTransform(progress, inp, op);
  // Gentle zoom: faded (crossing) = slightly smaller, centred = full size.
  const scale = useTransform(opacity, [0, 1], [0.92, 1]);
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
      style={{ opacity, scale, visibility, zIndex: i, pointerEvents }}
      className="absolute inset-0 flex items-center"
    >
      <div className="shell grid w-full grid-cols-2 items-center gap-[100px]">
        <motion.div
          style={{ x: leftX, y: leftY, willChange: 'transform' }}
          className="flex justify-center"
        >
          {leftIsMedia ? media : copy}
        </motion.div>
        <motion.div
          style={{ x: rightX, y: rightY, willChange: 'transform' }}
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
