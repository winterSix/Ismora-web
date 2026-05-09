import type { ApiBlogPost, ApiCaseStudy, ApiDownload, ApiPage, ApiService, ApiSiteConfig, ApiTeamMember } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL!;

async function fetcher<T>(path: string, tag: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        next: { revalidate: 60, tags: [tag] },
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    const json = await res.json();
    return (json.data ?? json) as T;
}

export const api = {
    config: () => fetcher<ApiSiteConfig>('/config', 'site-config'),
    services: {
        all: () => fetcher<ApiService[]>('/services', 'services'),
        featured: () => fetcher<ApiService[]>('/services?featured=true', 'services'),
        bySlug: (slug: string) => fetcher<ApiService>(`/services/${slug}`, 'services'),
    },
    caseStudies: {
        all: () => fetcher<ApiCaseStudy[]>('/case-studies', 'case-studies'),
        bySlug: (slug: string) => fetcher<ApiCaseStudy>(`/case-studies/${slug}`, 'case-studies'),
    },
    blog: {
        all: () => fetcher<ApiBlogPost[]>('/blog', 'blog-posts'),
        bySlug: (slug: string) => fetcher<ApiBlogPost>(`/blog/${slug}`, 'blog-posts'),
    },
    team: () => fetcher<ApiTeamMember[]>('/team', 'team-members'),
    pages: {
        bySlug: (slug: string) => fetcher<ApiPage>(`/pages/${slug}`, 'pages'),
    },
    downloads: () => fetcher<ApiDownload[]>('/downloads', 'downloads'),
};
