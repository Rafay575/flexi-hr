// DeleteStateDialog.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteStateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  stateName: string;
  isLoading: boolean;
}

export const DeleteStateDialog: React.FC<DeleteStateDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  stateName,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delete State</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-700">
          Are you sure you want to delete the state <strong>{stateName}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
