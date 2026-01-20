
import React, { useState } from 'react';
import { 
  UserPlus, Calendar, CheckSquare, Clock, History, 
  X, Search, ChevronRight, RotateCcw, AlertCircle, 
  CheckCircle2, Mail, Users, Filter, ArrowRight
} from 'lucide-react';

interface DelegationRecord {
  id: string;
  fromUser: string;
  toUser: string;
  avatar: string;
  startDate: string;
  endDate: string;
  types: string[];
  status: 'Active' | 'Pending' | 'Completed' | 'Declined';
  itemsProcessed?: number;
}

const MOCK_DELEGATED_TO_ME: DelegationRecord[] = [
  { 
    id: 'DEL-881', fromUser: 'Farhan Ali', toUser: 'John Doe', avatar: 'FA', 
    startDate: '2025-02-15', endDate: '2025-02-20', 
    types: ['Leave Requests', 'Comp-Off'], status: 'Pending' 
  }
];

const MOCK_HISTORY: DelegationRecord[] = [
  { 
    id: 'DEL-501', fromUser: 'John Doe', toUser: 'Sara Ahmed', avatar: 'SA', 
    startDate: '2024-12-20', endDate: '2024-12-28', 
    types: ['All Types'], status: 'Completed', itemsProcessed: 12 
  },
  { 
    id: 'DEL-402', fromUser: 'John Doe', toUser: 'Ahmed Khan', avatar: 'AK', 
    startDate: '2024-06-10', endDate: '2024-06-15', 
    types: ['Leave Requests'], status: 'Completed', itemsProcessed: 5 
  }
];

export const DelegationSettings = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeDelegation, setActiveDelegation] = useState<DelegationRecord | null>({
    id: 'DEL-990', fromUser: 'John Doe', toUser: 'Sara Ahmed', avatar: 'SA',
    startDate: '2025-01-20', endDate: '2025-01-25',
    types: ['All Requests'], status: 'Active'
  });

  const [formData, setFormData] = useState({
    delegateTo: '',
    startDate: '',
    endDate: '',
    typeMode: 'all',
    selectedTypes: ['Leave'],
    reason: '',
    notify: true
  });

  const requestTypes = ['Leave', 'Comp-Off', 'OD/Travel', 'Encashment', 'Balance Adjustment'];

  const handleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type) 
        ? prev.selectedTypes.filter(t => t !== type) 
        : [...prev.selectedTypes, type]
    }));
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Delegation Settings</h2>
          <p className="text-gray-500">Assign your approval authority to others when you are away.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all"
        >
          <UserPlus size={18} /> Set Up Delegation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Delegation Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <RotateCcw size={16} /> My Delegations
            </h3>
            
            {activeDelegation ? (
              <div className="bg-white border-2 border-indigo-100 rounded-3xl p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wider animate-pulse">
                    Live Status: Active
                  </span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-accent-peach flex items-center justify-center text-[#3E3B6F] text-xl font-bold">
                    {activeDelegation.avatar}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Delegated to {activeDelegation.toUser}</h4>
                      <p className="text-sm text-gray-500 font-medium">Jan 20, 2025 — Jan 25, 2025</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeDelegation.types.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-lg border border-gray-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Modify</button>
                    <button 
                      onClick={() => setActiveDelegation(null)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                    >
                      End Now
                    </button>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3 text-amber-600 text-xs font-medium">
                  <AlertCircle size={16} />
                  Approvals you receive during this period will automatically appear in {activeDelegation.toUser}'s inbox.
                </div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">No Active Delegations</h4>
                  <p className="text-sm text-gray-400">You are currently processing all your own approvals.</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="text-[#3E3B6F] font-bold text-sm hover:underline">Click to set up now</button>
              </div>
            )}
          </section>

          {/* Delegated to Me Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} /> Delegated To Me
            </h3>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">From Approver</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Range</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Types</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_DELEGATED_TO_ME.map(del => (
                    <tr key={del.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-cream flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">{del.avatar}</div>
                          <span className="text-sm font-bold text-gray-800">{del.fromUser}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                        {del.startDate} to {del.endDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {del.types.map(t => (
                            <span key={t} className="text-[9px] font-bold text-[#3E3B6F] px-1.5 py-0.5 bg-indigo-50 rounded uppercase">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded tracking-wider">
                          {del.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"><CheckCircle2 size={16}/></button>
                          <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"><X size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* History Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <History size={16} /> Delegation History
            </h3>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Range</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delegate</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items Processed</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_HISTORY.map(del => (
                    <tr key={del.id}>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500">{del.startDate} - {del.endDate}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{del.toUser}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#3E3B6F]">{del.itemsProcessed}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{del.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Form Column */}
        <div className="space-y-8">
          {isFormOpen ? (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
              <div className="bg-primary-gradient p-8 text-white flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold">New Delegation</h4>
                  <p className="text-white/60 text-xs mt-1">Assign your approval tasks.</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Delegate To *</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search employee name..." 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">From Date</label>
                    <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">To Date</label>
                    <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Request Types</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" name="typeMode" 
                        checked={formData.typeMode === 'all'} 
                        onChange={() => setFormData(p => ({...p, typeMode: 'all'}))}
                        className="w-4 h-4 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#3E3B6F]">All Request Types</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" name="typeMode" 
                        checked={formData.typeMode === 'specific'} 
                        onChange={() => setFormData(p => ({...p, typeMode: 'specific'}))}
                        className="w-4 h-4 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#3E3B6F]">Specific Types</span>
                    </label>
                  </div>
                  
                  {formData.typeMode === 'specific' && (
                    <div className="grid grid-cols-2 gap-2 pl-7 animate-in fade-in duration-200">
                      {requestTypes.map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.selectedTypes.includes(type)}
                            onChange={() => handleTypeToggle(type)}
                            className="w-3.5 h-3.5 rounded text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                          />
                          <span className="text-xs text-gray-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Reason (Optional)</label>
                  <textarea rows={2} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20 resize-none" placeholder="Vacation, conference, etc." />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-xs font-bold text-gray-600">Notify delegate via email/app</span>
                </div>

                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="w-full bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all active:scale-[0.98]"
                >
                  Save Delegation
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delegation Logic</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><CheckSquare size={16}/></div>
                  <p className="text-xs text-gray-600 leading-relaxed"><span className="font-bold text-gray-900">Final Authority:</span> Delegated decisions are legally binding and recorded as processed "on behalf of".</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Clock size={16}/></div>
                  <p className="text-xs text-gray-600 leading-relaxed"><span className="font-bold text-gray-900">Duration:</span> Delegations automatically expire at 11:59 PM on the end date.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Mail size={16}/></div>
                  <p className="text-xs text-gray-600 leading-relaxed"><span className="font-bold text-gray-900">Visibility:</span> Your manager will be notified whenever you set up a delegation.</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 text-center">
                 <button className="text-xs font-bold text-[#3E3B6F] hover:underline flex items-center gap-2 mx-auto">
                   View Full Policy <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          )}

          <div className="bg-primary-gradient rounded-3xl p-10 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-4">
               <h4 className="text-xl font-bold">Need a long-term proxy?</h4>
               <p className="text-sm text-white/60">For permanent approval authority changes, please contact the HR System Administrator.</p>
               <button className="bg-[#E8D5A3] text-[#3E3B6F] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-lg">Contact Admin</button>
             </div>
             <Calendar className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
