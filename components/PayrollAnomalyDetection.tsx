
import React, { useState } from 'react';
import { 
  ShieldAlert, AlertCircle, AlertTriangle, CheckCircle2, 
  Search, Filter, ChevronRight, MoreVertical, 
  Trash2, Eye, ShieldCheck, Zap, Settings2,
  RefreshCw, Info, User, Calculator, ArrowRight,
  Target, BarChart3, Database
} from 'lucide-react';

type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

interface Anomaly {
  id: string;
  title: string;
  employee: string;
  empId: string;
  description: string;
  severity: Severity;
  confidence: number;
  category: string;
}

const MOCK_ANOMALIES: Anomaly[] = [
  { id: 'AN-001', title: 'Suspicious OT Spike', employee: 'Kamran Shah', empId: 'EMP-1022', description: 'Overtime exceeds 80 hours in a single month. 250% higher than trailing 3-month average.', severity: 'HIGH', confidence: 98, category: 'Attendance' },
  { id: 'AN-002', title: 'IBAN Country Mismatch', employee: 'Sara Khan', empId: 'EMP-1102', description: 'Bank account country code (AE) does not match local payroll jurisdiction (PK).', severity: 'HIGH', confidence: 100, category: 'Bank' },
  { id: 'AN-003', title: 'Negative Net Payout', employee: 'Hassan Raza', empId: 'EMP-1089', description: 'Multiple ad-hoc deductions resulting in negative net salary of PKR 5,400.', severity: 'HIGH', confidence: 100, category: 'Financial' },
  { id: 'AN-004', title: 'Ghost Employee Flag', employee: 'Unknown Record', empId: 'EMP-9999', description: 'Payment record found without corresponding entry in active HR master data.', severity: 'HIGH', confidence: 92, category: 'Security' },
  { id: 'AN-005', title: 'Salary Double-Dip', employee: 'Mustafa Kamal', empId: 'EMP-1005', description: 'Two identical base salary components detected in a single run.', severity: 'MEDIUM', confidence: 85, category: 'Duplicate' },
  { id: 'AN-006', title: 'Tax Slab Jump', employee: 'Arsalan Khan', empId: 'EMP-1001', description: 'Recent increment pushed employee into 35% slab. Net take-home increased by only 2%.', severity: 'MEDIUM', confidence: 88, category: 'Tax' },
  { id: 'AN-007', title: 'Manual Override Bias', employee: 'System-wide', empId: 'DEPT-ENG', description: 'Higher than usual manual overrides (15 cases) in Engineering department compared to Org avg.', severity: 'MEDIUM', confidence: 75, category: 'Audit' },
  { id: 'AN-008', title: 'CNIC Expiry Alert', employee: 'Zainab Bibi', empId: 'EMP-1004', description: 'Statutory ID on file is expired. May affect future tax filing.', severity: 'LOW', confidence: 100, category: 'Compliance' },
  { id: 'AN-009', title: 'Rounding Discrepancy', employee: 'Umar Farooq', empId: 'EMP-1003', description: 'Total gross sum differs by PKR 0.45 from component aggregate.', severity: 'LOW', confidence: 60, category: 'System' },
  { id: 'AN-010', title: 'Unusual Dept Swap', employee: 'Ahmed Raza', empId: 'EMP-1104', description: 'Employee cost center changed twice within the same cycle.', severity: 'LOW', confidence: 70, category: 'Structure' },
];

const RULES = [
  { rule: 'Trailling OT Variance', threshold: '> 50% Avg', status: 'Active' },
  { rule: 'Net Pay Floor', threshold: '< PKR 0', status: 'Active' },
  { rule: 'Cross-Bank Country Check', threshold: 'Mismatch', status: 'Active' },
  { rule: 'High Value Bonus', threshold: '> 200% Basic', status: 'Paused' },
  { rule: 'Duplicate Bank Acc', threshold: 'Exact Match', status: 'Active' },
];

export const PayrollAnomalyDetection: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState('Jan 2025 (v1.2)');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const highSeverity = MOCK_ANOMALIES.filter(a => a.severity === 'HIGH');
  const medSeverity = MOCK_ANOMALIES.filter(a => a.severity === 'MEDIUM');
  const lowSeverity = MOCK_ANOMALIES.filter(a => a.severity === 'LOW');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              Anomaly Detection
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-indigo-200">AI PRO</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">Scanning current batch for financial irregularities and fraud risk</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedRun}
              onChange={(e) => setSelectedRun(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 appearance-none min-w-[200px]"
            >
              <option>Jan 2025 (v1.2)</option>
              <option>Jan 2025 (v1.1)</option>
              <option>Dec 2024 Final</option>
            </select>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* HIGH SEVERITY CARDS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-red-500 rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-800">Critical Anomalies ({highSeverity.length})</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {highSeverity.map(anom => (
            <div key={anom.id} className="bg-white p-6 rounded-3xl shadow-xl border border-red-100 flex flex-col justify-between group hover:border-red-300 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest">{anom.category}</span>
                    <h4 className="text-lg font-black text-gray-800">{anom.title}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase">AI Confidence</p>
                    <p className="text-sm font-black text-primary">{anom.confidence}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center font-black text-xs text-primary shadow-sm">{anom.employee.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-black text-gray-700 leading-none">{anom.employee}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{anom.empId}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {anom.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center gap-2">
                    <Target size={14} /> Investigate
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Dismiss
                  </button>
                </div>
                <button className="p-2 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all" title="Mark as Valid">
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MEDIUM & LOW LIST */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-4 bg-orange-400 rounded-full" />
                 <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Medium Severity ({medSeverity.length})</h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase hover:underline">Batch Action</button>
            </div>
            <div className="divide-y divide-gray-50">
              {medSeverity.map(anom => (
                <div key={anom.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl"><AlertTriangle size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{anom.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{anom.employee} • {anom.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-gray-300 italic">{anom.confidence}% Conf.</span>
                     <button className="p-2 text-gray-300 hover:text-primary transition-all"><ArrowRight size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden opacity-80">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-4 bg-green-400 rounded-full" />
                 <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Low Severity ({lowSeverity.length})</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {lowSeverity.map(anom => (
                <div key={anom.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="p-2 bg-green-50 text-green-500 rounded-lg"><Info size={16}/></div>
                    <p className="font-bold text-gray-700 text-xs">{anom.title}</p>
                  </div>
                  <button className="text-[9px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded">Quick Resolve</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETECTION RULES PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                 <Zap size={16} /> Dynamic Scanning Rules
               </h3>
               <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Settings2 size={18}/></button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
               <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                     <tr>
                        <th className="px-4 py-3">Audit Rule</th>
                        <th className="px-4 py-3">Threshold</th>
                        <th className="px-4 py-3 text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                     {RULES.map((r, i) => (
                       <tr key={i} className="hover:bg-gray-50/50 transition-all">
                          <td className="px-4 py-3 font-bold text-gray-700">{r.rule}</td>
                          <td className="px-4 py-3"><span className="text-[10px] font-black text-primary uppercase">{r.threshold}</span></td>
                          <td className="px-4 py-3 text-right">
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${r.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{r.status}</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <button className="w-full py-3 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all border border-primary/10">
               Configure Rule Matrix
            </button>
          </div>

          <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group flex flex-col justify-between min-h-[250px]">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-xl"><RefreshCw size={24} className="text-accent" /></div>
                   <h3 className="text-lg font-black uppercase tracking-tight">Recurrent Patterns</h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                   The system has identified 4 recurring anomalies linked to <span className="text-accent font-bold">Manual Bonus Entries</span> from the Sales department. 
                </p>
             </div>
             <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-2">
                Generate Audit Memo <ChevronRight size={14} />
             </button>
             <BarChart3 className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>

      {/* FOOTER INTELLIGENCE */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
         <ShieldCheck size={28} className="text-blue-600 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Scoping Integrity Protocol</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
               PayEdge Anomaly Engine v4.2 scans for 48 distinct fraud markers including bank churn, phantom records, and tax manipulation. All scan results are hashed and logged in the non-editable <span className="underline font-bold cursor-pointer">Security Audit Trail</span>.
            </p>
         </div>
      </div>
    </div>
  );
};
