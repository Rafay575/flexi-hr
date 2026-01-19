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
import { Loader2 } from "lucide-react";
import { DECIMAL_OPTIONS } from "./types";

interface EditCurrencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  currency: any;
}

export const EditCurrencyModal: React.FC<EditCurrencyModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  currency,
}) => {
  const [formData, setFormData] = React.useState({
    iso_code: "",
    symbol: "",
    decimals: 2,
    active: true,
  });

  // Update form when currency changes
  useEffect(() => {
    console.log("Currency changed:", currency);
    if (currency) {
      setFormData({
        iso_code: currency.iso_code || "",
        symbol: currency.symbol || "",
        decimals: currency.decimals || 2,
        active: currency.active ,
      });
    }
  }, [currency]);

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

  if (!currency) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Currency: {currency.iso_code}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            ID: {currency.id} • Created: {new Date(currency.created_at).toLocaleDateString()}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
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
                  Currency symbol
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
                Number of decimal places (standard is 2)
              </p>
            </div>

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

            {/* Current Details */}
      
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
                "Update Currency"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};