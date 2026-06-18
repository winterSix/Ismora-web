'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { SidebarNav } from './SidebarNav';
import { HeroScene } from './HeroScene';
import { HeroPanel } from './panels/HeroPanel';
import { AboutPanel } from './panels/AboutPanel';
import { ServicesIntroPanel } from './panels/ServicesIntroPanel';
import { ServiceDetailPanel, SERVICE_DETAILS } from './panels/ServiceDetailPanel';
import { OurWorksPanel, PROJECTS } from './panels/OurWorksPanel';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Each section owns a scroll "reveal" length (in viewport multiples). After the
// reveal, a short transition crossfades to the next section. Sections are
// stacked full-screen layers — they fade between each other, never slide over
// one another. `zoom: true` marks a section whose entrance is a camera
// push-in: the outgoing layer scales up toward the viewer as it dissolves
// while this one grows into place.
const SECTIONS: { key: string; reveal: number; zoom?: boolean }[] = [
  { key: 'hero', reveal: 2.8 },
  { key: 'about', reveal: 3.4 },
  { key: 'services', reveal: 2.4 },
  ...SERVICE_DETAILS.map((_, i) => ({ key: `d${i}`, reveal: 1.2, zoom: i === 0 })),
  // Our Works is ONE scroll-driven section (cards stack & flip within it)
  { key: 'works', reveal: 1.3 + 0.9 * Math.max(0, PROJECTS.length - 1) },
];
const DETAIL_START = 3;
const OURWORKS_START = DETAIL_START + SERVICE_DETAILS.length;

// Section index → sidebar item (0 Intro, 1 About, 2 Services, 3 Our Works)
const sidebarFor = (i: number) =>
  i === 0 ? 0 : i === 1 ? 1 : i < OURWORKS_START ? 2 : 3;
// Sections crossfade at their boundaries: the incoming layer (stacked above)
// fades in over the outgoing one during the final stretch of its scroll
// range, then the outgoing layer switches off once fully covered.

export function IsmoraV2() {
  const [activeSection, setActiveSection] = useState(0);
  const [docH, setDocH] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [op, setOp] = useState<number[]>(() => SECTIONS.map((_, i) => (i === 0 ? 1 : 0)));
  const [prog, setProg] = useState<number[]>(() => SECTIONS.map(() => 0));
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));

  const layoutRef = useRef<{ starts: number[]; reveals: number[]; vh: number; maxScroll: number }>({
    starts: [],
    reveals: [],
    vh: 1,
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
    layoutRef.current = { starts, reveals, vh, maxScroll };
    setDocH(maxScroll + vh);
  }, []);

  useEffect(() => {
    // Crossfade targets: over the last FADE px of a section's range, the next
    // section (always stacked above it) wants opacity 1 — outgoing scene
    // dissolves into the incoming one. The moment the incoming layer is fully
    // opaque, the one beneath switches off.
    const opTargets = (y: number) => {
      const { starts, reveals, vh } = layoutRef.current;
      const FADE = vh * 0.45;
      const last = SECTIONS.length - 1;
      return SECTIONS.map((_, i) => {
        const s = starts[i];
        const end = s + reveals[i];
        if (i !== last && y >= end) return 0; // the layer above covers it
        if (i === 0) return 1; // the landing layer needs no fade-in
        return clamp((y - (s - FADE)) / FADE);
      });
    };

    const update = (y: number, dispOp: number[]) => {
      const { starts, reveals, maxScroll } = layoutRef.current;
      if (!starts.length) return;

      setOp(dispOp);
      setProg(SECTIONS.map((_, i) => clamp((y - starts[i]) / reveals[i])));

      setVisited((prev) => {
        let next = prev;
        dispOp.forEach((o, i) => {
          // fire one-shot entrances only once the layer is mostly faded in
          if (o > 0.55 && !prev.has(i)) {
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

    // Two layers of smoothing, both framerate-driven:
    //  • smooth — the lerped scroll position; gives all progress-driven motion
    //    inertia instead of stepping with the wheel.
    //  • dispOp — displayed layer opacities chasing their scroll-derived
    //    targets with a slower time constant, so a boundary dissolve always
    //    plays out over ~400ms even when the boundary is crossed in one flick
    //    (in either scroll direction). The rAF loop runs until BOTH converge.
    let raf = 0;
    let smooth = window.scrollY;
    let lastT = 0;
    // assigned for real below, once computeLayout() has filled layoutRef
    let dispOp: number[] = [];
    const tick = () => {
      tickingRef.current = true;
      // Framerate-independent smoothing: convergence rates are per-second,
      // so dissolves take the same wall-time at 30fps as at 120fps.
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      const kScroll = 1 - Math.exp(-8.5 * dt);
      const kOp = 1 - Math.exp(-5.5 * dt);

      const target = window.scrollY;
      const diff = target - smooth;
      const scrollDone = Math.abs(diff) < 0.1;
      smooth = scrollDone ? target : smooth + diff * kScroll;

      let opDone = true;
      const targets = opTargets(smooth);
      dispOp = dispOp.map((o, i) => {
        const t = targets[i];
        if (Math.abs(t - o) < 0.004) return t;
        opDone = false;
        return o + (t - o) * kOp;
      });

      update(smooth, dispOp);
      if (scrollDone && opDone) {
        tickingRef.current = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (tickingRef.current) return;
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      computeLayout();
      kick();
    };

    computeLayout();
    dispOp = opTargets(smooth);
    update(smooth, dispOp);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
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
  const layer = (i: number, bg: ReactNode, content: ReactNode) => {
    // Zoom-in fade-out at `zoom` boundaries, driven by the same time-smoothed
    // opacity so it eases and reverses with the dissolve:
    //  • the OUTGOING layer zooms toward the viewer while its own opacity
    //    burns out to the black backdrop (not merely being covered)
    //  • the incoming zoom section grows from slightly small into full size
    const zoomAbove = i + 1 < SECTIONS.length && SECTIONS[i + 1].zoom ? op[i + 1] : 0;
    const selfScale = SECTIONS[i].zoom ? 0.94 + 0.06 * op[i] : 1;
    const scale = (1 + 0.35 * zoomAbove) * selfScale;
    return (
      <div
        key={SECTIONS[i].key}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1 + i,
          opacity: op[i] * (1 - zoomAbove),
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: '50% 50%',
          visibility: op[i] * (1 - zoomAbove) <= 0.001 ? 'hidden' : 'visible',
          pointerEvents: op[i] > 0.5 ? 'auto' : 'none',
          willChange: 'opacity, transform',
        }}
      >
        {bg}
        {content}
      </div>
    );
  };

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
          gap: 16,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/ismora-logo.svg"
          alt="Ismora"
          width={72}
          height={64}
          style={{ filter: 'brightness(0) invert(1)', width: 72, height: 64 }}
          priority
        />
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 40,
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
        <HeroScene progress={prog[0]} active={op[0] > 0.5} />,
        <HeroPanel progress={prog[0]} active={op[0] > 0.5} />
      )}

      {layer(
        1,
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 90% at 30% 0%, #2b2b2e 0%, #121214 45%, #000000 80%), #000',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(50% 40% at 78% 85%, rgba(196,0,10,0.14) 0%, rgba(196,0,10,0) 100%)',
            }}
          />
        </div>,
        <AboutPanel progress={prog[1]} isVisible={visited.has(1)} active={op[1] > 0.5} />
      )}

      {layer(
        2,
        <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
          <Image src="/images/radial-red-bg.png" alt="" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
        </div>,
        <ServicesIntroPanel progress={prog[2]} isVisible={visited.has(2)} active={op[2] > 0.5} />
      )}

      {SERVICE_DETAILS.map((detail, k) =>
        layer(
          k + 3,
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }}>
            {/* faint red atmosphere behind the 3D object's side */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(42% 52% at ${detail.side === 'right' ? '78%' : '28%'} 50%, rgba(196,0,10,0.16) 0%, rgba(196,0,10,0) 100%)`,
              }}
            />
          </div>,
          <ServiceDetailPanel detail={detail} isVisible={op[k + 3] > 0.5} progress={prog[k + 3]} index={k} />
        )
      )}

      {/* Our Works — one section; cards stack & flip as you scroll through it */}
      {layer(
        OURWORKS_START,
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(80% 50% at 50% 110%, rgba(196,0,10,0.12) 0%, rgba(196,0,10,0) 100%)',
            }}
          />
        </div>,
        <OurWorksPanel projects={PROJECTS} progress={prog[OURWORKS_START]} isVisible={op[OURWORKS_START] > 0.5} />
      )}

      {/* Cinematic finish: vignette + animated film grain over everything */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 290,
          pointerEvents: 'none',
          background: 'radial-gradient(115% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
      <div aria-hidden className="film-grain" />

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
            fontSize: 11,
            color: 'rgba(255,255,255,0.85)',
            textTransform: 'uppercase',
            letterSpacing: '0.32em',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          }}
        >
          Scroll to Discover
        </span>
        <span className="scroll-line" />
      </div>
    </>
  );
}
