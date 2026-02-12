import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Download, History, User, Clock, 
  ArrowRight, X, ChevronRight, CheckCircle2, Shield, 
  Terminal, Globe, Laptop, Database, Sliders, Info,
  AlertCircle, FileJson, Layers, ClipboardList
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  employee: { name: string; id: string; avatar: string };
  action: string;
  category: 'Request' | 'Balance' | 'Policy' | 'Comp-Off' | 'Config';
  entity: string;
  summary: string;
  by: { name: string; role: string };
  ip: string;
  details: {
    before: any;
    after: any;
  };
}

const MOCK_LOGS: AuditEntry[] = Array.from({ length: 100 }, (_, i) => ({
  id: `LOG-88${i}`,
  timestamp: 'Feb 12, 2025 • 09:45:12 AM',
  employee: { 
    name: ['Ahmed Khan', 'Sara Miller', 'Tom Chen', 'Zoya Malik', 'Ali Raza'][i % 5], 
    id: `EMP-10${i % 5 + 1}`,
    avatar: ['AK', 'SM', 'TC', 'ZM', 'AR'][i % 5]
  },
  action: ['Approved', 'Adjusted', 'Modified', 'Accrued', 'Credited', 'Published'][i % 6],
  category: ['Request', 'Balance', 'Policy', 'Balance', 'Comp-Off', 'Policy'][i % 6] as any,
  entity: ['LV-4402', 'Annual Leave', 'Standard Policy', 'Casual Leave', 'CO-992', 'Holiday Cal'][i % 6],
  summary: [
    'Leave request approved by manager',
    'Balance adjusted by admin (+2 days)',
    'Carry forward rules updated for 2025',
    'Monthly automated accrual run',
    'Overtime credit verified and added',
    'New v4 policy published to Engineering'
  ][i % 6],
  by: { name: i % 10 === 0 ? 'System Process' : 'Sarah Admin', role: i % 10 === 0 ? 'Automated' : 'HR Manager' },
  ip: `192.168.1.${100 + i}`,
  details: {
    before: { status: 'Pending', days: 12, rules: { cf: false } },
    after: { status: 'Approved', days: 14, rules: { cf: true } }
  }
}));

export const LeaveAuditLogs = () => {
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchesSearch = log.employee.name.toLowerCase().includes(search.toLowerCase()) || 
                            log.id.toLowerCase().includes(search.toLowerCase()) ||
                            log.entity.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || log.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const getCategoryColor = (cat: AuditEntry['category']) => {
    switch (cat) {
      case 'Request': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Balance': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Policy': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Comp-Off': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <Shield size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Audit Logs</h2>
            <p className="text-gray-500 font-medium">Immutable record of every leave-related action and system change.</p>
          </div>
        </div>
        <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Employee, ID, or Entity..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="date" className="p-3 bg-gray-50 border-transparent rounded-xl text-xs font-bold text-gray-600 outline-none" />
            <ArrowRight size={14} className="text-gray-300" />
            <input type="date" className="p-3 bg-gray-50 border-transparent rounded-xl text-xs font-bold text-gray-600 outline-none" />
          </div>
          <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#3E3B6F] transition-all">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {['All', 'Request', 'Balance', 'Policy', 'Comp-Off', 'Config'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border-2 whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-[#3E3B6F] border-[#3E3B6F] text-white shadow-lg' 
                  : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Affected Entity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Summary</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">By User / IP</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.slice(0, 50).map((log) => (
                <tr 
                  key={log.id} 
                  className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-700">{log.timestamp.split('•')[0]}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">{log.timestamp.split('•')[1]}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">
                        {log.employee.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-none">{log.employee.name}</p>
                        <p className="text-[10px] text-[#3E3B6F] font-bold mt-1.5 uppercase tracking-tighter">{log.entity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                      <p className="text-xs font-bold text-gray-800">{log.action}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-600 font-medium max-w-xs leading-relaxed">{log.summary}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-700">{log.by.name}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-medium uppercase mt-1">
                      <Laptop size={10}/> {log.ip}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#3E3B6F] transition-all" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">Logs retained for 7 years (Compliance Standard v2.1)</p>
          </div>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-lg bg-[#3E3B6F] text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-500 text-xs font-bold">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-500 text-xs font-bold">3</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="bg-[#3E3B6F] p-8 text-white flex justify-between items-start shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/10 rounded-2xl"><Terminal size={24}/></div>
                 <div>
                    <h3 className="text-xl font-bold">Audit Detail: {selectedLog.id}</h3>
                    <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-bold">{selectedLog.timestamp}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-modal-scroll">
              {/* Context */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                   <p className="text-sm font-bold text-[#3E3B6F]">{selectedLog.category}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</p>
                   <p className="text-sm font-bold text-gray-900">{selectedLog.action}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entity</p>
                   <p className="text-sm font-bold text-gray-900">{selectedLog.entity}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performed By</p>
                   <p className="text-sm font-bold text-gray-900">{selectedLog.by.name}</p>
                </div>
              </div>

              {/* Changes Visualization */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={14} /> State Comparison
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                  <div className="bg-gray-50/50 p-6 space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">BEFORE CHANGE</p>
                    <div className="bg-white p-4 rounded-2xl font-mono text-[11px] text-gray-500 overflow-x-auto">
                      <pre>{JSON.stringify(selectedLog.details.before, null, 2)}</pre>
                    </div>
                  </div>
                  <div className="bg-indigo-50/30 p-6 space-y-4">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] text-center">AFTER CHANGE</p>
                    <div className="bg-white p-4 rounded-2xl font-mono text-[11px] text-[#3E3B6F] overflow-x-auto border border-indigo-100 shadow-inner">
                      <pre>{JSON.stringify(selectedLog.details.after, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                     <User size={14}/> Affected Employee
                   </h4>
                   <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F]">{selectedLog.employee.avatar}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{selectedLog.employee.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{selectedLog.employee.id}</p>
                      </div>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                     <Globe size={14}/> Network Context
                   </h4>
                   <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Source IP</span>
                        <span className="font-mono text-[#3E3B6F]">{selectedLog.ip}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">User Role</span>
                        <span className="font-bold text-gray-700">{selectedLog.by.role}</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
               <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                 <Download size={20} /> Export Audit Fragment
               </button>
               <button onClick={() => setSelectedLog(null)} className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all">
                 Close View
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