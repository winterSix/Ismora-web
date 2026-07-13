import { authFetch } from './adminAuth';

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'date' | 'json' | 'image' | 'file';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: Record<string, any>) => string;
}

export interface ResourceConfig {
  key: string;
  title: string;
  singular: string;
  description: string;
  basePath: string; // e.g. '/work' — used for POST/PATCH/DELETE
  listPath: string; // path used to list all rows for the admin table
  singleton?: boolean;
  columns: ColumnConfig[];
  fields: FieldConfig[];
}

export async function listResource(config: ResourceConfig) {
  const data = await authFetch(config.listPath, { method: 'GET' });
  if (Array.isArray(data)) return data;
  return data ? [data] : [];
}

export async function createResource(config: ResourceConfig, payload: Record<string, any>) {
  return authFetch(config.basePath, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateResource(config: ResourceConfig, id: string, payload: Record<string, any>) {
  const path = config.singleton ? config.basePath : `${config.basePath}/${id}`;
  return authFetch(path, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function removeResource(config: ResourceConfig, id: string) {
  return authFetch(`${config.basePath}/${id}`, { method: 'DELETE' });
}

const yesNo = (v: unknown) => (v ? 'Yes' : 'No');

export const WORK_CONFIG: ResourceConfig = {
  key: 'work',
  title: 'Work',
  singular: 'Work item',
  description: 'The portfolio cards shown in the "Our Works" section on the homepage.',
  basePath: '/work',
  listPath: '/work/admin/all',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'date', label: 'Date' },
    { key: 'isPublished', label: 'Published', render: (r) => yesNo(r.isPublished) },
  ],
  fields: [
    { key: 'name', label: 'Project name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true, helperText: 'Unique, URL-safe — e.g. asr-loyalty-platform' },
    {
      key: 'logo',
      label: 'Logo / wordmark',
      type: 'text',
      required: true,
      helperText: 'Rendered as styled text on the card. Use "ismora" (exact) to show the Ismora mark instead of text.',
    },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'industry', label: 'Industry', type: 'text', required: true },
    { key: 'date', label: 'Release date / year', type: 'text', required: true, placeholder: '2026' },
    { key: 'color', label: 'Preview background color', type: 'text', required: true, placeholder: '#3d2222' },
    { key: 'accent', label: 'Accent color', type: 'text', required: true, placeholder: '#f0000c' },
    { key: 'placeholder', label: 'Mark as placeholder', type: 'boolean' },
    { key: 'isPublished', label: 'Published', type: 'boolean' },
    { key: 'order', label: 'Sort order', type: 'number' },
  ],
};

export const SERVICES_CONFIG: ResourceConfig = {
  key: 'services',
  title: 'Services',
  singular: 'Service',
  description: 'The services Ismora offers, shown in the Services section and service detail pages.',
  basePath: '/services',
  listPath: '/services/admin/all',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'featured', label: 'Featured', render: (r) => yesNo(r.featured) },
  ],
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'description', label: 'Description (JSON)', type: 'json', required: true },
    { key: 'challenges', label: 'Challenges (JSON)', type: 'json', required: true },
    { key: 'outcomes', label: 'Outcomes (JSON)', type: 'json', required: true },
    { key: 'heroImageUrl', label: 'Hero image', type: 'image' },
    { key: 'brochureUrl', label: 'Brochure', type: 'file' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
    { key: 'order', label: 'Sort order', type: 'number' },
    { key: 'seo', label: 'SEO (JSON)', type: 'json' },
  ],
};

export const CASE_STUDIES_CONFIG: ResourceConfig = {
  key: 'case-studies',
  title: 'Case Studies',
  singular: 'Case study',
  description: 'Client case studies referenced from services and the blog.',
  basePath: '/case-studies',
  listPath: '/case-studies/admin/all',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'client', label: 'Client' },
    { key: 'industry', label: 'Industry' },
  ],
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'client', label: 'Client', type: 'text', required: true },
    { key: 'industry', label: 'Industry', type: 'text', required: true },
    { key: 'challenge', label: 'Challenge (JSON)', type: 'json', required: true },
    { key: 'solution', label: 'Solution (JSON)', type: 'json', required: true },
    { key: 'results', label: 'Results (JSON)', type: 'json', required: true },
    { key: 'coverImageUrl', label: 'Cover image', type: 'image' },
    { key: 'publishedAt', label: 'Published at', type: 'date' },
    { key: 'serviceId', label: 'Related service ID', type: 'text' },
    { key: 'seo', label: 'SEO (JSON)', type: 'json' },
  ],
};

export const BLOG_CONFIG: ResourceConfig = {
  key: 'blog',
  title: 'Blog',
  singular: 'Blog post',
  description: 'Articles shown on the blog.',
  basePath: '/blog',
  listPath: '/blog/admin/all',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'publishedAt', label: 'Published at' },
  ],
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
    { key: 'body', label: 'Body (JSON)', type: 'json', required: true },
    { key: 'coverImageUrl', label: 'Cover image', type: 'image' },
    { key: 'publishedAt', label: 'Published at', type: 'date' },
    { key: 'tags', label: 'Tags (JSON array)', type: 'json' },
    { key: 'authorId', label: 'Author user ID', type: 'text' },
    { key: 'seo', label: 'SEO (JSON)', type: 'json' },
  ],
};

export const TEAM_CONFIG: ResourceConfig = {
  key: 'team',
  title: 'Team',
  singular: 'Team member',
  description: 'People shown in the "Meet the Team" section.',
  basePath: '/team',
  listPath: '/team',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'location', label: 'Location' },
  ],
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'text', required: true },
    { key: 'location', label: 'Location', type: 'text', required: true },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
    { key: 'avatarUrl', label: 'Avatar', type: 'image' },
    { key: 'order', label: 'Sort order', type: 'number' },
  ],
};

export const PAGES_CONFIG: ResourceConfig = {
  key: 'pages',
  title: 'Pages',
  singular: 'Page',
  description: 'Freeform CMS pages addressed by slug.',
  basePath: '/pages',
  listPath: '/pages',
  columns: [
    { key: 'slug', label: 'Slug' },
    { key: 'heroHeadline', label: 'Hero headline' },
  ],
  fields: [
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'heroHeadline', label: 'Hero headline', type: 'text', required: true },
    { key: 'heroSubtext', label: 'Hero subtext', type: 'textarea' },
    { key: 'sections', label: 'Sections (JSON)', type: 'json', required: true },
    { key: 'seo', label: 'SEO (JSON)', type: 'json' },
  ],
};

export const DOWNLOADS_CONFIG: ResourceConfig = {
  key: 'downloads',
  title: 'Downloads',
  singular: 'Download',
  description: 'Downloadable assets (brochures, whitepapers, etc.).',
  basePath: '/downloads',
  listPath: '/downloads',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
  ],
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'fileUrl', label: 'File', type: 'file', required: true },
  ],
};

export const SITE_CONFIG_CONFIG: ResourceConfig = {
  key: 'site-config',
  title: 'Site Settings',
  singular: 'Site settings',
  description: 'Global site-wide settings: company info, offices, social links, default SEO.',
  basePath: '/config',
  listPath: '/config',
  singleton: true,
  columns: [],
  fields: [
    { key: 'companyName', label: 'Company name', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text', required: true },
    { key: 'contactEmail', label: 'Contact email', type: 'text', required: true },
    { key: 'offices', label: 'Offices (JSON)', type: 'json', required: true },
    { key: 'socialLinks', label: 'Social links (JSON)', type: 'json', required: true },
    { key: 'defaultSeo', label: 'Default SEO (JSON)', type: 'json' },
  ],
};

export const ALL_RESOURCES: ResourceConfig[] = [
  WORK_CONFIG,
  SERVICES_CONFIG,
  CASE_STUDIES_CONFIG,
  BLOG_CONFIG,
  TEAM_CONFIG,
  PAGES_CONFIG,
  DOWNLOADS_CONFIG,
  SITE_CONFIG_CONFIG,
];
