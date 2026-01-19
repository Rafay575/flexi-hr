import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, FingerprintIcon, InfoIcon, ServerIcon } from "lucide-react";

interface DeleteDeviceTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  deviceInfo: string;
  isLoading: boolean;
}

export const DeleteDeviceTypeDialog: React.FC<DeleteDeviceTypeDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  deviceInfo,
  isLoading,
}) => {
  return (
         <AlertDialog open={open} onOpenChange={onOpenChange}>
              <AlertDialogContent className='bg-white'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete 
                    <span className="font-semibold"> {deviceInfo} </span>
                    from the catalog.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onConfirm}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
  );
};