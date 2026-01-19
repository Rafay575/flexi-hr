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
import { 
  Loader2, 
  DollarSignIcon, 
  TagIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InfoIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from "lucide-react";

interface EditSalaryComponentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  salaryComponent: any;
}

const SALARY_COMPONENT_TYPE_OPTIONS = [
  { 
    value: "earning", 
    label: "Earning", 
    description: "Components that add to gross salary",
    icon: TrendingUpIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    value: "deduction", 
    label: "Deduction", 
    description: "Components that reduce gross salary",
    icon: TrendingDownIcon,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  }
] as const;

export const EditSalaryComponentModal: React.FC<EditSalaryComponentModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  salaryComponent,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "earning",
    taxable: true,
    pensionable: true,
    proratable: true,
    active: true,
  });

  // Initialize form data when salaryComponent changes or modal opens
  useEffect(() => {
    if (salaryComponent && open) {
      setFormData({
        code: salaryComponent.code || "",
        name: salaryComponent.name || "",
        type: salaryComponent.type || "earning",
        taxable: salaryComponent.taxable !== undefined ? salaryComponent.taxable : true,
        pensionable: salaryComponent.pensionable !== undefined ? salaryComponent.pensionable : true,
        proratable: salaryComponent.proratable !== undefined ? salaryComponent.proratable : true,
        active: salaryComponent.active !== undefined ? salaryComponent.active : true,
      });
    }
  }, [salaryComponent, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        code: "",
        name: "",
        type: "earning",
        taxable: true,
        pensionable: true,
        proratable: true,
        active: true,
      });
    }
  }, [open]);

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

  // Get selected type for display
  const selectedType = SALARY_COMPONENT_TYPE_OPTIONS.find(t => t.value === formData.type);

  if (!salaryComponent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5" />
            Edit Salary Component
          </DialogTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>ID: {salaryComponent.id}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  salaryComponent.active 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {salaryComponent.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" />
              <span>Created: {new Date(salaryComponent.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="required flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Component Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="BASIC, HRA, PF, etc."
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  required
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <InfoIcon className="h-3 w-3" />
                  Unique identifier (uppercase, no spaces)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="required flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Component Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Basic Salary, House Rent Allowance, etc."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Display name for the component</p>
              </div>
            </div>

            {/* Component Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="required flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4" />
                Component Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {SALARY_COMPONENT_TYPE_OPTIONS.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-start justify-start gap-3 py-1">
                          <div className={`p-2 rounded-full ${type.bgColor} ${type.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col justify-center items-start">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-gray-500">{type.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Attributes */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <InfoIcon className="h-4 w-4" />
                Component Attributes
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className={`flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 ${
                  formData.taxable ? "border-red-200 bg-red-50" : ""
                }`}>
                  <Switch
                    id="taxable"
                    checked={formData.taxable}
                    onCheckedChange={(checked) => handleInputChange("taxable", checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="taxable" className="cursor-pointer">
                      <div className="font-medium">Taxable</div>
                      <div className="text-xs text-gray-500">Subject to income tax</div>
                    </Label>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${formData.taxable ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500'}`}
                    >
                      {formData.taxable ? 'Tax Applied' : 'Non-Taxable'}
                    </Badge>
                  </div>
                </div>

                <div className={`flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 ${
                  formData.pensionable ? "border-blue-200 bg-blue-50" : ""
                }`}>
                  <Switch
                    id="pensionable"
                    checked={formData.pensionable}
                    onCheckedChange={(checked) => handleInputChange("pensionable", checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="pensionable" className="cursor-pointer">
                      <div className="font-medium">Pensionable</div>
                      <div className="text-xs text-gray-500">For pension calculation</div>
                    </Label>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${formData.pensionable ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-500'}`}
                    >
                      {formData.pensionable ? 'Pension Applied' : 'Non-Pensionable'}
                    </Badge>
                  </div>
                </div>

                <div className={`flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 ${
                  formData.proratable ? "border-green-200 bg-green-50" : ""
                }`}>
                  <Switch
                    id="proratable"
                    checked={formData.proratable}
                    onCheckedChange={(checked) => handleInputChange("proratable", checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="proratable" className="cursor-pointer">
                      <div className="font-medium">Proratable</div>
                      <div className="text-xs text-gray-500">Prorated for partial periods</div>
                    </Label>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${formData.proratable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500'}`}
                    >
                      {formData.proratable ? 'Prorated' : 'Not Prorated'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                Status
              </Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="active" className="text-base">Active Status</Label>
                  <p className="text-sm text-gray-500">
                    Active components are available for payroll processing
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {formData.active ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <XCircleIcon className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange("active", checked)}
                  />
                </div>
              </div>
              {!formData.active && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    Note: Inactive components won't be available for payroll processing or employee assignments.
                  </p>
                </div>
              )}
            </div>

            {/* Current vs Updated Preview */}
         
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
            <Button 
              type="submit" 
              disabled={
                isLoading || 
                !formData.code.trim() || 
                !formData.name.trim()
              }
              className="bg-[#1E1B4B] hover:bg-[#2A2675]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Salary Component"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};