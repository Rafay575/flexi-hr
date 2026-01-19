
import React, { useState } from 'react';
import { 
  DollarSign, 
  ChevronDown, 
  Save, 
  GripVertical, 
  Settings2, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  Layers,
  Users
} from 'lucide-react';

type DeductionMode = 'LEAVE' | 'SALARY' | 'HYBRID' | 'NONE';

interface LeaveType {
  id: string;
  name: string;
}

export const DeductionRulesConfig: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('Standard Office Policy');
  const [mode, setMode] = useState<DeductionMode>('HYBRID');
  const [leavePriority, setLeavePriority] = useState<LeaveType[]>([
    { id: 'casual', name: 'Casual Leave' },
    { id: 'annual', name: 'Annual Leave' },
    { id: 'unpaid', name: 'Unpaid Leave (Auto-create)' }
  ]);

  const [exemptions, setExemptions] = useState({
    probation: true,
    firstDays: 30,
    management: false
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <DollarSign className="text-[#3E3B6F]" size={28} /> Deduction Rules
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Configure financial and leave impacts for attendance non-compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm cursor-pointer hover:bg-gray-50 group transition-all">
            <span className="text-xs font-bold text-[#3E3B6F] mr-2">{selectedPolicy}</span>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-[#3E3B6F]" />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* DEDUCTION MODE SELECTION */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Layers size={18} className="text-[#3E3B6F]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Deduction Strategy</h3>
            </div>
            <div className="p-6 space-y-3">
              {[
                { id: 'LEAVE', label: 'Leave Balance', desc: 'Deduct from available leave buckets' },
                { id: 'SALARY', label: 'Direct Salary', desc: 'Financial deduction from basic pay' },
                { id: 'HYBRID', label: 'Hybrid Logic', desc: 'Leave first, then salary if balance is zero' },
                { id: 'NONE', label: 'No Deduction', desc: 'Track anomalies only (compliance reporting)' }
              ].map(opt => (
                <label key={opt.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${mode === opt.id ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-50 hover:border-gray-100'}`} onClick={() => setMode(opt.id as DeductionMode)}>
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${mode === opt.id ? 'border-[#3E3B6F]' : 'border-gray-300'}`}>
                    {mode === opt.id && <div className="w-2.5 h-2.5 bg-[#3E3B6F] rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 tracking-tight leading-none mb-1">{opt.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#3E3B6F] rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} />
            </div>
            <h4 className="text-[10px] font-black text-[#E8D5A3] uppercase tracking-widest mb-4">Policy Impact Note</h4>
            <p className="text-xs font-medium leading-relaxed text-white/80 italic">
              "Hybrid mode ensures minimum financial stress for employees while maintaining attendance discipline through leave depletion."
            </p>
          </div>
        </div>

        {/* DETAILED SETTINGS */}
        <div className="xl:col-span-2 space-y-8">
          {/* LEAVE SETTINGS */}
          <div className={`bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all ${mode === 'SALARY' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={18} className="text-indigo-500" /> Leave Deduction Logic
              </h3>
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-widest">Priority Mapping</span>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Leave Priority Order (Drag to Reorder)</label>
                 <div className="space-y-2">
                    {leavePriority.map((leave, i) => (
                      <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#3E3B6F]/30 transition-all">
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-black text-gray-300 tabular-nums">{i + 1}</span>
                           <span className="text-sm font-bold text-gray-700">{leave.name}</span>
                        </div>
                        <GripVertical size={16} className="text-gray-300 cursor-grab group-hover:text-gray-400" />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">If Zero Balance Exists</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#3E3B6F] bg-[#3E3B6F]/5 transition-all text-left">
                       <span className="text-xs font-bold text-gray-800">Deduct from Salary</span>
                       <CheckCircle2 size={16} className="text-[#3E3B6F]" />
                    </button>
                    <button className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all text-left bg-white text-gray-400">
                       <span className="text-xs font-bold">Mark as Regularization Pending</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* SALARY SETTINGS */}
          <div className={`bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all ${mode === 'LEAVE' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" /> Salary Calculation Rules
              </h3>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Absence</p>
                        <div className="relative">
                          <input type="number" defaultValue="1.0" step="0.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-red-600 outline-none" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Days Pay</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Half Day</p>
                        <div className="relative">
                          <input type="number" defaultValue="0.5" step="0.25" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-red-600 outline-none" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Days Pay</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payroll Sync (PayEdge)</h4>
                           <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                              <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-bold text-gray-400 uppercase">Target Deduction Head</p>
                           <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl group cursor-pointer hover:border-[#3E3B6F]/30 transition-all">
                              <span className="text-xs font-bold text-gray-700">ATTN_PENALTY_BASIC</span>
                              <ChevronDown size={14} className="text-gray-400" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* EXEMPTIONS & WAIVERS */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-fit">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Waivers & Grace Scenarios</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Global Exemptions</h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <p className="text-xs font-bold text-gray-700">Probation Employees</p>
                           <p className="text-[9px] text-gray-400 font-medium">Auto-waive deductions for newcomers.</p>
                        </div>
                        <div className="w-8 h-4 bg-[#3E3B6F] rounded-full relative p-0.5 cursor-pointer" onClick={() => setExemptions({...exemptions, probation: !exemptions.probation})}>
                           <div className={`w-3 h-3 bg-white rounded-full transition-all ${exemptions.probation ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <p className="text-xs font-bold text-gray-700">Management Grade (M1+)</p>
                        </div>
                        <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                           <div className="w-3 h-3 bg-white rounded-full transition-all translate-x-0"></div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Monthly Grace Limits</h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-700">First X Absences (No Penalty)</p>
                        <input type="number" defaultValue="1" className="w-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-black p-1" />
                     </div>
                     <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-700">First X Late-ins (No Penalty)</p>
                        <input type="number" defaultValue="2" className="w-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-black p-1" />
                     </div>
                  </div>
               </div>
            </div>
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-3">
               <Info size={14} className="text-blue-500" />
               <p className="text-[10px] text-gray-500 font-medium italic">Waivers only apply to automated deductions. Manual adjustments remain possible by HR Admins.</p>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLIANCE WARNING */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
         <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle size={32} />
         </div>
         <div className="flex-1 space-y-2 text-center md:text-left">
            <h4 className="text-sm font-black text-orange-800 uppercase tracking-widest">Labor Law Restriction Alert</h4>
            <p className="text-xs text-orange-700 leading-relaxed font-medium">
               In <span className="font-bold">certain regions (e.g. European Union)</span>, direct salary deduction for attendance anomalies is restricted. Ensure your legal team has reviewed the <span className="font-bold text-orange-900 underline decoration-orange-300">"Direct Salary"</span> rules before publishing to global sites.
            </p>
         </div>
         <button className="px-6 py-3 bg-white border border-orange-200 text-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
            Compliance Audit Report
         </button>
      </div>
    </div>
  );
};
