
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  History, 
  ArrowRightLeft, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  X, 
  CheckCircle2, 
  ChevronDown,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  // Added missing Plus icon
  Plus
} from 'lucide-react';

type ViewMode = 'BY_EMPLOYEE' | 'BY_SHIFT';

interface Assignment {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  currentShift: string;
  shiftTiming: string;
  effectiveDate: string;
  calendar: string;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: '1', employeeName: 'Sarah Jenkins', employeeId: 'FLX-001', department: 'Engineering', currentShift: 'Morning Shift', shiftTiming: '09:00 AM - 06:00 PM', effectiveDate: 'Jan 01, 2025', calendar: 'Standard 5-Day' },
  { id: '2', employeeName: 'Michael Chen', employeeId: 'FLX-024', department: 'Product', currentShift: 'General Flexi', shiftTiming: '8h Window', effectiveDate: 'Jan 10, 2025', calendar: 'Standard 5-Day' },
  { id: '3', employeeName: 'Amara Okafor', employeeId: 'FLX-112', department: 'Design', currentShift: 'Morning Shift', shiftTiming: '09:00 AM - 06:00 PM', effectiveDate: 'Jan 01, 2025', calendar: 'Creative Flex' },
  { id: '4', employeeName: 'David Miller', employeeId: 'FLX-089', department: 'Engineering', currentShift: 'Night Shift', shiftTiming: '10:00 PM - 07:00 AM', effectiveDate: 'Dec 15, 2024', calendar: 'Standard 5-Day' },
  { id: '5', employeeName: 'Elena Rodriguez', employeeId: 'FLX-045', department: 'Operations', currentShift: 'Unassigned', shiftTiming: '--', effectiveDate: '--', calendar: '--' },
];

const SHIFT_SUMMARY = [
  { name: 'Morning Shift', timing: '9 AM - 6 PM', count: 250, color: 'text-blue-600 bg-blue-50' },
  { name: 'Evening Shift', timing: '2 PM - 11 PM', count: 120, color: 'text-purple-600 bg-purple-50' },
  { name: 'Night Shift', timing: '10 PM - 7 AM', count: 45, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'General Flexi', timing: 'Flexible', count: 85, color: 'text-green-600 bg-green-50' },
];

export const ShiftAssignment: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('BY_EMPLOYEE');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkStep, setBulkStep] = useState(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <UserPlus className="text-[#3E3B6F]" size={28} /> Shift Assignment
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Assign work schedules and calendars to your workforce</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('BY_EMPLOYEE')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'BY_EMPLOYEE' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <List size={14} /> By Employee
            </button>
            <button 
              onClick={() => setViewMode('BY_SHIFT')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'BY_SHIFT' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <LayoutGrid size={14} /> By Shift
            </button>
          </div>
          <button 
            onClick={() => { setIsBulkModalOpen(true); setBulkStep(1); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Bulk Assign
          </button>
        </div>
      </div>

      {viewMode === 'BY_EMPLOYEE' ? (
        <>
          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search employee..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none" />
            </div>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Product</option>
            </select>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none">
              <option>All Shifts</option>
              <option>Unassigned Only</option>
            </select>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Filter size={18}/></button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Employee</th>
                    <th className="px-6 py-5">Department</th>
                    <th className="px-6 py-5">Current Shift</th>
                    <th className="px-6 py-5">Work Calendar</th>
                    <th className="px-6 py-5 text-center">Effective Date</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ASSIGNMENTS.map((row) => (
                    <tr key={row.id} className="group hover:bg-gray-50/80 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#3E3B6F]/5 flex items-center justify-center text-[10px] font-black text-[#3E3B6F] border border-[#3E3B6F]/10">
                            {row.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{row.employeeName}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{row.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-gray-600">{row.department}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold w-fit ${row.currentShift === 'Unassigned' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-700'}`}>
                            {row.currentShift}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium mt-1 tabular-nums">{row.shiftTiming}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 group/link cursor-pointer">
                          <Calendar size={14} className="text-gray-400 group-hover/link:text-[#3E3B6F]" />
                          <span className="text-xs font-bold text-gray-600 group-hover/link:text-[#3E3B6F] underline decoration-gray-200">{row.calendar}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[11px] font-bold text-gray-500 tabular-nums">{row.effectiveDate}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="Change Shift"><ArrowRightLeft size={16}/></button>
                          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="View Schedule"><Calendar size={16}/></button>
                          <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-lg transition-all" title="History"><History size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHIFT_SUMMARY.map((shift, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F] group-hover:scale-110 transition-transform">
                 <Clock size={80} />
               </div>
               <div className="flex flex-col h-full relative z-10">
                 <div className={`w-10 h-10 rounded-xl ${shift.color} flex items-center justify-center mb-4 shadow-sm`}>
                   <Clock size={20} />
                 </div>
                 <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{shift.name}</h3>
                 <p className="text-[10px] text-gray-400 font-bold mb-4">{shift.timing}</p>
                 
                 <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
                    <div>
                      <p className="text-2xl font-black text-[#3E3B6F] tabular-nums">{shift.count}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Assignments</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">View List</button>
                       <button className="p-2 bg-[#3E3B6F] text-white rounded-xl hover:scale-105 transition-all"><Plus size={16}/></button>
                    </div>
                 </div>
               </div>
            </div>
          ))}
          <div className="bg-gray-50 rounded-3xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#3E3B6F]/30 transition-all">
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-300 mb-4 group-hover:text-[#3E3B6F] transition-colors shadow-sm">
                <Plus size={24} />
             </div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-[#3E3B6F]">Create New Template</p>
          </div>
        </div>
      )}

      {/* BULK ASSIGN MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsBulkModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <UserPlus size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Bulk Assignment</h3>
                    <div className="flex items-center gap-2">
                       {[1, 2, 3].map(s => (
                         <div key={s} className={`h-1 rounded-full transition-all ${bulkStep >= s ? 'w-4 bg-[#3E3B6F]' : 'w-2 bg-gray-200'}`}></div>
                       ))}
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               {bulkStep === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Step 1: Target Audience Selection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-6 rounded-2xl border-2 border-[#3E3B6F] bg-[#3E3B6F]/5 space-y-3">
                          <Building2 className="text-[#3E3B6F]" size={24} />
                          <h5 className="font-bold text-gray-800 text-sm">By Criteria</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Assign based on Department, Grade, or Location.</p>
                       </div>
                       <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all space-y-3 bg-white">
                          <Upload className="text-gray-400" size={24} />
                          <h5 className="font-bold text-gray-800 text-sm">CSV Import</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Upload a list of specific employee IDs.</p>
                       </div>
                    </div>
                    <div className="space-y-4 pt-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Filters</label>
                       <div className="grid grid-cols-2 gap-4">
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                             <option>Department: Engineering</option>
                             <option>Department: All</option>
                          </select>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                             <option>Grade: E1 - E5</option>
                             <option>Grade: All</option>
                          </select>
                       </div>
                       <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-700">Employees Matching Criteria:</span>
                          <span className="text-lg font-black text-indigo-800">142</span>
                       </div>
                    </div>
                 </div>
               )}

               {bulkStep === 2 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Step 2: Define Shift Parameters</h4>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Shift Template *</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Morning Shift (9 AM - 6 PM)</option>
                             <option>Evening Shift (2 PM - 11 PM)</option>
                             <option>General Flexi</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective From *</label>
                          <input type="date" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" defaultValue="2025-01-01" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Calendar *</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Standard 5-Day (Mon-Fri)</option>
                             <option>Six-Day Week (Mon-Sat)</option>
                             <option>Rotational Roster</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Policy</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Enforce Site Geo-fence</option>
                             <option>Mobile Only</option>
                             <option>Biometric Required</option>
                          </select>
                       </div>
                    </div>
                 </div>
               )}

               {bulkStep === 3 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2 pb-6">
                       <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
                          <CheckCircle2 size={32} />
                       </div>
                       <h4 className="text-lg font-black text-gray-800 uppercase tracking-widest">Ready to Commit</h4>
                       <p className="text-xs font-medium text-gray-500">Please review the assignment summary before finalizing.</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                       <div className="p-4 flex justify-between items-center bg-white">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact Count</span>
                          <span className="text-sm font-black text-indigo-600">142 Employees</span>
                       </div>
                       <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Template</span>
                          <span className="text-sm font-bold text-gray-800">Morning Shift</span>
                       </div>
                       <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date</span>
                          <span className="text-sm font-bold text-gray-800">Jan 01, 2025</span>
                       </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                       <ShieldCheck className="text-amber-500 shrink-0" size={18} />
                       <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                         <span className="font-black">Notice:</span> This action will overwrite any existing shift assignments for the selected 142 employees starting from the effective date. This can be reverted via Version History.
                       </p>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               {bulkStep > 1 && (
                 <button onClick={() => setBulkStep(bulkStep - 1)} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                   Back
                 </button>
               )}
               <button 
                 onClick={() => {
                   if (bulkStep < 3) setBulkStep(bulkStep + 1);
                   else setIsBulkModalOpen(false);
                 }}
                 className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {bulkStep === 3 ? 'Confirm & Process' : 'Next Step'} <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
