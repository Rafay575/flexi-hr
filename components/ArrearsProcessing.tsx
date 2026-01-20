
import React, { useState, useMemo } from 'react';
import { 
  History, User, Calendar, Calculator, ArrowRight, 
  CheckCircle2, AlertCircle, Info, Download, 
  Trash2, Plus, Wallet, ShieldCheck, TrendingUp
} from 'lucide-react';

interface ArrearMonth {
  month: string;
  oldValue: number;
  newValue: number;
  diff: number;
  taxImpact: number;
  netDiff: number;
}

export const ArrearsProcessing: React.FC = () => {
  const [empId, setEmpId] = useState('');
  const [changeType, setChangeType] = useState('Increment');
  const [effectiveFrom, setEffectiveFrom] = useState('2024-10');
  const [newValue, setNewValue] = useState(215000);
  const [isCalculated, setIsCalculated] = useState(false);

  // Mock calculation logic
  const arrearsData = useMemo(() => {
    if (!isCalculated) return null;
    
    const oldGross = 180000;
    const diffPerMonth = newValue - oldGross;
    const months = ['Oct 2024', 'Nov 2024', 'Dec 2024'];
    
    const monthBreakdown: ArrearMonth[] = months.map(m => ({
      month: m,
      oldValue: oldGross,
      newValue: newValue,
      diff: diffPerMonth,
      taxImpact: diffPerMonth * 0.15,
      netDiff: diffPerMonth * 0.85
    }));

    const totalGross = monthBreakdown.reduce((a, b) => a + b.diff, 0);
    const totalTax = monthBreakdown.reduce((a, b) => a + b.taxImpact, 0);
    const totalNet = totalGross - totalTax;

    return { monthBreakdown, totalGross, totalTax, totalNet };
  }, [isCalculated, newValue]);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Arrears Processing</h2>
          <p className="text-sm text-gray-500">Calculate and process backdated salary adjustments and corrections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Arrear Configuration</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Employee</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="EMP-1001 (Arsalan Khan)" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Change Scenario</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                  value={changeType}
                  onChange={(e) => setChangeType(e.target.value)}
                >
                  <option>Backdated Increment</option>
                  <option>Allowance Correction</option>
                  <option>Grade Re-evaluation</option>
                  <option>Statutory Fix</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Effective From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="month" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">New Monthly Gross (PKR)</label>
                <div className="relative">
                   <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <input 
                    type="number" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-primary outline-none"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                   />
                </div>
              </div>

              <button 
                onClick={() => setIsCalculated(true)}
                className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Calculator size={18} /> Calculate Arrears
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
             <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
               System automatically compares the new values against historical payroll cycles to derive the difference. Tax is recalculated per month based on the original year's slabs.
             </p>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          {!isCalculated ? (
            <div className="h-full min-h-[400px] bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-12">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <History size={40} strokeWidth={1} />
               </div>
               <h4 className="text-lg font-bold text-gray-400">Waiting for Inputs</h4>
               <p className="text-sm text-gray-400 max-w-xs mt-2">Enter employee details and the effective change to see the month-by-month arrear breakdown.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
               {/* Arrear Result Card */}
               <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-primary p-6 text-white flex items-end justify-between">
                     <div>
                        <p className="text-accent text-[10px] font-black uppercase tracking-[2px] mb-1">Total Net Arrears Payable</p>
                        <h3 className="text-4xl font-black">{formatPKR(arrearsData?.totalNet || 0)}</h3>
                        <p className="text-[10px] text-white/50 font-bold uppercase mt-2">Jan 2025 Payroll Injection</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-white/40 uppercase font-black">Gross Impact</p>
                        <p className="text-xl font-bold">{formatPKR(arrearsData?.totalGross || 0)}</p>
                     </div>
                  </div>

                  <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Monthly Variance breakdown</h4>
                        <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                           <Download size={12} /> Export CSV
                        </button>
                     </div>

                     <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead>
                              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                 <th className="px-4 py-3">Month</th>
                                 <th className="px-4 py-3 text-right">Original Gross</th>
                                 <th className="px-4 py-3 text-right">Revised Gross</th>
                                 <th className="px-4 py-3 text-right">Diff (Gross)</th>
                                 <th className="px-4 py-3 text-right">Tax (Adj)</th>
                                 <th className="px-4 py-3 text-right font-black">Net Diff</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 font-medium">
                              {arrearsData?.monthBreakdown.map((m, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                   <td className="px-4 py-3 font-bold text-gray-700">{m.month}</td>
                                   <td className="px-4 py-3 text-right text-gray-400 font-mono">{m.oldValue.toLocaleString()}</td>
                                   <td className="px-4 py-3 text-right text-primary font-mono">{m.newValue.toLocaleString()}</td>
                                   <td className="px-4 py-3 text-right text-green-600 font-bold">+{m.diff.toLocaleString()}</td>
                                   <td className="px-4 py-3 text-right text-red-400">-{m.taxImpact.toLocaleString()}</td>
                                   <td className="px-4 py-3 text-right font-mono font-black text-gray-800">{m.netDiff.toLocaleString()}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     <div className="grid grid-cols-2 gap-8 pt-4 border-t">
                        <div className="space-y-4">
                           <h5 className="text-[10px] font-black uppercase text-gray-400">Component Breakdown</h5>
                           <div className="space-y-2">
                              <div className="flex justify-between text-xs font-bold text-gray-600">
                                 <span>Basic Salary Arrears</span>
                                 <span className="font-mono text-primary">{formatPKR(52500)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-bold text-gray-600">
                                 <span>HRA Arrears</span>
                                 <span className="font-mono text-primary">{formatPKR(23625)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-bold text-gray-600">
                                 <span>PF Employee Adj.</span>
                                 <span className="font-mono text-red-500">-{formatPKR(4373)}</span>
                              </div>
                           </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={16} className="text-green-500" />
                              <span className="text-[10px] font-black uppercase text-gray-700">Audit Status</span>
                           </div>
                           <p className="text-[10px] text-gray-500 italic">"Arrear calculation verified against G18 structure. Tax recalculated per FBR 24-25 monthly slabs."</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                     <button 
                        onClick={() => setIsCalculated(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                     >
                        Discard
                     </button>
                     <button className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 active:scale-95 transition-all">
                        <Plus size={16} /> Add to Jan Payroll
                     </button>
                  </div>
               </div>

               {/* Processed Batch Preview */}
               <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={20}/></div>
                     <div>
                        <h5 className="text-sm font-bold text-gray-800 leading-tight">Ready for Injection</h5>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Voucher ID: ARR-2025-01-PK</p>
                     </div>
                  </div>
                  <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                     View Adjustment Voucher <ArrowRight size={12} />
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
