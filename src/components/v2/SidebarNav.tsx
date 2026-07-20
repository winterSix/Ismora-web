'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const DEFAULT_SECTIONS = [
  'Introduction',
  'About Us',
  'Services',
  'Our Works',
  'Meet the Team',
  'Contact Us',
];

interface SidebarNavProps {
  activeSection: number;
  onNavigate: (index: number) => void;
  /** Labels for the currently-enabled sections, in scroll order. Defaults to
   * all six for backwards compatibility with any standalone usage. */
  sections?: string[];
}

export function SidebarNav({ activeSection, onNavigate, sections = DEFAULT_SECTIONS }: SidebarNavProps) {
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  // Below 860px the rail becomes a hamburger-triggered drawer (see globals.css).
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pop the dot of the freshly-activated section so the nav reacts to scroll.
  useEffect(() => {
    const dot = dotsRef.current[activeSection];
    if (!dot) return;
    gsap.fromTo(
      dot,
      { scale: 0.4 },
      { scale: 1, duration: 0.5, ease: 'back.out(3)' }
    );
  }, [activeSection]);

  // Lock background scroll while the drawer is open — this site drives its
  // whole layout off window.scrollY, so a stray wheel/touch behind the menu
  // would otherwise jump sections while the user is just browsing the list.
  // Deliberately NOT the "pin body to position:fixed" trick some sites use
  // for the iOS overflow:hidden quirk: that makes window.scrollY read 0 while
  // locked, which this page's own scroll-driven section tracking picks up as
  // "back at the top", fading the whole nav (including the open drawer) to
  // invisible. touch-action:none on the backdrop blocks touch scroll/pan
  // without touching scrollY at all.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleSelect = (i: number) => {
    onNavigate(i);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger toggle — sits in line with the logo on mobile; hidden on
          desktop, where the labelled rail is always visible. */}
      <button
        type="button"
        className="nav-hamburger"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Backdrop — mobile drawer only */}
      <div
        aria-hidden
        className={`nav-backdrop${mobileOpen ? ' nav-backdrop-open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <nav
        className={`sidebar-nav${mobileOpen ? ' sidebar-nav-open' : ''}`}
        style={{
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Vertical line — fades out at both ends (desktop rail only) */}
        <div
          aria-hidden
          className="nav-line"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 18%, rgba(255,255,255,0.22) 82%, rgba(255,255,255,0) 100%)',
          }}
        />

        {sections.map((label, i) => {
          const isActive = i === activeSection;
          return (
            <button
              key={label}
              onClick={() => handleSelect(i)}
              className="sidebar-item"
              aria-label={label}
              aria-current={isActive ? 'true' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                ref={(el) => {
                  dotsRef.current[i] = el;
                }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: isActive ? '#f0000c' : 'rgba(255,255,255,0.55)',
                  boxShadow: isActive ? '0 0 12px rgba(240,0,12,0.9), 0 0 4px rgba(240,0,12,0.9)' : 'none',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
              />
              <span
                className={isActive ? 'nav-label' : 'nav-label sidebar-label'}
                style={{
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontWeight: isActive ? 500 : 300,
                  fontSize: 11,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  letterSpacing: isActive ? '0.22em' : '0.16em',
                  transition: 'color 0.3s ease, letter-spacing 0.3s ease',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
