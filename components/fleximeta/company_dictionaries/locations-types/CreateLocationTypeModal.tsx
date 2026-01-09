// components/CreateLocationTypeModal.tsx
import React from 'react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define scope values
const SCOPE_VALUES = ["HQ", "Branch", "Factory", "Warehouse", "Remote"] as const;
export type ScopeType = typeof SCOPE_VALUES[number];

const SCOPE_OPTIONS = SCOPE_VALUES.map(value => ({
  value,
  label: value,
}));

// Location type form schema with validation
const locationTypeFormSchema = z.object({
  code: z.string()
    .min(1, 'Code is required')
    .max(20, 'Code must be 20 characters or less')
    .regex(/^[A-Za-z0-9_-]*$/, 'Code can only contain letters, numbers, dashes, and underscores'),
  name: z.string()
    .min(1, 'Name is required')
    .max(20, 'Name must be 20 characters or less'),
  abbrev: z.string()
    .min(1, 'Abbreviation is required')
    .max(20, 'Abbreviation must be 20 characters or less'),
  scope: z.string()
    .min(1, 'Scope is required')
    .refine((val) => SCOPE_VALUES.includes(val as ScopeType), {
      message: 'Invalid scope value',
    }),
  active: z.string().min(1, 'Status is required'),
});

interface CreateLocationTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof locationTypeFormSchema>) => Promise<void>;
  isLoading: boolean;
}

export const CreateLocationTypeModal: React.FC<CreateLocationTypeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof locationTypeFormSchema>>({
    resolver: zodResolver(locationTypeFormSchema),
    defaultValues: {
      code: '',
      name: '',
      abbrev: '',
      scope: '',
      active: '1',
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof locationTypeFormSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  // Function to validate code input
  const validateCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, numbers, dashes, and underscores
    const validatedValue = value.replace(/[^A-Za-z0-9_-]/g, '');
    return validatedValue.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Add New Location Type</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new location type to the directory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-y-6 gap-x-3 md:grid-cols-2">
            {/* Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="e.g., WAREHOUSE_LOC" 
                        {...field}
                        className="uppercase pr-10"
                        maxLength={20}
                        onChange={(e) => {
                          const validatedValue = validateCodeInput(e);
                          field.onChange(validatedValue);
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

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Location Type Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="e.g., Warehouse Location" 
                        {...field}
                        maxLength={20}
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

            {/* Abbreviation */}
            <FormField
              control={form.control}
              name="abbrev"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Abbreviation *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="e.g., WHL" 
                        {...field}
                        className="uppercase pr-10"
                        maxLength={20}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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

            {/* Scope */}
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Scope *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white" >
                      {SCOPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white" >
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 col-span-1 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1E1B4B] hover:bg-[#2A2675]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Location Type
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};