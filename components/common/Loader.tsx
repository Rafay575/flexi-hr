'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type LoaderProps = {
  message?: string;
  fullHeight?: boolean; // stretch to parent height (useful in tables/panels)
};

const Loader: React.FC<LoaderProps> = ({ message = 'Loading…', fullHeight = true }) => {
  return (
    <div
      className={`w-full ${fullHeight ? 'min-h-[160px] md:min-h-[220px]' : ''} flex items-center justify-center`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3 px-4 py-3 "
      >
        {/* halo / pulse */}
        <motion.span
          className="relative inline-flex"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute inset-0 rounded-full blur-xl opacity-30 bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
          <Loader2 className="relative size-6 animate-spin text-indigo-600" aria-hidden />
        </motion.span>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{message}</span>
          <span className="text-xs text-gray-500">Please wait while we fetch fresh data.</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;
