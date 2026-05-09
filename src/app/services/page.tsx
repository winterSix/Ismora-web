import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { ServicesClient } from './services-client';

export const revalidate = 60;
export const metadata: Metadata = {
    title: 'Services',
    description: 'Enterprise MDM, DQM, ERP and data solutions from Ismora Technologies.',
};

export default async function ServicesPage() {
    const services = await api.services.all().catch(() => []);
    return <ServicesClient services={services} />;
}
