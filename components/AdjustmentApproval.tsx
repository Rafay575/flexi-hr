
import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, HelpCircle, Eye, Search, 
  Filter, MoreVertical, User, Calendar, FileText,
  AlertCircle, ArrowRight, Wallet, ShieldCheck, Zap
} from 'lucide-react';

type ApprovalStatus = 'Pending My Action' | 'All Pending' | 'Completed';

interface ApprovalAdjustment {
  id: string;
  date: string;
  empId: string;
  empName: string;
  type: 'Bonus' | 'Penalty' | 'Reimbursement' | 'Correction' | 'Arrears';
  amount: number;
  reason: string;
  requestedBy: string;
  category: string;
  currentSalary: number;
}

const MOCK_APPROVALS: ApprovalAdjustment[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `ADJ-REQ-${100 + i}`,
  date: `2025-01-${10 + (i % 5)}`,
  empId: `EMP-${1001 + i}`,
  empName: ['Arsalan Khan', 'Saira Ahmed', 'Umar Farooq', 'Zainab Bibi', 'Mustafa Kamal'][i % 5],
  type: i % 4 === 0 ? 'Bonus' : i % 4 === 1 ? 'Penalty' : i % 4 === 2 ? 'Reimbursement' : 'Correction',
  amount: i % 4 === 1 ? -2500 : 15000 + (i * 1000),
  reason: i % 2 === 0 ? 'Exceeded annual sales target' : 'Fuel claim for inter-city travel',
  requestedBy: 'Ahmed Raza (Manager)',
  category: 'Performance',
  currentSalary: 185000
}));

export const AdjustmentApproval: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ApprovalStatus>('Pending My Action');
  const [selectedAdj, setSelectedAdj] = useState<ApprovalAdjustment | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bonus': return 'text-payroll-earning bg-payroll-earning/10 border-payroll-earning/20';
      case 'Penalty': return 'text-payroll-deduction bg-payroll-deduction/10 border-payroll-deduction/20';
      case 'Reimbursement': return 'text-payroll-contribution bg-payroll-contribution/10 border-payroll-contribution/20';
      default: return 'text-payroll-reimbursement bg-payroll-reimbursement/10 border-payroll-reimbursement/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Adjustment Approvals</h2>
          <p className="text-sm text-gray-500">Review and authorize ad-hoc payroll changes</p>
        </div>
        {selectedIds.size > 0 && (
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 animate-in slide-in-from-right-2">
            <CheckCircle2 size={18} /> Approve {selectedIds.size} Selected
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {['Pending My Action', 'All Pending', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as ApprovalStatus)}
                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5 w-10">
                  <input type="checkbox" className="rounded accent-primary" onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(MOCK_APPROVALS.map(a => a.id)));
                    else setSelectedIds(new Set());
                  }} />
                </th>
                <th className="px-6 py-5">Request ID</th>
                <th className="px-6 py-5">Employee</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5 text-right">Amount (PKR)</th>
                <th className="px-6 py-5">Requested By</th>
                <th className="px-6 py-5">Reason</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_APPROVALS.map((adj) => (
                <tr key={adj.id} className={`hover:bg-gray-50 transition-colors group ${selectedIds.has(adj.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selectedIds.has(adj.id)} onChange={() => toggleSelect(adj.id)} className="rounded accent-primary" />
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-primary">{adj.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{adj.empName.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-gray-800 leading-none mb-1">{adj.empName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{adj.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getTypeColor(adj.type)}`}>
                      {adj.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-black ${adj.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {adj.amount < 0 ? '-' : '+'}PKR {Math.abs(adj.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-gray-600">{adj.requestedBy}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{adj.date}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-xs text-gray-500 truncate" title={adj.reason}>{adj.reason}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedAdj(adj)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAdj && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedAdj(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Adjustment Inspection</h3>
              <button onClick={() => setSelectedAdj(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><XCircle size={20} /></button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                    {selectedAdj.empName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-lg">{selectedAdj.empName}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedAdj.empId} • Jan 2025 Cycle</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${getTypeColor(selectedAdj.type)}`}>
                    {selectedAdj.type} Adjustment
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial Context</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-500">Current Salary</span>
                      <span className="text-gray-800 font-bold">PKR {selectedAdj.currentSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-500">Proposed Change</span>
                      <span className={`font-black ${selectedAdj.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {selectedAdj.amount < 0 ? '-' : '+'}PKR {Math.abs(selectedAdj.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-[1px] bg-gray-200 my-2" />
                    <div className="flex justify-between text-sm font-black">
                      <span className="text-primary uppercase tracking-tighter">Est. New Payout</span>
                      <span className="text-primary">PKR {(selectedAdj.currentSalary + selectedAdj.amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Justification</h5>
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <p className="text-xs text-primary font-medium italic">"{selectedAdj.reason}"</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    <FileText size={14} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">View Attachment (Supporting_Doc.pdf)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-orange-700 font-bold uppercase tracking-tight">
                  This adjustment will impact the Jan 2025 tax bracket for this employee. Recalculation will trigger upon approval.
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t grid grid-cols-3 gap-3">
              <button className="py-3 bg-white border border-red-200 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 flex items-center justify-center gap-2">
                <XCircle size={14} /> Reject
              </button>
              <button className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 flex items-center justify-center gap-2">
                <HelpCircle size={14} /> Request Info
              </button>
              <button className="py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all active:scale-95">
                <CheckCircle2 size={14} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
