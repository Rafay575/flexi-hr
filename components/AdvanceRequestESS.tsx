
import React, { useState, useMemo } from 'react';
import { 
  HandCoins, CheckCircle2, AlertCircle, Clock, 
  ChevronRight, Upload, FileText, Calendar, 
  Info, History, Send, Wallet, ShieldCheck
} from 'lucide-react';

interface AdvanceRequest {
  id: string;
  date: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
}

const MOCK_HISTORY: AdvanceRequest[] = [
  { id: 'ADV-9921', date: 'Oct 12, 2024', amount: 25000, reason: 'Medical Emergency', status: 'Paid' },
  { id: 'ADV-9950', date: 'Jan 05, 2025', amount: 45000, reason: 'Education Fees', status: 'Pending' },
];

export const AdvanceRequestESS: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('Medical');
  const [tenure, setTenure] = useState(1);
  
  const eligibility = {
    tenureOk: true,
    noPendingOk: false, // User has a pending request in mock
    withinLimit: 125000,
    currentSalary: 185000
  };

  const schedule = useMemo(() => {
    if (!amount || amount <= 0) return [];
    const monthly = Math.round(amount / tenure);
    return Array.from({ length: tenure }).map((_, i) => ({
      month: i === 0 ? 'Feb 2025' : i === 1 ? 'Mar 2025' : 'Apr 2025',
      emi: monthly
    }));
  }, [amount, tenure]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Salary Advance Request</h2>
          <p className="text-sm text-gray-500">Request interest-free short-term funds from your upcoming salary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Eligibility & History */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Eligibility Check</h3>
            <div className="space-y-4">
              <CheckItem label="Employment Tenure (> 6 months)" ok={eligibility.tenureOk} />
              <CheckItem label="No Outstanding Advances" ok={eligibility.noPendingOk} warning />
              <div className="pt-4 border-t border-gray-50">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Max Eligible Limit</p>
                 <h4 className="text-2xl font-black text-primary">PKR 125,000</h4>
                 <p className="text-[10px] text-gray-400 mt-1 italic">Based on 75% of your net salary</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
             <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <History size={14} /> Request History
                </h3>
             </div>
             <div className="divide-y divide-gray-50">
                {MOCK_HISTORY.map(req => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="space-y-0.5">
                        <p className="text-xs font-black text-gray-800">{req.reason}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{req.date} • {req.id}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-mono font-black text-primary">PKR {req.amount.toLocaleString()}</p>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                          req.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-status-pending/10 text-status-pending border-status-pending/20'
                        }`}>
                          {req.status}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: Request Form */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-8 relative overflow-hidden">
          {!eligibility.noPendingOk && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center p-12 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-orange-100 max-w-sm space-y-4">
                   <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle size={32} />
                   </div>
                   <h4 className="text-lg font-black text-gray-800">Existing Request Pending</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">
                     You currently have a pending advance request (ADV-9950). Organization policy allows only one active advance at a time.
                   </p>
                   <button className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                     View Pending Request
                   </button>
                </div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Requested Amount (PKR)</label>
                <div className="relative">
                   <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                    type="number" 
                    placeholder="e.g. 50000" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                   />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reason for Advance</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="Medical">Medical Emergency</option>
                  <option value="Family">Family Support</option>
                  <option value="Education">Education Fees</option>
                  <option value="House">Housing / Rent</option>
                  <option value="Other">Other Reasons</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recovery Period</label>
                <div className="grid grid-cols-3 gap-2">
                   {[1, 2, 3].map(m => (
                     <button 
                      key={m}
                      onClick={() => setTenure(m)}
                      className={`py-2.5 rounded-lg border text-xs font-black uppercase tracking-widest transition-all ${
                        tenure === m ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'
                      }`}
                     >
                        {m} {m === 1 ? 'Month' : 'Months'}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Additional Details</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none h-24 resize-none"
                  placeholder="Provide context for approval..."
                />
              </div>

              <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                <Upload size={16} /> Attach Support Docs (PDF/JPG)
              </button>
            </div>

            {/* Live Preview Column */}
            <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 h-fit">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ShieldCheck size={14} /> Recovery Forecast
              </h4>
              
              {amount > 0 ? (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    {schedule.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-[10px]">{i+1}</div>
                            <span className="text-xs font-bold text-gray-600">{item.month}</span>
                         </div>
                         <span className="text-xs font-mono font-black text-red-500">-{item.emi.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-primary rounded-xl text-white shadow-xl shadow-primary/20">
                    <p className="text-[9px] font-bold text-white/50 uppercase mb-1">Total to be Recovered</p>
                    <p className="text-2xl font-black text-accent leading-none">PKR {amount.toLocaleString()}</p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
                      First recovery will start from the Feb 2025 payroll cycle. Net take-home for these months will decrease accordingly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-300 opacity-50">
                   <HandCoins size={48} strokeWidth={1} className="mb-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Enter Amount to see schedule</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t flex justify-end">
             <button className="px-12 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 flex items-center gap-3 active:scale-95 transition-all">
                <Send size={18} /> Submit Request
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckItem = ({ label, ok, warning }: { label: string, ok: boolean, warning?: boolean }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
     <span className="text-xs font-bold text-gray-600">{label}</span>
     {ok ? (
        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle2 size={12} strokeWidth={4} /></div>
     ) : (
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${warning ? 'bg-orange-500' : 'bg-red-500'}`}>
          <AlertCircle size={12} strokeWidth={4} />
        </div>
     )}
  </div>
);
