'use client';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import type { ApiDownload } from '@/lib/types';

export function DownloadsClient({ downloads }: { downloads: ApiDownload[] }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') ?? '';
  return (
    <AtelierLayout>
      <main className="ate-page">
        <section className="ate-page-hero">
          <span className="ate-num">/ Downloads</span>
          <h1 className="ate-page-title">Resources &amp;<br /><em>Documents.</em></h1>
          <p className="ate-page-lede">Brochures, whitepapers, and case study PDFs.</p>
        </section>
        <section className="ate-products">
          {downloads.map((d, i) => (
            <div key={d.id} className="ate-product">
              <div className="ate-product-head" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="ate-product-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ate-product-name">{d.title}</span>
                <span className="ate-product-kind">{d.category}</span>
                <a href={`${apiBase}/media/${d.file_id}`} target="_blank" rel="noopener noreferrer" className="ate-product-plus">↓</a>
              </div>
            </div>
          ))}
        </section>
      </main>
    </AtelierLayout>
  );
}
