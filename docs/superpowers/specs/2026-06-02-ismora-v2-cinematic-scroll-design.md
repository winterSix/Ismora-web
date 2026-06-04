# Ismora Website v2 — Cinematic Scroll Design

**Date:** 2026-06-02  
**Figma file:** `UvqW5dz0qEvObhVZpGowkq` (Ismora Website v2 — Design)  
**Branch:** New branch (isolated from v1)

---

## Overview

A complete replacement of the existing Ismora website with a fullscreen, cinematic, scroll-snapping experience. Five full-viewport panels tell the brand story in sequence. Two fixed overlays (logo, sidebar nav) persist across all panels. No new npm dependencies.

---

## Architecture

### Scroll container

A single `SnapContainer` div inside `<main>`:

```css
height: 100vh;
overflow-y: scroll;
scroll-snap-type: y mandatory;
```

Each child panel:

```css
height: 100vh;
scroll-snap-align: start;
position: relative;
overflow: hidden;
```

### Fixed overlays (outside the snap container, always visible)

- **Logo** — `position: fixed; top: 50px; left: 50px; z-index: 100`  
  Ismora grid icon + wordmark, both served from `/public/images/`.

- **SidebarNav** — `position: fixed; left: 46px; top: 292px; z-index: 100`  
  Vertical list of 6 section items. Each item: 8px dot + uppercase label (Space Grotesk).  
  Active item: dot = `#f0000c`, label = `#f0000c`, font-weight medium, 16px.  
  Inactive: dot = white, label = white, font-weight light, 14px.  
  A vertical line runs along the left of the list.  
  Clicking any item calls `panelRef.scrollIntoView({ behavior: 'smooth' })`.  
  An `IntersectionObserver` (threshold 0.6) on each panel updates `activeSection` state in a React context, which `SidebarNav` reads.

### Section labels for sidebar

| Index | Label |
|-------|-------|
| 0 | Introduction |
| 1 | About Us |
| 2 | Services |
| 3 | Our Works |
| 4 | Meet the Team |
| 5 | Contact Us |

Items 3–5 are present in the sidebar but do not have a corresponding panel yet (future work). They are rendered as inactive/disabled dots.

---

## Panel Specifications

### Panel 1 — Hero Bare (Figma node 316-384)

**Background:** `terrain-bg.png` full-cover + `rgba(0,0,0,0.2)` dark overlay.  
**Content:**
- "SCROLL TO DISCOVER" text + chevron-down icon, centered horizontally at `bottom: 80px`. Space Grotesk Regular, 16px, white, uppercase.
- No headline text. No cone.

**Active sidebar item:** Introduction

---

### Panel 2 — Hero + Headline

**Background:** Same `terrain-bg.png` (identical to Panel 1).  
**Content:**
- Centered headline: **"We build the platforms African businesses depend on"**  
  Space Grotesk Regular, `clamp(2.5rem, 4vw, 58px)`, white, `letter-spacing: -0.04em`, line-height 1.1.  
  Animation: `fadeSlideUp` — `opacity: 0 → 1`, `translateY: 30px → 0`, duration 0.6s ease-out.  
  Triggered once when IntersectionObserver fires (`threshold: 0.6`).
- "SCROLL TO DISCOVER" + chevron at bottom (same as Panel 1).

**Active sidebar item:** Introduction

---

### Panel 3 — Hero + Headline + Cone

**Background:** Same `terrain-bg.png`.  
**Content:**
- Same headline as Panel 2 (always visible, no re-animation).
- **Cone** floats above headline, horizontally centered.  
  Image: `/public/images/cone.png`, size ~204×204px.  
  Animation: `scaleIn` — `opacity: 0 → 1`, `scale: 0 → 1`, duration 0.8s ease-out.  
  Triggered once when IntersectionObserver fires.

**Active sidebar item:** Introduction

---

### Panel 4 — About Us (Figma node 316-743)

**Background:** CSS gradient `linear-gradient(to bottom, #323232 0%, #000 38%)`.  
**Content (top to bottom):**

1. **Cone** — top-center, `left: calc(50% - 331px)`, `top: -20px`, size 204×204px. Always visible, no animation.

2. **About heading** — left-aligned, `left: calc(50% + 53.5px - 600px)` (or centered block).  
   Logo icon (27×24px) + "About Us" label (Space Grotesk Medium, 28px, white, `letter-spacing: -0.04em`).

3. **About text block** — two paragraphs at 28px:  
   - Para 1: "Ismora Technologies Limited" (white, bold) + rest of founding sentence (`#bababa`).  
   - Para 2: Full mission paragraph (`#bababa`).

4. **Three service cards** — horizontal row at bottom of panel, `left: 209px`, `width: 1201px`.  
   Each card:
   - Top-left corner bracket: `border-left + border-top`, white, 65×65px.
   - Bottom-right corner bracket: `border-right + border-bottom`, white, 65×65px.
   - Title (Space Grotesk Bold, 20px, white, `letter-spacing: -0.8px`).
   - Horizontal rule (full card width).
   - 3D image (200×200px, centered within card):
     - Card 1: `/public/images/orb.png`
     - Card 2: `/public/images/cube.png`
     - Card 3: `/public/images/swirl.png`
     - Animation: `spin 12s linear infinite` — `@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`
   - Paragraph (Satoshi Regular, 16px, `#e0e0e6`):
     - On hover: `color` transitions to `#ffffff` over 0.2s.

   Card content:
   - Card 1: "Data that shows its work" / orb / analytics paragraph
   - Card 2: "The systems beneath the business" / cube / infrastructure paragraph
   - Card 3: "Built for here, not borrowed from elsewhere" / swirl / local-realities paragraph

   Panel entrance: `fadeSlideUp` on the heading + text block (0.5s, staggered 0.1s). Cards animate in staggered: 0.2s, 0.35s, 0.5s delay.

**Active sidebar item:** About Us

---

### Panel 5 — Services Intro (Figma node 328-1099)

**Background:** `radial-red-bg.png` full-cover + `rgba(0,0,0,0.2)` overlay.  
**Content:**
- **Cone** — top-center, `top: 190px`. On IntersectionObserver trigger, animates `translateX(0) → translateX(40%)` over 1.2s ease-out (slides right off-center as per `image copy 2.png`).
- **Centered headline:**  
  "What we build and" / "How we build it"  
  Space Grotesk Regular, 58px, white, `letter-spacing: -0.04em`, centered, two lines.  
  Animation: `fadeSlideUp` 0.6s ease-out, triggered by IntersectionObserver.
- "SCROLL TO DISCOVER" + chevron at bottom.

**Active sidebar item:** Services

---

## Assets to Download

All downloaded and saved to `/public/images/` before any code is written:

| Filename | Source | Used in |
|----------|--------|---------|
| `terrain-bg.png` | Figma asset from node 316-384 (`imgDesktop2`) | Panels 1–3 |
| `radial-red-bg.png` | Figma asset from node 328-1099 (`imgDesktop7`) | Panel 5 |
| `cone.png` | Figma asset from node 316-743 (`imgCone012`) | Panels 3, 4, 5 |
| `logo-icon.png` | Figma asset (`imgFrame2147224030`) | Fixed logo overlay |
| `logo-text.png` | Figma asset (`imgFrame2147224031`) | Fixed logo overlay |

Existing assets already in `/public/images/`: `orb.png`, `cube.png`, `swirl.png` — reused as-is for service card images.

---

## CSS Keyframes (to add to `globals.css`)

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes slideRight {
  from { transform: translateX(0); }
  to   { transform: translateX(40%); }
}
```

Animations only play when a `.is-visible` class is added by IntersectionObserver. The `spin` keyframe runs always on `.spinning` elements.

---

## File Structure

```
src/
  components/
    v2/
      SnapContainer.tsx       — scroll container + panel ref registration + context
      SidebarNav.tsx          — fixed left nav, reads activeSection from context
      panels/
        HeroPanel1.tsx        — bare hero
        HeroPanel2.tsx        — hero + headline
        HeroPanel3.tsx        — hero + headline + cone
        AboutPanel.tsx        — about us + 3 cards
        ServicesIntroPanel.tsx — services intro
  app/
    page.tsx                  — replaced: renders SnapContainer with all 5 panels
    globals.css               — 4 new keyframes added
```

Deleted (no longer used): `Hero.tsx`, `About.tsx`, `FeatureSection.tsx`, `SelectedWorks.tsx`, `Faq.tsx`, `Cta.tsx`, `Footer.tsx`, `Navbar.tsx` and any sub-components they import exclusively.

---

## What's Explicitly Out of Scope

- Panels for "Our Works", "Meet the Team", "Contact Us" — future work.
- Mobile/responsive layout — future work.
- Any page transitions between routes — not applicable (single page).
- Accessibility (ARIA live regions for section changes) — future work.
