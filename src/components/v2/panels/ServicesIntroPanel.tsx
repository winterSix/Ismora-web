import { Object3DViewer } from '../Object3DViewer';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface ServicesIntroPanelProps {
  isVisible: boolean;
  /** 0 → 1 scroll progress: flies the crystal cube top-centre → right-middle. */
  progress: number;
}

export function ServicesIntroPanel({ isVisible, progress }: ServicesIntroPanelProps) {
  const cubeLeft = lerp(50, 84, progress); // %
  const cubeTop = lerp(16, 50, progress); // %
  const cubeSize = lerp(200, 230, progress);

  return (
    <>
      {/* Radial red background is handled by the fixed crossfading layer */}

      {/* Crystal cube — scroll-driven top-centre → right-middle */}
      <div
        style={{
          position: 'absolute',
          left: `${cubeLeft}%`,
          top: `${cubeTop}%`,
          width: cubeSize,
          height: cubeSize,
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          pointerEvents: 'none',
          willChange: 'left, top, width, height',
        }}
      >
        <Object3DViewer shape="diamond" size={Math.round(cubeSize)} speed={0.55} />
      </div>

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
          className={isVisible ? 'animate-fade-slide-up' : ''}
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 58px)',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            textAlign: 'center',
            opacity: isVisible ? undefined : 0,
            margin: 0,
            textShadow: '0 2px 30px rgba(0,0,0,0.5)',
          }}
        >
          What we build and
          <br />
          How we build it
        </h2>
      </div>
    </>
  );
}
