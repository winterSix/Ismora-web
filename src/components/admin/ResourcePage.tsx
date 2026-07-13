'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminTopbar } from './AdminShell';
import { ResourceDrawer } from './ResourceDrawer';
import { ApiError } from '@/lib/adminAuth';
import { createResource, listResource, removeResource, updateResource, type ResourceConfig } from '@/lib/adminResources';

export function ResourcePage({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Record<string, any> | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listResource(config);
      setRows(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload: Record<string, any>) => {
    if (config.singleton) {
      await updateResource(config, '', payload);
    } else if (editingRow?.id) {
      await updateResource(config, editingRow.id, payload);
    } else {
      await createResource(config, payload);
    }
    setEditingRow(undefined);
    await load();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await removeResource(config, id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const activeRow = config.singleton ? rows[0] ?? null : editingRow;

  return (
    <>
      <AdminTopbar
        title={config.title}
        description={config.description}
        action={
          !config.singleton && (
            <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditingRow(null)}>
              + New {config.singular}
            </button>
          )
        }
      />

      <div className="admin-content">
        {error && <div className="admin-banner admin-banner-error">{error}</div>}

        {config.singleton ? (
          <div className="admin-card" style={{ padding: 24 }}>
            {loading ? (
              <div className="admin-empty">Loading…</div>
            ) : (
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditingRow(null)}>
                Edit settings
              </button>
            )}
          </div>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {config.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="admin-empty">
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="admin-empty">
                      No {config.title.toLowerCase()} yet — create the first one.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      {config.columns.map((col, i) => (
                        <td key={col.key} className={i === 0 ? 'admin-td-primary' : undefined}>
                          {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                        </td>
                      ))}
                      <td>
                        <div className="admin-table-actions">
                          <button type="button" className="admin-btn-icon" onClick={() => setEditingRow(row)} aria-label="Edit">
                            ✎
                          </button>
                          <button
                            type="button"
                            className="admin-btn-icon danger"
                            onClick={() => handleDelete(row.id)}
                            disabled={deletingId === row.id}
                            aria-label="Delete"
                          >
                            {deletingId === row.id ? '…' : '🗑'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingRow !== undefined && (
        <ResourceDrawer config={config} row={activeRow ?? null} onClose={() => setEditingRow(undefined)} onSubmit={handleSubmit} />
      )}
    </>
  );
}
