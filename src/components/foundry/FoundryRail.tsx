'use client';

import { Mark } from '@/components/mark/Mark';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
    { href: '/', label: 'HOME', n: '00' },
    { href: '/about', label: 'ABOUT', n: '01' },
    { href: '/services', label: 'SERVICES', n: '02' },
    { href: '/case-studies', label: 'WORK', n: '03' },
    { href: '/blog', label: 'INSIGHTS', n: '04' },
    { href: '/contact', label: 'CONTACT', n: '05' },
];

export function FoundryRail() {
    const pathname = usePathname();

    return (
        <aside className="fnd-rail">
            <Link href="/" className="fnd-rail-brand">
                <span className="fnd-rail-mark"><Mark color="#E8201C" /></span>
            </Link>
            <nav className="fnd-rail-nav">
                {items.map(({ href, label, n }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`fnd-rail-item${pathname === href ? ' is-active' : ''}`}
                    >
                        <span className="fnd-rail-n">{n}</span>
                        <span className="fnd-rail-label">{label}</span>
                    </Link>
                ))}
            </nav>
            <div className="fnd-rail-footer">
                <div>ISMORA<br />TECHNOLOGIES<br />LIMITED</div>
                <div>EST. MMXXVI<br />LAGOS · ABUJA</div>
            </div>
        </aside>
    );
}
