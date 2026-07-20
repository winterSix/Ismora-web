import { IsmoraV2 } from '@/components/v2/IsmoraV2';
import { getWorkProjects } from '@/lib/work';
import { getServiceDetails } from '@/lib/services';
import { getTeamMembers } from '@/lib/team';
import { getSectionVisibility } from '@/lib/sections';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function HomePage() {
  const [projects, services, members, visibility, siteSettings] = await Promise.all([
    getWorkProjects(),
    getServiceDetails(),
    getTeamMembers(),
    getSectionVisibility(),
    getSiteSettings(),
  ]);
  return (
    <IsmoraV2
      projects={projects}
      services={services}
      members={members}
      visibility={visibility}
      siteSettings={siteSettings}
    />
  );
}
