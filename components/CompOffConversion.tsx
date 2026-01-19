
import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Zap, 
  AlertCircle,
  History,
  ShieldCheck,
  User,
  Info,
  Check,
  X,
  MoreVertical,
  RefreshCcw,
  Plus
} from 'lucide-react';

interface ConversionRequest {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  extraHours: number;
  compOffValue: number; // in days
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
}

interface ConversionHistory {
  id: string;
  date: string;
  employee: string;
  otHours: number;
  credited: string;
  approvedBy: string;
}

const MOCK_PENDING: ConversionRequest[] = [
  { id: 'CONV-001', employee: 'Ahmed Khan', avatar: 'AK', date: 'Jan 12, 2025', extraHours: 8.0, compOffValue: 1.0, status: 'PENDING', reason: 'Weekend server migration support' },
  { id: 'CONV-002', employee: 'Sarah Chen', avatar: 'SC', date: 'Jan 13, 2025', extraHours: 4.5, compOffValue: 0.5, status: 'PENDING', reason: 'Extended design review for Q1 launch' },
  { id: 'CONV-003', employee: 'James Wilson', avatar: 'JW', date: 'Jan 14, 2025', extraHours: 9.0, compOffValue: 1.0, status: 'PENDING', reason: 'Public Holiday duty - on-call' },
];

const MOCK_HISTORY: ConversionHistory[] = [
  { id: 'H-99', date: 'Jan 05, 2025', employee: 'Elena Frost', otHours: 8.0, credited: '1.0 Day', approvedBy: 'Jane Doe (HR)' },
  { id: 'H-98', date: 'Jan 04, 2025', employee: 'Marcus Low', otHours: 4.0, credited: '0.5 Day', approvedBy: 'Jane Doe (HR)' },
  { id: 'H-97', date: 'Jan 02, 2025', employee: 'Priya Das', otHours: 2.0, credited: '0.25 Day', approvedBy: 'System Auto' },
];

export const CompOffConversion: React.FC = () => {
  const [pending, setPending] = useState(MOCK_PENDING);
  const [activeView, setActiveView] = useState<'PENDING' | 'HISTORY'>('PENDING');

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setPending(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="text-[#3E3B6F]" size={28} /> Comp-Off Conversion
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Transform approved overtime into compensatory leave balances</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setActiveView('PENDING')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'PENDING' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveView('HISTORY')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'HISTORY' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* MAIN AREA */}
        <div className="xl:col-span-2 space-y-6">
          {activeView === 'PENDING' ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-[#3E3B6F]" /> Pending Conversions
                </h3>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">RATE: 2h OT = 1h Comp-Off</span>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/30">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-8 py-4">Employee</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">OT Hours</th>
                      <th className="px-6 py-4 text-center">Comp-Off Days</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pending.map((req) => (
                      <tr key={req.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black">
                              {req.avatar}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{req.employee}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase">{req.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[11px] font-bold text-gray-500 tabular-nums">{req.date}</td>
                        <td className="px-6 py-5 text-center">
                           <span className="text-sm font-black text-gray-700 tabular-nums">{req.extraHours}h</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 text-xs font-black">
                             <CheckCircle2 size={12} /> {req.compOffValue} Day
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleAction(req.id, 'APPROVE')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm">
                               <Check size={14} />
                             </button>
                             <button onClick={() => handleAction(req.id, 'REJECT')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm">
                               <X size={14} />
                             </button>
                             <button className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all">
                               <ChevronRight size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pending.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center opacity-30 grayscale">
                          <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Pending Conversions</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <History size={16} className="text-[#3E3B6F]" /> Conversion History
                </h3>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/30">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-8 py-4">Date</th>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4 text-center">OT Hours</th>
                      <th className="px-6 py-4 text-center">Credit Applied</th>
                      <th className="px-6 py-4 text-right">Approved By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_HISTORY.map((hist) => (
                      <tr key={hist.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-5 text-[11px] font-bold text-gray-500 tabular-nums">{hist.date}</td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-gray-800">{hist.employee}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-bold text-gray-700 tabular-nums">{hist.otHours}h</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-xs font-black text-indigo-600">{hist.credited}</span>
                        </td>
                        <td className="px-6 py-5 text-right text-[10px] font-bold text-gray-400 uppercase">
                          {hist.approvedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RULES CONFIG SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-fit">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Settings size={18} className="text-orange-500" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Conversion Rules</h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min. OT for Conversion</label>
                 <div className="relative">
                    <input type="number" defaultValue="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black text-[#3E3B6F]" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Hours</span>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conversion Rate (vs Shift)</label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[9px] text-gray-400 font-bold uppercase">OT Units</p>
                       <input type="number" defaultValue="8" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-center" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] text-gray-400 font-bold uppercase">Leave Days</p>
                       <input type="number" defaultValue="1" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-center" />
                    </div>
                 </div>
                 <p className="text-[9px] text-gray-400 italic mt-1 font-medium text-center">"8 hours of extra time = 1 full day compensatory off"</p>
               </div>

               <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-700">Auto-convert eligible OT</span>
                     <div className="w-10 h-5 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full transition-all translate-x-0"></div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-700">Manager approval req.</span>
                     <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer shadow-inner">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comp-Off Expiry</label>
                 <div className="relative">
                    <input type="number" defaultValue="90" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black text-[#3E3B6F]" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Days</span>
                 </div>
                 <p className="text-[10px] text-gray-500 font-medium">Leave will expire if not availed within the window.</p>
               </div>

               <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-105 active:scale-95 transition-all">
                  Update Settings
               </button>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-4">
             <div className="bg-white p-2 rounded-xl shadow-sm h-fit">
                <Zap className="text-indigo-600" size={20} />
             </div>
             <div className="flex-1">
                <p className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Impact Preview</p>
                <p className="text-[10px] text-indigo-600/80 leading-relaxed font-medium">
                   3 pending requests match your <span className="font-bold">current policy</span>. If approved, 2.5 total days will be added to the leave balances of the selected employees.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
