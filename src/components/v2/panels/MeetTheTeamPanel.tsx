import Image from 'next/image';
import { Object3DViewer } from '../Object3DViewer';
import { useIsMobile } from '../useIsMobile';

export interface Member {
  name: string;
  role: string;
}

export const TEAM: Member[] = [
  { name: 'Ismail Raji', role: 'CEO & Co-founder' },
  { name: 'Kanyinsola Olawuyi', role: 'CPO & Co-founder' },
];

const ICONS: { key: string; color: string; path: React.ReactNode }[] = [
  {
    key: 'linkedin',
    color: '#0a66c2',
    path: <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zm7 0h3.8v2.05h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23h-4V8z" />,
  },
  {
    key: 'x',
    color: '#ffffff',
    path: <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-7-6.2 7H1.7l8.1-9.3L1 2h7l4.9 6.5L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />,
  },
  {
    key: 'instagram',
    color: '#e1306c',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.6" cy="6.4" r="1.3" />
      </>
    ),
  },
];

function Socials() {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 4 }}>
      {ICONS.map((ic) => (
        <span
          key={ic.key}
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ic.color,
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {ic.path}
          </svg>
        </span>
      ))}
    </div>
  );
}

function TeamCard({ member, anim, delay }: { member: Member; anim: string; delay: number }) {
  return (
    <div
      className={`team-card${anim ? ` ${anim}` : ''}`}
      style={{
        flexShrink: 0,
        borderRadius: 20,
        background: '#0e0e12',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 'clamp(14px,1.4vw,20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        animationDelay: anim ? `${delay}s` : undefined,
      }}
    >
      {/* Photo */}
      <div
        className="team-photo"
        style={{
          width: '100%',
          borderRadius: 14,
          background: 'linear-gradient(135deg,#2d2b5b,#1c1b3a)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </div>
      {/* Name + role + socials (centred) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6, padding: '0 4px 4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1rem,1.4vw,20px)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
          }}
        >
          {member.name}
        </span>
        <span style={{ fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif', fontSize: 'clamp(0.78rem,0.95vw,13px)', color: '#9a9aa2' }}>
          {member.role}
        </span>
        <Socials />
      </div>
    </div>
  );
}

export function MeetTheTeamPanel({ isVisible, members = TEAM }: { isVisible: boolean; members?: Member[] }) {
  const anim = isVisible ? 'animate-fade-slide-up' : '';
  const isMobile = useIsMobile();
  // The rotating diamond is a two-column-layout flourish designed for exactly
  // two members (one either side). Any other count just rows/wraps the cards
  // without it rather than trying to redesign the centrepiece for N people.
  const showDiamond = !isMobile && members.length === 2;
  return (
    <div
      className="team-content"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Heading — centred on mobile, left-aligned on desktop */}
      <div
        className={`team-heading${anim ? ` ${anim}` : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: isVisible ? undefined : 0, flexShrink: 0 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1.25rem,2vw,28px)',
            color: '#ffffff',
            letterSpacing: '-0.04em',
          }}
        >
          Meet the Team
        </span>
      </div>

      {/* Two members with the rotating diamond between them — spread across the
          width so the cards sit near the edges (not clustered in the centre).
          Any other member count just rows/wraps the cards without the diamond. */}
      <div className="team-row">
        {showDiamond ? (
          <>
            <TeamCard member={members[0]} anim={anim} delay={0.1} />
            <div style={{ width: 'clamp(150px,18vw,260px)', height: 'clamp(150px,18vw,260px)', flexShrink: 0 }}>
              <Object3DViewer shape="diamond" size={260} speed={0.6} />
            </div>
            <TeamCard member={members[1]} anim={anim} delay={0.2} />
          </>
        ) : (
          members.map((member, i) => <TeamCard key={member.name} member={member} anim={anim} delay={0.1 * (i + 1)} />)
        )}
      </div>

      {/* Let's Connect — intro band at the bottom */}
      <div
        className={anim}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, opacity: isVisible ? undefined : 0, animationDelay: isVisible ? '0.3s' : undefined }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/ismora-logo.svg" alt="" width={22} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
          <span
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(1.05rem,1.7vw,24px)',
              color: '#ffffff',
              letterSpacing: '-0.04em',
            }}
          >
            Let&apos;s Connect
          </span>
        </div>
        <p
          style={{
            fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(0.82rem,1.1vw,16px)',
            lineHeight: 1.5,
            color: '#9a9aa2',
            maxWidth: 760,
            margin: 0,
          }}
        >
          We respond to every inbound within one business day. If your message includes a brief
          description of what you&apos;re working on and what you&apos;re trying to figure out, we&apos;ll
          come to the first call already useful.
        </p>
      </div>
    </div>
  );
}
