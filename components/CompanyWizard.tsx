
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Save, Upload, Palette } from 'lucide-react';
import { api } from '../services/mockData';
import { Company } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/button';
import { Stepper, Step } from './ui/Stepper';

interface CompanyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
}

const steps: Step[] = [
  { id: 'basic', title: 'Basic Info' },
  { id: 'contact', title: 'Contact Info' },
  { id: 'legal', title: 'Legal & Tax' },
  { id: 'branding', title: 'Branding' },
  { id: 'defaults', title: 'System Defaults' },
];

const stepsFields = {
  0: ['name', 'registrationNumber', 'sector', 'status'],
  1: ['addressLine1', 'city', 'state', 'country', 'postalCode'],
  2: ['taxId', 'domain', 'website'],
  3: ['logoUrl', 'brandColor'],
  4: ['fiscalYearStartMonth', 'currency', 'timezone']
};

export const CompanyWizard: React.FC<CompanyWizardProps> = ({ isOpen, onClose, company }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const queryClient = useQueryClient();

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<Company>({
    defaultValues: company || {
      status: 'active',
      country: 'USA',
      fiscalYearStartMonth: 1,
      currency: 'USD',
      timezone: 'America/New_York',
      brandColor: '#0ea5e9' // Default primary-500
    },
    mode: 'onChange'
  });

  const mutation = useMutation({
    mutationFn: (data: Company) => company ? api.updateCompany(company.id, data) : api.addCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      onClose();
    }
  });

  const handleNext = async () => {
    const fields = stepsFields[currentStep as keyof typeof stepsFields];
    const isValid = await trigger(fields as any);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = (data: Company) => {
    mutation.mutate(data);
  };

  const brandColor = watch('brandColor');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={company ? 'Edit Company' : 'Add New Company'} size="lg">
      <div className="pt-2 pb-8 px-4">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        <div className="min-h-[340px] px-2">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="col-span-2">
                <Input 
                  label="Company Name *" 
                  {...register('name', { required: 'Company name is required' })}
                  error={errors.name?.message}
                  placeholder="e.g. Acme Global Inc."
                  autoFocus
                />
              </div>
              <Input 
                label="Registration Number *" 
                {...register('registrationNumber', { required: 'Reg No. is required' })}
                error={errors.registrationNumber?.message}
                placeholder="e.g. US-DEL-12345"
              />
              <Input 
                label="Industry Sector" 
                {...register('sector')}
                placeholder="e.g. Technology, Retail"
              />
               <div className="col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                 <select 
                   {...register('status')} 
                   className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                 >
                   <option value="active">Active</option>
                   <option value="inactive">Inactive</option>
                 </select>
               </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="col-span-2">
                <Input 
                  label="Address Line 1 *" 
                  {...register('addressLine1', { required: 'Address is required' })}
                  error={errors.addressLine1?.message}
                  placeholder="Street address, P.O. box"
                  autoFocus
                />
              </div>
              <div className="col-span-2">
                <Input 
                  label="Address Line 2" 
                  {...register('addressLine2')}
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>
              <Input 
                label="City *" 
                {...register('city', { required: 'City is required' })}
                error={errors.city?.message}
              />
              <Input 
                label="State / Province *" 
                {...register('state', { required: 'State is required' })}
                error={errors.state?.message}
              />
              <Input 
                label="Country *" 
                {...register('country', { required: 'Country is required' })}
                error={errors.country?.message}
              />
              <Input 
                label="Postal Code *" 
                {...register('postalCode', { required: 'Postal Code is required' })}
                error={errors.postalCode?.message}
              />
            </div>
          )}

          {/* Step 3: Legal & Tax */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="col-span-2">
                <Input 
                  label="Tax Identification Number (TIN)" 
                  {...register('taxId')}
                  placeholder="e.g. XX-XXXXXXX"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1">Used for tax reporting and payroll compliance.</p>
              </div>
              <Input 
                label="Primary Domain" 
                {...register('domain')}
                placeholder="e.g. acme.com"
              />
              <Input 
                label="Website URL" 
                {...register('website')}
                placeholder="https://www.acme.com"
              />
            </div>
          )}

          {/* Step 4: Branding */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-900 mb-3">Company Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg bg-white border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-colors cursor-pointer">
                    <Upload size={24} />
                  </div>
                  <div className="flex-1">
                    <Input 
                      label="Logo URL" 
                      {...register('logoUrl')}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-500 mt-2 font-medium">Recommended size: 200x200px. PNG or JPG.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-900 mb-3">Theme Color</label>
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg border border-slate-200 shadow-sm" 
                    style={{ backgroundColor: brandColor }}
                  ></div>
                  <div className="flex-1">
                     <Input 
                      {...register('brandColor')}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  {['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#1e1b4b'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded-full border border-slate-200 hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        const event = { target: { value: color, name: 'brandColor' } };
                        register('brandColor').onChange(event);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: System Defaults */}
          {currentStep === 4 && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Fiscal Year Start</label>
                 <select 
                   {...register('fiscalYearStartMonth')} 
                   className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                 >
                   {Array.from({ length: 12 }, (_, i) => (
                     <option key={i} value={i + 1}>
                       {new Date(0, i).toLocaleString('default', { month: 'long' })}
                     </option>
                   ))}
                 </select>
                 <p className="text-xs text-slate-500 mt-1">Determines financial reporting periods.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Currency</label>
                <select 
                  {...register('currency')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="SGD">SGD (S$)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                 <Input 
                   label="Default Timezone" 
                   {...register('timezone')}
                   placeholder="e.g. America/New_York"
                 />
              </div>
              
              <div className="col-span-2 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100 flex items-start gap-2">
                <div className="mt-0.5 font-bold">ⓘ</div>
                <div>Currency and Fiscal Year settings affect all historical data reporting for this entity.</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={currentStep === 0 ? onClose : handleBack}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next Step <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button type="submit" isLoading={mutation.isPending}>
                <Save size={16} className="ml-2" />
                Create Company
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};