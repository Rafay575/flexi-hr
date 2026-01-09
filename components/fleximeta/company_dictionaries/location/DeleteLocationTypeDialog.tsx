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
  locationTypeName: string;
  isLoading: boolean;
}

export const DeleteLocationTypeDialog: React.FC<DeleteLocationTypeDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  locationTypeName,
  isLoading,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              Delete Location Type
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 pt-2">
            Are you sure you want to delete the location type{" "}
            <span className="font-semibold text-gray-900">"{locationTypeName}"</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm text-red-700 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-semibold">Warning:</span> Deleting this location type
              may affect locations that are using it. Consider deactivating instead if
              you want to keep historical data.
            </span>
          </p>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Location Type
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};