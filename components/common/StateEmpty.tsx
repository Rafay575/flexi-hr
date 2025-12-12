'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StateEmptyProps = {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const StateEmpty: React.FC<StateEmptyProps> = ({
  title = 'No data found',
  subtitle = 'Try adjusting your filters or search query.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full min-h-[160px] md:min-h-[220px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center text-center gap-3 px-6 py-6 "
      >
        <div className="relative">
          <span className="absolute -inset-3 rounded-full blur-xl opacity-25 bg-indigo-300" />
          <FileSearch className="relative size-8 text-indigo-600" aria-hidden />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {onAction && actionLabel && (
          <Button onClick={onAction} variant="default" className="mt-1">
            <Plus className="mr-2 size-4" />
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default StateEmpty;
