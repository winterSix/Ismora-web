import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { DownloadsClient } from './downloads-client';
export const revalidate = 60;
export const metadata: Metadata = { title: 'Downloads' };
export default async function DownloadsPage() {
    const downloads = await api.downloads().catch(() => []);
    return <DownloadsClient downloads={downloads} />;
}
