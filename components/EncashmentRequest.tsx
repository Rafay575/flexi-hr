
import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Calculator, Info, AlertTriangle, CheckCircle2, 
  History, ArrowRight, DollarSign, Wallet, FileText, 
  ChevronRight, ArrowUpRight, Search, Clock
} from 'lucide-react';
import { LeaveType } from '../types';

interface EncashableType {
  type: string;
  available: number;
  isEligible: boolean;
  minRetain: number;
  ratePerDay: number;
  reason?: string;
}

const ELIGIBILITY_DATA: EncashableType[] = [
  { type: LeaveType.ANNUAL, available: 16, isEligible: true, minRetain: 5, ratePerDay: 5000 },
  { type: LeaveType.CASUAL, available: 7, isEligible: false, minRetain: 0, ratePerDay: 4500, reason: 'Company policy does not allow Casual Leave encashment.' },
  { type: 'Comp-Off', available: 3, isEligible: true, minRetain: 0, ratePerDay: 4800 },
];

const MOCK_ENCASHMENT_HISTORY = [
  { id: 'ENC-2024-001', date: 'Jan 15, 2024', type: 'Annual Leave', days: 5, amount: 'PKR 25,000', status: 'Paid', paidOn: 'Jan 31, 2024' },
  { id: 'ENC-2023-082', date: 'Jul 10, 2023', type: 'Comp-Off', days: 2, amount: 'PKR 9,200', status: 'Paid', paidOn: 'Jul 31, 2023' },
];

export const EncashmentRequest = () => {
  const [selectedType, setSelectedType] = useState<string>(LeaveType.ANNUAL);
  const [encashDays, setEncashDays] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPolicy = useMemo(() => 
    ELIGIBILITY_DATA.find(d => d.type === selectedType), 
  [selectedType]);

  const maxEncashable = currentPolicy 
    ? Math.max(0, currentPolicy.available - currentPolicy.minRetain) 
    : 0;

  const calculation = useMemo(() => {
    if (!currentPolicy) return { gross: 0, tax: 0, net: 0 };
    const gross = encashDays * currentPolicy.ratePerDay;
    const tax = gross * 0.1; // 10% mock tax
    return { gross, tax, net: gross - tax };
  }, [currentPolicy, encashDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    alert('Encashment request submitted successfully!');
    setEncashDays(0);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Wallet size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Encashment</h2>
            <p className="text-gray-500 font-medium">Convert your eligible unused leave balances into financial credits.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Eligibility & Policy */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Encashment Eligibility</h3>
            </div>
            <div className="p-6 space-y-6">
              {ELIGIBILITY_DATA.map((item) => (
                <div key={item.type} className="flex items-start justify-between group">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">{item.type}</p>
                    <p className="text-xs text-gray-500">{item.available} days available</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.isEligible ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={10} /> ELIGIBLE TO ENCASH
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                          <AlertTriangle size={10} /> NOT ENCASHABLE
                        </span>
                      )}
                    </div>
                  </div>
                  {item.isEligible && (
                    <div className="text-right">
                       <p className="text-xs font-bold text-[#3E3B6F]">Rate/Day</p>
                       <p className="text-xs font-medium text-gray-500">PKR {item.ratePerDay.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-[#3E3B6F]" /> Policy Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Frequency</span>
                <span className="font-bold text-gray-700">Once per Year</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Min. Retain Balance</span>
                <span className="font-bold text-gray-700">5 Days</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Last Encashment</span>
                <span className="font-bold text-amber-600">Jan 15, 2024</span>
              </div>
            </div>
          </div>

          <div className="bg-[#3E3B6F] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 space-y-4">
               <div className="p-2 bg-white/10 rounded-lg w-fit">
                 <DollarSign size={24} className="text-[#E8D5A3]" />
               </div>
               <h4 className="font-bold text-lg">Tax Implications</h4>
               <p className="text-xs text-white/60 leading-relaxed">
                 Encashment payouts are considered taxable income and are subject to deduction at source as per the current fiscal year regulations.
               </p>
             </div>
             <CreditCard size={150} className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" />
          </div>
        </div>

        {/* Right Column: Encashment Form */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 lg:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type *</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-[#3E3B6F]"
                    value={selectedType}
                    onChange={(e) => { setSelectedType(e.target.value); setEncashDays(0); }}
                    required
                  >
                    {ELIGIBILITY_DATA.filter(d => d.isEligible).map(d => (
                      <option key={d.type} value={d.type}>{d.type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                    Days to Encash *
                    <span className="text-indigo-600">Max: {maxEncashable} days</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max={maxEncashable} 
                      step="0.5"
                      value={encashDays}
                      onChange={(e) => setEncashDays(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3E3B6F]"
                    />
                    <input 
                      type="number"
                      max={maxEncashable}
                      min="0"
                      step="0.5"
                      className="w-20 p-3 bg-gray-50 border-2 border-transparent rounded-xl text-center font-bold text-[#3E3B6F] outline-none focus:bg-white focus:border-[#3E3B6F]"
                      value={encashDays}
                      onChange={(e) => setEncashDays(Math.min(maxEncashable, parseFloat(e.target.value) || 0))}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium italic">Available: {currentPolicy?.available} • Must retain: {currentPolicy?.minRetain}</p>
                </div>
              </div>

              {/* Rate Calculation Card */}
              <div className="bg-indigo-50/50 rounded-[32px] border border-indigo-100 p-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 border-b border-indigo-100 pb-4">
                  <Calculator size={20} className="text-indigo-600" />
                  <h4 className="font-bold text-indigo-900">Live Payout Calculation</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Days to Encash</p>
                    <p className="text-lg font-bold text-indigo-900">{encashDays} days</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Rate per Day</p>
                    <p className="text-lg font-bold text-indigo-900">PKR {currentPolicy?.ratePerDay.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Gross Amount</p>
                    <p className="text-lg font-bold text-indigo-900">PKR {calculation.gross.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Est. Tax (10%)</p>
                    <p className="text-lg font-bold text-red-500">- PKR {calculation.tax.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Est. Net Payout</p>
                    <p className="text-4xl font-bold text-emerald-600">PKR {calculation.net.toLocaleString()}*</p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-indigo-100">
                    <Info size={14} className="text-indigo-400" />
                    <p className="text-[10px] text-indigo-400 font-medium">*Subject to final payroll validation.</p>
                  </div>
                </div>
              </div>

              {/* Balance Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> Balance Impact
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Current</p>
                      <p className="text-xl font-bold text-gray-900">{currentPolicy?.available} d</p>
                    </div>
                    <ArrowRight className="text-gray-300" size={20} />
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">After</p>
                      <p className="text-xl font-bold text-[#3E3B6F]">{currentPolicy ? (currentPolicy.available - encashDays) : 0} d</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Justification (Optional)</label>
                  <textarea 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all text-sm resize-none h-[110px]"
                    placeholder="Provide a reason for the request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle size={18} />
                <p className="text-xs font-bold uppercase tracking-widest">One-way transaction: Balance cannot be restored after payout.</p>
              </div>
              <button 
                type="submit"
                disabled={encashDays === 0 || isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-[#3E3B6F] text-white font-bold rounded-2xl shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50 disabled:grayscale active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Clock size={20} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                Submit Encashment Request
              </button>
            </div>
          </form>

          {/* Encashment History */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History size={20} className="text-[#3E3B6F]" />
                <h4 className="font-bold text-gray-900">Encashment History</h4>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request ID</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Days</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid On</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ENCASHMENT_HISTORY.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="text-xs font-bold text-[#3E3B6F] font-mono uppercase">{h.id}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{h.date}</p>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-700">{h.type}</td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-700 text-center">{h.days} d</td>
                      <td className="px-8 py-5 text-sm font-bold text-emerald-600">{h.amount}</td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                          {h.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-gray-500 font-medium">{h.paidOn}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-300 hover:text-[#3E3B6F] opacity-0 group-hover:opacity-100 transition-all">
                          <FileText size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);
