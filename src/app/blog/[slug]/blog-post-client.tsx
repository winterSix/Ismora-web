'use client';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import type { ApiBlogPost } from '@/lib/types';

export function BlogPostClient({ post }: { post: ApiBlogPost }) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <AtelierLayout>
      <main className="ate-page">
        <section className="ate-page-hero">
          <span className="ate-num">/ {fmt(post.published_at)}</span>
          <h1 className="ate-page-title">{post.title}</h1>
          <p className="ate-page-lede">{post.excerpt}</p>
        </section>
      </main>
    </AtelierLayout>
  );
}
