import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { CurrenciesResponse, CurrencyFormData } from './types';

// GET - Fetch currencies with pagination and search
export const useCurrencies = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<CurrenciesResponse> => {
  return useQuery({
    queryKey: ['currencies', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/currencies`, {
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

// GET - Fetch all currencies (for dropdowns)
export const useCurrenciesAll = (): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['currencies-all'],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/currencies`, {
        params: { per_page: 'all' },
      });
      return data.data;
    },
  });
};

// GET - Fetch active currencies only
export const useActiveCurrencies = (): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['currencies-active'],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/currencies`, {
        params: { active: 1, per_page: 'all' },
      });
      return data.data;
    },
  });
};

// POST - Create a new currency
export const useCreateCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currencyData: CurrencyFormData) => {
      const payload = {
        iso_code: currencyData.iso_code.toUpperCase(),
        symbol: currencyData.symbol,
        decimals: Number(currencyData.decimals),
        active: currencyData.active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/finance/currencies`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-all'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-active'] });
    },
    onError: (error: any) => {
      console.error('Error creating currency:', error);
    },
  });
};

// PUT - Update an existing currency
export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CurrencyFormData }) => {
      const payload = {
        iso_code: data.iso_code.toUpperCase(),
        symbol: data.symbol,
        decimals: Number(data.decimals),
        active: data.active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/finance/currencies/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-all'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-active'] });
      queryClient.invalidateQueries({ queryKey: ['currency', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating currency:', error);
    },
  });
};

// DELETE - Delete a currency
export const useDeleteCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/finance/currencies/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-all'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-active'] });
      queryClient.setQueryData(['currencies'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((currency: any) => currency.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting currency:', error);
    },
  });
};