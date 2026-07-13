'use client';

import { Object3DViewer } from '../Object3DViewer';
import { useIsMobile } from '../useIsMobile';

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-space-grotesk), sans-serif',
  fontSize: 13,
  color: '#9a9aa2',
  letterSpacing: '0.01em',
};

const inputStyle: React.CSSProperties = {
  background: '#141416',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '12px 14px',
  color: '#ffffff',
  fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
  fontSize: 15,
  outline: 'none',
  width: '100%',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

export function ContactPanel({ isVisible }: { isVisible: boolean }) {
  const anim = isVisible ? 'animate-fade-slide-up' : '';
  const isMobile = useIsMobile();
  return (
    <div
      className="contact-content"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Heading — centred on mobile, left-aligned on desktop */}
      <div
        className={`contact-heading${anim ? ` ${anim}` : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: isVisible ? undefined : 0, flexShrink: 0 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1.25rem,2vw,28px)',
            color: '#ffffff',
            letterSpacing: '-0.04em',
          }}
        >
          Let&apos;s Connect
        </span>
      </div>

      {/* Form + diamond — the diamond is a two-column-layout flourish, dropped
          on mobile (single column, no 3D) rather than shrunk, per direction. */}
      <div className="contact-row">
        <form
          className={`contact-form${anim ? ` ${anim}` : ''}`}
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            opacity: isVisible ? undefined : 0,
          }}
        >
          <p style={{ fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif', fontSize: 'clamp(0.85rem,1.1vw,16px)', lineHeight: 1.5, color: '#b5b5bd', margin: 0 }}>
            We&apos;d love to hear about what you&apos;re building. Tell us a little about your project and we&apos;ll get back to you.
          </p>
          <Field label="Full Name">
            <input style={inputStyle} type="text" placeholder="Enter your full name" />
          </Field>
          <div className="contact-form-grid">
            <Field label="Phone Number">
              <input style={inputStyle} type="tel" placeholder="0800 000 0000" />
            </Field>
            <Field label="Email Address">
              <input style={inputStyle} type="email" placeholder="Enter your email" />
            </Field>
          </div>
          <Field label="Your Message">
            <textarea style={{ ...inputStyle, minHeight: 84, resize: 'none' }} placeholder="Type in your message here..." />
          </Field>
          <button type="submit" className="pill pill-red" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Send Message
          </button>
        </form>

        {!isMobile && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
            <div style={{ width: 'clamp(200px,24vw,360px)', height: 'clamp(200px,24vw,360px)' }}>
              <Object3DViewer shape="diamond" size={360} speed={0.55} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="contact-footer"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
          fontSize: 13,
          color: '#8a8a90',
          flexShrink: 0,
        }}
      >
        <span>© 2026 ismora</span>
        <span>All Rights belongs to ismora</span>
      </div>
    </div>
  );
}
