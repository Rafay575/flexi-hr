
import React, { useState } from 'react';
import { 
  Landmark, Download, Send, FileText, CheckCircle2, 
  AlertCircle, ChevronRight, FileSpreadsheet, Eye, 
  ShieldCheck, CreditCard, Building2, ExternalLink,
  Search, Filter, ListChecks, Info
} from 'lucide-react';

interface BankSummary {
  bankName: string;
  employeeCount: number;
  totalAmount: number;
  format: 'TXT' | 'XLSX' | 'API';
  status: 'Ready' | 'Sent' | 'Failed';
}

const MOCK_BANK_SUMMARY: BankSummary[] = [
  { bankName: 'Habib Bank Limited (HBL)', employeeCount: 210, totalAmount: 18500000, format: 'TXT', status: 'Ready' },
  { bankName: 'Meezan Bank', employeeCount: 85, totalAmount: 7200000, format: 'XLSX', status: 'Sent' },
  { bankName: 'Standard Chartered', employeeCount: 30, totalAmount: 4100000, format: 'API', status: 'Ready' },
];

export const BankAdviceGenerator: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState('Jan 2025 (v1.2)');
  const [showPreview, setShowPreview] = useState(false);
  const [activeBank, setActiveBank] = useState<BankSummary | null>(MOCK_BANK_SUMMARY[0]);

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(2)}M`;
  const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bank Advice Management</h2>
          <p className="text-sm text-gray-500">Generate and transmit payment instructions to financial institutions</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedRun}
              onChange={(e) => setSelectedRun(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 appearance-none min-w-[200px]"
            >
              <option>Jan 2025 (v1.2)</option>
              <option>Jan 2025 (v1.1)</option>
              <option>Dec 2024 Final</option>
            </select>
          </div>
        </div>
      </div>

      {/* Global Summary Stats */}
      <div className="bg-primary p-8 rounded-2xl shadow-xl shadow-primary/20 text-white flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10 space-y-2">
          <p className="text-accent text-[10px] font-black uppercase tracking-[2px]">Total Disbursement Scope</p>
          <div className="flex items-baseline gap-4">
            <h3 className="text-4xl font-black">PKR 29.80M</h3>
            <span className="text-white/60 text-sm font-bold">/ 325 Employees</span>
          </div>
        </div>
        <div className="relative z-10 flex gap-6">
           <div className="text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Bank Transfers</p>
              <p className="text-lg font-black text-white">315</p>
           </div>
           <div className="w-[1px] bg-white/10 h-10 self-center"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Cheque/Cash</p>
              <p className="text-lg font-black text-white">10</p>
           </div>
        </div>
        <Building2 className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bank Summary Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Landmark size={14} /> Bank-wise Distribution
              </h4>
              <button className="text-[10px] font-black text-primary uppercase hover:underline">Download Comprehensive XLSX</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/30 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Bank Institution</th>
                  <th className="px-6 py-4 text-center">Employees</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-center">Format</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_BANK_SUMMARY.map((bank, i) => (
                  <tr 
                    key={i} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer group ${activeBank?.bankName === bank.bankName ? 'bg-primary/5' : ''}`}
                    onClick={() => setActiveBank(bank)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeBank?.bankName === bank.bankName ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                          <Building2 size={16} />
                        </div>
                        <span className="font-bold text-gray-700">{bank.bankName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-500">{bank.employeeCount}</td>
                    <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(bank.totalAmount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border uppercase">{bank.format}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                         bank.status === 'Sent' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                       }`}>
                         {bank.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-gray-300 hover:text-primary transition-all">
                          <Eye size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Special Cases Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 bg-orange-50/30 border-b flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                <AlertCircle size={14} /> Exceptions & Special Cases
              </h4>
              <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase">Manual Intervention</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cheque Payments (10)</h5>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 divide-y">
                       {[
                         { name: 'Umar Farooq', amount: 45000 },
                         { name: 'Sara Khan', amount: 82000 }
                       ].map((c, i) => (
                         <div key={i} className="py-2 flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-600">{c.name}</span>
                            <span className="font-mono font-black">{c.amount.toLocaleString()}</span>
                         </div>
                       ))}
                       <button className="w-full pt-2 text-[9px] font-black text-primary uppercase text-center hover:underline">View All Cheque Cases</button>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Split Bank Accounts (02)</h5>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                       <div className="p-2 bg-white rounded border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-700">Mustafa Kamal (EMP-1005)</p>
                          <div className="flex justify-between text-[9px] mt-1 text-gray-500">
                             <span>HBL: 80%</span>
                             <span>Meezan: 20%</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: File Preview & Validation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">File Integrity Check</h3>
              <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                <ShieldCheck size={18} />
              </div>
            </div>

            {/* Validation List */}
            <div className="space-y-3">
              {[
                { label: 'Record Count Verified', status: 'PASS' },
                { label: 'Sum Hash Check', status: 'PASS' },
                { label: 'IBAN Formatting (PK)', status: 'PASS' },
                { label: 'Duplicate Entry Protection', status: 'PASS' },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">{v.label}</span>
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle2 size={12} strokeWidth={4} />
                  </div>
                </div>
              ))}
            </div>

            {/* File Structure Preview */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3 mt-4">
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Advice Structure Preview</h4>
                 <button onClick={() => setShowPreview(!showPreview)} className="text-[9px] font-black text-primary uppercase flex items-center gap-1">
                   {showPreview ? 'Hide' : 'Expand'} Preview <ExternalLink size={10} />
                 </button>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-[10px] text-green-400 flex-1 min-h-[200px] overflow-hidden relative">
                 <div className="space-y-1 opacity-80">
                    <p className="text-blue-400">01HBL-CORP-PK-20250115000000000029800000</p>
                    <p>026110112345671PK78HABB000122000000010750000</p>
                    <p>026110199887766PK78HABB000122000000008250000</p>
                    <p>024210133445566PK45MEZN00010000000004500000</p>
                    <p className="text-gray-500 italic">... 322 more records</p>
                    <p className="text-blue-400">99000003250000000002980000000000000000</p>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Final Actions */}
            <div className="space-y-3 pt-4">
               <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm transition-all">
                    <FileText size={14} /> Download TXT
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm transition-all">
                    <FileSpreadsheet size={14} /> Export Excel
                  </button>
               </div>
               <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  <Send size={16} /> Transmit to Bank Gateway
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
         <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <p className="text-xs text-blue-700 font-medium leading-relaxed uppercase tracking-tight">
              <strong>Secure Disbursement Protocol:</strong> All generated advice files are encrypted using AES-256 before transmission. Digital signatures from HR and Finance heads are embedded in the trailer record for bank-side verification.
            </p>
         </div>
      </div>
    </div>
  );
};
