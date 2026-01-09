'use client';

import React, { useEffect } from 'react';
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

// Entity form schema with validation
const entityFormSchema = z.object({
  code: z.string()
    .min(1, 'Code is required')
    .max(20, 'Code must be 20 characters or less')
    .regex(/^[A-Za-z0-9_-]*$/, 'Code can only contain letters, numbers, dashes, and underscores'),
  name: z.string()
    .min(1, 'Name is required')
    .max(20, 'Name must be 20 characters or less'),
  abbrev: z.string()
    .min(1, 'Abbreviation is required')
    .max(10, 'Abbreviation must be 10 characters or less'),
  active: z.string().min(1, 'Status is required'),
});

interface EditEntityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof entityFormSchema>) => Promise<void>;
  entity: any;
  isLoading: boolean;
}

export const EditEntityModal: React.FC<EditEntityModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  entity,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof entityFormSchema>>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
      code: '',
      name: '',
      abbrev: '',
      active: '1',
    },
  });

  // Function to validate code input
  const validateCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, numbers, dashes, and underscores
    const validatedValue = value.replace(/[^A-Za-z0-9_-]/g, '');
    return validatedValue.toUpperCase();
  };

  // Reset form when entity changes
  useEffect(() => {
    if (entity) {
      console.log("Entity data for edit:", entity);
      form.reset({
        code: entity.code || '',
        name: entity.name || '',
        abbrev: entity.abbrev || '',
        active: entity.active === true ? '1' : '0' ,
      });
    }
  }, [entity, form]);

  const handleFormSubmit = async (values: z.infer<typeof entityFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Edit Entity</DialogTitle>
          <DialogDescription>
            Modify the details of the entity type in the directory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className=" grid grid-cols-1 gap-y-6 gap-x-3  md:grid-cols-2">
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
                        placeholder="e.g., TEST_ENTITY-01" 
                        {...field}
                        className="uppercase "
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
                  <FormLabel>Entity Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="e.g., Test Entity" 
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
              name="active"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abbrev"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Abbreviation *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="e.g., TT" 
                        {...field}
                        className="uppercase"
                        maxLength={10}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {field.value?.length || 0}/10
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}

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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};