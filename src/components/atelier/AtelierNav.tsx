'use client';

import { Mark } from '@/components/mark/Mark';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links: { href: string; label: string; cta?: boolean }[] = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/case-studies', label: 'Work' },
    { href: '/blog', label: 'Insights' },
    { href: '/contact', label: 'Contact', cta: true },
];

export function AtelierNav() {
    const pathname = usePathname();

    return (
        <header className="ate-nav-island">
            <div className="ate-nav-inner">
                <Link href="/" className="ate-brand">
                    <span className="ate-brand-mark"><Mark color="#E8201C" /></span>
                    <span className="ate-brand-word">ısmora</span>
                </Link>
                <span className="ate-nav-divider" />
                <nav className="ate-links">
                    {links.map(({ href, label, cta }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cta ? 'ate-nav-cta' : `ate-link${pathname === href ? ' is-active' : ''}`}
                        >
                            {cta ? label : <span className="ate-link-label">{label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
