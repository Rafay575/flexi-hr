
import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, 
  FileText, CheckCircle2, AlertTriangle, Upload, X, Info,
  Plane, HeartPulse, Coffee, Zap, ShieldAlert
} from 'lucide-react';
import { LeaveType, LeaveStatus, LeaveRequest } from '../types';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  data: any;
  updateData: (updates: any) => void;
}

// --- Step 1: Leave Type ---
const StepType = ({ data, updateData, onNext }: Partial<StepProps> & { onNext: () => void }) => {
  const types = [
    { type: LeaveType.ANNUAL, bal: 14, icon: <Plane />, color: 'bg-indigo-50 text-indigo-600', desc: 'Vacations & long breaks' },
    { type: LeaveType.CASUAL, bal: 10, icon: <Coffee />, color: 'bg-amber-50 text-amber-600', desc: 'Unforeseen personal work' },
    { type: LeaveType.SICK, bal: 8, icon: <HeartPulse />, color: 'bg-red-50 text-red-600', desc: 'Medical reasons' },
    { type: 'Comp-Off', bal: 2, icon: <Zap />, color: 'bg-emerald-50 text-emerald-600', desc: 'Earned for extra work' },
    { type: LeaveType.UNPAID, bal: '∞', icon: <Info />, color: 'bg-gray-100 text-gray-600', desc: 'Leave without pay' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((t) => (
          <button
            key={t.type}
            onClick={() => { updateData!({ type: t.type }); onNext(); }}
            className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
              data.type === t.type ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <div className={`p-3 rounded-lg ${t.color}`}>{t.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="font-bold text-gray-900">{t.type}</p>
                <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500">{t.bal} {t.type === 'Unpaid' ? '' : 'Days'}</span>
              </div>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3 text-blue-700">
        <ShieldAlert size={18} />
        <p className="text-xs font-medium">Need Official Duty (OD) or Travel request? <a href="#" className="underline font-bold">Go to OD Module</a></p>
      </div>
    </div>
  );
};

// --- Step 2: Dates ---
const StepDates = ({ data, updateData, onNext, onBack }: StepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Start Date</label>
          <div className="relative">
            <input 
              type="date" 
              className="w-full border-2 border-gray-100 rounded-xl p-3 pl-10 focus:border-[#3E3B6F] outline-none" 
              value={data.startDate}
              onChange={(e) => updateData({ startDate: e.target.value })}
            />
            <CalendarIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">End Date</label>
          <div className="relative">
            <input 
              type="date" 
              min={data.startDate}
              className="w-full border-2 border-gray-100 rounded-xl p-3 pl-10 focus:border-[#3E3B6F] outline-none" 
              value={data.endDate}
              onChange={(e) => updateData({ endDate: e.target.value })}
            />
            <CalendarIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Date Summary</p>
        <div className="flex items-center gap-4 text-gray-800">
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-[10px] text-gray-400 uppercase">From</p>
            <p className="font-bold">{data.startDate || 'Select Date'}</p>
          </div>
          <ChevronRight className="text-gray-300" />
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-[10px] text-gray-400 uppercase">To</p>
            <p className="font-bold">{data.endDate || 'Select Date'}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700">
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          onClick={onNext} 
          disabled={!data.startDate || !data.endDate}
          className="bg-[#3E3B6F] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
        >
          Next Step <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Step 3: Duration ---
const StepDuration = ({ data, updateData, onNext, onBack }: StepProps) => {
  const [durationType, setDurationType] = useState('full');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex p-1 bg-gray-100 rounded-xl">
        {['full', 'half', 'short'].map((t) => (
          <button
            key={t}
            onClick={() => setDurationType(t)}
            className={`flex-1 py-3 rounded-lg text-sm font-bold capitalize transition-all ${
              durationType === t ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-500'
            }`}
          >
            {t === 'short' ? 'Short Leave' : t === 'half' ? 'Half Day' : 'Full Day(s)'}
          </button>
        ))}
      </div>

      <div className="bg-[#3E3B6F] text-white rounded-xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} /> Duration Breakdown</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span>Calendar days selected</span>
            <span className="font-bold">5 Days</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Weekends (excluded)</span>
            <span>-2 Days</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Holidays (excluded)</span>
            <span>-1 Day</span>
          </div>
          <div className="flex justify-between text-[#E8D5A3]">
            <span>Sandwich rule applied</span>
            <span className="font-bold">+1 Day</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/20 text-lg">
            <span className="font-bold">Total Counted</span>
            <span className="text-[#E8D5A3] font-bold">3.0 Days</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700">
          <ChevronLeft size={20} /> Back
        </button>
        <button onClick={onNext} className="bg-[#3E3B6F] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
          Continue <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Step 4: Details ---
const StepDetails = ({ data, updateData, onNext, onBack }: StepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Reason Category *</label>
        <select 
          className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-[#3E3B6F]"
          value={data.category || ''}
          onChange={(e) => updateData({ category: e.target.value })}
        >
          <option value="">Select a category...</option>
          <option>Vacation/Holiday</option>
          <option>Personal/Family</option>
          <option>Medical/Health</option>
          <option>Religious/Festival</option>
          <option>Emergency</option>
          <option>Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Additional Details *</label>
        <textarea 
          rows={3}
          className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-[#3E3B6F] resize-none"
          placeholder="Briefly describe why you are taking leave..."
          value={data.reason || ''}
          onChange={(e) => updateData({ reason: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Attachments (Optional)</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm font-bold text-gray-600">Click or drag files to upload</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700">
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          onClick={onNext} 
          disabled={!data.category || (data.reason?.length || 0) < 10}
          className="bg-[#3E3B6F] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
        >
          Review Request <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Step 5: Preview ---
const StepPreview = ({ data, onBack, onSubmit }: { data: any, onBack: () => void, onSubmit: () => void }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-900">Application Summary</h4>
          <span className="px-3 py-1 bg-indigo-50 text-[#3E3B6F] text-[10px] font-bold uppercase rounded-full tracking-wider">
            {data.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Dates</p>
            <p className="text-sm font-bold">{data.startDate} to {data.endDate}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Duration</p>
            <p className="text-sm font-bold text-[#3E3B6F]">3.0 Days Counted</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Reason</p>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{data.category}: {data.reason}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Balance Impact</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Current Balance</span>
            <span className="font-bold">14.0 Days</span>
          </div>
          <div className="flex justify-between text-sm text-red-500">
            <span>This Request</span>
            <span className="font-bold">-3.0 Days</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-[#3E3B6F]">
            <span>After Approval</span>
            <span>11.0 Days</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
          <AlertTriangle size={20} className="shrink-0" />
          <div className="text-xs">
            <p className="font-bold mb-1">Important Warnings</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Sandwich rule applied (Sat-Sun counted as leave).</li>
              <li>Team member Sara is also off Jan 16.</li>
            </ul>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            className="w-5 h-5 rounded border-2 border-gray-200 text-[#3E3B6F] focus:ring-[#3E3B6F]"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
            I confirm the information provided is correct and adheres to policy.
          </span>
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700">
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          onClick={onSubmit}
          disabled={!confirmed}
          className="bg-[#3E3B6F] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#3E3B6F]/20 hover:bg-[#4A4680] disabled:opacity-50 transition-all active:scale-95"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export const ApplyLeaveWizard: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    type: LeaveType.ANNUAL,
    startDate: '',
    endDate: '',
    category: '',
    reason: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const updateData = (updates: any) => setFormData((prev: any) => ({ ...prev, ...updates }));

  const handleSubmit = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSubmit(formData);
      onClose();
      setIsSuccess(false);
      setStep(1);
    }, 2000);
  };

  const steps = [
    { n: 1, label: 'Type' },
    { n: 2, label: 'Dates' },
    { n: 3, label: 'Duration' },
    { n: 4, label: 'Details' },
    { n: 5, label: 'Preview' },
  ];

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#3E3B6F]/90 backdrop-blur-md" />
        <div className="relative bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-500 mt-2 italic font-medium">Request ID: LV-2025-001234</p>
          </div>
          <p className="text-sm text-gray-600">Your request has been sent to manager <span className="font-bold">Ahmed Khan</span> for approval.</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full animate-[loading_2s_ease-in-out]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#F5F5F5] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] md:h-auto">
        
        {/* Stepper Header */}
        <div className="bg-primary-gradient p-8 text-white relative">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold">New Leave Application</h2>
              <p className="text-white/60 text-sm mt-1">Complete the steps to submit your request.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center justify-between relative px-2">
            {/* Progress Bar Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 mx-6">
              <div 
                className="h-full bg-[#E8D5A3] transition-all duration-500" 
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((s) => (
              <div key={s.n} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  step === s.n ? 'bg-[#E8D5A3] border-[#E8D5A3] text-[#3E3B6F] shadow-[0_0_15px_rgba(232,213,163,0.3)]' :
                  step > s.n ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-[#3E3B6F] border-white/20 text-white/50'
                }`}>
                  {step > s.n ? <CheckCircle2 size={20} /> : s.n}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.n ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="p-8 overflow-y-auto custom-wizard-scroll">
          {step === 1 && <StepType data={formData} updateData={updateData} onNext={() => setStep(2)} />}
          {step === 2 && <StepDates data={formData} updateData={updateData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepDuration data={formData} updateData={updateData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <StepDetails data={formData} updateData={updateData} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <StepPreview data={formData} onBack={() => setStep(4)} onSubmit={handleSubmit} />}
        </div>
      </div>

      <style>
        {`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .custom-wizard-scroll::-webkit-scrollbar { width: 4px; }
          .custom-wizard-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
