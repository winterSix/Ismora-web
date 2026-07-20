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

export interface FooterSiteSettings {
  contactEmail: string;
  contactPhone: string;
  socialLabel: string | null;
  socialUrl: string | null;
}

interface ContactPanelProps {
  isVisible: boolean;
  /** Footer nav labels, in scroll order — injected by IsmoraV2 (only it knows
   * which sections are currently enabled). */
  sections?: string[];
  /** Jumps to the sidebar-index'd section — same callback SidebarNav uses. */
  onNavigate?: (index: number) => void;
  siteSettings?: FooterSiteSettings;
}

export function ContactPanel({ isVisible, sections = [], onNavigate, siteSettings }: ContactPanelProps) {
  const anim = isVisible ? 'animate-fade-slide-up' : '';
  const isMobile = useIsMobile();
  // Every section except Contact itself (no point linking to where you are).
  const footerLinks = sections.slice(0, -1);

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
              <Object3DViewer shape="diamond" size={360} speed={0.55} active={isVisible} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="contact-footer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'Satoshi, var(--font-space-grotesk), sans-serif',
          fontSize: 13,
          color: '#8a8a90',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          {/* Section nav */}
          {footerLinks.length > 0 && (
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
              {footerLinks.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onNavigate?.(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#8a8a90',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8a90')}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}

          {/* Contact info + social */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', alignItems: 'center' }}>
            {siteSettings?.contactEmail && (
              <a href={`mailto:${siteSettings.contactEmail}`} style={{ color: '#8a8a90' }}>
                {siteSettings.contactEmail}
              </a>
            )}
            {siteSettings?.contactPhone && <span>{siteSettings.contactPhone}</span>}
            {siteSettings?.socialUrl && (
              <a href={siteSettings.socialUrl} target="_blank" rel="noreferrer" style={{ color: '#8a8a90' }}>
                {siteSettings.socialLabel || 'Social'}
              </a>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px 16px' }}>
          <span>© {new Date().getFullYear()} Ismora Technologies Limited. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
