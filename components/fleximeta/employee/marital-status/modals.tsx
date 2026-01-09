// app/marital-status/components/modals.tsx
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
import type { MaritalStatusRow, MaritalStatusFormData } from "./types";

// Create Marital Status Modal
interface CreateMaritalStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MaritalStatusFormData) => Promise<void>;
  isLoading: boolean;
}

export function CreateMaritalStatusModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateMaritalStatusModalProps) {
  const [formData, setFormData] = useState<MaritalStatusFormData>({
    name: "",
    active: true,
  });
  const [errors, setErrors] = useState<{name?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {name?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Marital status is required";
    } else if (formData.name.length > 20) {
      newErrors.name = "Marital status cannot exceed 20 characters";
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
    // Limit to 20 characters
    const limitedValue = value.slice(0, 20);
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
            <DialogTitle>Create New Marital Status</DialogTitle>
            <DialogDescription>
              Add a new marital status to your system. Maximum 20 characters allowed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Marital Status *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter marital status (e.g., Married, Single, Divorced)"
                required
                className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                maxLength={20}
              />
              <div className="flex justify-between items-center">
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.name.length}/20 characters
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
                "Create Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Marital Status Modal
interface EditMaritalStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MaritalStatusFormData) => Promise<void>;
  isLoading: boolean;
  maritalStatus: MaritalStatusRow | null;
}

export function EditMaritalStatusModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  maritalStatus,
}: EditMaritalStatusModalProps) {
  const [formData, setFormData] = useState<MaritalStatusFormData>({
    name: "",
    active: true,
  });
  const [errors, setErrors] = useState<{name?: string}>({});

  React.useEffect(() => {
    if (maritalStatus) {
      setFormData({
        name: maritalStatus.name,
        active: maritalStatus.active,
      });
      setErrors({});
    }
  }, [maritalStatus]);

  const validateForm = (): boolean => {
    const newErrors: {name?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Marital status is required";
    } else if (formData.name.length > 20) {
      newErrors.name = "Marital status cannot exceed 20 characters";
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
    // Limit to 20 characters
    const limitedValue = value.slice(0, 20);
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
            <DialogTitle>Edit Marital Status</DialogTitle>
            <DialogDescription>
              Update the marital status details below. Maximum 20 characters allowed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Marital Status *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter marital status (e.g., Married, Single, Divorced)"
                required
                className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                maxLength={20}
              />
              <div className="flex justify-between items-center">
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.name.length}/20 characters
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
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Marital Status Dialog
interface DeleteMaritalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  maritalStatusName: string;
  isLoading: boolean;
}

export function DeleteMaritalStatusDialog({
  open,
  onOpenChange,
  onConfirm,
  maritalStatusName,
  isLoading,
}: DeleteMaritalStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Delete Marital Status</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">{maritalStatusName}</span>?
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
              "Delete Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}