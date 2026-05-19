import { Navbar } from '../Navbar';
import { ArrowRight } from '../icons';

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#0e0e0e' }}
    >
      {/* soft red glow blobs (Figma BG ellipses) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-[55%] h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: 'rgba(240,0,12,0.20)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[22%] top-[18%] h-[360px] w-[360px] rounded-full blur-[130px]"
        style={{ background: 'rgba(240,0,12,0.14)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-[300px] w-[300px] rounded-full blur-[120px]"
        style={{ background: 'rgba(240,0,12,0.28)' }}
      />

      {/* 96px block grid, faded toward edges */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(208,213,221,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(208,213,221,0.32) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage:
            'radial-gradient(120% 95% at 50% 35%, #000 38%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(120% 95% at 50% 35%, #000 38%, transparent 85%)',
        }}
      />

      <Navbar />

      <div className="shell relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 pt-[clamp(80px,13vw,190px)] pb-[clamp(96px,15vw,216px)] text-center">
        <div className="flex flex-col items-center gap-6">
          <h1
            className="font-display font-light text-white max-w-[15ch] md:max-w-[1100px]"
            style={{
              fontSize: 'clamp(2.5rem, 5.3vw, 80px)',
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
            }}
          >
            We build the platforms African businesses depend on
          </h1>
          <p
            className="max-w-[1042px] text-[clamp(0.95rem,1.25vw,18px)] leading-[1.4]"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Ismora is a Lagos product engineering studio. We design and build
            the software systems, integrated infrastructure, and data tools that
            serious institutions rely on to operate, built for the realities of
            working in Africa.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#contact" className="pill pill-red">
            Schedule a consultation
          </a>
          <a href="#works" className="pill pill-ghost">
            See our works
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
