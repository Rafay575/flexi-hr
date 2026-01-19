import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { ShiftArchetypesResponse } from './types';

// GET - Fetch shift archetypes with pagination and filters
export const useShiftArchetypes = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
  active?: string
): UseQueryResult<ShiftArchetypesResponse> => {
  return useQuery({
    queryKey: ['shift-archetypes', page, perPage, q, active],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
      if (active && active !== 'all') params.active = active === 'active' ? 1 : 0;

      const { data } = await api.get(`/meta/companies/catalogs/shift_archetypes`, { params });
      return data;
    },
  });
};

// POST - Create a new shift archetype
export const useCreateShiftArchetype = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (archetypeData: any) => {
      const payload = {
        code: archetypeData.code,
        name: archetypeData.name,
        start_time: archetypeData.start_time,
        end_time: archetypeData.end_time,
        break_min: Number(archetypeData.break_min),
        night_shift: archetypeData.night_shift ? 1 : 0,
        ot_rule_json: {
          ot_after_min: Number(archetypeData.ot_rule_json.ot_after_min),
          multiplier: Number(archetypeData.ot_rule_json.multiplier),
        },
        active: archetypeData.active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/catalogs/shift_archetypes`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-archetypes'] });
    },
    onError: (error: any) => {
      console.error('Error creating shift archetype:', error);
    },
  });
};

// PUT - Update an existing shift archetype
export const useUpdateShiftArchetype = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        code: data.code,
        name: data.name,
        start_time: data.start_time,
        end_time: data.end_time,
        break_min: Number(data.break_min),
        night_shift: data.night_shift ? 1 : 0,
        ot_rule_json: {
          ot_after_min: Number(data.ot_rule_json.ot_after_min),
          multiplier: Number(data.ot_rule_json.multiplier),
        },
        active: data.active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/catalogs/shift_archetypes/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shift-archetypes'] });
      queryClient.invalidateQueries({ queryKey: ['shift-archetype', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating shift archetype:', error);
    },
  });
};

// DELETE - Delete a shift archetype
export const useDeleteShiftArchetype = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/catalogs/shift_archetypes/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['shift-archetypes'] });
      queryClient.setQueryData(['shift-archetypes'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((archetype: any) => archetype.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting shift archetype:', error);
    },
  });
};