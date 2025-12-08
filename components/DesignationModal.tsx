
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { canDeactivateDesignation } from '../services/guards';
import { Designation } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface DesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  designation?: Designation | null;
}

export const DesignationModal: React.FC<DesignationModalProps> = ({ isOpen, onClose, designation }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<Designation>({
    defaultValues: designation || {
      status: 'active',
    }
  });

  const { data: grades } = useQuery({ queryKey: ['grades'], queryFn: api.getGrades });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: api.getDepartments });
  const { data: designations } = useQuery({ queryKey: ['designations'], queryFn: api.getDesignations });

  // Filter out self from reportsTo list to prevent self-reference loops
  const potentialManagers = designations?.filter(d => d.id !== designation?.id) || [];

  const mutation = useMutation({
    mutationFn: (data: Designation) => 
      designation ? api.updateDesignation(designation.id, data) : api.addDesignation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      onClose();
    },
    onError: (error: Error) => {
      setError('root', { message: error.message });
    }
  });

  const onSubmit = (data: Designation) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={designation ? 'Edit Designation' : 'Add New Designation'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="col-span-2">
             <Input 
               label="Title *" 
               {...register('title', { required: 'Title is required' })} 
               error={errors.title?.message}
               placeholder="e.g. Senior Product Manager"
             />
           </div>

           <Input 
             label="Code" 
             {...register('code')} 
             placeholder="e.g. SPM-01"
           />

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Job Level *</label>
             <input 
                type="number"
                {...register('level', { required: 'Level is required', min: 1, max: 20 })} 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="1-20"
             />
             {errors.level && <p className="mt-1 text-xs text-red-500">{errors.level.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Grade / Band *</label>
             <select 
               {...register('gradeId', { required: 'Grade is required' })} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="">Select Grade</option>
               {grades?.map(g => (
                 <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
               ))}
             </select>
             {errors.gradeId && <p className="mt-1 text-xs text-red-500">{errors.gradeId.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Department (Optional)</label>
             <select 
               {...register('departmentId')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="">Global / All Departments</option>
               {departments?.map(d => (
                 <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
               ))}
             </select>
             <p className="text-xs text-slate-500 mt-1">If specific to a department.</p>
           </div>

           <div className="col-span-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Reports To (Structural)</label>
             <select 
               {...register('reportsToDesignationId')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <option value="">None / Top Level</option>
               {potentialManagers.map(d => (
                 <option key={d.id} value={d.id}>{d.title}</option>
               ))}
             </select>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
             <select 
               {...register('status', {
                 validate: async (value) => {
                   if (designation && value === 'inactive') {
                     const check = await canDeactivateDesignation(designation.id);
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
        </div>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span> {errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {designation ? 'Save Changes' : 'Create Designation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
