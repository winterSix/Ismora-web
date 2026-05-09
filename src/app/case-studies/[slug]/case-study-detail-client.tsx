'use client';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import { Reveal } from '@/components/atelier/Reveal';
import type { ApiCaseStudy } from '@/lib/types';

export function CaseStudyDetailClient({ cs }: { cs: ApiCaseStudy }) {
  return (
    <AtelierLayout>
      <main className="ate-page">
        <section className="ate-page-hero">
          <span className="ate-num">/ {cs.industry}</span>
          <h1 className="ate-page-title">{cs.title}</h1>
          <p className="ate-page-lede">{cs.client}</p>
        </section>
        {cs.results?.length > 0 && (
          <section className="ate-story">
            {cs.results.map((r, i) => (
              <Reveal key={i} delay={i * 60} className="ate-story-row">
                <div><p>{r.item}</p></div>
              </Reveal>
            ))}
          </section>
        )}
      </main>
    </AtelierLayout>
  );
}
