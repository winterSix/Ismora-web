const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

// Fetches from the Ismora API and unwraps the `{ success, data }` envelope
// every endpoint responds with. Returns null on any failure (network error,
// non-2xx, empty body, or timeout) so callers can fall back to static content
// instead of breaking the page when the API is unreachable. The explicit
// timeout matters most at build time: a plain fetch() can hang far longer
// than a host's page-build limit (e.g. Vercel's 60s) if the API is down or
// still deploying, turning a transient backend hiccup into a failed build.
const FETCH_TIMEOUT_MS = 8000;

export async function apiGet<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { tags: [tag], revalidate: 3600 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}
