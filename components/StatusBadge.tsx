
import React from 'react';
import { PayrollStatus } from '../types';

interface StatusBadgeProps {
  status: PayrollStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<PayrollStatus, string> = {
    [PayrollStatus.Draft]: 'border-gray-400 border-dashed border text-gray-500',
    [PayrollStatus.Pending]: 'bg-status-pending/10 text-status-pending border border-status-pending/20',
    [PayrollStatus.Approved]: 'bg-status-approved/10 text-status-approved border border-status-approved/20',
    [PayrollStatus.Rejected]: 'bg-status-rejected/10 text-status-rejected border border-status-rejected/20',
    [PayrollStatus.Locked]: 'bg-status-locked/10 text-status-locked border border-status-locked/20',
    [PayrollStatus.Published]: 'bg-status-published/10 text-status-published border border-status-published/20'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-tight ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
