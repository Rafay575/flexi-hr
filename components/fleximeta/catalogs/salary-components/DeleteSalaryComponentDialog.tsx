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
import { Loader2, AlertTriangle, DollarSignIcon, InfoIcon } from "lucide-react";

interface DeleteSalaryComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  componentInfo: string;
  isLoading: boolean;
}

export const DeleteSalaryComponentDialog: React.FC<DeleteSalaryComponentDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  componentInfo,
  isLoading,
}) => {
  return (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
         <AlertDialogContent className='bg-white'>
           <AlertDialogHeader>
             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete 
               <span className="font-semibold"> {componentInfo} </span>
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