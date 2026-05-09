'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Model3D } from './Model3D';

const pillars = [
    { k: 'insight' as const, label: 'Insight', num: '01', copy: 'Data intelligence that drives real decisions.' },
    { k: 'infrastructure' as const, label: 'Infrastructure', num: '02', copy: 'Hardware is a feeling.' },
    { k: 'innovation' as const, label: 'Innovation', num: '03', copy: 'Software should behave.' },
];

export function AtelierHero() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [idleIdx, setIdleIdx] = useState(0);
    const stageRef = useRef<HTMLDivElement>(null);
    const [sceneScale, setSceneScale] = useState(1);
    const [isMobile, setMobile] = useState(false);

    useEffect(() => {
        const check = () => setMobile(window.innerWidth <= 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
        <section className="ate-hero" style={{ overflow: 'visible' }}>
            <div className="ate-hero-grid">
                <div className="ate-eyebrow" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '16px' }}>
                    <style>{`
                        @keyframes ate-dot-pop {
                            0%, 100% { transform: scale(1); }
                            50%      { transform: scale(2); }
                        }
                        .ate-eyebrow { font-size: clamp(9px, 1.6vw, 12px); }
                    `}</style>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '11px', height: '11px', borderRadius: '50%',
                        border: '1.5px solid var(--red)', position: 'relative',
                        verticalAlign: 'middle', marginRight: '4px', flexShrink: 0,
                    }}>
                        <span style={{
                            width: '3.5px', height: '3.5px', borderRadius: '50%',
                            background: 'var(--red)', display: 'block',
                            animation: 'ate-dot-pop 1.2s ease-in-out infinite',
                        }} />
                    </span>Ismora Technologies Ltd. / est. 2026 / software &amp; systems
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

                <div ref={stageRef} className="ate-hero-stage" aria-hidden="true">
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

                <p className="ate-hero-lede" style={isMobile ? { gridColumn: '1 / -1' } : undefined}>
                    Building products and solutions for businesses tackling real, complex challenges.
                    We don&apos;t chase trends — we find <em>unique approaches</em> to hard problems.
                </p>

                <div className="ate-hero-meta" style={isMobile ? { gridColumn: '1 / -1', gridRow: 4, justifyContent: 'flex-start', marginTop: '4px' } : undefined}>
                    <Link href="/contact" className="ate-hero-cta" style={{ whiteSpace: 'nowrap', marginTop: 0 }}>Schedule a consultation</Link>
                </div>
            </div>
        </section>
    );
}
