'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from '../icons';

const FAQS = [
  {
    q: 'Can Ismora help build a product from scratch?',
    a: 'Yes. Ismora supports end-to-end product creation, from research to UI/UX design to frontend development and deployment support.',
  },
  {
    q: 'Does Ismora work with international clients?',
    a: 'Yes. While we are rooted in Lagos, we partner with founders and institutions globally and build for the realities of their markets.',
  },
  {
    q: 'How long does a project usually take?',
    a: 'Timelines vary by scope. A focused engagement can ship in weeks, while platform builds run across several months with clear milestones.',
  },
  {
    q: 'What makes Ismora different from other agencies?',
    a: 'We build systems that have to work and stay defensible when someone asks how they work — engineering depth over surface polish.',
  },
  {
    q: 'Can I request a custom project?',
    a: 'Absolutely. Most of our work is bespoke. Tell us the problem worth solving and we will scope a path to a dependable solution.',
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      style={{ background: '#0e0e0e' }}
      className="relative overflow-hidden pt-[clamp(16px,2.5vw,36px)] pb-[clamp(56px,9vw,120px)]"
    >
      {/* faint mark watermark, top-right */}
      <Image
        src="/ismora-logo.svg"
        alt=""
        aria-hidden
        width={360}
        height={360}
        className="pointer-events-none absolute -right-10 top-10 select-none opacity-[0.035]"
      />

      <div className="shell relative z-10">
        <h2
          className="font-display font-light text-center leading-[1.18] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
        >
          <span style={{ color: '#FFFFFF' }}>Questions?</span>
          <br />
          <span style={{ color: '#E0E0E6' }}>We&rsquo;re here to assist!</span>
        </h2>

        <div className="mx-auto mt-14 flex max-w-[1190px] flex-col gap-4">
          {FAQS.map((item, i) => {
            const isOpen = i === open;
            return (
              <div
                key={item.q}
                style={{
                  background: '#111111',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
                className="rounded-2xl border border-solid px-6 py-6 sm:px-8 sm:py-7"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-[clamp(1.05rem,1.7vw,1.3rem)] ${
                      isOpen ? 'font-bold text-white' : 'font-medium text-white/85'
                    }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors"
                    style={
                      isOpen
                        ? { background: 'var(--red)', color: '#fff' }
                        : {
                            color: 'rgba(255,255,255,0.55)',
                            border: '1px solid rgba(255,255,255,0.22)',
                          }
                    }
                  >
                    {isOpen ? <Minus /> : <Plus />}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'mt-4 grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <p className="overflow-hidden max-w-[1040px] pl-11 text-[clamp(0.95rem,1.3vw,1rem)] leading-relaxed text-white/45">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
