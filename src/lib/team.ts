import { TEAM, type Member } from '@/components/v2/panels/MeetTheTeamPanel';
import { apiGet } from './api';

interface TeamMemberDto {
  id: string;
  name: string;
  role: string;
  order: number;
}

// Falls back to the static TEAM list when the API has nothing yet or is
// unreachable, so the site never renders an empty Team section.
export async function getTeamMembers(): Promise<Member[]> {
  const items = await apiGet<TeamMemberDto[]>('/team', 'team-members');
  if (!items || items.length === 0) return TEAM;
  return items.map((item) => ({ name: item.name, role: item.role }));
}
