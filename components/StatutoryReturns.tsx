
import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, Download, Printer, Search, 
  Filter, ChevronRight, ChevronDown, CheckCircle2, 
  AlertCircle, Building2, Landmark, ListChecks, 
  ExternalLink, Info, Calculator
} from 'lucide-react';

type ReturnType = 'EOBI' | 'PESSI' | 'TAX' | 'PF';
type ReturnStatus = 'Pending' | 'Generated' | 'Paid' | 'Overdue';

interface StatutoryReturn {
  id: string;
  type: ReturnType;
  typeName: string;
  period: string;
  dueDate: string;
  status: ReturnStatus;
  amount: number;
}

const MOCK_RETURNS: StatutoryReturn[] = [
  { id: 'RET-001', type: 'EOBI', typeName: 'EOBI Monthly Contribution', period: 'Jan 2025', dueDate: 'Feb 15, 2025', status: 'Generated', amount: 234000 },
  { id: 'RET-002', type: 'PESSI', typeName: 'Provident Social Security', period: 'Jan 2025', dueDate: 'Feb 15, 2025', status: 'Pending', amount: 185000 },
  { id: 'RET-003', type: 'TAX', typeName: 'Income Tax Withholding (Annex-C)', period: 'Jan 2025', dueDate: 'Feb 15, 2025', status: 'Generated', amount: 3500000 },
  { id: 'RET-004', type: 'PF', typeName: 'Provident Fund Monthly Deposit', period: 'Jan 2025', dueDate: 'Feb 10, 2025', status: 'Paid', amount: 5550000 },
];

export const StatutoryReturns: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('RET-001');
  const [search, setSearch] = useState('');

  const getStatusStyle = (status: ReturnStatus) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Generated': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Paid': return 'bg-green-50 text-green-600 border-green-200';
      case 'Overdue': return 'bg-red-50 text-red-600 border-red-200 animate-pulse';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Pakistan Statutory Returns</h2>
          <p className="text-sm text-gray-500">Manage monthly filings for EOBI, Social Security, and Income Tax</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Download size={18} /> Annual Summary
          </button>
        </div>
      </div>

      {/* Main Registry Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/30 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search returns..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 transition-all w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
              <Filter size={14} /> Period: Jan 2025
            </button>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> Compliant with FBR/EOBI 2024-25 Rules
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5 w-10"></th>
                <th className="px-6 py-5">Return Type</th>
                <th className="px-6 py-5 text-center">Period</th>
                <th className="px-6 py-5 text-center">Due Date</th>
                <th className="px-6 py-5 text-right">Liability</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RETURNS.map((ret) => {
                const isExpanded = expandedId === ret.id;
                return (
                  <React.Fragment key={ret.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${isExpanded ? 'bg-primary/[0.02]' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : ret.id)}
                    >
                      <td className="px-6 py-4">
                        {isExpanded ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-gray-300" />}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">{ret.typeName}</td>
                      <td className="px-6 py-4 text-center text-gray-500 font-medium">{ret.period}</td>
                      <td className="px-6 py-4 text-center text-gray-500 font-medium">{ret.dueDate}</td>
                      <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(ret.amount)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(ret.status)}`}>
                          {ret.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-300 hover:text-primary transition-all">
                           <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && ret.type === 'EOBI' && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={7} className="px-12 py-8 border-b">
                           <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                              <div className="p-6 border-b bg-gray-50/30 flex items-center justify-between">
                                 <div>
                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">EOBI Detailed Contribution Ledger</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Jan 2025 • Total Employees: 325</p>
                                 </div>
                                 <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm transition-all">
                                      <Printer size={14} /> Print Challan
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 shadow-md transition-all">
                                      <FileText size={14} /> Generate EOBI Bulk File
                                    </button>
                                 </div>
                              </div>
                              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead className="sticky top-0 bg-white border-b z-10">
                                    <tr className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                      <th className="px-6 py-4">Employee EOBI No.</th>
                                      <th className="px-6 py-4">Full Name</th>
                                      <th className="px-6 py-4 text-right">Applicable Wage</th>
                                      <th className="px-6 py-4 text-right">EE Share (1%)</th>
                                      <th className="px-6 py-4 text-right">ER Share (5%)</th>
                                      <th className="px-6 py-4 text-right">Total Payable</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50 font-medium">
                                    {[
                                      { no: 'ABC12345678', name: 'Arsalan Khan', wage: 32000, ee: 320, er: 1600 },
                                      { no: 'XYZ98765432', name: 'Saira Ahmed', wage: 32000, ee: 320, er: 1600 },
                                      { no: 'LMN55667788', name: 'Mustafa Kamal', wage: 32000, ee: 320, er: 1600 },
                                      { no: 'DEF44332211', name: 'Zainab Bibi', wage: 32000, ee: 320, er: 1600 },
                                    ].map((emp, i) => (
                                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-primary font-bold">{emp.no}</td>
                                        <td className="px-6 py-4 text-gray-700">{emp.name}</td>
                                        <td className="px-6 py-4 text-right font-mono">{emp.wage.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-mono text-red-500">{emp.ee}</td>
                                        <td className="px-6 py-4 text-right font-mono text-blue-600">{emp.er}</td>
                                        <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{(emp.ee + emp.er).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                    <tr className="bg-gray-50 italic text-gray-400">
                                      <td colSpan={6} className="px-6 py-3 text-center text-[10px]">... 321 more employee records</td>
                                    </tr>
                                  </tbody>
                                  <tfoot className="bg-gray-100 font-black">
                                    <tr>
                                      <td colSpan={2} className="px-6 py-5 text-right text-[10px] uppercase tracking-widest">Total Monthly Liability</td>
                                      <td className="px-6 py-5 text-right font-mono">10,400,000</td>
                                      <td className="px-6 py-5 text-right font-mono text-red-600">104,000</td>
                                      <td className="px-6 py-5 text-right font-mono text-blue-700">520,000</td>
                                      <td className="px-6 py-5 text-right font-mono text-primary text-base underline decoration-double">624,000</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Localized Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck size={20}/></div>
              <h3 className="font-black text-sm uppercase tracking-tight text-gray-700">Tax Withholding Assistant</h3>
           </div>
           <p className="text-xs text-gray-500 leading-relaxed">
             Automated Annex-C generation for FBR e-filing. Ensure all NTNs are verified against the Active Taxpayers List (ATL) before period closure.
           </p>
           <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Filer Count: 285</span>
              <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                Generate FBR CSV <ChevronRight size={12}/>
              </button>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Landmark size={20}/></div>
              <h3 className="font-black text-sm uppercase tracking-tight text-gray-700">Provident Fund Registry</h3>
           </div>
           <p className="text-xs text-gray-500 leading-relaxed">
             Track voluntary and mandatory contributions. Automated interest rate application and loan set-off against PF balances.
           </p>
           <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Members: 310</span>
              <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                Annual Certificate <ChevronRight size={12}/>
              </button>
           </div>
        </div>
      </div>

      {/* Help Banner */}
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
        <AlertCircle size={20} className="text-orange-500 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[11px] text-orange-700 font-bold uppercase tracking-tight">Important Notice</p>
          <p className="text-xs text-orange-600 leading-relaxed font-medium">
            Effective July 2024, the minimum wage for EOBI calculation has been adjusted to <strong>PKR 32,000</strong>. Our calculation engine has automatically updated the base caps for the January 2025 cycle.
          </p>
        </div>
      </div>
    </div>
  );
};
