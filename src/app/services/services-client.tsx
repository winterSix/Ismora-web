'use client';

import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import type { ApiService } from '@/lib/types';

export function ServicesClient({ services }: { services: ApiService[] }) {
    return (
        <AtelierLayout>
            <main className="ate-page">
                <section className="ate-page-hero">
                    <h1 className="ate-page-title">
                        Solutions that<br />
                        <em>actually work.</em>
                    </h1>
                    <p className="ate-page-lede">
                        Software solutions built for organisations that need more than off-the-shelf. We take on the hard problems and see them through.
                    </p>
                </section>
                <section className="ate-products">
                    {services.map((s, i) => (
                        <div key={s.id} className="ate-product">
                            <a href={`/services/${s.slug}`} className="ate-product-head">
                                <span className="ate-product-num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="ate-product-name">{s.name}</span>
                                <span className="ate-product-kind">{s.category}</span>
                                <span className="ate-product-plus">→</span>
                            </a>
                        </div>
                    ))}
                </section>
            </main>
        </AtelierLayout>
    );
}
