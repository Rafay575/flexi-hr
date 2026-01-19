import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { DocumentTypesResponse, REQUIRED_FOR_OPTIONS, DOCUMENT_CATEGORY_OPTIONS } from './types';

// GET - Fetch document types with pagination and filters
export const useDocumentTypes = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
  requiredFor?: string,
  category?: string,
  active?: string
): UseQueryResult<DocumentTypesResponse> => {
  return useQuery({
    queryKey: ['document-types', page, perPage, q, requiredFor, category, active],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
      if (requiredFor && requiredFor !== 'all') params.required_for = requiredFor;
      if (category && category !== 'all') params.category = category;
      if (active && active !== 'all') params.active = active === 'active' ? 1 : 0;

      const { data } = await api.get(`/meta/companies/catalogs/document_type`, { params });
      return data;
    },
  });
};

// POST - Create a new document type
export const useCreateDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentTypeData: any) => {
      const payload = {
        code: documentTypeData.code,
        label: documentTypeData.label,
        required_for: documentTypeData.required_for,
        category: documentTypeData.category || null,
        name: documentTypeData.name || null,
        description: documentTypeData.description || null,
        active: documentTypeData.active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/catalogs/document_type`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
    },
    onError: (error: any) => {
      console.error('Error creating document type:', error);
    },
  });
};

// PUT - Update an existing document type
export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        code: data.code,
        label: data.label,
        required_for: data.required_for,
        category: data.category || null,
        name: data.name || null,
        description: data.description || null,
        active: data.active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/catalogs/document_type/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
      queryClient.invalidateQueries({ queryKey: ['document-type', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating document type:', error);
    },
  });
};

// DELETE - Delete a document type
export const useDeleteDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/catalogs/document_type/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
      queryClient.setQueryData(['document-types'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((docType: any) => docType.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting document type:', error);
    },
  });
};

// GET - Fetch required for options (static options)
export const useRequiredForOptions = () => {
  return useQuery({
    queryKey: ['required-for-options'],
    queryFn: async () => {
      return REQUIRED_FOR_OPTIONS;
    },
  });
};

// GET - Fetch document categories (static options)
export const useDocumentCategories = () => {
  return useQuery({
    queryKey: ['document-categories'],
    queryFn: async () => {
      return DOCUMENT_CATEGORY_OPTIONS;
    },
  });
};