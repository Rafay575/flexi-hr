// app/health/components/modals.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertCircle } from "lucide-react";
import type { HealthRow, HealthFormData } from "./types";

// Create Health Modal
interface CreateHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HealthFormData) => Promise<void>;
  isLoading: boolean;
}

export function CreateHealthModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateHealthModalProps) {
  const [formData, setFormData] = useState<HealthFormData>({
    name: "",
    active: true,
  });
  const [errors, setErrors] = useState<{name?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {name?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Health condition is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Health condition cannot exceed 100 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
    setFormData({ name: "", active: true });
    setErrors({});
  };

  const handleNameChange = (value: string) => {
    // Limit to 100 characters
    const limitedValue = value.slice(0, 100);
    setFormData({ ...formData, name: limitedValue });
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Health Condition</DialogTitle>
            <DialogDescription>
              Add a new health condition to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Health Condition *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter health condition (e.g., Hepatitis B Vaccinated)"
                required
                className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.name.length}/100 characters
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active" className="cursor-pointer">
                Active Status
              </Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setErrors({});
              }}
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
                "Create Health Condition"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Health Modal
interface EditHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HealthFormData) => Promise<void>;
  isLoading: boolean;
  health: HealthRow | null;
}

export function EditHealthModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  health,
}: EditHealthModalProps) {
  const [formData, setFormData] = useState<HealthFormData>({
    name: "",
    active: true,
  });
  const [errors, setErrors] = useState<{name?: string}>({});

  React.useEffect(() => {
    if (health) {
      setFormData({
        name: health.name,
        active: health.active,
      });
      setErrors({});
    }
  }, [health]);

  const validateForm = (): boolean => {
    const newErrors: {name?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Health condition is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Health condition cannot exceed 100 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  const handleNameChange = (value: string) => {
    // Limit to 100 characters
    const limitedValue = value.slice(0, 100);
    setFormData({ ...formData, name: limitedValue });
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Health Condition</DialogTitle>
            <DialogDescription>
              Update the health condition details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Health Condition *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter health condition (e.g., Hepatitis B Vaccinated)"
                required
                className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.name.length}/100 characters
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active" className="cursor-pointer">
                Active Status
              </Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setErrors({});
              }}
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
                "Update Health Condition"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Health Dialog
interface DeleteHealthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  healthName: string;
  isLoading: boolean;
}

export function DeleteHealthDialog({
  open,
  onOpenChange,
  onConfirm,
  healthName,
  isLoading,
}: DeleteHealthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Delete Health Condition</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">{healthName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Health Condition"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}