'use client';

import { ResourcePage } from '@/components/admin/ResourcePage';
import { TEAM_CONFIG } from '@/lib/adminResources';

export default function AdminTeamPage() {
  return <ResourcePage config={TEAM_CONFIG} />;
}
