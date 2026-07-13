import { PROJECTS, type Project } from '@/components/v2/panels/OurWorksPanel';
import { apiGet } from './api';

interface WorkItemDto {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  date: string;
  color: string;
  accent: string;
  placeholder: boolean;
}

// Falls back to the static PROJECTS list when the API has nothing published
// yet or is unreachable, so the site never renders an empty Work section.
export async function getWorkProjects(): Promise<Project[]> {
  const items = await apiGet<WorkItemDto[]>('/work', 'work');
  if (!items || items.length === 0) return PROJECTS;
  return items.map((item) => ({
    name: item.name,
    logo: item.logo,
    description: item.description,
    industry: item.industry,
    date: item.date,
    color: item.color,
    accent: item.accent,
    placeholder: item.placeholder,
  }));
}
