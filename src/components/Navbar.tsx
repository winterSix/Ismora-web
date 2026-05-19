import Image from 'next/image';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#insights' },
  { label: 'Our Works', href: '#works' },
];

export function Navbar() {
  return (
    <div className="shell pt-6 relative z-20">
      <nav
        className="flex items-center justify-between rounded-full pl-6 pr-2 py-2 border"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span className="flex items-center gap-0">
          <Image
            src="/ismora-logo.svg"
            alt="Ismora"
            width={44}
            height={40}
            style={{ width: 44, height: 40, marginLeft: -10 }}
            priority
          />
          <span
            className="-ml-2 font-display font-semibold lowercase tracking-tight"
            style={{ fontSize: 22, color: 'var(--red)' }}
          >
            ismora
          </span>
        </span>

        <ul className="hidden md:flex items-center gap-9 text-[15px] text-white">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="pill pill-red">
          Contact Us
        </a>
      </nav>
    </div>
  );
}
