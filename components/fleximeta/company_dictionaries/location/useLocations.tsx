import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { LocationsResponse, type Country } from './types';

// GET - Fetch location types with pagination and search
export const useLocationTypes = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<LocationsResponse> => {
  return useQuery({
    queryKey: ['location-types', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/locations`, {
        params: {
          page,
          per_page: perPage,
          q,
        },
      });
      return data;
    },
  });
};

// POST - Create a new location type
export const useCreateLocationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationTypeData: {
      code: string;
      name: string;
      abbrev: string;
      scope: string;
      active: number | string;
    }) => {
      // Convert active to number if it's a string
      const payload = {
        ...locationTypeData,
        active: Number(locationTypeData.active),
      };

      const { data } = await api.post(`/meta/companies/locations/store`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-types'] });
    },
    onError: (error: any) => {
      console.error('Error creating location type:', error);
    },
  });
};

// PUT - Update an existing location type
export const useUpdateLocationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Convert active to number if it's a string
      const payload = {
        ...data,
        active: Number(data.active),
      };

      const { data: response } = await api.put(`/meta/companies/locations/update/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['location-types'] });
      queryClient.invalidateQueries({ queryKey: ['location-type', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating location type:', error);
    },
  });
};

// DELETE - Delete a location type
export const useDeleteLocationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/locations/delete/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['location-types'] });
      queryClient.setQueryData(['location-types'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((type: any) => type.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting location type:', error);
    },
  });
};

// GET - Get single location type by ID
export const useLocationTypeapi = () => {
  return useQuery({
    queryKey: ['location-type-api'],
    queryFn: async () => {
   
      const { data } = await api.get(`/meta/companies/location`,{
        params: {
          per_page:"all"
        },
      });
      return data.data;
    },
   
  });
};

export const useCities = (countryId?: string, stateId?: string) => {
  return useQuery({
    queryKey: ['cities', countryId, stateId],
    queryFn: async () => {
      const { data } = await api.get(`/cities`, {
        params: {  per_page: "all", country_id: countryId,state_id: stateId }, // Filter by country_id
      });
      return data.data;
    },
  });
};

export const useCountries = (): UseQueryResult<Country[], Error> => {
  return useQuery<Country[], Error>({
    queryKey: ['countries'], // The key for the query
    queryFn: async () => {
      const res = await api.get('/countries', { params: { per_page: 'all' } });
      console.log("Fetched countries:", res.data.data);
      // Return the array of countries directly
      return res.data.data;
    },
  });
};

export const useStates = (countryId?: string) => {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: async () => {
      const { data } = await api.get(`/states`, {
        params: {  per_page: "all", country_id: countryId }, // Filter by country_id
      });
      return data.data;
    },
  });
};
