import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ArrowRight, 
  History, 
  MoreVertical,
  X,
  FileText,
  ShieldCheck,
  Zap,
  RefreshCcw,
  ExternalLink,
  Info
} from 'lucide-react';

type InstanceStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED' | 'REJECTED';

interface WorkflowStepInstance {
  name: string;
  approver: string;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING' | 'REJECTED';
  timestamp?: string;
  comment?: string;
}

interface WorkflowInstance {
  id: string;
  workflowName: string;
  requester: { name: string; avatar: string; id: string };
  entity: string;
  currentStep: string;
  status: InstanceStatus;
  slaHours: number;
  startedAt: string;
  steps: WorkflowStepInstance[];
}

const MOCK_INSTANCES: WorkflowInstance[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `INST-${8000 + i}`,
  workflowName: ['Standard OT Approval', 'Simple Correction', 'Critical Field Swap', 'GOP-Level Roster Audit'][i % 4],
  requester: { 
    name: ['Sarah Chen', 'Ahmed Khan', 'James Wilson', 'Priya Das', 'Elena Rodriguez'][i % 5],
    avatar: ['SC', 'AK', 'JW', 'PD', 'ER'][i % 5],
    id: `FLX-${200 + i}`
  },
  entity: ['OT Request', 'Regularization', 'Shift Swap', 'Roster Publish'][i % 4],
  currentStep: i % 4 === 3 ? 'Final Release' : 'Manager Review',
  status: i % 10 === 0 ? 'ESCALATED' : i % 3 === 0 ? 'COMPLETED' : 'IN_PROGRESS',
  slaHours: i % 10 === 0 ? -2 : Math.floor(Math.random() * 48),
  startedAt: `Jan ${14 - (i % 5)}, 2025`,
  steps: [
    { name: 'Submission', approver: 'Employee', status: 'COMPLETED', timestamp: 'Jan 14, 09:00 AM' },
    { name: 'Manager Review', approver: 'Line Manager', status: i % 3 === 0 ? 'COMPLETED' : 'CURRENT', timestamp: i % 3 === 0 ? 'Jan 14, 02:00 PM' : undefined },
    { name: 'Final Release', approver: 'HR VP', status: i % 3 === 0 ? 'COMPLETED' : 'PENDING' }
  ]
}));

export const WorkflowInstances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InstanceStatus | 'ALL'>('IN_PROGRESS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);

  const filteredInstances = useMemo(() => {
    return MOCK_INSTANCES.filter(inst => {
      const matchesTab = activeTab === 'ALL' || inst.status === activeTab;
      const matchesSearch = inst.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           inst.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <GitBranch className="text-[#3E3B6F]" size={28} /> Workflow Instances
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Monitor live approval cycles and audit process bottlenecks</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCcw size={18} /> Refresh Grid
          </button>
        </div>
      </div>

      {/* TABS & FILTERS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl w-full md:w-auto">
          {(['IN_PROGRESS', 'COMPLETED', 'ESCALATED', 'ALL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-100 hidden md:block"></div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or Employee..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium border-none outline-none focus:ring-0 bg-transparent"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Instance ID</th>
                <th className="px-6 py-5">Workflow</th>
                <th className="px-6 py-5">Requester</th>
                <th className="px-6 py-5">Entity</th>
                <th className="px-6 py-5">Current Step</th>
                <th className="px-6 py-5 text-center">SLA Status</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInstances.map((inst) => (
                <tr key={inst.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-black text-indigo-600 tabular-nums">{inst.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-gray-800">{inst.workflowName}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black">
                        {inst.requester.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700">{inst.requester.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{inst.requester.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{inst.entity}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#3E3B6F] animate-pulse"></div>
                       <span className="text-xs font-bold text-gray-600">{inst.currentStep}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                      inst.slaHours < 0 ? 'bg-red-50 text-red-600 border-red-100' : 
                      inst.slaHours < 12 ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      <Clock size={12} />
                      {inst.slaHours < 0 ? 'OVERDUE' : `${inst.slaHours}h LEFT`}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      inst.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                      inst.status === 'ESCALATED' ? 'bg-red-50 text-red-600' :
                      'bg-indigo-50 text-[#3E3B6F]'
                    }`}>
                      {inst.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setSelectedInstance(inst)}
                        className="px-4 py-1.5 bg-[#3E3B6F] text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Inspect
                      </button>
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInstances.length === 0 && (
            <div className="p-24 text-center flex flex-col items-center justify-center opacity-30">
              <Zap size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Active Instances</h3>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedInstance && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedInstance(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg shadow-[#3E3B6F]/20">
                  <GitBranch size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 tabular-nums">Instance: {selectedInstance.id}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedInstance.workflowName} • Started {selectedInstance.startedAt}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInstance(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-10">
              {/* VISUAL FLOW MAP */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-500" /> Active Progress Path
                </h4>
                <div className="flex items-center justify-between px-10 relative">
                  <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
                  {selectedInstance.steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 relative">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                        step.status === 'COMPLETED' ? 'bg-green-500 border-green-100 text-white' :
                        step.status === 'CURRENT' ? 'bg-white border-[#3E3B6F] text-[#3E3B6F] shadow-xl scale-125' :
                        'bg-white border-gray-100 text-gray-300'
                      }`}>
                        {step.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : i + 1}
                      </div>
                      <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'CURRENT' ? 'text-[#3E3B6F]' : 'text-gray-400'}`}>{step.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 mt-1">{step.approver}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                {/* STEP HISTORY */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> Audit Trail
                  </h4>
                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                    {selectedInstance.steps.filter(s => s.status === 'COMPLETED').map((step, i) => (
                      <div key={i} className="flex gap-6 relative pl-8 animate-in slide-in-from-left-4 duration-300">
                        <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                        <div className="flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex justify-between items-start mb-2">
                              <p className="text-[11px] font-black text-gray-800 uppercase">{step.name}</p>
                              <span className="text-[9px] font-bold text-gray-400 tabular-nums">{step.timestamp}</span>
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                              <User size={12} />
                              <span>Approved by {step.approver}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-6 relative pl-8">
                       <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#3E3B6F] border-2 border-white shadow-sm animate-pulse" />
                       <div className="flex-1 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <p className="text-[11px] font-black text-indigo-700 uppercase">Awaiting Action</p>
                          <p className="text-[10px] text-indigo-600 mt-1 font-medium">Currently with {selectedInstance.steps.find(s => s.status === 'CURRENT')?.approver}</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* ENTITY PREVIEW */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Subject Entity
                  </h4>
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400">Request Type:</span>
                        <span className="text-xs font-black text-[#3E3B6F] uppercase">{selectedInstance.entity}</span>
                     </div>
                     <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Details Preview</p>
                        <p className="text-xs font-bold text-gray-700 leading-relaxed italic">
                          "Requesting 3.5h OT for Jan 12 production release window."
                        </p>
                        <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                          View Full Document <ExternalLink size={12} />
                        </button>
                     </div>
                     <div className="flex gap-4">
                        <button className="flex-1 py-3 bg-white border border-orange-200 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all">
                          Escalate Now
                        </button>
                        <button className="flex-1 py-3 bg-white border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">
                          Void Instance
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <Info size={16} className="text-blue-500" />
                  <p className="text-[10px] text-gray-500 font-medium">All state changes are immutable and recorded in the system audit log.</p>
               </div>
               <button className="px-10 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Action This Instance
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
