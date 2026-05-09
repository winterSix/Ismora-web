'use client';

import React from 'react';
import { useRevealRef } from './hooks';

interface RevealProps {
    children: React.ReactNode;
    delay?: number;
    as?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Reveal({ children, delay = 0, as: tag = 'div', className = '', style = {} }: RevealProps) {
    const [ref, visible] = useRevealRef();
    return React.createElement(
        tag,
        {
            ref,
            className,
            style: {
                ...style,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
            },
        },
        children,
    );
}
