'use client';
import { useState, useEffect } from 'react';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';

function useTypewriter(words: string[], typingSpeed = 70, deletingSpeed = 35, pauseMs = 2200) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    const word = words[wordIdx % words.length];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), typingSpeed);
      } else {
        t = setTimeout(() => setPhase('pausing'), pauseMs);
      }
    } else if (phase === 'pausing') {
      t = setTimeout(() => setPhase('deleting'), 200);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), deletingSpeed);
      } else {
        setWordIdx(i => i + 1);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, wordIdx, words, typingSpeed, deletingSpeed, pauseMs]);

  return text;
}

function AnimatedInput({ words, name, type, required }: {
  words: string[];
  name: string;
  type?: string;
  required?: boolean;
}) {
  const placeholder = useTypewriter(words);
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      style={{ fontSize: '22px', padding: '8px 0', borderBottom: '1px solid rgba(244,241,236,0.1)' }}
      onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--red)'; }}
      onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(244,241,236,0.1)'; }}
    />
  );
}

function AnimatedTextarea({ words, name, required, rows }: {
  words: string[];
  name: string;
  required?: boolean;
  rows?: number;
}) {
  const placeholder = useTypewriter(words, 50, 25, 2800);
  return (
    <textarea
      name={name}
      required={required}
      rows={rows}
      placeholder={placeholder}
      style={{ fontSize: '22px', padding: '8px 0', borderBottom: '1px solid rgba(244,241,236,0.1)', lineHeight: '1.5', resize: 'vertical' }}
      onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--red)'; }}
      onBlur={e => { e.currentTarget.style.borderBottomColor = 'rgba(244,241,236,0.1)'; }}
    />
  );
}

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' };
const spanStyle: React.CSSProperties = { fontSize: '11px', color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em' };

export function ContactClient() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <AtelierLayout>
      <main className="ate-page">
        <section className="ate-page-hero" style={{ paddingBottom: '32px', marginBottom: '32px' }}>
          <h1 className="ate-page-title">
            Tell us what&apos;s<br />
            <em>the challenge.</em>
          </h1>
          <p className="ate-page-lede">
            We read every message. We reply within 48 hours.
          </p>
        </section>
        <section className="ate-contact" style={{ paddingTop: '24px' }}>
          <div className="ate-contact-form">
            {status !== 'sent' ? (
              <form onSubmit={handleSubmit}>
                <label style={labelStyle}>
                  <span style={spanStyle}>Your name</span>
                  <AnimatedInput name="name" required words={['Jordan Okafor', 'Alex Chen', 'Maria Santos', 'David Adeyemi']} />
                </label>
                <label style={labelStyle}>
                  <span style={spanStyle}>How we reach you</span>
                  <AnimatedInput name="email" type="email" required words={['jordan@company.co', 'alex@startup.io', 'maria@ventures.com']} />
                </label>
                <label style={labelStyle}>
                  <span style={spanStyle}>Company</span>
                  <AnimatedInput name="company" words={['Acme Corp', 'TechVentures Ltd', 'StartupXYZ', 'Nova Systems']} />
                </label>
                <label style={labelStyle}>
                  <span style={spanStyle}>What&apos;s the situation</span>
                  <AnimatedTextarea name="message" required rows={6} words={[
                    'We need help scaling our data infrastructure...',
                    'Looking to build a custom internal platform...',
                    'Our systems can\'t keep up with growth...',
                    'We want to automate our reporting pipeline...',
                  ]} />
                </label>
                <button type="submit" className="ate-submit" style={{ borderRadius: '999px' }} disabled={status === 'sending'}>
                  <span>{status === 'sending' ? 'Sending...' : 'Send message'}</span>
                  <span>→</span>
                </button>
                {status === 'error' && <p style={{ color: 'var(--red)', marginTop: '1rem', fontSize: '14px' }}>Something went wrong. Please try again.</p>}
              </form>
            ) : (
              <div className="ate-contact-sent">
                <h3>Received.</h3>
                <p>Someone will be in touch within two working days.</p>
              </div>
            )}
          </div>
          <aside className="ate-contact-aside">
            <div>
              <span className="ate-num">Contact</span>
              <p>hello@ismora.tech</p>
            </div>
          </aside>
        </section>
      </main>
    </AtelierLayout>
  );
}
