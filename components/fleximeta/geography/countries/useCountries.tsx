import { api } from "@/components/api/client";
// useCountries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useCountries = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['countries', page, perPage, q], // Change to use 'q' here
    queryFn: async () => {
      const { data } = await api.get(`/countries`, {
        params: { page, per_page: perPage, q } // Use 'q' here instead of 'search'
      });
      return data;
    },
  });
};


// POST create country
export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (countryData: any) => {
      const { data } = await api.post(`/countries`, countryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

// PUT update country
export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/countries/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};

// DELETE country
export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/countries/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
};
