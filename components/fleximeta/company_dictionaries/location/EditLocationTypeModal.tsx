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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import SearchableSelect from "@/components/common/SearchableSelect";
import { useCountries, useStates, useCities } from "./useLocations";
import { useLocationTypeapi } from "./useLocations";

// Timezone options
const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

// Form values interface
interface LocationFormValues {
  location_type_id: string;
  name: string;
  location_code: string;
  address: string;
  country_id: string;
  state_id: string;
  city_id: string;
  timezone: string;
  is_virtual: string;
  active: string;
}

interface EditLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  location: any;
}

export const EditLocationModal: React.FC<EditLocationModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  location,
}) => {
  const [countryId, setCountryId] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [customCountryOptions, setCustomCountryOptions] = useState<any[]>([]);
  const [customStateOptions, setCustomStateOptions] = useState<any[]>([]);
  const [customCityOptions, setCustomCityOptions] = useState<any[]>([]);
  const [customLocationTypeOptions, setCustomLocationTypeOptions] = useState<any[]>([]);

  // Fetch countries, states, cities, and location types
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(countryId);
  const { data: cities, isLoading: citiesLoading } = useCities(countryId, stateId);
  const { data: locationTypesResponse, isLoading: locationTypesLoading } = useLocationTypeapi();

  // Initialize form with React Hook Form
  const form = useForm<LocationFormValues>({
    defaultValues: {
      location_type_id: '',
      name: '',
      location_code: '',
      address: '',
      country_id: '',
      state_id: '',
      city_id: '',
      timezone: 'UTC',
      is_virtual: '0',
      active: '1',
    },
    mode: 'onChange',
  });

  // Watch country and state for dependent selects
  const watchedCountryId = form.watch("country_id");
  const watchedStateId = form.watch("state_id");

  // Transform API data to options and add pre-filled values
  useEffect(() => {
    if (countries && location) {
      const baseOptions = countries.map((country: any) => ({
        value: country.id.toString(),
        label: country.name,
      }));

      // If we have a location with a country_id, ensure it's in the options
      const locationCountryId = location?.country_id?.toString();
      if (locationCountryId && !baseOptions.find(opt => opt.value === locationCountryId)) {
        // Add the location's country to options (in case it's not in the fetched list)
        const locationCountryName = location?.country_name || 'Selected Country';
        baseOptions.unshift({
          value: locationCountryId,
          label: locationCountryName,
        });
      }

      setCustomCountryOptions(baseOptions);
    }
  }, [countries, location]);

  useEffect(() => {
    if (states && location) {
      const baseOptions = states.map((state: any) => ({
        value: state.id.toString(),
        label: state.name,
      }));

      // If we have a location with a state_id, ensure it's in the options
      const locationStateId = location?.state_id?.toString();
      if (locationStateId && !baseOptions.find(opt => opt.value === locationStateId)) {
        // Add the location's state to options
        const locationStateName = location?.state_name || 'Selected State';
        baseOptions.unshift({
          value: locationStateId,
          label: locationStateName,
        });
      }

      setCustomStateOptions(baseOptions);
    }
  }, [states, location]);

  useEffect(() => {
    if (cities && location) {
      const baseOptions = cities.map((city: any) => ({
        value: city.id.toString(),
        label: city.name,
      }));

      // If we have a location with a city_id, ensure it's in the options
      const locationCityId = location?.city_id?.toString();
      if (locationCityId && !baseOptions.find(opt => opt.value === locationCityId)) {
        // Add the location's city to options
        const locationCityName = location?.city_name || 'Selected City';
        baseOptions.unshift({
          value: locationCityId,
          label: locationCityName,
        });
      }

      setCustomCityOptions(baseOptions);
    }
  }, [cities, location]);

  useEffect(() => {
    if (locationTypesResponse && location) {
      const baseOptions = locationTypesResponse.map((type: any) => ({
        value: type.id.toString(),
        label: type.name,
      }));

      // If we have a location with a location_type_id, ensure it's in the options
      const locationTypeId = location?.location_type_id?.toString();
      if (locationTypeId && !baseOptions.find(opt => opt.value === locationTypeId)) {
        // Add the location's type to options
        const locationTypeName = location?.location_type_name || 'Selected Type';
        baseOptions.unshift({
          value: locationTypeId,
          label: locationTypeName,
        });
      }

      setCustomLocationTypeOptions(baseOptions);
    }
  }, [locationTypesResponse, location]);

  // Populate form when location data changes
  useEffect(() => {
    if (location && !isInitialized && open) {
      const locationTypeId = location.location_type_id?.toString() || '';
      const countryIdStr = location.country_id?.toString() || '';
      const stateIdStr = location.state_id?.toString() || '';
      const cityIdStr = location.city_id?.toString() || '';
        console.log(location)
      form.reset({
        location_type_id: locationTypeId,
        name: location.name || '',
        location_code: location.location_code || '',
        address: location.address || '',
        country_id: countryIdStr,
        state_id: stateIdStr,
        city_id: cityIdStr,
        timezone: location.timezone || 'UTC',
        is_virtual: location.is_virtual ? '1' : '0',
        active: location.active ? '1' : '0',
      });

      if (countryIdStr) {
        setCountryId(countryIdStr);
      }
      
      if (stateIdStr) {
        setStateId(stateIdStr);
      }

      setIsInitialized(true);
    }
  }, [location, form, isInitialized, open]);

  // Reset initialization when modal closes
  useEffect(() => {
    if (!open) {
      setIsInitialized(false);
      setCustomCountryOptions([]);
      setCustomStateOptions([]);
      setCustomCityOptions([]);
      setCustomLocationTypeOptions([]);
    }
  }, [open]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (watchedCountryId !== countryId && isInitialized) {
      setCountryId(watchedCountryId);
      if (watchedCountryId !== location?.country_id?.toString()) {
        form.setValue("state_id", "");
        form.setValue("city_id", "");
        setStateId("");
      }
    }
  }, [watchedCountryId, countryId, location, form, isInitialized]);

  useEffect(() => {
    if (watchedStateId !== stateId && isInitialized) {
      setStateId(watchedStateId);
      if (watchedStateId !== location?.state_id?.toString()) {
        form.setValue("city_id", "");
      }
    }
  }, [watchedStateId, stateId, location, form, isInitialized]);

  // Handle form submission
  const handleSubmit = async (data: LocationFormValues) => {
    // Validate required fields
    if (!data.location_type_id) {
      form.setError('location_type_id', { type: 'manual', message: 'Location type is required' });
      return;
    }
    if (!data.name.trim()) {
      form.setError('name', { type: 'manual', message: 'Location name is required' });
      return;
    }
    if (!data.location_code.trim()) {
      form.setError('location_code', { type: 'manual', message: 'Location code is required' });
      return;
    }
    if (!data.address.trim()) {
      form.setError('address', { type: 'manual', message: 'Address is required' });
      return;
    }
    if (!data.country_id) {
      form.setError('country_id', { type: 'manual', message: 'Country is required' });
      return;
    }
    if (!data.state_id) {
      form.setError('state_id', { type: 'manual', message: 'State is required' });
      return;
    }
    if (!data.city_id) {
      form.setError('city_id', { type: 'manual', message: 'City is required' });
      return;
    }
    if (!data.timezone) {
      form.setError('timezone', { type: 'manual', message: 'Timezone is required' });
      return;
    }
    if (!data.active) {
      form.setError('active', { type: 'manual', message: 'Status is required' });
      return;
    }

    // Validate character limits
    if (data.location_code.length > 20) {
      form.setError('location_code', { type: 'manual', message: 'Code must be 20 characters or less' });
      return;
    }
    if (data.name.length > 50) {
      form.setError('name', { type: 'manual', message: 'Name must be 50 characters or less' });
      return;
    }
    if (data.address.length > 200) {
      form.setError('address', { type: 'manual', message: 'Address must be 200 characters or less' });
      return;
    }

    // Validate code format
    const codeRegex = /^[A-Za-z0-9_-]*$/;
    if (!codeRegex.test(data.location_code)) {
      form.setError('location_code', { type: 'manual', message: 'Code can only contain letters, numbers, dashes, and underscores' });
      return;
    }

    // Prepare payload
    const payload = {
      ...data,
      is_virtual: data.is_virtual === "1" ? 1 : 0,
      active: data.active === "1" ? 1 : 0,
      status: data.active === "1" ? "Active" : "Inactive",
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
    setCountryId("");
    setStateId("");
    setIsInitialized(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Location {location?.name ? `- ${location.name}` : ''}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update the location details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Code */}
              <FormField
                control={form.control}
                name="location_code"
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Location Code *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g., ENG001" 
                          {...field}
                          className="uppercase pr-10 border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
                          maxLength={20}
                          onChange={(e) => {
                            const validatedValue = validateCodeInput(e);
                            field.onChange(validatedValue);
                          }}
                          onBlur={() => {
                            if (!field.value.trim()) {
                              form.setError('location_code', { 
                                type: 'manual', 
                                message: 'Location code is required' 
                              });
                            } else if (field.value.length > 20) {
                              form.setError('location_code', { 
                                type: 'manual', 
                                message: 'Code must be 20 characters or less' 
                              });
                            } else {
                              form.clearErrors('location_code');
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

              {/* Location Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Location Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g., Engineering Office" 
                          {...field}
                          className="border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
                          maxLength={50}
                          onBlur={() => {
                            if (!field.value.trim()) {
                              form.setError('name', { 
                                type: 'manual', 
                                message: 'Location name is required' 
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
            </div>

            {/* Location Type */}
            <FormField
              control={form.control}
              name="location_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      {...field}
                      className="!w-full"
                      options={customLocationTypeOptions}
                      placeholder="Select Location Type"
                      searchPlaceholder="Search location types..."
                      onChange={(value) => {
                        field.onChange(value);
                        if (!value) {
                          form.setError('location_type_id', { 
                            type: 'manual', 
                            message: 'Location type is required' 
                          });
                        } else {
                          form.clearErrors('location_type_id');
                        }
                      }}
                      value={field.value || ""}
                      multiple={false}
                      allowAll={false}
                      isLoading={locationTypesLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <textarea 
                        placeholder="Full street address"
                        {...field}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-[#1E1B4B] focus:ring-[#1E1B4B] focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        maxLength={200}
                        rows={3}
                        onBlur={() => {
                          if (!field.value.trim()) {
                            form.setError('address', { 
                              type: 'manual', 
                              message: 'Address is required' 
                            });
                          } else if (field.value.length > 200) {
                            form.setError('address', { 
                              type: 'manual', 
                              message: 'Address must be 200 characters or less' 
                            });
                          } else {
                            form.clearErrors('address');
                          }
                        }}
                      />
                      <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                        {field.value?.length || 0}/200
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country, State, City Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country */}
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
                        options={customCountryOptions}
                        placeholder="Select Country"
                        searchPlaceholder="Search countries..."
                        onChange={(value) => {
                          field.onChange(value);
                          if (value !== location?.country_id?.toString()) {
                            form.setValue("state_id", "");
                            form.setValue("city_id", "");
                          }
                          if (!value) {
                            form.setError('country_id', { 
                              type: 'manual', 
                              message: 'Country is required' 
                            });
                          } else {
                            form.clearErrors('country_id');
                          }
                        }}
                        value={field.value || ""}
                        multiple={false}
                        allowAll={false}
                        isLoading={countriesLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
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
                        options={customStateOptions}
                        placeholder="Select State"
                        searchPlaceholder="Search states..."
                        onChange={(value) => {
                          field.onChange(value);
                          if (value !== location?.state_id?.toString()) {
                            form.setValue("city_id", "");
                          }
                          if (!value) {
                            form.setError('state_id', { 
                              type: 'manual', 
                              message: 'State is required' 
                            });
                          } else {
                            form.clearErrors('state_id');
                          }
                        }}
                        value={field.value || ""}
                        multiple={false}
                        allowAll={false}
                        isLoading={statesLoading}
                        disabled={!watchedCountryId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        {...field}
                        className="w-full"
                        options={customCityOptions}
                        placeholder="Select City"
                        searchPlaceholder="Search cities..."
                        onChange={(value) => {
                          field.onChange(value);
                          if (!value) {
                            form.setError('city_id', { 
                              type: 'manual', 
                              message: 'City is required' 
                            });
                          } else {
                            form.clearErrors('city_id');
                          }
                        }}
                        value={field.value || ""}
                        multiple={false}
                        allowAll={false}
                        isLoading={citiesLoading}
                        disabled={!watchedStateId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Timezone */}
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone *</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        {...field}
                        className="w-full"
                        options={TIMEZONE_OPTIONS}
                        placeholder="Select Timezone"
                        searchPlaceholder="Search timezones..."
                        onChange={(value) => {
                          field.onChange(value);
                          if (!value) {
                            form.setError('timezone', { 
                              type: 'manual', 
                              message: 'Timezone is required' 
                            });
                          } else {
                            form.clearErrors('timezone');
                          }
                        }}
                        value={field.value || ""}
                        multiple={false}
                        allowAll={false}
                        isLoading={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Virtual Location */}
              <FormField
                control={form.control}
                name="is_virtual"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Virtual Location</FormLabel>
                    <div className="flex items-center space-x-2 pt-2">
                      <FormControl>
                        <Switch
                          checked={field.value === "1"}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? "1" : "0");
                          }}
                          className="data-[state=checked]:bg-[#1E1B4B]"
                        />
                      </FormControl>
                      <Label className="text-sm font-normal">
                        {field.value === "1" ? "Yes, this is a virtual location" : "No, this is a physical location"}
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      {...field}
                      className="w-full"
                      options={[
                        { value: "1", label: "Active" },
                        { value: "0", label: "Inactive" }
                      ]}
                      placeholder="Select Status"
                      searchPlaceholder="Search status..."
                      onChange={(value) => {
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
                      value={field.value || ""}
                      multiple={false}
                      allowAll={false}
                      isLoading={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Update Location
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};