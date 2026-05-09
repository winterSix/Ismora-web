'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollY() {
    const [y, setY] = useState(0);
    useEffect(() => {
        const on = () => setY(window.scrollY);
        window.addEventListener('scroll', on, { passive: true });
        on();
        return () => window.removeEventListener('scroll', on);
    }, []);
    return y;
}

export function useRevealRef() {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.15, rootMargin: '-40px' }
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return [ref, visible] as const;
}
