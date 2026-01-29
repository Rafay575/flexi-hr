import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  History, 
  FileText, 
  User, 
  X, 
  Check, 
  MoreVertical,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Download,
  Upload
} from 'lucide-react';

type PunchType = 'IN' | 'OUT' | 'BREAK_START' | 'BREAK_END';
type PunchStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface ManualPunch {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  type: PunchType;
  time: string;
  reason: string;
  requestedBy: string;
  status: PunchStatus;
  attachment?: string;
}

const TYPE_CONFIG: Record<PunchType, { label: string; color: string }> = {
  IN: { label: 'Punch In', color: 'bg-green-50 text-green-600 border-green-100' },
  OUT: { label: 'Punch Out', color: 'bg-red-50 text-red-600 border-red-100' },
  BREAK_START: { label: 'Break Start', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  BREAK_END: { label: 'Break End', color: 'bg-blue-50 text-blue-600 border-blue-100' },
};

const MOCK_DATA: ManualPunch[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `MP-${9000 + i}`,
  employee: ['Sarah Chen', 'James Wilson', 'Ahmed Khan', 'Priya Das', 'Elena Frost', 'Marcus Low'][i % 6],
  avatar: ['SC', 'JW', 'AK', 'PD', 'EF', 'ML'][i % 6],
  date: `Jan ${15 - (i % 5)}, 2025`,
  type: (['IN', 'OUT', 'BREAK_START', 'BREAK_END'] as PunchType[])[i % 4],
  time: i % 2 === 0 ? '09:00 AM' : '06:30 PM',
  reason: ['Forgot to punch', 'Device failure', 'System error', 'On-site visit'][i % 4],
  requestedBy: i % 3 === 0 ? 'Self (App)' : 'Jane Doe (HR)',
  status: i < 3 ? 'PENDING' : 'APPROVED',
}));

export const ManualPunchPanel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    employee: '',
    date: '2025-01-15',
    type: 'IN' as PunchType,
    time: '09:00',
    reason: 'Forgot to punch',
    note: ''
  });

  const filteredItems = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeView === 'PENDING' ? item.status === 'PENDING' : item.status !== 'PENDING';
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeView]);

  const hasConflict = formData.employee !== '' && formData.type === 'IN';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Zap className="text-[#3E3B6F]" size={28} /> Manual Punch Entry
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Directly modify or add missing attendance timestamps</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setActiveView('PENDING')}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'PENDING' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              Requests
            </button>
            <button 
              onClick={() => setActiveView('HISTORY')}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'HISTORY' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              History
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Add Manual Punch
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by employee name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium border-none outline-none focus:ring-0"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-[#3E3B6F]">
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Employee</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Punch Type</th>
                <th className="px-6 py-5">Time</th>
                <th className="px-6 py-5">Reason</th>
                <th className="px-6 py-5 text-center">{activeView === 'PENDING' ? 'Requested By' : 'Processed By'}</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[11px] font-black">
                        {item.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{item.employee}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-bold text-gray-500 tabular-nums">{item.date}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${TYPE_CONFIG[item.type].color}`}>
                      {TYPE_CONFIG[item.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-[#3E3B6F] tabular-nums">{item.time}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-gray-600 italic">"{item.reason}"</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.requestedBy}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'PENDING' ? 'text-orange-500 bg-orange-50' : 
                      item.status === 'APPROVED' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                       {item.status === 'PENDING' ? (
                         <>
                           <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-none"><Check size={16}/></button>
                           <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-none"><X size={16}/></button>
                         </>
                       ) : (
                         <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-none"><ChevronRight size={18}/></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center opacity-30">
              <ShieldCheck size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Records Found</h3>
            </div>
          )}
        </div>
      </div>

      {/* ADD MANUAL PUNCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-0 !m-0">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <Plus size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">New Manual Punch</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Administrator Override</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               {/* FORM FIELDS */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Employee *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        value={formData.employee}
                        onChange={(e) => setFormData({...formData, employee: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" 
                        placeholder="Search name or ID..." 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none" 
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['IN', 'OUT', 'BREAK_START', 'BREAK_END'] as PunchType[]).map(t => (
                        <button 
                          key={t}
                          onClick={() => setFormData({...formData, type: t})}
                          className={`py-2 text-[9px] font-black uppercase tracking-tighter rounded-lg border-2 transition-all ${formData.type === t ? 'border-[#3E3B6F] bg-[#3E3B6F]/5 text-[#3E3B6F]' : 'border-gray-100 text-gray-400'}`}
                        >
                          {t.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-lg font-black text-[#3E3B6F] outline-none" 
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason *</label>
                    <select 
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option>Device failure</option>
                      <option>Forgot to punch</option>
                      <option>System error</option>
                      <option>On-site duty</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] outline-none" 
                    placeholder="Provide additional details for auditing..."
                  />
               </div>

               {/* VALIDATION ALERTS */}
               {hasConflict && (
                 <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3 animate-in shake-in">
                    <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                    <p className="text-[11px] text-orange-700 font-medium leading-relaxed">
                      <span className="font-black uppercase block mb-1">Potential Conflict:</span>
                      Employee already has an <span className="font-bold">IN punch at 09:05 AM</span>. Submitting this will create a duplicate entry or overwrite existing data.
                    </p>
                 </div>
               )}

               {/* IMPACT PREVIEW */}
               <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> Calculation Impact Preview
                  </h4>
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Status</p>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-bold text-gray-400 line-through">Absent</span>
                           <ArrowRight size={14} className="text-indigo-400" />
                           <span className="text-xs font-bold text-green-600">Present</span>
                        </div>
                     </div>
                     <div className="text-right space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Work Hours</p>
                        <div className="flex items-center justify-end gap-3">
                           <span className="text-xs font-bold text-gray-400 line-through">0h</span>
                           <ArrowRight size={14} className="text-indigo-400" />
                           <span className="text-xs font-bold text-indigo-700">8.5h</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ATTACHMENT */}
               <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group cursor-pointer hover:border-[#3E3B6F]/30 transition-all bg-gray-50/30">
                  <Upload size={24} className="text-gray-300 group-hover:text-[#3E3B6F] mb-2 transition-colors" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#3E3B6F]">Attach Evidence (System logs/Photo)</p>
                  <p className="text-[9px] text-gray-300 mt-1">PDF, PNG, JPG up to 5MB</p>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Discard
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Apply Manual Entry
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
