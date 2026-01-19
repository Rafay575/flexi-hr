import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/components/api/client";

export const useGradeTemplates = (page: number, perPage: number, q: string) => {
  return useQuery({
    queryKey: ['gradeTemplates', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/catalogs/grade_templates`, {
        params: { page, per_page: perPage, q }
      });
      return data;
    },
  });
};

export const useCreateGradeTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: any) => {
      const { data } = await api.post(`/meta/companies/catalogs/grade_templates`, templateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeTemplates'] });
    },
  });
};

export const useUpdateGradeTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/meta/companies/catalogs/grade_templates/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeTemplates'] });
    },
  });
};

export const useDeleteGradeTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/catalogs/grade_templates/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeTemplates'] });
    },
  });
};


export interface SalaryComponent {
  id: number;
  code: string;
  name: string;
  type: 'earning' | 'deduction' | 'allowance' | 'benefit';
  taxable: boolean;
  pensionable: boolean;
  proratable: boolean;
  formula_hint: 'fixed' | 'percentage' | 'calculated' | 'variable' | 'statutory';
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalaryComponentsResponse {
  data: SalaryComponent[];
  meta: {
    total: number;
    per_page: string | number;
    current_page: number;
    last_page: number;
  };
}

export const useAllSalaryComponents = () => {
  return useQuery<SalaryComponentsResponse, Error>({
    queryKey: ['salaryComponents', 'all'],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/catalogs/salary_components`, {
        params: { per_page: 'all' }
      });
      console.log('API Response:', data); // Add this to debug
      return data;
    },
  });
};