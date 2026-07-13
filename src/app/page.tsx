import { IsmoraV2 } from '@/components/v2/IsmoraV2';
import { getWorkProjects } from '@/lib/work';

export default async function HomePage() {
  const projects = await getWorkProjects();
  return <IsmoraV2 projects={projects} />;
}
