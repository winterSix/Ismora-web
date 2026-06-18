'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Object3DViewer } from '../Object3DViewer';
import type { Shape3D } from '../Object3DViewer';
import { useReveal } from '../useReveal';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// About paragraphs revealed word-by-word on scroll (grey → white).
const P1_REST =
  'was founded in Lagos in 2026 by Ismail Raji. The company builds software, integrated infrastructure, and connected systems for institutions, founders, and operating teams.'.split(
    ' '
  );
const P2 =
  "Ismora was created to solve a major gap in Africa's business landscape. Many companies are expected to meet global standards using systems and tools that were not built for local realities like unreliable networks, strict regulations, and operational challenges. Instead of treating these as obstacles, Ismora sees them as the foundation for better design and innovation.".split(
    ' '
  );
const TOTAL_WORDS = P1_REST.length + P2.length;

/** Renders words that light up grey→white one at a time as `wp` (0→1) advances. */
function RevealWords({
  words,
  offset,
  total,
  wp,
}: {
  words: string[];
  offset: number;
  total: number;
  wp: number;
}) {
  const lit = wp * total;
  return (
    <>
      {words.map((w, j) => {
        const t = clamp(lit - (offset + j)); // 0→1 for this word
        const c = Math.round(186 + 69 * t); // #bababa → #ffffff
        return (
          <span key={j} style={{ color: `rgb(${c},${c},${c})`, transition: 'color 0.12s linear' }}>
            {w}{' '}
          </span>
        );
      })}
    </>
  );
}

const CARDS: { title: string; shape: Shape3D; paragraph: string }[] = [
  {
    title: 'Data that shows its work',
    shape: 'orb',
    paragraph:
      "Numbers without context are noise. We build the dashboards, reports, and analytics layers that let leaders see what’s actually happening in their business and defend the decisions they make from it. Real-time when it has to be. Audit-grade when it counts.",
  },
  {
    title: 'The systems beneath the business',
    shape: 'structure',
    paragraph:
      'The unglamorous middle layer is where most software projects fail. We build platforms, integrations, and connected systems that work reliably across every transaction, shift, and audit, from web and mobile to payments, identity, backend systems, and hardware.',
  },
  {
    title: 'Built for here, not borrowed from elsewhere',
    shape: 'swirl',
    paragraph:
      "Great software for Nigerian businesses isn’t copied from Silicon Valley. It’s built for local realities, unstable networks, regulatory demands, real team workflows, and unreliable internet. We design systems that work in the environments our clients actually operate in.",
  },
];

interface AboutPanelProps {
  isVisible: boolean;
  /** 0 → 1 reveal progress: scrolls the content up and flies the gem top → left. */
  progress: number;
  /** Whether this layer is on screen (pauses the 3D when it isn't). */
  active: boolean;
}

const GEM_BASE = 205; // fixed canvas size — the gem shrinks via CSS scale, not resize

export function AboutPanel({ isVisible, progress, active }: AboutPanelProps) {
  // Measure how much taller the content is than the viewport so progress can
  // scroll it fully into view (parallax) without an inner scrollbar.
  const innerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  // Staggered GSAP entrance for the heading block + the three service cards.
  const revealScope = useReveal<HTMLDivElement>(isVisible, { y: 32, stagger: 0.14 });

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const parent = el.parentElement;
      const avail = parent?.clientHeight ?? window.innerHeight;
      setOverflow(Math.max(0, el.scrollHeight - avail));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Diamond enters big at centre (matching where the hero left it), then
  // travels up to settle smaller at the top-centre over the first half of the
  // scroll. The About content fades in as it rises, and the cards parallax up
  // over the second half. So: clean diamond in the middle → diamond at top
  // with content revealed.
  // Content appears first (fast), and the diamond travels straight from the
  // middle up to the top — starting immediately (NO dwell at the middle) and
  // reaching the top quickly.
  const contentReveal = clamp(progress / 0.06); // content shows first, fast
  const travelP = clamp(progress / 0.16); // immediate, quick rise — no hold
  // Diagonal travel: from the centre up to the marked upper-left spot
  // (above the "About Us" heading), not straight up.
  const gemLeft = lerp(50, 30, travelP); // %  (centre → upper-left)
  const gemTop = lerp(50, 7, travelP); // %
  const gemScale = lerp(1, 150 / GEM_BASE, travelP); // CSS scale (cheap) vs canvas resize
  const contentScroll = clamp((progress - 0.25) / 0.75); // parallax cards once it's up top
  const wordProgress = clamp((progress - 0.1) / 0.55); // word-by-word paragraph reveal

  return (
    <>
      {/* Beautiful rotating gem — behind the text, flies top → far-left */}
      <div
        style={{
          position: 'absolute',
          left: `${gemLeft}%`,
          top: `${gemTop}%`,
          width: GEM_BASE,
          height: GEM_BASE,
          transform: `translate(-50%, -50%) scale(${gemScale})`,
          zIndex: 1,
          pointerEvents: 'none',
          willChange: 'transform, left, top',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-35%',
            background:
              'radial-gradient(circle, rgba(232,32,28,0.35) 0%, rgba(232,32,28,0.08) 45%, rgba(232,32,28,0) 70%)',
            filter: 'blur(6px)',
            zIndex: -1,
          }}
        />
        <Object3DViewer shape="logo" size={GEM_BASE} speed={0.5} active={active} />
      </div>

      {/* Clip + parallax content — fades in as the diamond rises, then the
          cards parallax up over the second half of the scroll */}
      <div ref={revealScope} style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 10, opacity: contentReveal }}>
        <div
          ref={innerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'clamp(150px,16vw,196px)',
            paddingRight: 'clamp(24px,5vw,80px)',
            paddingBottom: 'clamp(40px,5vw,72px)',
            paddingLeft: 'clamp(140px,14vw,220px)',
            gap: 30,
            transform: `translateY(${-contentScroll * overflow}px)`,
            willChange: 'transform',
          }}
        >
          {/* About heading + text */}
          <div
            data-reveal
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                About Us
              </span>
            </div>

            <div style={{ maxWidth: 1201 }}>
              <p
                style={{
                  fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
                  fontSize: 'clamp(0.9rem,1.4vw,19px)',
                  lineHeight: 1.45,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                <strong style={{ color: '#ffffff' }}>Ismora Technologies Limited </strong>
                <RevealWords words={P1_REST} offset={0} total={TOTAL_WORDS} wp={wordProgress} />
              </p>
              <p
                style={{
                  fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
                  fontSize: 'clamp(0.9rem,1.4vw,19px)',
                  lineHeight: 1.45,
                  letterSpacing: '-0.03em',
                  marginTop: '0.8em',
                  marginBottom: 0,
                }}
              >
                <RevealWords
                  words={P2}
                  offset={P1_REST.length}
                  total={TOTAL_WORDS}
                  wp={wordProgress}
                />
              </p>
            </div>
          </div>

          {/* Service cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              flexShrink: 0,
            }}
          >
            {CARDS.map((card) => (
              <ServiceCard
                key={card.title}
                title={card.title}
                shape={card.shape}
                paragraph={card.paragraph}
                active={active}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceCard({
  title,
  shape,
  paragraph,
  active,
}: {
  title: string;
  shape: Shape3D;
  paragraph: string;
  active: boolean;
}) {
  return (
    <div
      data-reveal
      className="service-card"
      style={{
        position: 'relative',
        padding: '20px 24px 24px',
      }}
    >
      {/* Top-left bracket */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 65,
          height: 65,
          borderTop: '1px solid rgba(255,255,255,0.5)',
          borderLeft: '1px solid rgba(255,255,255,0.5)',
        }}
      />
      {/* Bottom-right bracket */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 65,
          height: 65,
          borderBottom: '1px solid rgba(255,255,255,0.5)',
          borderRight: '1px solid rgba(255,255,255,0.5)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(0.95rem,1.2vw,20px)',
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1.2,
            margin: 0,
            minHeight: '2.4em',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {title}
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', width: '100%' }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 132,
          }}
        >
          <Object3DViewer shape={shape} size={132} speed={0.5} active={active} />
        </div>

        <p className="card-p" style={{ margin: 0 }}>
          {paragraph}
        </p>
      </div>
    </div>
  );
}
