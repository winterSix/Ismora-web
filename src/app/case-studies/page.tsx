import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { CaseStudiesClient } from './case-studies-client';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Case Studies' };

export default async function CaseStudiesPage() {
    const cases = await api.caseStudies.all().catch(() => []);
    return <CaseStudiesClient cases={cases} />;
}
