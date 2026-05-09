import { api } from '@/lib/api';
import { HomeClient } from './home-client';

export const revalidate = 60;

export default async function HomePage() {
    const [config, featuredServices] = await Promise.all([
        api.config().catch(() => null),
        api.services.featured().catch(() => []),
    ]);

    return <HomeClient config={config} featuredServices={featuredServices} />;
}
