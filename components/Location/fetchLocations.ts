import { LocationsApiResponse } from './types';
import { api } from '@/components/api/client';

const fetchLocations = async (
  companyId: number,
  page: number = 1,
  perPage: number = 10,
  searchQuery: string = ""
): Promise<LocationsApiResponse> => {
  const params = new URLSearchParams();
  params.append('company_id', String(companyId));
  params.append('page', String(page));
  params.append('per_page', String(perPage));
  
  if (searchQuery) {
    params.append('q', searchQuery);
  }

  const response = await api.get<LocationsApiResponse>(
    `/meta/companies/locations?${params.toString()}`
  );

  return response.data;
};

export default fetchLocations;