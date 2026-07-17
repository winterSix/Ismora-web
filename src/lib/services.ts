import { SERVICE_DETAILS, type ServiceDetail } from '@/components/v2/panels/ServiceDetailPanel';
import { apiGet } from './api';

interface ServiceDto {
  id: string;
  title: string;
  description: string;
  shape: ServiceDetail['shape'];
  color: string;
  emissive: string;
  side: ServiceDetail['side'];
  order: number;
}

// Falls back to the static SERVICE_DETAILS list when the API has nothing yet
// or is unreachable, so the site never renders an empty Services section.
export async function getServiceDetails(): Promise<ServiceDetail[]> {
  const items = await apiGet<ServiceDto[]>('/services', 'services');
  if (!items || items.length === 0) return SERVICE_DETAILS;
  return items.map((item) => ({
    title: item.title,
    description: item.description,
    shape: item.shape,
    color: item.color,
    emissive: item.emissive,
    side: item.side,
  }));
}
