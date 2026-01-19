'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, PlusIcon, Trash2Icon, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllSalaryComponents, type SalaryComponent } from './useGradeTemplates';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define Zod schema with validation
const componentSchema = z.object({
  code: z.string().min(1, 'Component code is required'),
  pct: z.number()
    .min(1, 'Percentage must be at least 1')
    .max(100, 'Percentage cannot exceed 100'),
});

const gradeTemplateFormSchema = z.object({
  code: z.string()
    .min(1, 'Code is required')
    .max(20, 'Code cannot exceed 20 characters')
    .regex(/^[A-Z0-9_-]+$/, 'Code can only contain uppercase letters, numbers, dashes, and underscores'),
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  description: z.string()
    .max(100, 'Description cannot exceed 100 characters')
    .optional(),
  components: z.array(componentSchema)
    .min(1, 'At least one component is required')
    .refine(
      components => {
        const total = components.reduce((sum, comp) => sum + (comp.pct || 0), 0);
        return total === 100;
      },
      { message: 'Total percentage must equal 100%' }
    ),
  active: z.boolean().default(true),
});

interface Submit {
  code: string;
  name: string;
  description: string | null;
  payload_json: {
    components: {
      code: string;
      pct: number;
    }[];
  };
  active: boolean;
}

export type GradeTemplateFormValues = z.infer<typeof gradeTemplateFormSchema>;

interface EditGradeTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Submit) => Promise<void>;
  isLoading: boolean;
  template: { code: string; name: string; description: string | null; payload_json: { components: { code: string; pct: number }[] }; active: boolean } | null;
}

export const EditGradeTemplateModal: React.FC<EditGradeTemplateModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  template,
}) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<GradeTemplateFormValues>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      components: [{ code: '', pct: 0 }],
      active: true,
    },
  });

  const { 
    data: salaryComponentsResponse, 
    isLoading: isSalaryComponentsLoading, 
    error: salaryComponentsError,
    refetch: refetchSalaryComponents 
  } = useAllSalaryComponents();

  const components = watch('components') || [];
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  // Get the salary components array from the response
  const salaryComponents = salaryComponentsResponse?.data || [];

  // Calculate total percentage whenever components change
  useEffect(() => {
    const total = components.reduce((sum, comp) => sum + (comp.pct || 0), 0);
    setTotalPercentage(total);
    
    // Update selected components list
    const selected = components.map(comp => comp.code).filter(code => code);
    setSelectedComponents(selected);
  }, [components]);

  // Get available salary components (filter out already selected ones)
  const availableSalaryComponents = salaryComponents.filter(
    (component: SalaryComponent) => component.active && (!selectedComponents.includes(component.code) || components.some(comp => comp.code === component.code))
  );

  useEffect(() => {
    if (template && open) {
      const formData = {
        code: template.code,
        name: template.name,
        description: template.description || "",
        components: template.payload_json.components,
        active: template.active,
      };
      reset(formData);  // Initialize the form with template data
    }
  }, [template, open, reset]);

  const onFormSubmit = async (values: GradeTemplateFormValues) => {
    const result = gradeTemplateFormSchema.safeParse(values);
    if (!result.success) {
      console.error('Validation failed:', result.error);
      return;
    }

    // Transform to API format
    const payload = {
      code: result.data.code,
      name: result.data.name,
      description: result.data.description || null,
      payload_json: {
        components: result.data.components.map(comp => ({
          code: comp.code,
          pct: comp.pct
        }))
      },
      active: result.data.active
    };

    console.log(payload);
    await onSubmit(payload);
    reset();  // Reset the form after successful submission
  };

  const addComponent = () => {
    const currentComponents = components;
    if (availableSalaryComponents.length > 0) {
      setValue('components', [...currentComponents, { code: '', pct: 0 }]);
    }
  };

  const removeComponent = (index: number) => {
    if (components.length > 1) {
      const newComponents = components.filter((_, i) => i !== index);
      setValue('components', newComponents);
    }
  };

  const updateComponent = (index: number, field: 'code' | 'pct', value: string | number) => {
    const currentComponents = [...components];
    
    if (field === 'pct') {
      const numValue = Number(value);
      currentComponents[index] = {
        ...currentComponents[index],
        pct: isNaN(numValue) ? 0 : Math.min(100, Math.max(0, numValue))
      };
    } else {
      currentComponents[index] = {
        ...currentComponents[index],
        code: value as string
      };
    }
    
    setValue('components', currentComponents, { shouldValidate: true });
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset();
      setTotalPercentage(0);
      setSelectedComponents([]);
    }
  }, [open, reset]);

  // Refetch salary components when modal opens
  useEffect(() => {
    if (open) {
      refetchSalaryComponents();
    }
  }, [open, refetchSalaryComponents]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Edit Grade Template</DialogTitle>
          <DialogDescription>
            Update the grade template details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="required">
                Code *
                <span className="text-xs text-gray-500 ml-2">(Max 20 chars, letters/numbers/_/- only)</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., G7"
                className="uppercase"
                maxLength={20}
                {...register('code', {
                  onChange: (e) => {
                    // Allow only letters, numbers, dash, underscore
                    const value = e.target.value.replace(/[^A-Z0-9_-]/gi, '');
                    setValue('code', value);
                  }
                })}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="required">
                Grade Name *
                <span className="text-xs text-gray-500 ml-2">(Max 50 characters)</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Grade 7"
                maxLength={50}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
              <span className="text-xs text-gray-500 ml-2">(Max 100 characters)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., Senior staff template"
              rows={3}
              maxLength={100}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="required">Salary Components *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addComponent}
                disabled={availableSalaryComponents.length === 0 || isSalaryComponentsLoading}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Component
              </Button>
            </div>

            {salaryComponentsError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load salary components. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {isSalaryComponentsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading salary components...</span>
              </div>
            ) : availableSalaryComponents.length === 0 && salaryComponents.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No active salary components available. Please create salary components first.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-3">
                  {components.map((component, index) => {
                    // Find selected component details
                    const selectedComponent = salaryComponents.find(
                      (comp: SalaryComponent) => comp.code === component.code
                    );

                    return (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Label htmlFor={`component-${index}`}>Component {index + 1}</Label>
                          <Select
                            value={component.code}
                            onValueChange={(value) => updateComponent(index, 'code', value)}
                          >
                            <SelectTrigger id={`component-${index}`}>
                              <SelectValue placeholder="Select a salary component">
                                {component.code ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{component.code}</span>
                                    {selectedComponent && (
                                      <Badge variant="outline" className="text-xs">
                                        {selectedComponent.name}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  "Select a salary component"
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {availableSalaryComponents.map((comp: SalaryComponent) => (
                                <SelectItem 
                                  key={comp.id} 
                                  value={comp.code}
                                >
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{comp.code}</span>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          comp.type === 'earning' ? 'bg-green-100 text-green-800' :
                                          comp.type === 'deduction' ? 'bg-red-100 text-red-800' :
                                          'bg-blue-100 text-blue-800'
                                        }`}
                                      >
                                        {comp.type}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-gray-500 truncate">{comp.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="w-32">
                          <Label htmlFor={`percentage-${index}`}>Percentage</Label>
                          <Input
                            id={`percentage-${index}`}
                            type="number"
                            placeholder="%"
                            value={component.pct || ''}
                            onChange={(e) => updateComponent(index, 'pct', e.target.value)}
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          {errors.components?.[index]?.pct && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.components[index]?.pct?.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeComponent(index)}
                          className="text-red-500 hover:text-red-700 self-end"
                          disabled={components.length <= 1}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Total Percentage:</span>
                    <p className="text-xs text-gray-500">
                      {selectedComponents.length} component{selectedComponents.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <Badge variant={totalPercentage === 100 ? "default" : "destructive"} className="text-lg px-4 py-2">
                    {totalPercentage.toFixed(2)}%
                    {totalPercentage !== 100 && (
                      <span className="ml-2">(Need {(100 - totalPercentage).toFixed(2)}% more)</span>
                    )}
                  </Badge>
                </div>

                {errors.components && typeof errors.components.message === 'string' && (
                  <p className="text-red-500 text-sm">
                    {errors.components.message}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Status</Label>
              <div className="text-sm text-gray-500">
                Set the template as active or inactive
              </div>
            </div>
            <Switch
              checked={watch('active')}
              onCheckedChange={(checked) => setValue('active', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#1E1B4B] hover:bg-[#2A2675]"
              disabled={isLoading || totalPercentage !== 100 || isSalaryComponentsLoading || salaryComponents.length === 0}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
