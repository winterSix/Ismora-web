import type { SectionVisibility } from '@/components/v2/IsmoraV2';
import { apiGet } from './api';

interface SectionDto {
  key: 'HERO' | 'ABOUT' | 'SERVICES' | 'WORK' | 'TEAM' | 'CONTACT';
  isEnabled: boolean;
}

const ALL_VISIBLE: SectionVisibility = {
  hero: true,
  about: true,
  services: true,
  work: true,
  team: true,
  contact: true,
};

// Falls back to "everything visible" when the API has no data yet or is
// unreachable, so the site never accidentally hides sections due to an outage.
export async function getSectionVisibility(): Promise<SectionVisibility> {
  const items = await apiGet<SectionDto[]>('/sections', 'sections');
  if (!items || items.length === 0) return ALL_VISIBLE;
  const visibility = { ...ALL_VISIBLE };
  for (const item of items) {
    const key = item.key.toLowerCase() as keyof SectionVisibility;
    if (key in visibility) visibility[key] = item.isEnabled;
  }
  return visibility;
}
