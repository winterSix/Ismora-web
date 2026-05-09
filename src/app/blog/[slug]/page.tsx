import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostClient } from './blog-post-client';
export const revalidate = 60;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await api.blog.bySlug(slug).catch(() => null);
    return { title: post?.seo?.title ?? post?.title ?? slug };
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await api.blog.bySlug(slug).catch(() => null);
    if (!post) notFound();
    return <BlogPostClient post={post} />;
}
