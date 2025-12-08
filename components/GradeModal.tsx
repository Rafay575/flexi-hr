
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { canDeactivateGrade } from '../services/guards';
import { Grade } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade?: Grade | null;
}

export const GradeModal: React.FC<GradeModalProps> = ({ isOpen, onClose, grade }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<Grade>({
    defaultValues: grade || {
      status: 'active',
      currency: 'USD'
    }
  });

  const minSalary = watch('minBaseSalary');

  const mutation = useMutation({
    mutationFn: (data: Grade) => 
      grade ? api.updateGrade(grade.id, data) : api.addGrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      onClose();
    },
    onError: (error: Error) => {
      setError('root', { message: error.message });
    }
  });

  const onSubmit = (data: Grade) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={grade ? 'Edit Grade' : 'Add New Grade'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="col-span-2">
             <Input 
               label="Grade Name *" 
               {...register('name', { required: 'Name is required' })} 
               error={errors.name?.message}
               placeholder="e.g. Senior Management"
             />
           </div>

           <Input 
             label="Code *" 
             {...register('code', { required: 'Code is required' })} 
             error={errors.code?.message}
             placeholder="e.g. M-02"
           />

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Hierarchy Level *</label>
             <input 
                type="number"
                {...register('level', { required: 'Level is required', min: 1, max: 20 })} 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="1 (Highest)"
             />
             <p className="text-xs text-slate-500 mt-1">Numerical level for sorting.</p>
             {errors.level && <p className="mt-1 text-xs text-red-500">{errors.level.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
             <select 
               {...register('currency')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="USD">USD ($)</option>
               <option value="EUR">EUR (€)</option>
               <option value="GBP">GBP (£)</option>
               <option value="SGD">SGD (S$)</option>
               <option value="INR">INR (₹)</option>
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
             <select 
               {...register('status', {
                 validate: async (value) => {
                   if (grade && value === 'inactive') {
                     const check = await canDeactivateGrade(grade.id);
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
           
           <div className="col-span-2 pt-2 border-t border-slate-100 mt-2">
             <h4 className="text-sm font-medium text-slate-900 mb-3">Salary Band</h4>
             <div className="grid grid-cols-2 gap-4">
               <Input 
                 label="Min Base Salary" 
                 type="number"
                 {...register('minBaseSalary', { required: 'Min salary is required', min: 0 })} 
                 error={errors.minBaseSalary?.message}
                 placeholder="0"
               />
               <Input 
                 label="Max Base Salary" 
                 type="number"
                 {...register('maxBaseSalary', { 
                    required: 'Max salary is required', 
                    validate: (value) => Number(value) >= Number(minSalary) || "Max must be greater than Min"
                 })} 
                 error={errors.maxBaseSalary?.message}
                 placeholder="0"
               />
             </div>
           </div>
        </div>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span> {errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {grade ? 'Save Changes' : 'Create Grade'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
