
import React, { useState } from 'react';
import { 
  X, Calendar, Clock, CheckCircle2, 
  Settings2, ShieldCheck, AlertCircle,
  ToggleLeft as Toggle, ArrowRight,
  // Fix: Added missing PlayCircle icon
  PlayCircle
} from 'lucide-react';

interface PayrollPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const PayrollPeriodModal: React.FC<PayrollPeriodModalProps> = ({ isOpen, onClose, onSave }) => {
  const [skipWeekends, setSkipWeekends] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Generate Payroll Periods</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bulk scheduler for annual operations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar lux-scrollbar max-h-[75vh]">
          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-8">
            <section className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fiscal Year</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer">
                  <option>2025</option>
                  <option>2026</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Frequency Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Monthly', 'Bi-Weekly', 'Weekly'].map(type => (
                    <button key={type} className={`p-3 border rounded-xl text-left transition-all ${type === 'Monthly' ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-black tracking-tight">{type}</span>
                        {type === 'Monthly' && <CheckCircle2 size={14} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Clock size={14} className="text-orange-500" /> Cutoff Day (Monthly)
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={25} className="w-16 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-center outline-none" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">of every month</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Settings2 size={14} className="text-primary" /> Pay Day (Monthly)
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={30} className="w-16 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-center outline-none" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">of every month</span>
                </div>
                <p className="text-[9px] text-gray-400 italic">For Feb, it will auto-adjust to 28/29.</p>
              </div>

              <div className="pt-4 space-y-4">
                 <button 
                  onClick={() => setSkipWeekends(!skipWeekends)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                 >
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className={skipWeekends ? 'text-green-500' : 'text-gray-300'} />
                      <div>
                        <p className="text-xs font-bold text-gray-700">Auto-Skip Weekends</p>
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">Shift to previous working day</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-all ${skipWeekends ? 'bg-primary' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${skipWeekends ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                 </button>
              </div>
            </section>
          </div>

          {/* Preview Section */}
          <section className="space-y-4 pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sample Generation Preview</h4>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-100">
                <span className="font-bold text-gray-800">January 2025</span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Cut: 25th Jan</span>
                  <ArrowRight size={12} className="text-gray-300" />
                  <span className="text-[10px] text-primary uppercase font-black">Pay: 31st Jan</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-100">
                <span className="font-bold text-gray-800">February 2025</span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Cut: 22nd Feb</span>
                  <ArrowRight size={12} className="text-gray-300" />
                  <span className="text-[10px] text-primary uppercase font-black">Pay: 28th Feb</span>
                </div>
              </div>
            </div>
          </section>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 shadow-sm">
             <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
             <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
               Existing periods for the selected year will be archived. Ensure no open payroll runs exist for the year before regenerating.
             </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
            Ready to generate 12 periods
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onSave}
              className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
            >
              <PlayCircle size={18} /> Confirm Generation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
