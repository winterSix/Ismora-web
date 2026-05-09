'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Model3D } from './Model3D';

function useIsMobile() {
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const check = () => setMobile(window.innerWidth <= 960);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return mobile;
}

const pillars = [
    { k: 'insight' as const, label: 'Insight', num: '01', copy: 'Data intelligence that drives real decisions.' },
    { k: 'infrastructure' as const, label: 'Infrastructure', num: '02', copy: 'Hardware is a feeling.' },
    { k: 'innovation' as const, label: 'Innovation', num: '03', copy: 'Software should behave.' },
];

export function AtelierHero() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [idleIdx, setIdleIdx] = useState(0);
    const isMobile = useIsMobile();
    const stageRef = useRef<HTMLDivElement>(null);
    const [sceneScale, setSceneScale] = useState(1);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            setSceneScale(Math.min(1, w / 480));
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (hovered) return;
        const id = setInterval(() => setIdleIdx((i) => (i + 1) % 3), 3400);
        return () => clearInterval(id);
    }, [hovered]);

    const idleKind = pillars[idleIdx].k;
    const showing = hovered || idleKind;

    return (
        <section className="ate-hero">
            <div className="ate-hero-grid" style={isMobile ? {
                gridTemplateColumns: '1fr',
                gridTemplateRows: 'auto auto auto auto auto',
                minHeight: 'unset',
                gap: '24px',
            } : undefined}>
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

                <div ref={stageRef} className="ate-hero-stage" aria-hidden="true" style={isMobile ? {
                    gridColumn: '1',
                    gridRow: '3',
                    width: 'min(70vw, 400px)',
                    margin: '0 auto',
                } : undefined}>
                    <div style={{ position: 'absolute', inset: 0, zoom: sceneScale }}>
                        <Model3D kind="insight" active={showing === 'insight'} any />
                        <Model3D kind="infrastructure" active={showing === 'infrastructure'} any />
                        <Model3D kind="innovation" active={showing === 'innovation'} any />
                    </div>
                    <div className="ate-stage-label is-shown">
                        <span className="ate-stage-label-num">{pillars.find((p) => p.k === showing)?.num}</span>
                        <span className="ate-stage-label-name">{showing}</span>
                        {!hovered && <span className="ate-stage-label-pulse" />}
                    </div>
                </div>

                <p className="ate-hero-lede" style={isMobile ? { gridColumn: '1', gridRow: '4' } : undefined}>
                    Building products and solutions for businesses tackling real, complex challenges.
                    We don&apos;t chase trends — we find <em>unique approaches</em> to hard problems.
                </p>

                <div className="ate-hero-meta" style={isMobile ? { gridColumn: '1', gridRow: '5', justifySelf: 'start' } : undefined}>
                    <Link href="/contact" className="ate-hero-cta">Schedule a consultation</Link>
                    <span className="ate-hero-meta-line" />
                    <span>Hover the pillars</span>
                </div>
            </div>
        </section>
    );
}
