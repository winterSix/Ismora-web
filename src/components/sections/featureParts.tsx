import Image from 'next/image';

export interface FeaturePanel {
  id: string;
  tag: string;
  title: string;
  paragraph: string;
  items: string[];
  image: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
}

export const FEATURE_PANELS: FeaturePanel[] = [
  {
    id: 'insights',
    tag: 'Insights',
    title: 'Data that shows its work',
    paragraph:
      "Numbers without context are noise. We build the dashboards, reports, and analytics layers that let leaders see what's actually happening in their business and defend the decisions they make from it. Real-time when it has to be. Audit-grade when it counts.",
    items: [
      'Operational dashboards for finance, sales, and service teams',
      'Decision-support tools tied to live transactional data',
      "Custom analytics for the questions off-the-shelf tools won't answer",
    ],
    image: '/images/orb.png',
    imageAlt: 'Insights',
    imageSide: 'right',
  },
  {
    id: 'infrastructure',
    tag: 'Infrastructure',
    title: 'The systems beneath the business',
    paragraph:
      'The unglamorous middle layer is where most software projects fail. We build the platforms, integrations, and connected systems that have to work, every transaction, every shift, every audit. Web, mobile, backend, payments, identity, and the hardware that ties it all to the physical world.',
    items: [
      'Multi-tenant SaaS platforms with role-based access and tenant isolation',
      'Mobile applications built offline-first for Nigerian network realities',
      'Payment, wallet, KYC, and verification integrations',
    ],
    image: '/images/cube.png',
    imageAlt: 'Infrastructure',
    imageSide: 'left',
  },
  {
    id: 'innovation',
    tag: 'Innovation',
    title: 'Built for here, not borrowed from elsewhere',
    paragraph:
      "The best software for Nigerian businesses isn't a copy of what works in San Francisco. It assumes patchy networks, accounts for regulatory weight, respects how teams actually work, and stays online when the WiFi is flying. We build for the conditions our clients live in, not the ones a foreign blog post imagines.",
    items: [
      'Hardware-software integration designed for African supply chains and operating environments',
      'NDPR-compliant data handling baked in from day one',
      'Multi-language and multi-currency support where it matters',
    ],
    image: '/images/swirl.png',
    imageAlt: 'Innovation',
    imageSide: 'right',
  },
];

export function PanelMedia({
  image,
  imageAlt,
}: {
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="relative flex w-full max-w-[534px] items-center justify-center self-stretch min-h-[320px] md:min-h-[480px]">
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
}

export function PanelCopy({
  tag,
  title,
  paragraph,
  items,
}: Pick<FeaturePanel, 'tag' | 'title' | 'paragraph' | 'items'>) {
  return (
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
}
