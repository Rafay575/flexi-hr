import React, { useState } from 'react';
import { 
  GitMerge, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  History, 
  Layers, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Eye,
  Edit3,
  Copy,
  Archive,
  Zap,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Internal icon shim - Moved above usage to prevent "used before its declaration" errors
const ArrowRightLeft: React.FC<{ size: number, className?: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
  </svg>
);

const Calendar: React.FC<{ size: number, className?: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

type WorkflowEntity = 
  | 'Regularization' 
  | 'OT Request' 
  | 'Shift Swap' 
  | 'Manual Punch' 
  | 'Roster Publish' 
  | 'Retro Correction';

interface WorkflowStep {
  id: string;
  name: string;
  approver: string;
  sla: string;
}

interface Workflow {
  id: string;
  name: string;
  entity: WorkflowEntity;
  steps: WorkflowStep[];
  version: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  updatedAt: string;
}

const ENTITY_ICONS: Record<WorkflowEntity, React.ReactNode> = {
  'Regularization': <History size={14} />,
  'OT Request': <Clock size={14} />,
  'Shift Swap': <ArrowRightLeft size={14} />,
  'Manual Punch': <Zap size={14} />,
  'Roster Publish': <Calendar size={14} />,
  'Retro Correction': <ShieldCheck size={14} />,
};

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Standard OT Approval',
    entity: 'OT Request',
    steps: [
      { id: '1', name: 'Manager Review', approver: 'Line Manager', sla: '24h' },
      { id: '2', name: 'Budget Check', approver: 'Dept Head', sla: '48h' }
    ],
    version: 'v2.4',
    status: 'PUBLISHED',
    updatedAt: 'Jan 10, 2025'
  },
  {
    id: 'WF-002',
    name: 'Simple Correction',
    entity: 'Regularization',
    steps: [
      { id: '1', name: 'Manager Review', approver: 'Line Manager', sla: '72h' }
    ],
    version: 'v1.0',
    status: 'PUBLISHED',
    updatedAt: 'Dec 15, 2024'
  },
  {
    id: 'WF-003',
    name: 'Critical Field Swap',
    entity: 'Shift Swap',
    steps: [
      { id: '1', name: 'Partner Acceptance', approver: 'Target Employee', sla: '12h' },
      { id: '2', name: 'Manager Review', approver: 'Line Manager', sla: '24h' }
    ],
    version: 'v3.1',
    status: 'PUBLISHED',
    updatedAt: 'Jan 02, 2025'
  },
  {
    id: 'WF-004',
    name: 'Admin Manual Override',
    entity: 'Manual Punch',
    steps: [
      { id: '1', name: 'HR Audit', approver: 'HR Manager', sla: '4h' }
    ],
    version: 'v1.2',
    status: 'PUBLISHED',
    updatedAt: 'Jan 12, 2025'
  },
  {
    id: 'WF-005',
    name: 'GOP-Level Roster Audit',
    entity: 'Roster Publish',
    steps: [
      { id: '1', name: 'Coverage Verification', approver: 'Ops Director', sla: '24h' },
      { id: '2', name: 'Final Release', approver: 'HR VP', sla: '24h' }
    ],
    version: 'v4.0',
    status: 'DRAFT',
    updatedAt: 'Today'
  },
  {
    id: 'WF-006',
    name: 'Retroactive Pay Impact',
    entity: 'Retro Correction',
    steps: [
      { id: '1', name: 'Audit Review', approver: 'Compliance Lead', sla: '48h' },
      { id: '2', name: 'Finance Review', approver: 'Payroll Mgr', sla: '48h' },
      { id: '3', name: 'Approval', approver: 'Finance Director', sla: '24h' }
    ],
    version: 'v2.1',
    status: 'PUBLISHED',
    updatedAt: 'Nov 20, 2024'
  },
  {
    id: 'WF-007',
    name: 'Seasonal Temp Roster',
    entity: 'Roster Publish',
    steps: [
      { id: '1', name: 'Manager Review', approver: 'Floor Mgr', sla: '24h' }
    ],
    version: 'v1.0',
    status: 'ARCHIVED',
    updatedAt: 'Oct 12, 2024'
  },
  {
    id: 'WF-008',
    name: 'Multi-Stage Geo Correction',
    entity: 'Regularization',
    steps: [
      { id: '1', name: 'Verification', approver: 'Site Lead', sla: '24h' },
      { id: '2', name: 'HR Authorization', approver: 'HR Partner', sla: '24h' }
    ],
    version: 'v2.2',
    status: 'PUBLISHED',
    updatedAt: 'Jan 05, 2025'
  }
];

export const TimeSyncWorkflowsList: React.FC<{ onCreateNew?: () => void }> = ({ onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const filteredWorkflows = MOCK_WORKFLOWS.filter(wf => 
    wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wf.entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <GitMerge className="text-[#3E3B6F]" size={28} /> Approval Workflows
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Configure multi-stage routing and SLA rules for all time-related entities</p>
        </div>
        <button 
          onClick={()=>navigate('/timesync/workflows/new')}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Workflow
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search workflows by name or entity..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium border-none outline-none focus:ring-0"
          />
        </div>
        <div className="h-6 w-px bg-gray-100"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-[#3E3B6F] transition-colors">
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Workflow Name</th>
                <th className="px-6 py-5">Entity Type</th>
                <th className="px-6 py-5">Approval Sequence</th>
                <th className="px-6 py-5 text-center">Steps</th>
                <th className="px-6 py-5">Version</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredWorkflows.map((wf) => (
                <tr key={wf.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 group-hover:text-[#3E3B6F] transition-colors">{wf.name}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter tabular-nums">{wf.id} • Updated {wf.updatedAt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-gray-100 rounded text-gray-500">
                          {ENTITY_ICONS[wf.entity]}
                       </div>
                       <span className="text-[11px] font-bold text-gray-600">{wf.entity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       {wf.steps.map((step, idx) => (
                         <React.Fragment key={step.id}>
                           <div className="flex flex-col items-center">
                              <div className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[9px] font-black text-gray-500 shadow-sm" title={`Approver: ${step.approver}`}>
                                {step.name}
                              </div>
                           </div>
                           {idx < wf.steps.length - 1 && <ArrowRight size={12} className="text-gray-300" />}
                         </React.Fragment>
                       ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-black text-[#3E3B6F] bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 tabular-nums">
                      {wf.steps.length}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-gray-400 tabular-nums">{wf.version}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      wf.status === 'PUBLISHED' ? 'bg-green-50 text-green-600 border-green-100' : 
                      wf.status === 'DRAFT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      'bg-gray-50 text-gray-400 border-gray-100'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${wf.status === 'PUBLISHED' ? 'bg-green-500' : wf.status === 'DRAFT' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      {wf.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                       <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg" title="View Detail"><Eye size={16}/></button>
                       <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg" title="Edit Logic"><Edit3 size={16}/></button>
                       <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg" title="Clone"><Copy size={16}/></button>
                       <div className="w-px h-4 bg-gray-200 mx-1"></div>
                       <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Archive"><Archive size={16}/></button>
                       <button className="p-2 text-gray-300 hover:text-gray-600"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredWorkflows.length === 0 && (
            <div className="p-20 text-center opacity-30 flex flex-col items-center">
              <GitMerge size={64} className="text-gray-300 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-gray-500">No matching workflows</p>
            </div>
          )}
        </div>
        
        {/* FOOTER INFO */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-[10px] font-black uppercase tracking-widest">
               <Info size={12} />
               Active workflows cannot be edited directly; create a new draft version.
             </div>
          </div>
          <button className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest hover:underline flex items-center gap-2">
            View Global Routing Rules <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* COMPLIANCE NOTE */}
      <div className="bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl p-6 flex gap-5">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#3E3B6F] shrink-0 border border-[#E8D5A3]/20">
            <ShieldCheck size={24} />
         </div>
         <div>
            <h4 className="text-sm font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Workflow Validation</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
               All published workflows are periodically audited for <span className="font-bold underline decoration-indigo-200 italic">"Looping Deadlocks"</span> and SLA bottlenecks. The current average approval time across all entities is <span className="font-black text-[#3E3B6F]">14.2 hours</span>.
            </p>
         </div>
      </div>
    </div>
  );
};
