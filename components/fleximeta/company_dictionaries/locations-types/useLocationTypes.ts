// hooks/useLocationTypes.ts
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { FrontendLocationTypesResponse, LocationTypeFormData } from './types';

// GET - Fetch location types with pagination and search
export const useLocationTypes = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<FrontendLocationTypesResponse> => {
  return useQuery({
    queryKey: ['locationTypes', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/location`, {
        params: {
          page,
          per_page: perPage,
          q,
         
        },
      });
      return data;
    },
    // Keep previous data while fetching
    placeholderData: (previousData) => previousData,
  });
};

// POST - Create a new location type
export const useCreateLocationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationTypeData: LocationTypeFormData) => {
      // Convert active to number if it's a string
      const payload = {
        ...locationTypeData,
        active: Number(locationTypeData.active),
      };

      const { data } = await api.post(`/meta/companies/location`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationTypes'] });
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
    mutationFn: async ({ id, data }: { id: string; data: LocationTypeFormData }) => {
      // Convert active to number if it's a string
      const payload = {
        ...data,
        active: Number(data.active),
      };

      const { data: response } = await api.put(`/meta/companies/location/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locationTypes'] });
      queryClient.invalidateQueries({ queryKey: ['locationType', variables.id] });
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
      await api.delete(`/meta/companies/location/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['locationTypes'] });
      queryClient.setQueryData(['locationTypes'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((locationType: any) => locationType.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting location type:', error);
    },
  });
};

// Optional: Get single location type by ID
export const useLocationType = (id?: string) => {
  return useQuery({
    queryKey: ['locationType', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/meta/companies/location/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};