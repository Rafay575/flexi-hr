import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Settings2, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCcw, 
  Cpu, 
  TrendingDown, 
  ChevronRight, 
  Info, 
  X,
  Target,
  Layers,
  History,
  Sparkles
} from 'lucide-react';

type SimStatus = 'IDLE' | 'OPTIMIZING' | 'REVIEW';

export const RosterOptimizer: React.FC = () => {
  const [status, setStatus] = useState<SimStatus>('IDLE');
  const [period, setPeriod] = useState('Jan 13 - Jan 19, 2025');

  const handleOptimize = () => {
    setStatus('OPTIMIZING');
    setTimeout(() => setStatus('REVIEW'), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Roster Optimizer</h2>
            <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-purple-200 uppercase tracking-widest">PRO</span>
          </div>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Neural scheduling engine using constraint satisfaction to maximize coverage</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Calendar size={14} /> {period}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* INPUTS PANEL */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Settings2 size={18} className="text-[#3E3B6F]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Optimization Logic</h3>
            </div>
            <div className="p-8 space-y-8">
              {/* HARD CONSTRAINTS */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-500" /> Hard Constraints (Mandatory)
                </h4>
                <div className="space-y-3">
                  {[
                    "Rest rules (min 11h between shifts)",
                    "Max hours (48h/week compliance)",
                    "Required skill-shift matching",
                    "Zero double-booking overlap"
                  ].map(c => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-[#3E3B6F] bg-[#3E3B6F] flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 group-hover:text-[#3E3B6F] transition-colors">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SOFT PREFERENCES */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" /> Preferences (Weighted)
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Employee shift preferences", active: true },
                    { label: "Equity (Fair load distribution)", active: true },
                    { label: "Minimize Overtime", active: true },
                    { label: "Minimize churn from current", active: false }
                  ].map(p => (
                    <label key={p.label} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${p.active ? 'border-[#3E3B6F] bg-[#3E3B6F]/10' : 'border-gray-200'}`}>
                        {p.active && <div className="w-2.5 h-2.5 bg-[#3E3B6F] rounded-sm" />}
                      </div>
                      <span className={`text-xs font-bold ${p.active ? 'text-gray-700' : 'text-gray-400'}`}>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button 
                  onClick={handleOptimize}
                  disabled={status === 'OPTIMIZING'}
                  className="w-full py-4 bg-primary-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {status === 'OPTIMIZING' ? <RefreshCcw size={16} className="animate-spin" /> : <Cpu size={16} />}
                  Run Optimization
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
              <TrendingDown size={20} className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Demand Link</h4>
              <p className="text-[10px] text-indigo-600 leading-relaxed font-medium">
                Connected to <span className="font-bold underline">Office HQ Demand Grid</span>. Optimizing for 52 distinct slots.
              </p>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="xl:col-span-2">
          {status === 'IDLE' ? (
            <div className="h-full min-h-[500px] bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-20 opacity-40">
              <Sparkles size={80} className="text-gray-200 mb-6" />
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Roster Optimizer Ready</h3>
              <p className="text-sm font-medium text-gray-400 mt-2 max-w-xs leading-relaxed">
                Provide your constraints and target period to generate a high-coverage roster automatically.
              </p>
            </div>
          ) : status === 'OPTIMIZING' ? (
            <div className="h-full min-h-[500px] bg-white rounded-3xl border border-gray-200 p-20 flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-32 h-32 border-8 border-indigo-50 border-t-[#3E3B6F] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#3E3B6F]">
                   <Cpu size={48} className="animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest animate-pulse">Computing Roster Permutations...</h3>
                <p className="text-xs text-gray-500 font-medium">Verifying 4,200 rest-period constraints</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              {/* PERFORMANCE METRICS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Coverage Met', val: '98%', icon: <Target className="text-green-500" /> },
                  { label: 'OT Reduction', val: '-15%', icon: <TrendingDown className="text-indigo-500" /> },
                  { label: 'Satisfaction', val: '82%', icon: <Users className="text-orange-500" /> },
                  { label: 'Violations', val: '0', icon: <ShieldCheck className="text-[#3E3B6F]" /> },
                ].map(m => (
                  <div key={m.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="mb-2">{m.icon}</div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.label}</p>
                    <p className="text-xl font-black text-gray-800">{m.val}</p>
                  </div>
                ))}
              </div>

              {/* DIFF VIEW TABLE */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <History size={18} className="text-[#3E3B6F]" />
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Optimized Shift Deltas</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase"><span className="text-indigo-600 font-black">23</span> Shifts Changed</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase"><span className="text-indigo-600 font-black">15</span> Staff Affected</div>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white border-b border-gray-100">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Old Shift</th>
                        <th className="px-6 py-4">New Shift</th>
                        <th className="px-6 py-4">Reasoning / Explainability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: 'Sarah Chen', date: 'Jan 15', old: 'Morning', new: 'Evening', reason: 'To cover 4 PM peak demand; satisfies "Evening preference" marker.' },
                        { name: 'Michael Chen', date: 'Jan 16', old: 'Morning', new: 'OFF', reason: 'Compensatory rest for weekend overtime; ensures <48h limit.' },
                        { name: 'Priya Das', date: 'Jan 14', old: 'Evening', new: 'Night', reason: 'Resource gap in QA Night shift; member holds L2 Security Cert.' },
                        { name: 'Ahmed Khan', date: 'Jan 17', old: 'Off Day', new: 'Morning', reason: 'Volunteer for Friday morning surge; adds +15% coverage.' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-gray-800">{row.name}</td>
                          <td className="px-6 py-4 text-xs text-gray-500 tabular-nums">{row.date}</td>
                          <td className="px-6 py-4 text-[10px] text-gray-400 line-through uppercase font-bold">{row.old}</td>
                          <td className="px-6 py-4 text-[10px] text-indigo-600 uppercase font-black">{row.new}</td>
                          <td className="px-6 py-4 text-[11px] text-gray-600 italic font-medium leading-relaxed">
                            "{row.reason}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Commit Optimized Roster
                </button>
                <button className="px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                  Manual Adjustments
                </button>
                <button 
                  onClick={handleOptimize}
                  className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all" 
                  title="Re-optimize"
                >
                  <RefreshCcw size={20} />
                </button>
              </div>

              {/* EXPLANATION NOTE */}
              <div className="p-6 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl flex gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm h-fit">
                   <Info className="text-[#3E3B6F]" size={20} />
                </div>
                <div className="flex-1">
                   <h4 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Explainability Note</h4>
                   <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                     This roster was prioritized for <span className="font-bold">Peak Coverage Continuity</span>. Preference satisfaction was sacrificed by 4% to ensure zero violations of rest period rules for the Operations department.
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
