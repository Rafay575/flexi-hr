
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MoreVertical, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Building2,
  CalendarRange,
  Clock,
  MapPin,
  Upload,
  UserPlus
} from 'lucide-react';

interface EmployeeCalendarLink {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  holidayCalendar: string;
  weeklyOff: string;
  altSaturday: string;
  effectiveDate: string;
  avatar: string;
}

const MOCK_ASSIGNMENTS: EmployeeCalendarLink[] = [
  { id: '1', name: 'Sarah Jenkins', employeeId: 'FLX-001', department: 'Engineering', holidayCalendar: 'Pakistan 2025', weeklyOff: 'Sat-Sun Off', altSaturday: 'Every 2nd/4th Off', effectiveDate: 'Jan 01, 2025', avatar: 'SJ' },
  { id: '2', name: 'Michael Chen', employeeId: 'FLX-024', department: 'Product', holidayCalendar: 'UK/Europe 2025', weeklyOff: 'Sat-Sun Off', altSaturday: 'None', effectiveDate: 'Jan 10, 2025', avatar: 'MC' },
  { id: '3', name: 'Amara Okafor', employeeId: 'FLX-112', department: 'Design', holidayCalendar: 'Pakistan 2025', weeklyOff: 'Sunday Only', altSaturday: 'None', effectiveDate: 'Jan 01, 2025', avatar: 'AO' },
  { id: '4', name: 'David Miller', employeeId: 'FLX-089', department: 'Engineering', holidayCalendar: 'Pakistan 2025', weeklyOff: 'Rotating 5-2', altSaturday: 'None', effectiveDate: 'Dec 15, 2024', avatar: 'DM' },
  { id: '5', name: 'Elena Rodriguez', employeeId: 'FLX-045', department: 'Operations', holidayCalendar: 'Unassigned', weeklyOff: 'Unassigned', altSaturday: 'Unassigned', effectiveDate: '--', avatar: 'ER' },
];

export const CalendarAssignment: React.FC = () => {
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<EmployeeCalendarLink | null>(null);
  const [bulkStep, setBulkStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_ASSIGNMENTS.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleEdit = (emp: EmployeeCalendarLink) => {
    setSelectedEmp(emp);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarRange className="text-[#3E3B6F]" size={28} /> Calendar Assignment
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Map holidays and weekly rest patterns to the global workforce</p>
        </div>
        <button 
          onClick={() => { setBulkStep(1); setIsBulkOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Bulk Assign
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search employee or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none" 
          />
        </div>
        <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Marketing</option>
        </select>
        <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none">
          <option>All Statuses</option>
          <option>Unassigned Only</option>
        </select>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Filter size={18}/></button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Employee</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">Holiday Calendar</th>
                <th className="px-6 py-5">Weekly Off</th>
                <th className="px-6 py-5">Alt Saturday</th>
                <th className="px-6 py-5 text-center">Effective</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((row) => (
                <tr key={row.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100">
                        {row.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{row.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{row.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[11px] font-medium text-gray-500">{row.department}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${row.holidayCalendar === 'Unassigned' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                      {row.holidayCalendar}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${row.weeklyOff === 'Unassigned' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {row.weeklyOff}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${row.altSaturday === 'Unassigned' ? 'bg-red-50 text-red-600' : row.altSaturday === 'None' ? 'bg-gray-50 text-gray-400' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                      {row.altSaturday}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] font-bold text-gray-500 tabular-nums">{row.effectiveDate}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(row)} className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="Individual Assignment"><UserPlus size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INDIVIDUAL EDIT MODAL */}
      {isEditOpen && selectedEmp && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <UserPlus size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Edit Personal Roster</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Employee: {selectedEmp.name} ({selectedEmp.employeeId})</p>
                 </div>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-5 gap-10">
               {/* FORM SIDE */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Holiday Calendar *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-[#3E3B6F]/5">
                       <option>Pakistan Standard Holidays 2025</option>
                       <option>UK/Europe Engineering</option>
                       <option>None (All Days Working)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weekly Off Rule *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                       <option>Sat-Sun Standard Off</option>
                       <option>Friday Only (Middle East)</option>
                       <option>Sunday Only Retail</option>
                       <option>Rotating 5-2 Cycle</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alternate Saturday Rule</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                       <option>None (Rule default)</option>
                       <option>Every 2nd & 4th Saturday OFF</option>
                       <option>1st & 3rd Saturday WORKING</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date *</label>
                    <input type="date" defaultValue="2025-01-01" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  </div>

                  <div className="p-4 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-2xl">
                     <div className="flex gap-3">
                        <ShieldCheck className="text-[#3E3B6F] shrink-0" size={18} />
                        <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                          Changes will trigger a background update for the next 3 months of the employee's work schedule.
                        </p>
                     </div>
                  </div>
               </div>

               {/* PREVIEW SIDE */}
               <div className="lg:col-span-3 space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Schedule Preview (Next 30 Days)
                  </h4>
                  <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6">
                     <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const date = new Date(2025, 0, i + 1);
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          return (
                            <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg border shadow-sm transition-all ${
                              isWeekend ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-white text-gray-800'
                            }`}>
                               <span className="text-[8px] font-black uppercase opacity-40">{date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,1)}</span>
                               <span className="text-[11px] font-black">{i+1}</span>
                            </div>
                          );
                        })}
                     </div>
                     <div className="mt-6 flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white border border-gray-200"></div><span className="text-[9px] font-black text-gray-400 uppercase">Working</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-200"></div><span className="text-[9px] font-black text-gray-400 uppercase">Rest Day</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-400"></div><span className="text-[9px] font-black text-gray-400 uppercase">Holiday</span></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsEditOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Discard
               </button>
               <button className="flex-[2] py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Apply Personal Calendar
               </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ASSIGN MODAL */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsBulkOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <CalendarRange size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Bulk Assignment</h3>
                    <div className="flex items-center gap-2 mt-1">
                       {[1, 2, 3].map(s => (
                         <div key={s} className={`h-1 rounded-full transition-all ${bulkStep >= s ? 'w-4 bg-[#3E3B6F]' : 'w-2 bg-gray-200'}`}></div>
                       ))}
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsBulkOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               {bulkStep === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Step 1: Selection Scope</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-6 rounded-2xl border-2 border-[#3E3B6F] bg-[#3E3B6F]/5 space-y-3">
                          <Building2 className="text-[#3E3B6F]" size={24} />
                          <h5 className="font-bold text-gray-800 text-sm">By Department</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Assign a uniform calendar to a whole department.</p>
                       </div>
                       <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all space-y-3 bg-white">
                          <Upload className="text-gray-400" size={24} />
                          <h5 className="font-bold text-gray-800 text-sm">CSV Import</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Bulk map specific rules to Employee IDs.</p>
                       </div>
                    </div>
                    <div className="space-y-4 pt-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Filters</label>
                       <div className="grid grid-cols-2 gap-4">
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                             <option>Dept: Engineering</option>
                             <option>Dept: All</option>
                          </select>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                             <option>Site: Karachi HQ</option>
                             <option>Site: All</option>
                          </select>
                       </div>
                    </div>
                 </div>
               )}

               {bulkStep === 2 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Step 2: Map Policies</h4>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Holiday Calendar *</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Pakistan Standard 2025</option>
                             <option>UK Standard 2025</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weekly Off Rule *</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Sat-Sun Standard</option>
                             <option>Fixed Sunday</option>
                          </select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective From *</label>
                       <input type="date" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" defaultValue="2025-01-01" />
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
                       <p className="text-xs font-medium text-gray-500">Please review the bulk assignment summary.</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                       <div className="p-4 flex justify-between items-center bg-white">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact Count</span>
                          <span className="text-sm font-black text-[#3E3B6F]">350 Employees</span>
                       </div>
                       <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rules Mapping</span>
                          <span className="text-[11px] font-bold text-gray-800">PK-2025 + SatSun-Fixed</span>
                       </div>
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
                   else setIsBulkOpen(false);
                 }}
                 className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {bulkStep === 3 ? 'Execute Mapping' : 'Next Step'} <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
