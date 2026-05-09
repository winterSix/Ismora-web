'use client';

import { Mark } from '@/components/mark/Mark';
import { useEffect, useState } from 'react';

interface Props { onDone?: () => void; }

export function IntroOverlay({ onDone }: Props) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        try {
            if (sessionStorage.getItem('ismora-intro-seen')) { setPhase(3); onDone?.(); return; }
        } catch { }
        const t1 = setTimeout(() => setPhase(1), 80);
        const t2 = setTimeout(() => setPhase(2), 1700);
        const t3 = setTimeout(() => {
            setPhase(3);
            try { sessionStorage.setItem('ismora-intro-seen', '1'); } catch { }
            onDone?.();
        }, 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    if (phase >= 3) return null;

    return (
        <div className={`ate-intro p-${phase}`} aria-hidden="true">
            <div className="ate-intro-stack">
                <div className="ate-intro-mark">
                    <Mark color="#E8201C" />
                </div>
                <div className="ate-intro-word">ismora<span>™</span></div>
            </div>
        </div>
    );
}
