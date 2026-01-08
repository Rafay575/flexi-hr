// useStates.ts
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { Country } from './types';

// Fetch all states
export const useStates = (page: number, perPage: number, q: string, countryId?: string) => {
  return useQuery({
    queryKey: ['states', page, perPage, q, countryId],
    queryFn: async () => {
      const { data } = await api.get(`/states`, {
        params: { page, per_page: perPage, q, country_id: countryId }, // Filter by country_id
      });
      return data;
    },
  });
};

// POST create state
export const useCreateState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stateData: any) => {
      const { data } = await api.post(`/states`, stateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
  });
};

// PUT update state
export const useUpdateState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/states/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
  });
};

// DELETE state
export const useDeleteState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/states/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
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