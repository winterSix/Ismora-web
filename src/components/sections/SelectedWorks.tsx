'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from '../icons';

function IsmoraMark() {
  return (
    <span className="inline-flex items-center gap-5">
      <Image src="/ismora-logo.svg" alt="" width={68} height={60} priority />
      <span
        className="font-display font-bold lowercase leading-none"
        style={{ color: 'var(--red)', fontSize: 44, letterSpacing: '-0.02em' }}
      >
        ismora
      </span>
    </span>
  );
}

function GlovoMark() {
  return (
    <span
      className="inline-flex items-start font-display font-bold leading-none"
      style={{ color: '#00A082', fontSize: 44, letterSpacing: '-0.01em' }}
    >
      Glovo
      <svg width="22" height="30" viewBox="0 0 22 30" className="ml-1 -mt-1" aria-hidden>
        <path
          d="M11 0C5 0 0 4.6 0 10.6 0 18 11 30 11 30s11-12 11-19.4C22 4.6 17 0 11 0z"
          fill="#FFC244"
        />
        <circle cx="11" cy="10.5" r="4" fill="#fff" />
      </svg>
    </span>
  );
}

function ZomatoMark() {
  return (
    <span className="grid place-items-center px-6 py-4" style={{ background: '#EF4F5F' }}>
      <span className="font-display text-[30px] font-bold lowercase italic text-white">
        zomato
      </span>
    </span>
  );
}

const WORKS = [
  {
    key: 'ismora',
    logo: <IsmoraMark />,
    title: 'ASR Loyalty Platform',
    status: 'Delivered • 2026',
    desc: 'A multi-tenant customer loyalty and revenue-tracking platform helping businesses retain customers and understand who drives their revenue.',
  },
  {
    key: 'glovo',
    logo: <GlovoMark />,
    title: 'NoStory',
    status: 'In delivery • 2026',
    desc: 'A multi-sector consumer accountability and escalation platform — bringing structure, evidence, and regulator visibility to service complaints across Nigerian regulated sectors.',
  },
  {
    key: 'zomato',
    logo: <ZomatoMark />,
    title: 'Ibwas RFID + ERP',
    status: 'In delivery • 2026',
    desc: 'An integrated ERP and RFID-enabled inventory system built for a Nigerian retail group, connecting physical inventory to real-time financial and operational reporting.',
  },
];

export function SelectedWorks() {
  // null = resting state: all cards equal, logo-only (Figma default)
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="works"
      style={{ background: '#0e0e0e' }}
      className="pt-[clamp(16px,2.5vw,36px)] pb-[clamp(56px,9vw,110px)]"
    >
      <div className="shell">
        {/* header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-0">
            <Image
              src="/ismora-logo.svg"
              alt=""
              width={76}
              height={68}
              style={{ width: 76, height: 68 }}
            />
            <span
              className="-ml-5 font-display font-light text-white"
              style={{ fontSize: 24, letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              Selected Works
            </span>
          </div>
          <a href="#contact" className="pill pill-red">
            See all Works
            <ArrowRight size={20} />
          </a>
        </div>

        {/* cards */}
        <div className="mt-12 flex flex-col gap-6 md:h-[446px] md:flex-row">
          {WORKS.map((w, i) => {
            const isActive = i === active;
            return (
              <article
                key={w.key}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                style={{
                  flexGrow: active === null ? 1 : isActive ? 2.6 : 1,
                  flexBasis: 0,
                  background: '#121212',
                  borderColor: '#2b2b2b',
                }}
                className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[24px] border-2 border-solid p-8 outline-none transition-[flex-grow] duration-500 ease-out md:p-10"
                aria-label={w.title}
              >
                {/* logo */}
                <div className="flex flex-1 items-center justify-center py-6">
                  {w.logo}
                </div>

                {/* details — visible only when active */}
                <div
                  className={`flex flex-col gap-4 transition-all duration-500 max-h-[360px] opacity-100 ${
                    isActive
                      ? ''
                      : 'md:pointer-events-none md:max-h-0 md:overflow-hidden md:opacity-0'
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="font-display text-[clamp(1.1rem,1.6vw,1.4rem)] font-bold text-white">
                      {w.title}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap pt-1 text-[13px] text-white/45">
                      {w.status}
                    </span>
                  </div>
                  <p className="max-w-[560px] text-[15px] leading-relaxed text-white/55">
                    {w.desc}
                  </p>
                  <a href="#contact" className="pill pill-red mt-2 self-start">
                    Learn More
                    <ArrowRight size={20} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
