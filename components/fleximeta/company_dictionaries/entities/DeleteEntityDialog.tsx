'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DeleteEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  entityName: string;
  isLoading: boolean;
}

export const DeleteEntityDialog: React.FC<DeleteEntityDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  entityName,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Delete Entity
          </DialogTitle>
          <DialogDescription className="pt-2">
            This action cannot be undone. This will permanently delete the entity
            and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the entity{' '}
              <strong className="font-semibold text-gray-900">{entityName}</strong>?
            </p>
            <p className="text-xs text-red-600 mt-2">
              ⚠️ This will remove the entity from all associated records.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Entity'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};