
import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MoreVertical, 
  Users, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Info, 
  RefreshCcw, 
  ChevronRight,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';

type RuleType = 'FIXED' | 'ROTATING';

interface WeeklyOffRule {
  id: string;
  name: string;
  type: RuleType;
  pattern: string;
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  effectiveDate: string;
}

const MOCK_RULES: WeeklyOffRule[] = [
  { id: 'WOR-001', name: 'Sat-Sun Standard Off', type: 'FIXED', pattern: 'Sat, Sun', employeeCount: 850, status: 'ACTIVE', effectiveDate: 'Jan 01, 2024' },
  { id: 'WOR-002', name: 'Friday Only (Middle East)', type: 'FIXED', pattern: 'Fri', employeeCount: 120, status: 'ACTIVE', effectiveDate: 'Jan 01, 2024' },
  { id: 'WOR-003', name: 'Sunday Only Retail', type: 'FIXED', pattern: 'Sun', employeeCount: 45, status: 'ACTIVE', effectiveDate: 'Mar 15, 2024' },
  { id: 'WOR-004', name: 'Rotating 5-2 Cycle', type: 'ROTATING', pattern: '5 Days On, 2 Days Off', employeeCount: 210, status: 'ACTIVE', effectiveDate: 'Jan 01, 2025' },
  { id: 'WOR-005', name: 'Support Alternate Sat', type: 'FIXED', pattern: 'Alt Sat, Sun', employeeCount: 32, status: 'INACTIVE', effectiveDate: 'Feb 01, 2024' },
];

export const WeeklyOffRules: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleType, setRuleType] = useState<RuleType>('FIXED');
  const [selectedOffs, setSelectedOffs] = useState<string[]>(['Sat', 'Sun']);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setSelectedOffs(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarCheck className="text-[#3E3B6F]" size={28} /> Weekly Off Rules
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Define recurring rest days and shift rotation cycles</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Rule
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search patterns or names..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none transition-all" 
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Rule Name</th>
                <th className="px-6 py-5">Off Pattern</th>
                <th className="px-6 py-5 text-center">Employees</th>
                <th className="px-6 py-5">Effective Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RULES.map((rule) => (
                <tr key={rule.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${rule.type === 'FIXED' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                        {rule.type === 'FIXED' ? <Calendar size={18} /> : <RefreshCcw size={18} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{rule.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-tighter border border-gray-200">
                      {rule.pattern}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#3E3B6F]/5 rounded-lg text-xs font-black text-[#3E3B6F] tabular-nums">
                      <Users size={12} /> {rule.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[11px] font-bold text-gray-500 tabular-nums">{rule.effectiveDate}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      rule.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="Edit"><Edit3 size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all" title="Delete"><Trash2 size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <CalendarCheck size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Configure Weekly Off</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rule Builder</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rule Name *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. Weekend Rest Cycle" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date *</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rule Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setRuleType('FIXED')}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${ruleType === 'FIXED' ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Calendar className={ruleType === 'FIXED' ? 'text-[#3E3B6F]' : 'text-gray-400'} size={24} />
                      <div>
                        <p className="text-sm font-bold text-gray-800">Fixed Weekly Off</p>
                        <p className="text-[10px] text-gray-500 font-medium">Same days every week (e.g. Sat-Sun)</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setRuleType('ROTATING')}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${ruleType === 'ROTATING' ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <RefreshCcw className={ruleType === 'ROTATING' ? 'text-[#3E3B6F]' : 'text-gray-400'} size={24} />
                      <div>
                        <p className="text-sm font-bold text-gray-800">Rotating Cycle</p>
                        <p className="text-[10px] text-gray-500 font-medium">Rotation based on work/off day count</p>
                      </div>
                    </button>
                  </div>
               </div>

               {ruleType === 'FIXED' ? (
                 <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Weekly Offs</label>
                      <div className="flex gap-2">
                        {days.map(d => (
                          <button 
                            key={d} 
                            onClick={() => toggleDay(d)}
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                              selectedOffs.includes(d) 
                                ? 'bg-[#3E3B6F] text-white border-transparent shadow-lg' 
                                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Presets</label>
                      <div className="flex flex-wrap gap-2">
                        {['Sat-Sun', 'Fri-Sat', 'Sunday Only'].map(p => (
                          <button 
                            key={p} 
                            onClick={() => {
                              if (p === 'Sat-Sun') setSelectedOffs(['Sat', 'Sun']);
                              if (p === 'Fri-Sat') setSelectedOffs(['Fri', 'Sat']);
                              if (p === 'Sunday Only') setSelectedOffs(['Sun']);
                            }}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 transition-all"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Days (On)</label>
                          <input type="number" defaultValue="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Off Days (Rest)</label>
                          <input type="number" defaultValue="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-indigo-500 outline-none" />
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Pattern Preview</label>
                       <div className="flex gap-1.5 h-8">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`flex-1 rounded-md border shadow-sm ${i % 7 < 5 ? 'bg-[#3E3B6F] border-[#3E3B6F]/10' : 'bg-indigo-100 border-indigo-200'}`}
                              title={i % 7 < 5 ? 'Work Day' : 'Weekly Off'}
                            />
                          ))}
                       </div>
                       <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <span>Week 1</span>
                          <span>Week 2</span>
                       </div>
                    </div>

                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                       <RefreshCcw size={18} className="text-indigo-500" />
                       <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                         Rotating shifts are ideal for 24/7 operations. Employees will cycle through work and off days automatically in the roster.
                       </p>
                    </div>
                 </div>
               )}

               <div className="p-5 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl flex gap-4">
                  <Info className="text-[#3E3B6F] shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-[#3E3B6F] uppercase tracking-widest mb-1">Payroll Impact</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                      Calculations for "Work on Weekly Off" will be triggered if employees punch in during these designated rest periods.
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Commit Rule
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
