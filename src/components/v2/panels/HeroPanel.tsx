import Image from 'next/image';
import { Object3DViewer } from '../Object3DViewer';

interface HeroPanelProps {
  /** 0 → 1 scroll progress through the hero track (drives the diamond reveal). */
  progress: number;
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function HeroPanel({ progress }: HeroPanelProps) {
  // Staged scroll reveal, all pinned on this page:
  //  • progress 0.00–0.20  → terrain only
  //  • progress 0.20–0.50  → headline fades/zooms in
  //  • progress 0.52–0.85  → diamond materialises (then rotates via useFrame)
  const headlineReveal = clamp((progress - 0.2) / 0.3);
  const reveal = clamp((progress - 0.52) / 0.33);
  // Headline drifts up slightly to make room as the diamond grows.
  const headlineShift = -30 * reveal;
  // "Scroll to Discover" sits over the bare terrain, then fades as text arrives.
  const scrollHint = clamp(1 - progress / 0.16);

  return (
    <>
      {/* Terrain background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/terrain-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
      </div>

      {/* Centre content: headline + 3D diamond */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          padding: '0 clamp(24px, 6vw, 120px)',
        }}
      >
        {/* Headline — revealed by scroll (stage 2): zooms in from far */}
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(1.5rem, 3vw, 42px)',
            lineHeight: 1.12,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 580,
            margin: 0,
            opacity: headlineReveal,
            transform: `translateY(${headlineShift}px) scale(${0.72 + 0.28 * headlineReveal})`,
            filter: `blur(${(1 - headlineReveal) * 10}px)`,
            transition: 'opacity 0.08s linear',
            willChange: 'transform, opacity, filter',
          }}
        >
          We build the platforms African businesses depend on
        </h1>

        {/* 3D diamond — revealed by scroll, scales in straight (centred),
            then rotates continuously */}
        <div
          style={{
            width: 320,
            height: 320,
            opacity: reveal,
            transform: `scale(${0.55 + 0.45 * reveal})`,
            transformOrigin: 'center center',
            transition: 'opacity 0.08s linear',
            willChange: 'transform, opacity',
          }}
        >
          <Object3DViewer shape="diamond" size={320} speed={0.55} />
        </div>
      </div>

      {/* Scroll to Discover — fades out as the reveal begins */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: scrollHint,
          pointerEvents: scrollHint < 0.05 ? 'none' : 'auto',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 16,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Scroll to Discover
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hero-chevron"
        >
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </>
  );
}
