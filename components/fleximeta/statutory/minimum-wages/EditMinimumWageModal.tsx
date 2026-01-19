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
import { Loader2, CalendarIcon, DollarSignIcon, GlobeIcon, MapPinIcon, FlagIcon, FileTextIcon, UploadIcon, XIcon, AlertCircleIcon, ExternalLinkIcon, EyeIcon } from "lucide-react";
import { useCountries, useStates, useCurrencies } from "./useMinimumWages";
import SearchableSelect from "@/components/common/SearchableSelect";

interface EditMinimumWageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  minimumWage: any;
}

const API_BASE_URL_FILE = process.env.NEXT_PUBLIC_API_BASE_URL_FILE || "https://app.myflexihr.com/storage/";

export const EditMinimumWageModal: React.FC<EditMinimumWageModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  minimumWage,
}) => {
  // Fetch data using hooks
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: currencies, isLoading: loadingCurrencies } = useCurrencies();
  console.log(minimumWage)
  // States will be fetched when country is selected
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const { data: states, isLoading: loadingStates } = useStates(selectedCountryId);

  const [formData, setFormData] = useState({
    country_id: "",
    state_id: "",
    wage_amount: "",
    wage_basis: "monthly",
    currency_id: "",
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: "",
    source_ref: null as File | null,
    source_ref_existing: "",
    is_active: true,
  });

  const [fileError, setFileError] = useState<string>("");
  const [hasNewFile, setHasNewFile] = useState(false);

  // Initialize form data when minimumWage changes or modal opens
// Initialize form data when minimumWage changes or modal opens
useEffect(() => {
  if (minimumWage && open) {
    const countryId = minimumWage.country_id?.toString() || "";
    setSelectedCountryId(countryId);
    
    // Helper function to convert ISO date to YYYY-MM-DD format
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return "";
      try {
        // Remove timezone and time part, keep only date
        return dateString.split('T')[0];
      } catch (error) {
        return dateString;
      }
    };
    
    setFormData({
      country_id: countryId,
      state_id: minimumWage.state_id?.toString() || "",
      wage_amount: minimumWage.wage_amount || "",
      wage_basis: minimumWage.wage_basis || "monthly",
      currency_id: minimumWage.currency_id?.toString() || "",
      effective_from: formatDateForInput(minimumWage.effective_from) || new Date().toISOString().split('T')[0],
      effective_to: formatDateForInput(minimumWage.effective_to) || "",
      source_ref: null,
      source_ref_existing: minimumWage.source_ref || "",
      is_active: minimumWage.is_active || true,
    });
    setHasNewFile(false);
    setFileError("");
  }
}, [minimumWage, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        country_id: "",
        state_id: "",
        wage_amount: "",
        wage_basis: "monthly",
        currency_id: "",
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: "",
        source_ref: null,
        source_ref_existing: "",
        is_active: true,
      });
      setSelectedCountryId("");
      setHasNewFile(false);
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
      state_id: "", // Reset state when country changes
    }));
  };

  // Handle state change
  const handleStateChange = (stateId: string) => {
    setFormData(prev => ({
      ...prev,
      state_id: stateId,
    }));
  };

  // Handle currency change
  const handleCurrencyChange = (currencyId: string) => {
    setFormData(prev => ({
      ...prev,
      currency_id: currencyId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object
    const formDataToSend = new FormData();
    
    // Append all required fields
    formDataToSend.append('country_id', formData.country_id);
    
    // Only append state_id if it has a value
    if (formData.state_id) {
      formDataToSend.append('state_id', formData.state_id);
    }
    
    formDataToSend.append('wage_amount', formData.wage_amount);
    formDataToSend.append('wage_basis', formData.wage_basis);
    formDataToSend.append('currency_id', formData.currency_id);
    formDataToSend.append('effective_from', formData.effective_from);
    
    // Only append effective_to if it has a value
    if (formData.effective_to) {
      formDataToSend.append('effective_to', formData.effective_to);
    }
    
    formDataToSend.append('is_active', formData.is_active ? "1" : "0");
    
    // Append the file if a new one was uploaded
    if (formData.source_ref) {
      formDataToSend.append('source_ref', formData.source_ref);
    } else if (formData.source_ref_existing && !hasNewFile) {
      // If no new file and we have existing file, send the existing path
      formDataToSend.append('source_ref_existing', formData.source_ref_existing);
    }
    
    // Debug: Log FormData entries
    console.log("=== FormData to Send ===");
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log("=== End FormData ===");
    
    onSubmit(formDataToSend);
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
    if (!file.type.includes('pdf')) {
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
    setHasNewFile(true);
  };

  // Remove selected file and revert to existing file
  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      source_ref: null,
    }));
    setHasNewFile(false);
    setFileError("");
    // Reset file input
    const fileInput = document.getElementById('source_ref') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file name from path
  const getFileNameFromPath = (path: string) => {
    if (!path) return '';
    return path.split('/').pop() || path;
  };

  // Get selected items for display
  const selectedCountry = countryOptions.find(c => c.value === formData.country_id);
  const selectedState = stateOptions.find(s => s.value === formData.state_id);
  const selectedCurrency = currencyOptions.find(c => c.value === formData.currency_id);

  // Get file URL for preview
  const getFileUrl = () => {
    if (formData.source_ref_existing) {
      return `${API_BASE_URL_FILE}${formData.source_ref_existing}`;
    }
    return null;
  };

  const fileUrl = getFileUrl();

  if (!minimumWage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5" />
            Edit Minimum Wage Regulation
          </DialogTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>ID: {minimumWage.id}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  minimumWage.is_active 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {minimumWage.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" />
              <span>Created: {new Date(minimumWage.created_at).toLocaleDateString()}</span>
            </div>
          </div>
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
                <Label htmlFor="wage_amount" className="required ">
                 
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

            {/* Source Reference - PDF Upload/Preview */}
            <div className="space-y-2">
              <Label htmlFor="source_ref" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                Source Reference (PDF Only)
              </Label>
              
              {/* Current File Preview */}
              {fileUrl && !hasNewFile && (
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getFileNameFromPath(formData.source_ref_existing)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current uploaded document
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => window.open(fileUrl, '_blank')}
                      >
                        <EyeIcon className="h-3 w-3" />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLinkIcon className="h-3 w-3" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* File Upload Area */}
              {hasNewFile || (!hasNewFile && !formData.source_ref_existing) ? (
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
                        <p className="text-sm font-medium">
                          {hasNewFile ? "New file selected" : "Upload Government Notification"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hasNewFile ? "Click to change file" : "Click to upload or drag and drop"}
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
                        {hasNewFile ? "Change File" : "Select File"}
                      </Button>
                    </div>
                  </label>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setHasNewFile(true);
                  }}
                >
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload New Document
                </Button>
              )}
              
              {/* New File Preview */}
              {formData.source_ref && (
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
                {hasNewFile 
                  ? "Upload a new government notification or legal reference document (PDF format, max 2MB)"
                  : "Keep existing document or upload a new one"}
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
                !formData.effective_from
              }
              className="bg-[#1E1B4B] hover:bg-[#2A2675]"
            >
              {(isLoading || loadingCountries || loadingCurrencies) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoading ? "Updating..." : "Loading data..."}
                </>
              ) : (
                "Update Minimum Wage"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};