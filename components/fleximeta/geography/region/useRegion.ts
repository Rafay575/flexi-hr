// app/regions/useRegions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET regions with pagination and search
export const useRegions = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['regions', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/regions`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create region
export const useCreateRegion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (regionData: any) => {
      const { data } = await api.post(`/meta/companies/regions/store`, regionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });
};

// PUT update region
export const useUpdateRegion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/companies/regions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });
};

// DELETE region
export const useDeleteRegion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/regions/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });
};