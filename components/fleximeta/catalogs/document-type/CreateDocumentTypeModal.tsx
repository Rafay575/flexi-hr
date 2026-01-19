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
import { Loader2, FileIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';

// Define the Zod schema matching the JSON structure with only 3 fields
const documentTypeFormSchema = z.object({
  code: z
    .string()
    .min(1, 'Document code is required')
    .max(50, 'Document code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_]+$/, 'Document code must be uppercase with underscores'),
  label: z
    .string()
    .min(1, 'Display label is required')
    .max(100, 'Label cannot exceed 100 characters'),
  active: z.boolean().default(true),
});

// Extract the type
 type DocumentTypeFormValues = {
  code: string;
  label: string;
  active?: boolean;
};

interface CreateDocumentTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DocumentTypeFormValues) => Promise<void>;
  isLoading: boolean;
}
export const CreateDocumentTypeModal: React.FC<CreateDocumentTypeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  // Initialize form
  const form = useForm<DocumentTypeFormValues>({
    resolver: zodResolver(documentTypeFormSchema),
    defaultValues: {
      code: '',
      label: '',
      active: true,
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleFormSubmit = async (values: DocumentTypeFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            Create New Document Type
          </DialogTitle>
          <DialogDescription>
            Define a new document type with code and label
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* Document Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="required">Document Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., OFFER_LETTER"
                        {...field}
                        className="uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                   
                  </FormItem>
                )}
              />

              {/* Display Label */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="required">Display Label *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CNIC (National ID Card)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                   
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Status</FormLabel>
                      <p className="text-sm text-gray-500">
                        Active document types are shown to employees
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1E1B4B] hover:bg-[#2A2675]"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Document Type
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};