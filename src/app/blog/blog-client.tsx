'use client';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import { Reveal } from '@/components/atelier/Reveal';
import type { ApiBlogPost } from '@/lib/types';

export function BlogClient({ posts }: { posts: ApiBlogPost[] }) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AtelierLayout>
      <main className="ate-page">
        <section className="ate-page-hero">
          <h1 className="ate-page-title">Field <em>notes.</em></h1>
        </section>
        <section className="ate-work">
          <div className="ate-work-list">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <a href={`/blog/${p.slug}`} className="ate-work-row">
                  <span className="ate-work-n">{String(i + 1).padStart(3, '0')}</span>
                  <span className="ate-work-name">{p.title}</span>
                  <span className="ate-work-kind">{fmt(p.published_at)}</span>
                  <span className="ate-work-desc">{p.excerpt}</span>
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
