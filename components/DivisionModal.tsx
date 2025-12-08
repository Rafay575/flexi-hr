
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { canDeactivateDivision } from '../services/guards';
import { Division } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface DivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: Division | null;
}

export const DivisionModal: React.FC<DivisionModalProps> = ({ isOpen, onClose, division }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<Division>({
    defaultValues: division || {
      status: 'active',
    }
  });

  const { data: companies } = useQuery({ queryKey: ['companies'], queryFn: api.getCompanies });

  const mutation = useMutation({
    mutationFn: (data: Division) => 
      division ? api.updateDivision(division.id, data) : api.addDivision(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      onClose();
    },
    onError: (error: Error) => {
      setError('root', { message: error.message });
    }
  });

  const onSubmit = (data: Division) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={division ? 'Edit Division' : 'Add New Division'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="col-span-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
             <select 
               {...register('companyId', { required: 'Company is required' })} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
               disabled={!!division} // Often can't move division between entities
             >
               <option value="">Select Parent Entity</option>
               {companies?.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
             {errors.companyId && <p className="mt-1 text-xs text-red-500">{errors.companyId.message}</p>}
           </div>

           <Input 
             label="Division Name *" 
             {...register('name', { required: 'Name is required' })} 
             error={errors.name?.message}
             placeholder="e.g. Sales & Marketing"
           />
           
           <Input 
             label="Division Code *" 
             {...register('code', { required: 'Code is required' })} 
             error={errors.code?.message}
             placeholder="e.g. SAL-MKT"
           />

           <Input 
             label="Region / Territory" 
             {...register('region')} 
             placeholder="e.g. North America"
           />

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
             <select 
               {...register('status', {
                  validate: async (value) => {
                    if (division && value === 'inactive') {
                      const check = await canDeactivateDivision(division.id);
                      if (!check.allowed) return check.reason;
                    }
                    return true;
                  }
               })} 
               className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white ${errors.status ? 'border-red-500' : 'border-slate-300'}`}
             >
               <option value="active">Active</option>
               <option value="inactive">Inactive</option>
             </select>
             {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
           </div>
           
           <div className="col-span-2">
              <Input 
                label="Description" 
                {...register('description')} 
                placeholder="Brief description of functions..."
              />
           </div>
        </div>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {division ? 'Save Changes' : 'Create Division'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
