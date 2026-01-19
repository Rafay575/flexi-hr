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
  FingerprintIcon, 
  ServerIcon, 
  MapIcon, 
  DatabaseIcon,
  CpuIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  TagIcon,
  CalendarIcon
} from "lucide-react";

interface EditDeviceTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  deviceType: any;
}

const CONNECTOR_CODE_OPTIONS = [
  { value: "ZK_PUSH", label: "ZKTeco Push", description: "ZKTeco devices with push API" },
  { value: "ZK_PULL", label: "ZKTeco Pull", description: "ZKTeco devices with pull API" },
  { value: "HIKVISION", label: "Hikvision", description: "Hikvision biometric devices" },
  { value: "SUPREMA", label: "Suprema", description: "Suprema biometric devices" },
  { value: "CUSTOM_API", label: "Custom API", description: "Custom API integration" },
  { value: "CSV_IMPORT", label: "CSV Import", description: "CSV file import format" },
] as const;

const DEVICE_BRAND_OPTIONS = [
  "ZKTeco",
  "Hikvision",
  "Suprema",
  "Matrix",
  "IDTech",
  "Mantra",
  "Prowatch",
  "BioMax",
  "Other"
] as const;

const FIELD_MAPPING_OPTIONS = {
  badge: [
    { value: "emp_code", label: "Employee Code", description: "Employee ID/code field" },
    { value: "badge_no", label: "Badge Number", description: "Badge/punch card number" },
    { value: "pin", label: "PIN", description: "Personal Identification Number" },
    { value: "user_id", label: "User ID", description: "User identifier" },
  ],
  timestamp: [
    { value: "punch_time", label: "Punch Time", description: "Attendance timestamp" },
    { value: "timestamp", label: "Timestamp", description: "Generic timestamp field" },
    { value: "check_time", label: "Check Time", description: "Check-in/out time" },
    { value: "date_time", label: "Date Time", description: "Combined date-time field" },
  ],
  direction: [
    { value: "in_out", label: "In/Out", description: "Direction indicator" },
    { value: "status", label: "Status", description: "Punch status" },
    { value: "type", label: "Type", description: "Punch type" },
    { value: "direction", label: "Direction", description: "Direction field" },
  ],
} as const;

export const EditDeviceTypeModal: React.FC<EditDeviceTypeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  deviceType,
}) => {
  const [formData, setFormData] = useState({
    brand: "ZKTeco",
    model: "",
    connector_code: "ZK_PUSH",
    field_map_json: {
      badge: "emp_code",
      timestamp: "punch_time",
      direction: "in_out"
    },
    active: true,
  });

  // Initialize form data when deviceType changes or modal opens
  useEffect(() => {
    if (deviceType && open) {
      setFormData({
        brand: deviceType.brand || "ZKTeco",
        model: deviceType.model || "",
        connector_code: deviceType.connector_code || "ZK_PUSH",
        field_map_json: {
          badge: deviceType.field_map_json?.badge || "emp_code",
          timestamp: deviceType.field_map_json?.timestamp || "punch_time",
          direction: deviceType.field_map_json?.direction || "in_out"
        },
        active: deviceType.active || true,
      });
    }
  }, [deviceType, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        brand: "ZKTeco",
        model: "",
        connector_code: "ZK_PUSH",
        field_map_json: {
          badge: "emp_code",
          timestamp: "punch_time",
          direction: "in_out"
        },
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

  const handleFieldMapChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      field_map_json: {
        ...prev.field_map_json,
        [field]: value,
      },
    }));
  };

  // Get selected options for display
  const selectedConnector = CONNECTOR_CODE_OPTIONS.find(c => c.value === formData.connector_code);
  const selectedBadgeField = FIELD_MAPPING_OPTIONS.badge.find(f => f.value === formData.field_map_json.badge);
  const selectedTimestampField = FIELD_MAPPING_OPTIONS.timestamp.find(f => f.value === formData.field_map_json.timestamp);
  const selectedDirectionField = FIELD_MAPPING_OPTIONS.direction.find(f => f.value === formData.field_map_json.direction);

  if (!deviceType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FingerprintIcon className="h-5 w-5" />
            Edit Device Type
          </DialogTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>ID: {deviceType.id}</span>
              <Badge variant="outline" className="text-xs">
                {deviceType.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" />
              <span>Created: {new Date(deviceType.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Device Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className="required flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Device Brand
                </Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => handleInputChange("brand", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-white"> 
                    {DEVICE_BRAND_OPTIONS.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Manufacturer/brand of the device</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="required flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Device Model
                </Label>
                <Input
                  id="model"
                  type="text"
                  placeholder="uFace302, BioStation 2, etc."
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Specific model number/name</p>
              </div>
            </div>

            {/* Connector Information */}
            <div className="space-y-2">
              <Label htmlFor="connector_code" className="required flex items-center gap-2">
                <ServerIcon className="h-4 w-4" />
                Connector Type
              </Label>
              <Select
                value={formData.connector_code}
                onValueChange={(value) => handleInputChange("connector_code", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connector type" />
                </SelectTrigger>
                <SelectContent className="bg-white"> 
                  {CONNECTOR_CODE_OPTIONS.map((connector) => (
                    <SelectItem key={connector.value} value={connector.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{connector.label}</span>
                        <span className="text-xs text-gray-500">{connector.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedConnector && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircleIcon className="h-3 w-3" />
                  Selected: {selectedConnector.label}
                </p>
              )}
            </div>

            {/* Field Mapping */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapIcon className="h-4 w-4" />
                Field Mapping Configuration
              </Label>
              <p className="text-xs text-gray-500">
                Map device data fields to system fields
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="badge_field" className="required flex items-center gap-2">
                    <DatabaseIcon className="h-4 w-4 text-green-500" />
                    Badge/ID Field
                  </Label>
                  <Select
                    value={formData.field_map_json.badge}
                    onValueChange={(value) => handleFieldMapChange("badge", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select badge field" />
                    </SelectTrigger>
                    <SelectContent className="bg-white"> 
                      {FIELD_MAPPING_OPTIONS.badge.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{field.label}</span>
                            <span className="text-xs text-gray-500">{field.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBadgeField && (
                    <p className="text-xs text-green-600">
                      Maps to: {selectedBadgeField.label}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timestamp_field" className="required flex items-center gap-2">
                    <CpuIcon className="h-4 w-4 text-blue-500" />
                    Timestamp Field
                  </Label>
                  <Select
                    value={formData.field_map_json.timestamp}
                    onValueChange={(value) => handleFieldMapChange("timestamp", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timestamp field" />
                    </SelectTrigger>
                    <SelectContent className="bg-white"> 
                      {FIELD_MAPPING_OPTIONS.timestamp.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{field.label}</span>
                            <span className="text-xs text-gray-500">{field.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTimestampField && (
                    <p className="text-xs text-green-600">
                      Maps to: {selectedTimestampField.label}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction_field" className="required flex items-center gap-2">
                    <MapIcon className="h-4 w-4 text-purple-500" />
                    Direction Field
                  </Label>
                  <Select
                    value={formData.field_map_json.direction}
                    onValueChange={(value) => handleFieldMapChange("direction", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction field" />
                    </SelectTrigger>
                    <SelectContent className="bg-white"> 
                      {FIELD_MAPPING_OPTIONS.direction.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{field.label}</span>
                            <span className="text-xs text-gray-500">{field.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDirectionField && (
                    <p className="text-xs text-green-600">
                      Maps to: {selectedDirectionField.label}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Field Mapping Summary:
                </p>
                <div className="text-sm text-blue-600 grid grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">Device Field</span>
                    <div className="text-xs">→</div>
                    <span className="font-medium">System Field</span>
                  </div>
                  <div>
                    <span>{selectedBadgeField?.label || 'Badge'}</span>
                    <div className="text-xs">→</div>
                    <span>Employee ID</span>
                  </div>
                  <div>
                    <span>{selectedTimestampField?.label || 'Timestamp'}</span>
                    <div className="text-xs">→</div>
                    <span>Punch Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Status</Label>
                <p className="text-xs text-gray-500">
                  Active device types are available for configuration
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
              />
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
            <Button 
              type="submit" 
              disabled={
                isLoading || 
                !formData.model.trim()
              }
              className="bg-[#1E1B4B] hover:bg-[#2A2675]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Device Type"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};