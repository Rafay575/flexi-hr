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
import { AlertTriangle, CalculatorIcon, Loader2 } from "lucide-react";

interface DeleteFxRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fxRateName: string;
  isLoading: boolean;
}

export const DeleteFxRateDialog: React.FC<DeleteFxRateDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  fxRateName,
  isLoading,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">
                Delete Exchange Rate: {fxRateName}
              </AlertDialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <CalculatorIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Foreign Exchange Rate</span>
              </div>
            </div>
          </div>
          <AlertDialogDescription className="pt-2 text-gray-600">
            <p className="mb-3">
              Are you sure you want to delete this exchange rate? This action cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-md p-3">
              <p className="text-sm font-medium text-red-800 mb-1">Warning:</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>This exchange rate will be permanently removed</li>
                <li>Any calculations using this rate may be affected</li>
                <li>Historical data using this rate will lose accuracy</li>
                <li>This action cannot be reversed</li>
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
              'Delete Exchange Rate'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};