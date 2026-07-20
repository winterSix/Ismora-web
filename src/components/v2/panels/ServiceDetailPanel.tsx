'use client';

import { Object3DViewer } from '../Object3DViewer';
import type { Shape3D } from '../Object3DViewer';
import { useReveal } from '../useReveal';
import { useIsMobile } from '../useIsMobile';

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
      'When software needs to talk to the physical world (scanners, cards, sensors, RFID), we build the bridge. We integrate hardware sourced locally or globally into custom software that fits the way the business actually runs.',
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
      'Before we build, we make sure the right thing is being built. We run focused engagements to turn a fuzzy idea into a scoped, costed, build-ready plan, even if you take that plan to someone else.',
    shape: 'gem',
    color: '#ff9a90',
    emissive: '#7a0a10',
    side: 'left',
  },
];

export function ServiceDetailPanel({
  detail,
  isVisible,
  hasEntered,
}: {
  detail: ServiceDetail;
  /** Currently on-screen (scroll opacity past the crossfade threshold) — drives
   * the 3D viewer's pause/resume and the panel's own show/hide fade. */
  isVisible: boolean;
  /** Has this slide ever been reached — triggers the one-shot entrance
   * exactly once, at the same moment the outer crossfade starts (not gated
   * on the crossfade reaching 50%, which caused a double-animation "blink"). */
  hasEntered: boolean;
  /** Unused — kept for API compatibility. */
  progress: number;
  /** Unused — the "01 / 04" kicker was removed; kept for API compatibility. */
  index?: number;
}) {
  const { title, description, side } = detail;
  const isMobile = useIsMobile();

  // Fixed horizontal anchors matched to the reference screens.
  const objCenterLeft = side === 'right' ? '78%' : '28%';
  // Floor raised from 150 to clear the sidebar rail's actual rendered width
  // (~162px, fixed regardless of viewport) at narrower desktop widths.
  const textLeft = side === 'right' ? 'clamp(190px,14vw,205px)' : '50%';

  // One-shot fade/rise entrance — the same proven pattern used by every other
  // panel (About, Services intro, Our Works). Triggered by `hasEntered` so it
  // starts in sync with the outer crossfade instead of partway through it.
  const revealScope = useReveal<HTMLDivElement>(!isMobile && hasEntered, { y: 24, duration: 0.7 });
  const mobileScope = useReveal<HTMLDivElement>(isMobile && hasEntered, { y: 26, stagger: 0.14 });

  if (isMobile) {
    return (
      <div
        ref={mobileScope}
        className="detail-mobile-stack"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}
      >
        <div data-reveal className="detail-mobile-text">
          <h3 className="detail-title">{title}</h3>
          <p className="detail-desc">{description}</p>
        </div>
        <div data-reveal className="detail-mobile-object">
          <Object3DViewer
            shape={detail.shape}
            color={detail.color}
            emissive={detail.emissive}
            size={230}
            speed={0.55}
            active={isVisible}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={revealScope} style={{ position: 'absolute', inset: 0, opacity: isVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      {/* 3D object — full-height flex wrapper centres it vertically; left% fixes
          the horizontal anchor. The object is centred in its own canvas, so it
          lines up with the text's vertical centre. */}
      <div
        data-reveal
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
        data-reveal
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
        }}
      >
        <h3
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
    </div>
  );
}
