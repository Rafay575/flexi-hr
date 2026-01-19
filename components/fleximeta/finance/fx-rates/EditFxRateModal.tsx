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
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRightLeft, CalculatorIcon, CalendarIcon } from "lucide-react";

interface EditFxRateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  fxRate: any;
  currencies: any[];
}

export const EditFxRateModal: React.FC<EditFxRateModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  fxRate,
  currencies,
}) => {
  const [formData, setFormData] = useState({
    base_currency_id: "",
    quote_currency_id: "",
    rate: "",
    rate_date: "",
  });

  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState<any>(null);
  const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState<any>(null);
  const [inverseRate, setInverseRate] = useState<number | null>(null);

  // Update form when fxRate changes
  useEffect(() => {
    if (fxRate) {
      setFormData({
        base_currency_id: fxRate.base_currency_id?.toString() || "",
        quote_currency_id: fxRate.quote_currency_id?.toString() || "",
        rate: fxRate.rate || "",
        rate_date: fxRate.rate_date || new Date().toISOString().split('T')[0],
      });

      const baseCurrency = currencies.find(c => c.id === fxRate.base_currency_id);
      const quoteCurrency = currencies.find(c => c.id === fxRate.quote_currency_id);
      setSelectedBaseCurrency(baseCurrency);
      setSelectedQuoteCurrency(quoteCurrency);
    }
  }, [fxRate, currencies]);

  useEffect(() => {
    if (formData.rate && !isNaN(parseFloat(formData.rate)) && parseFloat(formData.rate) !== 0) {
      setInverseRate(1 / parseFloat(formData.rate));
    } else {
      setInverseRate(null);
    }
  }, [formData.rate]);

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

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      base_currency_id: prev.quote_currency_id,
      quote_currency_id: prev.base_currency_id,
    }));
  };

  if (!fxRate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Exchange Rate: {fxRate.base_currency?.iso_code}/{fxRate.quote_currency?.iso_code}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            ID: {fxRate.id} • Created: {new Date(fxRate.created_at).toLocaleDateString()}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Currency Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="required">Currency Pair</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={swapCurrencies}
                  disabled={!formData.base_currency_id || !formData.quote_currency_id}
                  className="gap-2"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Swap Currencies
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_currency_id" className="required">
                    Base Currency
                  </Label>
                  <Select
                    value={formData.base_currency_id}
                    onValueChange={(value) => handleInputChange("base_currency_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select base currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.iso_code}</span>
                            <span className="text-gray-500">{currency.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote_currency_id" className="required">
                    Quote Currency
                  </Label>
                  <Select
                    value={formData.quote_currency_id}
                    onValueChange={(value) => handleInputChange("quote_currency_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quote currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies
                        .filter(currency => currency.id.toString() !== formData.base_currency_id)
                        .map((currency) => (
                          <SelectItem key={currency.id} value={currency.id.toString()}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currency.iso_code}</span>
                              <span className="text-gray-500">{currency.symbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Rate and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate" className="required">
                  Exchange Rate
                </Label>
                <div className="relative">
                  <Input
                    id="rate"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={formData.rate}
                    onChange={(e) => handleInputChange("rate", e.target.value)}
                    required
                    className="pr-20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    1 {selectedBaseCurrency?.iso_code || 'BASE'} = ?
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate_date" className="required">
                  Rate Date
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="rate_date"
                    type="date"
                    value={formData.rate_date}
                    onChange={(e) => handleInputChange("rate_date", e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Rate Calculation Preview */}
            {(formData.rate && selectedBaseCurrency && selectedQuoteCurrency) && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalculatorIcon className="h-5 w-5 text-blue-600" />
                  <p className="font-medium text-blue-800">Rate Calculation</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600">Forward Rate:</p>
                    <p className="font-bold">
                      1 {selectedBaseCurrency.iso_code} = {parseFloat(formData.rate).toFixed(6)} {selectedQuoteCurrency.iso_code}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-gray-600">Inverse Rate:</p>
                    <p className="font-bold">
                      1 {selectedQuoteCurrency.iso_code} = {inverseRate?.toFixed(6) || '?'} {selectedBaseCurrency.iso_code}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Rate Details */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm font-medium mb-2">Current Rate Details</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Currency Pair:</p>
                  <p className="font-medium">{fxRate.base_currency?.iso_code}/{fxRate.quote_currency?.iso_code}</p>
                </div>
                <div>
                  <p className="text-gray-600">Current Rate:</p>
                  <p className="font-medium">{parseFloat(fxRate.rate).toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rate Date:</p>
                  <p className="font-medium">{new Date(fxRate.rate_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated:</p>
                  <p className="font-medium">{new Date(fxRate.updated_at).toLocaleString()}</p>
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
                'Update Exchange Rate'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};