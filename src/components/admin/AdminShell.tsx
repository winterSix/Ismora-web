'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ALL_RESOURCES } from '@/lib/adminResources';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  ...ALL_RESOURCES.map((r) => ({ href: `/admin/${r.key}`, label: r.title })),
];

function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href));

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className={`admin-sidebar${mobileOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-logo">
            <Image src="/ismora-mark.svg" alt="" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
            <span className="admin-sidebar-word">ısmora</span>
            <span className="admin-sidebar-tag">Admin</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${isActive(item.href) ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="admin-nav-dot" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-chip">
              <span className="admin-user-avatar">{initials(user?.firstName, user?.lastName)}</span>
              <div style={{ minWidth: 0 }}>
                <div className="admin-user-name">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="admin-user-role">{user?.role?.replace('_', ' ')}</div>
              </div>
            </div>
            <button type="button" className="admin-btn admin-btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={() => logout()}>
              Sign out
            </button>
          </div>
        </aside>

        <div className="admin-main">{children}</div>
      </div>
    </div>
  );
}

export function AdminTopbar({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="admin-topbar">
      <div>
        <div className="admin-topbar-title">{title}</div>
        {description && <div className="admin-topbar-desc">{description}</div>}
      </div>
      {action}
    </div>
  );
}
