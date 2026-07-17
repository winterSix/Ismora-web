import { IsmoraV2 } from '@/components/v2/IsmoraV2';
import { getWorkProjects } from '@/lib/work';
import { getServiceDetails } from '@/lib/services';
import { getTeamMembers } from '@/lib/team';
import { getSectionVisibility } from '@/lib/sections';

export default async function HomePage() {
  const [projects, services, members, visibility] = await Promise.all([
    getWorkProjects(),
    getServiceDetails(),
    getTeamMembers(),
    getSectionVisibility(),
  ]);
  return <IsmoraV2 projects={projects} services={services} members={members} visibility={visibility} />;
}
