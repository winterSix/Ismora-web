import Image from 'next/image';

const COLUMNS = [
  {
    title: 'Quick Links',
    links: ['Home', 'About', 'Services', 'Our Works', 'Contact Us'],
  },
  { title: 'Socials', links: ['LinkedIn', 'Instagram'] },
  { title: 'Legal', links: ['Terms of Use', 'Privacy Policy'] },
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink)' }} className="pt-[clamp(56px,8vw,96px)] pb-10">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-[400px]">
            <span className="flex items-center gap-0">
              <Image
                src="/ismora-logo.svg"
                alt="Ismora"
                width={76}
                height={68}
                style={{ width: 76, height: 68, marginLeft: -21 }}
                priority
              />
              <span
                className="-ml-5 font-display font-semibold lowercase tracking-tight"
                style={{ fontSize: 30, color: 'var(--red)' }}
              >
                ismora
              </span>
            </span>
            <p className="mt-7 text-[15px] leading-relaxed text-white/55">
              We design and build the software systems, integrated
              infrastructure, and data tools that serious institutions rely on
              to operate, built for the realities of working in Africa.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display font-semibold text-[17px] text-white">
                {col.title}
              </h3>
              <ul className="mt-6 flex flex-col gap-5 text-[15px] text-white/65">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[14px] text-white/45">
          <span>@ 2026. Ismora</span>
          <span>All Rights belongs to Ismora</span>
        </div>
      </div>
    </footer>
  );
}
