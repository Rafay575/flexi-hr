import React, { useState } from 'react';
import { 
  GitMerge, 
  Plus, 
  X, 
  Save, 
  Play, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Users, 
  Zap, 
  AlertTriangle, 
  Settings2, 
  ArrowRight, 
  Trash2,
  Lock,
  Layers,
  Bot,
  // Fixed: Added missing Info icon import
  Info
} from 'lucide-react';

type EntityType = 'Regularization' | 'OT Request' | 'Shift Swap' | 'Manual Punch' | 'Roster Publish' | 'Retro Correction';
type StepType = 'APPROVAL' | 'REVIEW' | 'AUTO_APPROVE' | 'CONDITION';

interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  approver: string;
  slaHours: number;
  conditions?: string;
  escalationTo?: string;
}

export const TimeSyncWorkflowBuilder: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [workflowName, setWorkflowName] = useState('Critical OT Authorization');
  const [entity, setEntity] = useState<EntityType>('OT Request');
  const [activeStepId, setActiveStepId] = useState<string | null>('1');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', type: 'APPROVAL', name: 'Line Manager Review', approver: 'Direct Manager', slaHours: 24, escalationTo: 'Dept Head' },
    { id: '2', type: 'CONDITION', name: 'Threshold Check', approver: 'System AI', slaHours: 0, conditions: 'If OT > 4.0h' },
    { id: '3', type: 'APPROVAL', name: 'HR Authorization', approver: 'HR Manager', slaHours: 48 }
  ]);

  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { id: newId, type: 'APPROVAL', name: 'New Step', approver: 'Manager', slaHours: 24 }]);
    setActiveStepId(newId);
  };

  const activeStep = steps.find(s => s.id === activeStepId);

  return (
    <div className=" bg-[#F5F5F5] flex flex-col animate-in fade-in duration-500">
      {/* HEADER */}
      

      <div className="flex-1 flex overflow-hidden">
        {/* CANVAS AREA */}
        <div className="flex-1 overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] relative">
          <div className="min-w-max p-20 flex flex-col items-center">
            
            {/* START NODE */}
            <div className="w-16 h-16 rounded-full bg-white border-4 border-[#3E3B6F] flex items-center justify-center shadow-lg relative mb-12">
               <Zap size={24} className="text-[#3E3B6F]" />
               <div className="absolute top-full mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Trigger</div>
               <div className="absolute top-full mt-10 h-10 w-0.5 bg-gray-200" />
            </div>

            {/* STEPS LIST */}
            <div className="flex flex-col items-center gap-12">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div 
                    onClick={() => setActiveStepId(step.id)}
                    className={`relative w-64 p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                      activeStepId === step.id 
                        ? 'bg-white border-[#3E3B6F] shadow-2xl scale-105' 
                        : 'bg-white/80 border-gray-100 hover:border-indigo-200 shadow-md'
                    }`}
                  >
                    <div className="absolute -left-3 -top-3 w-8 h-8 rounded-xl bg-[#3E3B6F] text-white flex items-center justify-center text-xs font-black shadow-lg">
                       {idx + 1}
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            step.type === 'CONDITION' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {step.type}
                          </span>
                          {step.slaHours > 0 && (
                            <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1">
                               <Clock size={10} /> {step.slaHours}h
                            </span>
                          )}
                       </div>
                       <h4 className="font-bold text-gray-800 truncate">{step.name}</h4>
                       <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                          {step.type === 'CONDITION' ? <Bot size={12}/> : <Users size={12}/>}
                          <span>{step.approver}</span>
                       </div>
                    </div>

                    {/* CONNECTORS */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 h-12 w-0.5 bg-gray-200">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}

              <button 
                onClick={addStep}
                className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#3E3B6F] hover:text-[#3E3B6F] hover:bg-white transition-all group"
              >
                <Plus size={20} className="group-hover:scale-125 transition-transform" />
              </button>

              {/* END NODE */}
              <div className="mt-8 flex flex-col items-center">
                <div className="h-12 w-0.5 bg-gray-200 mb-2" />
                <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-200">
                   <ShieldCheck size={28} />
                </div>
                <span className="mt-3 text-[10px] font-black text-green-600 uppercase tracking-widest">Published State</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP CONFIGURATION PANEL */}
        <aside className="w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10 shrink-0">
          {activeStep ? (
            <>
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Settings2 size={16} /> Step Configuration
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step Name</label>
                    <input 
                      type="text" 
                      value={activeStep.name}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        const idx = newSteps.findIndex(s => s.id === activeStepId);
                        newSteps[idx].name = e.target.value;
                        setSteps(newSteps);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step Type</label>
                      <select 
                        value={activeStep.type}
                        onChange={(e) => {
                          const newSteps = [...steps];
                          const idx = newSteps.findIndex(s => s.id === activeStepId);
                          newSteps[idx].type = e.target.value as StepType;
                          setSteps(newSteps);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                      >
                        <option value="APPROVAL">Approval</option>
                        <option value="REVIEW">Review</option>
                        <option value="AUTO_APPROVE">Auto-Approve</option>
                        <option value="CONDITION">Condition</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approver Level</label>
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold">
                        <option>Manager</option>
                        <option>Dept Head</option>
                        <option>HR Manager</option>
                        <option>Payroll Lead</option>
                        <option>Custom Role</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* CONDITIONAL LOGIC */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Zap size={14} className="text-orange-500" /> Dynamic Branching
                     </h4>
                     <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
                     </div>
                   </div>
                   <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                      <p className="text-[10px] font-black text-[#3E3B6F] uppercase mb-2">Requirement Logic</p>
                      <textarea 
                        className="w-full bg-white border border-indigo-100 rounded-xl p-3 text-[11px] font-bold text-gray-700 h-24 outline-none"
                        placeholder="Ex: If entity.total_hours > 4.0 THEN require HR Approval ELSE skip step..."
                        value={activeStep.conditions}
                      />
                   </div>
                </div>

                {/* SLA & ESCALATION */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> Performance (SLA)
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-gray-500 uppercase">Response Time (h)</p>
                        <input type="number" value={activeStep.slaHours} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-black tabular-nums" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-gray-500 uppercase">Auto-Escalate To</p>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold">
                           <option>Line Manager +1</option>
                           <option>Department Head</option>
                           <option>HR VP</option>
                        </select>
                      </div>
                   </div>
                </div>

                {/* NOTIFICATIONS */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step Notifications</h4>
                   <div className="space-y-2">
                      {['Send In-App Push', 'Email Notification', 'SMS for Overdue SLA'].map(n => (
                        <label key={n} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                           <div className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-[#3E3B6F] rounded-sm" />
                           </div>
                           <span className="text-[11px] font-bold text-gray-700">{n}</span>
                        </label>
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                 <button className="w-full py-3 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Remove This Step
                 </button>
                 <div className="p-3 flex items-center gap-3 bg-white rounded-xl border border-gray-100">
                    {/* Fixed: Info icon is now imported above */}
                    <Info size={14} className="text-blue-500" />
                    <p className="text-[9px] text-gray-400 font-medium italic">Logic changes trigger version increments.</p>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale">
               <Layers size={64} className="text-gray-300 mb-6" />
               <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest">Select a Node</h3>
               <p className="text-xs font-medium text-gray-400 mt-2">Click on any workflow step to configure its specific logic and constraints.</p>
            </div>
          )}
        </aside>
      </div>

      {/* FOOTER BAR */}
   
    </div>
  );
};
