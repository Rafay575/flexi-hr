import React, { useState } from 'react';
import { 
  BarChart3, PieChart, Clock, DollarSign, Zap, Plane, 
  Calendar, ShieldAlert, FileText, Download, FileSpreadsheet,
  ChevronRight, CalendarDays, Users, Building, Search,
  RefreshCw, CheckCircle2, MoreHorizontal, Settings, X, 
  ArrowUpRight, ListFilter, Play
} from 'lucide-react';

interface ReportType {
  id: string;
  label: string;
  icon: any;
  desc: string;
  color: string;
}

const REPORT_TYPES: ReportType[] = [
  { id: 'balance', label: 'Leave Balance Report', icon: BarChart3, desc: 'Current entitlements across all active staff.', color: 'text-blue-500 bg-blue-50' },
  { id: 'utilization', label: 'Leave Utilization Report', icon: PieChart, desc: 'Analysis of leave trends and team absence rates.', color: 'text-purple-500 bg-purple-50' },
  { id: 'pending', label: 'Pending Requests Report', icon: Clock, desc: 'Audit of applications awaiting manager/HR action.', color: 'text-amber-500 bg-amber-50' },
  { id: 'encashment', label: 'Encashment Report', icon: DollarSign, desc: 'Liquidation records for payroll processing.', color: 'text-emerald-500 bg-emerald-50' },
  { id: 'compoff', label: 'Comp-Off Report', icon: Zap, desc: 'Earned credits and expiry tracking.', color: 'text-indigo-500 bg-indigo-50' },
  { id: 'od', label: 'OD/Travel Report', icon: Plane, desc: 'Out-of-office assignments and business travel.', color: 'text-orange-500 bg-orange-50' },
  { id: 'accrual', label: 'Accrual Summary Report', icon: RefreshCw, desc: 'Detailed log of automated balance credits.', color: 'text-cyan-500 bg-cyan-50' },
  { id: 'compliance', label: 'Compliance Report', icon: ShieldAlert, desc: 'SLA breaches and policy override audits.', color: 'text-red-500 bg-red-50' },
];

export const LeaveReportGenerator = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Reports</h2>
          <p className="text-gray-500 font-medium">Generate, export, and schedule sophisticated leave analytics.</p>
        </div>
      </div>

      {!selectedReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col items-start group"
            >
              <div className={`p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110 ${type.color}`}>
                <type.icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{type.label}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{type.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-[#3E3B6F] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                Configure Report <ChevronRight size={12} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Parameters Side Panel */}
          <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-left-4">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                <button 
                  onClick={() => { setSelectedReport(null); setShowPreview(false); }}
                  className="p-2 -ml-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parameters</h3>
                <div className="w-8" />
              </div>

              <div className="p-8 space-y-8">
                {/* Type Identification */}
                <div className="flex items-center gap-4">
                   {(() => {
                     const report = REPORT_TYPES.find(r => r.id === selectedReport);
                     const Icon = report?.icon || FileText;
                     return (
                       <>
                         <div className={`p-3 rounded-2xl ${report?.color}`}><Icon size={24}/></div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generating</p>
                            <p className="text-sm font-bold text-[#3E3B6F]">{report?.label}</p>
                         </div>
                       </>
                     )
                   })()}
                </div>

                <div className="space-y-6">
                  {/* Date Range */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <CalendarDays size={14}/> Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" className="p-3 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-indigo-100" />
                      <input type="date" className="p-3 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-indigo-100" />
                    </div>
                  </div>

                  {/* Scope */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Users size={14}/> Organization Scope
                    </label>
                    <select className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none font-bold text-gray-800 transition-all">
                      <option>All Organization</option>
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Sales & Marketing</option>
                      <option>Specific Employee</option>
                    </select>
                  </div>

                  {/* Leave Types Multi-select Mock */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ListFilter size={14}/> Leave Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Annual', 'Sick', 'Casual', 'Unpaid'].map(t => (
                        <button key={t} className="px-3 py-1.5 bg-indigo-50 text-[#3E3B6F] text-[10px] font-bold rounded-lg border border-indigo-100 uppercase">
                          {t}
                        </button>
                      ))}
                      <button className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100 uppercase">
                        + Select More
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-3">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Play size={20}/>}
                  Preview on Screen
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <FileText size={16} className="text-red-500" /> Export PDF
                  </button>
                  <button className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <FileSpreadsheet size={16} className="text-emerald-500" /> Export Excel
                  </button>
                </div>
                <button 
                  onClick={() => setIsScheduleOpen(true)}
                  className="w-full py-3 text-[#3E3B6F] text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center justify-center gap-2"
                >
                  <Calendar size={14} /> Save & Schedule Report
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-8">
            {isGenerating ? (
               <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-[#3E3B6F]/10 border-t-[#3E3B6F] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BarChart3 size={32} className="text-[#3E3B6F] animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Querying Ledger...</h3>
                  <p className="text-gray-400 mt-2">Fetching real-time data for 450 employees.</p>
               </div>
            ) : showPreview ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                 <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                   <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Report Preview</h4>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase">Page 1 of 12</span>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/30">
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Employee ID</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Name</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">Annual</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">Casual</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">Sick</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase text-right">Total Remaining</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            { id: 'EMP-101', name: 'Ahmed Khan', annual: 10, casual: 5, sick: 8, total: 23 },
                            { id: 'EMP-102', name: 'Sara Miller', annual: 12, casual: 3, sick: 10, total: 25 },
                            { id: 'EMP-103', name: 'Tom Chen', annual: 4, casual: 2, sick: 1, total: 7 },
                            { id: 'EMP-104', name: 'Anna Bell', annual: 8, casual: 5, sick: 12, total: 25 },
                            { id: 'EMP-105', name: 'Zoya Malik', annual: 14, casual: 4, sick: 6, total: 24 },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-8 py-4 font-mono text-xs text-gray-400">{row.id}</td>
                              <td className="px-8 py-4 text-xs font-bold text-gray-900">{row.name}</td>
                              <td className="px-8 py-4 text-xs font-medium text-center text-gray-600">{row.annual} d</td>
                              <td className="px-8 py-4 text-xs font-medium text-center text-gray-600">{row.casual} d</td>
                              <td className="px-8 py-4 text-xs font-medium text-center text-gray-600">{row.sick} d</td>
                              <td className="px-8 py-4 text-right">
                                <span className="text-sm font-bold text-[#3E3B6F]">{row.total} Days</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                   <div className="p-8 border-t border-gray-100 flex justify-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-[#3E3B6F] text-white text-xs font-bold">1</button>
                      <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 text-xs font-bold">2</button>
                      <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 text-xs font-bold">3</button>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Staff Included</p>
                          <p className="text-3xl font-bold text-gray-900">450</p>
                       </div>
                       <Users className="text-indigo-100" size={48} />
                    </div>
                    <div className="bg-[#3E3B6F] p-8 rounded-[32px] shadow-xl shadow-[#3E3B6F]/20 text-white relative overflow-hidden">
                       <div className="relative z-10 space-y-1">
                          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Liability Value (Est)</p>
                          <p className="text-3xl font-bold text-[#E8D5A3]">PKR 12.4M</p>
                       </div>
                       <DollarSign className="absolute -right-6 -bottom-6 opacity-10" size={100} />
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-3xl flex items-center justify-center mb-8">
                  <Play size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Generate</h3>
                <p className="text-gray-400 max-w-sm mb-8 leading-relaxed font-medium">Configure your report parameters on the left and click preview to analyze the data.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsScheduleOpen(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl"><Calendar size={24}/></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Schedule Report</h3>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">Automate report delivery.</p>
                  </div>
                </div>
                <button onClick={() => setIsScheduleOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Frequency</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#3E3B6F] outline-none">
                    <option>Weekly (Monday AM)</option>
                    <option>Monthly (1st Day)</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipients (Email)</label>
                  <input type="text" placeholder="e.g. hr@company.com, finance@company.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">File Format</label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input type="radio" name="fmt" defaultChecked className="text-[#3E3B6F]" />
                      <span className="text-xs font-bold">Excel</span>
                    </label>
                    <label className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input type="radio" name="fmt" className="text-[#3E3B6F]" />
                      <span className="text-xs font-bold">PDF</span>
                    </label>
                  </div>
                </div>
             </div>

             <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex gap-4">
                <button onClick={() => setIsScheduleOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-white rounded-xl transition-all">Cancel</button>
                <button onClick={() => setIsScheduleOpen(false)} className="flex-[2] bg-[#3E3B6F] text-white py-3 rounded-xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all">Set Schedule</button>
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