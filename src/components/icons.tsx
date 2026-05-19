/** Inline icons used across the page (no external icon package). */

export function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Plus({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Minus({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Tiny red Ismora slab mark used as the bullet inside feature rows. */
export function MarkChip({ size = 26 }: { size?: number }) {
  return (
    <span
      className="shrink-0 grid place-items-center rounded-md"
      style={{ width: size, height: size, background: 'var(--red)' }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" aria-hidden>
        <g fill="#fff">
          <path d="M3 4h4v16l-4-2z" />
          <path d="M10 3h4v17l-4-2z" />
          <path d="M17 2h4v18l-4-2z" />
        </g>
      </svg>
    </span>
  );
}
