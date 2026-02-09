
import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Zap, Clock, Link as LinkIcon, FileText, 
  Upload, AlertTriangle, ShieldCheck, Info, ChevronRight,
  Search, CheckCircle2
} from 'lucide-react';

interface CompOffCreditRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompOffCreditRequestForm: React.FC<CompOffCreditRequestFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dateWorked: '',
    workType: '',
    durationType: 'Days' as 'Days' | 'Hours',
    amount: 1,
    linkedRecord: '',
    reason: '',
  });

  const [validation, setValidation] = useState<string | null>(null);
  const [timeSyncRecords, setTimeSyncRecords] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock TimeSync record fetching when date changes
  useEffect(() => {
    if (formData.dateWorked) {
      // Logic for validation
      const date = new Date(formData.dateWorked);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        setValidation('Claim window expired (>30 days ago)');
        setTimeSyncRecords([]);
      } else if (formData.dateWorked === '2024-12-25') {
        setValidation("You've already claimed for Dec 25, 2024");
        setTimeSyncRecords([]);
      } else {
        setValidation(null);
        // Simulate finding a record
        setTimeSyncRecords([
          { id: 'TS-992', type: 'Holiday Punch', details: 'Clock-in: 09:00, Clock-out: 17:00' }
        ]);
      }
    }
  }, [formData.dateWorked]);

  if (!isOpen) return null;

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
      
      <div className="relative bg-white rounded-[40px] w-full max-w-[600px] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Request Comp-Off Credit</h3>
              <p className="text-sm text-gray-400 font-medium">Claim leave credits for extra time worked.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-modal-scroll">
          {/* Section 1: Date & Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Worked *</label>
              <div className="relative">
                <input 
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 ${validation ? 'border-red-100 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#3E3B6F]'}`}
                  value={formData.dateWorked}
                  onChange={(e) => setFormData({...formData, dateWorked: e.target.value})}
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic">Must be within last 30 days</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Work Type *</label>
              <select 
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800"
                value={formData.workType}
                onChange={(e) => setFormData({...formData, workType: e.target.value})}
                required
              >
                <option value="">Select type...</option>
                <option>Worked on Holiday</option>
                <option>Worked on Weekend</option>
                <option>Extra Shift</option>
                <option>Approved Overtime</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {validation && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle size={18} className="text-red-500" />
              <p className="text-xs font-bold text-red-700">{validation}</p>
            </div>
          )}

          {/* Section 2: Duration */}
          <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Credit Amount</label>
              <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100">
                {(['Days', 'Hours'] as const).map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setFormData({...formData, durationType: u})}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${formData.durationType === u ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <input 
                 type="number" 
                 step={formData.durationType === 'Days' ? '0.5' : '1'}
                 className="flex-1 p-4 bg-white border border-gray-100 rounded-2xl text-2xl font-bold text-[#3E3B6F] outline-none"
                 value={formData.amount}
                 onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                 required
               />
               <div className="text-xs text-gray-400 font-medium max-w-[150px]">
                 Max: 1 day per holiday, 8 hours per extra shift.
               </div>
            </div>
          </div>

          {/* Section 3: TimeSync Integration */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <LinkIcon size={14} /> TimeSync Reference
            </label>
            {formData.dateWorked ? (
              timeSyncRecords.length > 0 ? (
                <div className="space-y-2">
                  {timeSyncRecords.map(r => (
                    <label key={r.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.linkedRecord === r.id ? 'bg-indigo-50 border-[#3E3B6F]' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="timesync" 
                        className="text-[#3E3B6F]" 
                        onChange={() => setFormData({...formData, linkedRecord: r.id})}
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{r.type}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{r.details}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold">
                        <CheckCircle2 size={10} /> LINKED
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                   <p className="text-xs font-bold text-amber-700">No TimeSync record found for this date.</p>
                   <p className="text-[10px] text-amber-600 mt-1">Request may require manual proof review.</p>
                </div>
              )
            ) : (
              <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs font-medium">
                Enter a date to find work evidence.
              </div>
            )}
          </div>

          {/* Section 4: Details & Proof */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason / Description *</label>
              <textarea 
                rows={3}
                placeholder="Describe the work performed during this period..."
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all text-sm resize-none"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
                minLength={20}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attachment (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-all">
                 <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                 <p className="text-[10px] font-bold text-gray-600 uppercase">Approval email, work evidence, etc.</p>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-[#3E3B6F] rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Preview Amount</p>
                  <p className="text-2xl font-bold">{formData.amount} {formData.durationType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Est. Expiry</p>
                  <p className="text-sm font-bold text-[#E8D5A3]">~ 90 Days from approval</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-white/10 flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">1</div>
                     <span className="text-[10px] font-bold uppercase">Manager</span>
                   </div>
                   <ChevronRight size={14} className="text-white/20" />
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">2</div>
                     <span className="text-[10px] font-bold uppercase">HR Audit</span>
                   </div>
                </div>
             </div>
             <Zap size={120} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
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
            disabled={!!validation || !formData.dateWorked || !formData.workType || formData.reason.length < 20 || isSubmitting}
            className="flex-[2] bg-[#3E3B6F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
              <Clock className="animate-spin" size={20} />
            ) : (
              <ShieldCheck size={20} />
            )}
            Submit Credit Request
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
        .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}} />
    </div>
  );
};
