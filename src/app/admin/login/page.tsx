'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminLoginPage() {
  const { user, isLoading, login } = useAdminAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace('/admin');
  }, [isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(identifier, password);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-root">
      <div className="admin-login-glow" aria-hidden />
      <div className="admin-card admin-login-card">
        <div className="admin-login-logo">
          <Image src="/ismora-mark.svg" alt="" width={26} height={26} style={{ filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, color: '#fff' }}>ısmora</span>
        </div>
        <div className="admin-login-title">Admin console</div>
        <div className="admin-login-sub">Sign in to manage site content.</div>

        {error && <div className="admin-banner admin-banner-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label" htmlFor="identifier">
              Email or phone number
            </label>
            <input
              id="identifier"
              className="admin-input"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="admin-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
