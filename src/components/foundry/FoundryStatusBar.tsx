'use client';

import { useEffect, useState } from 'react';

export function FoundryStatusBar() {
    const [pos, setPos] = useState({ px: 0, py: 0 });

    useEffect(() => {
        const on = (e: MouseEvent) => setPos({ px: e.clientX, py: e.clientY });
        window.addEventListener('mousemove', on);
        return () => window.removeEventListener('mousemove', on);
    }, []);

    return (
        <footer className="fnd-statusbar">
            <span>CURSOR [{String(pos.px).padStart(4, '0')}, {String(pos.py).padStart(4, '0')}]</span>
            <span>SESSION #a93f-{Math.floor(pos.px / 10)}</span>
            <span>ISMORA TECHNOLOGIES LTD. © 2026</span>
            <span>PRESS ? FOR HELP</span>
        </footer>
    );
}
