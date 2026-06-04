'use client';

import Image from 'next/image';
import { Object3DViewer } from '../Object3DViewer';
import type { Shape3D } from '../Object3DViewer';

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
}

export function AboutPanel({ isVisible }: AboutPanelProps) {
  return (
    <>
      {/* Background gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #323232 0%, #000000 38%)',
          zIndex: 0,
        }}
      />

      {/* Cone top-center */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: 'calc(50% - 331px)',
          width: 204,
          height: 204,
          zIndex: 5,
          pointerEvents: 'none',
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

      {/* Main scrollable content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          /* Left padding clears the fixed sidebar rail (ends ~174px) so the
             content begins right beside it; right/top/bottom stay compact. */
          paddingTop: 'clamp(80px,8vw,120px)',
          paddingRight: 'clamp(24px,5vw,80px)',
          paddingBottom: 'clamp(24px,4vw,60px)',
          paddingLeft: 'clamp(140px,14vw,220px)',
          gap: 36,
          overflowY: 'auto',
        }}
      >
        {/* About heading + text */}
        <div
          className={isVisible ? 'animate-fade-slide-up' : ''}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
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
                fontSize: 'clamp(0.95rem,1.6vw,22px)',
                lineHeight: 1.5,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              <strong style={{ color: '#ffffff' }}>Ismora Technologies Limited </strong>
              <span style={{ color: '#bababa' }}>
                was founded in Lagos in 2026 by Ismail Raji. The company builds software,
                integrated infrastructure, and connected systems for institutions, founders,
                and operating teams.
              </span>
            </p>
            <p
              style={{
                fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(0.95rem,1.6vw,22px)',
                lineHeight: 1.5,
                letterSpacing: '-0.03em',
                color: '#bababa',
                marginTop: '0.8em',
                marginBottom: 0,
              }}
            >
              Ismora was created to solve a major gap in Africa&apos;s business landscape.
              Many companies are expected to meet global standards using systems and tools
              that were not built for local realities like unreliable networks, strict
              regulations, and operational challenges. Instead of treating these as
              obstacles, Ismora sees them as the foundation for better design and
              innovation.
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
              title={card.title}
              shape={card.shape}
              paragraph={card.paragraph}
              isVisible={isVisible}
              delay={0.2 + i * 0.15}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ServiceCard({
  title,
  shape,
  paragraph,
  isVisible,
  delay,
}: {
  title: string;
  shape: Shape3D;
  paragraph: string;
  isVisible: boolean;
  delay: number;
}) {
  return (
    <div
      className={isVisible ? 'animate-fade-slide-up service-card' : 'service-card'}
      style={{
        position: 'relative',
        padding: '20px 24px 24px',
        opacity: isVisible ? undefined : 0,
        animationDelay: isVisible ? `${delay}s` : undefined,
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
          }}
        >
          {title}
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', width: '100%' }} />

        {/* 3D object — true geometry via Three.js, no flat-paper effect */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 160,
          }}
        >
          <Object3DViewer shape={shape} size={140} speed={0.5} />
        </div>

        <p className="card-p" style={{ margin: 0 }}>
          {paragraph}
        </p>
      </div>
    </div>
  );
}
