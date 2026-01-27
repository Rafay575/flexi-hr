import React, { useState } from "react";
import { AlertTriangle, Clock, User, ChevronRight } from "lucide-react";

interface EscalatedItem {
  id: string;
  type: "regularization" | "ot" | "shift_swap" | "manual_punch";
  employeeName: string;
  employeeId: string;
  requestDate: string;
  escalatedAt: string;
  escalationLevel: number;
  reason: string;
  slaBreached: boolean;
}

export const EscalatedApprovals: React.FC = () => {
  const [items] = useState<EscalatedItem[]>([
    // Mock data - replace with API call
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Escalated Approvals</h1>
          <p className="text-slate-500 mt-1">
            Items that have breached SLA or been manually escalated
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-700">12</p>
              <p className="text-sm text-red-600">SLA Breached</p>
            </div>
          </div>
        </div>
        {/* Add more stat cards */}
      </div>

      {/* Escalated Items List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-900">Pending Escalations</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {items.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              No escalated items at this time
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-slate-50">
                {/* Item content */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};