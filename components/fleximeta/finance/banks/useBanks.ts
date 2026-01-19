import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { BanksResponse, BankFormData } from './types';

// GET - Fetch banks with pagination and search
export const useBanks = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<BanksResponse> => {
  return useQuery({
    queryKey: ['banks', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/bank`, {
        params: {
          page,
          per_page: perPage,
          q,
        },
      });
      return data;
    },
  });
};

// GET - Fetch all banks (for dropdowns)
export const useBanksAll = (): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['banks-all'],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/bank`, {
        params: { per_page: 'all' },
      });
      return data.data;
    },
  });
};

// GET - Fetch banks by country
export const useBanksByCountry = (countryId: number): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['banks-by-country', countryId],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/bank`, {
        params: { country_id: countryId, per_page: 'all' },
      });
      return data.data;
    },
    enabled: !!countryId,
  });
};

// POST - Create a new bank
export const useCreateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bankData: BankFormData) => {
      const payload = {
        country_id: Number(bankData.country_id),
        bank_code: bankData.bank_code,
        bank_name: bankData.bank_name,
        active: bankData.active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/finance/bank`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['banks-all'] });
    },
    onError: (error: any) => {
      console.error('Error creating bank:', error);
    },
  });
};

// PUT - Update an existing bank
export const useUpdateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BankFormData }) => {
      const payload = {
        country_id: Number(data.country_id),
        bank_code: data.bank_code,
        bank_name: data.bank_name,
        active: data.active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/finance/bank/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['banks-all'] });
      queryClient.invalidateQueries({ queryKey: ['bank', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating bank:', error);
    },
  });
};

// DELETE - Delete a bank
export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/finance/bank/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      queryClient.invalidateQueries({ queryKey: ['banks-all'] });
      queryClient.setQueryData(['banks'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((bank: any) => bank.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting bank:', error);
    },
  });
};