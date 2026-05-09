'use client';

import { Mark } from '@/components/mark/Mark';
import React, { useEffect, useState } from 'react';

function ReadoutRow({ label, value, suffix }: { label: string; value: string | number; suffix: string }) {
    return (
        <div className="fnd-readout-row">
            <span className="fnd-readout-label">{label}</span>
            <span className="fnd-readout-dashes">{'.'.repeat(20)}</span>
            <span className="fnd-readout-value">{value}{suffix}</span>
        </div>
    );
}

export function FoundryHero() {
    const [readout, setReadout] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setReadout((r) => r + 1), 120);
        return () => clearInterval(id);
    }, []);

    const segStyle = (_key: string, i: number): React.CSSProperties => {
        const active = i === readout % 3;
        return {
            opacity: active ? 1 : 0.35,
            transform: active ? 'translateY(-8px)' : 'translateY(0)',
        };
    };

    return (
        <section className="fnd-hero">
            <div className="fnd-hero-left">
                <div className="fnd-kicker">/ FILE 00 — ISMORA TECHNOLOGIES</div>
                <h1 className="fnd-hero-title">
                    <span>SOFTWARE</span>
                    <span>THAT</span>
                    <span className="fnd-hero-red">WORKS.</span>
                </h1>
                <p className="fnd-hero-body">
                    We design, build, and maintain software systems for organisations that need
                    technology that actually delivers. Platforms. Products. Infrastructure. The places
                    where software has to <em>prove it</em>.
                </p>

                <div className="fnd-readout">
                    <ReadoutRow label="CLIENTS SERVED" value={40 + (readout % 3)} suffix="+" />
                    <ReadoutRow label="YEARS EXPERIENCE" value={10} suffix="+" />
                    <ReadoutRow label="SOLUTIONS LIVE" value={7 + (readout % 2)} suffix="" />
                    <ReadoutRow label="BUILD REV" value="2026.1" suffix="" />
                </div>
            </div>

            <div className="fnd-hero-right">
                <div className="fnd-mark-frame">
                    <div className="fnd-mark-ticks">
                        {Array.from({ length: 24 }).map((_, i) => <span key={i} />)}
                    </div>
                    <Mark color="#E8201C" animated segStyle={segStyle} />
                    <div className="fnd-mark-caption">
                        <span>MARK.STATE</span>
                        <span>[{String(readout % 3).padStart(2, '0')}/03]</span>
                        <span>ACTIVE</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
