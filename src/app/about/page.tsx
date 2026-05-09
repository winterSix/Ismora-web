import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { AboutClient } from './about-client';
export const revalidate = 60;
export const metadata: Metadata = { title: 'About' };
export default async function AboutPage() {
    const [page, team, config] = await Promise.all([
        api.pages.bySlug('about').catch(() => null),
        api.team().catch(() => []),
        api.config().catch(() => null),
    ]);
    return <AboutClient page={page} team={team} config={config} />;
}
