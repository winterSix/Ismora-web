'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === '/admin/login';
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !isLoginRoute) router.replace('/admin/login');
  }, [isLoading, user, isLoginRoute, router]);

  if (isLoginRoute) return <>{children}</>;

  if (isLoading || !user) {
    return (
      <div className="admin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-display)' }}>Loading…</span>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
