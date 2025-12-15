// components/locations/Model.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import {
  useCountryOptions,
  useStateOptions,
  useCityOptions,
  useLocationTypeOptions,
  useTimezoneOptions,
} from "./useLocationOptions";
import { api } from "../api/client";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "create" | "edit";
  locationData?: any;
  locationId?: string | number;
  refetchLocations?: () => Promise<void>;
  companyId?: number;
}

interface FormData {
  location_type_id: string;
  name: string;
  location_code: string;
  address: string;
  country_id: string;
  state_id: string;
  city_id: string;
  timezone: string;
  is_virtual: boolean;
  status: string;
}

export default function LocationModal({
  isOpen,
  onClose,
  mode = "view",
  locationData = null,
  locationId = null,
  refetchLocations,
  companyId,
}: LocationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    location_type_id: "",
    name: "",
    location_code: "",
    address: "",
    country_id: "",
    state_id: "",
    city_id: "",
    timezone: "UTC",
    is_virtual: false,
    status: "Active",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch dropdown data using custom hooks
  const { data: countries = [], isLoading: loadingCountries } = useCountryOptions();
  const { data: states = [], isLoading: loadingStates } = useStateOptions(formData.country_id);
  const { data: cities = [], isLoading: loadingCities } = useCityOptions(formData.state_id);
  const { data: locationTypes = [], isLoading: loadingLocationTypes } = useLocationTypeOptions();
  const { data: timezones = [], isLoading: loadingTimezones } = useTimezoneOptions();

  // Initialize form with existing data
  useEffect(() => {
    if (locationData && !isInitialized && isOpen) {
      setFormData({
        location_type_id: locationData.location_type_id?.toString() || "",
        name: locationData.name || "",
        location_code: locationData.location_code || "",
        address: locationData.address || "",
        country_id: locationData.country_id?.toString() || "",
        state_id: locationData.state_id?.toString() || "",
        city_id: locationData.city_id?.toString() || "",
        timezone: locationData.timezone || "UTC",
        is_virtual: locationData.is_virtual || false,
        status: locationData.status || "Active",
      });
      setIsInitialized(true);
    } else if (mode === "create" && !isInitialized && isOpen) {
      // Reset form for create mode
      setFormData({
        location_type_id: "",
        name: "",
        location_code: "",
        address: "",
        country_id: "",
        state_id: "",
        city_id: "",
        timezone: "UTC",
        is_virtual: false,
        status: "Active",
      });
      setIsInitialized(true);
    }
  }, [locationData, mode, isInitialized, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === "country_id" && { state_id: "", city_id: "" }),
      ...(name === "state_id" && { city_id: "" }),
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_virtual: checked,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Prepare data for API
      const submitData = {
        location_type_id: parseInt(formData.location_type_id) || 0,
        name: formData.name,
        location_code: formData.location_code,
        address: formData.address,
        country_id: parseInt(formData.country_id) || 0,
        state_id: parseInt(formData.state_id) || 0,
        city_id: parseInt(formData.city_id) || 0,
        timezone: formData.timezone,
        is_virtual: formData.is_virtual,
        active: formData.status === "Active" ? true : false,
      };

      // Add company_id if needed
      const payload = companyId ? { ...submitData, company_id: companyId } : submitData;

      if (mode === "create") {
        await api.post(`/meta/companies/locations/store`,
          payload,
          config
        );

        toast.success("Location created successfully");
      } else if (mode === "edit" && locationId) {
        await api.put(`/meta/companies/locations/update/${locationId}`,
          payload,
          config
        );

        toast.success("Location updated successfully");
      }

      // Refresh locations list
      if (refetchLocations) {
        await refetchLocations();
      }

      handleClose();
    } catch (error: any) {
      console.error("Error saving location:", error);
      toast.error(error.response?.data?.message || "Failed to save location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsInitialized(false);
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Create New Location";
      case "edit":
        return "Edit Location";
      case "view":
        return "Location Details";
      default:
        return "Location";
    }
  };

  // Helper function to get label from value
  const getLabelFromValue = (options: Array<{ value: string; label: string }>, value: string) => {
    return options.find(option => option.value === value)?.label || "N/A";
  };

  const isFormValid = () => {
    return (
      formData.location_type_id &&
      formData.name.trim() &&
      formData.location_code.trim() &&
      formData.address.trim() &&
      formData.country_id &&
      formData.state_id &&
      formData.city_id
    );
  };

  const isLoadingAny = loadingCountries || loadingLocationTypes || loadingTimezones ||
    (formData.country_id && loadingStates) ||
    (formData.state_id && loadingCities);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* Remove or customize the overlay */}
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto bg-white  border-gray-200 ">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-gray-900 ">
            {getTitle()}
            {mode === "view" && (
              <Badge
                variant={formData.status === "Active" ? "default" : "secondary"}
                className="ml-2"
              >
                {formData.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500 ">
            {mode === "view"
              ? "View location details"
              : mode === "create"
              ? "Create a new location for your company"
              : "Edit location information"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Location Type */}
            <div className="space-y-2">
              <Label htmlFor="location_type_id" className="text-gray-700 ">
                Location Type <span className="text-red-500">*</span>
              </Label>
              {mode === "view" ? (
                <div className="text-gray-900  font-medium p-2 bg-gray-50  rounded-md">
                  {getLabelFromValue(locationTypes, formData.location_type_id)}
                </div>
              ) : (
                <Select
                  value={formData.location_type_id}
                  onValueChange={(value) =>
                    handleSelectChange("location_type_id", value)
                  }
                  disabled={isLoading || loadingLocationTypes}
                >
                  <SelectTrigger className="w-full bg-white  border-gray-300 ">
                    {loadingLocationTypes ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select location type" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white  border-gray-300 ">
                    {locationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="hover:bg-gray-100">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Location Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 ">
                Location Name <span className="text-red-500">*</span>
              </Label>
              {mode === "view" ? (
                <div className="text-gray-900  font-medium p-2 bg-gray-50  rounded-md">
                  {formData.name}
                </div>
              ) : (
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Enter location name"
                  className="bg-white  border-gray-300 "
                />
              )}
            </div>

            {/* Location Code */}
            <div className="space-y-2">
              <Label htmlFor="location_code" className="text-gray-700 ">
                Location Code <span className="text-red-500">*</span>
              </Label>
              {mode === "view" ? (
                <div className="text-gray-900  font-medium p-2 bg-gray-50  rounded-md">
                  {formData.location_code}
                </div>
              ) : (
                <Input
                  id="location_code"
                  name="location_code"
                  value={formData.location_code}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Enter location code"
                  className="bg-white  border-gray-300 "
                />
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 ">
                Address <span className="text-red-500">*</span>
              </Label>
              {mode === "view" ? (
                <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                  {formData.address}
                </div>
              ) : (
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Enter address"
                  className="bg-white  border-gray-300 "
                />
              )}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country */}
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  Country <span className="text-red-500">*</span>
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {getLabelFromValue(countries, formData.country_id)}
                  </div>
                ) : (
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) =>
                      handleSelectChange("country_id", value)
                    }
                    disabled={isLoading || loadingCountries}
                  >
                    <SelectTrigger className="w-full bg-white  border-gray-300 ">
                      {loadingCountries ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select country" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white  border-gray-300 ">
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value} className="hover:bg-gray-100">
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  State <span className="text-red-500">*</span>
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {getLabelFromValue(states, formData.state_id)}
                  </div>
                ) : (
                  <Select
                    value={formData.state_id}
                    onValueChange={(value) =>
                      handleSelectChange("state_id", value)
                    }
                    disabled={isLoading || loadingStates || !formData.country_id}
                  >
                    <SelectTrigger className="w-full bg-white  border-gray-300 ">
                      {loadingStates ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : !formData.country_id ? (
                        <span className="text-gray-500 ">Select country first</span>
                      ) : (
                        <SelectValue placeholder="Select state" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white  border-gray-300 ">
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value} className="hover:bg-gray-100">
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  City <span className="text-red-500">*</span>
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {getLabelFromValue(cities, formData.city_id)}
                  </div>
                ) : (
                  <Select
                    value={formData.city_id}
                    onValueChange={(value) =>
                      handleSelectChange("city_id", value)
                    }
                    disabled={isLoading || loadingCities || !formData.state_id}
                  >
                    <SelectTrigger className="w-full bg-white  border-gray-300 ">
                      {loadingCities ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : !formData.state_id ? (
                        <span className="text-gray-500 ">Select state first</span>
                      ) : (
                        <SelectValue placeholder="Select city" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white  border-gray-300 ">
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value} className="hover:bg-gray-100">
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Timezone */}
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  Timezone
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {formData.timezone}
                  </div>
                ) : (
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      handleSelectChange("timezone", value)
                    }
                    disabled={isLoading || loadingTimezones}
                  >
                    <SelectTrigger className="w-full bg-white  border-gray-300 ">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white  border-gray-300 ">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value} className="hover:bg-gray-100">
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Virtual Location */}
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  Virtual Location
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {formData.is_virtual ? "Yes" : "No"}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-2">
                    <Switch
                      checked={formData.is_virtual}
                      onCheckedChange={handleSwitchChange}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-gray-700 ">
                      {formData.is_virtual ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status (for create/edit only) */}
            {mode !== "view" && (
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-white  border-gray-300 ">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white  border-gray-300 ">
                    <SelectItem value="Active" className="hover:bg-gray-100">Active</SelectItem>
                    <SelectItem value="Inactive" className="hover:bg-gray-100">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t border-gray-200 ">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              type="button"
              className="min-w-[100px]"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || isLoadingAny || !isFormValid()}
                type="button"
                className="min-w-[140px] bg-[#1E1B4B] hover:bg-[#2D2A6E]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Location" : "Save Changes"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}