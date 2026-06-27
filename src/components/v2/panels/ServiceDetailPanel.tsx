'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { Object3DViewer } from '../Object3DViewer';
import type { Shape3D } from '../Object3DViewer';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';

export interface ServiceDetail {
  title: string;
  description: string;
  shape: Shape3D;
  color: string;
  emissive: string;
  side: 'left' | 'right'; // which side the 3D object sits on
}

/** Four service detail pages — content + 3D taken from the reference screens. */
export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    title: 'Platform Engineering',
    description:
      'We design and build multi-tenant SaaS platforms end-to-end: architecture, backend, web, mobile, integrations, infrastructure, and the operational tooling to run them in production. This is the work that defines us.',
    shape: 'structure',
    color: '#1a1a1f',
    emissive: '#e8201c',
    side: 'right',
  },
  {
    title: 'Connected Systems & Hardware Integration',
    description:
      'When software needs to talk to the physical world — scanners, cards, sensors, RFID — we build the bridge. We integrate hardware sourced locally or globally into custom software that fits the way the business actually runs.',
    shape: 'swirl',
    color: '#17171b',
    emissive: '#ff3b1e',
    side: 'left',
  },
  {
    title: 'Data & Decision Tools',
    description:
      'We build the dashboards, reports, and analytics layers that let teams stop guessing. Real data, real context, audit-grade where it has to be.',
    shape: 'orb',
    color: '#141418',
    emissive: '#c4000a',
    side: 'right',
  },
  {
    title: 'Product Strategy & Discovery',
    description:
      'Before we build, we make sure the right thing is being built. We run focused engagements to turn a fuzzy idea into a scoped, costed, build-ready plan — even if you take that plan to someone else.',
    shape: 'gem',
    color: '#ff9a90',
    emissive: '#7a0a10',
    side: 'left',
  },
];

export function ServiceDetailPanel({
  detail,
  isVisible,
}: {
  detail: ServiceDetail;
  isVisible: boolean;
  /** Unused — kept for API compatibility. */
  progress: number;
  /** Unused — the "01 / 04" kicker was removed; kept for API compatibility. */
  index?: number;
}) {
  const { title, description, side } = detail;

  // Fixed horizontal anchors matched to the reference screens.
  const objCenterLeft = side === 'right' ? '78%' : '28%';
  const textLeft = side === 'right' ? 'clamp(150px,14vw,205px)' : '50%';

  // Cross-slide as a ONE-SHOT GSAP entrance (not scroll-scrubbed): when the page
  // becomes active, the diamond and text start on each other's side and slide to
  // their final anchors, with the title + description staggering in. A single
  // scroll always completes the exchange — you never get parked in the overlap.
  const sign = side === 'right' ? 1 : -1;
  const SWAP = 44; // vw start offset (on the opposite side)

  const objRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const played = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (!isVisible || played.current || !objRef.current) return;
    played.current = true;

    const off = (window.innerWidth * SWAP) / 100; // vw → px
    const ctx = gsap.context(() => {
      const ease = 'power3.out';
      const tl = gsap.timeline();
      // The object is horizontally centred on its anchor via xPercent, so the
      // slide rides on top of that without losing the centring.
      tl.fromTo(
        objRef.current,
        { xPercent: -50, x: -sign * off, opacity: 0 },
        { xPercent: -50, x: 0, opacity: 1, duration: 0.8, ease },
        0
      )
        .fromTo(
          textRef.current,
          { x: sign * off, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease },
          0
        )
        .fromTo(
          [titleRef.current, descRef.current],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease, stagger: 0.12 },
          0.2
        );
    });

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <>
      {/* Black stage is handled by the fixed crossfading layer (base) */}

      {/* 3D object — full-height flex wrapper centres it vertically; left% fixes
          the horizontal anchor. The object is centred in its own canvas, so it
          lines up with the text's vertical centre. */}
      <div
        ref={objRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: objCenterLeft,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            width: 390,
            height: 390,
            filter: 'drop-shadow(0 24px 70px rgba(232,32,28,0.25))',
          }}
        >
          <Object3DViewer
            shape={detail.shape}
            color={detail.color}
            emissive={detail.emissive}
            size={390}
            speed={0.55}
            active={isVisible}
          />
        </div>
      </div>

      {/* Text — full-height flex wrapper centres it vertically; left% fixes the
          horizontal anchor (just past the sidebar, or at mid-page). */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: textLeft,
          width: 'min(38vw, 500px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
          zIndex: 10,
          opacity: isVisible ? 1 : 0,
          willChange: 'transform, opacity',
        }}
      >
        <h3
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1.6rem, 2.8vw, 38px)',
            lineHeight: 1.12,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          ref={descRef}
          style={{
            fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(0.95rem, 1.4vw, 19px)',
            lineHeight: 1.55,
            letterSpacing: '-0.02em',
            color: '#cfcfcf',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </>
  );
}
