import React from "react";
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
import { Loader2, GlobeIcon, InfoIcon } from "lucide-react";
import { COUNTRY_OPTIONS, COMMON_BANKS } from "./types";

interface CreateBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const CreateBankModal: React.FC<CreateBankModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState({
    country_id: "",
    bank_code: "",
    bank_name: "",
    active: true,
  });

  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCountryChange = (countryId: string) => {
    const country = COUNTRY_OPTIONS.find(c => c.id.toString() === countryId);
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country_id: countryId,
    }));
  };

  const handleCommonBankSelect = (bankCode: string) => {
    const bank = COMMON_BANKS.find(b => b.code === bankCode);
    if (bank) {
      setFormData({
        country_id: bank.country_id.toString(),
        bank_code: bank.code,
        bank_name: bank.name,
        active: true,
      });
      const country = COUNTRY_OPTIONS.find(c => c.id === bank.country_id);
      setSelectedCountry(country);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter common banks by selected country
  const filteredCommonBanks = COMMON_BANKS.filter(
    bank => !selectedCountry || bank.country_id === selectedCountry.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Bank
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="country_id" className="required">
                Country
              </Label>
              <Select
                value={formData.country_id}
                onValueChange={handleCountryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      <div className="flex items-center gap-2">
                        <GlobeIcon className="h-4 w-4" />
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
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  Currency: {selectedCountry.currency}
                </div>
              )}
            </div>

            {/* Common Banks Quick Select */}
            {selectedCountry && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Quick Select Common Banks
                </Label>
                <Select onValueChange={handleCommonBankSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a common bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCommonBanks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.code} - {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Bank Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_code" className="required">
                  Bank Code
                </Label>
                <Input
                  id="bank_code"
                  placeholder="HBL"
                  value={formData.bank_code}
                  onChange={(e) => handleInputChange("bank_code", e.target.value.toUpperCase())}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500">
                  Unique bank identifier (max 10 chars)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_name" className="required">
                  Bank Name
                </Label>
                <Input
                  id="bank_name"
                  placeholder="Habib Bank Limited"
                  value={formData.bank_name}
                  onChange={(e) => handleInputChange("bank_name", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Full name of the bank
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Status</Label>
                <p className="text-xs text-gray-500">
                  Active banks can be selected in transactions
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
              />
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Preview</p>
                  <p className="text-sm text-gray-600">
                    Bank: {formData.bank_code} - {formData.bank_name || "Bank Name"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Country: {selectedCountry?.name || "Not selected"}
                  </p>
                </div>
                <Badge variant={formData.active ? "default" : "secondary"}>
                  {formData.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Bank"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};