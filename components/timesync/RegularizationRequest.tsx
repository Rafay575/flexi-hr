
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Upload, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck,
  FileText,
  Info,
  Zap,
  MoreVertical,
  X,
  MessageSquare
} from 'lucide-react';

type RegularizationIssue = 'MISSING_IN' | 'MISSING_OUT' | 'WRONG_TIME' | 'DEVICE_ISSUE' | 'LOCATION_ISSUE';

interface RegularizationForm {
  date: string;
  issueType: RegularizationIssue;
  proposedTime: string;
  reason: string;
  evidence: File | null;
}

const MOCK_HISTORY = [
  { id: 'REG-101', date: 'Jan 08, 2025', issue: 'Missing Out', proposed: '06:30 PM', status: 'APPROVED', decision: 'Verified by Manager' },
  { id: 'REG-102', date: 'Jan 05, 2025', issue: 'Device Failure', proposed: '09:00 AM', status: 'REJECTED', decision: 'Insufficient Evidence' },
  { id: 'REG-103', date: 'Dec 28, 2024', issue: 'Missing In', proposed: '09:05 AM', status: 'APPROVED', decision: 'Auto-Approved' },
];

const ISSUE_OPTIONS: { value: RegularizationIssue; label: string }[] = [
  { value: 'MISSING_IN', label: 'Missing In Punch' },
  { value: 'MISSING_OUT', label: 'Missing Out Punch' },
  { value: 'WRONG_TIME', label: 'Incorrect Time' },
  { value: 'DEVICE_ISSUE', label: 'Device/System Issue' },
  { value: 'LOCATION_ISSUE', label: 'Location Issue' },
];

export const RegularizationRequest: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2025-01-14');
  const [formData, setFormData] = useState<RegularizationForm>({
    date: '2025-01-14',
    issueType: 'MISSING_OUT',
    proposedTime: '18:30',
    reason: '',
    evidence: null
  });

  const selectedDayData = {
    date: 'Jan 14, 2025',
    status: 'Incomplete (Missing Out)',
    in: '9:00 AM',
    out: '--',
    hours: '--'
  };

  const impactPreview = {
    status: 'Present',
    hours: '8h 30m'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <History className="text-[#3E3B6F]" size={28} /> Request Regularization
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Correct attendance anomalies for management approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT COLUMN: FORM */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <Calendar size={18} className="text-[#3E3B6F]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Select Date & Detect Issue</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Date</label>
                <div className="grid grid-cols-7 gap-2 p-2 border border-gray-100 rounded-2xl bg-gray-50/50">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const day = 7 + i;
                    const hasIssue = [10, 14].includes(day);
                    const isSelected = selectedDate === `2025-01-${day}`;
                    return (
                      <div 
                        key={day} 
                        onClick={() => setSelectedDate(`2025-01-${day}`)}
                        className={`aspect-square flex items-center justify-center text-xs font-bold rounded-lg cursor-pointer transition-all relative ${
                          isSelected ? 'bg-[#3E3B6F] text-white shadow-lg' : 'bg-white hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {day}
                        {hasIssue && !isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] text-gray-400 italic">Red dots indicate attendance anomalies that need correction.</p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Record</label>
                <div className="bg-[#3E3B6F]/5 border border-[#3E3B6F]/10 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Current Status</span>
                    <span className="text-xs font-black text-red-600">{selectedDayData.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#3E3B6F]/5">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Punch In</p>
                      <p className="text-sm font-black text-[#3E3B6F]">{selectedDayData.in}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Punch Out</p>
                      <p className="text-sm font-black text-gray-300 italic">{selectedDayData.out}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <Zap size={18} className="text-[#3E3B6F]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Regularization Form</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Type *</label>
                  <select 
                    value={formData.issueType}
                    onChange={(e) => setFormData({...formData, issueType: e.target.value as RegularizationIssue})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 transition-all"
                  >
                    {ISSUE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposed Correct Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="time" 
                      value={formData.proposedTime}
                      onChange={(e) => setFormData({...formData, proposedTime: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-indigo-50 rounded-xl text-lg font-black text-[#3E3B6F] outline-none shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for correction *</label>
                <textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium outline-none focus:bg-white transition-all focus:ring-4 focus:ring-[#3E3B6F]/5 min-h-[120px]" 
                  placeholder="Explain why the record is incomplete (Min 20 characters)..."
                />
                <div className="flex justify-end">
                  <span className={`text-[9px] font-bold ${formData.reason.length < 20 ? 'text-orange-400' : 'text-green-500'}`}>
                    {formData.reason.length} / 20 chars min
                  </span>
                </div>
              </div>

              <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center group cursor-pointer hover:border-[#3E3B6F]/20 transition-all">
                <Upload size={32} className="text-gray-300 group-hover:text-[#3E3B6F] mb-3 transition-colors" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-[#3E3B6F]">Attach Evidence / System Logs</p>
                <p className="text-[10px] text-gray-300 mt-1">Required for Device or System failures (PDF, JPG up to 5MB)</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & ACTIONS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden animate-in slide-in-from-right-4 duration-500">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
               <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-500" /> Impact Preview
               </h3>
            </div>
            <div className="p-6 space-y-6">
               <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance Status</p>
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-red-400 line-through">Incomplete</span>
                        <ArrowRight size={14} className="text-gray-300" />
                        <span className="text-xs font-black text-green-600">Present</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated Hours</p>
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-red-400 line-through">0h</span>
                        <ArrowRight size={14} className="text-gray-300" />
                        <span className="text-xs font-black text-[#3E3B6F]">8h 30m</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Validation</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-[11px] font-bold text-green-700">Within 3-day window</span>
                      <CheckCircle2 size={14} className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-[11px] font-bold text-green-700">Monthly quota (2/5 used)</span>
                      <CheckCircle2 size={14} className="text-green-500" />
                    </div>
                  </div>
               </div>

               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Approval Route</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm border border-indigo-100">AK</div>
                    <div>
                      <p className="text-xs font-black text-gray-800">Ahmed Khan</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase">Engineering Manager</p>
                    </div>
                  </div>
               </div>

               <button className="w-full py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Submit Correction Request
               </button>
            </div>
          </div>

          {/* TIPS */}
          <div className="p-6 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-3xl flex gap-4">
             <Info className="text-[#3E3B6F] shrink-0" size={20} />
             <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
               Submitting false regularization claims may result in policy violations. Ensure reasons are valid and evidence is attached where required.
             </p>
          </div>

          {/* RECENT HISTORY MINI */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Recent History</h3>
              <button className="text-[9px] font-black text-[#3E3B6F] uppercase underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_HISTORY.map(item => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[11px] font-black text-gray-800">{item.date}</p>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                      item.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                    <span>{item.issue}</span>
                    <ArrowRight size={10} className="text-gray-300" />
                    <span className="text-[#3E3B6F] font-bold">{item.proposed}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2 italic group-hover:text-gray-600 truncate">"{item.decision}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
