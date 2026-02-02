import React, { useState, useMemo } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Clock, 
  FileText, 
  MoreVertical, 
  Play, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Save, 
  Bell, 
  Settings2, 
  Download,
  Pause,
  History as HistoryIcon,
  // Added missing ShieldCheck icon
  ShieldCheck
} from 'lucide-react';

type Frequency = 'Daily' | 'Weekly' | 'Monthly';
type ReportFormat = 'PDF' | 'Excel' | 'Both';

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: Frequency;
  time: string;
  recipients: string[];
  lastRun: string;
  nextRun: string;
  format: ReportFormat;
  status: 'ACTIVE' | 'PAUSED';
}

const MOCK_REPORTS: ScheduledReport[] = [
  { id: 'SR-001', name: 'Morning Adherence Summary', type: 'Daily Attendance', frequency: 'Daily', time: '10:00 AM', recipients: ['hr@flexi.com', 'ops@flexi.com'], lastRun: 'Today, 10:00 AM', nextRun: 'Tomorrow, 10:00 AM', format: 'Excel', status: 'ACTIVE' },
  { id: 'SR-002', name: 'Weekly Overtime Leakage', type: 'OT Analysis', frequency: 'Weekly', time: 'Monday, 09:00 AM', recipients: ['finance@flexi.com'], lastRun: 'Jan 06, 09:00 AM', nextRun: 'Jan 13, 09:00 AM', format: 'Both', status: 'ACTIVE' },
  { id: 'SR-003', name: 'Monthly Compliance Audit', type: 'Anomaly Report', frequency: 'Monthly', time: '1st of Month, 10:00 AM', recipients: ['compliance@flexi.com'], lastRun: 'Jan 01, 10:00 AM', nextRun: 'Feb 01, 10:00 AM', format: 'PDF', status: 'PAUSED' },
  { id: 'SR-004', name: 'Late Arrival Daily Alert', type: 'Punctuality', frequency: 'Daily', time: '09:30 AM', recipients: ['mgr_engineering@flexi.com'], lastRun: 'Today, 09:30 AM', nextRun: 'Tomorrow, 09:30 AM', format: 'PDF', status: 'ACTIVE' },
  { id: 'SR-005', name: 'Dept Attendance Benchmark', type: 'Monthly Summary', frequency: 'Monthly', time: 'Last day of month', recipients: ['board@flexi.com'], lastRun: 'Dec 31, 05:00 PM', nextRun: 'Jan 31, 05:00 PM', format: 'Excel', status: 'ACTIVE' },
];

export const ScheduledReportsList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'PAUSED'>('ALL');

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'ALL' || report.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarClock className="text-[#3E3B6F]" size={28} /> Scheduled Reports
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Manage automated distribution of attendance and compliance data</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Schedule New
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-200 rounded-2xl p-2 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex p-1 bg-gray-50 rounded-xl">
          {(['ALL', 'ACTIVE', 'PAUSED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#3E3B6F]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md px-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input 
            type="text" 
            placeholder="Search by report name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-100 rounded-xl focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Report Name</th>
                <th className="px-6 py-5">Schedule</th>
                <th className="px-6 py-5">Recipients</th>
                <th className="px-6 py-5">Format</th>
                <th className="px-6 py-5">Last Run / Next Run</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReports.map((report) => (
                <tr key={report.id} className="group hover:bg-gray-50/80 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{report.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{report.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-[#3E3B6F]">{report.frequency}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{report.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {report.recipients.slice(0, 2).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400">
                            <Mail size={10} />
                          </div>
                        ))}
                      </div>
                      {report.recipients.length > 2 && (
                        <span className="text-[9px] font-black text-indigo-500">+{report.recipients.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      report.format === 'Excel' ? 'bg-green-50 text-green-600 border-green-100' :
                      report.format === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400 font-medium">Last: {report.lastRun}</span>
                      <span className="text-[10px] text-indigo-600 font-black">Next: {report.nextRun}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${report.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${report.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                        {report.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                      <button className="p-2 text-gray-400 hover:text-green-600" title="Run Now"><Play size={16} fill="currentColor" /></button>
                      <button className="p-2 text-gray-400 hover:text-blue-500" title="Edit"><Edit3 size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-orange-500" title="Pause/Resume"><Pause size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-indigo-500" title="View History"><HistoryIcon size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
                    <CalendarClock size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Schedule Report</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Automation Configuration</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule Name *</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. Monthly Finance Audit" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Type *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option>Daily Attendance</option>
                      <option>Monthly Summary</option>
                      <option>Overtime Analysis</option>
                      <option>Anomaly Intelligence</option>
                      <option>Punctuality Matrix</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Department</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option>All Departments</option>
                      <option>Engineering</option>
                      <option>Operations</option>
                      <option>Finance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} className="text-indigo-500" /> Timing & Frequency
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['Daily', 'Weekly', 'Monthly'].map(f => (
                      <button key={f} className={`py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Weekly' ? 'border-[#3E3B6F] bg-[#3E3B6F]/5 text-[#3E3B6F]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Preferred Time</p>
                      <input type="time" defaultValue="09:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Day of Week</p>
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold">
                        <option>Monday</option>
                        <option>Friday</option>
                        <option>1st of Month</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" /> Recipients & Format
                  </h4>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email List (Comma separated)</label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none h-20" 
                      placeholder="hr@flexi.com, payroll@flexi.com..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Output Format</p>
                        <div className="flex gap-2">
                          {['PDF', 'Excel', 'Both'].map(fmt => (
                            <button key={fmt} className={`flex-1 py-2 rounded-xl border text-[9px] font-black transition-all ${fmt === 'Excel' ? 'bg-[#3E3B6F] text-white' : 'bg-white text-gray-400 border-gray-100'}`}>
                              {fmt}
                            </button>
                          ))}
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 mt-5">
                        <div className="space-y-0.5">
                           <p className="text-xs font-bold text-gray-700 leading-none">Compress files</p>
                           <p className="text-[9px] text-gray-400 font-medium">Send as ZIP</p>
                        </div>
                        <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                 <ShieldCheck size={20} className="text-indigo-600 shrink-0" />
                 <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
                   Scheduled reports use <span className="font-bold">Latest Reconciled Data</span>. Reports triggered before the daily midnight sync (00:00) will contain data up to the last successful device ingestion job.
                 </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                 Cancel
               </button>
               <button className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Confirm Schedule
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};