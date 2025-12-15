// components/cost-centers/CostCenterModal.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
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
import { Separator } from "@/components/ui/separator";
import { Loader2, Calendar } from "lucide-react";
import {
  useCostCenterOptions,
  useLocationOptions,
  useDepartmentOptions,
} from "./useCostCenterOptions";

interface CostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "create" | "edit";
  costCenterData?: any;
  costCenterId?: string | number;
  refetchCostCenters?: () => Promise<void>;
  companyId?: number;
}

interface FormData {
  code: string;
  name: string;
  department_id: string;
  location_id: string;
  parent_id: string;
  valid_from: string;
  valid_to: string;
  active: boolean;
}

export default function CostCenterModal({
  isOpen,
  onClose,
  mode = "view",
  costCenterData = null,
  costCenterId = null,
  refetchCostCenters,
  companyId,
}: CostCenterModalProps) {
  const [formData, setFormData] = useState<FormData>({
    code: "",
    name: "",
    department_id: "",
    location_id: "",
    parent_id: "",
    valid_from: "",
    valid_to: "",
    active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch dropdown data using custom hooks
  const { data: departments = [], isLoading: loadingDepartments } =
    useDepartmentOptions();
  const { data: locations = [], isLoading: loadingLocations } =
    useLocationOptions();
  const { data: parentCostCenters = [], isLoading: loadingParents } =
    useCostCenterOptions();

  // Initialize form with existing data
  useEffect(() => {
    if (costCenterData && !isInitialized && isOpen) {
      setFormData({
        code: costCenterData.code || "",
        name: costCenterData.name || "",
        department_id: costCenterData.department_id || "",
        location_id: costCenterData.location_id || "",
        parent_id: costCenterData.parent_id || "",
        valid_from: costCenterData.valid_from || "",
        valid_to: costCenterData.valid_to || "",
        active: costCenterData.active ?? true,
      });
      setIsInitialized(true);
    } else if (mode === "create" && !isInitialized && isOpen) {
      // Reset form for create mode
      setFormData({
        code: "",
        name: "",
        department_id: "",
        location_id: "",
        parent_id: "",
        valid_from: "",
        valid_to: "",
        active: true,
      });
      setIsInitialized(true);
    }
  }, [costCenterData, mode, isInitialized, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    // Convert "none" to empty string for form state
    const finalValue = value === "none" ? "" : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Prepare data for API
      const submitData = {
        code: formData.code,
        name: formData.name,
        department_id: formData.department_id
          ? parseInt(formData.department_id)
          : null,
        location_id: formData.location_id
          ? parseInt(formData.location_id)
          : null,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        valid_from: formData.valid_from || null,
        valid_to: formData.valid_to || null,
        active: formData.active,
      };

      // Add company_id
      const payload = companyId
        ? { ...submitData, company_id: companyId }
        : submitData;

      if (mode === "create") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/meta/companies/cost-centers/store`,
          payload,
          config
        );

        toast.success("Cost center created successfully");
      } else if (mode === "edit" && costCenterId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/meta/companies/cost-centers/update/${costCenterId}`,
          payload,
          config
        );

        toast.success("Cost center updated successfully");
      }

      // Refresh cost centers list
      if (refetchCostCenters) {
        await refetchCostCenters();
      }

      handleClose();
    } catch (error: any) {
      console.error("Error saving cost center:", error);
      toast.error(
        error.response?.data?.message || "Failed to save cost center"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsInitialized(false);
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Create New Cost Center";
      case "edit":
        return "Edit Cost Center";
      case "view":
        return "Cost Center Details";
      default:
        return "Cost Center";
    }
  };

  // Helper function to get label from value
  const getLabelFromValue = (
    options: Array<{ value: string; label: string }>,
    value: string
  ) => {
    return options.find((option) => option.value === value)?.label || "—";
  };

  const isFormValid = () => {
    return formData.code.trim() && formData.name.trim();
  };

  const isLoadingAny = loadingDepartments || loadingLocations || loadingParents;

  // Filter parent cost centers (exclude current one in edit mode)
  const filteredParents =
    mode === "edit" && costCenterId
      ? parentCostCenters.filter((cc) => cc.value !== costCenterId.toString())
      : parentCostCenters;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white  border-gray-200 ">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-gray-900 ">
            {getTitle()}
            {mode === "view" && (
              <Badge
                variant={formData.active ? "default" : "secondary"}
                className="ml-2"
              >
                {formData.active ? "Active" : "Inactive"}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500 ">
            {mode === "view"
              ? "View cost center details"
              : mode === "create"
              ? "Create a new cost center for your company"
              : "Edit cost center information"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Code and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  GL Code <span className="text-red-500">*</span>
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  font-medium p-2 bg-gray-50  rounded-md">
                    {formData.code}
                  </div>
                ) : (
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter GL code"
                    className="bg-white  border-gray-300 "
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 ">
                  Name <span className="text-red-500">*</span>
                </Label>
                {mode === "view" ? (
                  <div className="text-gray-900  font-medium p-2 bg-gray-50  rounded-md">
                    {formData.name}
                  </div>
                ) : (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter cost center name"
                    className="bg-white  border-gray-300 "
                  />
                )}
              </div>
            </div>

            {/* Department and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 ">Department</Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {getLabelFromValue(departments, formData.department_id)}
                  </div>
                ) : (
                  <Select
                    value={formData.department_id || "none"}
                    onValueChange={(value) =>
                      handleSelectChange("department_id", value)
                    }
                    disabled={isLoading || loadingDepartments}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 ">Location</Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                    {getLabelFromValue(locations, formData.location_id)}
                  </div>
                ) : (
                  <Select
                    value={formData.location_id || "none"} // Add fallback to "none"
                    onValueChange={(value) =>
                      handleSelectChange("location_id", value)
                    }
                    disabled={isLoading || loadingLocations}
                  >
                    <SelectTrigger className="w-full bg-white  border-gray-300 ">
                      {loadingLocations ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select location" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white  border-gray-300 ">
                      <SelectItem value="none">None</SelectItem>{" "}
                      {/* Change "" to "none" */}
                      {locations.map((location) => (
                        <SelectItem
                          key={location.value}
                          value={location.value}
                          className="hover:bg-gray-100 "
                        >
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Parent Cost Center */}
            <div className="space-y-2">
              <Label className="text-gray-700 ">Parent Cost Center</Label>
              {mode === "view" ? (
                <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                  {getLabelFromValue(parentCostCenters, formData.parent_id)}
                </div>
              ) : (
                <Select
                  value={formData.parent_id || "none"} // Add fallback to "none"
                  onValueChange={(value) =>
                    handleSelectChange("parent_id", value)
                  }
                  disabled={isLoading || loadingParents}
                >
                  <SelectTrigger className="w-full bg-white  border-gray-300 ">
                    {loadingParents ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select parent cost center" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white  border-gray-300 ">
                    <SelectItem value="none">None</SelectItem>{" "}
                    {/* Change "" to "none" */}
                    {filteredParents.map((parent) => (
                      <SelectItem
                        key={parent.value}
                        value={parent.value}
                        className="hover:bg-gray-100 "
                      >
                        {parent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Separator className="my-4" />

            {/* Valid From and Valid To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 ">Valid From</Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formData.valid_from || "—"}
                  </div>
                ) : (
                  <Input
                    type="date"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-white  border-gray-300 "
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 ">Valid To</Label>
                {mode === "view" ? (
                  <div className="text-gray-900  p-2 bg-gray-50  rounded-md flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formData.valid_to || "—"}
                  </div>
                ) : (
                  <Input
                    type="date"
                    name="valid_to"
                    value={formData.valid_to}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-white  border-gray-300 "
                  />
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label className="text-gray-700 ">Status</Label>
              {mode === "view" ? (
                <div className="text-gray-900  p-2 bg-gray-50  rounded-md">
                  {formData.active ? "Active" : "Inactive"}
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={handleSwitchChange}
                    disabled={isLoading}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-gray-700 ">
                    {formData.active ? "Active" : "Inactive"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t border-gray-200 ">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              type="button"
              className="min-w-[100px]"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || isLoadingAny || !isFormValid()}
                type="button"
                className="min-w-[140px] bg-[#1E1B4B] hover:bg-[#2D2A6E]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Cost Center" : "Save Changes"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
