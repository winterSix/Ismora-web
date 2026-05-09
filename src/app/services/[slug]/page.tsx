import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceDetailClient } from './service-detail-client';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = await api.services.bySlug(slug).catch(() => null);
    return { title: service?.seo?.title ?? service?.name ?? slug };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = await api.services.bySlug(slug).catch(() => null);
    if (!service) notFound();
    return <ServiceDetailClient service={service} />;
}
