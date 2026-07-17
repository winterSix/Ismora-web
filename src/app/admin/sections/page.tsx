'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminTopbar } from '@/components/admin/AdminShell';
import { ApiError } from '@/lib/adminAuth';
import { listSections, setSectionEnabled, SECTION_LABELS, type SectionVisibility } from '@/lib/adminSections';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminSectionsPage() {
  const { user } = useAdminAuth();
  const [sections, setSections] = useState<SectionVisibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSections(await listSections());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (section: SectionVisibility) => {
    if (!isSuperAdmin) return;
    setPendingKey(section.key);
    setError(null);
    try {
      const updated = await setSectionEnabled(section.key, !section.isEnabled);
      setSections((prev) => prev.map((s) => (s.key === updated.key ? updated : s)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update section');
    } finally {
      setPendingKey(null);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Sections"
        description="Show or hide whole homepage sections without deleting their content. Super Admin only."
      />
      <div className="admin-content">
        {error && <div className="admin-banner admin-banner-error">{error}</div>}
        {!isSuperAdmin && (
          <div className="admin-banner admin-banner-error">
            Only a Super Admin can change section visibility. You can view the current state below.
          </div>
        )}

        <div className="admin-card">
          {loading ? (
            <div className="admin-empty">Loading…</div>
          ) : (
            sections.map((section) => (
              <div className="admin-section-row" key={section.key}>
                <div>
                  <div className="admin-section-name">{SECTION_LABELS[section.key] ?? section.key}</div>
                  <div className="admin-section-hint">{section.isEnabled ? 'Visible on the homepage' : 'Hidden from the homepage'}</div>
                </div>
                <button
                  type="button"
                  className={`admin-switch${section.isEnabled ? ' on' : ''}`}
                  onClick={() => toggle(section)}
                  disabled={!isSuperAdmin || pendingKey === section.key}
                  aria-pressed={section.isEnabled}
                  aria-label={`Toggle ${SECTION_LABELS[section.key] ?? section.key}`}
                >
                  <span className="admin-switch-knob" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
