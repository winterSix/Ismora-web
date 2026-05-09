'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FoundryTopBar() {
    const pathname = usePathname();
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const now = new Date();
    const hhmm = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const route = pathname === '/' ? 'home' : pathname.slice(1);

    return (
        <header className="fnd-topbar">
            <span>ISMORA://{route.toUpperCase()}</span>
            <span>REV.2026.05 · BUILD 0.1.0</span>
            <span>UTC {hhmm}</span>
            <span>● SYSTEM NOMINAL</span>
        </header>
    );
}
