import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { SalaryComponentsResponse, SALARY_COMPONENT_TYPE_OPTIONS, FORMULA_HINT_OPTIONS } from './types';

// GET - Fetch salary components with pagination and filters
export const useSalaryComponents = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
  type?: string,
  active?: string
): UseQueryResult<SalaryComponentsResponse> => {
  return useQuery({
    queryKey: ['salary-components', page, perPage, q, type, active],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
      if (type && type !== 'all') params.type = type;
      if (active && active !== 'all') params.active = active === 'active' ? 1 : 0;

      const { data } = await api.get(`/meta/companies/catalogs/salary_components`, { params });
      return data;
    },
  });
};

// POST - Create a new salary component
export const useCreateSalaryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (componentData: any) => {
      const payload = {
        code: componentData.code,
        name: componentData.name,
        type: componentData.type,
        taxable: componentData.taxable ? 1 : 0,
        pensionable: componentData.pensionable ? 1 : 0,
        proratable: componentData.proratable ? 1 : 0,
        formula_hint: componentData.formula_hint,
        active: componentData.active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/catalogs/salary_components`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });
    },
    onError: (error: any) => {
      console.error('Error creating salary component:', error);
    },
  });
};

// PUT - Update an existing salary component
export const useUpdateSalaryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        code: data.code,
        name: data.name,
        type: data.type,
        taxable: data.taxable ? 1 : 0,
        pensionable: data.pensionable ? 1 : 0,
        proratable: data.proratable ? 1 : 0,
        formula_hint: data.formula_hint,
        active: data.active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/catalogs/salary_components/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });
      queryClient.invalidateQueries({ queryKey: ['salary-component', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating salary component:', error);
    },
  });
};

// DELETE - Delete a salary component
export const useDeleteSalaryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/catalogs/salary_components/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });
      queryClient.setQueryData(['salary-components'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((component: any) => component.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting salary component:', error);
    },
  });
};

// GET - Fetch salary component types (static options)
export const useSalaryComponentTypes = () => {
  return useQuery({
    queryKey: ['salary-component-types'],
    queryFn: async () => {
      return SALARY_COMPONENT_TYPE_OPTIONS;
    },
  });
};

// GET - Fetch formula hint options (static options)
export const useFormulaHints = () => {
  return useQuery({
    queryKey: ['formula-hints'],
    queryFn: async () => {
      return FORMULA_HINT_OPTIONS;
    },
  });
};