import React, { useState } from 'react';
import { 
  GitMerge, Plus, Search, Filter, MoreHorizontal, Eye, 
  Edit3, Copy, Archive, CheckCircle2, Clock, ShieldCheck,
  ChevronRight, ArrowRight, Zap, ListTree, History,
  Plane, Briefcase, DollarSign, Database, Sliders, X
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  entity: 'Leave Request' | 'Comp-Off Credit' | 'Encashment' | 'OD/Travel' | 'Balance Adjustment';
  steps: string[];
  conditions: string;
  version: string;
  status: 'Active' | 'Draft' | 'Archived';
  instances: number;
}

const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'WF-001', name: 'Standard Leave Approval', entity: 'Leave Request', steps: ['Manager', 'HR'], conditions: 'If > 5 days', version: 'v2.1', status: 'Active', instances: 1420 },
  { id: 'WF-002', name: 'Sick Leave Auto-Pass', entity: 'Leave Request', steps: ['System'], conditions: 'If < 2 days', version: 'v1.0', status: 'Active', instances: 850 },
  { id: 'WF-003', name: 'Manager Overtime Verify', entity: 'Comp-Off Credit', steps: ['Manager', 'Admin'], conditions: 'Always', version: 'v1.4', status: 'Active', instances: 310 },
  { id: 'WF-004', name: 'High Value Encashment', entity: 'Encashment', steps: ['Manager', 'HR Head', 'Finance'], conditions: 'If > PKR 50k', version: 'v3.0', status: 'Active', instances: 45 },
  { id: 'WF-005', name: 'International Travel Route', entity: 'OD/Travel', steps: ['Manager', 'Dept Head', 'Travel Desk'], conditions: 'If International', version: 'v2.0', status: 'Active', instances: 112 },
  { id: 'WF-006', name: 'Minor Adjustment Rule', entity: 'Balance Adjustment', steps: ['Admin'], conditions: 'If < 1 day', version: 'v1.1', status: 'Active', instances: 88 },
  { id: 'WF-007', name: 'Executive Leave Route', entity: 'Leave Request', steps: ['CEO'], conditions: 'Grade E1+', version: 'v1.0', status: 'Draft', instances: 0 },
  { id: 'WF-008', name: 'Legacy Comp-Off', entity: 'Comp-Off Credit', steps: ['HR'], conditions: 'None', version: 'v0.9', status: 'Archived', instances: 1205 },
];

export const LeaveWorkflowsList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const getEntityBadge = (entity: Workflow['entity']) => {
    switch (entity) {
      case 'Leave Request': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Comp-Off Credit': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Encashment': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'OD/Travel': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Balance Adjustment': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const getStatusStyle = (status: Workflow['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Archived': return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
            <GitMerge size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Approval Workflows</h2>
            <p className="text-gray-500 font-medium">Design and automate approval paths with custom conditions and multi-stage routing.</p>
          </div>
        </div>
      
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by workflow name or entity..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 outline-none shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
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
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workflow Name</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Entity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Routing Steps</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trigger Condition</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Version</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_WORKFLOWS.map((wf) => (
                <tr key={wf.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900">{wf.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{wf.id}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getEntityBadge(wf.entity)}`}>
                      {wf.entity}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       {wf.steps.map((step, i) => (
                         <React.Fragment key={i}>
                           <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded">{step}</span>
                           {i < wf.steps.length - 1 && <ChevronRight size={12} className="text-gray-300" />}
                         </React.Fragment>
                       ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-500 font-medium italic">"{wf.conditions}"</p>
                  </td>
                  <td className="px-8 py-5 text-center font-mono text-xs font-bold text-gray-400">{wf.version}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(wf.status)}`}>
                      {wf.status === 'Active' ? <CheckCircle2 size={10}/> : wf.status === 'Draft' ? <Edit3 size={10}/> : <Archive size={10}/>}
                      {wf.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="relative inline-block group/menu">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all ">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-20">
                         <div className="p-2 space-y-1 text-left">
                           <button onClick={() => setSelectedWorkflow(wf)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><Eye size={14}/> View Logic</button>
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><Edit3 size={14}/> Edit Designer</button>
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><Copy size={14}/> Clone</button>
                           <div className="h-px bg-gray-50 my-1" />
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><ListTree size={14}/> View Instances ({wf.instances})</button>
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"><Archive size={14}/> Archive</button>
                         </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-900 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <Zap size={24} className="text-[#E8D5A3]" />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-[#E8D5A3]">System Logic Rules</h3>
               </div>
               <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                  Workflows are the brain of LeaveEase. You can define triggers based on duration, employee grade, department, or balance impact. Complex multi-stage approvals ensure compliance while automation like "System Auto-Pass" reduces administrative overhead for low-risk requests.
               </p>
               <div className="flex gap-4">
                  <button className="bg-[#E8D5A3] text-[#3E3B6F] px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                    Launch Designer Pro
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                    View Rule Documentation
                  </button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Active Instances', val: '2.8k', icon: ListTree },
                 { label: 'System Efficiency', val: '92%', icon: ShieldCheck },
                 { label: 'Manual Steps Removed', val: '14k', icon: History },
                 { label: 'Decision Confidence', val: '99.9%', icon: CheckCircle2 }
               ].map((stat, i) => (
                 <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                    <stat.icon className="text-[#E8D5A3] mb-3" size={20} />
                    <p className="text-2xl font-bold">{stat.val}</p>
                    <p className="text-[10px] font-bold uppercase text-indigo-300 tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
         <GitMerge size={300} className="absolute -bottom-20 -right-20 opacity-5 -rotate-12" />
      </div>

      {/* Logic Preview Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedWorkflow(null)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-[600px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
             <div className="bg-[#3E3B6F] p-10 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/10 rounded-2xl"><ListTree size={24}/></div>
                   <div>
                      <h3 className="text-xl font-bold">{selectedWorkflow.name}</h3>
                      <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-bold">Logic Diagram • {selectedWorkflow.version}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedWorkflow(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-modal-scroll">
                <section className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Trigger Event</h4>
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-2xl shadow-sm">
                            {selectedWorkflow.entity === 'Leave Request' && <Database size={20} className="text-blue-500" />}
                            {selectedWorkflow.entity === 'Comp-Off Credit' && <Zap size={20} className="text-purple-500" />}
                            {selectedWorkflow.entity === 'Encashment' && <DollarSign size={20} className="text-emerald-500" />}
                            {selectedWorkflow.entity === 'OD/Travel' && <Plane size={20} className="text-orange-500" />}
                            {selectedWorkflow.entity === 'Balance Adjustment' && <Sliders size={20} className="text-indigo-500" />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-800">{selectedWorkflow.entity} Submitted</p>
                            <p className="text-xs text-gray-500 font-medium">{selectedWorkflow.conditions}</p>
                         </div>
                      </div>
                   </div>
                </section>

                <section className="space-y-8">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Approval Pipeline</h4>
                   <div className="space-y-8 relative before:content-[''] before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                      {selectedWorkflow.steps.map((step, i) => (
                        <div key={i} className="relative flex items-center gap-6 pl-12">
                           <div className="absolute left-0 w-12 h-12 rounded-full bg-[#3E3B6F] text-white flex items-center justify-center font-bold text-sm border-4 border-white shadow-md z-10">
                              {i + 1}
                           </div>
                           <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                              <div>
                                 <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{step} Approval</p>
                                 <p className="text-[10px] text-gray-400 mt-1">SLA: 24 Hours • Notification: Email/Push</p>
                              </div>
                              <ArrowRight size={16} className="text-gray-300" />
                           </div>
                        </div>
                      ))}
                      <div className="relative flex items-center gap-6 pl-12 opacity-50">
                         <div className="absolute left-0 w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm border-4 border-white shadow-md z-10">
                            <CheckCircle2 size={24}/>
                         </div>
                         <div className="flex-1 bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Success State</p>
                            <p className="text-[10px] text-emerald-600 mt-1">Balance Updated • Employee Notified</p>
                         </div>
                      </div>
                   </div>
                </section>
             </div>

             <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
                <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">Edit in Designer</button>
                <button onClick={() => setSelectedWorkflow(null)} className="flex-1 py-4 bg-[#3E3B6F] text-white font-bold rounded-2xl shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all text-xs uppercase tracking-widest">Close View</button>
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