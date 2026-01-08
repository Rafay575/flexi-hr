'use client';

import React, { useMemo } from 'react';
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
import SearchableSelect from '@/components/common/SearchableSelect';
import { useCountries, useStates } from './useCities';

// City form schema based on your API response
const cityFormSchema = z.object({
  name: z.string().min(1, 'City name is required'),
  state_id: z.string().min(1, 'State is required'),
  country_id: z.string().min(1, 'Country is required'),
  country_code: z.string().min(1, 'Country code is required'),
  state_code: z.string().optional(), // Optional based on your API
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
});

interface CreateCityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof cityFormSchema>) => Promise<void>;
  isLoading: boolean;
}

export const CreateCityModal: React.FC<CreateCityModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof cityFormSchema>>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: '',
      state_id: '',
      country_id: '',
      country_code: '',
      state_code: '',
      latitude: '',
      longitude: '',
    },
  });

  // Fetch countries and states
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const countryId = form.watch('country_id');
  const { data: states, isLoading: statesLoading } = useStates(countryId);

  // Map countries to options
  const countryOptions = useMemo(() => {
    return Array.isArray(countries)
      ? countries.map((country) => ({
          value: country.id.toString(),
          label: country.name,
          iso2: country.iso2,
        }))
      : [];
  }, [countries]);

  // Map states to options
  const stateOptions = useMemo(() => {
    return Array.isArray(states)
      ? states.map((state) => ({
          value: state.id.toString(),
          label: state.name,
          iso2: state.iso2 || state.state_code || '',
        }))
      : [];
  }, [states]);

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof cityFormSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New City</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new city to the directory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lahore" {...field} />
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
                          field.onChange(value); // Update country_id
                          const selectedCountry = countryOptions.find(
                            (country) => country.value === value
                          );
                          form.setValue('country_code', selectedCountry?.iso2 || ''); // Set country code
                          form.setValue('state_id', ''); // Clear state when country changes
                          form.setValue('state_code', ''); // Clear state code
                        }}
                        value={field.value || ''}
                        multiple={false}
                        allowAll={false}
                        isLoading={countriesLoading}
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

              {/* State Select */}
              <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        {...field}
                        className="w-full"
                        options={stateOptions}
                        placeholder="Select State"
                        searchPlaceholder="Search States..."
                        onChange={(value) => {
                          field.onChange(value); // Update state_id
                          const selectedState = stateOptions.find(
                            (state) => state.value === value
                          );
                          form.setValue('state_code', selectedState?.iso2 || ''); // Set state code
                        }}
                        value={field.value || ''}
                        multiple={false}
                        allowAll={false}
                        isLoading={statesLoading}
                        disabled={!countryId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State Code */}
              <FormField
                control={form.control}
                name="state_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., PB"
                        maxLength={2}
                        {...field}
                        readOnly
                      />
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
                      <Input 
                        placeholder="e.g., 31.5204" 
                        type="number"
                        step="any"
                        {...field} 
                      />
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
                      <Input 
                        placeholder="e.g., 74.3587" 
                        type="number"
                        step="any"
                        {...field} 
                      />
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
                Add City
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};