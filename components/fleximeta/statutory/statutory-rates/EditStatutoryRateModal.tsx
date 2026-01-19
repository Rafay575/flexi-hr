import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Loader2, CalendarIcon, PercentIcon, GlobeIcon, MapPinIcon, FlagIcon, PlusIcon, Trash2Icon, FileTextIcon } from "lucide-react";
import { useCountries, useStates, useStatutoryCodes } from "./useStatutoryRates";

interface EditStatutoryRateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  statutoryRate: any;
}

export const EditStatutoryRateModal: React.FC<EditStatutoryRateModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  statutoryRate,
}) => {
  // Fetch data using hooks
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: statutoryCodes, isLoading: loadingCodes } = useStatutoryCodes();
  
  // States will be fetched when country is selected
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const { data: states, isLoading: loadingStates } = useStates(selectedCountryId);

  const [formData, setFormData] = useState({
    country_id: "",
    state_id: "",
    code: "",
    payload: {
      year: "",
      slabs: [{ upto: 0, rate: 0, quick: 0 }]
    },
    effective_from: "",
    effective_to: "",
    is_active: true,
  });

  // Initialize form data when statutoryRate changes or modal opens
  useEffect(() => {
    if (statutoryRate && open) {
      const countryId = statutoryRate.country_id?.toString() || "";
      setSelectedCountryId(countryId);
      
      setFormData({
        country_id: countryId,
        state_id: statutoryRate.state_id?.toString() || "",
        code: statutoryRate.code || "",
        payload: {
          year: statutoryRate.payload?.year || "",
          slabs: statutoryRate.payload?.slabs || [{ upto: 0, rate: 0, quick: 0 }]
        },
        effective_from: statutoryRate.effective_from || new Date().toISOString().split('T')[0],
        effective_to: statutoryRate.effective_to || "",
        is_active: statutoryRate.is_active || true,
      });
    }
  }, [statutoryRate, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        country_id: "",
        state_id: "",
        code: "",
        payload: {
          year: "",
          slabs: [{ upto: 0, rate: 0, quick: 0 }]
        },
        effective_from: "",
        effective_to: "",
        is_active: true,
      });
      setSelectedCountryId("");
    }
  }, [open]);

  // When country changes, update selectedCountryId and reset state
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    setFormData(prev => ({
      ...prev,
      country_id: countryId,
      state_id: "", // Reset state when country changes
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayloadChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      payload: {
        ...prev.payload,
        [field]: value,
      },
    }));
  };

  // Handle slab changes
  const handleSlabChange = (index: number, field: string, value: number) => {
    const newSlabs = [...formData.payload.slabs];
    newSlabs[index] = { ...newSlabs[index], [field]: value };
    handlePayloadChange("slabs", newSlabs);
  };

  const addSlab = () => {
    const lastSlab = formData.payload.slabs[formData.payload.slabs.length - 1];
    const newSlab = {
      upto: lastSlab.upto + 100000,
      rate: lastSlab.rate + 2.5,
      quick: 0
    };
    handlePayloadChange("slabs", [...formData.payload.slabs, newSlab]);
  };

  const removeSlab = (index: number) => {
    if (formData.payload.slabs.length <= 1) return;
    const newSlabs = formData.payload.slabs.filter((_, i) => i !== index);
    handlePayloadChange("slabs", newSlabs);
  };

  // Get selected items for display
  const selectedCountry = countries?.find(c => c.id === formData.country_id);
  const selectedCode = statutoryCodes?.find(c => c.value === formData.code);
  const selectedState = states?.find(s => s.id === formData.state_id);

  if (!statutoryRate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <PercentIcon className="h-5 w-5" />
            Edit Statutory Rate Regulation
          </DialogTitle>
          <p className="text-sm text-gray-500">
            ID: {statutoryRate.id} • Created: {new Date(statutoryRate.created_at).toLocaleDateString()}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Location Information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Country Select */}
              <div className="space-y-2">
                <Label htmlFor="country_id" className="required flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4" />
                  Country
                </Label>
                <Select
                  value={formData.country_id}
                  onValueChange={handleCountryChange}
                  disabled={loadingCountries}
                >
                  <SelectTrigger>
                    {loadingCountries ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading countries...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a country" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {countries?.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        <div className="flex items-center gap-2">
                          <FlagIcon className="h-4 w-4" />
                          <span>{country.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {country.iso2}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCountry && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedCountry.name} ({selectedCountry.iso2})
                  </p>
                )}
              </div>

              {/* State Select (only shown if country has states) */}
              <div className="space-y-2">
                <Label htmlFor="state_id" className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  State (Optional)
                </Label>
                <Select
                  value={formData.state_id}
                  onValueChange={(value) => handleInputChange("state_id", value)}
                  disabled={!selectedCountryId || loadingStates}
                >
                  <SelectTrigger>
                    {!selectedCountryId ? (
                      "Select country first"
                    ) : loadingStates ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading states...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a state (optional)" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {states && states.length > 0 ? (
                      states.map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        No states available for this country
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {selectedState && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedState.name}
                  </p>
                )}
              </div>
            </div>

            {/* Code and Year */}
            <div className="grid grid-cols-2 gap-4">
              {/* Code Select */}
              <div className="space-y-2">
                <Label htmlFor="code" className="required flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  Statutory Code
                </Label>
                <Select
                  value={formData.code}
                  onValueChange={(value) => handleInputChange("code", value)}
                  disabled={loadingCodes}
                >
                  <SelectTrigger>
                    {loadingCodes ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading codes...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select statutory code" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {statutoryCodes?.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{code.label}</span>
                          <span className="text-xs text-gray-500">{code.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCode && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedCode.label}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="required flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fiscal Year
                </Label>
                <Input
                  id="year"
                  type="text"
                  placeholder="2025-26"
                  value={formData.payload.year}
                  onChange={(e) => handlePayloadChange("year", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Format: YYYY-YY (e.g., 2025-26)</p>
              </div>
            </div>

            {/* Rate Slabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="required flex items-center gap-2">
                  <PercentIcon className="h-4 w-4" />
                  Rate Slabs
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSlab}
                  className="h-8 gap-1"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add Slab
                </Button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto p-2 border rounded-md">
                {formData.payload.slabs.map((slab, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 items-center p-3 bg-gray-50 rounded-md">
                    <div className="space-y-1">
                      <Label className="text-xs">Up To Amount</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="600000"
                          value={slab.upto}
                          onChange={(e) => handleSlabChange(index, "upto", Number(e.target.value))}
                          className="pl-7"
                          required
                        />
                        <span className="absolute left-2 top-2 text-gray-500 text-sm">₹</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Rate (%)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={slab.rate}
                          onChange={(e) => handleSlabChange(index, "rate", Number(e.target.value))}
                          className="pl-7"
                          required
                        />
                        <span className="absolute left-2 top-2 text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Quick Amount</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          value={slab.quick}
                          onChange={(e) => handleSlabChange(index, "quick", Number(e.target.value))}
                          className="pl-7"
                        />
                        <span className="absolute left-2 top-2 text-gray-500 text-sm">₹</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSlab(index)}
                        disabled={formData.payload.slabs.length <= 1}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>• Slabs are cumulative (progressive taxation)</p>
                <p>• Quick amount is fixed tax for the slab</p>
              </div>
            </div>

            {/* Effective Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_from" className="required flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Effective From
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="effective_from"
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => handleInputChange("effective_from", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective_to" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Effective To (Optional)
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="effective_to"
                    type="date"
                    value={formData.effective_to}
                    onChange={(e) => handleInputChange("effective_to", e.target.value)}
                    className="pl-10"
                    min={formData.effective_from}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Status</Label>
                <p className="text-xs text-gray-500">
                  Active regulations are currently in effect
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
            </div>

            {/* Current vs Updated Preview */}
          
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || loadingCountries}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                isLoading || 
                loadingCountries || 
                loadingCodes || 
                !formData.country_id || 
                !formData.code || 
                !formData.payload.year || 
                !formData.effective_from ||
                formData.payload.slabs.length === 0
              }
            >
              {(isLoading || loadingCountries || loadingCodes) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoading ? "Updating..." : "Loading data..."}
                </>
              ) : (
                "Update Statutory Rate"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};