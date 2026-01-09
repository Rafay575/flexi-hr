import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { FrontendEntitiesResponse } from './types';

// GET - Fetch entities with pagination and search
export const useEntities = (
  page: number = 1,
  perPage: number = 10,
  q: string = ''
): UseQueryResult<FrontendEntitiesResponse> => {
  return useQuery({
    queryKey: ['entities', page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/entities`, {
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

// POST - Create a new entity
export const useCreateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entityData: {
      code: string;
      name: string;
      abbrev: string;
      active: number | string;
    }) => {
      // Convert active to number if it's a string
      const payload = {
        ...entityData,
        active: Number(entityData.active),
      };

      const { data } = await api.post(`/meta/companies/entities/store`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
    onError: (error: any) => {
      console.error('Error creating entity:', error);
    },
  });
};

// PUT - Update an existing entity
export const useUpdateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Convert active to number if it's a string
      const payload = {
        ...data,
        active: Number(data.active),
      };

      const { data: response } = await api.put(`/meta/companies/entities/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      queryClient.invalidateQueries({ queryKey: ['entity', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating entity:', error);
    },
  });
};

// DELETE - Delete an entity
export const useDeleteEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/entities/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      queryClient.setQueryData(['entities'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((entity: any) => entity.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting entity:', error);
    },
  });
};

// Optional: Get single entity by ID
export const useEntity = (id?: string) => {
  return useQuery({
    queryKey: ['entity', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/meta/companies/entities/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};