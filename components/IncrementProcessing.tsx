
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Plus, Search, Filter, MoreVertical, 
  CheckCircle2, Clock, Calculator, Wallet, 
  ArrowUpRight, Download, Eye, FileText, 
  ChevronRight, AlertTriangle, Users, Building2,
  PieChart, Save, Send, X, Info
} from 'lucide-react';

interface IncrementCycle {
  id: string;
  name: string;
  effectiveDate: string;
  employees: number;
  budget: number;
  allocated: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Published';
}

interface IncrementRow {
  id: string;
  name: string;
  dept: string;
  currentGross: number;
  rating: 'A' | 'B' | 'C' | 'D';
  suggestedPerc: number;
  actualPerc: number;
}

const MOCK_CYCLES: IncrementCycle[] = [
  { id: 'INC-2025-01', name: 'Annual Performance Review 2025', effectiveDate: '2025-01-01', employees: 485, budget: 15000000, allocated: 12450000, status: 'Draft' },
  { id: 'INC-2024-02', name: 'Mid-Year Adjustments 2024', effectiveDate: '2024-07-01', employees: 42, budget: 2500000, allocated: 2480000, status: 'Published' },
];

const MOCK_WORKSHEET: IncrementRow[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', dept: 'Engineering', currentGross: 215000, rating: 'A', suggestedPerc: 15, actualPerc: 15 },
  { id: 'EMP-1002', name: 'Saira Ahmed', dept: 'HR', currentGross: 85000, rating: 'B', suggestedPerc: 10, actualPerc: 10 },
  { id: 'EMP-1005', name: 'Mustafa Kamal', dept: 'Engineering', currentGross: 550000, rating: 'A', suggestedPerc: 15, actualPerc: 18 },
  { id: 'EMP-1004', name: 'Zainab Bibi', dept: 'Operations', currentGross: 92000, rating: 'C', suggestedPerc: 5, actualPerc: 5 },
  { id: 'EMP-1003', name: 'Umar Farooq', dept: 'Sales', currentGross: 45000, rating: 'B', suggestedPerc: 10, actualPerc: 8 },
];

export const IncrementProcessing: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'WORKSHEET'>('LIST');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [worksheet, setWorksheet] = useState<IncrementRow[]>(MOCK_WORKSHEET);
  const [search, setSearch] = useState('');

  const budgetMetrics = useMemo(() => {
    const budget = 15000000;
    const allocated = worksheet.reduce((acc, curr) => acc + (curr.currentGross * curr.actualPerc / 100), 0) * 12; // Annualized
    return { budget, allocated, remaining: budget - allocated };
  }, [worksheet]);

  const handlePercChange = (id: string, val: number) => {
    setWorksheet(prev => prev.map(row => row.id === id ? { ...row, actualPerc: val } : row));
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  if (view === 'WORKSHEET') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('LIST')} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors">
              <X size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Annual Review 2025</h2>
              <p className="text-sm text-gray-500">Effective from 01 Jan 2025</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                <Save size={16} /> Save Draft
             </button>
             <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                <Send size={16} /> Submit for Approval
             </button>
          </div>
        </div>

        {/* Budget Tracker */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Annual Budget Pool</p>
             <h4 className="text-2xl font-black text-gray-800">{formatPKR(budgetMetrics.budget)}</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Allocated</p>
             <h4 className={`text-2xl font-black ${budgetMetrics.remaining < 0 ? 'text-red-500' : 'text-primary'}`}>
                {formatPKR(budgetMetrics.allocated)}
             </h4>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Remaining Buffer</p>
             <h4 className={`text-2xl font-black ${budgetMetrics.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {formatPKR(budgetMetrics.remaining)}
             </h4>
          </div>
        </div>

        {/* Worksheet Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50/30">
             <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <input type="text" placeholder="Search employee..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="flex gap-2">
                   {['All', 'A - Exceptional', 'Over Budget', 'Zero Increment'].map(f => (
                     <button key={f} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50">{f}</button>
                   ))}
                </div>
             </div>
             <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                <Download size={14} /> Export CSV
             </button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                   <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-5">Employee</th>
                      <th className="px-6 py-5 text-right">Current Gross</th>
                      <th className="px-6 py-5 text-center">Rating</th>
                      <th className="px-6 py-5 text-center">Suggested %</th>
                      <th className="px-6 py-5 text-center">Actual %</th>
                      <th className="px-6 py-5 text-right">Inc. Amount</th>
                      <th className="px-6 py-5 text-right">New Gross</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {worksheet.map(row => {
                     const inc = Math.round(row.currentGross * row.actualPerc / 100);
                     const isOver = row.actualPerc > row.suggestedPerc;
                     return (
                       <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                             <div>
                                <p className="font-bold text-gray-800">{row.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{row.id} • {row.dept}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-gray-400">{row.currentGross.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                             <span className={`px-2 py-1 rounded font-black text-xs ${
                               row.rating === 'A' ? 'bg-green-100 text-green-700' :
                               row.rating === 'B' ? 'bg-blue-100 text-blue-700' :
                               'bg-gray-100 text-gray-600'
                             }`}>{row.rating}</span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-400">{row.suggestedPerc}%</td>
                          <td className="px-6 py-4">
                             <div className="flex justify-center">
                                <div className="relative">
                                   <input 
                                     type="number" 
                                     className={`w-20 text-center px-2 py-1 border rounded-lg font-black ${isOver ? 'border-red-300 text-red-600 bg-red-50' : 'border-gray-200 text-primary'}`}
                                     value={row.actualPerc}
                                     onChange={(e) => handlePercChange(row.id, Number(e.target.value))}
                                   />
                                   {isOver && <AlertTriangle size={12} className="absolute -right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-black text-red-500">+{inc.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-mono font-black text-primary">{(row.currentGross + inc).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-2 text-gray-300 hover:text-primary transition-all"><MoreVertical size={16}/></button>
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Increment Cycles</h2>
          <p className="text-sm text-gray-500">Manage performance-based pay revisions and budget allocation</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Cycle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-5">Cycle Name</th>
              <th className="px-6 py-5 text-center">Effective Date</th>
              <th className="px-6 py-5 text-center">Employees</th>
              <th className="px-6 py-5 text-right">Total Budget</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_CYCLES.map(cycle => (
              <tr key={cycle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                   <p className="font-bold text-gray-800">{cycle.name}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">{cycle.id}</p>
                </td>
                <td className="px-6 py-4 text-center text-gray-500 font-medium">{cycle.effectiveDate}</td>
                <td className="px-6 py-4 text-center font-bold text-gray-700">{cycle.employees}</td>
                <td className="px-6 py-4 text-right">
                   <div className="flex flex-col items-end">
                      <span className="font-mono font-black text-primary">{formatPKR(cycle.budget)}</span>
                      <div className="w-24 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                         <div className="h-full bg-accent" style={{ width: `${(cycle.allocated/cycle.budget)*100}%` }} />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                     cycle.status === 'Published' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'
                   }`}>{cycle.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                      <button onClick={() => setView('WORKSHEET')} className="p-2 text-gray-400 hover:text-primary transition-all" title="Edit Worksheet"><Calculator size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-primary transition-all" title="Generate Letters"><FileText size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-primary transition-all"><MoreVertical size={18} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-bold">Initiate Review Cycle</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cycle Name</label>
                   <input type="text" defaultValue="Annual Review 2025" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date</label>
                      <input type="date" defaultValue="2025-01-01" className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget Pool (Annual)</label>
                      <input type="number" defaultValue={15000000} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm font-mono font-bold outline-none" />
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min %</label>
                      <input type="number" defaultValue={0} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default %</label>
                      <input type="number" defaultValue={10} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max %</label>
                      <input type="number" defaultValue={25} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm" />
                   </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                   <Info size={18} className="text-primary mt-0.5 shrink-0" />
                   <p className="text-[10px] text-primary/70 font-medium uppercase leading-relaxed tracking-tight">
                     Starting the cycle will populate the worksheet with all active employees and their latest performance ratings. suggested percentages will be applied as a baseline.
                   </p>
                </div>
             </div>
             <div className="p-6 bg-gray-50 border-t flex gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                <button onClick={() => { setIsCreateModalOpen(false); setView('WORKSHEET'); }} className="flex-[2] py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2">
                   <TrendingUp size={16} /> Launch Cycle
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
