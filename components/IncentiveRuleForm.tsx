
import React, { useState } from 'react';
import { 
  X, Gift, Info, Calendar, Users, Zap, Bell, 
  ShieldCheck, Calculator, ChevronRight, Plus, 
  Clock, CheckCircle2, AlertCircle, Save, Target
} from 'lucide-react';

interface IncentiveRuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const IncentiveRuleForm: React.FC<IncentiveRuleFormProps> = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    isActive: true,
    window: 'Monthly',
    timing: 'payroll_lock',
    evalDay: 2,
    scope: 'all',
    minTenure: 0,
    excludeProbation: true,
    conditions: {
      noUnpaid: true,
      unpaidThreshold: 0,
      lateLimit: true,
      maxLates: 0,
      noUnapproved: true,
      unapprovedThreshold: 0,
      regularizationLimit: false,
      maxRegs: 2,
      minAttendance: false,
      attendancePerc: 95
    },
    awardType: 'Leave Credit',
    leaveType: 'Annual Leave',
    amount: 1,
    expiry: 'policy',
    autoRun: true,
    autoPost: false,
    notifyEmp: true,
    notifyMgr: true
  });

  if (!isOpen) return null;

  const updateConditions = (key: string, val: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: val }
    }));
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative bg-white rounded-[40px] w-full max-w-[650px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <Gift size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Incentive Rule' : 'Create Incentive Rule'}</h3>
              <p className="text-xs text-gray-400 font-medium tracking-tight">Configure automated earned leave awards.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-form-scroll space-y-10">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Basic Information</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Active</span>
                <button 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-10 h-5 rounded-full relative transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'left-6' : 'left-1'}`} />
                </button>
              </label>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Rule Name (e.g. Perfect Attendance Monthly)"
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <textarea 
                placeholder="Brief description for HR records..."
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all text-sm resize-none"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Section 2: Window */}
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification Window</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500">Periodicity</p>
                <select 
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-bold outline-none"
                  value={formData.window}
                  onChange={(e) => setFormData({...formData, window: e.target.value})}
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500">Evaluation Timing</p>
                <select 
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-bold outline-none"
                  value={formData.timing}
                  onChange={(e) => setFormData({...formData, timing: e.target.value})}
                >
                  <option value="payroll_lock">After Payroll Lock</option>
                  <option value="fixed">Fixed Day of Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Eligibility */}
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eligibility Criteria</label>
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => setFormData({...formData, scope: 'all'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2 ${formData.scope === 'all' ? 'bg-[#3E3B6F] border-[#3E3B6F] text-white shadow-lg' : 'bg-white border-transparent text-gray-400'}`}
                >
                  All Employees
                </button>
                <button 
                  onClick={() => setFormData({...formData, scope: 'specific'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2 ${formData.scope === 'specific' ? 'bg-[#3E3B6F] border-[#3E3B6F] text-white shadow-lg' : 'bg-white border-transparent text-gray-400'}`}
                >
                  Specific Scope
                </button>
              </div>
              {formData.scope === 'specific' && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-400">Min Tenure (Months)</p>
                     <input type="number" className="w-full p-2 bg-white border border-gray-100 rounded-lg text-sm" value={formData.minTenure} />
                   </div>
                   <div className="flex items-center justify-between pt-5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Exclude Probation</span>
                      <button onClick={() => setFormData({...formData, excludeProbation: !formData.excludeProbation})} className={`w-8 h-4 rounded-full relative transition-colors ${formData.excludeProbation ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                         <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.excludeProbation ? 'left-4.5' : 'left-0.5'}`} />
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Conditions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification Conditions</label>
              <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">Must meet all</span>
            </div>
            
            <div className="space-y-3">
              {[
                { key: 'noUnpaid', label: 'No unpaid leave days', thresholdKey: 'unpaidThreshold', thresholdLabel: 'Max Days' },
                { key: 'lateLimit', label: 'Late occurrences within limit', thresholdKey: 'lateLimit', thresholdLabel: 'Max Lates' },
                { key: 'noUnapproved', label: 'No unapproved absences', thresholdKey: 'unapprovedThreshold', thresholdLabel: 'Max' },
              ].map((cond) => (
                <div key={cond.key} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={(formData.conditions as any)[cond.key]} 
                        onChange={(e) => updateConditions(cond.key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#3E3B6F]" 
                      />
                      <span className="text-sm font-bold text-gray-700">{cond.label}</span>
                    </div>
                  </div>
                  {(formData.conditions as any)[cond.key] && (
                    <div className="ml-7 flex items-center gap-3 animate-in slide-in-from-left-2">
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{cond.thresholdLabel}:</p>
                       <input type="number" defaultValue={0} className="w-16 p-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-center" />
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Plus size={14} /> Add Custom Condition
              </button>
            </div>
          </div>

          {/* Section 5: Award */}
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Award Configuration</label>
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[32px] space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Leave Type</p>
                    <select className="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none border border-indigo-100">
                      <option>Annual Leave</option>
                      <option>Casual Leave</option>
                      <option>Comp-Off</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Amount</p>
                    <div className="relative">
                      <input type="number" step="0.5" defaultValue={1} className="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none border border-indigo-100" />
                      <span className="absolute right-3 top-3 text-[10px] font-bold text-indigo-200 uppercase">Days</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-indigo-100">
                  <p className="text-xs font-bold text-indigo-900 flex items-center gap-2"><Clock size={14}/> Award Expiry</p>
                  <select className="bg-transparent text-xs font-bold text-indigo-600 outline-none">
                    <option>Same as leave policy</option>
                    <option>End of Fiscal Year</option>
                    <option>Custom: 3 Months</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Section 6: Automation */}
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Automation & Notifications</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { key: 'autoRun', label: 'Auto-run evaluation', icon: Clock },
                 { key: 'autoPost', label: 'Auto-post awards', icon: Zap },
                 { key: 'notifyEmp', label: 'Notify employees', icon: Bell },
                 { key: 'notifyMgr', label: 'Notify managers', icon: Users },
               ].map(item => (
                 <div key={item.key} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className="text-[#3E3B6F]" />
                      <span className="text-xs font-bold text-gray-700">{item.label}</span>
                    </div>
                    <button 
                      onClick={() => setFormData(prev => ({...prev, [item.key]: !(prev as any)[item.key]}))}
                      className={`w-8 h-4 rounded-full relative transition-colors ${(formData as any)[item.key] ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${(formData as any)[item.key] ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                 </div>
               ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-[#3E3B6F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Calculator size={28} className="text-[#E8D5A3]" />
                </div>
                <div>
                   <h4 className="text-2xl font-bold">~125 Employees <span className="text-sm font-normal text-white/50 italic">Projected</span></h4>
                   <p className="text-xs text-white/60">Based on current attendance data, 125 staff would qualify for this award.</p>
                </div>
                <div className="w-full pt-4 border-t border-white/10">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40 font-bold uppercase tracking-widest">Total Liability</span>
                      <span className="text-[#E8D5A3] font-bold">125.0 Days</span>
                   </div>
                </div>
             </div>
             <Target size={150} className="absolute -bottom-10 -left-10 text-white/5 -rotate-12" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all">
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="flex-[2] py-3 bg-[#3E3B6F] text-white font-bold rounded-2xl hover:bg-[#4A4680] shadow-xl shadow-[#3E3B6F]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Incentive Rule
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
