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
import SearchableSelect from '@/components/common/SearchableSelect'; // Assuming you have this component
import { useCountries } from './useStates'; // Assuming you have the useCountries hook for fetching countries

const stateFormSchema = z.object({
  name: z.string().min(1, 'State name is required'),
  country_id: z.string().min(1, 'Country is required'),
  country_code: z.string().min(1, 'Country code is required'),
  fips_code: z.string().min(1, 'FIPS code is required'),
  iso2: z.string().min(2, 'ISO2 code is required'),
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
});

interface EditStateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof stateFormSchema>) => Promise<void>;
  state: any; // The state to be edited
  isLoading: boolean;
}

export const EditStateModal: React.FC<EditStateModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  state,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof stateFormSchema>>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      name: '',
      country_id: '',
      country_code: '',
      fips_code: '',
      iso2: '',
      latitude: '',
      longitude: '',
    },
  });

  // Fetch countries
  const { data: countries, isLoading: countriesLoading } = useCountries();

  // Map countries to match the required Option[] format
  const countryOptions = Array.isArray(countries)
    ? countries.map((country) => ({
        value: country.id.toString(), // Ensure the value is always a string
        label: country.name,
        iso2: country.iso2,
      }))
    : [];

  useEffect(() => {
    if (state) {
     console.log("State:", state);
      form.reset({
        name: state.name,
        country_id: String(state.country_id), // Ensure the `country_id` is a string
        country_code: state.country_code,
        fips_code: state.fips_code,
        iso2: state.iso2,
        latitude: state.latitude,
        longitude: state.longitude,
      });
    }
  }, [state]); // The form will reset every time `state` is updated

  const handleFormSubmit = async (values: z.infer<typeof stateFormSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit State</DialogTitle>
          <DialogDescription>
            Modify the details of the state in the directory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Punjab" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Select */}
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        {...field}
                        className="w-full"
                        options={countryOptions}
                        placeholder="Select Country"
                        searchPlaceholder="Search Countries..."
                        onChange={(value) => {
                          field.onChange(value); // Update form with selected country id
                          const selectedCountry = countryOptions.find(
                            (country) => country.value === value
                          );
                          form.setValue('country_code', selectedCountry?.iso2 || ''); // Set country code based on selected country
                        }}
                        value={field.value || ''}
                        multiple={false} // Single select
                        allowAll={false} // Disabling the "Select All" option
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Code */}
              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., PK"
                        maxLength={2}
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FIPS Code */}
              <FormField
                control={form.control}
                name="fips_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FIPS Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PK03" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ISO2 Code */}
              <FormField
                control={form.control}
                name="iso2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO2 Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PB" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Latitude */}
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 31.1471" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Longitude */}
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 75.3412" {...field} />
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
                disabled={isLoading}
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
