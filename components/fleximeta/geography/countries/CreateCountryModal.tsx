'use client';

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
import { Loader2, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const countryFormSchema = z.object({
  name: z.string().min(1, 'Country name is required'),
  iso2: z.string().min(2, 'ISO2 code must be 2 characters').max(2, 'ISO2 code must be 2 characters'),
  iso3: z.string().min(3, 'ISO3 code must be 3 characters').max(3, 'ISO3 code must be 3 characters'),
  phonecode: z.string().min(1, 'Phone code is required'),
  capital: z.string().optional(),
  currency: z.string().optional(),
  currency_symbol: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

interface CreateCountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof countryFormSchema>) => Promise<void>;
  isLoading: boolean;
}

export const CreateCountryModal: React.FC<CreateCountryModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof countryFormSchema>>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: '',
      iso2: '',
      iso3: '',
      phonecode: '',
      capital: '',
      currency: '',
      currency_symbol: '',
      region: '',
      subregion: '',
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof countryFormSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new country to the directory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pakistan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iso2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO2 Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PK" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iso3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO3 Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PAK" maxLength={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phonecode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +92" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Islamabad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PKR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency_symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Asia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subregion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subregion</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Southern Asia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
                Add Country
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};