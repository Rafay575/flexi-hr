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
import { Loader2, ArrowRightLeft, CalculatorIcon, CalendarIcon, InfoIcon } from "lucide-react";
import { COMMON_CURRENCY_PAIRS } from "./types";

interface CreateFxRateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  currencies: any[];
}

export const CreateFxRateModal: React.FC<CreateFxRateModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  currencies,
}) => {
  const [formData, setFormData] = useState({
    base_currency_id: "",
    quote_currency_id: "",
    rate: "",
    rate_date: new Date().toISOString().split('T')[0], // Today's date
  });

  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState<any>(null);
  const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState<any>(null);
  const [inverseRate, setInverseRate] = useState<number | null>(null);

  useEffect(() => {
    if (formData.base_currency_id && formData.quote_currency_id) {
      const base = currencies.find(c => c.id.toString() === formData.base_currency_id);
      const quote = currencies.find(c => c.id.toString() === formData.quote_currency_id);
      setSelectedBaseCurrency(base);
      setSelectedQuoteCurrency(quote);
    }
  }, [formData.base_currency_id, formData.quote_currency_id, currencies]);

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

  const handleCommonPairSelect = (pair: string) => {
    const [baseCode, quoteCode] = pair.split('/');
    const baseCurrency = currencies.find(c => c.iso_code === baseCode);
    const quoteCurrency = currencies.find(c => c.iso_code === quoteCode);
    
    if (baseCurrency && quoteCurrency) {
      setFormData(prev => ({
        ...prev,
        base_currency_id: baseCurrency.id.toString(),
        quote_currency_id: quoteCurrency.id.toString(),
      }));
    }
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

  // Get common pairs for selected currencies
  const filteredCommonPairs = COMMON_CURRENCY_PAIRS.filter(pair => {
    if (!selectedBaseCurrency && !selectedQuoteCurrency) return true;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Add New Exchange Rate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Quick Select Common Pairs */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Quick Select Common Currency Pairs
              </Label>
              <Select onValueChange={handleCommonPairSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a common currency pair" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCommonPairs.map((pair) => (
                    <SelectItem key={`${pair.base}/${pair.quote}`} value={`${pair.base}/${pair.quote}`}>
                      {pair.base}/{pair.quote} - {pair.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                            <Badge variant="outline" className="ml-auto">
                              {currency.decimals} decimals
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBaseCurrency && (
                    <div className="text-sm text-gray-500">
                      Base: 1 {selectedBaseCurrency.iso_code} = ?
                    </div>
                  )}
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
                  {selectedQuoteCurrency && (
                    <div className="text-sm text-gray-500">
                      Quote: ? = 1 {selectedQuoteCurrency.iso_code}
                    </div>
                  )}
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
                <p className="text-xs text-gray-500">
                  Rate: 1 {selectedBaseCurrency?.iso_code || 'Base'} = {formData.rate || '?'} {selectedQuoteCurrency?.iso_code || 'Quote'}
                </p>
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
                <p className="text-xs text-gray-500">
                  Date when this exchange rate is valid
                </p>
              </div>
            </div>

            {/* Rate Calculation Preview */}
            {(formData.rate && selectedBaseCurrency && selectedQuoteCurrency) && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalculatorIcon className="h-5 w-5 text-blue-600" />
                  <p className="font-medium text-blue-800">Rate Calculation Preview</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600">Forward Rate:</p>
                    <p className="font-bold text-lg">
                      1 {selectedBaseCurrency.iso_code} = {parseFloat(formData.rate).toFixed(6)} {selectedQuoteCurrency.iso_code}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-gray-600">Inverse Rate:</p>
                    <p className="font-bold text-lg">
                      1 {selectedQuoteCurrency.iso_code} = {inverseRate?.toFixed(6) || '?'} {selectedBaseCurrency.iso_code}
                    </p>
                  </div>
                </div>
                
                {inverseRate && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-gray-700">Example Conversions:</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">100 {selectedBaseCurrency.iso_code} =</p>
                        <p className="font-bold">{(100 * parseFloat(formData.rate)).toFixed(2)} {selectedQuoteCurrency.iso_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">100 {selectedQuoteCurrency.iso_code} =</p>
                        <p className="font-bold">{(100 * inverseRate).toFixed(2)} {selectedBaseCurrency.iso_code}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validation Messages */}
            {formData.base_currency_id && formData.quote_currency_id && 
             formData.base_currency_id === formData.quote_currency_id && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    You've selected the same currency for both base and quote. 
                    The rate should be 1.00 for same currency conversions.
                  </p>
                </div>
              </div>
            )}
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
                'Create Exchange Rate'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};