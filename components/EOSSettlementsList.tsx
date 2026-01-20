
import React, { useState } from 'react';
import { 
  Ban, Plus, Search, Filter, MoreVertical, 
  CheckCircle2, Clock, Calculator, Wallet, 
  ArrowUpRight, Download, Eye, FileText, 
  ChevronRight, AlertTriangle, Users, Building2,
  Trash2, Send, Info, ShieldCheck, Landmark
} from 'lucide-react';

type ExitType = 'Resignation' | 'Termination' | 'Retirement' | 'Contract End' | 'Death' | 'Absconding';
type SettlementStatus = 'Initiated' | 'HR Review' | 'Finance Review' | 'Approved' | 'Paid' | 'Closed';

interface SettlementRecord {
  id: string;
  empId: string;
  empName: string;
  lastWorkingDay: string;
  exitType: ExitType;
  amount: number;
  status: SettlementStatus;
  tenure: string;
}

const MOCK_SETTLEMENTS: SettlementRecord[] = [
  { id: 'EOS-2025-001', empId: 'EMP-1199', empName: 'Umar Jafri', lastWorkingDay: '2025-01-15', exitType: 'Resignation', amount: 458000, status: 'HR Review', tenure: '4.5 Years' },
  { id: 'EOS-2025-002', empId: 'EMP-1205', empName: 'Hassan Ali', lastWorkingDay: '2025-01-20', exitType: 'Contract End', amount: 125000, status: 'Initiated', tenure: '1 Year' },
  { id: 'EOS-2024-098', empId: 'EMP-1044', empName: 'Raza Jafri', lastWorkingDay: '2024-12-31', exitType: 'Retirement', amount: 2450000, status: 'Paid', tenure: '15 Years' },
  { id: 'EOS-2025-003', empId: 'EMP-1301', empName: 'Ayesha Malik', lastWorkingDay: '2025-01-05', exitType: 'Termination', amount: 85000, status: 'Finance Review', tenure: '8 Months' },
  { id: 'EOS-2024-095', empId: 'EMP-1012', empName: 'Saira Shah', lastWorkingDay: '2024-12-15', exitType: 'Resignation', amount: 312000, status: 'Closed', tenure: '3.2 Years' },
];

export const EOSSettlementsList: React.FC<{ onCreateNew?: () => void }> = ({ onCreateNew }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const stats = {
    pending: 5,
    inProgress: 3,
    completedMTD: 8,
    avgDays: 5
  };

  const getStatusStyle = (status: SettlementStatus) => {
    switch (status) {
      case 'Initiated': return 'border-gray-400 border-dashed border text-gray-500';
      case 'HR Review': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Finance Review': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Approved': return 'bg-green-50 text-green-600 border-green-200';
      case 'Paid': return 'bg-status-published/10 text-status-published border-status-published/20';
      case 'Closed': return 'bg-gray-100 text-gray-400 border-gray-200';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const getExitTypeStyle = (type: ExitType) => {
    switch (type) {
      case 'Termination': case 'Absconding': return 'text-red-600 bg-red-50';
      case 'Retirement': return 'text-indigo-600 bg-indigo-50';
      case 'Death': return 'text-gray-600 bg-gray-50';
      default: return 'text-primary bg-primary/5';
    }
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Final Settlements (EOS)</h2>
          <p className="text-sm text-gray-500">Manage separation benefits, gratuity, and notice period encashments</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Settlement
        </button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Initiation</p>
           <h4 className="text-3xl font-black text-red-500">{stats.pending}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">In Review Flow</p>
           <h4 className="text-3xl font-black text-primary">{stats.inProgress}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed MTD</p>
           <h4 className="text-3xl font-black text-green-600">{stats.completedMTD}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Resolution</p>
           <div className="flex items-baseline gap-1">
              <h4 className="text-3xl font-black text-gray-800">{stats.avgDays}</h4>
              <span className="text-xs font-bold text-gray-400 uppercase">Days</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
           <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
             {['ALL', 'PENDING', 'COMPLETED'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                   activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employee or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Settlement ID</th>
                <th className="px-6 py-5">Employee</th>
                <th className="px-6 py-5 text-center">Last Working Day</th>
                <th className="px-6 py-5">Exit Type</th>
                <th className="px-6 py-5 text-right">Settlement Amount</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SETTLEMENTS.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{rec.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{rec.empName.charAt(0)}</div>
                       <div>
                         <p className="font-bold text-gray-800 leading-none mb-1">{rec.empName}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{rec.empId} • {rec.tenure}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="font-bold text-gray-700">{rec.lastWorkingDay}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border shadow-sm ${getExitTypeStyle(rec.exitType)}`}>
                      {rec.exitType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{formatPKR(rec.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${getStatusStyle(rec.status)}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Detailed Statement">
                         <FileText size={18} />
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

        <div className="p-6 bg-gray-50 border-t flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-[2px]">
           <p>Showing {MOCK_SETTLEMENTS.length} separation records</p>
           <div className="flex gap-6">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> HR Verification</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Treasury Approval</span>
           </div>
        </div>
      </div>

      {/* Compliance Warning */}
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 shadow-sm">
         <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">End of Service Protocol</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Final settlements for Jan 2025 include automated gratuity calculation for eligible staff (1yr). Ensure IT Assets and Loan clearances are uploaded before Finance Review to prevent disbursement delays.
            </p>
         </div>
      </div>
    </div>
  );
};
