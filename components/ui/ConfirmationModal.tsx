
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message,
  isLoading,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full shrink-0">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900">Are you sure?</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
           <Button variant="secondary" onClick={onClose} disabled={isLoading}>
             {cancelLabel}
           </Button>
           <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
             {confirmLabel}
           </Button>
        </div>
      </div>
    </Modal>
  );
};
