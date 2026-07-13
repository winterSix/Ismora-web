'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { BLOG_CONFIG } from '@/lib/adminResources';

export default function AdminBlogPage() {
  return <ResourcePage config={BLOG_CONFIG} />;
}
