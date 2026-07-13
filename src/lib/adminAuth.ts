'use client';

const ACCESS_KEY = 'ismora_admin_access';
const REFRESH_KEY = 'ismora_admin_refresh';
const USER_KEY = 'ismora_admin_user';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function extractErrorMessage(json: any): string {
  if (!json) return '';
  const msg = json.message;
  return Array.isArray(msg) ? msg.join(', ') : msg ?? '';
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!accessToken || !refreshToken || !userRaw) return null;
  try {
    return { accessToken, refreshToken, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

function storeAuth(data: StoredAuth) {
  localStorage.setItem(ACCESS_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(identifier: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(extractErrorMessage(json) || 'Invalid credentials', res.status);
  }
  storeAuth(json.data);
  return json.data.user as AdminUser;
}

export async function logoutRemote(): Promise<void> {
  const auth = getStoredAuth();
  clearAuth();
  if (!auth) return;
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
  } catch {
    // best-effort — the local session is already cleared
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const auth = getStoredAuth();
  if (!auth) return null;
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.refreshToken}` },
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) return null;
        storeAuth(json.data);
        return json.data.accessToken as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Attaches the access token, retries once via refresh-token exchange on 401,
// and unwraps the API's `{ success, data }` envelope.
export async function authFetch(path: string, init: RequestInit = {}): Promise<any> {
  const auth = getStoredAuth();

  const doFetch = async (token: string | null) => {
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(`${API_URL}${path}`, { ...init, headers });
  };

  let res = await doFetch(auth?.accessToken ?? null);

  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      clearAuth();
      throw new ApiError('Session expired — please sign in again', 401);
    }
    res = await doFetch(newToken);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(extractErrorMessage(json) || `Request failed (${res.status})`, res.status);
  }
  return json.data;
}

export async function uploadFile(file: File, folder?: string): Promise<{ url: string; key: string }> {
  const auth = getStoredAuth();
  const form = new FormData();
  form.append('file', file);
  const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';

  const doFetch = async (token: string | null) => {
    const headers = new Headers();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(`${API_URL}/uploads${qs}`, { method: 'POST', headers, body: form });
  };

  let res = await doFetch(auth?.accessToken ?? null);
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) res = await doFetch(newToken);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(extractErrorMessage(json) || 'Upload failed', res.status);
  }
  return json.data;
}
