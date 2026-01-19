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
  ClockIcon, 
  MoonIcon, 
  SunIcon, 
  CoffeeIcon, 
  TimerIcon, 
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon
} from "lucide-react";

interface CreateShiftArchetypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const CreateShiftArchetypeModal: React.FC<CreateShiftArchetypeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    start_time: "09:00",
    end_time: "18:00",
    break_min: 60,
    night_shift: false,
    ot_rule_json: {
      ot_after_min: 480, // 8 hours in minutes
      multiplier: 1.5
    },
    active: true,
  });

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setFormData({
        code: "",
        name: "",
        start_time: "09:00",
        end_time: "18:00",
        break_min: 60,
        night_shift: false,
        ot_rule_json: {
          ot_after_min: 480,
          multiplier: 1.5
        },
        active: true,
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
const formatTimeToHi = (timeString: string) => {
  if (!timeString) return timeString;
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return timeString;
  const formattedHours = hours.padStart(2, '0');
  const formattedMinutes = minutes.padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
}
  const handleInputChange = (field: string, value: any) => {
  let formattedValue = value;
  if (field === 'start_time' || field === 'end_time') {
    formattedValue = formatTimeToHi(value);
  }
  setFormData(prev => ({
    ...prev,
    [field]: formattedValue,
  }));
};
  const handleOtRuleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ot_rule_json: {
        ...prev.ot_rule_json,
        [field]: value,
      },
    }));
  };

  // Calculate shift duration
  const calculateDuration = () => {
    const [startHour, startMin] = formData.start_time.split(':').map(Number);
    const [endHour, endMin] = formData.end_time.split(':').map(Number);
    
    let startInMinutes = startHour * 60 + startMin;
    let endInMinutes = endHour * 60 + endMin;
    
    // Handle overnight shifts
    if (endInMinutes < startInMinutes) {
      endInMinutes += 24 * 60;
    }
    
    const totalMinutes = endInMinutes - startInMinutes - formData.break_min;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalMinutes: totalMinutes + formData.break_min };
  };

  // Format time for display
  const formatTimeForDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const duration = calculateDuration();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Create New Shift Archetype
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Define a shift pattern with timing, breaks, and overtime rules
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="required flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Shift Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="GENERAL, NIGHT, ROTATIONAL"
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
                  Shift Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="General Shift, Night Shift, etc."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Display name for the shift pattern</p>
              </div>
            </div>

            {/* Timing Information */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                Shift Timing
              </Label>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time" className="required flex items-center gap-2">
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                    Start Time
                  </Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange("start_time", e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formatTimeForDisplay(formData.start_time)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time" className="required flex items-center gap-2">
                    <MoonIcon className="h-4 w-4 text-indigo-500" />
                    End Time
                  </Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange("end_time", e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formatTimeForDisplay(formData.end_time)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="break_min" className="required flex items-center gap-2">
                    <CoffeeIcon className="h-4 w-4 text-brown-500" />
                    Break (minutes)
                  </Label>
                  <Input
                    id="break_min"
                    type="number"
                    min="0"
                    max="240"
                    step="15"
                    value={formData.break_min}
                    onChange={(e) => handleInputChange("break_min", parseInt(e.target.value))}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor(formData.break_min / 60)}h {formData.break_min % 60}m break
                  </p>
                </div>
              </div>

              {/* Duration Summary */}
              <div className="bg-gray-50 p-3 rounded-md border">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Total Shift Duration:</span>
                    <span className="ml-2">
                      {duration.hours}h {duration.minutes}m work
                      {formData.break_min > 0 && ` + ${formData.break_min}m break`}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {duration.totalMinutes} total minutes
                  </Badge>
                </div>
              </div>
            </div>

            {/* Overtime Rules */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <TimerIcon className="h-4 w-4" />
                Overtime Rules
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ot_after_min" className="required flex items-center gap-2">
                    <TimerIcon className="h-4 w-4 text-green-500" />
                    OT After (minutes)
                  </Label>
                  <Input
                    id="ot_after_min"
                    type="number"
                    min="0"
                    max="1440"
                    step="15"
                    value={formData.ot_rule_json.ot_after_min}
                    onChange={(e) => handleOtRuleChange("ot_after_min", parseInt(e.target.value))}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor(formData.ot_rule_json.ot_after_min / 60)}h {formData.ot_rule_json.ot_after_min % 60}m of work
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="multiplier" className="required flex items-center gap-2">
                    <TimerIcon className="h-4 w-4 text-purple-500" />
                    OT Multiplier
                  </Label>
                  <Input
                    id="multiplier"
                    type="number"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={formData.ot_rule_json.multiplier}
                    onChange={(e) => handleOtRuleChange("multiplier", parseFloat(e.target.value))}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formData.ot_rule_json.multiplier}x regular rate
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Overtime Calculation Summary:
                </p>
                <p className="text-sm text-blue-600">
                  Overtime applies after {formData.ot_rule_json.ot_after_min} minutes ({Math.floor(formData.ot_rule_json.ot_after_min / 60)}h {formData.ot_rule_json.ot_after_min % 60}m) of work at {formData.ot_rule_json.multiplier}x rate.
                </p>
              </div>
            </div>

            {/* Shift Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="night_shift" className="flex items-center gap-2">
                      <MoonIcon className="h-4 w-4" />
                      Night Shift
                    </Label>
                    <p className="text-xs text-gray-500">
                      For shifts that span overnight
                    </p>
                  </div>
                  <Switch
                    id="night_shift"
                    checked={formData.night_shift}
                    onCheckedChange={(checked) => handleInputChange("night_shift", checked)}
                  />
                </div>
                
                {formData.night_shift && (
                  <div className="bg-indigo-50 p-3 rounded-md border border-indigo-200">
                    <p className="text-sm font-medium text-indigo-700">
                      Night shift rules may apply additional allowances
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Status</Label>
                    <p className="text-xs text-gray-500">
                      Active shifts are available for assignment
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange("active", checked)}
                  />
                </div>
              </div>
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
                  Creating...
                </>
              ) : (
                "Create Shift Archetype"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};