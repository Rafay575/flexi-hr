
import React, { useState } from 'react';
import { 
  BarChart3, FileSpreadsheet, FileText, Download, 
  Calendar, Clock, Filter, Search, ChevronRight,
  TrendingUp, Users, PieChart, Landmark, ShieldCheck,
  Building2, Wallet, Plus, Zap, ArrowUpRight, Play,
  History as HistoryIcon,
  DownloadCloud, Info, Share2, Settings
} from 'lucide-react';

type ReportCategory = 'STANDARD' | 'STATUTORY' | 'MANAGEMENT';

interface Report {
  id: string;
  name: string;
  category: ReportCategory;
  lastGenerated: string;
  format: 'XLSX' | 'PDF' | 'CSV';
  description: string;
  canSchedule?: boolean;
  isVariance?: boolean;
}

const REPORTS: Report[] = [
  // STANDARD
  { id: 'R1', name: 'Master Payroll Register', category: 'STANDARD', lastGenerated: '15 Jan 2025', format: 'XLSX', description: 'Complete employee-wise breakdown of all pay components.', canSchedule: true },
  { id: 'R2', name: 'Payroll Summary', category: 'STANDARD', lastGenerated: '15 Jan 2025', format: 'PDF', description: 'High-level financial summary for management review.', canSchedule: true },
  { id: 'R3', name: 'Bank Advice Statement', category: 'STANDARD', lastGenerated: '14 Jan 2025', format: 'CSV', description: 'Disbursement file formatted for bank portal uploads.', canSchedule: true },
  { id: 'R4', name: 'Period Variance Report', category: 'STANDARD', lastGenerated: '15 Jan 2025', format: 'XLSX', description: 'Comparison of current month vs previous month payout delta.', canSchedule: true, isVariance: true },
  
  // STATUTORY
  { id: 'S1', name: 'Tax Deduction (Annex-C)', category: 'STATUTORY', lastGenerated: '12 Jan 2025', format: 'CSV', description: 'FBR compliant withholding statement for monthly filing.' },
  { id: 'S2', name: 'EOBI Contribution Ledger', category: 'STATUTORY', lastGenerated: '10 Jan 2025', format: 'XLSX', description: 'Detailed staff-wise EOBI shares for portal submission.' },
  { id: 'S3', name: 'PF Annual Statement', category: 'STATUTORY', lastGenerated: '05 Jan 2025', format: 'PDF', description: 'Member-wise Provident Fund accumulated balance report.' },
  
  // MANAGEMENT
  { id: 'M1', name: 'Departmental Cost Analysis', category: 'MANAGEMENT', lastGenerated: '15 Jan 2025', format: 'XLSX', description: 'Budget vs Actual cost breakdown by department.' },
  { id: 'M2', name: 'Headcount & Retention Trend', category: 'MANAGEMENT', lastGenerated: '01 Jan 2025', format: 'PDF', description: 'Employee lifecycle movements and turnover metrics.' },
  { id: 'M3', name: 'Total CTC Analysis', category: 'MANAGEMENT', lastGenerated: '15 Jan 2025', format: 'XLSX', description: 'Total Cost to Company including provisions and benefits.' },
];

export const PayrollReportsDashboard: React.FC<{ onOpenVariance?: () => void }> = ({ onOpenVariance }) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | ReportCategory>('ALL');
  const [search, setSearch] = useState('');

  const filteredReports = REPORTS.filter(r => {
    const matchesCat = activeCategory === 'ALL' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryColor = (cat: ReportCategory) => {
    switch (cat) {
      case 'STANDARD': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'STATUTORY': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'MANAGEMENT': return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-primary" size={28} />
            Analytics & Reports
          </h2>
          <p className="text-sm text-gray-500">Business intelligence and statutory documentation</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Calendar size={18} /> Export Calendar
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Settings size={18} /> Configure API
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-2xl border border-gray-200">
          {['ALL', 'STANDARD', 'STATUTORY', 'MANAGEMENT'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by report name or keyword..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${getCategoryColor(report.category)}`}>
                  {report.category}
                </span>
                <div className="flex gap-1.5">
                   <span className="text-[9px] font-black text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{report.format}</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{report.name}</h4>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed font-medium">{report.description}</p>
              </div>
            </div>

            <div className="pt-6 mt-auto border-t border-gray-50 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Last Runtime</span>
                  <span className="text-[11px] font-bold text-gray-500">{report.lastGenerated}</span>
               </div>
               <div className="flex gap-2">
                  {report.canSchedule && (
                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all shadow-sm border border-gray-100" title="Schedule">
                      <Clock size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => report.isVariance ? onOpenVariance?.() : null}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    <Play size={12} fill="currentColor" /> {report.isVariance ? 'Open Engine' : 'Generate'}
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Distribution History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <HistoryIcon size={16} /> Report Generation Logs
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="bg-gray-50/30 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Timestamp</th>
                        <th className="px-8 py-5">Report Name</th>
                        <th className="px-8 py-5">Triggered By</th>
                        <th className="px-8 py-5">Format</th>
                        <th className="px-8 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-right">Download</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {[
                       { time: '10:45 AM, 15 Jan', name: 'Master Payroll Register', user: 'Ahmed Raza', format: 'XLSX', status: 'SUCCESS' },
                       { time: '09:20 AM, 15 Jan', name: 'Departmental Cost Analysis', user: 'System (Schedule)', format: 'PDF', status: 'SUCCESS' },
                       { time: 'Yesterday', name: 'Tax Deduction (Annex-C)', user: 'Zainab Siddiqui', format: 'CSV', status: 'SUCCESS' },
                     ].map((act, i) => (
                       <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-4 text-[11px] font-bold text-gray-400">{act.time}</td>
                          <td className="px-8 py-4 font-bold text-gray-700">{act.name}</td>
                          <td className="px-8 py-4 text-xs font-medium text-gray-500">{act.user}</td>
                          <td className="px-8 py-4"><span className="text-[10px] font-black text-gray-400">{act.format}</span></td>
                          <td className="px-8 py-4 text-center">
                             <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-green-100 bg-green-50 text-green-600">COMPLETED</span>
                          </td>
                          <td className="px-8 py-4 text-right">
                             <button className="p-2 text-gray-300 hover:text-primary transition-all"><Download size={18}/></button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-xl"><PieChart size={24} className="text-accent" /></div>
                   <h3 className="text-lg font-black uppercase tracking-tight">Executive Dashboard</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/5">
                      <div>
                         <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Active Requests</p>
                         <p className="text-xl font-black text-accent">12 Reports</p>
                      </div>
                      <ArrowUpRight className="text-accent" size={20} />
                   </div>
                   <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/5">
                      <div>
                         <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Storage Used</p>
                         <p className="text-xl font-black text-accent">1.2 GB / 5 GB</p>
                      </div>
                      <PieChart className="text-accent" size={20} />
                   </div>
                </div>
             </div>
             <button className="relative z-10 w-full py-4 bg-accent text-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-white transition-all flex items-center justify-center gap-2">
                <Share2 size={16} /> Automated Insights
             </button>
             <Building2 className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-sm">
             <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Smart Scheduler</h5>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Standard reports can be configured for automatic delivery to Cost Center heads on the 1st of every month.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
