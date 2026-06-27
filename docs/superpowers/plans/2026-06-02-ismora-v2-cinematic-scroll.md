# Ismora v2 Cinematic Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Ismora website with a fullscreen, cinematic, scroll-snapping experience comprising 5 viewport-height panels, a fixed left sidebar nav, and scroll-triggered CSS entrance animations.

**Architecture:** A single `'use client'` orchestrator component (`IsmoraV2`) manages `activeSection` state and IntersectionObserver wiring. Five panel components receive an `isVisible` boolean prop and trigger CSS `@keyframes` animations by adding a class when `isVisible` becomes true. Fixed logo and sidebar nav overlay sit outside the scroll container via `position: fixed`.

**Tech Stack:** Next.js 15, Tailwind CSS v4, React 19, no new dependencies.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/v2/IsmoraV2.tsx` | Root client component: scroll container, IntersectionObserver, activeSection state |
| Create | `src/components/v2/SidebarNav.tsx` | Fixed left dot-nav, reads activeSection + onNavigate props |
| Create | `src/components/v2/panels/HeroPanel1.tsx` | Panel 1: bare hero — terrain BG + "Scroll to Discover" |
| Create | `src/components/v2/panels/HeroPanel2.tsx` | Panel 2: hero + animated headline |
| Create | `src/components/v2/panels/HeroPanel3.tsx` | Panel 3: hero + headline + animated cone |
| Create | `src/components/v2/panels/AboutPanel.tsx` | Panel 4: dark gradient, about text, 3 rotating service cards |
| Create | `src/components/v2/panels/ServicesIntroPanel.tsx` | Panel 5: radial-red BG, "What we build" headline, sliding cone |
| Modify | `src/app/page.tsx` | Replace entirely — render `<IsmoraV2 />` |
| Modify | `src/app/globals.css` | Add 4 keyframes + snap-container utility class |
| Delete | `src/components/sections/Hero.tsx` | Replaced by v2 panels |
| Delete | `src/components/sections/About.tsx` | Replaced by AboutPanel |
| Delete | `src/components/sections/FeatureSection.tsx` | Replaced by AboutPanel cards |
| Delete | `src/components/sections/SelectedWorks.tsx` | Out of scope for this phase |
| Delete | `src/components/sections/Faq.tsx` | Out of scope for this phase |
| Delete | `src/components/sections/Cta.tsx` | Out of scope for this phase |
| Delete | `src/components/sections/Footer.tsx` | Out of scope for this phase |
| Delete | `src/components/Navbar.tsx` | Replaced by fixed logo overlay in IsmoraV2 |
| Keep   | `src/components/Logo.tsx` | Reused in IsmoraV2 fixed logo overlay |

---

## Task 0: Download Figma assets to `/public/images/`

**Files:** `/public/images/terrain-bg.png`, `radial-red-bg.png`, `cone.png`

- [ ] **Step 1: Download all three background/object assets**

Run in PowerShell from the project root:

```powershell
Invoke-WebRequest -Uri "https://www.figma.com/api/mcp/asset/e9773e6f-365b-40d0-8bc0-18a97bf5f8a8" -OutFile "public\images\terrain-bg.png"
Invoke-WebRequest -Uri "https://www.figma.com/api/mcp/asset/05fa0f53-eb33-4259-ada6-b9bc27376b0b" -OutFile "public\images\radial-red-bg.png"
Invoke-WebRequest -Uri "https://www.figma.com/api/mcp/asset/ef0f57d7-353d-4122-9234-34c5c6a3c1cb" -OutFile "public\images\cone.png"
```

- [ ] **Step 2: Verify files exist and are non-empty**

```powershell
Get-Item public\images\terrain-bg.png, public\images\radial-red-bg.png, public\images\cone.png | Select-Object Name, Length
```

Expected: all three files with `Length > 0`.

---

## Task 1: Add CSS keyframes + snap utility to `globals.css`

**Files:** Modify `src/app/globals.css`

- [ ] **Step 1: Append keyframes and a snap-panel utility at the end of `globals.css`**

```css
/* ── v2 cinematic scroll ─────────────────────────────────────── */
.snap-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.snap-panel {
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes spin360 {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes slideRight {
  from { transform: translateX(0); }
  to   { transform: translateX(40%); }
}

.animate-fade-slide-up {
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.8s ease-out forwards;
}

.animate-spin-360 {
  animation: spin360 12s linear infinite;
}

.animate-slide-right {
  animation: slideRight 1.2s ease-out forwards;
}
```

- [ ] **Step 2: Verify the dev server still compiles without errors**

```bash
npm run dev
```

Open `http://localhost:3000` — no CSS errors in browser console.

---

## Task 2: Create `SidebarNav.tsx`

**Files:** Create `src/components/v2/SidebarNav.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

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
  return (
    <nav
      style={{
        position: 'fixed',
        left: 46,
        top: 292,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
      }}
    >
      {/* Vertical line on the left */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 4,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(255,255,255,0.25)',
        }}
      />

      {SECTIONS.map((label, i) => {
        const isActive = i === activeSection;
        const isDisabled = i > 2; // panels 3-5 not built yet
        return (
          <button
            key={label}
            onClick={() => !isDisabled && onNavigate(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: isDisabled ? 'default' : 'pointer',
              opacity: isDisabled ? 0.4 : 1,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isActive ? '#f0000c' : '#ffffff',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: isActive ? 500 : 300,
                fontSize: isActive ? 16 : 14,
                color: isActive ? '#f0000c' : '#ffffff',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
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
```

---

## Task 3: Create `HeroPanel1.tsx`

**Files:** Create `src/components/v2/panels/HeroPanel1.tsx`

The bare hero — terrain background, no headline, "Scroll to Discover" at bottom.

- [ ] **Step 1: Create the component**

```tsx
import Image from 'next/image';

export function HeroPanel1() {
  return (
    <div className="snap-panel">
      {/* terrain background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/terrain-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* Scroll to Discover */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 16,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Scroll to Discover
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </div>
  );
}
```

---

## Task 4: Create `HeroPanel2.tsx`

**Files:** Create `src/components/v2/panels/HeroPanel2.tsx`

Same terrain BG, headline fades in when `isVisible` becomes true.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import Image from 'next/image';

interface HeroPanel2Props {
  isVisible: boolean;
}

export function HeroPanel2({ isVisible }: HeroPanel2Props) {
  return (
    <div className="snap-panel">
      {/* terrain background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/terrain-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 clamp(24px, 6vw, 120px)',
        }}
      >
        <h1
          className={isVisible ? 'animate-fade-slide-up' : ''}
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 58px)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 700,
            opacity: isVisible ? undefined : 0,
          }}
        >
          We build the platforms African businesses depend on
        </h1>
      </div>

      {/* Scroll to Discover */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 16,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Scroll to Discover
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </div>
  );
}
```

---

## Task 5: Create `HeroPanel3.tsx`

**Files:** Create `src/components/v2/panels/HeroPanel3.tsx`

Terrain BG + headline (always visible) + cone materialises when `isVisible`.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import Image from 'next/image';

interface HeroPanel3Props {
  isVisible: boolean;
}

export function HeroPanel3({ isVisible }: HeroPanel3Props) {
  return (
    <div className="snap-panel">
      {/* terrain background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/terrain-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* Cone + Headline stacked */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 clamp(24px, 6vw, 120px)',
        }}
      >
        {/* Cone */}
        <div
          className={isVisible ? 'animate-scale-in' : ''}
          style={{
            width: 204,
            height: 204,
            opacity: isVisible ? undefined : 0,
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/cone.png"
            alt=""
            width={204}
            height={204}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Headline — always visible in this panel */}
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 58px)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 700,
            margin: 0,
          }}
        >
          We build the platforms African businesses depend on
        </h1>
      </div>

      {/* Scroll to Discover */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 16,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Scroll to Discover
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </div>
  );
}
```

---

## Task 6: Create `AboutPanel.tsx`

**Files:** Create `src/components/v2/panels/AboutPanel.tsx`

Dark gradient panel — cone top-center, About Us heading, two paragraphs, three rotating service cards.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import Image from 'next/image';

const CARDS = [
  {
    title: 'Data that shows its work',
    image: '/images/orb.png',
    paragraph:
      'Numbers without context are noise. We build the dashboards, reports, and analytics layers that let leaders see what's actually happening in their business and defend the decisions they make from it. Real-time when it has to be. Audit-grade when it counts.',
  },
  {
    title: 'The systems beneath the business',
    image: '/images/cube.png',
    paragraph:
      'The unglamorous middle layer is where most software projects fail. We build platforms, integrations, and connected systems that work reliably across every transaction, shift, and audit, from web and mobile to payments, identity, backend systems, and hardware.',
  },
  {
    title: 'Built for here, not borrowed from elsewhere',
    image: '/images/swirl.png',
    paragraph:
      'Great software for Nigerian businesses isn't copied from Silicon Valley. It's built for local realities, unstable networks, regulatory demands, real team workflows, and unreliable internet. We design systems that work in the environments our clients actually operate in.',
  },
];

interface AboutPanelProps {
  isVisible: boolean;
}

export function AboutPanel({ isVisible }: AboutPanelProps) {
  return (
    <div
      className="snap-panel"
      style={{ background: 'linear-gradient(to bottom, #323232 0%, #000000 38%)' }}
    >
      {/* Cone top-center */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: 'calc(50% - 331px)',
          width: 204,
          height: 204,
          zIndex: 5,
        }}
      >
        <Image src="/images/cone.png" alt="" width={204} height={204} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* Main content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 clamp(24px, 6vw, 96px)',
          gap: 40,
          overflowY: 'auto',
        }}
      >
        {/* About Us heading */}
        <div
          className={isVisible ? 'animate-fade-slide-up' : ''}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            opacity: isVisible ? undefined : 0,
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
                fontSize: 28,
                color: '#ffffff',
                letterSpacing: '-0.04em',
              }}
            >
              About Us
            </span>
          </div>

          {/* About text */}
          <div style={{ maxWidth: 1201 }}>
            <p
              style={{
                fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(1rem, 1.8vw, 28px)',
                lineHeight: 1.5,
                letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              <strong style={{ color: '#ffffff' }}>Ismora Technologies Limited </strong>
              <span style={{ color: '#bababa' }}>
                was founded in Lagos in 2026 by Ismail Raji. The company builds software, integrated infrastructure, and connected systems for institutions, founders, and operating teams.
              </span>
            </p>
            <p
              style={{
                fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(1rem, 1.8vw, 28px)',
                lineHeight: 1.5,
                letterSpacing: '-0.04em',
                color: '#bababa',
                marginTop: '1em',
                marginBottom: 0,
              }}
            >
              Ismora was created to solve a major gap in Africa's business landscape. Many companies are expected to meet global standards using systems and tools that were not built for local realities like unreliable networks, strict regulations, and operational challenges. Instead of treating these as obstacles, Ismora sees them as the foundation for better design and innovation.
            </p>
          </div>
        </div>

        {/* Service cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {CARDS.map((card, i) => (
            <ServiceCard
              key={card.title}
              {...card}
              isVisible={isVisible}
              delay={0.2 + i * 0.15}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  title,
  image,
  paragraph,
  isVisible,
  delay,
}: {
  title: string;
  image: string;
  paragraph: string;
  isVisible: boolean;
  delay: number;
}) {
  return (
    <div
      className={isVisible ? 'animate-fade-slide-up' : ''}
      style={{
        position: 'relative',
        padding: '24px',
        opacity: isVisible ? undefined : 0,
        animationDelay: isVisible ? `${delay}s` : undefined,
      }}
    >
      {/* Top-left corner bracket */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 65,
          height: 65,
          borderTop: '1px solid #ffffff',
          borderLeft: '1px solid #ffffff',
        }}
      />
      {/* Bottom-right corner bracket */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 65,
          height: 65,
          borderBottom: '1px solid #ffffff',
          borderRight: '1px solid #ffffff',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title */}
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </p>

        {/* Horizontal rule */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.25)', width: '100%' }} />

        {/* Rotating 3D image */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 180,
          }}
        >
          <div className="animate-spin-360" style={{ width: 140, height: 140 }}>
            <Image
              src={image}
              alt=""
              width={140}
              height={140}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Paragraph */}
        <p
          className="card-paragraph"
          style={{
            fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 15,
            lineHeight: 1.4,
            color: '#e0e0e6',
            margin: 0,
            transition: 'color 0.2s ease',
          }}
        >
          {paragraph}
        </p>
      </div>

      <style>{`
        .card-paragraph:hover { color: #ffffff !important; }
      `}</style>
    </div>
  );
}
```

---

## Task 7: Create `ServicesIntroPanel.tsx`

**Files:** Create `src/components/v2/panels/ServicesIntroPanel.tsx`

Full-screen radial red background, centered headline, cone that slides right when visible.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import Image from 'next/image';

interface ServicesIntroPanelProps {
  isVisible: boolean;
}

export function ServicesIntroPanel({ isVisible }: ServicesIntroPanelProps) {
  return (
    <div className="snap-panel">
      {/* Radial red background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/radial-red-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* Cone top-center — slides right when visible */}
      <div
        className={isVisible ? 'animate-slide-right' : ''}
        style={{
          position: 'absolute',
          top: 190,
          left: 'calc(50% - 12px)',
          width: 204,
          height: 204,
          zIndex: 5,
          transform: isVisible ? undefined : 'translateX(0)',
        }}
      >
        <Image
          src="/images/cone.png"
          alt=""
          width={204}
          height={204}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Centered headline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 clamp(24px, 6vw, 120px)',
        }}
      >
        <h2
          className={isVisible ? 'animate-fade-slide-up' : ''}
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 58px)',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            textAlign: 'center',
            opacity: isVisible ? undefined : 0,
            margin: 0,
          }}
        >
          What we build and<br />How we build it
        </h2>
      </div>

      {/* Scroll to Discover */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 400,
            fontSize: 16,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Scroll to Discover
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </div>
  );
}
```

---

## Task 8: Create `IsmoraV2.tsx` (orchestrator)

**Files:** Create `src/components/v2/IsmoraV2.tsx`

Manages scroll container, IntersectionObserver, activeSection state. Renders fixed logo + SidebarNav + all 5 panels.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { SidebarNav } from './SidebarNav';
import { HeroPanel1 } from './panels/HeroPanel1';
import { HeroPanel2 } from './panels/HeroPanel2';
import { HeroPanel3 } from './panels/HeroPanel3';
import { AboutPanel } from './panels/AboutPanel';
import { ServicesIntroPanel } from './panels/ServicesIntroPanel';

export function IsmoraV2() {
  const [activeSection, setActiveSection] = useState(0);
  const [visiblePanels, setVisiblePanels] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver: track which panel is in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = panelRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index === -1) return;

          if (entry.isIntersecting) {
            // Map panel index → sidebar section index
            const sectionMap = [0, 0, 0, 1, 2]; // panels 0-2 = Introduction, 3 = About, 4 = Services
            setActiveSection(sectionMap[index] ?? 0);
            setVisiblePanels((prev) => new Set([...prev, index]));
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    panelRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const navigateToSection = useCallback((sectionIndex: number) => {
    // Section index → first panel that corresponds to it
    const sectionToPanel = [0, 3, 4];
    const panelIndex = sectionToPanel[sectionIndex] ?? 0;
    panelRefs.current[panelIndex]?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const setPanelRef = (index: number) => (el: HTMLDivElement | null) => {
    panelRefs.current[index] = el;
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
          gap: 10,
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
            fontSize: 20,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          ismora™
        </span>
      </div>

      {/* Fixed Sidebar Nav */}
      <SidebarNav activeSection={activeSection} onNavigate={navigateToSection} />

      {/* Scroll-snap container */}
      <div ref={containerRef} className="snap-container">
        <div ref={setPanelRef(0)}>
          <HeroPanel1 />
        </div>
        <div ref={setPanelRef(1)}>
          <HeroPanel2 isVisible={visiblePanels.has(1)} />
        </div>
        <div ref={setPanelRef(2)}>
          <HeroPanel3 isVisible={visiblePanels.has(2)} />
        </div>
        <div ref={setPanelRef(3)}>
          <AboutPanel isVisible={visiblePanels.has(3)} />
        </div>
        <div ref={setPanelRef(4)}>
          <ServicesIntroPanel isVisible={visiblePanels.has(4)} />
        </div>
      </div>
    </>
  );
}
```

---

## Task 9: Replace `page.tsx`

**Files:** Modify `src/app/page.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
import { IsmoraV2 } from '@/components/v2/IsmoraV2';

export default function HomePage() {
  return <IsmoraV2 />;
}
```

---

## Task 10: Delete old components

**Files:** Delete all listed files

- [ ] **Step 1: Delete section components and Navbar**

```powershell
Remove-Item "src\components\sections\Hero.tsx" -Force
Remove-Item "src\components\sections\About.tsx" -Force
Remove-Item "src\components\sections\FeatureSection.tsx" -Force
Remove-Item "src\components\sections\SelectedWorks.tsx" -Force
Remove-Item "src\components\sections\Faq.tsx" -Force
Remove-Item "src\components\sections\Cta.tsx" -Force
Remove-Item "src\components\sections\Footer.tsx" -Force
Remove-Item "src\components\Navbar.tsx" -Force
```

- [ ] **Step 2: Verify dev server still compiles**

```bash
npm run dev
```

No TypeScript or import errors in the terminal.

---

## Task 11: Verify the full experience in browser

- [ ] **Step 1: Open `http://localhost:3000`**

Check:
- Logo visible top-left ✓
- Sidebar nav visible left side, "Introduction" active (red) ✓
- Panel 1: terrain BG, "Scroll to Discover" at bottom ✓
- Scroll once: Panel 2 snaps in, headline fades up ✓
- Scroll twice: Panel 3 snaps in, cone scales in ✓
- Scroll three times: Panel 4 snaps in, dark gradient, cone top, about text, 3 cards with spinning images ✓
- Scroll four times: Panel 5 snaps in, radial red BG, headline centered, cone slides right ✓
- Sidebar nav dot updates to match active section on each snap ✓
- Clicking sidebar dot navigates to the correct panel ✓
- Service card paragraph text turns white on hover ✓
