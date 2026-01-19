import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

export const useTrades = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['trades', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/catalogs/trades`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

export const useCreateTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tradeData: any) => {
      const { data } = await api.post(`/meta/companies/catalogs/trades`, tradeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
};

export const useUpdateTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/companies/catalogs/trades/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
};

export const useDeleteTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/catalogs/trades/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
};