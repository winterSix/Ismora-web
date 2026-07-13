'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { SITE_CONFIG_CONFIG } from '@/lib/adminResources';

export default function AdminSiteConfigPage() {
  return <ResourcePage config={SITE_CONFIG_CONFIG} />;
}
