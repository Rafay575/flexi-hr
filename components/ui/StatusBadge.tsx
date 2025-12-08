import React from 'react';

type StatusType = 'active' | 'inactive' | 'pending' | 'draft' | 'archived' | 'frozen';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'inactive':
      case 'archived':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'pending':
        return 'bg-brand-accent1/20 text-orange-800 border-brand-accent1/30';
      case 'draft':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'frozen':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStyles(status)} ${className}`}>
      {status}
    </span>
  );
};