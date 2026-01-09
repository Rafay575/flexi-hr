// app/gender/useGenders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

// GET genders with pagination and search
export const useGenders = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['genders', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/employee/gender`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

// POST create gender
export const useCreateGender = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (genderData: any) => {
      const { data } = await api.post(`/meta/employee/gender`, genderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genders'] });
    },
  });
};

// PUT update gender
export const useUpdateGender = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/employee/gender/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genders'] });
    },
  });
};

// DELETE gender
export const useDeleteGender = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/employee/gender/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genders'] });
    },
  });
};