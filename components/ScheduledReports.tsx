
import React, { useState } from 'react';
import { 
  Calendar, Clock, Mail, Users, FileText, Plus, 
  Search, Filter, ChevronRight, MoreVertical, 
  Trash2, Play, CheckCircle2, AlertCircle, 
  X, Send, Download, Settings2, Database,
  ArrowRight, History as HistoryIcon, LayoutList,
  /* Fixed: Added missing Check and Info icon imports */
  Check, Info
} from 'lucide-react';

type ViewMode = 'ACTIVE' | 'CREATE' | 'HISTORY';

interface ScheduledReport {
  id: string;
  report: string;
  frequency: string;
  recipients: string[];
  nextRun: string;
  status: 'Active' | 'Paused' | 'Failed';
  format: 'XLSX' | 'PDF' | 'CSV';
}

const MOCK_ACTIVE: ScheduledReport[] = [
  { id: 'SCH-001', report: 'Master Payroll Register', frequency: 'Monthly', recipients: ['hr.director@flexi.com', 'finance.head@flexi.com'], nextRun: '01 Feb 2025, 09:00 AM', status: 'Active', format: 'XLSX' },
  { id: 'SCH-002', report: 'Departmental Cost Analysis', frequency: 'Monthly', recipients: ['ops.manager@flexi.com'], nextRun: '01 Feb 2025, 10:00 AM', status: 'Active', format: 'PDF' },
  { id: 'SCH-003', report: 'EOBI Contribution Ledger', frequency: 'Monthly', recipients: ['compliance@flexi.com'], nextRun: '15 Feb 2025, 05:00 PM', status: 'Active', format: 'XLSX' },
  { id: 'SCH-004', report: 'Period Variance Report', frequency: 'Quarterly', recipients: ['ceo@flexi.com'], nextRun: '01 Apr 2025, 09:00 AM', status: 'Paused', format: 'PDF' },
  { id: 'SCH-005', report: 'Bank Advice Statement', frequency: 'Monthly', recipients: ['treasury@flexi.com'], nextRun: '28 Jan 2025, 11:00 AM', status: 'Active', format: 'CSV' },
  { id: 'SCH-006', report: 'PF Annual Summary', frequency: 'Annually', recipients: ['trustees@flexi.com'], nextRun: '01 Jul 2025, 09:00 AM', status: 'Active', format: 'XLSX' },
  { id: 'SCH-007', report: 'Tax Deduction (Annex-C)', frequency: 'Monthly', recipients: ['tax.consultant@flexi.com'], nextRun: '12 Feb 2025, 09:00 AM', status: 'Active', format: 'CSV' },
  { id: 'SCH-008', report: 'Executive Summary', frequency: 'Monthly', recipients: ['board@flexi.com'], nextRun: '01 Feb 2025, 08:00 AM', status: 'Active', format: 'PDF' },
  { id: 'SCH-009', report: 'Headcount Trend', frequency: 'Bi-Weekly', recipients: ['hr.ops@flexi.com'], nextRun: '20 Jan 2025, 09:00 AM', status: 'Active', format: 'PDF' },
  { id: 'SCH-010', report: 'Total CTC Analysis', frequency: 'Monthly', recipients: ['finance.team@flexi.com'], nextRun: '01 Feb 2025, 12:00 PM', status: 'Active', format: 'XLSX' },
];

const MOCK_HISTORY = [
  { date: '15 Jan 2025, 09:00 AM', report: 'Tax Deduction (Annex-C)', recipients: '1 Recipient', status: 'SUCCESS' },
  { date: '01 Jan 2025, 09:00 AM', report: 'Master Payroll Register', recipients: '2 Recipients', status: 'SUCCESS' },
  { date: '01 Jan 2025, 08:00 AM', report: 'Executive Summary', recipients: '5 Recipients', status: 'SUCCESS' },
  { date: '28 Dec 2024, 11:00 AM', report: 'Bank Advice Statement', recipients: '1 Recipient', status: 'FAILED' },
];

export const ScheduledReports: React.FC = () => {
  const [view, setView] = useState<ViewMode>('ACTIVE');
  const [search, setSearch] = useState('');

  const renderActive = () => (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-4 border-b bg-gray-50/30 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search scheduled tasks..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-2">
          <Filter size={14} /> Status: All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-5">Report Name</th>
              <th className="px-6 py-5">Schedule</th>
              <th className="px-6 py-5">Recipients</th>
              <th className="px-6 py-5">Next Runtime</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_ACTIVE.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 text-primary rounded-lg">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{task.report}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{task.format} Format</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 uppercase tracking-tighter">
                    {task.frequency}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {task.recipients.map((r, i) => (
                      <div key={i} title={r} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] uppercase">
                        {r.charAt(0)}
                      </div>
                    ))}
                    {task.recipients.length > 2 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[10px]">
                        +{task.recipients.length - 2}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-[11px] font-bold text-gray-500">
                  {task.nextRun}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    task.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 
                    task.status === 'Paused' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-primary transition-all"><Play size={16} fill="currentColor" /></button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-800 transition-all"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Database size={14} /> Report & Context
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Report</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10">
                  <option>Master Payroll Register</option>
                  <option>Departmental Cost Analysis</option>
                  <option>EOBI Contribution Ledger</option>
                  <option>Executive Summary</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Parameters (Filter)</label>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10">Location: All</span>
                  <span className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10">Dept: All</span>
                </div>
              </div>
            </div>

            <h4 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2 pt-4">
              <Calendar size={14} /> Delivery Frequency
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500">Frequency</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500">Execution Day/Time</label>
                <div className="flex gap-2">
                   <select className="w-1/2 px-2 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none">
                     <option>1st of Month</option>
                     <option>Last of Month</option>
                   </select>
                   <input type="time" defaultValue="09:00" className="w-1/2 px-2 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Mail size={14} /> Distribution
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recipients (Emails)</label>
                <div className="relative">
                   <textarea 
                    rows={2}
                    placeholder="Enter email addresses separated by commas..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 resize-none"
                   />
                   <Users className="absolute right-4 bottom-4 text-gray-300" size={16} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">File Format</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none">
                    <option>Excel (.xlsx)</option>
                    <option>PDF (.pdf)</option>
                    <option>CSV (.csv)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Compression</label>
                  <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-400 flex items-center justify-between">
                    <span>ZIP Password Protection</span>
                    <Settings2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500">Email Subject Line</label>
                <input type="text" placeholder="Automated Report: [Report Name] - [Period]" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex justify-end gap-4">
           <button onClick={() => setView('ACTIVE')} className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
           <button onClick={() => setView('ACTIVE')} className="px-10 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 active:scale-95 transition-all">
              <Check size={18} /> Schedule Automation
           </button>
        </div>
      </div>
      
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-start gap-4">
         <Info size={24} className="text-indigo-600 mt-0.5 shrink-0" />
         <p className="text-xs text-indigo-700 leading-relaxed font-medium uppercase tracking-tight">
           Scheduled reports are generated using the most recent committed payroll run. If a period is not yet authorized, the schedule will trigger a system alert and retry in 24 hours.
         </p>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-5">Execution Date</th>
              <th className="px-8 py-5">Report Name</th>
              <th className="px-8 py-5">Recipients</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_HISTORY.map((h, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-4 font-mono font-bold text-gray-400 text-xs">{h.date}</td>
                <td className="px-8 py-4 font-bold text-gray-700">{h.report}</td>
                <td className="px-8 py-4 text-xs font-medium text-gray-500">{h.recipients}</td>
                <td className="px-8 py-4 text-center">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    h.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {h.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                   <button className="p-2 text-gray-300 hover:text-primary transition-all"><LayoutList size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Clock size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Report Scheduling</h2>
            <p className="text-sm text-gray-500 font-medium">Automated distribution workflows for stakeholders</p>
          </div>
        </div>
        {view !== 'CREATE' && (
          <button 
            onClick={() => setView('CREATE')}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Create New Schedule
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 w-fit rounded-2xl border border-gray-200">
        {(['ACTIVE', 'HISTORY'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              view === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">
        {view === 'ACTIVE' && renderActive()}
        {view === 'CREATE' && renderCreate()}
        {view === 'HISTORY' && renderHistory()}
      </div>
    </div>
  );
};
