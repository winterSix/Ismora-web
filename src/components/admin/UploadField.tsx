'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/lib/adminAuth';

export function UploadField({
  value,
  onChange,
  folder,
  isImage,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  isImage: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-upload">
      {isImage && value && (
        <div className="admin-upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
        </div>
      )}
      {!isImage && value && (
        <div className="admin-upload-file-row">
          <a href={value} target="_blank" rel="noreferrer">
            {value.split('/').pop()}
          </a>
        </div>
      )}

      <div
        className="admin-upload-drop"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        <span style={{ fontSize: 13, color: '#fff' }}>
          {uploading ? 'Uploading…' : value ? 'Replace file' : `Drop ${isImage ? 'an image' : 'a file'} here, or click to browse`}
        </span>
        <span className="admin-upload-hint">Uploads to {folder}/…</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={isImage ? 'image/*' : undefined}
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <input
        className="admin-input"
        placeholder="Or paste a URL directly"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />

      {error && <span className="admin-error-text">{error}</span>}
    </div>
  );
}
