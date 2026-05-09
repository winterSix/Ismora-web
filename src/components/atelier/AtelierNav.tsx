'use client';

import { Mark } from '@/components/mark/Mark';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links: { href: string; label: string; num: string; cta?: boolean }[] = [
    { href: '/about',        label: 'About',    num: '01' },
    { href: '/services',     label: 'Services', num: '02' },
    { href: '/case-studies', label: 'Work',     num: '03' },
    { href: '/blog',         label: 'Insights', num: '04' },
    { href: '/contact',      label: 'Contact',  num: '05', cta: true },
];

export function AtelierNav() {
    const pathname = usePathname();
    const [open, setOpen]       = useState(false);
    const [isMobile, setMobile] = useState(false);

    useEffect(() => {
        const check = () => setMobile(window.innerWidth <= 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => { setOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <>
            {/* ── injected styles for hover / nth-child stagger ── */}
            <style>{`
                .ate-mob-link { display:flex; align-items:center; gap:16px; padding:12px 0;
                    border-bottom:1px solid rgba(244,241,236,0.07); text-decoration:none; }
                .ate-mob-link:hover .ate-mob-arrow { color:#E8201C; transform:translateX(6px); }
                .ate-mob-link:hover .ate-mob-label { color:#E8201C; }
                .ate-mob-arrow { transition: color 250ms, transform 300ms cubic-bezier(.2,.8,.2,1); }
                .ate-mob-label { transition: color 200ms; }
            `}</style>

            {/* ── Island nav ── */}
            <header className="ate-nav-island" style={{ zIndex: 200 }}>
                <div className="ate-nav-inner" style={isMobile ? { width: 'min(calc(100vw - 48px), 480px)', justifyContent: 'space-between' } : undefined}>
                    <Link href="/" className="ate-brand" onClick={() => setOpen(false)}>
                        <span className="ate-brand-mark"><Mark color="#E8201C" /></span>
                        <span className="ate-brand-word" style={{ display: 'inline' }}>ısmora</span>
                    </Link>

                    {/* Desktop links */}
                    {!isMobile && (
                        <>
                            <span className="ate-nav-divider" />
                            <nav className="ate-links">
                                {links.map(({ href, label, cta }) => (
                                    <Link key={href} href={href}
                                        className={cta ? 'ate-nav-cta' : `ate-link${pathname === href ? ' is-active' : ''}`}>
                                        {cta ? label : <span className="ate-link-label">{label}</span>}
                                    </Link>
                                ))}
                            </nav>
                        </>
                    )}

                    {/* Mobile hamburger */}
                    {isMobile && (
                        <button
                            onClick={() => setOpen(o => !o)}
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            aria-expanded={open}
                            style={{
                                display: 'flex', flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: '20px', height: '14px',
                                background: 'none', border: 'none',
                                cursor: 'pointer', padding: 0, flexShrink: 0,
                            }}
                        >
                            <span style={{
                                display: 'block', height: '1.5px', width: '100%',
                                background: '#F4F1EC', borderRadius: '2px',
                                transition: 'transform 380ms cubic-bezier(.2,.8,.2,1)',
                                transformOrigin: 'center',
                                transform: open ? 'translateY(6.25px) rotate(45deg)' : 'none',
                            }} />
                            <span style={{
                                display: 'block', height: '1.5px', width: '100%',
                                background: '#F4F1EC', borderRadius: '2px',
                                transition: 'transform 380ms cubic-bezier(.2,.8,.2,1), opacity 250ms',
                                opacity: open ? 0 : 1,
                                transform: open ? 'scaleX(0)' : 'none',
                            }} />
                            <span style={{
                                display: 'block', height: '1.5px', width: '100%',
                                background: '#F4F1EC', borderRadius: '2px',
                                transition: 'transform 380ms cubic-bezier(.2,.8,.2,1)',
                                transformOrigin: 'center',
                                transform: open ? 'translateY(-6.25px) rotate(-45deg)' : 'none',
                            }} />
                        </button>
                    )}
                </div>
            </header>

            {/* ── Mobile full-screen overlay ── */}
            {isMobile && (
                <div
                    aria-hidden={!open}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 150,
                        background: 'rgba(8,8,8,0.72)',
                        backdropFilter: 'blur(32px) saturate(160%) brightness(0.85)',
                        WebkitBackdropFilter: 'blur(32px) saturate(160%) brightness(0.85)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                        padding: '86px 32px 48px',
                        clipPath: open
                            ? 'circle(170% at calc(100% - 28px) 44px)'
                            : 'circle(0% at calc(100% - 28px) 44px)',
                        transition: 'clip-path 700ms cubic-bezier(.7,0,.2,1)',
                        pointerEvents: open ? 'auto' : 'none',
                        overflow: 'hidden',
                    }}
                >
                    {/* Nav links with stagger */}
                    <nav style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {links.map(({ href, label, num, cta }, i) => (
                            <Link
                                key={href}
                                href={href}
                                className="ate-mob-link"
                                onClick={() => setOpen(false)}
                                style={{
                                    color: cta ? '#E8201C' : '#F4F1EC',
                                    opacity: open ? 1 : 0,
                                    transform: open ? 'translateX(0)' : 'translateX(-24px)',
                                    transition: 'opacity 300ms, transform 420ms cubic-bezier(.2,.8,.2,1)',
                                    transitionDelay: open ? `${260 + i * 65}ms` : '0ms',
                                    padding: '12px 0',
                                }}
                            >
                                <span style={{
                                    fontSize: '10px', letterSpacing: '0.2em',
                                    color: '#E8201C', textTransform: 'uppercase',
                                    flexShrink: 0, width: '26px', fontFamily: 'inherit',
                                }}>
                                    {num}
                                </span>
                                <span className="ate-mob-label" style={{
                                    fontSize: 'clamp(22px,6vw,34px)', fontWeight: 500,
                                    letterSpacing: '-0.02em', textTransform: 'uppercase', flex: 1,
                                    color: cta ? '#E8201C' : 'inherit',
                                }}>
                                    {label}
                                </span>
                                <span className="ate-mob-arrow" style={{
                                    fontSize: '20px',
                                    color: 'rgba(244,241,236,0.2)',
                                }}>
                                    →
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div style={{
                        position: 'absolute', bottom: '36px', left: '36px', right: '36px',
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em',
                        color: 'rgba(244,241,236,0.28)',
                        opacity: open ? 1 : 0,
                        transform: open ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'opacity 350ms, transform 400ms cubic-bezier(.2,.8,.2,1)',
                        transitionDelay: open ? '580ms' : '0ms',
                    }}>
                        <span>ısmora technologies</span>
                        <span>© 2026</span>
                    </div>
                </div>
            )}
        </>
    );
}
