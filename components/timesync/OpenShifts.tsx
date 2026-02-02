import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight, 
  AlertCircle, 
  X, 
  ArrowRight, 
  Timer, 
  Zap, 
  MoreVertical,
  History
} from 'lucide-react';

type ClaimMode = 'FIRST_COME' | 'APPROVAL' | 'BIDDING';

interface OpenShift {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  slots: number;
  available: number;
  claimsPending: number;
  closesAt: string;
  mode: ClaimMode;
  otRate: string;
}

interface Claim {
  id: string;
  employee: string;
  avatar: string;
  claimedAt: string;
  status: 'PENDING' | 'ASSIGNED' | 'REJECTED' | 'WAITLIST';
  eligibility: {
    skill: boolean;
    hours: boolean;
    rest: boolean;
  };
}

const MOCK_OPEN_SHIFTS: OpenShift[] = [
  { id: 'OS-101', name: 'Morning Shift', date: 'Jan 15, 2025', time: '9:00 AM - 6:00 PM', location: 'Office HQ', slots: 5, available: 2, claimsPending: 5, closesAt: 'Jan 13, 6:00 PM', mode: 'APPROVAL', otRate: '1.5x' },
  { id: 'OS-102', name: 'Night Shift', date: 'Jan 16, 2025', time: '10:00 PM - 7:00 AM', location: 'Warehouse A', slots: 3, available: 3, claimsPending: 2, closesAt: 'Jan 14, 8:00 PM', mode: 'FIRST_COME', otRate: '2.0x' },
  { id: 'OS-103', name: 'Evening Shift', date: 'Jan 15, 2025', time: '2:00 PM - 11:00 PM', location: 'Retail Hub', slots: 2, available: 1, claimsPending: 8, closesAt: 'Jan 13, 10:00 AM', mode: 'BIDDING', otRate: '1.5x' },
  { id: 'OS-104', name: 'Weekend Support', date: 'Jan 18, 2025', time: '10:00 AM - 4:00 PM', location: 'Remote', slots: 10, available: 8, claimsPending: 0, closesAt: 'Jan 17, 12:00 PM', mode: 'APPROVAL', otRate: '1.5x' },
  { id: 'OS-105', name: 'Ramzan Special', date: 'Mar 10, 2025', time: '9:00 AM - 4:00 PM', location: 'All Sites', slots: 15, available: 15, claimsPending: 0, closesAt: 'Mar 01, 6:00 PM', mode: 'APPROVAL', otRate: 'None' },
];

const MOCK_CLAIMS: Claim[] = [
  { id: 'C1', employee: 'Ahmed Khan', avatar: 'AK', claimedAt: '2 min ago', status: 'PENDING', eligibility: { skill: true, hours: true, rest: true } },
  { id: 'C2', employee: 'Sarah Chen', avatar: 'SC', claimedAt: '15 min ago', status: 'PENDING', eligibility: { skill: true, hours: false, rest: true } },
  { id: 'C3', employee: 'Michael Chen', avatar: 'MC', claimedAt: '1h ago', status: 'PENDING', eligibility: { skill: true, hours: true, rest: false } },
  { id: 'C4', employee: 'Amara Okafor', avatar: 'AO', claimedAt: '3h ago', status: 'WAITLIST', eligibility: { skill: false, hours: true, rest: true } },
];

export const OpenShifts: React.FC = () => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<OpenShift | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Users className="text-[#3E3B6F]" size={28} /> Open Shifts
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Publish and manage unfilled shift slots for employee claiming</p>
        </div>
        <button 
          onClick={() => setIsPublishModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Publish Open Shift
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* PUBLISHED SHIFTS GRID */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_OPEN_SHIFTS.map((shift) => (
              <div 
                key={shift.id} 
                className={`bg-white rounded-3xl border-2 transition-all p-6 flex flex-col group hover:shadow-xl ${selectedShift?.id === shift.id ? 'border-[#3E3B6F] ring-4 ring-[#3E3B6F]/5' : 'border-gray-100'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">{shift.name}</h3>
                    <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-0.5">{shift.date}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 text-[#3E3B6F] border border-gray-100`}>
                    <Clock size={20} />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <Timer size={14} className="text-gray-300" />
                    <span>{shift.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <MapPin size={14} className="text-gray-300" />
                    <span>{shift.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Slots Available</p>
                    <p className="text-sm font-black text-gray-800">{shift.available} / {shift.slots}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100">
                    <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Pending Claims</p>
                    <p className="text-sm font-black text-indigo-700">{shift.claimsPending}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle size={14} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Closes: <span className="text-gray-600">{shift.closesAt}</span>
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                  <button 
                    onClick={() => setSelectedShift(shift)}
                    className="flex-1 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    View Claims
                  </button>
                  <button className="px-3 py-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                    <X size={18} />
                  </button>
                  <button className="px-3 py-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-[#3E3B6F] transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CLAIMS MANAGEMENT SIDEBAR */}
        <div className="space-y-6">
          {selectedShift ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest">Shift Claims</h3>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{selectedShift.name} • {selectedShift.id}</p>
                </div>
                <button onClick={() => setSelectedShift(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-all"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {MOCK_CLAIMS.map((claim) => (
                  <div key={claim.id} className="p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[11px] font-black shadow-lg">
                        {claim.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-800 truncate">{claim.employee}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Claimed {claim.claimedAt}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        claim.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {claim.status}
                      </span>
                    </div>

                    {/* ELIGIBILITY CHECKS */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 ${claim.eligibility.skill ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <ShieldCheck size={14} />
                        <span className="text-[8px] font-black uppercase">Skill</span>
                      </div>
                      <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 ${claim.eligibility.hours ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <Clock size={14} />
                        <span className="text-[8px] font-black uppercase">Hours</span>
                      </div>
                      <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 ${claim.eligibility.rest ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <History size={14} />
                        <span className="text-[8px] font-black uppercase">Rest</span>
                      </div>
                    </div>

                    <div className="flex gap-2  transition-all">
                      <button className="flex-1 py-2 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-600">Assign</button>
                      <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-50">Waitlist</button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all"><X size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Automatic Mode</span>
                  <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 active:scale-95 transition-all">
                  Process All Pending
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center opacity-30 min-h-[500px]">
              <UserCheck size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest">Claim Center</h3>
              <p className="text-xs font-medium text-gray-400 mt-2 max-w-[200px]">Select a published open shift to manage employee claims and eligibility.</p>
            </div>
          )}
        </div>
      </div>

      {/* PUBLISH MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsPublishModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg shadow-[#3E3B6F]/20">
                    <Zap size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Publish Open Shift</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Recruit Internal Staff for Unfilled Slots</p>
                 </div>
              </div>
              <button onClick={() => setIsPublishModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Shift *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-[#3E3B6F]/5">
                      <option>Morning Shift (9 AM - 6 PM)</option>
                      <option>Evening Shift (2 PM - 11 PM)</option>
                      <option>Night Shift (10 PM - 7 AM)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Date(s) *</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" defaultValue="2025-01-15" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                      <option>Office HQ</option>
                      <option>Warehouse A</option>
                      <option>Retail Hub</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slots Available *</label>
                    <input type="number" defaultValue="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OT Multiplier</label>
                    <input type="text" defaultValue="1.5x" className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl px-4 py-2 text-xs font-black outline-none" />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Claim Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['First-come', 'Approval Req.', 'Bidding'].map((m, i) => (
                      <button key={m} className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${i === 1 ? 'border-[#3E3B6F] bg-[#3E3B6F]/5 text-[#3E3B6F]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eligibility</label>
                    <div className="space-y-2">
                      {['All Employees', 'Specific Skills', 'Selected Depts'].map((e, i) => (
                        <label key={e} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                          <input type="radio" name="elig" defaultChecked={i === 0} className="w-4 h-4 text-[#3E3B6F]" />
                          <span className="text-xs font-bold text-gray-700">{e}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Closes By *</label>
                    <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                    <p className="text-[9px] text-gray-400 font-medium italic mt-2">Shift will automatically close for claims at this time.</p>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsPublishModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Publish Open Shift
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};