
import React, { useState } from 'react';
import { 
  Timer, 
  ShieldAlert, 
  ChevronDown, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  RefreshCcw, 
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Undo2
} from 'lucide-react';

type PenaltyDeduction = 'NONE' | 'MINUTES_15' | 'MINUTES_30' | 'HALF_DAY' | 'FULL_DAY' | 'PROPORTIONAL';

interface PenaltyTier {
  id: string;
  min: number;
  max: number;
  label: string;
  deduction: PenaltyDeduction;
}

export const GracePenaltiesConfig: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('Standard Office Policy');
  const [enableQuota, setEnableQuota] = useState(true);
  
  const [lateTiers, setLateTiers] = useState<PenaltyTier[]>([
    { id: '1', min: 1, max: 15, label: 'Warning', deduction: 'NONE' },
    { id: '2', min: 16, max: 30, label: 'Minor', deduction: 'MINUTES_15' },
    { id: '3', min: 31, max: 60, label: 'Moderate', deduction: 'MINUTES_30' },
    { id: '4', min: 61, max: 120, label: 'Severe', deduction: 'HALF_DAY' },
    { id: '5', min: 121, max: 999, label: 'Very Severe', deduction: 'FULL_DAY' },
  ]);

  const [earlyTiers, setEarlyTiers] = useState<PenaltyTier[]>([
    { id: '1', min: 1, max: 10, label: 'Warning', deduction: 'NONE' },
    { id: '2', min: 11, max: 30, label: 'Minor Exit', deduction: 'MINUTES_15' },
    { id: '3', min: 31, max: 90, label: 'Early Leaving', deduction: 'HALF_DAY' },
  ]);

  const DEDUCTION_LABELS: Record<PenaltyDeduction, string> = {
    NONE: 'No Deduction',
    MINUTES_15: '15 min salary',
    MINUTES_30: '30 min salary',
    HALF_DAY: 'Half day',
    FULL_DAY: 'Full day',
    PROPORTIONAL: 'Proportional'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Timer className="text-[#3E3B6F]" size={28} /> Grace & Penalties
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Configure threshold-based arrival logic and financial deductions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50 group transition-all">
            <span className="text-xs font-bold text-[#3E3B6F] mr-2">{selectedPolicy}</span>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-[#3E3B6F]" />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* GRACE CONFIGURATION */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Clock size={18} className="text-[#3E3B6F]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Grace Configuration</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Late Grace</label>
                  <div className="relative">
                    <input type="number" defaultValue="15" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] outline-none focus:ring-2 focus:ring-[#3E3B6F]/10" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">MINS</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Early Grace</label>
                  <div className="relative">
                    <input type="number" defaultValue="10" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] outline-none focus:ring-2 focus:ring-[#3E3B6F]/10" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">MINS</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Monthly Grace Quota</p>
                    <p className="text-[10px] text-gray-500 font-medium">Limit total allowed grace usage per month.</p>
                  </div>
                  <div 
                    onClick={() => setEnableQuota(!enableQuota)}
                    className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all ${enableQuota ? 'bg-[#3E3B6F]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${enableQuota ? 'translate-x-6' : 'translate-x-0 shadow-sm'}`} />
                  </div>
                </div>

                <div className={`space-y-4 transition-all duration-300 ${enableQuota ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Monthly Mins</p>
                        <input type="number" defaultValue="45" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Late Uses Allowed</p>
                        <input type="number" defaultValue="3" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none" />
                      </div>
                   </div>
                   <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <p className="text-[11px] text-indigo-700 italic font-medium leading-relaxed">
                        "Employee gets <span className="font-bold">45 min total grace</span>, usable up to <span className="font-bold">3 times</span> per month."
                      </p>
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grace Reset Cycle</label>
                 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 group cursor-pointer hover:border-[#3E3B6F]/30 transition-all">
                    <RefreshCcw size={18} className="text-[#3E3B6F]" />
                    <span className="text-xs font-bold text-gray-700">Reset on 1st of month</span>
                    <ChevronDown size={14} className="ml-auto text-gray-400 group-hover:text-[#3E3B6F]" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* PENALTY TIERS */}
        <div className="xl:col-span-2 space-y-8">
          {/* LATE ARRIVAL TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-fit">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" />
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Late Arrival Penalties</h3>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#3E3B6F] uppercase bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-all">
                <Plus size={14} /> Add Tier
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-4 w-16">Tier</th>
                    <th className="px-6 py-4">Late Range (Mins)</th>
                    <th className="px-6 py-4">Penalty</th>
                    <th className="px-6 py-4">Deduction</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lateTiers.map((tier) => (
                    <tr key={tier.id} className="group hover:bg-gray-50/80 transition-all">
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-gray-400">#{tier.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input type="number" defaultValue={tier.min} className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                          <span className="text-gray-300">—</span>
                          <input type="number" defaultValue={tier.max} className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input type="text" defaultValue={tier.label} className="bg-transparent border-b border-transparent focus:border-[#3E3B6F] text-xs font-bold text-gray-800 outline-none" />
                      </td>
                      <td className="px-6 py-4">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${
                           tier.deduction === 'NONE' ? 'bg-gray-100 text-gray-500' : 
                           tier.deduction.includes('MINUTES') ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                           'bg-red-50 text-red-600 border border-red-100'
                         }`}>
                           {tier.deduction !== 'NONE' && <DollarSign size={12} />}
                           {DEDUCTION_LABELS[tier.deduction]}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-300 hover:text-red-500 transition-all ">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EARLY DEPARTURE TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-fit">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Undo2 size={18} className="text-orange-500" />
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Early Departure Penalties</h3>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#3E3B6F] uppercase bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-all">
                <Plus size={14} /> Add Tier
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-4 w-16">Tier</th>
                    <th className="px-6 py-4">Early Range (Mins)</th>
                    <th className="px-6 py-4">Penalty</th>
                    <th className="px-6 py-4">Deduction</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {earlyTiers.map((tier) => (
                    <tr key={tier.id} className="group hover:bg-gray-50/80 transition-all">
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-gray-400">#{tier.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input type="number" defaultValue={tier.min} className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                          <span className="text-gray-300">—</span>
                          <input type="number" defaultValue={tier.max} className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input type="text" defaultValue={tier.label} className="bg-transparent border-b border-transparent focus:border-[#3E3B6F] text-xs font-bold text-gray-800 outline-none" />
                      </td>
                      <td className="px-6 py-4">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${
                           tier.deduction === 'NONE' ? 'bg-gray-100 text-gray-500' : 
                           tier.deduction.includes('MINUTES') ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                           'bg-red-50 text-red-600 border border-red-100'
                         }`}>
                           {tier.deduction !== 'NONE' && <DollarSign size={12} />}
                           {DEDUCTION_LABELS[tier.deduction]}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-300 hover:text-red-500 transition-all ">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACCUMULATION RULES */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-[#3E3B6F]/5 flex items-center gap-2">
              <Zap size={18} className="text-[#3E3B6F]" />
              <h3 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest">Accumulation Logic</h3>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-gray-700">Late Arrivals count as Absence</span>
                           <div className="flex items-center gap-3">
                              <input type="number" defaultValue="3" className="w-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-black py-2 outline-none" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uses</span>
                           </div>
                        </div>
                        <p className="text-[10px] text-gray-400 italic">"Once 3 late arrivals occur beyond grace, trigger 1 absence deduction."</p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-gray-700">Early Departures count as Absence</span>
                           <div className="flex items-center gap-3">
                              <input type="number" defaultValue="3" className="w-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-black py-2 outline-none" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uses</span>
                           </div>
                        </div>
                        <div className="p-4 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-2xl">
                          <p className="text-[11px] text-[#3E3B6F] font-bold italic">Example: 3 late arrivals = 1 casual leave deduction</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Combined Monthly Threshold</label>
                        <div className="relative">
                          <input type="number" defaultValue="120" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-red-600 outline-none" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">Total Mins</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                          If total late + early minutes exceed this value in a single month, trigger an automatic warning letter.
                        </p>
                     </div>
                     
                     <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                        <ShieldCheck className="text-indigo-600 shrink-0" size={18} />
                        <div>
                          <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-1">Payroll Sync</p>
                          <p className="text-[9px] text-indigo-600 font-medium">Accumulated penalties will be deducted in the next payroll cycle automatically.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER IMPACT PREVIEW */}
      <div className="bg-[#3E3B6F] rounded-3xl p-8 text-white shadow-2xl shadow-[#3E3B6F]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Timer size={160} />
         </div>
         <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3 mb-4 text-[#E8D5A3]">
               <AlertCircle size={24} />
               <h3 className="text-lg font-black uppercase tracking-widest">Simulation Summary</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
               Based on this configuration, <span className="text-[#E8D5A3] font-bold underline">Standard Office Policy</span> will now trigger deductions for arrivals after <span className="font-bold text-white uppercase tracking-wider">9:15 AM</span>. 
               The system estimates a <span className="font-bold text-[#E8D5A3]">3.2% improvement</span> in punctuality based on similar historical rule changes.
            </p>
         </div>
         <button className="relative z-10 px-8 py-4 bg-white text-[#3E3B6F] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            Run compliance test <ArrowRight size={16} />
         </button>
      </div>
    </div>
  );
};
