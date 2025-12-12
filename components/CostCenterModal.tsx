

import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { CostCenter } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/button';

interface CostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  costCenter?: CostCenter | null;
}

export const CostCenterModal: React.FC<CostCenterModalProps> = ({ isOpen, onClose, costCenter }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<CostCenter>({
    defaultValues: costCenter || {
      status: 'active',
      validFrom: new Date().toISOString().split('T')[0]
    }
  });

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: api.getDepartments });
  const { data: locations } = useQuery({ queryKey: ['locations'], queryFn: api.getLocations });

  const mutation = useMutation({
    mutationFn: (data: CostCenter) => 
      costCenter ? api.updateCostCenter(costCenter.id, data) : api.addCostCenter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
      onClose();
    },
    onError: (error: Error) => {
      setError('root', { message: error.message });
    }
  });

  const onSubmit = (data: CostCenter) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={costCenter ? 'Edit Cost Center' : 'Add Cost Center'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="col-span-2">
             <Input 
               label="Cost Center Name *" 
               {...register('name', { required: 'Name is required' })} 
               error={errors.name?.message}
               placeholder="e.g. Research & Development"
             />
           </div>

           <Input 
             label="GL Code *" 
             {...register('code', { required: 'Code is required' })} 
             error={errors.code?.message}
             placeholder="e.g. CC-1001"
           />

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
             <select 
               {...register('status')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="active">Active</option>
               <option value="inactive">Inactive (Soft Delete)</option>
               <option value="frozen">Frozen (Budget Lock)</option>
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
             <select 
               {...register('departmentId')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="">Select Department (Optional)</option>
               {departments?.map(d => (
                 <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
               ))}
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
             <select 
               {...register('locationId')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="">Select Location (Optional)</option>
               {locations?.map(l => (
                 <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
               ))}
             </select>
           </div>

           <Input 
             label="Valid From *" 
             type="date"
             {...register('validFrom', { required: 'Date is required' })} 
             error={errors.validFrom?.message}
           />

           <Input 
             label="Valid To" 
             type="date"
             {...register('validTo')} 
           />
        </div>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span> {errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {costCenter ? 'Save Changes' : 'Create Cost Center'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};