// app/salutation/useSalutations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET salutations with pagination and search
export const useSalutations = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['salutations', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/salutation`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create salutation
export const useCreateSalutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (salutationData: any) => {
      // Convert active boolean to 1/0 for API
      const dataToSend = {
        ...salutationData,
        active: salutationData.active ? 1 : 0
      };
      const { data } = await api.post(`/meta/employee/salutation`, dataToSend);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salutations'] });
    },
  });
};

// PUT update salutation
export const useUpdateSalutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Convert active boolean to 1/0 for API
      const dataToSend = {
        ...data,
        active: data.active ? 1 : 0
      };
      const response = await api.put(`/meta/employee/salutation/${id}`, dataToSend);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salutations'] });
    },
  });
};

// DELETE salutation
export const useDeleteSalutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/salutation/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salutations'] });
    },
  });
};