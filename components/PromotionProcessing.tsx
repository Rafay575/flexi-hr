
import React, { useState, useMemo } from 'react';
/* Added missing icon imports Filter, Eye, MoreVertical */
import { 
  ArrowUpCircle, Search, User, Briefcase, Calendar, 
  Layers, Calculator, History, CheckCircle2, 
  ArrowRight, Info, TrendingUp, X, Save, Send,
  ChevronRight, AlertCircle, FileText, Filter, Eye, MoreVertical
} from 'lucide-react';

interface PromotionRequest {
  id: string;
  empId: string;
  name: string;
  currentGrade: string;
  targetGrade: string;
  effectiveDate: string;
  status: 'Draft' | 'Pending' | 'Approved';
  grossChange: number;
}

const MOCK_PROMOTIONS: PromotionRequest[] = [
  { id: 'PROM-9901', empId: 'EMP-1001', name: 'Arsalan Khan', currentGrade: 'G17', targetGrade: 'G18', effectiveDate: '2025-01-01', status: 'Draft', grossChange: 35000 },
  { id: 'PROM-9905', empId: 'EMP-1102', name: 'Saira Ahmed', currentGrade: 'G14', targetGrade: 'G15', effectiveDate: '2024-12-01', status: 'Pending', grossChange: 15000 },
];

export const PromotionProcessing: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [isBackdated, setIsBackdated] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<string>('');

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  if (view === 'FORM') {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => setView('LIST')} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Process Career Progression</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-8">
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <User size={14} /> Employee Context
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by ID or Name..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                    value={selectedEmp}
                    onChange={(e) => setSelectedEmp(e.target.value)}
                  />
                </div>
                {selectedEmp && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10 animate-in zoom-in-95">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase">Current Grade</p>
                      <p className="text-xs font-black text-primary">G17 - Senior</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase">Designation</p>
                      <p className="text-xs font-black text-primary">Lead Engineer</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase">Current Gross</p>
                      <p className="text-xs font-black text-primary">PKR 180,000</p>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-6 pt-4 border-t border-dashed">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <TrendingUp size={14} /> Promotion Target
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">New Grade</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none">
                      <option>G18 - Principal</option>
                      <option>G19 - Director</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">New Designation</label>
                    <input type="text" defaultValue="Principal Software Engineer" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Effective Date</label>
                    <input type="date" defaultValue="2025-01-01" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Salary Strategy</label>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Apply Template</button>
                       <button className="flex-1 py-2 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200">Custom Value</button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pt-4 border-t border-dashed space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <History size={18} className="text-orange-500" />
                       <div>
                          <p className="text-xs font-bold text-gray-700 uppercase">Calculate Backdated Arrears</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Auto-compute differences from effective date</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsBackdated(!isBackdated)}
                      className={`w-10 h-5 rounded-full relative transition-all ${isBackdated ? 'bg-orange-500' : 'bg-gray-200'}`}
                    >
                       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isBackdated ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                 </div>
                 {isBackdated && (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                       <AlertCircle size={16} className="text-orange-600 mt-0.5" />
                       <p className="text-[10px] text-orange-700 font-medium leading-relaxed uppercase tracking-tight">
                         System will calculate the gross difference for Dec 2024 and Jan 2025 and inject as "Arrears" in the next run.
                       </p>
                    </div>
                 )}
              </section>
            </div>
          </div>

          {/* Right: Preview Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
               <div className="p-6 border-b bg-gray-50/50">
                  <h4 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Component Comparison</h4>
               </div>
               <table className="w-full text-left text-xs">
                  <thead>
                     <tr className="bg-gray-50 border-b font-black text-gray-400 uppercase tracking-tighter">
                        <th className="px-6 py-3">Pay Element</th>
                        <th className="px-6 py-3 text-right">Current (G17)</th>
                        <th className="px-6 py-3 text-right text-primary">New (G18)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                     <tr>
                        <td className="px-6 py-4">Basic Salary</td>
                        <td className="px-6 py-4 text-right">90,000</td>
                        <td className="px-6 py-4 text-right font-black text-primary">107,500</td>
                     </tr>
                     <tr>
                        <td className="px-6 py-4">House Rent (HRA)</td>
                        <td className="px-6 py-4 text-right">40,500</td>
                        <td className="px-6 py-4 text-right font-black text-primary">48,375</td>
                     </tr>
                     <tr>
                        <td className="px-6 py-4">Utilities</td>
                        <td className="px-6 py-4 text-right">9,000</td>
                        <td className="px-6 py-4 text-right font-black text-primary">10,750</td>
                     </tr>
                     <tr className="bg-primary/5">
                        <td className="px-6 py-4 uppercase text-[10px] font-black text-primary tracking-widest">Monthly Gross</td>
                        <td className="px-6 py-4 text-right text-gray-400">180,000</td>
                        <td className="px-6 py-4 text-right font-black text-primary">215,000</td>
                     </tr>
                  </tbody>
               </table>
               <div className="p-6 bg-green-50 border-t border-green-100">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Total Monthly Impact</span>
                     <span className="text-lg font-black text-green-600">+PKR 35,000</span>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
               <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
               <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
                 Applying the <strong>Principal Engineer (G18)</strong> template will automatically update all allowances to their respective percentages of the new basic salary.
               </p>
            </div>

            <div className="pt-6 border-t flex flex-col gap-3">
               <button className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Send size={18} /> Submit for Approval
               </button>
               <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50">
                 Save as Draft
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Promotions & Progression</h2>
          <p className="text-sm text-gray-500">Manage organizational ladder movements and grade scaling</p>
        </div>
        <button 
          onClick={() => setView('FORM')}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <ArrowUpCircle size={18} /> Initiate Promotion
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50/30 flex items-center justify-between">
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Filter promotions..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
                 <Filter size={14} /> Status: All
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Request ID</th>
                <th className="px-6 py-5">Employee</th>
                <th className="px-6 py-5 text-center">Movement</th>
                <th className="px-6 py-5 text-center">Effective Date</th>
                <th className="px-6 py-5 text-right">Gross Change</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PROMOTIONS.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">{req.name.charAt(0)}</div>
                       <div>
                         <p className="font-bold text-gray-800 leading-none mb-1">{req.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{req.empId}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-500 border">{req.currentGrade}</span>
                       <ArrowRight size={14} className="text-gray-300" />
                       <span className="text-[10px] font-black bg-primary/10 px-2 py-0.5 rounded text-primary border border-primary/20">{req.targetGrade}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 font-medium">
                    {req.effectiveDate}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-black text-green-600">
                    +{formatPKR(req.grossChange)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      req.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' : 
                      req.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-gray-50 text-gray-400 border-gray-200 border-dashed'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-gray-400 hover:text-primary transition-all"><Eye size={18} /></button>
                       <button className="p-2 text-gray-400 hover:text-primary transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={20}/></div>
            <div>
               <h5 className="text-sm font-bold text-gray-800 leading-tight">Career progression audit log is active</h5>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">All structural movements are documented for yearly manpower reports.</p>
            </div>
         </div>
         <button className="text-[10px] font-black text-primary uppercase hover:underline">Download Year Log</button>
      </div>
    </div>
  );
};
