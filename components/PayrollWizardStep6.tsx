
import React, { useState } from 'react';
import { 
  Check, ArrowLeft, Send, ShieldCheck, ClipboardCheck, 
  UserCheck, Clock, FileText, Upload, Info, AlertCircle,
  ChevronRight, Building2, User
} from 'lucide-react';

interface PayrollWizardStep6Props {
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

export const PayrollWizardStep6: React.FC<PayrollWizardStep6Props> = ({ onNext, onBack, onCancel }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');

  const checklistItems = [
    { label: 'All 325 employee records calculated', status: true },
    { label: 'Zero critical exceptions remaining', status: true },
    { label: 'Sub-system data (Time/Leave) synced', status: true },
    { label: 'Multi-tab review phase completed', status: true },
    { label: 'Variance justifications provided', status: true }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Wizard Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 6 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  step.id < 6 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step.id < 6 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 6 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-4 mt-[-18px] ${step.id < 6 ? 'bg-green-500' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Final Summary & Checklist */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Run Identity</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Run ID</p>
                  <p className="font-mono font-black text-primary">RUN-2025-001</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Period</p>
                  <p className="font-bold text-gray-700">January 2025</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Employees</p>
                  <p className="font-bold text-gray-700">325 Total</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Version</p>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black">v1.2</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Net Payable</p>
                <p className="text-2xl font-black text-primary">PKR 29.80M</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <ClipboardCheck size={16} className="text-primary" /> Pre-submission Checklist
              </h3>
              <div className="space-y-2">
                {checklistItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl transition-all hover:border-green-200">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Workflow & Submission */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Approval Workflow</h3>
              <div className="relative space-y-6 pl-4">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                
                {/* Stage 1 */}
                <div className="relative flex items-center gap-6">
                  <div className="z-10 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10"></div>
                  <div className="flex-1 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase">You (Initiator)</p>
                      <p className="text-xs font-bold text-gray-700">Draft Submission</p>
                    </div>
                    <Clock size={14} className="text-primary opacity-40" />
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="relative flex items-center gap-6">
                  <div className="z-10 w-4 h-4 rounded-full bg-gray-200 ring-4 ring-white"></div>
                  <div className="flex-1 p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">HR Manager</p>
                      <p className="text-xs font-bold text-gray-600 italic">Zainab Siddiqui</p>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border uppercase">TLA: 24h</span>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="relative flex items-center gap-6">
                  <div className="z-10 w-4 h-4 rounded-full bg-gray-200 ring-4 ring-white"></div>
                  <div className="flex-1 p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Finance Head</p>
                      <p className="text-xs font-bold text-gray-600 italic">M. Ahmed Raza</p>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border uppercase">TLA: 24h</span>
                  </div>
                </div>

                {/* Final */}
                <div className="relative flex items-center gap-6">
                  <div className="z-10 w-4 h-4 rounded-full bg-gray-100 border-2 border-dashed border-gray-300"></div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-300 tracking-widest pl-2">
                    <ShieldCheck size={14} /> Ready for Disbursement
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Submission Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes for approvers (e.g. why OT is high this month)..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 h-24 resize-none"
                />
              </div>
              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                <Upload size={16} /> Attach Support Docs (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Block */}
        <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
            />
            <span className="text-sm font-bold text-blue-900 leading-relaxed">
              I confirm that all payroll calculations for January 2025 have been reviewed against established policies and FBR 2024-25 tax slabs. I understand that once submitted, this run will be locked for further edits.
            </span>
          </label>
        </div>

        {/* Action Bar */}
        <div className="mt-10 pt-8 border-t flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Review
          </button>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={!confirmed}
              onClick={onNext}
              className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit for Approval <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
