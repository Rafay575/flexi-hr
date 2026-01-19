import React, { useEffect } from "react";
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
import { Loader2, GlobeIcon } from "lucide-react";
import { COUNTRY_OPTIONS } from "./types";

interface EditBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  bank: any;
}

export const EditBankModal: React.FC<EditBankModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  bank,
}) => {
  const [formData, setFormData] = React.useState({
    country_id: "",
    bank_code: "",
    bank_name: "",
    active: true,
  });

  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);

  // Update form when bank changes
  useEffect(() => {
    if (bank) {
      setFormData({
        country_id: bank.country_id?.toString() || "",
        bank_code: bank.bank_code || "",
        bank_name: bank.bank_name || "",
        active: Boolean(bank.active),
      });
      
      const country = COUNTRY_OPTIONS.find(c => c.id === bank.country_id);
      setSelectedCountry(country);
    }
  }, [bank]);

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!bank) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Bank: {bank.bank_code}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            ID: {bank.id} • Created: {new Date(bank.created_at).toLocaleDateString()}
          </p>
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
                <div className="text-sm text-gray-500">
                  Currency: {selectedCountry.currency}
                </div>
              )}
            </div>

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
                  Unique bank identifier
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

            {/* Current Details */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm font-medium mb-2">Current Details</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Bank Code:</p>
                  <p className="font-medium">{bank.bank_code}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bank Name:</p>
                  <p className="font-medium">{bank.bank_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Country:</p>
                  <p className="font-medium">{bank.country_name} ({bank.country_iso2})</p>
                </div>
                <div>
                  <p className="text-gray-600">Status:</p>
                  <Badge variant={bank.active ? "default" : "secondary"}>
                    {bank.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
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
                  Updating...
                </>
              ) : (
                "Update Bank"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};