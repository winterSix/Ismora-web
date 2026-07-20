'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { SITE_SETTINGS_CONFIG } from '@/lib/adminResources';

export default function AdminSiteSettingsPage() {
  return <ResourcePage config={SITE_SETTINGS_CONFIG} />;
}
