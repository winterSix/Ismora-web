import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { BlogClient } from './blog-client';
export const revalidate = 60;
export const metadata: Metadata = { title: 'Insights' };
export default async function BlogPage() {
    const posts = await api.blog.all().catch(() => []);
    return <BlogClient posts={posts} />;
}
