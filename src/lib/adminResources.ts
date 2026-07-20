import { authFetch } from './adminAuth';

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'date' | 'json' | 'image' | 'file' | 'select';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  options?: { label: string; value: string }[]; // for 'select'
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
    { key: 'isPublished', label: 'Published', render: (r) => (r.isPublished ? 'Yes' : 'No') },
  ],
  fields: [
    { key: 'name', label: 'Project name', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true, helperText: 'Unique, URL-safe, e.g. asr-loyalty-platform' },
    {
      key: 'logo',
      label: 'Logo / wordmark (fallback text)',
      type: 'text',
      required: true,
      helperText:
        'Shown as styled text if no logo image is uploaded below. Use "ismora" (exact) to show the Ismora mark instead of text.',
    },
    {
      key: 'logoImageUrl',
      label: 'Logo image (optional)',
      type: 'image',
      helperText: 'If uploaded, this image is shown instead of the text wordmark above.',
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
  description: 'The four 3D-object service slides on the homepage.',
  basePath: '/services',
  listPath: '/services',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'shape', label: 'Shape' },
    { key: 'side', label: 'Side' },
  ],
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    {
      key: 'shape',
      label: '3D shape',
      type: 'select',
      required: true,
      options: ['diamond', 'gem', 'cube', 'orb', 'structure', 'swirl', 'logo'].map((v) => ({ label: v, value: v })),
    },
    { key: 'color', label: 'Object color', type: 'text', required: true, placeholder: '#1a1a1f' },
    { key: 'emissive', label: 'Emissive glow color', type: 'text', required: true, placeholder: '#e8201c' },
    {
      key: 'side',
      label: 'Side',
      type: 'select',
      required: true,
      helperText: 'Which side of the screen the 3D object sits on; the text goes on the other side.',
      options: [
        { label: 'left', value: 'left' },
        { label: 'right', value: 'right' },
      ],
    },
    { key: 'order', label: 'Sort order', type: 'number' },
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
  ],
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'text', required: true },
    { key: 'order', label: 'Sort order', type: 'number' },
  ],
};

export const SITE_SETTINGS_CONFIG: ResourceConfig = {
  key: 'site-settings',
  title: 'Site Settings',
  singular: 'Site settings',
  description: 'Contact info and social link shown in the footer.',
  basePath: '/site-settings',
  listPath: '/site-settings',
  singleton: true,
  columns: [],
  fields: [
    { key: 'contactEmail', label: 'Contact email', type: 'text', required: true },
    { key: 'contactPhone', label: 'Contact phone', type: 'text', required: true },
    { key: 'socialLabel', label: 'Social platform name', type: 'text', helperText: 'e.g. "LinkedIn", shown as the link label/icon.' },
    { key: 'socialUrl', label: 'Social URL', type: 'text' },
  ],
};

export const ALL_RESOURCES: ResourceConfig[] = [WORK_CONFIG, SERVICES_CONFIG, TEAM_CONFIG, SITE_SETTINGS_CONFIG];
