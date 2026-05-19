import Image from 'next/image';

export interface FeatureSectionProps {
  id: string;
  tag: string;
  title: string;
  paragraph: string;
  items: string[];
  image: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
}

export function FeatureSection({
  id,
  tag,
  title,
  paragraph,
  items,
  image,
  imageAlt,
  imageSide,
}: FeatureSectionProps) {
  const visual = (
    <div className="relative flex w-full max-w-[534px] items-center justify-center self-stretch min-h-[320px] md:min-h-[480px]">
      {/* soft red ambient bloom behind the render (matches Figma) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[185%] w-[185%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(240,0,12,0.38) 0%, rgba(240,0,12,0.22) 25%, rgba(240,0,12,0.10) 45%, rgba(240,0,12,0) 72%)',
          filter: 'blur(56px)',
        }}
      />
      <Image
        src={image}
        alt={imageAlt}
        width={534}
        height={534}
        className="relative z-10 h-auto w-full max-w-[480px] object-contain"
        sizes="(max-width: 768px) 80vw, 480px"
      />
    </div>
  );

  const copy = (
    <div className="flex w-full max-w-[617px] flex-col gap-10">
      <div className="flex flex-col gap-5">
        <span className="tag-chip self-start">{tag}</span>
        <div className="flex flex-col gap-4">
          <h2
            className="font-display font-bold text-white"
            style={{
              fontSize: 'clamp(1.9rem, 3.9vw, 54px)',
              lineHeight: 1.2,
              letterSpacing: '-0.04em',
            }}
          >
            {title}
          </h2>
          <p
            className="text-[clamp(0.95rem,1.25vw,18px)] leading-[1.4]"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            {paragraph}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={it} className="feature-row">
            <Image
              src="/ismora-logo.svg"
              alt=""
              width={44}
              height={40}
              className="shrink-0"
              style={{ width: 44, height: 40, marginLeft: -10 }}
            />
            <span className="-ml-2 flex-1">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section id={id} style={{ background: '#0e0e0e' }} className="py-[clamp(56px,9vw,120px)]">
      <div className="shell flex flex-col items-center justify-center gap-12 md:flex-row md:gap-[100px]">
        {imageSide === 'left' ? (
          <>
            <div className="order-1">{visual}</div>
            <div className="order-2">{copy}</div>
          </>
        ) : (
          <>
            <div className="order-2 md:order-1">{copy}</div>
            <div className="order-1 md:order-2">{visual}</div>
          </>
        )}
      </div>
    </section>
  );
}
