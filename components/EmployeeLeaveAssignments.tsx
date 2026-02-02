import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Users, Edit3, Eye, Trash2, X, CheckCircle2, 
  AlertCircle, ChevronRight, Download, Sliders, Database, 
  ArrowRight, Info, Plus, User, Building, MapPin, Calendar,
  ShieldCheck, ArrowUpRight, CheckSquare, Layers, Save, AlertTriangle
} from 'lucide-react';

interface EmployeeAssignment {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  grade: string;
  joinDate: string;
  group: string;
  overrides: number;
  status: 'Complete' | 'Incomplete';
}

const MOCK_ASSIGNMENTS: EmployeeAssignment[] = Array.from({ length: 50 }, (_, i) => ({
  id: `EMP-${1000 + i}`,
  name: ['Ahmed Khan', 'Sara Miller', 'Tom Chen', 'Anna Bell', 'Zoya Malik', 'Ali Raza'][i % 6],
  avatar: ['AK', 'SM', 'TC', 'AB', 'ZM', 'AR'][i % 6],
  dept: ['Engineering', 'Product', 'Sales', 'HR', 'Design'][i % 5],
  grade: ['L1', 'L2', 'L3', 'M1', 'M2'][i % 5],
  joinDate: 'Jan 15, 2022',
  group: i % 4 === 0 ? 'Default' : i % 3 === 0 ? 'Management Tier' : 'Standard Full-Time',
  overrides: i % 7 === 0 ? 2 : 0,
  status: i % 10 === 0 ? 'Incomplete' : 'Complete',
}));

export const EmployeeLeaveAssignments = () => {
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeAssignment | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkStep, setBulkStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return MOCK_ASSIGNMENTS.filter(emp => 
      emp.name.toLowerCase().includes(search.toLowerCase()) || 
      emp.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Assignments</h2>
          <p className="text-gray-500 font-medium">Manage group eligibility and individual policy overrides for all staff.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => { setBulkStep(1); setIsBulkModalOpen(true); }}
            className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
          >
            <CheckSquare size={18} /> Bulk Assign
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or Employee ID..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none shadow-sm">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Product</option>
            </select>
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none shadow-sm">
              <option>Unassigned Only</option>
              <option>With Overrides</option>
              <option>Incomplete Settings</option>
            </select>
            <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#3E3B6F] transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dept / Grade</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eligibility Group</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom Settings</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedEmp(emp)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-700">{emp.dept}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{emp.grade}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      emp.group === 'Default' ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {emp.group}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {emp.overrides > 0 ? (
                      <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                        <Sliders size={14} /> +{emp.overrides} overrides
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">None</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      emp.status === 'Complete' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {emp.status === 'Complete' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2  transition-all" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setSelectedEmp(emp)} className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all"><Edit3 size={18}/></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer */}
      {selectedEmp && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedEmp(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[650px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
                  <Database size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">Manage Assignments</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedEmp.name} • {selectedEmp.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmp(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-modal-scroll">
              {/* Employee Header Info */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Department</p>
                    <p className="text-xs font-bold text-gray-800 flex items-center gap-2"><Building size={12} className="text-indigo-400"/> {selectedEmp.dept}</p>
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Grade / Level</p>
                    <p className="text-xs font-bold text-gray-800 flex items-center gap-2"><Layers size={12} className="text-indigo-400"/> {selectedEmp.grade}</p>
                 </div>
                 <div className="col-span-2 p-4 bg-white rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Join Date</p>
                    <p className="text-xs font-bold text-gray-800 flex items-center gap-2"><Calendar size={12} className="text-indigo-400"/> {selectedEmp.joinDate}</p>
                 </div>
              </div>

              {/* Eligibility Group Selector */}
              <section className="space-y-4">
                <label className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14}/> Eligibility Group
                </label>
                <div className="space-y-3">
                  <select 
                    className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-[#3E3B6F] outline-none transition-all font-bold text-[#3E3B6F] shadow-sm"
                    defaultValue={selectedEmp.group}
                  >
                    <option>Default</option>
                    <option>Standard Full-Time</option>
                    <option>Management Tier</option>
                    <option>Executive Staff</option>
                  </select>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <Info size={16} className="text-emerald-500 shrink-0" />
                    <p className="text-[11px] text-emerald-800 font-medium">Includes: Annual Leave (14d), Sick (12d), Casual (10d), Comp-Off (Manual)</p>
                  </div>
                </div>
              </section>

              {/* Custom Overrides */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                    <Sliders size={14}/> Custom Overrides
                  </label>
                  <button className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add Override
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase">Leave Type</th>
                        <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase">Group Value</th>
                        <th className="px-6 py-3 text-[9px] font-bold text-[#3E3B6F] uppercase">Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="px-6 py-4 text-xs font-bold text-gray-800">Annual Leave</td>
                        <td className="px-6 py-4 text-xs text-gray-400">14.0 days</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <input type="number" className="w-16 p-1 border rounded text-xs font-bold text-center text-[#3E3B6F]" defaultValue={16} />
                             <span className="text-[10px] text-gray-400 font-bold uppercase">Days</span>
                           </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-xs font-bold text-gray-800">Sick Leave</td>
                        <td className="px-6 py-4 text-xs text-gray-400">12.0 days</td>
                        <td className="px-6 py-4">
                           <button className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-all uppercase">
                             Create Override
                           </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-2">
                 <div className="flex items-center gap-2 text-amber-600">
                   <AlertCircle size={18} />
                   <h5 className="text-xs font-bold uppercase tracking-widest">Audit Tracking</h5>
                 </div>
                 <p className="text-xs text-amber-800/70 leading-relaxed font-medium">Changes to assignments are tracked. Effective date for new settings will be the next system cycle unless forced manually.</p>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-gray-100 flex gap-4 shrink-0">
               <button onClick={() => setSelectedEmp(null)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
               {/* Added missing Save icon import */}
               <button onClick={() => setSelectedEmp(null)} className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2">
                 <Save size={18} /> Save Changes
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBulkModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-[#3E3B6F] p-8 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/10 rounded-2xl"><CheckSquare size={24}/></div>
                 <div>
                    <h3 className="text-xl font-bold">Bulk Leave Assignment</h3>
                    <p className="text-white/60 text-xs mt-1">Process multiple employees simultaneously.</p>
                 </div>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <div className="p-8 border-b border-gray-100 flex justify-center gap-8 shrink-0">
               {[1, 2, 3].map(step => (
                 <div key={step} className={`flex items-center gap-3 ${bulkStep === step ? 'text-[#3E3B6F]' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                      bulkStep === step ? 'border-[#3E3B6F] bg-indigo-50 shadow-sm' : 'border-gray-200 bg-white'
                    }`}>
                      {step}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{step === 1 ? 'Select' : step === 2 ? 'Assign' : 'Confirm'}</span>
                 </div>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-modal-scroll">
               {bulkStep === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right-2">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department Filter</p>
                         <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none">
                           <option>All Departments</option>
                           <option>Engineering</option>
                           <option>Sales</option>
                         </select>
                       </div>
                       <div className="space-y-1.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grade Filter</p>
                         <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none">
                           <option>All Grades</option>
                           <option>L1 - L3</option>
                           <option>Managers</option>
                         </select>
                       </div>
                    </div>
                    <div className="border border-gray-100 rounded-3xl overflow-hidden max-h-64 overflow-y-auto">
                       {MOCK_ASSIGNMENTS.slice(0, 10).map(emp => (
                         <label key={emp.id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-0 cursor-pointer">
                            <div className="flex items-center gap-3">
                               <input 
                                type="checkbox" 
                                checked={selectedIds.includes(emp.id)}
                                onChange={() => toggleSelect(emp.id)}
                                className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                               />
                               <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">{emp.avatar}</div>
                               <div>
                                  <p className="text-xs font-bold text-gray-800">{emp.name}</p>
                                  <p className="text-[9px] text-gray-400">{emp.id} • {emp.dept}</p>
                               </div>
                            </div>
                            <span className="text-[9px] font-bold text-gray-300 uppercase">{emp.group}</span>
                         </label>
                       ))}
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                       <p className="text-xs font-bold text-[#3E3B6F]">{selectedIds.length} Staff Selected</p>
                    </div>
                 </div>
               )}

               {bulkStep === 2 && (
                 <div className="space-y-8 animate-in slide-in-from-right-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Eligibility Group *</label>
                      <select className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-[#3E3B6F]">
                        <option>Standard Full-Time</option>
                        <option>Management Tier</option>
                        <option>Temporary / Intern</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Effective From *</label>
                      <input type="date" className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none font-bold text-gray-800" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    {/* Added missing AlertTriangle icon import */}
                    <div className="p-6 bg-amber-50 rounded-[32px] border border-amber-100 flex items-start gap-4">
                       <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                       <p className="text-xs text-amber-800 font-medium leading-relaxed">
                         Bulk assignment will <span className="font-bold">reset any existing individual overrides</span> for the selected employees unless specified otherwise.
                       </p>
                    </div>
                 </div>
               )}

               {bulkStep === 3 && (
                 <div className="text-center space-y-6 animate-in slide-in-from-right-2">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle2 size={40} />
                    </div>
                    <div>
                       <h4 className="text-2xl font-bold text-gray-900">Ready to Process</h4>
                       <p className="text-sm text-gray-500 mt-1">Review the details below before confirming.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left">
                       <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Target Group</p>
                          <p className="text-sm font-bold text-[#3E3B6F]">Standard Full-Time</p>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Staff Impacted</p>
                          <p className="text-sm font-bold text-[#3E3B6F]">{selectedIds.length} Employees</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
               {bulkStep > 1 && (
                 <button onClick={() => setBulkStep(bulkStep - 1)} className="px-6 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all">Back</button>
               )}
               <button 
                onClick={() => {
                  if (bulkStep === 3) {
                    setIsBulkModalOpen(false);
                    setBulkStep(1);
                    setSelectedIds([]);
                  } else {
                    setBulkStep(bulkStep + 1);
                  }
                }}
                disabled={bulkStep === 1 && selectedIds.length === 0}
                className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50"
               >
                 {bulkStep === 3 ? 'Confirm Assignment' : 'Next Step'}
               </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
};