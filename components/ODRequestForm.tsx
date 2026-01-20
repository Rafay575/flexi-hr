
import React, { useState } from 'react';
import { 
  X, Briefcase, MapPin, Calendar, Clock, Phone, 
  FileText, Upload, ShieldCheck, AlertTriangle, 
  CheckCircle2, Info, ArrowRight, User, ExternalLink
} from 'lucide-react';

interface ODRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const ODRequestForm: React.FC<ODRequestFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'Official Duty',
    isMultipleDays: false,
    startDate: '',
    endDate: '',
    destination: '',
    address: '',
    purposeCategory: '',
    purposeDetails: '',
    contactNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSubmitting(false);
    if (onSubmit) onSubmit(formData);
    onClose();
  };

  const hasConflict = formData.startDate === '2025-01-16' || formData.endDate === '2025-01-16';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative bg-white rounded-[40px] w-full max-w-[650px] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">New Official Duty Request</h3>
              <p className="text-sm text-gray-400 font-medium">Record out-of-office assignments for attendance.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-modal-scroll">
          {/* Duty Type */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignment Type *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Official Duty', 'Outdoor Duty', 'Local Travel'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border-2 transition-all text-center ${
                    formData.type === t 
                      ? 'border-[#3E3B6F] bg-indigo-50 text-[#3E3B6F]' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Configuration</label>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, isMultipleDays: !formData.isMultipleDays })}
                className="flex items-center gap-2 text-xs font-bold text-[#3E3B6F]"
              >
                <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.isMultipleDays ? 'bg-[#3E3B6F]' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.isMultipleDays ? 'left-4.5' : 'left-0.5'}`} />
                </div>
                Multiple Days
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase">{formData.isMultipleDays ? 'Start Date' : 'Duty Date'} *</p>
                <div className="relative">
                  <input 
                    type="date" 
                    required
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none font-bold text-gray-800"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                </div>
              </div>
              {formData.isMultipleDays && (
                <div className="space-y-2 animate-in slide-in-from-left-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">End Date *</p>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      min={formData.startDate}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none font-bold text-gray-800"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination *</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Client HQ / Site A" 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none font-bold text-gray-800 pl-11"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Number *</label>
              <div className="relative">
                <input 
                  type="tel" 
                  required
                  placeholder="+92 XXX XXXXXXX" 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none font-bold text-gray-800 pl-11"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose Category *</label>
              <select 
                required
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none font-bold text-gray-800"
                value={formData.purposeCategory}
                onChange={(e) => setFormData({ ...formData, purposeCategory: e.target.value })}
              >
                <option value="">Select category...</option>
                <option>Client Meeting</option>
                <option>Site Visit</option>
                <option>Training/Workshop</option>
                <option>Audit/Inspection</option>
                <option>Government Office</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignment Details *</label>
              <textarea 
                required
                rows={3}
                placeholder="Provide a brief description of the work scope..."
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none text-sm resize-none"
                value={formData.purposeDetails}
                onChange={(e) => setFormData({ ...formData, purposeDetails: e.target.value })}
              />
            </div>
          </div>

          {/* Impact Preview */}
          <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#E8D5A3]" />
                  <h4 className="font-bold text-sm uppercase tracking-widest">TimeSync Impact Preview</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] text-white/50 font-bold uppercase mb-2">Attendance</p>
                     <ul className="text-xs space-y-2 font-medium">
                        <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#E8D5A3]"/> {formData.startDate || 'Jan 15'} marked as "OD"</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#E8D5A3]"/> No punch required</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#E8D5A3]"/> No late/early rules</li>
                     </ul>
                   </div>
                   <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] text-white/50 font-bold uppercase mb-2">Payroll & Leave</p>
                     <ul className="text-xs space-y-2 font-medium">
                        <li className="flex items-center gap-2"><Info size={12} className="text-blue-300"/> Leave Impact: None</li>
                        <li className="flex items-center gap-2"><Info size={12} className="text-blue-300"/> Payroll Impact: None</li>
                     </ul>
                   </div>
                </div>
             </div>
             <Clock size={150} className="absolute -bottom-8 -right-8 opacity-5 -rotate-12" />
          </div>

          {/* Conflicts & Routes */}
          <div className="space-y-4">
             {hasConflict && (
               <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-pulse">
                 <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-xs font-bold text-amber-900">Coverage Alert</p>
                   <p className="text-[10px] text-amber-800 leading-tight">You have an approved leave or roster assignment on Jan 16. OD will override attendance but review conflicts with your manager.</p>
                 </div>
               </div>
             )}

             <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-[#3E3B6F] text-[10px]">1</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 uppercase">Immediate Manager</p>
                    <p className="text-[10px] text-gray-400">Approval Route • 24h SLA</p>
                  </div>
               </div>
               <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">Standard Rule</span>
             </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex gap-4 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.startDate || !formData.destination}
            className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? <Clock className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            Submit OD Request
          </button>
        </div>
      </div>

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
