'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StateErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

const StateError: React.FC<StateErrorProps> = ({
  title = 'Something went wrong',
  message = 'We couldn’t load this data. Please try again.',
  onRetry,
}) => {
  return (
    <div
      className="w-full min-h-[160px] md:min-h-[220px] flex items-center justify-center"
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center text-center gap-3 px-6 py-6 "
      >
        <div className="relative">
          <span className="absolute -inset-3 rounded-full blur-xl opacity-25 bg-red-300" />
          <AlertTriangle className="relative size-8 text-red-600" aria-hidden />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            className="mt-1"
            variant="default"
          >
            <RotateCw className="mr-2 size-4" />
            Try again
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default StateError;
