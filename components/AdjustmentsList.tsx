
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  CheckCircle2, XCircle, Clock, ArrowUpRight, 
  ArrowDownRight, Download, Trash2, Check,
  Zap, Info, History, User, Calendar, Database
} from 'lucide-react';
import { AdjustmentForm } from './AdjustmentForm';
import { BulkAdjustmentUpload } from './BulkAdjustmentUpload';

type AdjustmentType = 'Bonus' | 'Penalty' | 'Reimbursement' | 'Correction' | 'Arrears';
type AdjustmentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processed';

interface AdjustmentRecord {
  id: string;
  empId: string;
  empName: string;
  type: AdjustmentType;
  amount: number;
  period: string;
  reason: string;
  status: AdjustmentStatus;
  requestedBy: string;
}

const MOCK_ADJUSTMENTS: AdjustmentRecord[] = Array.from({ length: 30 }).map((_, i) => {
  const types: AdjustmentType[] = ['Bonus', 'Penalty', 'Reimbursement', 'Correction', 'Arrears'];
  const statuses: AdjustmentStatus[] = ['Pending', 'Approved', 'Rejected', 'Processed'];
  const type = types[i % 5];
  const amount = type === 'Penalty' ? -1 * (2000 + (i * 500)) : (5000 + (i * 1000));
  
  return {
    id: `ADJ-2025-${99 - i}`,
    empId: `EMP-${1001 + i}`,
    empName: ['Arsalan Khan', 'Saira Ahmed', 'Umar Farooq', 'Zainab Bibi', 'Mustafa Kamal'][i % 5],
    type,
    amount,
    period: 'Jan 2025',
    reason: i % 3 === 0 ? 'Performance Achievement' : i % 3 === 1 ? 'Tax Correction' : 'Fuel Reimbursement',
    status: i < 5 ? 'Pending' : i < 15 ? 'Approved' : i < 20 ? 'Rejected' : 'Processed',
    requestedBy: 'HR Admin'
  };
});

export const AdjustmentsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | AdjustmentStatus>('Pending');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const getTypeStyle = (type: AdjustmentType) => {
    switch (type) {
      case 'Bonus': return 'bg-payroll-earning/10 text-payroll-earning border-payroll-earning/20';
      case 'Penalty': return 'bg-payroll-deduction/10 text-payroll-deduction border-payroll-deduction/20';
      case 'Reimbursement': return 'bg-payroll-contribution/10 text-payroll-contribution border-payroll-contribution/20';
      case 'Correction': return 'bg-payroll-reimbursement/10 text-payroll-reimbursement border-payroll-reimbursement/20';
      case 'Arrears': return 'bg-payroll-tax/10 text-payroll-tax border-payroll-tax/20';
    }
  };

  const getStatusStyle = (status: AdjustmentStatus) => {
    switch (status) {
      case 'Pending': return 'bg-status-pending/10 text-status-pending border-status-pending/20';
      case 'Approved': return 'bg-status-approved/10 text-status-approved border-status-approved/20';
      case 'Rejected': return 'bg-status-rejected/10 text-status-rejected border-status-rejected/20';
      case 'Processed': return 'bg-status-published/10 text-status-published border-status-published/20';
    }
  };

  const filtered = MOCK_ADJUSTMENTS.filter(adj => {
    const matchesTab = activeTab === 'All' || adj.status === activeTab;
    const matchesSearch = adj.empName.toLowerCase().includes(search.toLowerCase()) || adj.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const formatPKR = (val: number) => {
    const formatted = Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
    return val < 0 ? `-PKR ${formatted}` : `+PKR ${formatted}`;
  };

  if (isBulkOpen) {
    return <BulkAdjustmentUpload onComplete={() => setIsBulkOpen(false)} onCancel={() => setIsBulkOpen(false)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payroll Adjustments</h2>
          <p className="text-sm text-gray-500">Ad-hoc earnings, deductions, and period corrections</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsBulkOpen(true)}
            className="bg-white border border-gray-200 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all"
          >
            <Database size={18} className="text-primary" /> Bulk Upload
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} /> New Adjustment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Tabs & Search */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {['Pending', 'Approved', 'Rejected', 'Processed', 'All'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employee or Adjustment ID..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="px-6 py-3 bg-primary text-white flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest">{selectedIds.size} Selected</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase hover:text-accent transition-colors">
                <CheckCircle2 size={14} /> Approve All
              </button>
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase hover:text-accent transition-colors">
                <XCircle size={14} /> Reject All
              </button>
            </div>
            <button onClick={() => setSelectedIds(new Set())} className="text-white/60 hover:text-white transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5 w-10">
                   <input 
                    type="checkbox" 
                    className="rounded accent-primary" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(filtered.map(f => f.id)));
                      else setSelectedIds(new Set());
                    }}
                   />
                </th>
                <th className="px-6 py-5">ADJ ID</th>
                <th className="px-6 py-5">Employee</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5 text-right">Amount (PKR)</th>
                <th className="px-6 py-5 text-center">Period</th>
                <th className="px-6 py-5">Reason</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((adj) => (
                <tr key={adj.id} className={`hover:bg-gray-50 transition-colors group ${selectedIds.has(adj.id) ? 'bg-primary/[0.02]' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(adj.id)}
                      onChange={() => toggleSelect(adj.id)}
                      className="rounded accent-primary" 
                    />
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
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getTypeStyle(adj.type)}`}>
                      {adj.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-black ${adj.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {formatPKR(adj.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border uppercase tracking-tighter">{adj.period}</span>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-xs text-gray-600 truncate font-medium" title={adj.reason}>{adj.reason}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${getStatusStyle(adj.status)}`}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {adj.status === 'Pending' && (
                         <>
                           <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all" title="Approve">
                             <Check size={18} />
                           </button>
                           <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Reject">
                             <Trash2 size={18} />
                           </button>
                         </>
                       )}
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
        
        <div className="p-6 bg-gray-50 border-t flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-[2px]">
           <p>Showing {filtered.length} of {MOCK_ADJUSTMENTS.length} records</p>
           <div className="flex gap-6">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-payroll-earning"></div> Earnings (+)</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-payroll-deduction"></div> Deductions (-)</span>
           </div>
        </div>
      </div>

      <AdjustmentForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(data) => {
          console.log('Adjustment data:', data);
          setIsFormOpen(false);
        }}
      />

      {/* Audit Block */}
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 shadow-sm">
         <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Adjustment Integrity Protocol</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              All adjustments processed in the Jan 2025 cycle are final. Changes to "Processed" records require a reversal correction in the following month. <span className="font-bold">Digital ID: ADJ-LOG-PK-2025-99</span>.
            </p>
         </div>
      </div>
    </div>
  );
};
