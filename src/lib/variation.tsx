'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Variation = 'atelier' | 'foundry';

interface VariationContextType {
    variation: Variation;
    toggle: () => void;
}

const VariationContext = createContext<VariationContextType>({
    variation: 'atelier',
    toggle: () => { },
});

export function VariationProvider({ children }: { children: React.ReactNode }) {
    const [variation, setVariation] = useState<Variation>('atelier');

    useEffect(() => {
        const saved = localStorage.getItem('ismora-variation') as Variation | null;
        if (saved === 'atelier' || saved === 'foundry') setVariation(saved);
    }, []);

    const toggle = () => {
        setVariation((v) => {
            const next = v === 'atelier' ? 'foundry' : 'atelier';
            localStorage.setItem('ismora-variation', next);
            return next;
        });
    };

    return (
        <VariationContext.Provider value={{ variation, toggle }}>
            {children}
        </VariationContext.Provider>
    );
}

export const useVariation = () => useContext(VariationContext);
