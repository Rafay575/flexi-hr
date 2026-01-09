// app/employee-type/useEmployeeTypes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET employee types with pagination and search
export const useEmployeeTypes = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['employee-types', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/employee-type`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create employee type
export const useCreateEmployeeType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employeeTypeData: any) => {
      const { data } = await api.post(`/meta/employee/employee-type`, employeeTypeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
    },
  });
};

// PUT update employee type
export const useUpdateEmployeeType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/employee/employee-type/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
    },
  });
};

// DELETE employee type
export const useDeleteEmployeeType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/employee-type/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
    },
  });
};