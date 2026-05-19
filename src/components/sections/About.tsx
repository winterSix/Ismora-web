import Image from 'next/image';
import { ArrowRight } from '../icons';

const STATS = [
  { src: '/images/stat-experience.png', alt: '2 Years of Experiences' },
  { src: '/images/stat-projects.png', alt: '10+ Completed Projects' },
  { src: '/images/stat-clients.png', alt: '4 Satisfied Clients' },
];

export function About() {
  return (
    <section
      id="about"
      style={{ background: 'var(--paper)', color: 'var(--text-on-light)' }}
      className="py-[clamp(56px,8vw,104px)]"
    >
      <div className="shell">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <div className="flex items-center gap-0">
            <Image
              src="/ismora-logo.svg"
              alt=""
              width={76}
              height={68}
              style={{ width: 76, height: 68 }}
            />
            <span className="-ml-5 text-[clamp(1.6rem,2.6vw,2.25rem)] font-medium text-[color:var(--text-on-light)]">
              About Us
            </span>
          </div>

          <div className="max-w-[880px]">
            <p
              className="text-[color:var(--text-on-light)]"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(1.125rem, 2vw, 28px)',
                lineHeight: 1.5,
                letterSpacing: '-0.04em',
              }}
            >
              Ismora Technologies Limited was founded in Lagos in 2026 by Ismail
              Raji. We build software, integrated infrastructure, and the
              connected systems that institutions, founders, and operating teams
              depend on.
            </p>
            <a href="#contact" className="pill pill-red mt-12 self-start">
              Learn More
              <ArrowRight />
            </a>
          </div>
        </div>

        <div className="mt-[clamp(40px,6vw,72px)] grid grid-cols-1 items-center gap-5 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.alt}
              className={`relative overflow-hidden rounded-2xl ${
                i === 1 ? 'sm:-mt-10 sm:mb-0' : 'sm:mt-6'
              }`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={520}
                height={i === 1 ? 360 : 280}
                className="h-[200px] w-full object-cover sm:h-auto"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
