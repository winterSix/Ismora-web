import { authFetch } from './adminAuth';

export type SectionKey = 'HERO' | 'ABOUT' | 'SERVICES' | 'WORK' | 'TEAM' | 'CONTACT';

export interface SectionVisibility {
  id: string;
  key: SectionKey;
  isEnabled: boolean;
  updatedAt: string;
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  HERO: 'Hero (intro)',
  ABOUT: 'About Us',
  SERVICES: 'Services',
  WORK: 'Our Works',
  TEAM: 'Meet the Team',
  CONTACT: "Let's Connect (contact)",
};

export async function listSections(): Promise<SectionVisibility[]> {
  return authFetch('/sections', { method: 'GET' });
}

export async function setSectionEnabled(key: SectionKey, isEnabled: boolean): Promise<SectionVisibility> {
  return authFetch(`/sections/${key.toLowerCase()}`, { method: 'PATCH', body: JSON.stringify({ isEnabled }) });
}
