'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { WORK_CONFIG } from '@/lib/adminResources';

export default function AdminWorkPage() {
  return <ResourcePage config={WORK_CONFIG} />;
}
