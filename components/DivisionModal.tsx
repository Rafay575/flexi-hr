import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Components
import { Modal } from './ui/Modal';
import { Button } from './ui/button';
import { Input } from './ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Services
import { api } from '@/components/api/client';

// Types
import { Division } from '../types';

// API Calls for fetching Companies and Regions
const fetchCompanies = async () => {
  const res = await api.get('/v1/companies?per_page=1000');
  return res.data.data; // Companies data from API response
};

const fetchRegions = async () => {
  const res = await api.get('/meta/companies/regions');
  return res.data.data; // Regions data from API response
};

// Custom methods for updating and adding division
const updateDivision = (divisionId: number, data: any) =>
  api.put(`/company-divisions/updateCompanyDivision/${divisionId}`, data);
const addDivision = (data: any) =>
  api.post('/company-divisions/storeCompanyDivision', data);

interface DivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: Division | null;
}

// Define form type with string values for Select components
interface DivisionFormData {
  company_id: string; // Changed to string only
  region_id: string;  // Changed to string only
  name: string;
  code: string;
  description: string;
  active: boolean;
}

export const DivisionModal: React.FC<DivisionModalProps> = ({
  isOpen,
  onClose,
  division,
}) => {
  const queryClient = useQueryClient();

  // React Hook Form setup - Use DivisionFormData type
  const { 
    control, 
    register, 
    reset, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    watch 
  } = useForm<DivisionFormData>({
    defaultValues: {
      active: true,
      company_id: '',
      region_id: '',
      name: '',
      code: '',
      description: '',
    },
  });

  // Watch form values
  const companyId = watch('company_id');
  const regionId = watch('region_id');

  // Fetch companies and regions data
  const { data: companies, isLoading: isLoadingCompanies,refetch:refetchCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    enabled: isOpen, // Only fetch when modal is open
  });
  
  const { data: regions, isLoading: isLoadingRegions ,refetch:refetchRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: fetchRegions,
    enabled: isOpen, // Only fetch when modal is open
  });

  // Get selected company/region names
  const selectedCompanyName = companies?.find(
    (company: any) => String(company.id) === companyId
  )?.legal_name || '';

  const selectedRegionName = regions?.find(
    (region: any) => String(region.id) === regionId
  )?.name || '';

  // Reset form data when modal opens and division is available
  useEffect(() => {
    if (division && isOpen) {
      refetchCompanies();
      refetchRegions();
      console.log('Resetting form with division data:', division);
      // Convert IDs to strings for Select components
      const formData = {
        name: division.name || '',
        code: division.code || '',
        description: division.description || '',
        active: division.active !== undefined ? division.active : true,
        company_id: division.company_id ? String(division.company_id) : '',
        region_id: division.region_id ? String(division.region_id) : '',
      };
      reset(formData);
    } else if (isOpen) {
      console.log('Resetting form for new division');
      // Reset to default for new division
      reset({
        active: true,
        company_id: '',
        region_id: '',
        name: '',
        code: '',
        description: '',
      });
    }
  }, [division, reset, isOpen]);

  // Mutation for handling division creation or update
  const mutation = useMutation({
    mutationFn: (data: DivisionFormData) => {
      // Convert string IDs back to numbers for API
      const payload = {
        ...data,
        company_id: data.company_id ? Number(data.company_id) : null,
        region_id: data.region_id ? Number(data.region_id) : null,
      };
      console.log('Submitting payload:', payload);
      return division ? updateDivision(division.id, payload) : addDivision(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      onClose();
      reset();
    },
    onError: (error: Error) => {
      setError('root', { message: error.message });
    },
  });

  // Form submission handler
  const onSubmit = (data: DivisionFormData) => {
    console.log('Form submitted:', data);
    mutation.mutate(data);
  };
// Add this check before rendering the form
if (isLoadingCompanies || isLoadingRegions) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Loading...">
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    </Modal>
  );
}
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={division ? 'Edit Division' : 'Add New Division'}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-col-1 gap-3 md:grid-cols-2"
      >
        {/* Company Dropdown */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <Controller
            name="company_id"
            control={control}
            rules={{ required: 'Company is required' }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                aria-label="Select Company"
                disabled={isLoadingCompanies}
              >
                <SelectTrigger className="px-4 py-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                  <SelectValue placeholder="Select Company">
                    {selectedCompanyName || "Select Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {companies?.map((company: any) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.legal_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.company_id && (
            <p className="text-xs text-red-600 mt-1">{errors.company_id.message}</p>
          )}
        </div>

        {/* Division Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Division Name *
          </label>
          <Input {...register('name', { required: 'Name is required' })} placeholder="Enter Division Name" />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Division Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Division Code *
          </label>
          <Input {...register('code', { required: 'Code is required' })} placeholder="Enter Division Code" />
          {errors.code && (
            <p className="text-xs text-red-600 mt-1">{errors.code.message}</p>
          )}
        </div>

        {/* Region Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region / Territory *
          </label>
          <Controller
            name="region_id"
            control={control}
            rules={{ required: 'Region is required' }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                aria-label="Select Region"
                disabled={isLoadingRegions}
              >
                <SelectTrigger className="px-4 py-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                  <SelectValue placeholder="Select Region">
                    {selectedRegionName || "Select Region"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {regions?.map((region: any) => (
                    <SelectItem key={region.id} value={String(region.id)}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.region_id && (
            <p className="text-xs text-red-600 mt-1">{errors.region_id.message}</p>
          )}
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <Controller
            name="active"
            control={control}
        
            render={({ field }) => (
              <Select
                value={field.value ? 'true' : 'false'}
                onValueChange={(value) => field.onChange(value === 'true')}
                aria-label="Select Status"
              >
                <SelectTrigger className="px-4 py-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                  <SelectValue placeholder="Select Status">
                    {field.value ? 'Active' : 'Inactive'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.active && (
            <p className="text-xs text-red-600 mt-1">{errors.active.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Input {...register('description')} placeholder="Description of the division" />
        </div>

        {/* Root level error (if any) */}
        {errors.root && (
          <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg">
            {errors.root.message}
          </div>
        )}

      

        {/* Submit Button */}
        <div className="flex w-full md:col-span-2 justify-end gap-4 pt-6">
          <Button type="button" variant="ghost" onClick={onClose} className="px-6 py-3 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="px-6 py-3 text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700">
            {division ? "Save Changes" : "Create Division"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};