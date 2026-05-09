'use client';

import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import { Reveal } from '@/components/atelier/Reveal';
import type { ApiService } from '@/lib/types';

export function ServiceDetailClient({ service }: { service: ApiService }) {
    return (
        <AtelierLayout>
            <main className="ate-page">
                <section className="ate-page-hero">
                    <span className="ate-num">/ {service.category}</span>
                    <h1 className="ate-page-title">{service.name}</h1>
                    <p className="ate-page-lede">{service.tagline}</p>
                </section>
                {(service.challenges?.length > 0 || service.outcomes?.length > 0) && (
                    <section className="ate-products">
                        {service.challenges?.length > 0 && (
                            <div style={{ padding: '2rem 0' }}>
                                <div className="ate-section-head"><span className="ate-num">/ The Challenge</span></div>
                                {service.challenges.map((c, i) => (
                                    <Reveal key={i} delay={i * 60} className="ate-story-row">
                                        <div><p>{c.item}</p></div>
                                    </Reveal>
                                ))}
                            </div>
                        )}
                        {service.outcomes?.length > 0 && (
                            <div style={{ padding: '2rem 0' }}>
                                <div className="ate-section-head"><span className="ate-num">/ What You Gain</span></div>
                                {service.outcomes.map((o, i) => (
                                    <Reveal key={i} delay={i * 60} className="ate-story-row">
                                        <div><p>{o.item}</p></div>
                                    </Reveal>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </AtelierLayout>
    );
}
