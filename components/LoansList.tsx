
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  ChevronRight, Calendar, Wallet, AlertCircle, 
  CheckCircle2, Clock, History, FileText, 
  ArrowUpRight, Landmark, Building2, Info
} from 'lucide-react';
import { LoanForm } from './LoanForm';
import { LoanStatement } from './LoanStatement';

type LoanType = 'Salary Advance' | 'Personal' | 'Emergency' | 'Car' | 'House';
type LoanStatus = 'Active' | 'Pending' | 'On Hold' | 'Closed' | 'Written Off';

interface LoanRecord {
  id: string;
  empId: string;
  empName: string;
  type: LoanType;
  principal: number;
  outstanding: number;
  emi: number;
  remainingInst: number;
  status: LoanStatus;
}

const MOCK_LOANS: LoanRecord[] = Array.from({ length: 45 }).map((_, i) => {
  const principal = [50000, 150000, 500000, 2500000][i % 4];
  const type: LoanType = i % 5 === 0 ? 'Salary Advance' : i % 5 === 1 ? 'Personal' : i % 5 === 2 ? 'Emergency' : i % 5 === 3 ? 'Car' : 'House';
  const status: LoanStatus = i === 0 ? 'Pending' : i === 5 ? 'On Hold' : i > 35 ? 'Closed' : 'Active';
  const remaining = i > 35 ? 0 : 5 + (i % 12);
  const emi = Math.round(principal / 12);
  
  return {
    id: `L-2025-${500 - i}`,
    empId: `EMP-${1001 + i}`,
    empName: ['Arsalan Khan', 'Saira Ahmed', 'Umar Farooq', 'Zainab Bibi', 'Mustafa Kamal'][i % 5],
    type,
    principal,
    outstanding: status === 'Closed' ? 0 : Math.round(emi * remaining),
    emi,
    remainingInst: remaining,
    status
  };
});

export const LoansList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending' | 'Closed' | 'All'>('Active');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const getStatusStyle = (status: LoanStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-600 border-green-200';
      case 'Pending': return 'bg-status-pending/10 text-status-pending border border-status-pending/20';
      case 'On Hold': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Closed': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Written Off': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const filteredLoans = MOCK_LOANS.filter(l => {
    const matchesTab = activeTab === 'All' || l.status === activeTab;
    const matchesSearch = l.empName.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Loans & Advances</h2>
          <p className="text-sm text-gray-500">Manage employee credit, repayments, and outstanding liabilities</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Loan Application
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Loans</p>
          <div className="flex items-center gap-3">
            <h4 className="text-2xl font-black text-gray-800">45</h4>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+2 new</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Outstanding</p>
          <h4 className="text-2xl font-black text-primary">PKR 2.35M</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jan EMI Recovery</p>
          <h4 className="text-2xl font-black text-payroll-deduction">PKR 580K</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Closing this Cycle</p>
          <div className="flex items-center gap-3">
            <h4 className="text-2xl font-black text-green-600">03</h4>
            <div className="p-1 bg-green-50 rounded text-green-600"><CheckCircle2 size={14}/></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {['Active', 'Pending', 'Closed', 'All'].map(tab => (
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
          
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employee or Loan ID..." 
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Loan ID</th>
                <th className="px-6 py-5">Employee</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5 text-right">Principal</th>
                <th className="px-6 py-5 text-right">Outstanding</th>
                <th className="px-6 py-5 text-right">EMI (PKR)</th>
                <th className="px-6 py-5 text-center">Remaining</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{loan.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{loan.empName.charAt(0)}</div>
                       <div>
                         <p className="font-bold text-gray-800 leading-none mb-1">{loan.empName}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{loan.empId}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded border">{loan.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-500">{loan.principal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{loan.outstanding.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-red-500">{loan.emi.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-gray-700">{loan.remainingInst}</span>
                      <span className="text-[8px] text-gray-400 uppercase font-black">Months</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${getStatusStyle(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setSelectedStatementId(loan.id)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
                        title="View Statement"
                       >
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
           <p>Showing {filteredLoans.length} of {MOCK_LOANS.length} Loan records</p>
           <div className="flex gap-6">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Active Recovery</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> New Application</span>
           </div>
        </div>
      </div>

      <LoanForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={(data) => {
          console.log('Loan created:', data);
          setIsFormOpen(false);
        }} 
      />

      <LoanStatement 
        isOpen={!!selectedStatementId} 
        onClose={() => setSelectedStatementId(null)} 
        loanId={selectedStatementId || ''} 
      />

      {/* Info Block */}
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 shadow-sm">
         <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Loan Recovery Policy</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Recovery happens automatically via the <span className="font-bold">Loan Recovery (D012)</span> pay component during the payroll run. For mid-month settlements, please use the "Full Repayment" action to generate an ad-hoc adjustment.
            </p>
         </div>
      </div>
    </div>
  );
};
