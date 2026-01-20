
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, List, Plus, X, ShieldAlert, 
  Users, Layers, ChevronLeft, ChevronRight, Edit3, 
  Trash2, Info, CheckCircle2, AlertTriangle, Filter, Search
} from 'lucide-react';

interface BlackoutPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  appliesTo: 'All' | string[];
  typesBlocked: 'All' | string[];
  allowExceptions: boolean;
  status: 'Active' | 'Upcoming' | 'Expired';
  reason: string;
}

const MOCK_BLACKOUTS: BlackoutPeriod[] = [
  { 
    id: 'BK-001', name: 'Year-End Financial Close', startDate: '2024-12-25', endDate: '2025-01-05', 
    appliesTo: ['Finance', 'Accounts'], typesBlocked: 'All', allowExceptions: false, 
    status: 'Expired', reason: 'Critical reporting window for annual audit prep.' 
  },
  { 
    id: 'BK-002', name: 'Annual Strategy Retreat', startDate: '2025-02-15', endDate: '2025-02-20', 
    appliesTo: 'All', typesBlocked: ['Annual Leave', 'Casual Leave'], allowExceptions: true, 
    status: 'Upcoming', reason: 'Mandatory attendance for all staff planning sessions.' 
  },
  { 
    id: 'BK-003', name: 'Software Launch Freeze', startDate: '2025-03-01', endDate: '2025-03-15', 
    appliesTo: ['Engineering', 'Product', 'QA'], typesBlocked: 'All', allowExceptions: true, 
    status: 'Upcoming', reason: 'Code freeze period for major v4.0 release.' 
  },
  { 
    id: 'BK-004', name: 'Warehouse Stock Take', startDate: '2025-01-20', endDate: '2025-01-22', 
    appliesTo: ['Logistics', 'Operations'], typesBlocked: 'All', allowExceptions: false, 
    status: 'Active', reason: 'Bi-annual inventory verification process.' 
  },
];

export const BlackoutPeriods = () => {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<BlackoutPeriod | null>(null);

  const handleEdit = (period: BlackoutPeriod) => {
    setEditingPeriod(period);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-50 text-red-600 border-red-100';
      case 'Upcoming': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Expired': return 'bg-gray-100 text-gray-400 border-gray-200';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Blackout Periods</h2>
          <p className="text-gray-500 font-medium">Prevent leave applications during critical business cycles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg transition-all ${view === 'calendar' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <CalendarIcon size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={() => { setEditingPeriod(null); setIsModalOpen(true); }}
            className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all"
          >
            <Plus size={18} /> Create Blackout
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blackout Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applies To</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blocked Types</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Exceptions</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_BLACKOUTS.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{p.id}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-gray-700">{p.startDate}</div>
                      <div className="text-[10px] text-gray-400">to {p.endDate}</div>
                    </td>
                    <td className="px-8 py-5">
                      {p.appliesTo === 'All' ? (
                        <span className="px-2 py-0.5 bg-indigo-50 text-[#3E3B6F] text-[10px] font-bold rounded uppercase">All Staff</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {p.appliesTo.map(d => (
                            <span key={d} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded">{d}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {p.typesBlocked === 'All' ? (
                        <span className="text-xs font-bold text-red-500">All Leave Types</span>
                      ) : (
                        <span className="text-xs font-medium text-gray-600">{p.typesBlocked.join(', ')}</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-bold ${p.allowExceptions ? 'text-emerald-500' : 'text-gray-300'}`}>
                        {p.allowExceptions ? 'ALLOWED' : 'STRICT'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100 transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronLeft size={20}/></button>
               <h3 className="text-2xl font-bold text-[#3E3B6F]">February 2025</h3>
               <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronRight size={20}/></button>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded" /> Strictly Blocked</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-200 rounded" /> Exceptions Allowed</div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
              <div key={d} className="bg-gray-50 py-3 text-center text-[10px] font-bold text-gray-400">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isBlackout = day >= 15 && day <= 20;
              const isStrict = day === 20; // Mock data
              return (
                <div key={i} className={`h-24 bg-white p-3 group relative transition-all ${isBlackout ? 'cursor-help' : ''}`}>
                  <span className={`text-xs font-bold ${isBlackout ? 'text-red-600' : 'text-gray-400'}`}>{day}</span>
                  {isBlackout && (
                    <div className={`absolute inset-x-0 bottom-0 h-1 ${isStrict ? 'bg-red-500' : 'bg-red-200'}`} />
                  )}
                  {isBlackout && (
                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                       <p className="text-[9px] font-bold text-red-700 leading-tight">Annual Strategy Retreat</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blackout Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-[550px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><ShieldAlert size={24}/></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{editingPeriod ? 'Edit Blackout Period' : 'New Blackout Period'}</h3>
                  <p className="text-xs text-gray-400 font-medium">Configure date-based restrictions.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-modal-scroll">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name / Reference *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Year-End Close 2025" 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold"
                  defaultValue={editingPeriod?.name}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                  <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" defaultValue={editingPeriod?.startDate} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                  <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" defaultValue={editingPeriod?.endDate} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Departments</label>
                <select className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-gray-200">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Sales & Marketing</option>
                  <option>Operations</option>
                  <option>Finance</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blocked Leave Types</label>
                <div className="flex flex-wrap gap-2">
                  {['Annual', 'Casual', 'Sick', 'Study'].map(t => (
                    <button key={t} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 transition-all border border-gray-200">
                      {t} Leave
                    </button>
                  ))}
                  <button className="px-3 py-1.5 bg-[#3E3B6F] text-white rounded-lg text-xs font-bold shadow-sm">Block All Types</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div>
                   <p className="text-sm font-bold text-gray-800">Allow Exceptions?</p>
                   <p className="text-[10px] text-gray-400">If enabled, requests will require HQ HR approval.</p>
                </div>
                <button className="w-12 h-6 bg-[#3E3B6F] rounded-full relative">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal Reasoning</label>
                <textarea rows={3} className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none resize-none" placeholder="Why is this period restricted?" defaultValue={editingPeriod?.reason} />
              </div>
            </div>

            <div className="bg-gray-50 p-10 border-t border-gray-100 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-white rounded-xl transition-all">Cancel</button>
              <button className="flex-[2] bg-[#3E3B6F] text-white py-3 rounded-xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all">
                {editingPeriod ? 'Update Restriction' : 'Save Blackout Period'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
