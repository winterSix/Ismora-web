'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { SidebarNav } from './SidebarNav';
import { HeroScene } from './HeroScene';
import { HeroPanel } from './panels/HeroPanel';
import { AboutPanel } from './panels/AboutPanel';
import { ServicesIntroPanel } from './panels/ServicesIntroPanel';
import { ServiceDetailPanel, SERVICE_DETAILS, type ServiceDetail } from './panels/ServiceDetailPanel';
import { OurWorksPanel, PROJECTS, type Project } from './panels/OurWorksPanel';
import { MeetTheTeamPanel, TEAM, type Member } from './panels/MeetTheTeamPanel';
import { ContactPanel } from './panels/ContactPanel';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  work: boolean;
  team: boolean;
  contact: boolean;
}

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  about: true,
  services: true,
  work: true,
  team: true,
  contact: true,
};

interface RenderCtx {
  i: number; // resolved flat slide index
  prog: number; // this slide's smoothed 0..1 scroll progress
  active: boolean; // op[i] > 0.5 — "fully in view"
  visited: boolean; // has this slide's group ever been scrolled to
}

interface Slide {
  key: string;
  reveal: number; // viewport-heights of scroll this slide occupies
  zoom?: boolean; // camera push-in entrance (first service detail only)
  renderBg: (ctx: RenderCtx) => ReactNode;
  renderContent: (ctx: RenderCtx) => ReactNode;
}

interface Group {
  key: keyof SectionVisibility;
  label: string;
  slides: Slide[];
}

// Every section's slide(s) + the data-driven parts (project/service/member
// counts) that decide how many slides a group actually has. Grouping keeps
// "one sidebar item can span multiple scroll slides" (Services: intro + N
// detail slides) explicit instead of encoded in index arithmetic.
function buildGroups(projects: Project[], services: ServiceDetail[], members: Member[]): Group[] {
  return [
    {
      key: 'hero',
      label: 'Introduction',
      slides: [
        {
          key: 'hero',
          reveal: 2.8,
          renderBg: ({ prog, active }) => <HeroScene progress={prog} active={active} />,
          renderContent: ({ prog, active }) => <HeroPanel progress={prog} active={active} />,
        },
      ],
    },
    {
      key: 'about',
      label: 'About Us',
      slides: [
        {
          key: 'about',
          reveal: 3.4,
          renderBg: () => (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(120% 90% at 30% 0%, #2b2b2e 0%, #121214 45%, #000000 80%), #000',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(50% 40% at 78% 85%, rgba(196,0,10,0.14) 0%, rgba(196,0,10,0) 100%)',
                }}
              />
            </div>
          ),
          renderContent: ({ prog, active, visited }) => <AboutPanel progress={prog} isVisible={visited} active={active} />,
        },
      ],
    },
    {
      key: 'services',
      label: 'Services',
      slides: [
        {
          key: 'services-intro',
          // Services intro is a one-shot title card (its scroll-driven cube
          // is disabled via SHOW_LOGO), so it's effectively static — keep its
          // scroll range short.
          reveal: 1.0,
          renderBg: () => (
            <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
              <Image src="/images/radial-red-bg.png" alt="" fill className="services-bg-image" />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
            </div>
          ),
          renderContent: ({ prog, active, visited }) => <ServicesIntroPanel progress={prog} isVisible={visited} active={active} />,
        },
        ...services.map(
          (detail, k): Slide => ({
            key: `service-detail-${k}`,
            reveal: 0.8,
            zoom: k === 0,
            renderBg: () => (
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(42% 52% at ${detail.side === 'right' ? '78%' : '28%'} 50%, rgba(196,0,10,0.16) 0%, rgba(196,0,10,0) 100%)`,
                  }}
                />
              </div>
            ),
            renderContent: ({ prog, active }) => <ServiceDetailPanel detail={detail} isVisible={active} progress={prog} index={k} />,
          })
        ),
      ],
    },
    {
      key: 'work',
      label: 'Our Works',
      slides: [
        {
          key: 'work',
          // Our Works is ONE scroll-driven section (cards stack & flip within it)
          reveal: 1.3 + 0.9 * Math.max(0, projects.length - 1),
          renderBg: () => (
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(80% 50% at 50% 110%, rgba(196,0,10,0.12) 0%, rgba(196,0,10,0) 100%)',
                }}
              />
            </div>
          ),
          renderContent: ({ prog, active }) => <OurWorksPanel projects={projects} progress={prog} isVisible={active} />,
        },
      ],
    },
    {
      key: 'team',
      label: 'Meet the Team',
      slides: [
        {
          key: 'team',
          reveal: 0.8,
          renderBg: () => <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }} />,
          renderContent: ({ active }) => <MeetTheTeamPanel isVisible={active} members={members} />,
        },
      ],
    },
    {
      key: 'contact',
      label: 'Contact Us',
      slides: [
        {
          key: 'contact',
          reveal: 0.9,
          renderBg: () => <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000' }} />,
          renderContent: ({ active }) => <ContactPanel isVisible={active} />,
        },
      ],
    },
  ];
}

export function IsmoraV2({
  projects = PROJECTS,
  services = SERVICE_DETAILS,
  members = TEAM,
  visibility = DEFAULT_VISIBILITY,
}: {
  projects?: Project[];
  services?: ServiceDetail[];
  members?: Member[];
  visibility?: SectionVisibility;
} = {}) {
  // Disabled sections are dropped as WHOLE groups before flattening, so a
  // hidden section never leaves a blank scroll dead-zone behind — everything
  // downstream (indices, sidebar labels, nav targets) is derived from the
  // filtered, flattened list, never from a fixed section count.
  const enabledGroups = useMemo(
    () => buildGroups(projects, services, members).filter((g) => visibility[g.key]),
    [projects, services, members, visibility]
  );

  const sidebarLabels = useMemo(() => enabledGroups.map((g) => g.label), [enabledGroups]);

  // Metadata only (key/reveal/zoom) — this is what scroll-math needs. Kept as
  // its own memo so computeLayout's dependency is stable content, not the
  // JSX-producing render closures (which are cheap to rebuild every render).
  const SECTIONS = useMemo(
    () => enabledGroups.flatMap((g) => g.slides.map((s) => ({ key: s.key, reveal: s.reveal, zoom: s.zoom }))),
    [enabledGroups]
  );

  // Which enabled-group ordinal (sidebar index) each flat slide index belongs
  // to, and the first flat index of each group (a sidebar click's jump target).
  const { sidebarIndexForSlide, groupStartIndex } = useMemo(() => {
    const forSlide: number[] = [];
    const starts: number[] = [];
    let flatIndex = 0;
    enabledGroups.forEach((g, groupIndex) => {
      starts.push(flatIndex);
      g.slides.forEach(() => {
        forSlide.push(groupIndex);
        flatIndex += 1;
      });
    });
    return { sidebarIndexForSlide: forSlide, groupStartIndex: starts };
  }, [enabledGroups]);

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
    const maxScroll = last >= 0 ? starts[last] + reveals[last] : 0;
    layoutRef.current = { starts, reveals, vh, maxScroll };
    lastWidthRef.current = window.innerWidth;
    setDocH(maxScroll + vh);
  }, [SECTIONS]);

  useEffect(() => {
    if (SECTIONS.length === 0) return;

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
      setActiveSection(sidebarIndexForSlide[cur] ?? 0);
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
  }, [computeLayout, SECTIONS, sidebarIndexForSlide]);

  const navigateToSection = useCallback(
    (sidebarIndex: number) => {
      const { starts } = layoutRef.current;
      const sectionIndex = groupStartIndex[sidebarIndex] ?? 0;
      window.scrollTo({ top: starts[sectionIndex] ?? 0, behavior: 'smooth' });
    },
    [groupStartIndex]
  );

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
      <SidebarNav activeSection={activeSection} onNavigate={navigateToSection} sections={sidebarLabels} />

      {/* Base black backdrop — shown during fade-through-black transitions */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000', pointerEvents: 'none' }} />

      {/* Stacked full-screen section layers — fade through black, never slide.
          Flattened from the enabled groups, in order; disabled sections
          contribute no slides at all, so there's no dead scroll range. */}
      {enabledGroups.flatMap((group, groupIndex) =>
        group.slides.map((slide, slideIndexInGroup) => {
          const flatIndex = groupStartIndex[groupIndex] + slideIndexInGroup;
          const ctx: RenderCtx = {
            i: flatIndex,
            prog: prog[flatIndex] ?? 0,
            active: (op[flatIndex] ?? 0) > 0.5,
            visited: visited.has(flatIndex),
          };
          return layer(flatIndex, slide.renderBg(ctx), slide.renderContent(ctx));
        })
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
