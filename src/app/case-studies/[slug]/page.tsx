import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyDetailClient } from './case-study-detail-client';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const cs = await api.caseStudies.bySlug(slug).catch(() => null);
    return { title: cs?.seo?.title ?? cs?.title ?? slug };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cs = await api.caseStudies.bySlug(slug).catch(() => null);
    if (!cs) notFound();
    return <CaseStudyDetailClient cs={cs} />;
}
