
import React, { useState } from 'react';
import { 
  Printer, Download, Upload, CheckCircle2, 
  Landmark, Calendar, Users, Building2, 
  ShieldCheck, ArrowRight, FileText, X,
  Clock, AlertCircle, Search, CreditCard
} from 'lucide-react';

type ChallanType = 'EOBI' | 'PESSI' | 'Income Tax (WHT)' | 'Provident Fund';

export const ChallanGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ChallanType>('EOBI');
  const [selectedPeriod, setSelectedPeriod] = useState('Jan 2025');
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [paymentData, setPaymentData] = useState({ date: '', ref: '', bank: 'HBL' });

  const mockData = {
    EOBI: { institution: 'Employee Old-Age Benefits Institution', code: 'ISB-998811', ee: 104000, er: 520000, count: 325, due: 'Feb 15, 2025' },
    PESSI: { institution: 'Punjab Employees Social Security', code: 'PUN-77665', ee: 0, er: 399900, count: 215, due: 'Feb 15, 2025' },
    'Income Tax (WHT)': { institution: 'Federal Board of Revenue (FBR)', code: 'NTN-8899221', ee: 3500000, er: 0, count: 285, due: 'Feb 15, 2025' },
    'Provident Fund': { institution: 'Flexi HRMS PF Trust', code: 'PF-TRUST-01', ee: 2775000, er: 2775000, count: 310, due: 'Feb 10, 2025' }
  };

  const current = mockData[selectedType];
  const totalAmount = current.ee + current.er;

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Landmark className="text-primary" size={28} />
            Statutory Challan Generator
          </h2>
          <p className="text-sm text-gray-500">Generate standardized payment vouchers for government institutions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration & Tracking */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Selection</h3>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Return Type</label>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ChallanType)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                  >
                    <option>EOBI</option>
                    <option>PESSI</option>
                    <option>Income Tax (WHT)</option>
                    <option>Provident Fund</option>
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Payroll Period</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                  >
                    <option>Jan 2025</option>
                    <option>Dec 2024</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Payment Tracking</h3>
               <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase">Unpaid</span>
            </div>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Payment Date</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Transaction Ref / CPR</label>
                  <input type="text" placeholder="e.g. FBR-99221-X" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none font-mono" />
               </div>
               <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <Upload size={16} /> Upload Paid Challan Copy
               </button>
               <button 
                 onClick={() => setIsMarkingPaid(true)}
                 className="w-full py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 active:scale-95 transition-all"
               >
                 Mark as Paid
               </button>
            </div>
          </div>
        </div>

        {/* Right: Challan Preview */}
        <div className="lg:col-span-8 bg-gray-200 p-8 rounded-3xl flex justify-center overflow-y-auto max-h-[850px] shadow-inner custom-scrollbar">
          <div className="w-full max-w-[650px] bg-white shadow-2xl p-12 flex flex-col space-y-8 animate-in zoom-in-95 duration-500 min-h-[800px] border border-gray-100">
            
            {/* Header / Institution */}
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6">
              <div className="space-y-1">
                <h1 className="text-xl font-black uppercase leading-tight">{current.institution}</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Government of Pakistan</p>
              </div>
              <div className="text-right">
                <div className="bg-gray-900 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter mb-2">Original Copy</div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Voucher # {Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
            </div>

            {/* Employer Block */}
            <div className="grid grid-cols-2 gap-8 text-[11px] uppercase font-black tracking-tight">
               <div className="space-y-4">
                  <div className="space-y-1">
                     <p className="text-gray-400 text-[8px]">Employer Name</p>
                     <p className="text-gray-800 text-sm">FLEXI HRMS PVT LTD</p>
                     <p className="text-primary font-mono mt-1">Reg ID: {current.code}</p>
                  </div>
               </div>
               <div className="space-y-4 border-l border-gray-100 pl-10">
                  <div className="space-y-1">
                     <p className="text-gray-400 text-[8px]">Challan Details</p>
                     <p className="text-gray-800">Month: {selectedPeriod}</p>
                     <p className="text-red-600">Due Date: {current.due}</p>
                  </div>
               </div>
            </div>

            {/* Employee Count Stat */}
            <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
               <div className="p-2 bg-white rounded-lg shadow-sm text-primary"><Users size={20}/></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Contribution Basis</p>
                  <p className="text-sm font-bold text-gray-800">{current.count} Eligible Employees</p>
               </div>
            </div>

            {/* Financials Table */}
            <div className="space-y-4 pt-4 border-t-2 border-gray-50">
               <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50 font-black text-gray-500 text-[10px] uppercase">
                     <tr>
                        <th className="px-4 py-2">Head of Account</th>
                        <th className="px-4 py-2 text-right">Amount (PKR)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                     <tr>
                        <td className="px-4 py-4 text-gray-600">Employee Contribution (Share)</td>
                        <td className="px-4 py-4 text-right font-mono font-bold">{current.ee.toLocaleString()}</td>
                     </tr>
                     <tr>
                        <td className="px-4 py-4 text-gray-600">Employer Contribution (Share)</td>
                        <td className="px-4 py-4 text-right font-mono font-bold">{current.er.toLocaleString()}</td>
                     </tr>
                     <tr className="bg-primary/[0.02]">
                        <td className="px-4 py-4 text-gray-600 italic">Arrears / Penalties</td>
                        <td className="px-4 py-4 text-right font-mono">0</td>
                     </tr>
                  </tbody>
                  <tfoot className="bg-gray-900 text-white font-black">
                     <tr>
                        <td className="px-4 py-6 uppercase text-xs tracking-widest">Total Payable Amount</td>
                        <td className="px-4 py-6 text-right font-mono text-xl text-accent underline underline-offset-8 decoration-accent/30">{totalAmount.toLocaleString()}</td>
                     </tr>
                  </tfoot>
               </table>
            </div>

            {/* Bank Instructions */}
            <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <Landmark size={28} className="text-gray-400" />
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-black text-gray-400 uppercase">Designated Bank</p>
                     <p className="text-sm font-bold text-gray-800">National Bank of Pakistan (NBP)</p>
                     <p className="text-[10px] text-gray-500">Corporate Banking Branch</p>
                  </div>
               </div>
               <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <QrCode size={48} className="text-gray-300" />
               </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-12">
               <div className="space-y-8">
                  <div className="h-10 w-40 border-b border-gray-300" />
                  <div>
                     <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest">Employer Signature</p>
                     <p className="text-[8px] font-bold text-gray-400 uppercase">Stamp Required</p>
                  </div>
               </div>
               <div className="space-y-8 text-right">
                  <div className="h-10 w-40 border-b border-gray-300 ml-auto" />
                  <div>
                     <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest">Bank Cashier</p>
                     <p className="text-[8px] font-bold text-gray-400 uppercase">Receiving Stamp</p>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-dashed border-gray-200 flex items-center justify-between opacity-50">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} />
                  <p className="text-[8px] font-bold uppercase tracking-tight">System Validated Digital Voucher</p>
               </div>
               <p className="text-[8px] font-mono tracking-tighter font-bold">DIGITAL_ID: FX-CHL-{selectedType.substring(0,3).toUpperCase()}-25-9922</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Menu */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-8 animate-in slide-in-from-bottom-10">
         <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all"><Printer size={20}/></div>
            <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-primary">Print</span>
         </button>
         <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all"><Download size={20}/></div>
            <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-primary">PDF</span>
         </button>
         <div className="w-[1px] h-10 bg-gray-100" />
         <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all"><FileText size={20}/></div>
            <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-primary">FBR CSV</span>
         </button>
      </div>
    </div>
  );
};

const QrCode = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" />
    <path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v.01" />
  </svg>
);
