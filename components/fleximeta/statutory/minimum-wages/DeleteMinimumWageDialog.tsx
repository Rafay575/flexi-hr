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

interface DeleteMinimumWageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  wageInfo: string;
  isLoading: boolean;
}

export const DeleteMinimumWageDialog: React.FC<DeleteMinimumWageDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  wageInfo,
  isLoading,
}) => {
  return (
 <AlertDialog open={open} onOpenChange={onOpenChange}>
       <AlertDialogContent className='bg-white'>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
           <AlertDialogDescription>
             This action cannot be undone. This will permanently delete 
             <span className="font-semibold"> {wageInfo} </span>
             from the database.
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