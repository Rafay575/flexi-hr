import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from '@/components/api/client'; // Make sure this is your API utility file.
import { Country } from './types';
export const useCities = (page: number, perPage: number, search: string, countryId?: string, stateId?: string) => {
  return useQuery(
    {queryKey:['cities', page, perPage, search, countryId, stateId], // Cache key
    queryFn: async () => {
      const { data } = await api.get('/cities', {
        params: {
          page,
          per_page: perPage,
          q: search, // the search query
          country_id: countryId, // Filter by country_id
          state_id: stateId, // Filter by state_id
        },
      });
      return data; // Assuming the API returns data in the same format
    },
   }
  );
};



// POST - Create a new city
export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cityData: {
      name: string;
      state_id: number | string;
      country_id: number | string;
      state_code?: string;
      country_code: string;
      latitude: number | string;
      longitude: number | string;
    }) => {
      // Convert string IDs to numbers if needed
      const payload = {
        ...cityData,
        state_id: Number(cityData.state_id),
        country_id: Number(cityData.country_id),
        latitude: Number(cityData.latitude),
        longitude: Number(cityData.longitude),
      };

      const { data } = await api.post(`/cities`, payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch cities query
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (error: any) => {
      console.error('Error creating city:', error);
      // You can add toast notification here if needed
    },
  });
};

// PUT - Update an existing city
export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Convert string IDs to numbers if needed
      const payload = {
        ...data,
        state_id: Number(data.state_id),
        country_id: Number(data.country_id),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      };

      const { data: response } = await api.put(`/cities/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate cities query
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      // Also invalidate the specific city if you have a detail query
      queryClient.invalidateQueries({ queryKey: ['city', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating city:', error);
    },
  });
};

// DELETE - Delete a city
export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cities/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Invalidate cities query
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      // Remove the deleted city from cache
      queryClient.setQueryData(['cities'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((city: any) => city.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting city:', error);
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