import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { FxRatesResponse, FxRateFormData } from './types';

// GET - Fetch FX rates with pagination and search
export const useFxRates = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<FxRatesResponse> => {
  return useQuery({
    queryKey: ['fx-rates', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/fxrate`, {
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

// GET - Fetch FX rate by currency pair
export const useFxRateByPair = (
  baseCurrencyId: number,
  quoteCurrencyId: number,
  date?: string
): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['fx-rate-pair', baseCurrencyId, quoteCurrencyId, date],
    queryFn: async () => {
      const params: any = {
        base_currency_id: baseCurrencyId,
        quote_currency_id: quoteCurrencyId,
      };
      if (date) params.rate_date = date;
      
      const { data } = await api.get(`/meta/companies/finance/fxrate`, { params });
      return data.data?.[0] || null;
    },
    enabled: !!baseCurrencyId && !!quoteCurrencyId,
  });
};

// GET - Fetch latest FX rates for all currency pairs
export const useLatestFxRates = (): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['fx-rates-latest'],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/finance/fxrate`, {
        params: { per_page: 50, sort_by: 'rate_date', sort_order: 'desc' },
      });
      return data.data || [];
    },
  });
};

// POST - Create a new FX rate
export const useCreateFxRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fxRateData: FxRateFormData) => {
      const payload = {
        base_currency_id: Number(fxRateData.base_currency_id),
        quote_currency_id: Number(fxRateData.quote_currency_id),
        rate: parseFloat(fxRateData.rate.toString()),
        rate_date: fxRateData.rate_date,
      };

      const { data } = await api.post(`/meta/companies/finance/fxrate`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fx-rates'] });
      queryClient.invalidateQueries({ queryKey: ['fx-rates-latest'] });
    },
    onError: (error: any) => {
      console.error('Error creating FX rate:', error);
    },
  });
};

// PUT - Update an existing FX rate
export const useUpdateFxRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FxRateFormData }) => {
      const payload = {
        base_currency_id: Number(data.base_currency_id),
        quote_currency_id: Number(data.quote_currency_id),
        rate: parseFloat(data.rate.toString()),
        rate_date: data.rate_date,
      };

      const { data: response } = await api.put(`/meta/companies/finance/fxrate/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fx-rates'] });
      queryClient.invalidateQueries({ queryKey: ['fx-rates-latest'] });
      queryClient.invalidateQueries({ queryKey: ['fx-rate-pair'] });
      queryClient.invalidateQueries({ queryKey: ['fx-rate', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating FX rate:', error);
    },
  });
};

// DELETE - Delete a FX rate
export const useDeleteFxRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/finance/fxrate/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['fx-rates'] });
      queryClient.invalidateQueries({ queryKey: ['fx-rates-latest'] });
      queryClient.setQueryData(['fx-rates'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((rate: any) => rate.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting FX rate:', error);
    },
  });
};

// Utility function to convert currency
export const useCurrencyConverter = () => {
  const { data: fxRates, isLoading } = useLatestFxRates();

  const convert = (
    amount: number,
    fromCurrencyId: number,
    toCurrencyId: number,
    date?: string
  ): { convertedAmount: number | null; rate: number | null; isLoading: boolean } => {
    if (fromCurrencyId === toCurrencyId) {
      return { convertedAmount: amount, rate: 1, isLoading: false };
    }

    if (isLoading || !fxRates) {
      return { convertedAmount: null, rate: null, isLoading: true };
    }

    // Try to find direct rate
    const directRate = fxRates.find(
      (rate) => 
        rate.base_currency_id === fromCurrencyId && 
        rate.quote_currency_id === toCurrencyId &&
        (!date || rate.rate_date === date)
    );

    if (directRate) {
      const converted = amount * parseFloat(directRate.rate);
      return { convertedAmount: converted, rate: parseFloat(directRate.rate), isLoading: false };
    }

    // Try to find inverse rate
    const inverseRate = fxRates.find(
      (rate) => 
        rate.base_currency_id === toCurrencyId && 
        rate.quote_currency_id === fromCurrencyId &&
        (!date || rate.rate_date === date)
    );

    if (inverseRate) {
      const rate = 1 / parseFloat(inverseRate.rate);
      const converted = amount * rate;
      return { convertedAmount: converted, rate, isLoading: false };
    }

    // Could implement cross-currency conversion via USD or other base currency here
    return { convertedAmount: null, rate: null, isLoading: false };
  };

  return { convert, isLoading };
};