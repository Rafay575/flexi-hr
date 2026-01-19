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
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';

// Define the Zod schema (same as create)
const tradeFormSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(20, 'Code cannot exceed 20 characters')
    .regex(/^[A-Za-z0-9_-]+$/, 'Contain letters, numbers, dashes, and underscores'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(20, 'Name cannot exceed 20 characters'),
  active: z.boolean(),
});

// Extract the type
export type TradeFormValues = {
  code: string;
  name: string;
  active: boolean;
};

export interface Trade {
  id: string;
  code: string;
  name: string;
  active: boolean;
  // Add other fields if needed (createdAt, updatedAt, etc.)
}

interface EditTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TradeFormValues & { id: string }) => Promise<void>;
  isLoading: boolean;
  trade: Trade | null;
}

export const EditTradeModal: React.FC<EditTradeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  trade,
}) => {
  // Initialize form
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      code: '',
      name: '',
      active: true,
    },
  });

  // Reset form when trade data changes (when modal opens with new trade)
  useEffect(() => {
    if (trade) {
      form.reset({
        code: trade.code,
        name: trade.name,
        active: trade.active,
      });
    }
  }, [trade, form]);

  const handleFormSubmit = async (values: TradeFormValues) => {
    if (!trade) return;
    
    await onSubmit({
      ...values,
      id: trade.id, // Include the ID for the update
    });
    
    // Don't reset form on submit for edit
    // form.reset();
  };

  // Handle cancel
  const handleCancel = () => {
    onOpenChange(false);
    // Reset form to original trade data or default values
    if (trade) {
      form.reset({
        code: trade.code,
        name: trade.name,
        active: trade.active,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
          <DialogDescription>
            Update the details of the trade.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Code *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., CNIC_FRONT" 
                        {...field} 
                        className="uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.code?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Trade Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CNIC (Front Side)" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Active Toggle */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <div className="text-sm text-gray-500">
                      Set the trade as active or inactive
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Dialog Footer */}
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
                Update Trade
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};