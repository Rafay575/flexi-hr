import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { BusinessesResponse } from './types';

// GET - Fetch businesses with pagination and search
export const useBusinesses = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<BusinessesResponse> => {
  return useQuery({
    queryKey: ['businesses', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/business`, {
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

// GET - Fetch all businesses (for dropdowns)
export const useBusinessesAll = (): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['businesses-all'],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/business`, {
        params: { per_page: 'all' },
      });
      return data.data;
    },
  });
};

// POST - Create a new business
export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessData: {
      code: string;
      name: string;
      description: string;
      industry_code: string;
      active: number | string;
    }) => {
      // Convert active to number
      const payload = {
        ...businessData,
        active: Number(businessData.active),
      };

      const { data } = await api.post(`/meta/companies/business`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['businesses-all'] });
    },
    onError: (error: any) => {
      console.error('Error creating business:', error);
    },
  });
};

// PUT - Update an existing business
export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Convert active to number
      const payload = {
        ...data,
        active: Number(data.active),
      };

      const { data: response } = await api.put(`/meta/companies/business/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['businesses-all'] });
      queryClient.invalidateQueries({ queryKey: ['business', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating business:', error);
    },
  });
};

// DELETE - Delete a business
export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/business/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['businesses-all'] });
      queryClient.setQueryData(['businesses'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((business: any) => business.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting business:', error);
    },
  });
};