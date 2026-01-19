import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { Country, CurrencyOption, MinimumWagesResponse } from './types';

// GET - Fetch minimum wages with pagination and filters
export const useMinimumWages = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
 
): UseQueryResult<MinimumWagesResponse> => {
  return useQuery({
    queryKey: ['minimum-wages', page, perPage, q],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
    

      const { data } = await api.get(`/meta/companies/statutory_framework/minimum_wages`, { params });
      return data;
    },
  });
};

// POST - Create a new minimum wage
export const useCreateMinimumWage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wageData: any) => {
   const formDataToSend = new FormData();
   formDataToSend.append('country_id', String(wageData.country_id));
   if (wageData.state_id) {
     formDataToSend.append('state_id', String(wageData.state_id));
   }
   formDataToSend.append('wage_amount', String(wageData.wage_amount));
   formDataToSend.append('wage_basis', wageData.wage_basis);
   formDataToSend.append('currency_id', String(wageData.currency_id));
   formDataToSend.append('effective_from', wageData.effective_from);
   if (wageData.effective_to) {
     formDataToSend.append('effective_to', wageData.effective_to);
   }
   formDataToSend.append('is_active', wageData.is_active ? '1' : '0');
   if (wageData.source_ref) {
     formDataToSend.append('source_ref', wageData.source_ref);
   }

   const { data } = await api.post(`/meta/companies/statutory_framework/minimum_wages`, formDataToSend);
   return data;
 },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minimum-wages'] });
    },
    onError: (error: any) => {
      console.error('Error creating minimum wage:', error);
    },
  });
};

// PUT - Update an existing minimum wage
export const useUpdateMinimumWage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
    

      const { data: response } = await api.post(`/meta/companies/statutory_framework/minimum_wages/${id}`, data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['minimum-wages'] });
      queryClient.invalidateQueries({ queryKey: ['minimum-wage', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating minimum wage:', error);
    },
  });
};

// DELETE - Delete a minimum wage
export const useDeleteMinimumWage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/statutory_framework/minimum_wages/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['minimum-wages'] });
      queryClient.setQueryData(['minimum-wages'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((wage: any) => wage.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting minimum wage:', error);
    },
  });
};





export const useCountries = (): UseQueryResult<Country[], Error> => {
  return useQuery<Country[], Error>({
    queryKey: ['countries'], // The key for the query
    queryFn: async () => {
      const res = await api.get('/countries', { params: { per_page: 'all' } });
      console.log("Fetched countries:", res.data.data);
      // Return the array of countries directly
      return res.data.data;
    },
  });
};

export const useStates = (countryId?: string) => {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: async () => {
      const { data } = await api.get(`/states`, {
        params: {  per_page: "all", country_id: countryId }, // Filter by country_id
      });
      return data.data;
    },
  });
};

export const useCurrencies = (): UseQueryResult<CurrencyOption[], Error> => {
  return useQuery<CurrencyOption[], Error>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const res = await api.get('/meta/companies/finance/currencies', { 
        params: { per_page: 'all' } 
      });
      console.log("Fetched currencies (id & iso_code):", res.data.data);
      
      // Map to only return id and iso_code
      return res.data.data.map((currency: any) => ({
        id: currency.id,
        iso_code: currency.iso_code,
      }));
    },
  });
};