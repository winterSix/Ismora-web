import { ArrowRight } from '../icons';

export function Cta() {
  return (
    <section
      id="contact"
      style={{ background: 'rgba(249,249,249,1)' }}
      className="py-[clamp(40px,6vw,80px)]"
    >
      <div className="shell">
        <div
          className="relative overflow-hidden rounded-[32px] px-6 py-[clamp(48px,8vw,100px)] text-center"
          style={{ background: 'rgba(18,18,18,1)' }}
        >
          {/* primary red bloom — top-right corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[6%] -top-[40%] h-[140%] w-[46%] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(240,0,12,0.30) 0%, rgba(240,0,12,0.13) 38%, rgba(240,0,12,0) 70%)',
              filter: 'blur(55px)',
            }}
          />
          {/* secondary, subtler bloom — left side */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[10%] top-[20%] h-[90%] w-[34%] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(240,0,12,0.16) 0%, rgba(240,0,12,0.06) 45%, rgba(240,0,12,0) 72%)',
              filter: 'blur(60px)',
            }}
          />

          <h2
            className="relative z-10 font-display font-bold text-white mx-auto max-w-[16ch]"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.04em',
            }}
          >
            Got a problem worth solving?
          </h2>
          <p className="relative z-10 mx-auto mt-5 max-w-[760px] text-[15px] leading-relaxed text-white/50">
            We work with founders, operators, and institutions on a small number
            of high-trust engagements each year. If you&rsquo;re building
            something that has to work, and has to be defensible when someone
            asks how it works, we&rsquo;d like to hear from you.
          </p>
          <a href="#contact" className="pill pill-red relative z-10 mt-9">
            Schedule a consultation
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
