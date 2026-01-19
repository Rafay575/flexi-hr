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
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  bankName: string;
  isLoading: boolean;
}

export const DeleteBankDialog: React.FC<DeleteBankDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  bankName,
  isLoading,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg">
              Delete Bank: {bankName}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-gray-600">
            <p className="mb-3">
              Are you sure you want to delete this bank? This action cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-md p-3">
              <p className="text-sm font-medium text-red-800 mb-1">Warning:</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>This bank will be removed from all systems</li>
                <li>Existing transactions associated with this bank may be affected</li>
                <li>This action is permanent and cannot be reversed</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Bank"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};