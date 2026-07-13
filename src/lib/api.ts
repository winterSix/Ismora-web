const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

// Fetches from the Ismora API and unwraps the `{ success, data }` envelope
// every endpoint responds with. Returns null on any failure (network error,
// non-2xx, empty body) so callers can fall back to static content instead of
// breaking the page when the API is unreachable.
export async function apiGet<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { tags: [tag], revalidate: 3600 } });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}
