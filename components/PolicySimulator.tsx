
import React, { useState } from 'react';
import { 
  Cpu, 
  ChevronDown, 
  Play, 
  Clock, 
  User, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  History, 
  Coffee, 
  ArrowRight,
  TrendingUp,
  Download,
  Upload,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  BarChart2,
  FileText,
  Table as TableIcon,
  // Added missing ChevronRight icon
  ChevronRight
} from 'lucide-react';

type SimulationStatus = 'IDLE' | 'LOADING' | 'COMPLETED' | 'BATCH';

interface BatchResult {
  id: string;
  scenario: string;
  punchIn: string;
  punchOut: string;
  status: string;
  impact: string;
}

export const PolicySimulator: React.FC = () => {
  const [status, setStatus] = useState<SimulationStatus>('IDLE');
  const [policy, setPolicy] = useState('Standard Office Policy');
  const [inTime, setInTime] = useState('09:25');
  const [outTime, setOutTime] = useState('18:30');
  const [breakMins, setBreakMins] = useState('60');

  const batchResults: BatchResult[] = [
    { id: '1', scenario: 'Late Arrival (Grace Exceeded)', punchIn: '09:25 AM', punchOut: '06:00 PM', status: 'Present (Late)', impact: '15m Deduct' },
    { id: '2', scenario: 'Early Departure', punchIn: '09:00 AM', punchOut: '04:30 PM', status: 'Short Day', impact: '0.25d Salary' },
    { id: '3', scenario: 'Perfect Day', punchIn: '08:55 AM', punchOut: '06:15 PM', status: 'Present', impact: 'None' },
  ];

  const handleSimulate = () => {
    setStatus('LOADING');
    setTimeout(() => setStatus('COMPLETED'), 800);
  };

  const handleBatchToggle = () => {
    setStatus('BATCH');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Cpu className="text-purple-600" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Policy Simulator</h2>
              <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-purple-100">PRO</span>
            </div>
            <p className="text-sm text-gray-500 font-medium italic">Test complex logic scenarios before production deployment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setStatus('IDLE')}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
           >
            Reset
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] transition-all">
            <Download size={16} /> Export Results
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* INPUT PANEL */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#3E3B6F]" />
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Scenario Parameters</h3>
              </div>
              <button 
                onClick={handleBatchToggle}
                className="text-[10px] font-black text-purple-600 uppercase flex items-center gap-1 hover:underline"
              >
                <TableIcon size={12} /> Batch Mode
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Policy</label>
                <div className="relative group">
                  <select 
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#3E3B6F] appearance-none outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 transition-all"
                  >
                    <option>Standard Office Policy</option>
                    <option>Production Floor Rules</option>
                    <option>Field Force Flexi</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee Profile</label>
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm group hover:border-[#3E3B6F]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">SP</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Sample Profile</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Grade E3 • Salaried</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Punch In</p>
                    <input 
                      type="time" 
                      value={inTime} 
                      onChange={(e) => setInTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] focus:bg-white transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Punch Out</p>
                    <input 
                      type="time" 
                      value={outTime} 
                      onChange={(e) => setOutTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] focus:bg-white transition-all outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Break Taken</p>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={breakMins}
                      onChange={(e) => setBreakMins(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] outline-none" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">MINS</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSimulate}
                disabled={status === 'LOADING'}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary-gradient text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {status === 'LOADING' ? <RefreshCcw className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                Simulate Scenario
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm group">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} /> Bulk Stress Test
                </h4>
                <Upload size={16} className="text-gray-300 group-hover:text-[#3E3B6F] transition-colors" />
             </div>
             <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
               Upload CSV with historical punch data to see how the new policy would have impacted past payrolls.
             </p>
             <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all">
               Import Scenarios
             </button>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="xl:col-span-2">
          {status === 'IDLE' ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
               <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                 <Zap size={48} className="text-gray-200" />
               </div>
               <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Analysis Engine Idle</h3>
               <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto font-medium leading-relaxed">
                 Configure a scenario on the left and run simulation to trace calculation logic.
               </p>
            </div>
          ) : status === 'LOADING' ? (
             <div className="h-full bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-purple-50 border-t-purple-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-purple-600">
                     <Cpu size={40} />
                   </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Running Policy Trace...</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Processing grace, thresholds, and penalty tiers</p>
                </div>
             </div>
          ) : status === 'BATCH' ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Batch Simulation Results</h3>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded">3 Scenarios Ran</span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Scenario</th>
                    <th className="px-6 py-4">Punch In</th>
                    <th className="px-6 py-4">Punch Out</th>
                    <th className="px-6 py-4">Result Status</th>
                    <th className="px-6 py-4 text-right">Deduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {batchResults.map(res => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-800">{res.scenario}</td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 tabular-nums">{res.punchIn}</td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 tabular-nums">{res.punchOut}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${res.status.includes('Late') || res.status.includes('Short') ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-black text-red-600">{res.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                 <button onClick={() => setStatus('COMPLETED')} className="text-[10px] font-black text-[#3E3B6F] uppercase hover:underline">View Single Scenario Trace</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <History className="text-purple-500" size={18} />
                     <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Calculation Trace Summary</h3>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-black text-[#3E3B6F] uppercase hover:opacity-80">
                     <Download size={14} /> Full Trace JSON
                   </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* CONTEXT BLOCK */}
                  <div className="p-6 grid grid-cols-2 gap-8 bg-purple-50/30">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Evaluated Shift</p>
                        <p className="text-sm font-bold text-gray-800">Morning Shift (09:00 AM - 06:00 PM)</p>
                     </div>
                     <div className="text-right space-y-1">
                        <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Expected Hours</p>
                        <p className="text-sm font-black text-purple-700">8h 00m <span className="text-[10px] text-gray-400 font-medium">(after 1h lunch)</span></p>
                     </div>
                  </div>

                  {/* TRACE STEPS */}
                  <div className="p-8 space-y-8">
                    <div className="flex gap-8">
                       <div className="w-1 bg-red-400 rounded-full shrink-0"></div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                             <p className="text-xs font-black text-gray-800 uppercase tracking-widest">PUNCH-IN ANALYSIS</p>
                             <span className="text-[11px] font-black text-red-500 tabular-nums">{inTime} AM</span>
                          </div>
                          <div className="space-y-2 border-l-2 border-gray-50 ml-2 pl-4 py-1">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-red-500">
                                <AlertTriangle size={14} /> Gross Latency: 25 minutes
                             </div>
                             <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 italic">
                                <ShieldCheck size={14} className="opacity-50" /> Daily Grace: 15 minutes applied
                             </div>
                             <div className="flex items-center gap-2 text-[11px] font-black text-red-700 uppercase tracking-tight">
                                <ArrowRight size={14} /> Result: Net Late (10 mins) → TIER 2 PENALTY
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-8">
                       <div className="w-1 bg-green-400 rounded-full shrink-0"></div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                             <p className="text-xs font-black text-gray-800 uppercase tracking-widest">PUNCH-OUT ANALYSIS</p>
                             <span className="text-[11px] font-black text-green-600 tabular-nums">{outTime} PM</span>
                          </div>
                          <div className="space-y-2 border-l-2 border-gray-50 ml-2 pl-4 py-1">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-green-600">
                                <CheckCircle2 size={14} /> Exit timing: +30 mins after shift end
                             </div>
                             <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-500">
                                <TrendingUp size={14} /> Policy: Excess time not eligible for OT (Threshold 45m)
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-8">
                       <div className="w-1 bg-[#3E3B6F] rounded-full shrink-0"></div>
                       <div className="flex-1">
                          <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">FINAL METRICS</p>
                          <div className="grid grid-cols-3 gap-4">
                             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Gross Worked</p>
                                <p className="text-sm font-black text-gray-800">9h 05m</p>
                             </div>
                             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Break Time</p>
                                <p className="text-sm font-black text-gray-800">{breakMins}m</p>
                             </div>
                             <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                                <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Net Mapped</p>
                                <p className="text-sm font-black text-indigo-800 tabular-nums">8h 05m</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* FINAL OUTCOME */}
                  <div className="p-8 bg-[#3E3B6F] text-white">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[#E8D5A3]">
                             <CheckCircle2 size={20} />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Simulation Conclusion</p>
                           </div>
                           <h4 className="text-4xl font-black tracking-tighter">
                             PRESENT <span className="text-base font-medium text-white/40 tracking-normal ml-2">(Late penalty)</span>
                           </h4>
                        </div>
                        <div className="space-y-4 shrink-0 min-w-[240px] bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                           <div className="flex justify-between items-center text-xs font-medium">
                             <span className="text-white/60">Salary Impact:</span>
                             <span className="font-black text-orange-400">15 min deduction</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-medium">
                             <span className="text-white/60">Leave Unit:</span>
                             <span className="font-black">0.0 Days</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-medium pt-3 border-t border-white/10">
                             <span className="text-white/60">Bonus Multiplier:</span>
                             <span className="font-black text-red-400 flex items-center gap-1">
                                <XCircle size={14} /> Eligibility Void
                             </span>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* WHAT IF WIDGET */}
              <div className="bg-[#E8D5A3]/5 border border-[#E8D5A3]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-[#E8D5A3]/10 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                       <RefreshCcw className="text-[#3E3B6F]" size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Instant What-if Analysis</h4>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed">
                         What if the employee arrival was <span className="font-black text-[#3E3B6F]">09:14 AM</span> instead of <span className="font-bold">{inTime} AM</span>?
                       </p>
                    </div>
                 </div>
                 <button 
                  onClick={() => { setInTime('09:14'); handleSimulate(); }}
                  className="px-8 py-3 bg-white border border-[#3E3B6F]/10 text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E3B6F] hover:text-white transition-all shadow-sm active:scale-95"
                 >
                   Re-simulate Now
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
