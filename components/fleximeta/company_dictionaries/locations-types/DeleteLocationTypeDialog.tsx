// components/DeleteLocationTypeDialog.tsx
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
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteLocationTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  locationTypeName?: string;
  isLoading?: boolean;
}

export const DeleteLocationTypeDialog: React.FC<DeleteLocationTypeDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  locationTypeName = "",
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px] bg-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle className="text-lg font-bold">Delete Location Type</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to delete the location type{" "}
            <span className="font-semibold text-gray-900">{locationTypeName}</span>?
            This action cannot be undone and will permanently remove the location type from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Warning</p>
              <p className="text-sm text-red-700 mt-1">
                Deleting this location type may affect associated locations. Make sure no locations are using this type before proceeding.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Location Type"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};