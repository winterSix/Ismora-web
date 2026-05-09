'use client';

import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import { Reveal } from '@/components/atelier/Reveal';
import type { ApiCaseStudy } from '@/lib/types';

export function CaseStudiesClient({ cases }: { cases: ApiCaseStudy[] }) {
    return (
        <AtelierLayout>
            <main className="ate-page">
                <section className="ate-page-hero">
                    <h1 className="ate-page-title">Real problems.<br /><em>Measurable outcomes.</em></h1>
                </section>
                <section className="ate-work">
                    <div className="ate-work-list">
                        {cases.map((c, i) => (
                            <Reveal key={c.id} delay={i * 80}>
                                <a href={`/case-studies/${c.slug}`} className="ate-work-row">
                                    <span className="ate-work-n">{String(i + 1).padStart(3, '0')}</span>
                                    <span className="ate-work-name">{c.title}</span>
                                    <span className="ate-work-kind">{c.industry}</span>
                                    <span className="ate-work-desc">{c.client}</span>
                                    <span className="ate-work-arrow">→</span>
                                </a>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </main>
        </AtelierLayout>
    );
}
