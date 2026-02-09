
import React, { useState, useMemo } from 'react';
import { 
  X, Search, Sliders, Database, ArrowRight, Info, 
  AlertTriangle, CheckCircle2, ShieldCheck, Upload, 
  ChevronRight, Clock, Save, User
} from 'lucide-react';
import { LeaveType } from '../types';

interface BalanceAdjustmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_EMPLOYEES = [
  { id: 'EMP-101', name: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', balances: { 'Annual Leave': 10, 'Casual Leave': 5, 'Sick Leave': 8 } },
  { id: 'EMP-102', name: 'Sara Miller', avatar: 'SM', dept: 'Product', balances: { 'Annual Leave': 12, 'Casual Leave': 3, 'Sick Leave': 10 } },
  { id: 'EMP-103', name: 'Tom Chen', avatar: 'TC', dept: 'Engineering', balances: { 'Annual Leave': 4, 'Casual Leave': 2, 'Sick Leave': 1 } },
];

export const BalanceAdjustmentForm: React.FC<BalanceAdjustmentFormProps> = ({ isOpen, onClose }) => {
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    adjType: 'Credit' as 'Credit' | 'Debit',
    amount: 0,
    effectiveDate: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentBalance = selectedEmp ? (selectedEmp.balances[formData.leaveType] || 0) : 0;
  const newBalance = formData.adjType === 'Credit' 
    ? currentBalance + formData.amount 
    : Math.max(0, currentBalance - formData.amount);
  
  const exceedsCap = formData.leaveType === 'Annual Leave' && newBalance > 14;
  const requiresApproval = formData.amount > 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0">
      <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative bg-[#F5F5F5] rounded-[40px] w-full max-w-[650px] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <Sliders size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">New Balance Adjustment</h3>
              <p className="text-sm text-gray-400 font-medium">Manually override employee leave entitlements.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-modal-scroll">
          
          {/* Employee Selection */}
          <section className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Employee *</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F] transition-colors" size={18} />
              <select 
                className="w-full p-4 pl-12 bg-white border-2 border-transparent rounded-2xl focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800 shadow-sm"
                onChange={(e) => setSelectedEmp(MOCK_EMPLOYEES.find(emp => emp.id === e.target.value))}
                required
              >
                <option value="">Search employee name or ID...</option>
                {MOCK_EMPLOYEES.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                ))}
              </select>
            </div>
            {selectedEmp && (
              <div className="flex items-center gap-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in slide-in-from-top-2">
                <div className="w-10 h-10 rounded-xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] shadow-sm">
                  {selectedEmp.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{selectedEmp.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{selectedEmp.dept} • Current Balances Available</p>
                </div>
              </div>
            )}
          </section>

          {/* Adjustment Details */}
          <section className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type *</label>
                <select 
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none shadow-sm"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  required
                >
                  <option>Annual Leave</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Comp-Off</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Effective Date *</label>
                <input 
                  type="date"
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none shadow-sm"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adjustment Type *</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.adjType === 'Credit' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-100 text-gray-400'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.adjType === 'Credit'} onChange={() => setFormData({...formData, adjType: 'Credit'})} />
                    <span className="text-xs font-bold uppercase">Credit (+)</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.adjType === 'Debit' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-100 text-gray-400'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.adjType === 'Debit'} onChange={() => setFormData({...formData, adjType: 'Debit'})} />
                    <span className="text-xs font-bold uppercase">Debit (-)</span>
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount *</label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.5"
                    className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-[#3E3B6F] outline-none shadow-sm"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">Days</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason Category *</label>
              <select 
                className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none shadow-sm"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select category...</option>
                <option>Correction (fix error)</option>
                <option>Joining Bonus</option>
                <option>Policy Change</option>
                <option>Exception/Special Grant</option>
                <option>Year-End Adjustment</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description / Justification *</label>
              <textarea 
                rows={3}
                placeholder="Provide detailed justification (Min 20 characters)..."
                className="w-full p-4 bg-white border border-gray-100 rounded-3xl text-sm font-medium outline-none shadow-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                minLength={20}
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attachment (Optional)</label>
               <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center hover:bg-white hover:border-[#3E3B6F]/30 transition-all cursor-pointer group">
                  <Upload className="mx-auto text-gray-300 group-hover:text-[#3E3B6F] mb-2" size={24} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Drop files or click to upload proof</p>
               </div>
            </div>
          </section>

          {/* Impact Preview */}
          {selectedEmp && (
            <div className="bg-[#3E3B6F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-[#E8D5A3]" />
                      <h4 className="font-bold text-sm uppercase tracking-widest">{formData.leaveType}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium opacity-60">
                        <span>Current Balance</span>
                        <span>{currentBalance} days</span>
                      </div>
                      <div className={`flex justify-between text-xs font-bold ${formData.adjType === 'Credit' ? 'text-emerald-300' : 'text-red-300'}`}>
                        <span>Adjustment</span>
                        <span>{formData.adjType === 'Credit' ? '+' : '-'}{formData.amount} days</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>New Balance</span>
                        <span className="text-[#E8D5A3]">{newBalance} days</span>
                      </div>
                    </div>
                  </div>
                  
                  {exceedsCap && (
                    <div className="md:w-48 bg-amber-500/20 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                       <AlertTriangle size={16} className="text-[#E8D5A3] shrink-0 mt-0.5" />
                       <p className="text-[10px] text-white/80 leading-relaxed">
                         <span className="font-bold text-[#E8D5A3]">Threshold Alert:</span> New balance exceeds the standard annual cap of 14 days.
                       </p>
                    </div>
                  )}
               </div>
               <Database size={150} className="absolute -bottom-10 -left-10 text-white/5 -rotate-12" />
            </div>
          )}

          {/* Approval Info */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${requiresApproval ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {requiresApproval ? <ShieldCheck size={18}/> : <CheckCircle2 size={18}/>}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-800">
                        {requiresApproval ? 'Requires Authorization' : 'Immediate Application'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {requiresApproval ? 'Adjustments >5 days trigger HR Manager review.' : 'Small adjustments are auto-approved for HR Admins.'}
                      </p>
                   </div>
                </div>
             </div>
             {requiresApproval && (
               <div className="flex items-center gap-3 pl-11">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">HRM</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-700 uppercase">HR Manager Route</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Decision SLA: 24 Hours</p>
                  </div>
               </div>
             )}
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white px-10 py-8 border-t border-gray-100 flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedEmp || formData.amount === 0 || formData.description.length < 20}
            className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
            {requiresApproval ? 'Submit for Approval' : 'Post Adjustment Now'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
        .custom-modal-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `}} />
    </div>
  );
};
