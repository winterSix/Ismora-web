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
            <div className="ate-hero-grid">
                <div className="ate-eyebrow">
                    <style>{`
                        @keyframes ate-dot-pop {
                            0%, 100% { transform: translate(-50%, -50%) scale(1); }
                            35%      { transform: translate(-50%, -50%) scale(1.9); }
                            55%      { transform: translate(-50%, -50%) scale(0.5); }
                            75%      { transform: translate(-50%, -50%) scale(1.3); }
                        }
                        .ate-tick {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 11px;
                            height: 11px;
                            border-radius: 50%;
                            border: 1.5px solid var(--red);
                            position: relative;
                            vertical-align: middle;
                            margin-right: 2px;
                        }
                        .ate-tick::before {
                            content: '';
                            position: absolute;
                            top: 50%; left: 50%;
                            width: 3.5px;
                            height: 3.5px;
                            border-radius: 50%;
                            background: var(--red);
                            transform: translate(-50%, -50%);
                            animation: ate-dot-pop 1.6s ease-in-out infinite;
                        }
                    `}</style>
                    <span className="ate-tick" /> Ismora Technologies Ltd. / est. 2026 / software &amp; systems
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

                <p className="ate-hero-lede">
                    Building products and solutions for businesses tackling real, complex challenges.
                    We don&apos;t chase trends — we find <em>unique approaches</em> to hard problems.
                </p>

                <div className="ate-hero-meta">
                    <Link href="/contact" className="ate-hero-cta">Schedule a consultation</Link>
                </div>
            </div>
        </section>
    );
}
