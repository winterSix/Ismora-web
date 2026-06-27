'use client';

import { Object3DViewer } from '../Object3DViewer';
import { useReveal } from '../useReveal';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CUBE_BASE = 230; // fixed canvas size — scaled via CSS, never resized per frame

// The 3D Ismora mark is hidden for now. Flip to true to bring it back.
const SHOW_LOGO = false;

interface ServicesIntroPanelProps {
  isVisible: boolean;
  /** 0 → 1 scroll progress: flies the crystal cube top-centre → right-middle. */
  progress: number;
  /** Whether this layer is on screen (pauses the 3D when it isn't). */
  active: boolean;
}

export function ServicesIntroPanel({ isVisible, progress, active }: ServicesIntroPanelProps) {
  const cubeLeft = lerp(50, 84, progress); // %
  const cubeTop = lerp(16, 50, progress); // %
  const cubeScale = lerp(200 / CUBE_BASE, 1, progress);

  // Headline rises + un-blurs into focus when the section first appears.
  const scope = useReveal<HTMLDivElement>(isVisible, { y: 40, scale: 0.92, blur: 12, duration: 0.9 });

  return (
    <div ref={scope} style={{ display: 'contents' }}>
      {/* Radial red background is handled by the fixed crossfading layer */}

      {/* Ismora mark — hidden for now (SHOW_LOGO); scroll-driven top-centre → right-middle */}
      {SHOW_LOGO && (
        <div
          style={{
            position: 'absolute',
            left: `${cubeLeft}%`,
            top: `${cubeTop}%`,
            width: CUBE_BASE,
            height: CUBE_BASE,
            transform: `translate(-50%, -50%) scale(${cubeScale})`,
            zIndex: 5,
            pointerEvents: 'none',
            willChange: 'transform, left, top',
          }}
        >
          <Object3DViewer shape="logo" size={CUBE_BASE} speed={0.5} active={active} />
        </div>
      )}

      {/* Centered headline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 clamp(24px, 6vw, 120px)',
          pointerEvents: 'none',
        }}
      >
        <h2
          data-reveal
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(2.2rem, 4.6vw, 64px)',
            lineHeight: 1.1,
            letterSpacing: '-0.045em',
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}
        >
          What we build and
          <br />
          How we build it
        </h2>
      </div>
    </div>
  );
}
