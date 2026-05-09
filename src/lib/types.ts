export interface ApiService {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    category: string;
    description: unknown;
    challenges: { item: string }[];
    outcomes: { item: string }[];
    featured: boolean;
    order: number;
    hero_image_id?: string;
    seo: { title?: string; description?: string };
}

export interface ApiCaseStudy {
    id: string;
    title: string;
    slug: string;
    client: string;
    industry: string;
    challenge?: unknown;
    solution?: unknown;
    results: { item: string }[];
    cover_image_id?: string;
    published_at: string;
    seo: { title?: string; description?: string };
    service_id?: string;
}

export interface ApiBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    body?: unknown;
    published_at: string;
    cover_image_id?: string;
    tags: { tag: string }[];
    seo: { title?: string; description?: string };
    author_id?: string;
}

export interface ApiTeamMember {
    id: string;
    name: string;
    role: string;
    location: string;
    bio?: string;
    linkedin?: string;
    order: number;
    avatar_id?: string;
}

export interface ApiPage {
    id: string;
    slug: string;
    hero_headline: string;
    hero_subtext?: string;
    sections: unknown[];
    seo: { title?: string; description?: string };
}

export interface ApiDownload {
    id: string;
    title: string;
    category: string;
    description?: string;
    file_id: string;
}

export interface ApiSiteConfig {
    id: string;
    company_name: string;
    tagline: string;
    contact_email: string;
    offices: { name: string; country: string; address: string; phone?: string; isPrimary?: boolean }[];
    social_links: { platform: string; url: string }[];
    default_seo: { title?: string; description?: string };
}
