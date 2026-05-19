import Image from 'next/image';

/**
 * Ismora lockup: the red slab mark + "ismora" wordmark.
 * `tone` controls the wordmark colour (mark stays brand red).
 */
export function Logo({
  size = 28,
  tone = 'light',
  className = '',
}: {
  size?: number;
  tone?: 'light' | 'red';
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-[9px] ${className}`}>
      <Image
        src="/ismora-logo.svg"
        alt="Ismora"
        width={size}
        height={size}
        priority
      />
      <span
        className="font-display font-semibold lowercase tracking-tight"
        style={{
          fontSize: size * 0.74,
          color: tone === 'red' ? 'var(--red)' : 'var(--text-on-dark)',
        }}
      >
        ismora
      </span>
    </span>
  );
}
