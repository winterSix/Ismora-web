import Image from 'next/image';

interface ServicesIntroPanelProps {
  isVisible: boolean;
}

export function ServicesIntroPanel({ isVisible }: ServicesIntroPanelProps) {
  return (
    <>
      {/* Radial red background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/radial-red-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* Cone — slides right when visible */}
      <div
        className={isVisible ? 'animate-slide-right' : ''}
        style={{
          position: 'absolute',
          top: 190,
          left: 'calc(50% - 12px)',
          width: 204,
          height: 204,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/images/cone.png"
          alt=""
          width={204}
          height={204}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
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
          }}
        >
          What we build and
          <br />
          How we build it
        </h2>
      </div>

      {/* Scroll to Discover */}
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </>
  );
}
