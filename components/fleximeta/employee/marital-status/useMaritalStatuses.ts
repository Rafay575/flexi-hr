// app/marital-status/useMaritalStatuses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET marital statuses with pagination and search
export const useMaritalStatuses = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['marital-statuses', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/marital-statuses`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create marital status
export const useCreateMaritalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (maritalStatusData: any) => {
      const { data } = await api.post(`/meta/employee/marital-statuses`, maritalStatusData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marital-statuses'] });
    },
  });
};

// PUT update marital status
export const useUpdateMaritalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/employee/marital-statuses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marital-statuses'] });
    },
  });
};

// DELETE marital status
export const useDeleteMaritalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/marital-statuses/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marital-statuses'] });
    },
  });
};