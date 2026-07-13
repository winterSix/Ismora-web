'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { DOWNLOADS_CONFIG } from '@/lib/adminResources';

export default function AdminDownloadsPage() {
  return <ResourcePage config={DOWNLOADS_CONFIG} />;
}
