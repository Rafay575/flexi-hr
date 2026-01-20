import React, { useState } from 'react';
import { 
  GitBranch, Plus, Search, Filter, MoreVertical, 
  Settings2, ShieldCheck, Clock, AlertTriangle, 
  ChevronRight, ArrowRight, UserCheck, Calculator,
  Zap, Save, X, Layers, Play, Database,
  ArrowDown, Share2, Info, CheckCircle2, Trash2,
  GripVertical, MousePointer2, GitCommit
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  role: string;
  sla: string;
  escalation: string;
  actions: string[];
}

interface Workflow {
  id: string;
  name: string;
  entity: 'Payroll Run' | 'Loan Request' | 'Adjustment' | 'Promotion' | 'EOS';
  stepsCount: number;
  status: 'Active' | 'Draft' | 'Locked';
  conditions: string;
}

const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'WF-01', name: 'Standard Payroll Approval', entity: 'Payroll Run', stepsCount: 3, status: 'Active', conditions: 'Always' },
  { id: 'WF-02', name: 'High-Value Loan Process', entity: 'Loan Request', stepsCount: 4, status: 'Active', conditions: 'Amount > PKR 500,000' },
  { id: 'WF-03', name: 'Ad-hoc Bonus Workflow', entity: 'Adjustment', stepsCount: 2, status: 'Draft', conditions: 'Type = Bonus' },
  { id: 'WF-04', name: 'Director Promotion Cycle', entity: 'Promotion', stepsCount: 5, status: 'Locked', conditions: 'Target Grade >= G19' },
];

const MOCK_STEPS: WorkflowStep[] = [
  { id: 's1', role: 'Payroll Officer', sla: '4 Hours', escalation: 'HR Manager', actions: ['Calculate', 'Validate'] },
  { id: 's2', role: 'HR Manager', sla: '24 Hours', escalation: 'HR Director', actions: ['Review', 'Verify Compliance'] },
  { id: 's3', role: 'Finance Head', sla: '12 Hours', escalation: 'CFO', actions: ['Approve', 'Disburse'] },
];

export const PayEdgeWorkflowConfig: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>('s1');

  const currentStepData = MOCK_STEPS.find(s => s.id === activeStepId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
            <GitBranch size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Workflow Orchestration</h2>
            <p className="text-sm text-gray-500 font-medium">Design multi-tier approval chains and conditional routing logic</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedWorkflow(MOCK_WORKFLOWS[0]);
            setIsBuilding(true);
          }}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Create New Workflow
        </button>
      </div>

      {!isBuilding ? (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search workflows..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex gap-2">
               <button className="p-2 text-gray-400 hover:text-primary transition-all"><Filter size={20}/></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Workflow Identity</th>
                  <th className="px-8 py-5">Target Entity</th>
                  <th className="px-8 py-5 text-center">Steps</th>
                  <th className="px-8 py-5">Condition Triggers</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {MOCK_WORKFLOWS.map((wf) => (
                  <tr key={wf.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all"><GitBranch size={16}/></div>
                          <span className="font-bold text-gray-700">{wf.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-4">
                       <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 uppercase">{wf.entity}</span>
                    </td>
                    <td className="px-8 py-4 text-center font-black text-gray-400">{wf.stepsCount}</td>
                    <td className="px-8 py-4 text-xs font-mono text-gray-500">{wf.conditions}</td>
                    <td className="px-8 py-4 text-center">
                       <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                         wf.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
                         wf.status === 'Draft' ? 'bg-gray-50 text-gray-400 border-gray-200 border-dashed' :
                         'bg-purple-50 text-purple-600 border-purple-200'
                       }`}>{wf.status}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedWorkflow(wf); setIsBuilding(true); }} className="p-2 text-gray-300 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all shadow-sm"><Settings2 size={18}/></button>
                          <button className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           {/* Visual Builder Header */}
           <div className="flex items-center justify-between">
              <button onClick={() => setIsBuilding(false)} className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-primary transition-all">
                <ArrowRight size={16} className="rotate-180" /> Back to Workflow List
              </button>
              <div className="flex gap-3">
                 <button className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2">
                    <Share2 size={14} /> Export Logic
                 </button>
                 <button className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                    <Save size={14} /> Save Changes
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px]">
              {/* Tool Palette (Left - 1 col) */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                {[
                   { icon: UserCheck, label: 'Approver' },
                   { icon: Calculator, label: 'Logic' },
                   { icon: Database, label: 'Commit' },
                   { icon: Zap, label: 'Trigger' },
                ].map((tool, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-grab hover:border-primary transition-all group">
                    <tool.icon size={20} className="text-gray-400 group-hover:text-primary mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-400">{tool.label}</span>
                  </div>
                ))}
              </div>

              {/* Visual Canvas (Center - 7 cols) */}
              <div className="lg:col-span-7 relative bg-gray-900 rounded-[2.5rem] p-12 overflow-hidden shadow-2xl flex flex-col items-center">
                 {/* Grid Background */}
                 <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                 
                 {/* Workflow Flow */}
                 <div className="flex flex-col items-center w-full max-w-md gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-green-500 border-4 border-white/10 flex items-center justify-center text-white shadow-xl relative animate-pulse">
                       <Play size={24} fill="currentColor" />
                       <div className="absolute -bottom-10 h-10 w-0.5 bg-gray-700" />
                    </div>

                    <div className="h-4" />

                    {MOCK_STEPS.map((step, i) => (
                       <React.Fragment key={step.id}>
                          <div 
                            onClick={() => setActiveStepId(step.id)}
                            className={`w-full bg-white rounded-2xl p-5 shadow-xl border-4 transition-all cursor-pointer group relative ${
                              activeStepId === step.id ? 'border-primary scale-105' : 'border-transparent hover:border-white/20'
                            }`}
                          >
                             <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">Stage {i+1}</span>
                                <GripVertical size={14} className="text-gray-200 group-hover:text-gray-400" />
                             </div>
                             <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${activeStepId === step.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                  <UserCheck size={20}/>
                                </div>
                                <div>
                                   <p className="text-sm font-black text-gray-800">{step.role}</p>
                                   <div className="flex items-center gap-2 mt-1">
                                      <Clock size={10} className="text-gray-400" />
                                      <span className="text-[10px] text-gray-400 font-bold uppercase">{step.sla} Limit</span>
                                   </div>
                                </div>
                             </div>
                             
                             {/* Connector Dots */}
                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-700 border-4 border-gray-900 z-20" />
                             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-700 border-4 border-gray-900 z-20" />
                          </div>
                          {i < MOCK_STEPS.length - 1 ? (
                            <div className="h-10 w-0.5 bg-gray-700 relative">
                               <ArrowDown size={14} className="text-gray-700 absolute -bottom-2 -left-[6px]" />
                            </div>
                          ) : (
                            <div className="h-10 w-0.5 bg-gray-700 dashed border-l-2 border-dashed relative">
                               <ArrowDown size={14} className="text-gray-700 absolute -bottom-2 -left-[6px]" />
                            </div>
                          )}
                       </React.Fragment>
                    ))}

                    <div className="h-4" />

                    <div className="w-16 h-16 rounded-full bg-primary border-4 border-white/10 flex items-center justify-center text-accent shadow-xl relative">
                       <ShieldCheck size={28} />
                    </div>
                 </div>

                 {/* Canvas Controls */}
                 <div className="absolute bottom-8 right-8 flex gap-2">
                    <button className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all"><MousePointer2 size={20}/></button>
                    <button className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all"><Layers size={20}/></button>
                 </div>
              </div>

              {/* Property Inspector (Right - 4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                 {/* Step Configuration */}
                 <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-8 animate-in slide-in-from-right-2">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/5 text-primary rounded-xl"><Settings2 size={20}/></div>
                       <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-800">Step Inspector</h3>
                    </div>
                    
                    {currentStepData ? (
                       <div className="space-y-6">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approver Role</label>
                             <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10">
                                <option>{currentStepData.role}</option>
                                <option>HR Director</option>
                                <option>CFO</option>
                                <option>Audit Lead</option>
                             </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SLA Limit</label>
                                <div className="relative">
                                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                   <input type="text" defaultValue={currentStepData.sla} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" />
                                </div>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Escalation Path</label>
                                <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none">
                                   <option>{currentStepData.escalation}</option>
                                </select>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permitted Actions</label>
                             <div className="flex flex-wrap gap-2">
                                {currentStepData.actions.map(a => (
                                   <span key={a} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10 flex items-center gap-1.5 uppercase">
                                      {a} <X size={10} className="cursor-pointer hover:text-red-500" />
                                   </span>
                                ))}
                                <button className="px-3 py-1.5 border border-dashed border-gray-200 rounded-lg text-[10px] font-black text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                                   <Plus size={12} /> Add
                                </button>
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="py-20 text-center text-gray-300">
                          <Info size={40} className="mx-auto mb-2 opacity-20" />
                          <p className="text-xs font-bold uppercase">Select a step node</p>
                       </div>
                    )}
                 </div>

                 {/* Logic & Triggers */}
                 <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-8 animate-in slide-in-from-right-2">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Calculator size={20}/></div>
                       <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-800">Route Conditions</h3>
                    </div>

                    <div className="space-y-6">
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                          <div className="flex items-center justify-between">
                             <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Value Trigger</h4>
                             <GitCommit size={14} className="text-indigo-600" />
                          </div>
                          <div className="flex items-baseline gap-2">
                             <span className="text-[10px] font-black text-gray-400">NET SUM &gt;</span>
                             <span className="text-lg font-black text-gray-800 font-mono">PKR 500,000</span>
                          </div>
                       </div>

                       <div className="pt-4 border-t border-dashed space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content Tags</h4>
                          <div className="flex flex-wrap gap-2">
                             {['High Variance', 'Manual Overrides', 'Backdated'].map(tag => (
                               <button key={tag} className="px-3 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-lg border border-indigo-100 text-[10px] font-black uppercase transition-all hover:bg-indigo-600 hover:text-white">
                                  {tag}
                               </button>
                             ))}
                             <button className="p-1.5 bg-gray-50 text-gray-300 rounded-lg hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"><Plus size={14}/></button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Health Panel */}
                 <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 space-y-4 relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-xl"><ShieldCheck size={20} className="text-accent" /></div>
                          <h3 className="text-sm font-black uppercase tracking-tight">Logic Health</h3>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-white/70">
                             <span>Dead-end Routes</span>
                             <span className="text-green-300 uppercase">None</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-white/70">
                             <span>Cyclic Redundancy</span>
                             <span className="text-green-300 uppercase">Clear</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-white/70">
                             <span>Integrity Check</span>
                             <span className="text-accent uppercase">Verified</span>
                          </div>
                       </div>
                    </div>
                    <Database className="absolute right-[-20px] bottom-[-20px] text-white/5 w-40 h-40 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};