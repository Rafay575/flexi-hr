import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { Country, State, StatutoryRatesResponse, STATUTORY_CODE_OPTIONS } from './types';

// GET - Fetch statutory rates with pagination and filters
export const useStatutoryRates = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
  countryId?: string,
  code?: string,
  active?: string
): UseQueryResult<StatutoryRatesResponse> => {
  return useQuery({
    queryKey: ['statutory-rates', page, perPage, q, countryId, code, active],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
      if (countryId) params.country_id = countryId;
      if (code && code !== 'all') params.code = code;
      if (active && active !== 'all') params.is_active = active === 'active' ? 1 : 0;

      const { data } = await api.get(`/meta/companies/statutory_framework/statutory_rates`, { params });
      return data;
    },
  });
};

// POST - Create a new statutory rate
export const useCreateStatutoryRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rateData: any) => {
      const payload = {
        country_id: Number(rateData.country_id),
        state_id: rateData.state_id ? Number(rateData.state_id) : null,
        code: rateData.code,
        payload: {
          year: rateData.payload.year,
          slabs: rateData.payload.slabs.map((slab: any) => ({
            upto: Number(slab.upto),
            rate: Number(slab.rate),
            quick: Number(slab.quick),
          })),
        },
        effective_from: rateData.effective_from,
        effective_to: rateData.effective_to || null,
        is_active: rateData.is_active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/statutory_framework/statutory_rates`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statutory-rates'] });
    },
    onError: (error: any) => {
      console.error('Error creating statutory rate:', error);
    },
  });
};

// PUT - Update an existing statutory rate
export const useUpdateStatutoryRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        country_id: Number(data.country_id),
        state_id: data.state_id ? Number(data.state_id) : null,
        code: data.code,
        payload: {
          year: data.payload.year,
          slabs: data.payload.slabs.map((slab: any) => ({
            upto: Number(slab.upto),
            rate: Number(slab.rate),
            quick: Number(slab.quick),
          })),
        },
        effective_from: data.effective_from,
        effective_to: data.effective_to || null,
        is_active: data.is_active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/statutory_framework/statutory_rates/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['statutory-rates'] });
      queryClient.invalidateQueries({ queryKey: ['statutory-rate', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating statutory rate:', error);
    },
  });
};

// DELETE - Delete a statutory rate
export const useDeleteStatutoryRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/statutory_framework/statutory_rates/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['statutory-rates'] });
      queryClient.setQueryData(['statutory-rates'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((rate: any) => rate.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting statutory rate:', error);
    },
  });
};

// GET - Fetch countries
export const useCountries = (): UseQueryResult<Country[], Error> => {
  return useQuery<Country[], Error>({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await api.get('/countries', { params: { per_page: 'all' } });
      return res.data.data;
    },
  });
};

// GET - Fetch states for a country
export const useStates = (countryId?: string) => {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: async () => {
      if (!countryId) return [];
      const { data } = await api.get(`/states`, {
        params: { per_page: "all", country_id: countryId },
      });
      return data.data;
    },
    enabled: !!countryId,
  });
};

// GET - Fetch statutory codes (static options)
export const useStatutoryCodes = () => {
  return useQuery({
    queryKey: ['statutory-codes'],
    queryFn: async () => {
      return STATUTORY_CODE_OPTIONS;
    },
  });
};