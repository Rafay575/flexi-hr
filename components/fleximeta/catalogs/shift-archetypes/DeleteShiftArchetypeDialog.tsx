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

interface DeleteShiftArchetypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  archetypeInfo: string;
  isLoading: boolean;
}

export const DeleteShiftArchetypeDialog: React.FC<DeleteShiftArchetypeDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  archetypeInfo,
  isLoading,
}) => {
  return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
           <AlertDialogContent className='bg-white'>
             <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription>
                 This action cannot be undone. This will permanently delete 
                 <span className="font-semibold"> {archetypeInfo} </span>
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