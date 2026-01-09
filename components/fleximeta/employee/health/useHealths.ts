// app/health/useHealths.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET health conditions with pagination and search
export const useHealths = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['healths', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/health`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create health condition
export const useCreateHealth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (healthData: any) => {
      const { data } = await api.post(`/meta/employee/health`, healthData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healths'] });
    },
  });
};

// PUT update health condition
export const useUpdateHealth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/employee/health/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healths'] });
    },
  });
};

// DELETE health condition
export const useDeleteHealth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/health/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healths'] });
    },
  });
};