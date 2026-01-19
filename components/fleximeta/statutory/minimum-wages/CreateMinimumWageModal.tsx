import React, { useState, useEffect, useMemo } from "react";
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
import { Loader2, CalendarIcon, DollarSignIcon, GlobeIcon, MapPinIcon, FlagIcon, FileTextIcon, UploadIcon, XIcon, AlertCircleIcon } from "lucide-react";
import { useCountries, useStates, useCurrencies } from "./useMinimumWages";
import SearchableSelect from "@/components/common/SearchableSelect";

interface CreateMinimumWageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const CreateMinimumWageModal: React.FC<CreateMinimumWageModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  // Fetch data using hooks
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: currencies, isLoading: loadingCurrencies } = useCurrencies();
  
  // States will be fetched when country is selected
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const { data: states, isLoading: loadingStates } = useStates(selectedCountryId);

  const [formData, setFormData] = useState({
    country_id: "",
    state_id: "",
    country_code: "",
    state_code: "",
    wage_amount: "",
    wage_basis: "monthly",
    currency_id: "",
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: "",
    source_ref: null as File | null,
    is_active: true,
  });

  const [fileError, setFileError] = useState<string>("");

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setFormData({
        country_id: "",
        state_id: "",
        country_code: "",
        state_code: "",
        wage_amount: "",
        wage_basis: "monthly",
        currency_id: "",
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: "",
        source_ref: null,
        is_active: true,
      });
      setSelectedCountryId("");
      setFileError("");
    }
  }, [open]);

  // Prepare country options for SearchableSelect
  const countryOptions = useMemo(() => {
    if (!countries) return [];
    return countries.map((country) => ({
      value: country.id.toString(),
      label: country.name,
      iso2: country.iso2,
      ...country
    }));
  }, [countries]);

  // Prepare state options for SearchableSelect
  const stateOptions = useMemo(() => {
    if (!states) return [];
    return states.map((state) => ({
      value: state.id.toString(),
      label: state.name,
      iso2: state.iso2 || state.code || "",
      ...state
    }));
  }, [states]);

  // Prepare currency options for SearchableSelect
  const currencyOptions = useMemo(() => {
    if (!currencies) return [];
    return currencies.map((currency) => ({
      value: currency.id.toString(),
      label: `${currency.iso_code} `,
      iso2: currency.iso_code,
      ...currency
    }));
  }, [currencies]);

  // Handle country change
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const selectedCountry = countryOptions.find(country => country.value === countryId);
    
    setFormData(prev => ({
      ...prev,
      country_id: countryId,
      country_code: selectedCountry?.iso2 || "",
      state_id: "", // Reset state when country changes
      state_code: "", // Reset state code
    }));
  };

  // Handle state change
  const handleStateChange = (stateId: string) => {
    const selectedState = stateOptions.find(state => state.value === stateId);
    
    setFormData(prev => ({
      ...prev,
      state_id: stateId,
      state_code: selectedState?.iso2 || "",
    }));
  };

  // Handle currency change
  const handleCurrencyChange = (currencyId: string) => {
    const selectedCurrency = currencyOptions.find(currency => currency.value === currencyId);
    
    setFormData(prev => ({
      ...prev,
      currency_id: currencyId,
    }));
  };
 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   // Validate file before submission
   if (!formData.source_ref) {
     setFileError("Please upload a PDF file");
     return;
   }
   // Pass the formData object (which includes the file) to the parent
   onSubmit(formData);
 };
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setFileError("Only PDF files are allowed");
      return;
    }
    
    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setFileError("File size must be less than 2MB");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      source_ref: file,
    }));
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      source_ref: null,
    }));
    setFileError("");
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get selected values for display
  const selectedCountry = countryOptions.find(c => c.value === formData.country_id);
  const selectedState = stateOptions.find(s => s.value === formData.state_id);
  const selectedCurrency = currencyOptions.find(c => c.value === formData.currency_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5" />
            Add New Minimum Wage Regulation
          </DialogTitle>
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
                <SearchableSelect
                  className="w-full"
                  options={countryOptions}
                  placeholder="Select Country"
                  searchPlaceholder="Search Countries..."
                  onChange={handleCountryChange}
                  value={formData.country_id}
                  multiple={false}
                  allowAll={false}
                  isLoading={loadingCountries}
                  disabled={false}
                />
                {selectedCountry && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedCountry.label} ({selectedCountry.iso2})
                  </p>
                )}
              </div>

              {/* State Select (only shown if country has states) */}
              <div className="space-y-2">
                <Label htmlFor="state_id" className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  State (Optional)
                </Label>
                <SearchableSelect
                  className="w-full"
                  options={stateOptions}
                  placeholder="Select State"
                  searchPlaceholder="Search States..."
                  onChange={handleStateChange}
                  value={formData.state_id}
                  multiple={false}
                  allowAll={false}
                  isLoading={loadingStates}
                  disabled={!formData.country_id}
                />
                {selectedState && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedState.label} {selectedState.iso2 && `(${selectedState.iso2})`}
                  </p>
                )}
                {formData.country_id && stateOptions.length === 0 && !loadingStates && (
                  <p className="text-xs text-gray-500">
                    No states available for this country
                  </p>
                )}
              </div>
            </div>

            {/* Wage Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wage_amount" className="required">
                  Wage Amount
                </Label>
                <Input
                  id="wage_amount"
                  type="number"
                  step="0.01"
                  placeholder="32000.00"
                  value={formData.wage_amount}
                  onChange={(e) => handleInputChange("wage_amount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wage_basis" className="required">
                  Wage Basis
                </Label>
                <Select
                  value={formData.wage_basis}
                  onValueChange={(value) => handleInputChange("wage_basis", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select basis" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="monthly">
                      <div className="flex items-center gap-2">
                        <span>Monthly</span>
                        <Badge variant="outline" className="ml-auto">Most Common</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Currency and Dates */}
            <div className="grid grid-cols-3 gap-4">
              {/* Currency Select */}
              <div className="space-y-2">
                <Label htmlFor="currency_id" className="required flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4" />
                  Currency
                </Label>
                <SearchableSelect
                  className="w-full"
                  options={currencyOptions}
                  placeholder="Select Currency"
                  searchPlaceholder="Search Currencies..."
                  onChange={handleCurrencyChange}
                  value={formData.currency_id}
                  multiple={false}
                  allowAll={false}
                  isLoading={loadingCurrencies}
                  disabled={false}
                />
                {selectedCurrency && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedCurrency.iso2}
                  </p>
                )}
              </div>

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

            {/* Source Reference - PDF Upload */}
            <div className="space-y-2">
              <Label htmlFor="source_ref" className="required flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                Source Reference (PDF Only)
              </Label>
              
              {!formData.source_ref ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="source_ref"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="source_ref" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <UploadIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Upload Government Notification</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF only (Max 2MB)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => document.getElementById('source_ref')?.click()}
                      >
                        Select File
                      </Button>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formData.source_ref.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(formData.source_ref.size)} • PDF
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {fileError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircleIcon className="h-4 w-4" />
                  <span>{fileError}</span>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Upload the official government notification or legal reference document (PDF format, max 2MB)
              </p>
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

       
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || loadingCountries || loadingCurrencies}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                isLoading || 
                loadingCountries || 
                loadingCurrencies || 
                !formData.country_id || 
                !formData.wage_amount || 
                !formData.currency_id || 
                !formData.effective_from || 
                !formData.source_ref
              }
              className="bg-[#1E1B4B] hover:bg-[#2A2675]"
            >
              {(isLoading || loadingCountries || loadingCurrencies) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoading ? "Creating..." : "Loading data..."}
                </>
              ) : (
                "Create Minimum Wage"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};