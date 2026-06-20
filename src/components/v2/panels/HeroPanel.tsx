import { Object3DViewer } from '../Object3DViewer';

interface HeroPanelProps {
  /** 0 → 1 scroll progress through the hero track (drives the staged reveal). */
  progress: number;
  /** Whether the hero layer is on screen (pauses the 3D when it isn't). */
  active: boolean;
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// The 3D Ismora mark is hidden for now. Flip to true to bring it back.
const SHOW_LOGO = false;

export function HeroPanel({ progress, active }: HeroPanelProps) {
  // Staged scroll reveal, all pinned on this page:
  //  • progress 0.00–0.20  → living terrain only
  //  • progress 0.20–0.50  → headline fades/zooms in
  //  • progress 0.52–0.85  → the 3D brand mark materialises and rotates
  const headlineReveal = clamp((progress - 0.2) / 0.3);
  const reveal = clamp((progress - 0.52) / 0.33);
  // Headline drifts up slightly to make room as the mark grows.
  const headlineShift = -34 * reveal;

  return (
    <>
      {/* Centre content: headline + the extruded Ismora mark (the living
          terrain scene is the fixed layer behind) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          padding: '0 clamp(24px, 6vw, 120px)',
        }}
      >
        {/* Headline — revealed by scroll (stage 2): zooms in from far */}
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1.9rem, 4.2vw, 58px)',
            lineHeight: 1.08,
            letterSpacing: '-0.045em',
            textAlign: 'center',
            maxWidth: 820,
            margin: 0,
            background: 'linear-gradient(180deg, #ffffff 55%, #ffb9b4 130%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            opacity: headlineReveal,
            transform: `translateY(${headlineShift}px) scale(${0.72 + 0.28 * headlineReveal})`,
            filter: `blur(${(1 - headlineReveal) * 10}px) drop-shadow(0 4px 30px rgba(0,0,0,0.55))`,
            transition: 'opacity 0.08s linear',
            willChange: 'transform, opacity, filter',
          }}
        >
          We build the platforms African businesses depend on
        </h1>

        {/* The Ismora mark in 3D — hidden for now (SHOW_LOGO). When restored it
            is revealed by scroll and scales in centred above the terrain. */}
        {SHOW_LOGO && (
          <div
            style={{
              width: 340,
              height: 340,
              opacity: reveal,
              transform: `scale(${0.55 + 0.45 * reveal})`,
              transformOrigin: 'center center',
              transition: 'opacity 0.08s linear',
              willChange: 'transform, opacity',
              filter: 'drop-shadow(0 30px 80px rgba(232,32,28,0.35))',
            }}
          >
            <Object3DViewer shape="logo" size={340} speed={0.5} active={active} />
          </div>
        )}
      </div>
    </>
  );
}
