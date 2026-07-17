'use client';

import { useMemo, useState } from 'react';
import type { FieldConfig, ResourceConfig } from '@/lib/adminResources';
import { UploadField } from './UploadField';

type FormState = Record<string, string | number | boolean>;

function toFormState(fields: FieldConfig[], row: Record<string, any> | null): FormState {
  const state: FormState = {};
  for (const field of fields) {
    const raw = row?.[field.key];
    if (field.type === 'json') {
      state[field.key] = raw === undefined || raw === null ? '' : JSON.stringify(raw, null, 2);
    } else if (field.type === 'boolean') {
      state[field.key] = Boolean(raw);
    } else if (field.type === 'date') {
      state[field.key] = raw ? String(raw).slice(0, 10) : '';
    } else {
      state[field.key] = raw ?? '';
    }
  }
  return state;
}

function buildPayload(fields: FieldConfig[], state: FormState): { payload: Record<string, any>; errors: Record<string, string> } {
  const payload: Record<string, any> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const raw = state[field.key];

    if (field.type === 'json') {
      const text = String(raw ?? '').trim();
      if (!text) {
        if (field.required) errors[field.key] = 'Required — enter valid JSON';
        continue;
      }
      try {
        payload[field.key] = JSON.parse(text);
      } catch {
        errors[field.key] = 'Invalid JSON';
      }
      continue;
    }

    if (field.type === 'boolean') {
      payload[field.key] = Boolean(raw);
      continue;
    }

    if (field.type === 'number') {
      if (raw === '' || raw === undefined) {
        if (field.required) errors[field.key] = 'Required';
        continue;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) errors[field.key] = 'Must be a number';
      else payload[field.key] = num;
      continue;
    }

    const text = String(raw ?? '').trim();
    if (field.required && !text) {
      errors[field.key] = 'Required';
      continue;
    }
    if (text) payload[field.key] = text;
  }

  return { payload, errors };
}

export function ResourceDrawer({
  config,
  row,
  onClose,
  onSubmit,
}: {
  config: ResourceConfig;
  row: Record<string, any> | null;
  onClose: () => void;
  onSubmit: (payload: Record<string, any>) => Promise<void>;
}) {
  const isEdit = !!row && !config.singleton;
  const [state, setState] = useState<FormState>(() => toFormState(config.fields, row));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const title = useMemo(() => {
    if (config.singleton) return `Edit ${config.singular}`;
    return isEdit ? `Edit ${config.singular}` : `New ${config.singular}`;
  }, [config, isEdit]);

  const setValue = (key: string, value: string | number | boolean) => setState((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const { payload, errors } = buildPayload(config.fields, state);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="admin-drawer-header">
          <div className="admin-drawer-title">{title}</div>
          <button type="button" className="admin-btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {submitError && <div className="admin-banner admin-banner-error">{submitError}</div>}

        <form onSubmit={handleSubmit}>
          {config.fields.map((field) => (
            <div className="admin-field" key={field.key}>
              <label className="admin-label" htmlFor={field.key}>
                {field.label}
                {field.required && <span className="admin-required">*</span>}
              </label>

              {field.type === 'textarea' || field.type === 'json' ? (
                <textarea
                  id={field.key}
                  className={`admin-textarea${field.type === 'json' ? ' mono' : ''}`}
                  value={String(state[field.key] ?? '')}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  rows={field.type === 'json' ? 6 : 3}
                />
              ) : field.type === 'boolean' ? (
                <div className="admin-checkbox-row">
                  <input
                    id={field.key}
                    type="checkbox"
                    checked={Boolean(state[field.key])}
                    onChange={(e) => setValue(field.key, e.target.checked)}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-on-dark-muted)' }}>Enabled</span>
                </div>
              ) : field.type === 'image' || field.type === 'file' ? (
                <UploadField
                  value={String(state[field.key] ?? '')}
                  onChange={(url) => setValue(field.key, url)}
                  folder={config.key}
                  isImage={field.type === 'image'}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.key}
                  className="admin-select"
                  value={String(state[field.key] ?? '')}
                  onChange={(e) => setValue(field.key, e.target.value)}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.key}
                  className="admin-input"
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={String(state[field.key] ?? '')}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.key, e.target.value)}
                />
              )}

              {field.helperText && <span className="admin-helper">{field.helperText}</span>}
              {fieldErrors[field.key] && <span className="admin-error-text">{fieldErrors[field.key]}</span>}
            </div>
          ))}

          <div className="admin-drawer-footer">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
