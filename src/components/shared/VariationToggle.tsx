// src/components/shared/VariationToggle.tsx
'use client';

import { useVariation } from '@/lib/variation';

export function VariationToggle() {
  const { variation, toggle } = useVariation();

  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        border: '1px solid rgba(244,241,236,0.12)',
        borderRadius: '100px',
        background: 'rgba(20,20,20,0.9)',
        backdropFilter: 'blur(12px)',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(244,241,236,0.55)',
        cursor: 'pointer',
        transition: 'border-color 200ms, color 200ms',
      }}
      aria-label="Switch design variation"
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8201C', display: 'inline-block' }} />
      {variation === 'atelier' ? 'ATELIER' : 'FOUNDRY'}
    </button>
  );
}
