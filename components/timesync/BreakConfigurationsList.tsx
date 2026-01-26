
import React, { useState } from 'react';
import { 
  Coffee, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Moon
} from 'lucide-react';

type BreakType = 'Lunch' | 'Tea' | 'Prayer' | 'Custom';

interface BreakConfig {
  id: string;
  name: string;
  type: BreakType;
  duration: number; // in minutes
  timing: string;
  isPaid: boolean;
  fridayOverride: string | 'Same';
  shiftCount: number;
}

const MOCK_BREAKS: BreakConfig[] = [
  { id: 'BR-001', name: 'Standard Lunch', type: 'Lunch', duration: 60, timing: '1:00 PM - 2:00 PM', isPaid: false, fridayOverride: '12:30 PM - 2:30 PM', shiftCount: 12 },
  { id: 'BR-002', name: 'Morning Tea', type: 'Tea', duration: 15, timing: '11:00 AM - 11:15 AM', isPaid: true, fridayOverride: 'Same', shiftCount: 45 },
  { id: 'BR-003', name: 'Asr Prayer', type: 'Prayer', duration: 20, timing: '4:30 PM - 4:50 PM', isPaid: true, fridayOverride: 'Same', shiftCount: 156 },
  { id: 'BR-004', name: 'Evening Break', type: 'Tea', duration: 15, timing: '5:00 PM - 5:15 PM', isPaid: true, fridayOverride: 'Same', shiftCount: 85 },
  { id: 'BR-005', name: 'Ramzan Iftar', type: 'Custom', duration: 30, timing: '6:30 PM - 7:00 PM', isPaid: false, fridayOverride: 'Same', shiftCount: 20 },
];

export const BreakConfigurationsList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBreaks = MOCK_BREAKS.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Coffee className="text-[#3E3B6F]" size={28} /> Break Configurations
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Manage global break policies and religious accommodation rules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Search breaks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-48 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Break Config
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Name & Category</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4">Default Timing</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Friday Override</th>
                <th className="px-6 py-4 text-center">Usage</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBreaks.map((config) => (
                <tr key={config.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        config.type === 'Lunch' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                        config.type === 'Tea' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        config.type === 'Prayer' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                        'bg-gray-50 border-gray-100 text-gray-600'
                      }`}>
                        {config.type === 'Lunch' && <Coffee size={18} />}
                        {config.type === 'Tea' && <Zap size={18} />}
                        {config.type === 'Prayer' && <Moon size={18} />}
                        {config.type === 'Custom' && <Clock size={18} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{config.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{config.type} Break</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-[#3E3B6F]">{config.duration}m</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {config.timing}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      config.isPaid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {config.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {config.fridayOverride === 'Same' ? (
                      <span className="text-[10px] font-bold text-gray-300 uppercase italic">No Change</span>
                    ) : (
                      <div className="flex items-center gap-2 text-[11px] font-bold text-orange-600">
                        <Calendar size={12} />
                        {config.fridayOverride}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                       {config.shiftCount} Shifts
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-all"><Edit3 size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-all"><Copy size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg shadow-[#3E3B6F]/20">
                    <Coffee size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Configure Break Policy</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Policy Builder</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24}/>
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Break Name *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5" placeholder="e.g. Executive Lunch" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Break Type</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                       <option>Lunch Break</option>
                       <option>Tea Break</option>
                       <option>Prayer Break</option>
                       <option>Custom</option>
                    </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                       <Clock size={14} /> Timing & Duration
                     </h4>
                     <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                             <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Start</p>
                             <input type="time" defaultValue="13:00" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold" />
                          </div>
                          <ArrowRight size={14} className="text-gray-300 mt-5" />
                          <div className="flex-1">
                             <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">End</p>
                             <input type="time" defaultValue="14:00" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                           <span className="text-[10px] font-bold text-gray-500 uppercase">Auto-calculated Duration:</span>
                           <span className="text-xs font-black text-[#3E3B6F]">60 Minutes</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                         <Calendar size={14} /> Friday Special
                       </h4>
                       <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                         <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
                       </div>
                     </div>
                     <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                             <p className="text-[9px] text-orange-400 font-bold uppercase mb-1">Fri Start</p>
                             <input type="time" defaultValue="12:30" className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs font-bold text-orange-700" />
                          </div>
                          <ArrowRight size={14} className="text-orange-200 mt-5" />
                          <div className="flex-1">
                             <p className="text-[9px] text-orange-400 font-bold uppercase mb-1">Fri End</p>
                             <input type="time" defaultValue="14:30" className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs font-bold text-orange-700" />
                          </div>
                        </div>
                        <p className="text-[9px] text-orange-600 font-bold italic leading-relaxed text-center bg-white/50 py-1 rounded-md">120 min duration for Jummah Prayer</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type & Compensation</h4>
                     <div className="flex gap-2">
                        <button className="flex-1 py-3 rounded-xl border-2 border-[#3E3B6F] bg-[#3E3B6F]/5 text-[#3E3B6F] text-xs font-black uppercase tracking-widest">Unpaid</button>
                        <button className="flex-1 py-3 rounded-xl border-2 border-gray-100 bg-white text-gray-400 text-xs font-bold uppercase tracking-widest hover:border-gray-200">Paid</button>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enforcement</h4>
                     <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <div className="w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center group-hover:border-[#3E3B6F] transition-all">
                              <div className="w-2.5 h-2.5 bg-[#3E3B6F] rounded-sm"></div>
                           </div>
                           <span className="text-xs font-bold text-gray-600">Enforce manual punch</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <div className="w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center"></div>
                           <span className="text-xs font-bold text-gray-600">Auto-deduct even if not punched</span>
                        </label>
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                  <ShieldCheck size={20} className="text-indigo-500 shrink-0" />
                  <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                    <span className="font-black uppercase text-[10px] block mb-1">Compliance Check:</span>
                    This configuration meets <span className="font-bold underline">Labor Law Rule 34.2</span> requiring a mandatory 45m break after 5 continuous work hours.
                  </p>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Save Configuration
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
