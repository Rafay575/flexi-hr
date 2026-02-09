
import React, { useState } from 'react';
import { 
  X, Clock, Calendar, ShieldCheck, AlertCircle, 
  Info, ArrowRight, Bell, Calculator, Zap
} from 'lucide-react';

interface AccrualRuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const AccrualRuleForm: React.FC<AccrualRuleFormProps> = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    leaveType: initialData?.leaveType || '',
    frequency: initialData?.frequency || 'Monthly',
    dayOfPeriod: '1st Day',
    amount: 1.17,
    maxAccumulation: 30,
    isUnlimited: false,
    warningThreshold: 25,
    prorateJoin: true,
    prorateExit: true,
    prorateMethod: 'Calendar days',
    lapseTiming: 'End of Year',
    lapseGrace: 0,
    notifyLapse: 30,
    effectiveDate: '2025-02-01'
  });

  if (!isOpen) return null;

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Comp-Off', 'Study Leave'];
  const frequencies = ['Monthly', 'Quarterly', 'Annual', 'On Join'];
  
  const getDayOptions = () => {
    if (formData.frequency === 'Monthly') return ['1st Day', '15th Day', 'Last Day'];
    if (formData.frequency === 'Quarterly') return ['1st Day of Quarter', 'Last Day of Quarter'];
    if (formData.frequency === 'Annual') return ['Jan 1st', 'Fiscal Year Start (July 1st)'];
    return ['Immediate'];
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-0 !m-0">
      <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative bg-white rounded-[40px] w-full max-w-[550px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Accrual Rule' : 'Create Accrual Rule'}</h3>
              <p className="text-xs text-gray-400 font-medium tracking-tight">Configure balance credit automation.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-form-scroll space-y-8">
          
          {/* Section 1: Target */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type Configuration</label>
            <select 
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800"
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
            >
              <option value="" disabled>Select Leave Type...</option>
              {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Section 2: Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Frequency</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none"
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
              >
                {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Run Date</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none">
                {getDayOptions().map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Section 3: Amount */}
          <div className="p-6 bg-indigo-50 rounded-[24px] border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-indigo-900">Accrual Amount</label>
              <Zap size={16} className="text-[#3E3B6F]" />
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-4 bg-white border border-indigo-200 rounded-2xl text-2xl font-bold text-[#3E3B6F] outline-none"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-300 uppercase">Days</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-indigo-600 flex items-center gap-2">
              <Calculator size={14} /> {formData.amount} days/period ≈ {(formData.amount * 12).toFixed(1)} days/year
            </p>
          </div>

          {/* Section 4: Caps */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Caps & Thresholds</label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-[#3E3B6F]"
                  checked={formData.isUnlimited}
                  onChange={(e) => setFormData({...formData, isUnlimited: e.target.checked})}
                 />
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Unlimited</span>
               </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 opacity-100 disabled:opacity-50">
                <p className="text-[10px] font-bold text-gray-400">Max Accumulation</p>
                <input 
                  type="number" 
                  disabled={formData.isUnlimited}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none"
                  value={formData.maxAccumulation}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400">Warning Threshold</p>
                <input 
                  type="number" 
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none"
                  value={formData.warningThreshold}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section 5: Proration */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proration Rules</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div>
                  <p className="text-sm font-bold text-gray-800">Prorate on Join</p>
                  <p className="text-[10px] text-gray-400 italic">Adjusts first month's credit</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, prorateJoin: !formData.prorateJoin})}
                  className={`w-10 h-5 rounded-full relative transition-colors ${formData.prorateJoin ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.prorateJoin ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              
              {formData.prorateJoin && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3 animate-in slide-in-from-top-2">
                  <Info size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-[11px] text-emerald-800 font-medium">
                    "If employee joins Jan 15, they receive {(formData.amount / 2).toFixed(2)} days."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Lapse */}
          <div className="space-y-4">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lapse Logic</label>
             <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 space-y-2">
                  {/* FIXED ERROR: Removed readOnly from select element as it is not a valid attribute. Used value prop without onChange if it's meant to be non-editable in this context or changed to disabled. */}
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none"
                    value={formData.lapseTiming}
                    disabled
                  >
                    <option>End of Year</option>
                    <option>After 6 Months</option>
                    <option>Never (Continuous)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Grace Period</p>
                  <input type="number" placeholder="Days" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none" readOnly />
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Notify Before</p>
                  <div className="relative">
                    <input type="number" placeholder="Days" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none pl-9" readOnly />
                    <Bell className="absolute left-3 top-3.5 text-gray-400" size={14} />
                  </div>
               </div>
             </div>
          </div>

          {/* Section 7: Effective Date */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2">
               <Calendar size={16} className="text-[#3E3B6F]" />
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rule Effective From</label>
             </div>
             <input 
              type="date" 
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800"
              value={formData.effectiveDate}
              readOnly
             />
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all">
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="flex-[2] py-3 bg-[#3E3B6F] text-white font-bold rounded-2xl hover:bg-[#4A4680] shadow-xl shadow-[#3E3B6F]/20 transition-all active:scale-95"
          >
            Save Accrual Rule
          </button>
        </div>
      </div>

      <style>
        {`
          .custom-form-scroll::-webkit-scrollbar { width: 4px; }
          .custom-form-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
