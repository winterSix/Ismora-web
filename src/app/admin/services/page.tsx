'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { SERVICES_CONFIG } from '@/lib/adminResources';

export default function AdminServicesPage() {
  return <ResourcePage config={SERVICES_CONFIG} />;
}
