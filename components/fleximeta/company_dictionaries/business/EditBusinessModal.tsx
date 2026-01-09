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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Form values interface
interface BusinessFormValues {
  code: string;
  name: string;
  description: string;
  industry_code: string;
  active: string;
}

interface EditBusinessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  business: any;
}

export const EditBusinessModal: React.FC<EditBusinessModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  business,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form with React Hook Form
  const form = useForm<BusinessFormValues>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      industry_code: '',
      active: '1',
    },
    mode: 'onChange',
  });

  // Populate form when business data changes
  useEffect(() => {
    if (business && !isInitialized && open) {
      form.reset({
        code: business.code || '',
        name: business.name || '',
        description: business.description || '',
        industry_code: business.industry_code || '',
        active: business.active ? '1' : '0',
      });

      setIsInitialized(true);
    }
  }, [business, form, isInitialized, open]);

  // Reset initialization when modal closes
  useEffect(() => {
    if (!open) {
      setIsInitialized(false);
    }
  }, [open]);

  // Handle form submission
  const handleSubmit = async (data: BusinessFormValues) => {
    // Validate required fields
    if (!data.code.trim()) {
      form.setError('code', { type: 'manual', message: 'Business code is required' });
      return;
    }
    if (!data.name.trim()) {
      form.setError('name', { type: 'manual', message: 'Business name is required' });
      return;
    }
    if (!data.description.trim()) {
      form.setError('description', { type: 'manual', message: 'Description is required' });
      return;
    }
    if (!data.industry_code.trim()) {
      form.setError('industry_code', { type: 'manual', message: 'Industry code is required' });
      return;
    }
    if (!data.active) {
      form.setError('active', { type: 'manual', message: 'Status is required' });
      return;
    }

    // Validate character limits
    if (data.code.length > 20) {
      form.setError('code', { type: 'manual', message: 'Code must be 20 characters or less' });
      return;
    }
    if (data.name.length > 50) {
      form.setError('name', { type: 'manual', message: 'Name must be 50 characters or less' });
      return;
    }
    if (data.description.length > 500) {
      form.setError('description', { type: 'manual', message: 'Description must be 500 characters or less' });
      return;
    }
    if (data.industry_code.length > 50) {
      form.setError('industry_code', { type: 'manual', message: 'Industry code must be 50 characters or less' });
      return;
    }

    // Validate code format
    const codeRegex = /^[A-Za-z0-9_-]*$/;
    if (!codeRegex.test(data.code)) {
      form.setError('code', { type: 'manual', message: 'Code can only contain letters, numbers, dashes, and underscores' });
      return;
    }

    // Prepare payload
    const payload = {
      ...data,
      active: data.active === "1" ? 1 : 0,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Function to validate code input
  const validateCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, numbers, dashes, and underscores
    const validatedValue = value.replace(/[^A-Za-z0-9_-]/g, '');
    return validatedValue.toUpperCase();
  };

  // Handle modal close
  const handleClose = () => {
    form.reset();
    setIsInitialized(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Business {business?.name ? `- ${business.name}` : ''}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update the business details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6">
              {/* Business Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Business Code *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g., TAXCONSULT" 
                          {...field}
                          className="uppercase pr-10 border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
                          maxLength={20}
                          onChange={(e) => {
                            const validatedValue = validateCodeInput(e);
                            field.onChange(validatedValue);
                          }}
                          onBlur={() => {
                            if (!field.value.trim()) {
                              form.setError('code', { 
                                type: 'manual', 
                                message: 'Business code is required' 
                              });
                            } else if (field.value.length > 20) {
                              form.setError('code', { 
                                type: 'manual', 
                                message: 'Code must be 20 characters or less' 
                              });
                            } else {
                              form.clearErrors('code');
                            }
                          }}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          {field.value?.length || 0}/20
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g., Tax Consulting" 
                          {...field}
                          className="border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
                          maxLength={50}
                          onBlur={() => {
                            if (!field.value.trim()) {
                              form.setError('name', { 
                                type: 'manual', 
                                message: 'Business name is required' 
                              });
                            } else if (field.value.length > 50) {
                              form.setError('name', { 
                                type: 'manual', 
                                message: 'Name must be 50 characters or less' 
                              });
                            } else {
                              form.clearErrors('name');
                            }
                          }}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          {field.value?.length || 0}/50
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className='relative col-span-1 md:col-span-2'>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <textarea 
                        placeholder="e.g., Direct & indirect tax practice"
                        {...field}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-[#1E1B4B] focus:ring-[#1E1B4B] focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        maxLength={500}
                        rows={3}
                        onBlur={() => {
                          if (!field.value.trim()) {
                            form.setError('description', { 
                              type: 'manual', 
                              message: 'Description is required' 
                            });
                          } else if (field.value.length > 500) {
                            form.setError('description', { 
                              type: 'manual', 
                              message: 'Description must be 500 characters or less' 
                            });
                          } else {
                            form.clearErrors('description');
                          }
                        }}
                      />
                      <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                        {field.value?.length || 0}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry Code - CHANGED TO TEXT INPUT */}
            <FormField
              control={form.control}
              name="industry_code"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Industry Code *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="e.g., NAICS-5412" 
                        {...field}
                        className="border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
                        maxLength={50}
                        onBlur={() => {
                          if (!field.value.trim()) {
                            form.setError('industry_code', { 
                              type: 'manual', 
                              message: 'Industry code is required' 
                            });
                          } else if (field.value.length > 50) {
                            form.setError('industry_code', { 
                              type: 'manual', 
                              message: 'Industry code must be 50 characters or less' 
                            });
                          } else {
                            form.clearErrors('industry_code');
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {field.value?.length || 0}/50
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (!value) {
                        form.setError('active', { 
                          type: 'manual', 
                          message: 'Status is required' 
                        });
                      } else {
                        form.clearErrors('active');
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1E1B4B] hover:bg-[#2A2675] gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Business
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};