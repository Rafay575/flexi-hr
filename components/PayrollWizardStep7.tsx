
import React, { useState } from 'react';
/* Added missing icon imports CheckCircle2, RefreshCw */
import { 
  Check, Lock, FileText, Send, Download, Mail, 
  Bell, FileCheck, ShieldCheck, MessageSquare, 
  ChevronRight, ArrowRight, Printer, Landmark, 
  History, Building2, UserCheck, AlertCircle,
  CheckCircle2, RefreshCw
} from 'lucide-react';

interface PayrollWizardStep7Props {
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Select' },
  { id: 2, label: 'Ingest' },
  { id: 3, label: 'Validate' },
  { id: 4, label: 'Review' },
  { id: 5, label: 'Approve' },
  { id: 6, label: 'Finalize' },
  { id: 7, label: 'Disburse' }
];

export const PayrollWizardStep7: React.FC<PayrollWizardStep7Props> = ({ onNext, onBack, onCancel }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [genSteps, setGenSteps] = useState({
    payslips: true, advice: true, register: true, summary: true, jv: false, eobi: true, tax: true
  });
  const [notifyOptions, setNotifyOptions] = useState({ email: true, push: true, pdf: true });
  const [isGenerating, setIsGenerating] = useState(false);
  const [genComplete, setGenComplete] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenComplete(true);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Wizard Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 7 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  'bg-green-500 border-green-500 text-white'
                }`}>
                  {step.id < 7 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 7 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] bg-green-500 mx-4 mt-[-18px]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Approval History Banner */}
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl mb-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200">
              <UserCheck size={24} />
            </div>
            <div className="space-y-4">
               <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">HR Approval</span>
                    <span className="text-sm font-bold text-gray-700">Zainab Siddiqui <span className="text-[10px] font-normal text-gray-400 font-mono ml-1">Jan 15, 02:30 PM</span></span>
                  </div>
                  <div className="w-[1px] bg-green-200 h-8 self-center"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Finance Approval</span>
                    <span className="text-sm font-bold text-gray-700">M. Ahmed Raza <span className="text-[10px] font-normal text-gray-400 font-mono ml-1">Jan 15, 04:15 PM</span></span>
                  </div>
               </div>
               <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-green-100">
                  <MessageSquare size={14} className="text-green-600 mt-0.5" />
                  <p className="text-[11px] text-gray-600 italic">"Verified against HBL disbursement limits. Variances justified in Step 5."</p>
               </div>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-2 text-green-600 font-black uppercase text-xs tracking-widest mb-1">
                <ShieldCheck size={18} /> Cycle Authorized
             </div>
             <p className="text-[10px] text-gray-400">Transaction Ref: HRMS-PK-2025-001-AUTH</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* STEP A: LOCK */}
          <div className={`p-6 rounded-2xl border-2 transition-all ${isLocked ? 'bg-gray-50 border-gray-100 grayscale' : 'bg-white border-primary/10 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">A</div>
              <h4 className="text-sm font-black uppercase text-gray-700 tracking-tight">Final Lockdown</h4>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Locking prevents any further modifications. This will finalize the version <span className="font-bold">v1.2</span> for this run.
            </p>
            <button 
              onClick={() => setIsLocked(true)}
              disabled={isLocked}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isLocked ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-primary text-white hover:bg-primary/90 shadow-md'}`}
            >
              {isLocked ? <CheckCircle2 size={16} /> : <Lock size={16} />}
              {isLocked ? 'Run Locked' : 'Lock Payroll Run'}
            </button>
          </div>

          {/* STEP B: GENERATE */}
          <div className={`p-6 rounded-2xl border-2 transition-all ${!isLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'bg-white border-primary/10 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">B</div>
              <h4 className="text-sm font-black uppercase text-gray-700 tracking-tight">Generate Artifacts</h4>
            </div>
            <div className="space-y-3 mb-6">
               {[
                 { id: 'payslips', label: 'Employee Payslips', key: 'payslips' },
                 { id: 'advice', label: 'Bank Disbursement Advice', key: 'advice' },
                 { id: 'register', label: 'Payroll Register (Master)', key: 'register' },
                 { id: 'summary', label: 'Department Summary', key: 'summary' },
                 { id: 'jv', label: 'Accounting JV Export', key: 'jv' },
                 { id: 'tax', label: 'FBR Tax Report (Annex-C)', key: 'tax' }
               ].map(item => (
                 <label key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                   <span className="text-[11px] font-bold text-gray-600">{item.label}</span>
                   <input 
                    type="checkbox" 
                    checked={genSteps[item.key as keyof typeof genSteps]} 
                    onChange={() => setGenSteps({...genSteps, [item.key]: !genSteps[item.key as keyof typeof genSteps]})}
                    className="w-4 h-4 accent-primary rounded" 
                   />
                 </label>
               ))}
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || genComplete}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${genComplete ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'}`}
            >
              {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <FileText size={16} />}
              {isGenerating ? 'Generating...' : genComplete ? 'Generated Successfully' : 'Generate Selected'}
            </button>
          </div>

          {/* STEP C: PUBLISH */}
          <div className={`p-6 rounded-2xl border-2 transition-all ${!genComplete ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'bg-white border-primary/10 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">C</div>
              <h4 className="text-sm font-black uppercase text-gray-700 tracking-tight">Publish & Notify</h4>
            </div>
            <div className="space-y-4 mb-8">
               {[
                 { icon: Mail, label: 'Email Notifications', key: 'email' },
                 { icon: Bell, label: 'Mobile Push Alert', key: 'push' },
                 { icon: FileText, label: 'Attach PDF to ESS', key: 'pdf' }
               ].map(opt => (
                 <button 
                  key={opt.key}
                  onClick={() => setNotifyOptions({...notifyOptions, [opt.key]: !notifyOptions[opt.key as keyof typeof notifyOptions]})}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${notifyOptions[opt.key as keyof typeof notifyOptions] ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-gray-100 text-gray-400'}`}
                 >
                    <div className="flex items-center gap-3">
                      <opt.icon size={16} />
                      <span className="text-xs font-bold">{opt.label}</span>
                    </div>
                    {notifyOptions[opt.key as keyof typeof notifyOptions] && <Check size={14} />}
                 </button>
               ))}
            </div>
            <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 active:scale-95 transition-all">
              <Send size={16} /> Publish to ESS
            </button>
          </div>
        </div>

        {/* Output Status Table */}
        {genComplete && (
          <div className="mt-12 animate-in slide-in-from-top-4 duration-500">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-4 flex items-center gap-2">
              <History size={14} /> Output Repository
            </h3>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Document Type</th>
                    <th className="px-6 py-4">Scope</th>
                    <th className="px-6 py-4">Generation ID</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { type: 'Master Payroll Register', scope: 'Complete Batch', id: 'PR-J25-4412', status: 'READY' },
                    { type: 'Bank Advice (HBL Corporate)', scope: 'Islamabad Branch', id: 'BA-J25-9901', status: 'READY' },
                    { type: 'Tax Annex-C Bulk', scope: 'FBR Portal Export', id: 'TX-J25-0012', status: 'READY' },
                    { type: 'Individual Payslips (ZIP)', scope: '325 Employees', id: 'PS-J25-0325', status: 'READY' },
                  ].map((doc, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-700 flex items-center gap-2">
                        <FileCheck size={16} className="text-primary" /> {doc.type}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500">{doc.scope}</td>
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{doc.id}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded border border-green-100 uppercase">READY</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 hover:bg-primary/5 text-primary rounded" title="Download"><Download size={16}/></button>
                          <button className="p-1.5 hover:bg-primary/5 text-primary rounded" title="Print"><Printer size={16}/></button>
                          <button className="p-1.5 hover:bg-primary/5 text-primary rounded" title="Send Email"><Mail size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Landmark size={16} className="text-primary" /> Connected: HBL Bulk Pay Gateway
             </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              Close Wizard
            </button>
            <button 
              className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
              onClick={() => window.location.reload()}
            >
              Lock Period & Done <Lock size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Alert Center Integration */}
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Building2 size={24} className="text-accent" />
          </div>
          <div>
            <h4 className="font-black text-lg">Next Cycle Pre-Audit</h4>
            <p className="text-sm text-white/60">Feb 2025 cycle opens in <span className="text-white font-bold italic">04 days</span>. Start preparing time-sync inputs.</p>
          </div>
        </div>
        <button className="relative z-10 px-6 py-2.5 bg-accent text-primary rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
          View Feb Timeline
        </button>
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>
    </div>
  );
};
