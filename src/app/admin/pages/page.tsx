'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { PAGES_CONFIG } from '@/lib/adminResources';

export default function AdminPagesPage() {
  return <ResourcePage config={PAGES_CONFIG} />;
}
