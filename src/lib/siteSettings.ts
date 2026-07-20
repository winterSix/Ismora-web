import { apiGet } from './api';

export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  socialLabel: string | null;
  socialUrl: string | null;
}

const FALLBACK: SiteSettings = {
  contactEmail: 'ismail.raji@ismoratech.com',
  contactPhone: '09023315974',
  socialLabel: null,
  socialUrl: null,
};

// Falls back to the known-current contact details when the API has nothing
// set yet or is unreachable, so the footer never renders empty.
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await apiGet<SiteSettings>('/site-settings', 'site-settings');
  return settings ?? FALLBACK;
}
