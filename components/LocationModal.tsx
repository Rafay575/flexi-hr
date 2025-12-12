
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { Location } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/button';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, location }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<Location>({
    defaultValues: location || {
      status: 'active',
      isVirtual: false,
      type: 'branch',
      timezone: 'UTC'
    }
  });

  // Watchers for cascading selects
  // We need to store IDs internally to drive the cascade, even though we save strings
  // We'll use local state for the IDs since the form stores the string values
  const [selectedCountryId, setSelectedCountryId] = React.useState<string>('');
  const [selectedStateId, setSelectedStateId] = React.useState<string>('');

  const { data: countries } = useQuery({ queryKey: ['geo', 'country'], queryFn: api.getCountries });
  const { data: states } = useQuery({ 
    queryKey: ['geo', 'state', selectedCountryId], 
    queryFn: () => selectedCountryId ? api.getStates(selectedCountryId) : Promise.resolve([]),
    enabled: !!selectedCountryId 
  });
  const { data: cities } = useQuery({ 
    queryKey: ['geo', 'city', selectedStateId], 
    queryFn: () => selectedStateId ? api.getCities(selectedStateId) : Promise.resolve([]),
    enabled: !!selectedStateId 
  });

  // Reset form
  useEffect(() => {
    if (isOpen) {
      reset(location || {
        status: 'active',
        isVirtual: false,
        type: 'branch',
        timezone: 'UTC',
        country: '',
        state: '',
        city: ''
      });
      setSelectedCountryId('');
      setSelectedStateId('');
    }
  }, [isOpen, location, reset]);

  // Handle cascading changes
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.options[e.target.selectedIndex].text;
    const countryId = e.target.value;
    
    setValue('country', countryName); // Save name to form
    setSelectedCountryId(countryId); // Save ID for cascade
    
    setValue('state', ''); // Reset child
    setSelectedStateId('');
    setValue('city', '');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.options[e.target.selectedIndex].text;
    const stateId = e.target.value;

    setValue('state', stateName);
    setSelectedStateId(stateId);
    
    setValue('city', '');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value; // Here we just take the value if it's the name, or text
    // Actually for cities, we might just want the name. 
    // Let's assume the value of the option is the name for simplicity, or we map it.
    // The mock API returns City objects. 
    // Let's assume the user selects a city from the list.
    setValue('city', cityName);
  };

  const mutation = useMutation({
    mutationFn: (data: Location) => 
      location ? api.updateLocation(location.id, data) : api.addLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      onClose();
    }
  });

  const onSubmit = (data: Location) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={location ? 'Edit Location' : 'Add New Location'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input 
              // label="Location Name *" 
              {...register('name', { required: 'Name is required' })} 
              // error={errors.name?.message}
              placeholder="e.g. New York Headquarters"
            />
          </div>

          <Input 
            // label="Location Code *" 
            {...register('code', { required: 'Code is required' })} 
            // error={errors.code?.message}
            placeholder="e.g. US-NYC-01"
          />

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
             <select 
               {...register('type')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="headquarters">Headquarters</option>
               <option value="regional_office">Regional Office</option>
               <option value="branch">Branch</option>
               <option value="warehouse">Warehouse</option>
               <option value="remote_hub">Remote Hub</option>
             </select>
          </div>

          <div className="col-span-2">
            <Input 
              // label="Address Line 1 *" 
              {...register('addressLine1', { required: 'Address is required' })} 
              // error={errors.addressLine1?.message}
            />
          </div>

          {/* Cascading Selects */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
            <select 
              onChange={handleCountryChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
              defaultValue=""
            >
              <option value="" disabled>Select Country</option>
              {countries?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {/* Hidden input to bind react-hook-form */}
            <input type="hidden" {...register('country', { required: 'Country is required' })} />
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State / Province *</label>
            <select 
              onChange={handleStateChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white disabled:bg-slate-50"
              disabled={!selectedCountryId}
              defaultValue=""
            >
              <option value="" disabled>Select State</option>
              {states?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input type="hidden" {...register('state', { required: 'State is required' })} />
            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
            <select 
              onChange={handleCityChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white disabled:bg-slate-50"
              disabled={!selectedStateId}
              defaultValue=""
            >
              <option value="" disabled>Select City</option>
              {cities?.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <input type="hidden" {...register('city', { required: 'City is required' })} />
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
          </div>

          <div>
            <Input 
              // label="Timezone" 
              {...register('timezone')} 
              placeholder="e.g. America/New_York"
            />
          </div>

          <div className="col-span-2 flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 id="isVirtual"
                 {...register('isVirtual')}
                 className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
               />
               <label htmlFor="isVirtual" className="text-sm text-slate-700">Virtual / Remote Location</label>
            </div>
            
            <div className="flex items-center gap-2">
               <label className="text-sm font-medium text-slate-700">Status:</label>
               <select 
                 {...register('status')} 
                 className="px-2 py-1 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
               >
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
               </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" >
            {location ? 'Save Changes' : 'Create Location'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
