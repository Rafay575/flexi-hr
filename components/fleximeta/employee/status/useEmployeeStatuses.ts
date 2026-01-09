// app/employee-status/useEmployeeStatuses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET employee statuses with pagination and search
export const useEmployeeStatuses = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['employee-statuses', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/status`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create employee status
export const useCreateEmployeeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (statusData: any) => {
      const { data } = await api.post(`/meta/employee/status`, statusData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-statuses'] });
    },
  });
};

// PUT update employee status
export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/employee/status/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-statuses'] });
    },
  });
};

// DELETE employee status
export const useDeleteEmployeeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/status/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-statuses'] });
    },
  });
};