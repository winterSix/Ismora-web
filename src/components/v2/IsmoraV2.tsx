'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { SidebarNav } from './SidebarNav';
import { HeroScene } from './HeroScene';
import { HeroPanel } from './panels/HeroPanel';
import { AboutPanel } from './panels/AboutPanel';
import { ServicesIntroPanel } from './panels/ServicesIntroPanel';
import { ServiceDetailPanel, SERVICE_DETAILS } from './panels/ServiceDetailPanel';
import { OurWorksPanel, PROJECTS, type Project } from './panels/OurWorksPanel';
import { MeetTheTeamPanel } from './panels/MeetTheTeamPanel';
import { ContactPanel } from './panels/ContactPanel';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Each section owns a scroll "reveal" length (in viewport multiples). After the
// reveal, a short transition crossfades to the next section. Sections are
// stacked full-screen layers — they fade between each other, never slide over
// one another. `zoom: true` marks a section whose entrance is a camera
// push-in: the outgoing layer scales up toward the viewer as it dissolves
// while this one grows into place.
// `reveal` is how many viewport-heights of scroll a section occupies. Sections
// whose content animates WITH the scroll (the hero reveals the diamond, About
// scrolls its words, Services flies the cube) need a long range. The rest are
// static — their content plays a one-shot entrance, then nothing changes — so
// they get a short range (~0.8vh): a single scroll moves on to the next instead
// of dragging through a screenful of "nothing happening".
const DETAIL_START = 3;
const OURWORKS_START = DETAIL_START + SERVICE_DETAILS.length;
const TEAM_START = OURWORKS_START + 1;
const CONTACT_START = TEAM_START + 1;

// Section index → sidebar item
// (0 Intro, 1 About, 2 Services, 3 Our Works, 4 Meet the Team, 5 Contact)
const sidebarFor = (i: number) =>
  i === 0
    ? 0
    : i === 1
      ? 1
      : i < OURWORKS_START
        ? 2
        : i === OURWORKS_START
          ? 3
          : i === TEAM_START
            ? 4
            : 5;
// Sections crossfade at their boundaries: the incoming layer (stacked above)
// fades in over the outgoing one during the final stretch of its scroll
// range, then the outgoing layer switches off once fully covered.

export function IsmoraV2({ projects = PROJECTS }: { projects?: Project[] } = {}) {
  // 'works' is the only section whose scroll range depends on runtime data (the
  // number of Work items fetched from the API), so SECTIONS is built here
  // instead of at module scope — everything else about it is static.
  const SECTIONS = useMemo<{ key: string; reveal: number; zoom?: boolean }[]>(
    () => [
      { key: 'hero', reveal: 2.8 },
      { key: 'about', reveal: 3.4 },
      // Services intro is a one-shot title card (its scroll-driven cube is
      // disabled via SHOW_LOGO), so it's effectively static — keep its scroll
      // range short.
      { key: 'services', reveal: 1.0 },
      ...SERVICE_DETAILS.map((_, i) => ({ key: `d${i}`, reveal: 0.8, zoom: i === 0 })),
      // Our Works is ONE scroll-driven section (cards stack & flip within it)
      { key: 'works', reveal: 1.3 + 0.9 * Math.max(0, projects.length - 1) },
      { key: 'team', reveal: 0.8 },
      { key: 'contact', reveal: 0.9 },
    ],
    [projects.length]
  );

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
  // Last width the layout was computed for — see onResize below.
  const lastWidthRef = useRef(0);

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
    lastWidthRef.current = window.innerWidth;
    setDocH(maxScroll + vh);
  }, [SECTIONS]);

  useEffect(() => {
    // Per-section displayed opacity. Only the ACTIVE section eases up (0→1, a
    // fade-in from the black backdrop); every other section is cut to 0 instantly.
    // So at most one section's content is ever on screen (no bleed-through), the
    // fade-in reliably animates (driven here in JS — a CSS transition wouldn't
    // fire because the value and the transition flip in the same commit), and a
    // section is always fully opaque at rest. `zoom` sections turn this same eased
    // value into a camera push-in (see layer()).
    let eased: number[] = SECTIONS.map((_, i) => (i === 0 ? 1 : 0));

    const update = (y: number, kFade: number) => {
      const { starts, reveals, maxScroll } = layoutRef.current;
      if (!starts.length) return true;

      // Active section = the topmost one whose start the scroll has reached.
      // (2px tolerance: starts are fractional pixels but scrollY rounds to whole,
      // so a smooth-scroll to a section can settle a fraction short of its start.)
      let cur = 0;
      for (let i = 0; i < starts.length; i++) {
        if (y >= starts[i] - 2) cur = i;
      }

      let fadeDone = true;
      eased = SECTIONS.map((_, i) => {
        if (i !== cur) return 0; // instant cut — the outgoing layer never lingers
        const v = eased[i] + (1 - eased[i]) * kFade;
        if (v < 0.999) fadeDone = false;
        return v > 0.999 ? 1 : v;
      });

      setOp(eased);
      setProg(SECTIONS.map((_, i) => clamp((y - starts[i]) / reveals[i])));
      setVisited((prev) => (prev.has(cur) ? prev : new Set(prev).add(cur)));
      setActiveSection(sidebarFor(cur));
      setAtEnd(y >= maxScroll - 8);
      return fadeDone;
    };

    // Smooth the raw scroll position so progress-driven motion inside panels has
    // inertia instead of stepping with the wheel.
    let raf = 0;
    let smooth = window.scrollY;
    let lastT = 0;
    const tick = () => {
      tickingRef.current = true;
      // Framerate-independent smoothing: rates are per-second, so motion takes the
      // same wall-time at 30fps as at 120fps.
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      const kScroll = 1 - Math.exp(-8.5 * dt);
      const kFade = 1 - Math.exp(-7 * dt); // ~0.45s fade-in / push-in

      const target = window.scrollY;
      const diff = target - smooth;
      const scrollDone = Math.abs(diff) < 0.1;
      smooth = scrollDone ? target : smooth + diff * kScroll;

      const fadeDone = update(smooth, kFade);
      // Keep ticking until the scroll has settled AND the active layer has fully
      // faded in, so the entrance still completes after the scroll stops.
      if (scrollDone && fadeDone) {
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
      // Mobile browsers fire `resize` as the address bar collapses/expands
      // WHILE the page is being scrolled (innerHeight changes, nothing else
      // does). Recomputing the section boundaries on every one of those
      // shifts them under a scroll position that hasn't actually moved, which
      // can flip the "active section" backward for a frame and fade it back
      // in — a visible flicker. A genuine resize (orientation change, window
      // drag, real device rotation) always changes the width too, so gate on
      // that instead of reacting to every height-only tick.
      if (window.innerWidth === lastWidthRef.current) return;
      computeLayout();
      kick();
    };

    computeLayout();
    update(smooth, 1); // initial state set instantly (no fade on first paint)
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
      sidebarIndex === 0
        ? 0
        : sidebarIndex === 1
          ? 1
          : sidebarIndex === 2
            ? 2
            : sidebarIndex === 3
              ? OURWORKS_START
              : sidebarIndex === 4
                ? TEAM_START
                : CONTACT_START;
    window.scrollTo({ top: starts[sectionIndex] ?? 0, behavior: 'smooth' });
  }, []);

  // Renders one stacked full-screen section layer (background + content).
  // op[i] is driven per-frame in JS (see update): the active section eases 0→1,
  // every other section is 0. So the incoming section fades up from the black
  // backdrop while the outgoing is cut instantly — two pages are never both
  // visible, yet the entrance still animates and the resting section is fully
  // opaque. `zoom` sections (the first service detail) turn the same eased value
  // into a "camera push-in": they scale up from notably smaller as they fade in,
  // restoring the original entrance you get scrolling down from the Services intro.
  const layer = (i: number, bg: ReactNode, content: ReactNode) => {
    const shown = op[i] > 0.001;
    const zoomIn = SECTIONS[i].zoom;
    // `zoom` sections (first service detail) push in: content grows 0.84→1 on
    // entry. Capped at 1 (no overscan) so content is never cropped.
    const contentScale = zoomIn ? 0.84 + 0.16 * op[i] : 1;
    // Scroll-linked parallax so motion tracks the wheel instead of feeling like
    // "scrolling the air" on the otherwise-pinned layers. `prog` is the smoothed
    // 0→1 scroll position through this section, so the drift eases.
    //   • The BACKGROUND drifts the most and is overscanned — it's decorative, so
    //     the slight crop the overscan causes is invisible.
    //   • The CONTENT drifts only a little and is NEVER overscanned, so nothing
    //     edge-anchored (e.g. the Contact footer) is ever clipped.
    const p = prog[i] ?? 0;
    const bgDrift = (0.5 - p) * 6.4; // ±3.2% of viewport
    const contentDrift = (0.5 - p) * 2.4; // ±1.2% of viewport
    return (
      <div
        key={SECTIONS[i].key}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1 + i,
          opacity: op[i],
          visibility: shown ? 'visible' : 'hidden',
          pointerEvents: op[i] > 0.5 ? 'auto' : 'none',
          willChange: 'opacity',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate3d(0, ${bgDrift}%, 0) scale(1.085)`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          {bg}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate3d(0, ${contentDrift}%, 0) scale(${contentScale})`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          {content}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Fixed Logo. ismora-mark.svg is tightly cropped to the mark's ink, so
          the image box equals the visible mark — its left edge aligns with the
          sidebar's vertical line (x≈49) and its height is matched to the
          wordmark's cap height so the two read at the same size. */}
      <div className="brand-logo">
        <Image
          src="/ismora-mark.svg"
          alt="Ismora"
          width={22}
          height={22}
          className="brand-mark"
          priority
        />
        <span className="brand-word">ısmora</span>
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
          <Image src="/images/radial-red-bg.png" alt="" fill className="services-bg-image" />
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
        <OurWorksPanel projects={projects} progress={prog[OURWORKS_START]} isVisible={op[OURWORKS_START] > 0.5} />
      )}

      {/* Meet the Team */}
      {layer(
        TEAM_START,
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }} />,
        <MeetTheTeamPanel isVisible={op[TEAM_START] > 0.5} />
      )}

      {/* Let's Connect / Contact */}
      {layer(
        CONTACT_START,
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }} />,
        <ContactPanel isVisible={op[CONTACT_START] > 0.5} />
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
        className="scroll-hint"
        style={{
          opacity: atEnd ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <span className="scroll-hint-label">Scroll to Discover</span>
        <span className="scroll-line" />
      </div>
    </>
  );
}
