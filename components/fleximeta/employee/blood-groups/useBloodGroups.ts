// app/blood-groups/useBloodGroups.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET blood groups with pagination and search
export const useBloodGroups = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['blood-groups', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/blood-groups`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create blood group
export const useCreateBloodGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bloodGroupData: any) => {
      const { data } = await api.post(`/meta/employee/blood-groups`, bloodGroupData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-groups'] });
    },
  });
};

// PUT update blood group
export const useUpdateBloodGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/employee/blood-groups/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-groups'] });
    },
  });
};

// DELETE blood group
export const useDeleteBloodGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/blood-groups/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-groups'] });
    },
  });
};