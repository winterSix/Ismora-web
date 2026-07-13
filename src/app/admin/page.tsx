'use client';

import Link from 'next/link';
import { AdminTopbar } from '@/components/admin/AdminShell';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ALL_RESOURCES } from '@/lib/adminResources';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();

  return (
    <>
      <AdminTopbar title={`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}`} description="Manage everything shown on ismora.com." />
      <div className="admin-content">
        <div className="admin-bento">
          {ALL_RESOURCES.map((resource) => (
            <Link key={resource.key} href={`/admin/${resource.key}`} className="admin-card admin-bento-card">
              <span className="admin-bento-title">{resource.title}</span>
              <span className="admin-bento-desc">{resource.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
