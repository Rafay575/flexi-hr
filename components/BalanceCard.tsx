
import React from 'react';
import { LeaveBalance, LeaveType } from '../types';
import { Calendar, HeartPulse, Coffee, Baby, MinusCircle } from 'lucide-react';

interface Props {
  balance: LeaveBalance;
}

const getIcon = (type: LeaveType) => {
  switch (type) {
    case LeaveType.ANNUAL: return <Calendar className="text-[#3E3B6F]" />;
    case LeaveType.SICK: return <HeartPulse className="text-red-500" />;
    case LeaveType.CASUAL: return <Coffee className="text-amber-500" />;
    case LeaveType.MATERNITY: return <Baby className="text-pink-500" />;
    default: return <MinusCircle />;
  }
};

const BalanceCard: React.FC<Props> = ({ balance }) => {
  const percentage = (balance.used / balance.total) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#3E3B6F]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getIcon(balance.type)}
        </div>
        <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Remaining: {balance.remaining}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{balance.type}</h3>
      <div className="flex items-end gap-2 mb-4">
        <span className="text-3xl font-bold text-[#3E3B6F]">{balance.remaining}</span>
        <span className="text-gray-400 mb-1">/ {balance.total} Days</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className="bg-[#3E3B6F] h-2 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};

export default BalanceCard;
