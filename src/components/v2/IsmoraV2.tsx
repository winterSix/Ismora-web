'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { SidebarNav } from './SidebarNav';
import { HeroPanel } from './panels/HeroPanel';
import { AboutPanel } from './panels/AboutPanel';
import { ServicesIntroPanel } from './panels/ServicesIntroPanel';
import { ServiceDetailPanel, SERVICE_DETAILS } from './panels/ServiceDetailPanel';
import { OurWorksPanel, PROJECTS } from './panels/OurWorksPanel';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Each section owns a scroll "reveal" length (in viewport multiples). After the
// reveal, a short transition crossfades to the next section. Sections are
// stacked full-screen layers — they fade between each other, never slide over
// one another.
const SECTIONS = [
  { key: 'hero', reveal: 1.8 },
  { key: 'about', reveal: 2.2 },
  { key: 'services', reveal: 1.6 },
  ...SERVICE_DETAILS.map((_, i) => ({ key: `d${i}`, reveal: 0.7 })),
  // Our Works is ONE scroll-driven section (cards stack & flip within it)
  { key: 'works', reveal: 0.9 + 0.6 * Math.max(0, PROJECTS.length - 1) },
];
const DETAIL_START = 3;
const OURWORKS_START = DETAIL_START + SERVICE_DETAILS.length;

// Section index → sidebar item (0 Intro, 1 About, 2 Services, 3 Our Works)
const sidebarFor = (i: number) =>
  i === 0 ? 0 : i === 1 ? 1 : i < OURWORKS_START ? 2 : 3;
// No crossfade window: sections switch instantly so two pages are never shown
// at once (and there's no blank). Polish comes from each page's content
// animating in once it's active.

export function IsmoraV2() {
  const [activeSection, setActiveSection] = useState(0);
  const [docH, setDocH] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [op, setOp] = useState<number[]>(() => SECTIONS.map((_, i) => (i === 0 ? 1 : 0)));
  const [prog, setProg] = useState<number[]>(() => SECTIONS.map(() => 0));
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));

  const layoutRef = useRef<{ starts: number[]; reveals: number[]; T: number; maxScroll: number }>({
    starts: [],
    reveals: [],
    T: 0,
    maxScroll: 1,
  });
  const tickingRef = useRef(false);

  // Recompute the scroll layout for the current viewport height.
  const computeLayout = useCallback(() => {
    const vh = window.innerHeight || 1;
    const reveals = SECTIONS.map((s) => s.reveal * vh);
    const starts: number[] = [];
    let acc = 0;
    for (let i = 0; i < reveals.length; i++) {
      starts[i] = acc;
      acc += reveals[i];
    }
    const last = reveals.length - 1;
    const maxScroll = starts[last] + reveals[last];
    layoutRef.current = { starts, reveals, T: 0, maxScroll };
    setDocH(maxScroll + vh);
  }, []);

  useEffect(() => {
    const update = () => {
      tickingRef.current = false;
      const { starts, reveals, maxScroll } = layoutRef.current;
      if (!starts.length) return;
      const y = window.scrollY;

      // Instant switch: exactly one section is shown for its scroll range. The
      // next section replaces it the moment its range begins — never two at
      // once, never a blank. Its content animates in via the entrance class.
      const last = SECTIONS.length - 1;
      const nextOp: number[] = [];
      const nextProg: number[] = [];
      for (let i = 0; i < SECTIONS.length; i++) {
        const s = starts[i];
        const len = reveals[i];
        const active = i === last ? y >= s : y >= s && y < s + len;
        nextOp[i] = active ? 1 : 0;
        nextProg[i] = clamp((y - s) / len);
      }
      setOp(nextOp);
      setProg(nextProg);

      setVisited((prev) => {
        let next = prev;
        nextOp.forEach((o, i) => {
          if (o > 0.05 && !prev.has(i)) {
            if (next === prev) next = new Set(prev);
            next.add(i);
          }
        });
        return next;
      });

      // Current section → sidebar index (hero=0, about=1, services+details=2).
      let cur = 0;
      for (let i = 0; i < starts.length; i++) {
        if (y >= starts[i]) cur = i;
      }
      setActiveSection(sidebarFor(cur));
      setAtEnd(y >= maxScroll - 8);
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      computeLayout();
      onScroll();
    };

    computeLayout();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [computeLayout]);

  const navigateToSection = useCallback((sidebarIndex: number) => {
    const { starts } = layoutRef.current;
    const sectionIndex =
      sidebarIndex === 0 ? 0 : sidebarIndex === 1 ? 1 : sidebarIndex === 2 ? 2 : OURWORKS_START;
    window.scrollTo({ top: starts[sectionIndex] ?? 0, behavior: 'smooth' });
  }, []);

  // Renders one stacked full-screen section layer (background + content).
  const layer = (i: number, bg: ReactNode, content: ReactNode) => (
    <div
      key={SECTIONS[i].key}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1 + i,
        opacity: op[i],
        visibility: op[i] <= 0.001 ? 'hidden' : 'visible',
        pointerEvents: op[i] > 0.5 ? 'auto' : 'none',
      }}
    >
      {bg}
      {content}
    </div>
  );

  const darkOverlay = <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />;

  return (
    <>
      {/* Fixed Logo */}
      <div
        style={{
          position: 'fixed',
          top: 50,
          left: 50,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/ismora-logo.svg"
          alt="Ismora"
          width={45}
          height={40}
          style={{ filter: 'brightness(0) invert(1)', width: 45, height: 40 }}
          priority
        />
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 18,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          ismora™
        </span>
      </div>

      {/* Fixed Sidebar Nav */}
      <SidebarNav activeSection={activeSection} onNavigate={navigateToSection} />

      {/* Base black backdrop — shown during fade-through-black transitions */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000', pointerEvents: 'none' }} />

      {/* Stacked full-screen section layers — fade through black, never slide. */}
      {layer(
        0,
        <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
          <Image src="/images/terrain-bg.png" alt="" fill priority style={{ objectFit: 'cover', objectPosition: 'center' }} />
          {darkOverlay}
        </div>,
        <HeroPanel progress={prog[0]} />
      )}

      {layer(
        1,
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #323232 0%, #000000 60%)' }} />,
        <AboutPanel progress={prog[1]} isVisible={visited.has(1)} />
      )}

      {layer(
        2,
        <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
          <Image src="/images/radial-red-bg.png" alt="" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
        </div>,
        <ServicesIntroPanel progress={prog[2]} isVisible={visited.has(2)} />
      )}

      {SERVICE_DETAILS.map((detail, k) =>
        layer(
          k + 3,
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }} />,
          <ServiceDetailPanel detail={detail} isVisible={op[k + 3] > 0.5} progress={prog[k + 3]} />
        )
      )}

      {/* Our Works — one section; cards stack & flip as you scroll through it */}
      {layer(
        OURWORKS_START,
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }} />,
        <OurWorksPanel projects={PROJECTS} progress={prog[OURWORKS_START]} isVisible={op[OURWORKS_START] > 0.5} />
      )}

      {/* Spacer that gives the document its scroll length */}
      <div style={{ height: docH }} aria-hidden />

      {/* Persistent "Scroll to Discover" */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: atEnd ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 14,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          }}
        >
          Scroll to Discover
        </span>
        <svg
          width="22"
          height="22"
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
