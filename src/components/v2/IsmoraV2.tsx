'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { SidebarNav } from './SidebarNav';
import { HeroPanel } from './panels/HeroPanel';
import { AboutPanel } from './panels/AboutPanel';
import { ServicesIntroPanel } from './panels/ServicesIntroPanel';

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function IsmoraV2() {
  const [activeSection, setActiveSection] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [visiblePanels, setVisiblePanels] = useState<Set<number>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);

  // Drive the hero reveal + active-section state from raw scroll position.
  // The hero is a tall "track" with a sticky stage inside it, so scrolling
  // through the first viewport stays pinned on the hero and the scroll
  // progress (0→1) reveals the diamond — it does NOT page to the next panel.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      tickingRef.current = false;
      const vh = container.clientHeight || 1;
      const scrollTop = container.scrollTop;

      // Reveal progress runs 0→1 across the hero's entire pinned scroll range
      // (track height − one viewport), so the full track scrubs the staged
      // reveal: terrain → headline → diamond.
      const trackH = heroTrackRef.current?.offsetHeight ?? vh * 2;
      const revealRange = Math.max(1, trackH - vh);
      setHeroProgress(clamp(scrollTop / revealRange));

      // Active section by which panel owns the viewport centre line.
      const mid = scrollTop + vh / 2;
      const aboutTop = aboutRef.current?.offsetTop ?? Infinity;
      const servicesTop = servicesRef.current?.offsetTop ?? Infinity;
      const idx = mid >= servicesTop ? 2 : mid >= aboutTop ? 1 : 0;
      setActiveSection(idx);
      setVisiblePanels((prev) => (prev.has(idx) ? prev : new Set([...prev, idx])));
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const navigateToSection = useCallback((sectionIndex: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target =
      sectionIndex === 1
        ? aboutRef.current?.offsetTop
        : sectionIndex === 2
          ? servicesRef.current?.offsetTop
          : 0;
    container.scrollTo({ top: target ?? 0, behavior: 'smooth' });
  }, []);

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

      {/* Scroll container */}
      <div ref={containerRef} className="snap-container">

        {/* Panel 0 — Hero: tall track + sticky stage so scrolling reveals the
            diamond while staying pinned on this page. */}
        <div ref={heroTrackRef} className="hero-track">
          <div className="hero-sticky hero-bg">
            <HeroPanel progress={heroProgress} />
          </div>
        </div>

        {/* Panel 1 — About Us */}
        <div ref={aboutRef} className="snap-panel">
          <AboutPanel isVisible={visiblePanels.has(1)} />
        </div>

        {/* Panel 2 — Services Intro */}
        <div ref={servicesRef} className="snap-panel">
          <ServicesIntroPanel isVisible={visiblePanels.has(2)} />
        </div>

      </div>
    </>
  );
}
