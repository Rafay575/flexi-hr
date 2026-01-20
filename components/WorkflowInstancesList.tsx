import React, { useState, useMemo } from 'react';
import { 
  ListTree, Search, Filter, Clock, CheckCircle2, XCircle, 
  AlertTriangle, ChevronRight, Eye, Zap, ArrowUpRight, 
  History, User, X, GitMerge, MessageSquare, ShieldAlert,
  ArrowRight, Database, MoreHorizontal
} from 'lucide-react';

interface WorkflowInstance {
  id: string;
  workflowName: string;
  requester: { name: string; avatar: string; id: string };
  entity: 'Leave' | 'Comp-Off' | 'Encashment' | 'OD/Travel' | 'Adjustment';
  currentStep: string;
  status: 'In Progress' | 'Approved' | 'Rejected' | 'Escalated' | 'Cancelled';
  startedAt: string;
  slaHoursRemaining: number;
  history: {
    step: string;
    who: string;
    decision: string;
    when: string;
    comment?: string;
    sla: string;
    status: 'completed' | 'current' | 'pending';
  }[];
}

const MOCK_INSTANCES: WorkflowInstance[] = Array.from({ length: 30 }, (_, i) => {
  const statuses: WorkflowInstance['status'][] = ['In Progress', 'Approved', 'Rejected', 'Escalated', 'Cancelled'];
  const entities: WorkflowInstance['entity'][] = ['Leave', 'Comp-Off', 'Encashment', 'OD/Travel', 'Adjustment'];
  const status = i < 10 ? 'In Progress' : i < 15 ? 'Approved' : i < 20 ? 'Escalated' : statuses[i % 5];
  
  return {
    id: `WFI-2025-${8800 + i}`,
    workflowName: i % 3 === 0 ? 'Standard Leave Policy' : i % 3 === 1 ? 'High Value Encashment' : 'International Travel Route',
    requester: { 
      name: ['Ahmed Khan', 'Sara Miller', 'Tom Chen', 'Zoya Malik', 'Ali Raza'][i % 5], 
      avatar: ['AK', 'SM', 'TC', 'ZM', 'AR'][i % 5],
      id: `EMP-10${i % 5 + 1}`
    },
    entity: entities[i % 5],
    currentStep: status === 'In Progress' ? 'Manager Approval' : status === 'Approved' ? 'Finalized' : 'HR Review',
    status,
    startedAt: 'Feb 12, 2025 • 09:00 AM',
    slaHoursRemaining: status === 'In Progress' ? (24 - (i * 2)) : 0,
    history: [
      { step: 'Submission', who: 'Self', decision: 'Submitted', when: 'Feb 12, 09:00 AM', sla: 'N/A', status: 'completed' },
      { step: 'Manager Approval', who: 'Sarah Admin', decision: status === 'Approved' ? 'Approved' : 'Pending', when: status === 'Approved' ? 'Feb 12, 11:30 AM' : '-', comment: status === 'Approved' ? 'Looks good, approved.' : undefined, sla: '24h', status: status === 'Approved' ? 'completed' : 'current' },
      { step: 'HR Review', who: 'Zeeshan Malik', decision: 'Pending', when: '-', sla: '48h', status: status === 'Approved' ? 'current' : 'pending' }
    ]
  };
});

export const WorkflowInstancesList = () => {
  const [activeTab, setActiveTab] = useState<'In Progress' | 'Completed' | 'Escalated' | 'All'>('In Progress');
  const [search, setSearch] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);

  const filteredInstances = useMemo(() => {
    return MOCK_INSTANCES.filter(inst => {
      const matchesSearch = inst.requester.name.toLowerCase().includes(search.toLowerCase()) || inst.id.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === 'All' || 
                         (activeTab === 'In Progress' && inst.status === 'In Progress') ||
                         (activeTab === 'Completed' && (inst.status === 'Approved' || inst.status === 'Rejected' || inst.status === 'Cancelled')) ||
                         (activeTab === 'Escalated' && inst.status === 'Escalated');
      return matchesSearch && matchesTab;
    });
  }, [activeTab, search]);

  const getStatusStyle = (status: WorkflowInstance['status']) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      case 'Escalated': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Cancelled': return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getSlaInfo = (hours: number) => {
    if (hours <= 0) return { label: 'Overdue', color: 'text-red-500' };
    if (hours < 8) return { label: `${hours}h left`, color: 'text-amber-500' };
    return { label: `${hours}h left`, color: 'text-emerald-500' };
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
            <ListTree size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Workflow Instances</h2>
            <p className="text-gray-500 font-medium">Track live approval processes and resolve bottlenecks in real-time.</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Filters Header */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {(['In Progress', 'Completed', 'Escalated', 'All'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-[#3E3B6F] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search requester or instance ID..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instance ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workflow / Entity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requester</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Step</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">SLA</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInstances.map((inst) => {
                const sla = getSlaInfo(inst.slaHoursRemaining);
                return (
                  <tr key={inst.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedInstance(inst)}>
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-bold text-[#3E3B6F] bg-indigo-50 px-2 py-1 rounded">
                        {inst.id}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{inst.workflowName}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-tighter">{inst.entity} Entity</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">
                          {inst.requester.avatar}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-800">{inst.requester.name}</p>
                           <p className="text-[9px] text-gray-400 uppercase font-medium">{inst.requester.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-600">{inst.currentStep}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(inst.status)}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      {inst.status === 'In Progress' ? (
                        <span className={`text-[10px] font-bold ${sla.color} flex items-center gap-1 justify-center`}>
                           <Clock size={12} /> {sla.label}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase">Closed</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100 transition-all opacity-0 group-hover:opacity-100">
                          <Eye size={18}/>
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
           <p className="text-xs text-gray-500 font-medium italic">Showing <span className="font-bold">{filteredInstances.length}</span> active threads</p>
           <div className="flex gap-1">
             <button className="w-8 h-8 rounded-lg bg-[#3E3B6F] text-white text-xs font-bold">1</button>
             <button className="w-8 h-8 rounded-lg hover:bg-white text-gray-500 text-xs font-bold transition-all">2</button>
             <button className="p-2 hover:text-[#3E3B6F] text-gray-400 transition-all"><ChevronRight size={18}/></button>
           </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedInstance && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInstance(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[600px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col font-['League_Spartan']">
             {/* Drawer Header */}
             <div className="p-8 bg-[#3E3B6F] text-white flex justify-between items-start shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                    <GitMerge size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Instance Audit: {selectedInstance.id}</h3>
                    <p className="text-indigo-200 text-xs mt-1 uppercase tracking-widest font-bold">Started {selectedInstance.startedAt}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInstance(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-modal-scroll">
                {/* Visual Progress Pipeline */}
                <section className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Approval Pipeline</h4>
                   <div className="flex items-center justify-between px-4 relative">
                      {/* Connection Line */}
                      <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                      
                      {selectedInstance.history.map((h, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                           <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all ${
                             h.status === 'completed' ? 'bg-emerald-500 text-white' : 
                             h.status === 'current' ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' : 
                             'bg-gray-100 text-gray-300'
                           }`}>
                             {h.status === 'completed' ? <CheckCircle2 size={16} /> : i + 1}
                           </div>
                           <span className={`text-[9px] font-bold uppercase text-center w-20 ${h.status === 'current' ? 'text-indigo-600' : 'text-gray-400'}`}>
                             {h.step}
                           </span>
                        </div>
                      ))}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                         <div className="w-10 h-10 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center shadow-md text-gray-300">
                           <Zap size={16} />
                         </div>
                         <span className="text-[9px] font-bold uppercase text-gray-400">Finish</span>
                      </div>
                   </div>
                </section>

                {/* Requester Profile */}
                <section className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Initiated By</h4>
                   <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-200 flex items-center gap-5 shadow-inner">
                      <div className="w-14 h-14 rounded-2xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-lg shadow-sm border-2 border-white">
                        {selectedInstance.requester.avatar}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 leading-none">{selectedInstance.requester.name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-2">{selectedInstance.requester.id} • Senior Software Engineer</p>
                      </div>
                      <ArrowUpRight size={20} className="ml-auto text-gray-300" />
                   </div>
                </section>

                {/* Step History */}
                <section className="space-y-6">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <History size={14} className="text-[#3E3B6F]" /> Execution Timeline
                   </h4>
                   <div className="space-y-8 relative pl-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {selectedInstance.history.map((step, i) => (
                        <div key={i} className="relative group">
                           <div className={`absolute left-[-25px] top-1.5 w-3 h-3 rounded-full border-2 border-white transition-all ${
                             step.status === 'completed' ? 'bg-emerald-500' : step.status === 'current' ? 'bg-indigo-600 animate-pulse' : 'bg-gray-200'
                           }`} />
                           <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-indigo-100">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{step.step}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">{step.who} • <span className="text-[#3E3B6F] font-bold">{step.decision}</span></p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{step.when}</p>
                                    <span className="text-[8px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">SLA: {step.sla}</span>
                                 </div>
                              </div>
                              {step.comment && (
                                <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-50 flex items-start gap-3">
                                   <MessageSquare size={12} className="text-[#3E3B6F] mt-0.5 shrink-0" />
                                   <p className="text-xs text-indigo-900 font-medium italic leading-relaxed">"{step.comment}"</p>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Audit Context */}
                <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-4">
                   <ShieldAlert size={20} className="text-blue-600 shrink-0 mt-0.5" />
                   <div>
                      <h5 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">Audit Compliance</h5>
                      <p className="text-xs text-blue-800/70 leading-relaxed font-medium">
                        This instance is executing under <span className="font-bold underline text-[#3E3B6F]">Policy v2.1</span>. Any manual overrides are automatically flagged for the quarterly compliance review.
                      </p>
                   </div>
                </div>
             </div>

             {/* Footer Actions */}
             <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
                <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">View Entity Details</button>
                {selectedInstance.status === 'In Progress' && (
                  <button className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all text-xs uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2">
                    <Zap size={16} /> Force Escalate
                  </button>
                )}
                {selectedInstance.status === 'Escalated' && (
                  <button className="flex-1 py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest active:scale-95">Resolve Overdue</button>
                )}
             </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};
