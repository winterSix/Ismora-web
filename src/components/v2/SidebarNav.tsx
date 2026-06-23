'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SECTIONS = [
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
}

export function SidebarNav({ activeSection, onNavigate }: SidebarNavProps) {
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);

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

  return (
    <nav
      style={{
        position: 'fixed',
        left: 46,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
      }}
    >
      {/* Vertical line — fades out at both ends */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 3,
          top: -24,
          bottom: -24,
          width: 1,
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 18%, rgba(255,255,255,0.22) 82%, rgba(255,255,255,0) 100%)',
        }}
      />

      {SECTIONS.map((label, i) => {
        const isActive = i === activeSection;
        const isDisabled = i > 5;
        return (
          <button
            key={label}
            onClick={() => !isDisabled && onNavigate(i)}
            className="sidebar-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: isDisabled ? 'default' : 'pointer',
              opacity: isDisabled ? 0.35 : 1,
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
              className={isActive ? undefined : 'sidebar-label'}
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
  );
}
