
import React, { useState, useMemo } from 'react';
import { 
  Gift, Plus, Search, Filter, MoreVertical, 
  CheckCircle2, Calculator, Wallet, 
  ArrowUpRight, Download, Eye, FileText, 
  ChevronRight, AlertTriangle, Users, Building2,
  PieChart, Save, Send, X, Info, Settings,
  ShieldCheck, Percent, UserCheck, Trash2
} from 'lucide-react';

interface BonusRun {
  id: string;
  type: 'Festival' | 'Annual' | 'Project' | 'Quarterly' | 'One-time';
  period: string;
  employees: number;
  totalAmount: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Added to Payroll';
}

interface BonusWorksheetRow {
  id: string;
  name: string;
  dept: string;
  basicSalary: number;
  calculated: number;
  override: number | null;
  final: number;
  isTaxable: boolean;
}

const MOCK_RUNS: BonusRun[] = [
  { id: 'BNS-2025-001', type: 'Annual', period: 'Jan 2025', employees: 485, totalAmount: 12500000, status: 'Draft' },
  { id: 'BNS-2024-012', type: 'Festival', period: 'Dec 2024', employees: 420, totalAmount: 8400000, status: 'Added to Payroll' },
];

const MOCK_WORKSHEET: BonusWorksheetRow[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', dept: 'Engineering', basicSalary: 107500, calculated: 53750, override: null, final: 53750, isTaxable: true },
  { id: 'EMP-1002', name: 'Saira Ahmed', dept: 'HR', basicSalary: 62500, calculated: 31250, override: 40000, final: 40000, isTaxable: true },
  { id: 'EMP-1005', name: 'Mustafa Kamal', dept: 'Engineering', basicSalary: 275000, calculated: 137500, override: null, final: 137500, isTaxable: true },
  { id: 'EMP-1004', name: 'Zainab Bibi', dept: 'Operations', basicSalary: 46000, calculated: 23000, override: null, final: 23000, isTaxable: true },
  { id: 'EMP-1003', name: 'Umar Farooq', dept: 'Sales', basicSalary: 22500, calculated: 11250, override: null, final: 11250, isTaxable: true },
];

export const BonusProcessing: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'CREATE' | 'WORKSHEET'>('LIST');
  const [worksheet, setWorksheet] = useState<BonusWorksheetRow[]>(MOCK_WORKSHEET);
  const [bonusType, setBonusType] = useState('Annual');
  const [ruleType, setRuleType] = useState('% Basic');
  const [ruleValue, setRuleValue] = useState(50);

  const stats = useMemo(() => {
    const total = worksheet.reduce((acc, curr) => acc + curr.final, 0);
    const taxImpact = total * 0.175; // Average simulated tax impact
    return { count: worksheet.length, total, taxImpact };
  }, [worksheet]);

  const handleOverrideChange = (id: string, val: string) => {
    const numVal = val === '' ? null : Number(val);
    setWorksheet(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, override: numVal, final: numVal ?? row.calculated };
      }
      return row;
    }));
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  if (view === 'CREATE') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => setView('LIST')} className="p-2 hover:bg-white rounded-full text-gray-400"><X size={20}/></button>
          <h2 className="text-2xl font-bold text-gray-800">Configure Bonus Run</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Settings size={14} /> Basic Configuration
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500">Bonus Type</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
                  value={bonusType}
                  onChange={(e) => setBonusType(e.target.value)}
                >
                  <option>Festival (Eid/Other)</option>
                  <option>Annual Performance</option>
                  <option>Project Completion</option>
                  <option>Quarterly Incentive</option>
                  <option>One-time Reward</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Payment Period</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none">
                    <option>Jan 2025</option>
                    <option>Feb 2025</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Effective Date</label>
                  <input type="date" defaultValue="2025-01-15" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Calculator size={14} /> Calculation Rule
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                  {['Fixed Amount', '% Basic', '% Gross', 'Custom'].map(r => (
                    <button 
                      key={r}
                      onClick={() => setRuleType(r)}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${ruleType === r ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Value</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={ruleValue}
                      onChange={(e) => setRuleValue(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">{ruleType.includes('%') ? '%' : 'PKR'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <UserCheck size={14} /> Eligibility Filters
            </h3>
            <div className="space-y-4">
              <EligibilityToggle label="Include All Employees" active={false} />
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500">Minimum Tenure (Months)</label>
                <input type="number" defaultValue={6} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none" />
              </div>
              <EligibilityToggle label="Confirmed Employees Only" active={true} />
              <EligibilityToggle label="Exclude Employees on Notice" active={true} />
              
              <div className="pt-4 border-t space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Prorate by Tenure</span>
                    <button className="w-8 h-4 bg-primary rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"/></button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Prorate by Attendance</span>
                    <button className="w-8 h-4 bg-gray-300 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"/></button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-primary"><Users size={20}/></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Projected Impact</p>
              <p className="text-lg font-black text-primary">~385 Employees • Estimated PKR 9.2M</p>
            </div>
          </div>
          <button 
            onClick={() => setView('WORKSHEET')}
            className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
          >
            Generate Worksheet <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'WORKSHEET') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('LIST')} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors">
              <X size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Annual Bonus Jan 2025</h2>
              <p className="text-sm text-gray-500 uppercase font-black tracking-widest text-primary/60">Computation Phase</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                <Save size={16} /> Save Draft
             </button>
             <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                <Send size={16} /> Submit For Review
             </button>
          </div>
        </div>

        {/* Summary Tracker */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Eligible Headcount</p>
             <h4 className="text-2xl font-black text-gray-800">{stats.count}</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payout Volume</p>
             <h4 className="text-2xl font-black text-primary">{formatPKR(stats.total)}</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. WHT Impact</p>
             <h4 className="text-2xl font-black text-red-500">{formatPKR(stats.taxImpact)}</h4>
          </div>
        </div>

        {/* Worksheet Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50/30">
             <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <input type="text" placeholder="Search by name or ID..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
                </div>
                <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"><Filter size={18}/></button>
             </div>
             <div className="flex items-center gap-4">
                <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                    <Download size={14} /> Export CSV
                </button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                   <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-5">Employee</th>
                      <th className="px-6 py-5 text-right">Basic Salary</th>
                      <th className="px-6 py-5 text-right">System Calc</th>
                      <th className="px-6 py-5 text-right">Manual Override</th>
                      <th className="px-6 py-5 text-right">Final Amount</th>
                      <th className="px-6 py-5 text-center">Taxable</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {worksheet.map(row => (
                     <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{row.name.charAt(0)}</div>
                              <div>
                                <p className="font-bold text-gray-800">{row.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{row.id} • {row.dept}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-400">{row.basicSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">{row.calculated.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <div className="flex justify-end">
                              <input 
                                type="number" 
                                className={`w-24 text-right px-2 py-1 border rounded-lg font-black text-xs ${row.override ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-gray-400'}`}
                                value={row.override ?? ''}
                                onChange={(e) => handleOverrideChange(row.id, e.target.value)}
                                placeholder="--"
                              />
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-black text-green-600">{formatPKR(row.final)}</td>
                        <td className="px-6 py-4 text-center">
                           <button className={`w-10 h-5 rounded-full relative transition-all ${row.isTaxable ? 'bg-primary' : 'bg-gray-200'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${row.isTaxable ? 'right-0.5' : 'left-0.5'}`} />
                           </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-gray-300 hover:text-red-500 transition-all "><Trash2 size={16}/></button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-4">
              <ShieldCheck size={28} className="text-green-600" />
              <div>
                 <h4 className="text-sm font-black text-green-900 uppercase">Batch Integrity Check</h4>
                 <p className="text-xs text-green-700">Calculations verified against tax residency status for all Pakistani employees.</p>
              </div>
           </div>
           <button className="px-10 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95">
              Inject to Jan Payroll Run
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bonus & Incentives</h2>
          <p className="text-sm text-gray-500">Manage bulk reward disbursements and performance pay</p>
        </div>
        <button 
          onClick={() => setView('CREATE')}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Bonus Run
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-5">Run ID</th>
              <th className="px-6 py-5">Type</th>
              <th className="px-6 py-5 text-center">Period</th>
              <th className="px-6 py-5 text-center">Employees</th>
              <th className="px-6 py-4 text-right">Total Amount</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_RUNS.map(run => (
              <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-primary">{run.id}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <Gift size={14} className="text-pink-500" />
                      <span className="font-bold text-gray-700">{run.type}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-center text-gray-500 font-medium">{run.period}</td>
                <td className="px-6 py-4 text-center font-bold text-gray-700">{run.employees}</td>
                <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(run.totalAmount)}</td>
                <td className="px-6 py-4 text-center">
                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
                     run.status === 'Added to Payroll' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 border-dashed'
                   }`}>{run.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                      <button onClick={() => setView('WORKSHEET')} className="p-2 text-gray-400 hover:text-primary transition-all" title="View Worksheet"><Eye size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-primary transition-all"><MoreVertical size={18} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 shadow-sm max-w-2xl">
        <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Incentive Policy Compliance</h4>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Bonus payments are subject to a separate calculation block in Jan 2025. Ensure "Is Taxable" is set according to FBR guidelines for your specific industry sector.
          </p>
        </div>
      </div>
    </div>
  );
};

const EligibilityToggle = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
     <span className="text-xs font-bold text-gray-600">{label}</span>
     <button className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-primary' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
     </button>
  </div>
);
