import { Object3DViewer } from '../Object3DViewer';
import type { Shape3D } from '../Object3DViewer';

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
    color: '#cfe3ff',
    emissive: '#234a7a',
    side: 'right',
  },
  {
    title: 'Connected Systems & Hardware Integration',
    description:
      'When software needs to talk to the physical world — scanners, cards, sensors, RFID — we build the bridge. We integrate hardware sourced locally or globally into custom software that fits the way the business actually runs.',
    shape: 'swirl',
    color: '#bff3ff',
    emissive: '#1d5a6e',
    side: 'left',
  },
  {
    title: 'Data & Decision Tools',
    description:
      'We build the dashboards, reports, and analytics layers that let teams stop guessing. Real data, real context, audit-grade where it has to be.',
    shape: 'orb',
    color: '#e7d6ff',
    emissive: '#3a2a6a',
    side: 'right',
  },
  {
    title: 'Product Strategy & Discovery',
    description:
      'Before we build, we make sure the right thing is being built. We run focused engagements to turn a fuzzy idea into a scoped, costed, build-ready plan — even if you take that plan to someone else.',
    shape: 'gem',
    color: '#ffe3c2',
    emissive: '#6a3a1a',
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
}) {
  const { title, description, side } = detail;

  // Fixed horizontal anchors matched to the reference screens.
  const objCenterLeft = side === 'right' ? '78%' : '28%';
  const textLeft = side === 'right' ? 'clamp(150px,14vw,205px)' : '50%';

  // Cross-slide as a ONE-SHOT entrance animation (not scroll-scrubbed): when the
  // page becomes active, the diamond and text start on each other's side and
  // slide to their final anchors over a fixed duration — so a single scroll
  // always completes the exchange and you never get parked in the overlap.
  const sign = side === 'right' ? 1 : -1;
  const SWAP = 44; // vw start offset (on the opposite side)
  const objOff = isVisible ? 0 : -sign * SWAP;
  const textOff = isVisible ? 0 : sign * SWAP;
  const reveal = isVisible ? 1 : 0;
  const objTransform = `translateX(calc(-50% + ${objOff}vw))`;
  const textTransform = `translateX(${textOff}vw)`;
  const slideTransition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease';

  return (
    <>
      {/* Black stage is handled by the fixed crossfading layer (base) */}

      {/* 3D object — full-height flex wrapper centres it vertically; left% fixes
          the horizontal anchor. The object is centred in its own canvas, so it
          lines up with the text's vertical centre. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: objCenterLeft,
          transform: objTransform,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: reveal,
          transition: slideTransition,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: 390,
            height: 390,
            filter: 'drop-shadow(0 20px 60px rgba(120,160,255,0.18))',
          }}
        >
          <Object3DViewer shape="diamond" size={390} speed={0.55} />
        </div>
      </div>

      {/* Text — full-height flex wrapper centres it vertically; left% fixes the
          horizontal anchor (just past the sidebar, or at mid-page). */}
      <div
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
          transform: textTransform,
          opacity: reveal,
          transition: slideTransition,
          willChange: 'transform',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(1.5rem, 2.6vw, 34px)',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
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
