'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Model3D } from './Model3D';

const pillars = [
    { k: 'insight' as const, label: 'Insight', num: '01', copy: 'Data intelligence that drives real decisions.' },
    { k: 'infrastructure' as const, label: 'Infrastructure', num: '02', copy: 'Hardware is a feeling.' },
    { k: 'innovation' as const, label: 'Innovation', num: '03', copy: 'Software should behave.' },
];

export function AtelierHero() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [idleIdx, setIdleIdx] = useState(0);

    useEffect(() => {
        if (hovered) return;
        const id = setInterval(() => setIdleIdx((i) => (i + 1) % 3), 3400);
        return () => clearInterval(id);
    }, [hovered]);

    const idleKind = pillars[idleIdx].k;
    const showing = hovered || idleKind;

    return (
        <section className="ate-hero">
            <div className="ate-hero-grid">
                <div className="ate-eyebrow" style={{ marginTop: '32px', marginBottom: '-16px' }}>
                    <span className="ate-tick">◉</span> Ismora Technologies Ltd. / est. 2026 / software &amp; systems
                </div>

                <div className="ate-pillars" onMouseLeave={() => setHovered(null)}>
                    {pillars.map((p) => (
                        <button
                            key={p.k}
                            className={`ate-pillar${hovered === p.k ? ' is-hot' : ''}${hovered && hovered !== p.k ? ' is-dim' : ''}`}
                            onMouseEnter={() => setHovered(p.k)}
                            onFocus={() => setHovered(p.k)}
                            style={{ borderWidth: '0px' }}
                        >
                            <span className="ate-pillar-word">{p.label}</span>
                            <span className="ate-pillar-copy">{p.copy}</span>
                            <span className="ate-pillar-underline" />
                        </button>
                    ))}
                </div>

                <div className="ate-hero-stage" aria-hidden="true">
                    <Model3D kind="insight" active={showing === 'insight'} any />
                    <Model3D kind="infrastructure" active={showing === 'infrastructure'} any />
                    <Model3D kind="innovation" active={showing === 'innovation'} any />
                    <div className="ate-stage-label is-shown">
                        <span className="ate-stage-label-num">{pillars.find((p) => p.k === showing)?.num}</span>
                        <span className="ate-stage-label-name">{showing}</span>
                        {!hovered && <span className="ate-stage-label-pulse" />}
                    </div>
                </div>

                <p className="ate-hero-lede">
                    Building products and solutions for businesses tackling real, complex challenges.
                    We don&apos;t chase trends — we find <em>unique approaches</em> to hard problems.
                </p>

                <div className="ate-hero-meta">
                    <Link href="/contact" className="ate-hero-cta">Schedule a consultation</Link>
                    <span className="ate-hero-meta-line" />
                    <span>Hover the pillars</span>
                </div>
            </div>
        </section>
    );
}
