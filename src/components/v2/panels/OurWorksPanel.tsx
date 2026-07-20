'use client';

import Image from 'next/image';
import { useReveal } from '../useReveal';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface Project {
  name: string;
  logo: string; // wordmark shown big on the card preview (fallback if no logoImageUrl)
  logoImageUrl?: string; // real per-project logo image; takes priority over `logo` text when set
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
    description: 'Placeholder: pending Figma node 385-777. Replace with the real project details.',
    industry: 'Oil & Gas',
    date: '2025',
    color: '#2e4a3f',
    accent: '#36d399',
    placeholder: true,
  },
  {
    name: 'Project Four',
    logo: 'Project',
    description: 'Placeholder: pending Figma node 390-1006. Replace with the real project details.',
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
  // Cards finish flipping by 93% through the section's scroll range, not
  // 100% — leaving a small settled dwell buffer before the crossfade into the
  // next section starts. Without this, the last card's flip only reached
  // "flat" at the exact same instant the crossfade began, so it visibly cut
  // away mid-tilt instead of ever coming to rest. (Kept small — a bigger
  // buffer just added extra dead scroll distance after the cards were
  // already done.)
  const SETTLE_BUFFER = 0.93;
  const step = N > 1 ? SETTLE_BUFFER / (N - 1) : 1; // card i (i≥1) flips in over [(i-1)·step, i·step]
  const revealScope = useReveal<HTMLDivElement>(isVisible, { y: 24, duration: 0.6 });

  return (
    <div
      ref={revealScope}
      className="ourworks-content"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Heading — left-aligned on desktop (matches the reference), centred on
          mobile (no sidebar rail eating the left edge there). */}
      <div
        data-reveal
        className="ourworks-heading"
        style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}
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
        borderRadius: 24,
        background: 'linear-gradient(180deg, #16161b 0%, #0b0b0e 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -16px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        padding: 'clamp(10px,1vw,16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(10px,1.2vw,16px)',
        overflow: 'hidden',
      }}
    >
      {/* Brand preview */}
      <div
        className="work-preview"
        style={{
          borderRadius: 16,
          background: `radial-gradient(90% 140% at 75% 0%, ${project.accent}2e 0%, rgba(0,0,0,0) 55%), radial-gradient(70% 110% at 20% 100%, ${project.accent}1f 0%, rgba(0,0,0,0) 60%), linear-gradient(135deg, ${project.color}, ${project.color}b8)`,
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* sweeping highlight across the preview */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 60%)',
          }}
        />
        {project.logoImageUrl ? (
          <Image
            src={project.logoImageUrl}
            alt={project.name}
            width={220}
            height={80}
            style={{ width: 'clamp(120px,20vw,220px)', height: 'auto', objectFit: 'contain' }}
          />
        ) : project.logo === 'ismora' ? (
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

      {/* Metadata row (inside the card) — 4 columns on desktop, stacked
          vertically on mobile with its own scroll so a long description can
          never get silently clipped by the card's rounded-corner overflow. */}
      <div
        className="work-meta"
        style={{
          display: 'grid',
          gap: 24,
          padding: '2px clamp(8px,1vw,16px) 6px',
        }}
      >
        {[
          ['Project Name', project.name],
          ['Description', project.description],
          ['Industry', project.industry],
          ['Release Date', project.date],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: 11,
                color: '#6e6e76',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
              }}
            >
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
