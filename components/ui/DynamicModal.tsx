import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DynamicModalProps {
  /** Controls the open state */
  open: boolean;
  /** Called when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Optional icon (e.g., check mark) */
  icon?: React.ReactNode;
  /** Modal title */
  title: string;
  /** Modal description text */
  description?: string;
  /** Any extra content below the description */
  children?: React.ReactNode;
  /** Primary button action */
  primaryAction: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  /** Optional secondary button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
}

export function DynamicModal({
  open,
  onOpenChange,
  icon,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
}: DynamicModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay with fade */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Content with scale & fade */}
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/3 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/3 rounded-lg bg-white p-6 pt-0 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Close button */}
                <div className="flex justify-end mt-6">
                  <Dialog.Close asChild>
                    <button className="rounded-full p-1 bg-gray-900 hover:bg-gray-500 duration-300">
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Icon (if provided) */}
                {icon && (
                  <div className="mx-auto mb-4 text-white flex h-20 w-20  items-center justify-center rounded-full border-5 border-[#9EE1D4] bg-[#40c4aa]">
                    {icon}
                  </div>
                )}

                {/* Title & description */}
                <Dialog.Title className="text-[32px] font-semibold text-center">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-2 text-sm text-center text-gray-500">
                    {description}
                  </Dialog.Description>
                )}

                {/* Extra content slot */}
                {children && <div className="mt-4">{children}</div>}

                {/* Actions */}
                <div className="mt-6 flex justify-center space-x-3">
                
                  <button
                    onClick={primaryAction.onClick}
                    className={cn(
                      "px-4 py-2 rounded-md w-full text-sm font-medium bg-gradient-to-b from-[#6256F9] to-[#3B2CF8] text-white",
                      primaryAction.className
                    )}
                  >
                    {primaryAction.label}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
