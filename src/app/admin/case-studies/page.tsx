'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { CASE_STUDIES_CONFIG } from '@/lib/adminResources';

export default function AdminCaseStudiesPage() {
  return <ResourcePage config={CASE_STUDIES_CONFIG} />;
}
