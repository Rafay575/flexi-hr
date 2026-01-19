
import React from 'react';
import { LeaveRequest, ApprovalStatus } from '../types';
import { Check, X, Clock } from 'lucide-react';

interface LeaveRequestsProps {
  requests: LeaveRequest[];
  onAction: (id: string, action: ApprovalStatus) => void;
}

export const LeaveRequests: React.FC<LeaveRequestsProps> = ({ requests, onAction }) => {
  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-800">{req.employeeName}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{req.type}</span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {req.startDate} to {req.endDate}
            </p>
            <p className="text-xs text-gray-400 mt-1 italic">"{req.reason}"</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {req.status === ApprovalStatus.PENDING ? (
              <>
                <button 
                  onClick={() => onAction(req.id, ApprovalStatus.APPROVED)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => onAction(req.id, ApprovalStatus.REJECTED)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </>
            ) : (
              <span className={`px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wide ${
                req.status === ApprovalStatus.APPROVED ? 'text-green-600' : 'text-red-600'
              }`}>
                {req.status}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
