import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { DeviceTypesResponse, CONNECTOR_CODE_OPTIONS, DEVICE_BRAND_OPTIONS, FIELD_MAPPING_OPTIONS } from './types';

// GET - Fetch device types with pagination and filters
export const useDeviceTypes = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
  active?: string
): UseQueryResult<DeviceTypesResponse> => {
  return useQuery({
    queryKey: ['device-types', page, perPage, q, active],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
      if (active && active !== 'all') params.active = active === 'active' ? 1 : 0;

      const { data } = await api.get(`/meta/companies/catalogs/device_type`, { params });
      return data;
    },
  });
};

// POST - Create a new device type
export const useCreateDeviceType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deviceTypeData: any) => {
      const payload = {
        brand: deviceTypeData.brand,
        model: deviceTypeData.model,
        connector_code: deviceTypeData.connector_code,
        field_map_json: {
          badge: deviceTypeData.field_map_json.badge,
          timestamp: deviceTypeData.field_map_json.timestamp,
          direction: deviceTypeData.field_map_json.direction,
        },
        active: deviceTypeData.active ? 1 : 0,
      };

      const { data } = await api.post(`/meta/companies/catalogs/device_type`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
    },
    onError: (error: any) => {
      console.error('Error creating device type:', error);
    },
  });
};

// PUT - Update an existing device type
export const useUpdateDeviceType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        brand: data.brand,
        model: data.model,
        connector_code: data.connector_code,
        field_map_json: {
          badge: data.field_map_json.badge,
          timestamp: data.field_map_json.timestamp,
          direction: data.field_map_json.direction,
        },
        active: data.active ? 1 : 0,
      };

      const { data: response } = await api.put(`/meta/companies/catalogs/device_type/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
      queryClient.invalidateQueries({ queryKey: ['device-type', variables.id] });
    },
    onError: (error: any) => {
      console.error('Error updating device type:', error);
    },
  });
};

// DELETE - Delete a device type
export const useDeleteDeviceType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta/companies/catalogs/device_type/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
      queryClient.setQueryData(['device-types'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((deviceType: any) => deviceType.id.toString() !== id) || [],
        };
      });
    },
    onError: (error: any) => {
      console.error('Error deleting device type:', error);
    },
  });
};

// GET - Fetch connector codes (static options)
export const useConnectorCodes = () => {
  return useQuery({
    queryKey: ['connector-codes'],
    queryFn: async () => {
      return CONNECTOR_CODE_OPTIONS;
    },
  });
};

// GET - Fetch device brands (static options)
export const useDeviceBrands = () => {
  return useQuery({
    queryKey: ['device-brands'],
    queryFn: async () => {
      return DEVICE_BRAND_OPTIONS;
    },
  });
};

// GET - Fetch field mapping options (static options)
export const useFieldMappingOptions = () => {
  return useQuery({
    queryKey: ['field-mapping-options'],
    queryFn: async () => {
      return FIELD_MAPPING_OPTIONS;
    },
  });
};