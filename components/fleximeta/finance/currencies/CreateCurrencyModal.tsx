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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, InfoIcon } from "lucide-react";
import { COMMON_CURRENCIES, DECIMAL_OPTIONS } from "./types";

interface CreateCurrencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const CreateCurrencyModal: React.FC<CreateCurrencyModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState({
    iso_code: "",
    symbol: "",
    decimals: 2,
    active: true,
  });

  const [customCurrency, setCustomCurrency] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCommonCurrencySelect = (isoCode: string) => {
    const currency = COMMON_CURRENCIES.find(c => c.iso_code === isoCode);
    if (currency) {
      setFormData({
        iso_code: currency.iso_code,
        symbol: currency.symbol,
        decimals: currency.decimals,
        active: true,
      });
      setCustomCurrency(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Currency
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Common Currencies Quick Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Quick Select Common Currencies
              </Label>
              <Select onValueChange={handleCommonCurrencySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a common currency" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {COMMON_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.iso_code} value={currency.iso_code}>
                      {currency.iso_code} - {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">
                  Or enter custom currency details
                </span>
                <Switch
                  checked={customCurrency}
                  onCheckedChange={setCustomCurrency}
                />
              </div>
            </div>

            {/* Custom Currency Form */}
            {(customCurrency || !formData.iso_code) && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="iso_code" className="required">
                      ISO Code
                    </Label>
                    <Input
                      id="iso_code"
                      placeholder="USD"
                      value={formData.iso_code}
                      onChange={(e) => handleInputChange("iso_code", e.target.value.toUpperCase())}
                      maxLength={3}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      3-letter ISO 4217 code
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symbol" className="required">
                      Symbol
                    </Label>
                    <Input
                      id="symbol"
                      placeholder="$"
                      value={formData.symbol}
                      onChange={(e) => handleInputChange("symbol", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Currency symbol (e.g., $, €, £)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimals" className="required">
                    Decimal Places
                  </Label>
                  <Select
                    value={formData.decimals.toString()}
                    onValueChange={(value) => handleInputChange("decimals", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {DECIMAL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Number of decimal places to use (2 is standard)
                  </p>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Status</Label>
                <p className="text-xs text-gray-500">
                  Active currencies can be used in transactions
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
              />
            </div>

            {/* Preview */}
          
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
                "Create Currency"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};