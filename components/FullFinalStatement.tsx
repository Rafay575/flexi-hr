
import React from 'react';
import { 
  Download, Printer, Mail, X, CheckCircle2, 
  ShieldCheck, Landmark, User, Calendar, 
  Building2, FileText, QrCode, Award
} from 'lucide-react';

interface FullFinalStatementProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

export const FullFinalStatement: React.FC<FullFinalStatementProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock data for the statement
  const statement = {
    ref: 'FFS/PK/2025/1199',
    date: 'January 15, 2025',
    employee: {
      name: 'Umar Jafri',
      id: 'EMP-1199',
      designation: 'Specialist - Engineering',
      dept: 'Technology Operations',
      doj: 'July 15, 2020',
      lwd: 'January 15, 2025',
      tenure: '4 Years, 6 Months',
      reason: 'Resignation'
    },
    earnings: [
      { label: 'Final Salary (Prorated)', amount: 72500 },
      { label: 'Leave Encashment (12.5 Days)', amount: 35417 },
      { label: 'Gratuity Payout', amount: 185000 },
      { label: 'Unused Expense Reimb.', amount: 12500 }
    ],
    deductions: [
      { label: 'Outstanding Loan Balance', amount: 45000 },
      { label: 'Notice Shortfall Recovery', amount: 0 },
      { label: 'Final Income Tax Adjustment', amount: 18250 },
      { label: 'Asset Replacement Cost', amount: 0 }
    ],
    payment: {
      bank: 'Habib Bank Limited (HBL)',
      account: '**** 7890',
      method: 'Online Transfer'
    },
    clearances: [
      { dept: 'Information Technology', cleared: true },
      { dept: 'Finance & Treasury', cleared: true },
      { dept: 'Admin & Facilities', cleared: true },
      { dept: 'Direct Manager', cleared: true }
    ]
  };

  const totalEarnings = statement.earnings.reduce((a, b) => a + b.amount, 0);
  const totalDeductions = statement.deductions.reduce((a, b) => a + b.amount, 0);
  const netPayable = totalEarnings - totalDeductions;

  const formatPKR = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 0 });

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh]">
        
        {/* Document Header Actions */}
        <div className="bg-gray-50 px-8 py-4 border-b flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-md">
               <Download size={14} /> Download PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
               <Printer size={14} /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
               <Mail size={14} /> Email to Emp
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Statement Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-white custom-scrollbar">
          <div className="max-w-[800px] mx-auto space-y-10 border-2 border-gray-50 p-10 print:border-0 print:p-0">
            
            {/* 1. Header & Logo */}
            <div className="flex justify-between items-start border-b-4 border-primary pb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-primary tracking-tighter uppercase">Flexi HRMS</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px]">Separation Management</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Full & Final Settlement</h2>
                <p className="text-sm font-bold text-primary mt-1">Ref: {statement.ref}</p>
                <p className="text-xs text-gray-400 font-medium">Date: {statement.date}</p>
              </div>
            </div>

            {/* 2. Employee Details Grid */}
            <div className="grid grid-cols-2 gap-x-16 gap-y-6 text-sm">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Employee Name</p>
                  <p className="font-black text-gray-800 text-lg leading-none">{statement.employee.name}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase mt-1">{statement.employee.id} • {statement.employee.dept}</p>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Designation</p>
                  <p className="font-bold text-gray-700">{statement.employee.designation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-l pl-12 border-gray-100">
                 <DetailBlock label="Date of Joining" val={statement.employee.doj} />
                 <DetailBlock label="Last Working Day" val={statement.employee.lwd} />
                 <DetailBlock label="Total Tenure" val={statement.employee.tenure} />
                 <DetailBlock label="Separation Mode" val={statement.employee.reason} />
              </div>
            </div>

            {/* 3. Financial Breakdown */}
            <div className="grid grid-cols-2 gap-12 pt-4">
              {/* Earnings Table */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded inline-block">Earnings (+)</h4>
                <div className="divide-y divide-gray-100">
                  {statement.earnings.map((e, i) => (
                    <div key={i} className="py-3 flex justify-between items-center text-[13px]">
                      <span className="text-gray-600 font-medium">{e.label}</span>
                      <span className="font-mono font-bold text-gray-800">{formatPKR(e.amount)}</span>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between items-center font-black text-gray-800 text-sm">
                    <span className="uppercase">Total Earnings</span>
                    <span className="font-mono text-base border-b-2 border-primary pb-0.5">{formatPKR(totalEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded inline-block">Deductions (-)</h4>
                <div className="divide-y divide-gray-100">
                  {statement.deductions.map((d, i) => (
                    <div key={i} className="py-3 flex justify-between items-center text-[13px]">
                      <span className="text-gray-600 font-medium">{d.label}</span>
                      <span className="font-mono font-bold text-red-500">({formatPKR(d.amount)})</span>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between items-center font-black text-red-600 text-sm">
                    <span className="uppercase">Total Deductions</span>
                    <span className="font-mono text-base border-b-2 border-red-500 pb-0.5">({formatPKR(totalDeductions)})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Net Payout Block */}
            <div className="bg-primary p-8 rounded-3xl flex items-center justify-between text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[2px] mb-1">Final Net Settlement Amount</p>
                  <h3 className="text-4xl font-black text-accent tracking-tighter">PKR {formatPKR(netPayable)}</h3>
               </div>
               <div className="relative z-10 text-right">
                  <p className="text-xs font-medium text-white/70 italic max-w-[200px]">
                    "Rupees Two Hundred Forty Thousand One Hundred Sixty Seven Only"
                  </p>
               </div>
               <Landmark className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
            </div>

            {/* 5. Clearance & Payment Details */}
            <div className="grid grid-cols-2 gap-12">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-primary" /> Dept. Clearances
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {statement.clearances.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-[10px] font-bold text-gray-600 truncate">{c.dept}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Building2 size={14} className="text-primary" /> Disbursement Info
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400 font-medium uppercase">Beneficiary Bank:</span>
                      <span className="font-bold text-gray-700">{statement.payment.bank}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400 font-medium uppercase">Account Number:</span>
                      <span className="font-mono font-black text-primary">{statement.payment.account}</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* 6. Signature Blocks */}
            <div className="pt-16 grid grid-cols-3 gap-12">
               <div className="space-y-4 text-center">
                  <div className="h-16 flex items-end justify-center border-b border-gray-200 pb-2">
                     <p className="font-serif text-2xl text-primary font-bold italic opacity-70">Zainab S.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase">HR Manager</p>
                    <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Verified Document</p>
                  </div>
               </div>
               <div className="space-y-4 text-center">
                  <div className="h-16 border-b border-gray-200 pb-2"></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase">Finance Controller</p>
                    <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Approved for Payment</p>
                  </div>
               </div>
               <div className="space-y-4 text-center">
                  <div className="h-16 border-b border-gray-200 pb-2"></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase">Employee Signature</p>
                    <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Acknowledgement of Receipt</p>
                  </div>
               </div>
            </div>

            {/* 7. Document Footer */}
            <div className="pt-10 border-t border-dashed border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <QrCode size={40} className="text-gray-300" />
                 </div>
                 <p className="text-[9px] text-gray-400 font-medium leading-relaxed max-w-[300px] uppercase">
                   This settlement statement is subject to final audit. Digital verification available via the PayEdge blockchain portal. Auth: FX-FF-PK-2025-01.
                 </p>
              </div>
              <div className="text-right">
                 <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                   <ShieldCheck size={14} /> FBR Slab Jan 2025
                 </div>
                 <p className="text-[9px] font-mono text-gray-300 mt-1">HASH: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailBlock = ({ label, val }: { label: string, val: string }) => (
  <div className="space-y-0.5">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{label}</p>
    <p className="text-xs font-bold text-gray-700">{val}</p>
  </div>
);
