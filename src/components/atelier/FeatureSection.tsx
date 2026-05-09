'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface FeatureSectionProps {
  num: string;
  label: string;
  title: React.ReactNode;
  body: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export function FeatureSection({ num, label, title, body, image, imageAlt, reverse }: FeatureSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.18, rootMargin: '-50px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`ate-feature${reverse ? ' is-reverse' : ''}${visible ? ' is-visible' : ''}`}
    >
      <div className="ate-feature-text">
        <p className="ate-feature-num">{num}</p>
        <p className="ate-feature-label">{label}</p>
        <h2 className="ate-feature-title">{title}</h2>
        <p className="ate-feature-body">{body}</p>
      </div>
      <div className="ate-feature-visual">
        <Image
          src={image}
          alt={imageAlt}
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 1100px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
