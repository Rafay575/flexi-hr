
import React, { useState } from 'react';
import { 
  Sliders, 
  ChevronDown, 
  Save, 
  Clock, 
  AlertCircle, 
  Percent, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

type ThresholdStatus = 'PRESENT' | 'HALF_DAY' | 'SHORT_DAY' | 'ABSENT';

interface ThresholdRule {
  status: ThresholdStatus;
  min: number;
  max: number | null;
  pct: string;
  deduction: string;
  color: string;
}

export const ThresholdSettings: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('Standard Office Policy');
  const [shiftDuration] = useState(8); // Fixed for calculation logic

  const [thresholds, setThresholds] = useState<ThresholdRule[]>([
    { status: 'PRESENT', min: 8.0, max: null, pct: '100%', deduction: 'None', color: 'bg-green-500' },
    { status: 'HALF_DAY', min: 4.0, max: 7.99, pct: '50-99%', deduction: '0.5 day salary/leave', color: 'bg-blue-500' },
    { status: 'SHORT_DAY', min: 2.0, max: 3.99, pct: '25-49%', deduction: '0.75 day salary/leave', color: 'bg-orange-500' },
    { status: 'ABSENT', min: 0.0, max: 1.99, pct: '<25%', deduction: '1.0 day salary/leave', color: 'bg-red-500' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Sliders className="text-[#3E3B6F]" size={28} /> Attendance Thresholds
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Configure net work hour logic for automatic status marking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm cursor-pointer hover:bg-gray-50 group transition-all">
            <span className="text-xs font-bold text-[#3E3B6F] mr-2">{selectedPolicy}</span>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-[#3E3B6F]" />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Save size={18} /> Save Config
          </button>
        </div>
      </div>

      {/* VISUAL BUILDER */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Base Shift Duration
            </h3>
            <p className="text-3xl font-black text-[#3E3B6F] tabular-nums">{shiftDuration}.00 <span className="text-lg text-gray-400 font-bold">HRS</span></p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">Visual Roster Mapping</span>
          </div>
        </div>

        {/* THRESHOLD SLIDER VISUAL */}
        <div className="relative pt-6 pb-12 px-4">
           <div className="h-10 w-full flex rounded-2xl overflow-hidden shadow-inner border border-gray-100">
              <div className="w-[25%] bg-red-500 flex items-center justify-center group relative cursor-help">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Absent</span>
                 <div className="absolute top-full mt-2 w-px h-4 bg-red-200"></div>
                 <div className="absolute top-full mt-6 text-[10px] font-black text-red-500">0h</div>
              </div>
              <div className="w-[25%] bg-orange-500 flex items-center justify-center group relative cursor-help border-l border-white/20">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Short</span>
                 <div className="absolute top-full mt-2 w-px h-4 bg-orange-200"></div>
                 <div className="absolute top-full mt-6 text-[10px] font-black text-orange-500">2h</div>
              </div>
              <div className="w-[25%] bg-blue-500 flex items-center justify-center group relative cursor-help border-l border-white/20">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Half</span>
                 <div className="absolute top-full mt-2 w-px h-4 bg-blue-200"></div>
                 <div className="absolute top-full mt-6 text-[10px] font-black text-blue-500">4h</div>
              </div>
              <div className="flex-1 bg-green-500 flex items-center justify-center group relative cursor-help border-l border-white/20">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Present</span>
                 <div className="absolute top-full mt-2 right-0 w-px h-4 bg-green-200"></div>
                 <div className="absolute top-full mt-6 right-0 text-[10px] font-black text-green-500">8h</div>
                 <div className="absolute top-full mt-2 left-0 w-px h-4 bg-green-200"></div>
                 <div className="absolute top-full mt-6 left-0 text-[10px] font-black text-green-500">6h</div>
              </div>
           </div>
        </div>
      </div>

      {/* TABLE CONFIG */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-8 py-5">Attendance Status</th>
              <th className="px-6 py-5">Min Hours</th>
              <th className="px-6 py-5">Max Hours</th>
              <th className="px-6 py-5">Shift %</th>
              <th className="px-6 py-5">Auto Deduction</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {thresholds.map((row) => (
              <tr key={row.status} className="group hover:bg-gray-50/80 transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${row.color}`}></div>
                    <span className="text-xs font-black text-gray-800 uppercase tracking-widest">{row.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <input type="number" defaultValue={row.min} className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-[#3E3B6F] outline-none focus:ring-2 focus:ring-[#3E3B6F]/10" />
                </td>
                <td className="px-6 py-5">
                   {row.max !== null ? (
                     <input type="number" defaultValue={row.max} className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-black text-gray-400 outline-none" />
                   ) : (
                     <span className="text-[10px] font-bold text-gray-300 uppercase italic">Shift End</span>
                   )}
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 tabular-nums">
                      <Percent size={12} className="opacity-40" /> {row.pct}
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                      {row.deduction}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <button className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <ArrowRight size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SPECIAL CASES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
               <AlertCircle size={16} className="text-orange-500" /> Partial Punch Handling
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-700">Missing Out Punch</p>
                     <p className="text-[10px] text-gray-400 font-medium">When only an "In" punch is recorded.</p>
                  </div>
                  <select className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-black text-[#3E3B6F] outline-none">
                     <option>Require Regularization</option>
                     <option>Mark as Absent</option>
                     <option>Mark as Short Day</option>
                     <option>Use Default Shift Out</option>
                  </select>
               </div>
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-700">Missing In Punch</p>
                     <p className="text-[10px] text-gray-400 font-medium">When only an "Out" punch is recorded.</p>
                  </div>
                  <select className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-black text-[#3E3B6F] outline-none">
                     <option>Mark as Absent</option>
                     <option>Require Regularization</option>
                     <option>Use Default Shift In</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="bg-[#3E3B6F] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldCheck size={140} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-2 text-[#E8D5A3] mb-4">
                  <Info size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Policy Engine Note</span>
               </div>
               <p className="text-sm font-medium leading-relaxed text-white/80 italic">
                  "Status is calculated based on <span className="text-white font-bold underline decoration-[#E8D5A3]">Net Working Hours</span> (Actual work - unpaid breaks). Thresholds are applied daily during the midnight sync process."
               </p>
            </div>
            <div className="relative z-10 pt-8 flex items-center justify-between">
               <div className="flex gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span className="text-[10px] font-bold text-white/60">Compliance: LOCAL-L2</span>
               </div>
               <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                  Run Audit
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
