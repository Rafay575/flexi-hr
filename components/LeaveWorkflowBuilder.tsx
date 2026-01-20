import React, { useState } from 'react';
import { 
  GitMerge, Plus, X, ArrowRight, Save, Send, Eye,
  Clock, ShieldCheck, User, Users, Building, Settings,
  Zap, AlertTriangle, CheckCircle2, ChevronRight,
  GripVertical, Trash2, Info, LayoutList, Database,
  Plane, Sliders, DollarSign, Calculator
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'Approval' | 'Review' | 'Auto-Approve';
  approverType: 'Manager' | 'Role' | 'Static User' | 'Dept Head' | 'Expression';
  approverValue: string;
  sla: number;
  escalateTo?: string;
  actions: string[];
}

const DEFAULT_STEPS: WorkflowStep[] = [
  { id: '1', name: 'Line Manager', type: 'Approval', approverType: 'Manager', approverValue: 'L1', sla: 24, actions: ['Approve', 'Reject', 'Request Info'] },
  { id: '2', name: 'HR Operations', type: 'Review', approverType: 'Role', approverValue: 'HR_Admin', sla: 48, actions: ['Approve', 'Reject'] },
];

export const LeaveWorkflowBuilder = () => {
  const [workflowName, setWorkflowName] = useState('Standard Leave Policy');
  const [entity, setEntity] = useState('Leave Request');
  const [steps, setSteps] = useState<WorkflowStep[]>(DEFAULT_STEPS);
  const [selectedStepId, setSelectedStepId] = useState<string | null>('1');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');

  const selectedStep = steps.find(s => s.id === selectedStepId);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: 'New Step',
      type: 'Approval',
      approverType: 'Manager',
      approverValue: 'L1',
      sla: 24,
      actions: ['Approve', 'Reject']
    };
    setSteps([...steps, newStep]);
    setSelectedStepId(newStep.id);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
    if (selectedStepId === id) setSelectedStepId(null);
  };

  const updateStep = (updates: Partial<WorkflowStep>) => {
    setSteps(steps.map(s => s.id === selectedStepId ? { ...s, ...updates } : s));
  };

  return (
    <div className="flex h-full bg-[#F5F5F5] font-['League_Spartan'] overflow-hidden">
      {/* Left Area: Visual Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden relative border-r border-gray-200">
        {/* Header */}
        <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <GitMerge size={24} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <input 
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="text-xl font-bold text-gray-900 border-none bg-transparent outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 -ml-1 w-64"
                />
                <span className="px-2 py-0.5 bg-indigo-50 text-[#3E3B6F] text-[10px] font-bold rounded uppercase border border-indigo-100">v2.1</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${status === 'Draft' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-400 font-medium">Entity Type:</p>
                <select 
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="bg-transparent text-xs font-bold text-indigo-600 outline-none cursor-pointer"
                >
                  <option>Leave Request</option>
                  <option>Comp-Off Credit</option>
                  <option>Encashment</option>
                  <option>OD/Travel</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-gray-100">
              <Eye size={20}/>
            </button>
            <button className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-gray-100">
              <Settings size={20}/>
            </button>
          </div>
        </header>

        {/* Canvas Body */}
        <div className="flex-1 overflow-auto p-12 flex flex-col items-center">
          <div className="w-full max-w-lg space-y-12">
            {/* Start Node */}
            <div className="flex flex-col items-center group">
              <div className="w-40 py-4 bg-white border-2 border-gray-100 rounded-[24px] shadow-sm text-center font-bold text-gray-400 uppercase tracking-widest text-[10px] flex flex-col items-center gap-2">
                <Database size={16} /> START
              </div>
              <div className="w-0.5 h-12 bg-gray-200 border-dashed border-l-2" />
            </div>

            {/* Dynamic Steps */}
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center animate-in slide-in-from-top-4">
                <div 
                  onClick={() => setSelectedStepId(step.id)}
                  className={`w-64 p-6 rounded-[32px] border-2 transition-all cursor-pointer relative group flex flex-col items-center text-center ${
                    selectedStepId === step.id 
                      ? 'bg-[#3E3B6F] border-[#3E3B6F] shadow-xl shadow-[#3E3B6F]/20 text-white' 
                      : 'bg-white border-gray-100 shadow-sm hover:border-indigo-200 text-gray-800'
                  }`}
                >
                   <div className={`absolute -left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${selectedStepId === step.id ? 'bg-white/10' : 'bg-gray-50'}`}>
                      <GripVertical size={14} className={selectedStepId === step.id ? 'text-white/40' : 'text-gray-300'} />
                   </div>
                   
                   <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-2 ${selectedStepId === step.id ? 'text-[#E8D5A3]' : 'text-indigo-400'}`}>
                    Step {index + 1}: {step.type}
                   </span>
                   <h4 className="font-bold text-sm">{step.name}</h4>
                   <div className={`mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase ${selectedStepId === step.id ? 'text-white/60' : 'text-gray-400'}`}>
                     <Clock size={12} /> {step.sla}h SLA
                   </div>

                   {selectedStepId === step.id && (
                     <div className="absolute -right-12 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in">
                       <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}>
                         <Trash2 size={14} />
                       </div>
                     </div>
                   )}
                </div>
                <div className="w-0.5 h-12 bg-gray-200 border-dashed border-l-2" />
              </div>
            ))}

            {/* Add Step Action */}
            <div className="flex flex-col items-center">
              <button 
                onClick={addStep}
                className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-dashed border-gray-200 rounded-[28px] text-xs font-bold text-gray-400 hover:border-[#3E3B6F] hover:text-[#3E3B6F] hover:bg-indigo-50 transition-all active:scale-95 group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Add Approval Step
              </button>
              <div className="w-0.5 h-12 bg-gray-200 border-dashed border-l-2" />
            </div>

            {/* End Node */}
            <div className="flex flex-col items-center">
              <div className="w-40 py-4 bg-emerald-50 border-2 border-emerald-100 rounded-[24px] shadow-sm text-center font-bold text-emerald-600 uppercase tracking-widest text-[10px] flex flex-col items-center gap-2">
                <CheckCircle2 size={16} /> END / FINALIZED
              </div>
            </div>
          </div>
        </div>

        {/* Global Conditions Section */}
        <section className="bg-white border-t border-gray-100 p-8 shrink-0 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#3E3B6F]" /> Workflow Triggers
              </h3>
              <p className="text-[10px] font-bold text-gray-400">APPLY THIS WORKFLOW WHEN:</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Leave Type</p>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold outline-none">
                   <option>All Paid Types</option>
                   <option>Annual Leave</option>
                   <option>Sick Leave</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Duration Rule</p>
                <div className="flex gap-2">
                   <select className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold outline-none">
                      <option>&gt; X Days</option>
                      <option>&lt; X Days</option>
                   </select>
                   <input type="number" defaultValue={5} className="w-16 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold text-center" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Employee Scope</p>
                <button className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold text-left flex items-center justify-between group">
                   <span>Permanent Staff (L1-L5)</span>
                   <Sliders size={14} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              </div>
           </div>
        </section>
      </main>

      {/* Right Sidebar: Step Configuration */}
      <aside className="w-[400px] bg-white flex flex-col shrink-0">
        {selectedStep ? (
          <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Step Configuration</p>
              <h3 className="text-xl font-bold text-gray-900">{selectedStep.name}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scroll">
              {/* Step Name */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Step Name *</label>
                 <input 
                  type="text" 
                  value={selectedStep.name}
                  onChange={(e) => updateStep({ name: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none font-bold text-gray-800 transition-all"
                 />
              </div>

              {/* Step Type */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Process Type</label>
                 <div className="grid grid-cols-1 gap-2">
                    {(['Approval', 'Review', 'Auto-Approve'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => updateStep({ type: t })}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          selectedStep.type === t ? 'border-[#3E3B6F] bg-indigo-50/30' : 'border-gray-50 hover:border-gray-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedStep.type === t ? 'bg-[#3E3B6F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                           {t === 'Approval' ? <CheckSquare size={18}/> : t === 'Review' ? <Eye size={18}/> : <Zap size={18}/>}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-bold ${selectedStep.type === t ? 'text-[#3E3B6F]' : 'text-gray-700'}`}>{t}</p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {t === 'Approval' ? 'Requires explicit binary decision.' : t === 'Review' ? 'Informational only, no block.' : 'System decides based on rules.'}
                          </p>
                        </div>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Approver Identification */}
              <div className="space-y-6">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Designated Approver</label>
                 <div className="space-y-4">
                    <select 
                      value={selectedStep.approverType}
                      onChange={(e) => updateStep({ approverType: e.target.value as any })}
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-[#3E3B6F] outline-none shadow-sm"
                    >
                      <option value="Manager">Hierarchical Manager</option>
                      <option value="Role">Organization Role</option>
                      <option value="Static User">Specific Staff Member</option>
                      <option value="Dept Head">Department Head</option>
                    </select>

                    {selectedStep.approverType === 'Manager' && (
                       <div className="flex gap-2">
                          {['L1', 'L2', 'L3'].map(lvl => (
                            <button 
                              key={lvl}
                              onClick={() => updateStep({ approverValue: lvl })}
                              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                                selectedStep.approverValue === lvl ? 'bg-[#3E3B6F] text-white shadow-lg' : 'bg-gray-50 text-gray-400'
                              }`}
                            >
                              Level {lvl[1]}
                            </button>
                          ))}
                       </div>
                    )}

                    {selectedStep.approverType === 'Role' && (
                       <select 
                        value={selectedStep.approverValue}
                        onChange={(e) => updateStep({ approverValue: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-700 outline-none"
                       >
                          <option value="HR_Admin">HR Administrator</option>
                          <option value="FIN_Lead">Finance Controller</option>
                          <option value="DEPT_H">HOD Pool</option>
                       </select>
                    )}
                 </div>
              </div>

              {/* SLA & Escalation */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SLA & Escalation</label>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Enabled</span>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-3xl space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="flex-1 space-y-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Response Time Limit</p>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={selectedStep.sla}
                              onChange={(e) => updateStep({ sla: parseInt(e.target.value) || 0 })}
                              className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-gray-800 outline-none" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">Hours</span>
                          </div>
                       </div>
                       <ArrowRight size={14} className="text-gray-300 mt-5" />
                       <div className="flex-1 space-y-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Escalate To</p>
                          <select className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold outline-none">
                             <option>Skip Level Mgr</option>
                             <option>HR Central</option>
                             <option>Force Approve</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Available Actions */}
              <div className="space-y-4">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available Actions</label>
                 <div className="flex flex-wrap gap-2">
                    {['Approve', 'Reject', 'Request Info', 'Delegate'].map(action => (
                      <label key={action} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                        <input type="checkbox" defaultChecked={selectedStep.actions.includes(action)} className="rounded border-gray-300 text-[#3E3B6F]" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase">{action}</span>
                      </label>
                    ))}
                 </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100">
               <button onClick={() => setSelectedStepId(null)} className="w-full py-4 bg-white border border-gray-200 text-[#3E3B6F] font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-sm">
                 Close Configuration
               </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200">
              <Settings size={40} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Select a Step</h4>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">Click any node on the visual canvas to configure its approver logic, SLA and behavior.</p>
            </div>
          </div>
        )}
      </aside>

      {/* Persistent Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-6 flex items-center justify-between shadow-2xl z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-emerald-600">
             <CheckCircle2 size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">All changes auto-saved to cloud</span>
           </div>
           <div className="h-4 w-px bg-gray-200" />
           <p className="text-xs text-gray-400 font-medium">Last modified by Sarah Admin • Just now</p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-3.5 bg-white border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2">
             <Calculator size={18}/> Test Simulation
           </button>
           <button 
            onClick={() => setStatus('Published')}
            className="px-12 py-3.5 bg-[#3E3B6F] text-white font-bold rounded-2xl shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95"
           >
             <Send size={18} /> Publish v3.0
           </button>
        </div>
      </footer>

      <style>
        {`
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};

const CheckSquare = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);
