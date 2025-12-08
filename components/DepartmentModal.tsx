
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { canDeactivateDepartment, canDeactivateLine } from '../services/guards';
import { Department } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department | null; // For Edit
  parentId?: string | null; // For Add Child
  divisionId?: string; // For Add Root
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ 
  isOpen, 
  onClose, 
  department,
  parentId,
  divisionId
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!department;
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, clearErrors } = useForm<Department>({
    defaultValues: {
      status: 'active',
      type: 'department',
      headcount: 0
    }
  });

  const selectedType = watch('type');
  const isLine = selectedType === 'line' || selectedType === 'team';

  // Reset form when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (isEditing && department) {
        reset(department);
      } else {
        // Default to sub-department if parent exists, else department
        const defaultType = parentId ? 'sub-department' : 'department';
        reset({
          name: '',
          code: '',
          type: defaultType,
          parentId: parentId || null,
          divisionId: divisionId || '',
          status: 'active',
          headcount: 0,
          shortName: '',
          category: 'Operational',
          plannedHeadcount: 0
        });
      }
      clearErrors();
    }
  }, [isOpen, isEditing, department, parentId, divisionId, reset, clearErrors]);

  const { data: divisions } = useQuery({ queryKey: ['divisions'], queryFn: api.getDivisions });
  const { data: costCenters } = useQuery({ queryKey: ['costCenters'], queryFn: api.getCostCenters });

  const mutation = useMutation({
    mutationFn: (data: Department) => {
      // Clean up fields based on type before sending
      const payload = { ...data };
      if (isLine) {
        delete payload.shortName;
        delete payload.category;
        delete payload.managerId;
      } else {
        delete payload.plannedHeadcount;
      }

      return isEditing 
        ? api.updateDepartment(department!.id, payload) 
        : api.addDepartment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onClose();
    }
  });

  const onSubmit = (data: Department) => {
    mutation.mutate(data);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? `Edit ${isLine ? 'Line' : 'Department'}` : parentId ? 'Add Child Unit' : 'Add Root Department'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           
           {/* Division (Read-only if child or editing, Selectable if new root without pre-selected filter) */}
           <div className="col-span-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Division *</label>
             <select 
               {...register('divisionId', { required: 'Division is required' })} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white disabled:bg-slate-50 disabled:text-slate-500"
               disabled={isEditing || !!parentId || !!divisionId}
             >
               <option value="">Select Division</option>
               {divisions?.map(d => (
                 <option key={d.id} value={d.id}>{d.name}</option>
               ))}
             </select>
             {errors.divisionId && <p className="mt-1 text-xs text-red-500">{errors.divisionId.message}</p>}
           </div>

           {/* Unit Type Selection */}
           <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
             <label className="block text-sm font-medium text-slate-700 mb-1">Unit Type</label>
             <select 
               {...register('type')} 
               className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
             >
               <optgroup label="Departmental Units">
                 <option value="department">Department</option>
                 <option value="sub-department">Sub-Department</option>
               </optgroup>
               <optgroup label="Operational Lines">
                 <option value="line">Line / Function</option>
                 <option value="team">Team</option>
               </optgroup>
             </select>
           </div>

           {/* --- COMMON FIELDS --- */}
           <div className="col-span-2">
             <Input 
               label="Name *" 
               {...register('name', { required: 'Name is required' })} 
               error={errors.name?.message}
               placeholder={isLine ? "e.g. Backend Line A" : "e.g. Engineering"}
             />
           </div>

           {/* --- FORM A: DEPARTMENT FIELDS --- */}
           {!isLine && (
             <>
               <Input 
                 label="Code *" 
                 {...register('code', { required: 'Code is required for departments' })} 
                 error={errors.code?.message}
                 placeholder="e.g. ENG"
               />
               <Input 
                 label="Short Name" 
                 {...register('shortName')} 
                 placeholder="e.g. Eng"
               />
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    {...register('category')} 
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Support">Support</option>
                    <option value="R&D">R&D</option>
                    <option value="Administrative">Administrative</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Head of Department</label>
                  {/* Mock Employee Select */}
                  <select 
                    {...register('managerId')} 
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Select Manager</option>
                    <option value="emp1">Sarah Jenkins (CTO)</option>
                    <option value="emp2">Mike Ross (VP Eng)</option>
                    <option value="emp3">Jessica Pearson (Dir)</option>
                  </select>
               </div>
             </>
           )}

           {/* --- FORM B: LINE FIELDS --- */}
           {isLine && (
             <>
               <Input 
                 label="Code (Optional)" 
                 {...register('code')} 
                 placeholder="e.g. LINE-01"
               />
               <Input 
                 label="Planned Headcount" 
                 type="number"
                 {...register('plannedHeadcount', { valueAsNumber: true })} 
                 placeholder="0"
               />
             </>
           )}

           {/* --- SHARED FOOTER --- */}
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
             <select 
               {...register('status', {
                  validate: async (value) => {
                    if (department && value === 'inactive') {
                      const check = isLine 
                        ? await canDeactivateLine(department.id) 
                        : await canDeactivateDepartment(department.id);
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
           
           {!isLine && (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Cost Center</label>
               <select 
                 {...register('costCenterId')} 
                 className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
               >
                 <option value="">Select Cost Center (Optional)</option>
                 {costCenters?.map(cc => (
                   <option key={cc.id} value={cc.id}>{cc.name} ({cc.code})</option>
                 ))}
               </select>
             </div>
           )}

           {/* Parent ID Hidden Field */}
           <input type="hidden" {...register('parentId')} />
        </div>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Unit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
