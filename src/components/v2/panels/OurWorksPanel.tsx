import Image from 'next/image';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface Project {
  name: string;
  logo: string; // wordmark shown big on the card preview
  description: string;
  industry: string;
  date: string;
  color: string; // brand-tinted preview background
  accent: string; // logo / accent colour
  placeholder?: boolean;
}

// ASR + NoStory are from Figma (node 383-1581 + the "right design" screen).
// The last two are placeholders pending Figma nodes 385-777 / 390-1006.
export const PROJECTS: Project[] = [
  {
    name: 'ASR Loyalty Platform',
    logo: 'ismora',
    description:
      'A multi-tenant customer loyalty and revenue-tracking platform helping businesses retain customers and understand who drives their revenue.',
    industry: 'Business',
    date: '2026',
    color: '#3d2222',
    accent: '#f0000c',
  },
  {
    name: 'NoStory Platform',
    logo: 'NoStory',
    description:
      'PNN is creating a platform for Nigerians to file complaints against service providers and track resolution across regulated sectors.',
    industry: 'Customer Experience',
    date: '2026',
    color: '#3a3a6e',
    accent: '#3b5bff',
  },
  {
    name: 'Project Three',
    logo: 'Project',
    description: 'Placeholder — pending Figma node 385-777. Replace with the real project details.',
    industry: 'Oil & Gas',
    date: '2025',
    color: '#2e4a3f',
    accent: '#36d399',
    placeholder: true,
  },
  {
    name: 'Project Four',
    logo: 'Project',
    description: 'Placeholder — pending Figma node 390-1006. Replace with the real project details.',
    industry: 'Public Sector',
    date: '2026',
    color: '#26304a',
    accent: '#5b8cff',
    placeholder: true,
  },
];

export function OurWorksPanel({
  projects,
  progress,
  isVisible,
}: {
  projects: Project[];
  progress: number;
  isVisible: boolean;
}) {
  const N = projects.length;
  const step = N > 1 ? 1 / (N - 1) : 1; // card i (i≥1) flips in over [(i-1)·step, i·step]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'clamp(82px,9vw,116px)',
        paddingBottom: 'clamp(40px,5vw,72px)',
        paddingLeft: 'clamp(150px,14vw,210px)',
        paddingRight: 'clamp(40px,5vw,80px)',
        gap: 'clamp(12px,1.6vw,22px)',
      }}
    >
      {/* Heading */}
      <div
        className={isVisible ? 'animate-fade-slide-up' : ''}
        style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: isVisible ? undefined : 0, flexShrink: 0 }}
      >
        <Image
          src="/ismora-logo.svg"
          alt=""
          width={27}
          height={24}
          style={{ filter: 'brightness(0) invert(1)', width: 27, height: 24 }}
        />
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1.25rem,2vw,28px)',
            color: '#ffffff',
            letterSpacing: '-0.04em',
          }}
        >
          Our Works
        </span>
      </div>

      {/* Stacking card stage */}
      <div style={{ position: 'relative', flex: 1, perspective: '2000px' }}>
        {projects.map((project, i) => {
          // card 0 is already in place; the rest flip up from below on scroll
          const pi = i === 0 ? 1 : clamp((progress - (i - 1) * step) / step);
          const ty = lerp(112, 0, pi); // % below → slot
          const rx = lerp(72, 0, pi); // deg tilt → flat
          const offset = i * 16; // px stack peek
          return (
            <div
              key={project.name}
              style={{
                position: 'absolute',
                top: offset,
                left: 0,
                right: 0,
                bottom: 0,
                transform: `translateY(${ty}%) rotateX(${rx}deg)`,
                transformOrigin: 'center bottom',
                transformStyle: 'preserve-3d',
                zIndex: i + 1,
                opacity: pi <= 0 ? 0 : 1,
                willChange: 'transform',
              }}
            >
              <WorkCard project={project} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkCard({ project }: { project: Project }) {
  return (
    <div
      style={{
        height: '100%',
        borderRadius: 20,
        background: '#101013',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -12px 44px rgba(0,0,0,0.55)',
        padding: 'clamp(10px,1vw,16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(10px,1.2vw,16px)',
        overflow: 'hidden',
      }}
    >
      {/* Brand preview */}
      <div
        style={{
          flex: 1,
          minHeight: 110,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {project.logo === 'ismora' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Image
              src="/ismora-logo.svg"
              alt=""
              width={52}
              height={46}
              style={{ width: 'clamp(34px,3.4vw,52px)', height: 'auto' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.6rem,4vw,52px)',
                letterSpacing: '-0.04em',
                color: project.accent,
              }}
            >
              ismora
            </span>
          </div>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem,4.5vw,58px)',
              letterSpacing: '-0.04em',
              color: project.accent,
              textShadow: '0 2px 24px rgba(0,0,0,0.35)',
            }}
          >
            {project.logo}
          </span>
        )}
        {project.placeholder && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              right: 18,
              fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Placeholder
          </span>
        )}
      </div>

      {/* Metadata row (inside the card) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1fr',
          gap: 24,
          padding: '2px clamp(8px,1vw,16px) 6px',
          flexShrink: 0,
        }}
      >
        {[
          ['Project Name', project.name],
          ['Description', project.description],
          ['Industry', project.industry],
          ['Release Date', project.date],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 13, color: '#8a8a90' }}>
              {label}
            </span>
            <span
              style={{
                fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(0.78rem,0.95vw,14px)',
                lineHeight: 1.4,
                color: '#e0e0e6',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
