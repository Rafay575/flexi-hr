import React, { useState } from 'react';
import { 
  ShieldCheck, Download, Printer, FileText, 
  Search, Calendar, Landmark, Info, 
  CheckCircle2, ArrowUpRight, ChevronRight,
  Eye, Building2, User, QrCode, Signature, AlertCircle,
  /* Fixed: Added missing icon imports */
  Filter, Calculator, TrendingUp
} from 'lucide-react';

interface TaxRecord {
  year: string;
  period: string;
  status: 'Available' | 'Generated';
  gross: number;
  taxable: number;
  taxPaid: number;
}

const MOCK_TAX_HISTORY: TaxRecord[] = [
  { year: '2024-25', period: 'Jul 24 - Jan 25', status: 'Available', gross: 1540000, taxable: 1540000, taxPaid: 185000 },
  { year: '2023-24', period: 'Jul 23 - Jun 24', status: 'Generated', gross: 2450000, taxable: 2450000, taxPaid: 295000 },
  { year: '2022-23', period: 'Jul 22 - Jun 23', status: 'Generated', gross: 2100000, taxable: 2100000, taxPaid: 180000 },
];

export const MyTaxCertificate: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [isPreviewOpen, setIsPreviewOpen] = useState(true); // Open by default for UX

  const activeRecord = MOCK_TAX_HISTORY.find(r => r.year === selectedYear) || MOCK_TAX_HISTORY[0];

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Income Tax Certificates</h2>
          <p className="text-sm text-gray-500">View and download your withholding statements for FBR filing</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Select Assessment Year:</label>
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {['2022-23', '2023-24', '2024-25'].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  selectedYear === year ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Summary Table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b bg-gray-50/50 flex items-center justify-between">
               <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Tax History</h3>
               {/* Fixed: Filter icon is now imported */}
               <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Filter size={14}/></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/30 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Tax Year</th>
                    <th className="px-6 py-4">Period</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_TAX_HISTORY.map((row) => (
                    <tr key={row.year} className={`hover:bg-gray-50 transition-colors ${selectedYear === row.year ? 'bg-primary/5' : ''}`}>
                      <td className="px-6 py-4 font-black text-gray-700">{row.year}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-400">{row.period}</td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                           row.status === 'Available' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                         }`}>
                           {row.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setSelectedYear(row.year); setIsPreviewOpen(true); }}
                              className={`p-2 rounded-lg transition-colors ${selectedYear === row.year ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`} 
                              title="View YTD"
                            >
                               <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                               <Download size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-6 relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   {/* Fixed: Calculator icon is now imported */}
                   <div className="p-2 bg-primary/5 text-primary rounded-xl"><Calculator size={20}/></div>
                   <h4 className="text-sm font-black text-gray-700 uppercase tracking-tight">YTD Accumulated Stats</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Gross Salary</p>
                      <p className="text-lg font-black text-gray-800">{formatPKR(activeRecord.gross)}</p>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Tax Withheld</p>
                      <p className="text-lg font-black text-primary">{formatPKR(activeRecord.taxPaid)}</p>
                   </div>
                </div>
             </div>
             {/* Fixed: TrendingUp icon is now imported */}
             <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-primary/5 w-32 h-32 rotate-12" />
          </div>

          <div className="p-5 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4 shadow-sm">
             <AlertCircle size={24} className="text-orange-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-orange-900 uppercase tracking-tight leading-none">Need an adjustment?</h5>
                <p className="text-xs text-orange-700 leading-relaxed font-medium">
                  If your tax deductions don't align with your FBR portal, please <span className="font-bold underline cursor-pointer">Request a Correction</span> with supporting tax challans.
                </p>
             </div>
          </div>
        </div>

        {/* Right: Certificate Preview */}
        <div className="lg:col-span-7">
           <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[750px]">
              <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                 <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400">Digital Document Preview</h3>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                       <Printer size={14} /> Print
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95">
                       <Download size={14} /> Download PDF
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-gray-100/30 flex justify-center">
                 {/* The actual "Certificate" paper effect */}
                 <div className="w-full max-w-[650px] bg-white shadow-2xl p-12 flex flex-col space-y-8 animate-in zoom-in-95 duration-500 border border-gray-100">
                    
                    {/* Header */}
                    <div className="text-center border-b-2 border-gray-900 pb-6 space-y-2">
                       <h1 className="text-2xl font-black uppercase tracking-tighter">Certificate of Tax Withholding</h1>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">Salary & Benefits • Under Section 149</p>
                       <p className="text-[9px] font-medium text-gray-400">Income Tax Ordinance, 2001</p>
                    </div>

                    {/* Entities Info */}
                    <div className="grid grid-cols-2 gap-12 text-[11px] uppercase font-black tracking-tight">
                       <div className="space-y-4">
                          <div className="space-y-1">
                             <p className="text-gray-400 text-[8px]">Employer (Withholding Agent)</p>
                             <p className="text-gray-800 text-sm">FLEXI HRMS PVT LTD</p>
                             <p className="text-primary font-mono">NTN: 8899221-4</p>
                             <p className="text-[9px] text-gray-400 font-bold lowercase tracking-normal">STP-I, I-9, Islamabad, Pakistan</p>
                          </div>
                          <div className="space-y-1 pt-2">
                             <p className="text-gray-400 text-[8px]">Certificate Reference</p>
                             <p className="text-gray-800 font-mono tracking-widest">TX-CRT-25-001-A9</p>
                          </div>
                       </div>
                       <div className="space-y-4 border-l border-gray-100 pl-10">
                          <div className="space-y-1">
                             <p className="text-gray-400 text-[8px]">Employee (Taxpayer)</p>
                             <p className="text-gray-800 text-sm underline decoration-gray-200 underline-offset-4">Umar Jafri</p>
                             <p className="text-primary font-mono mt-1">CNIC: 61101-1234567-1</p>
                             <p className="text-primary font-mono">NTN: 1234567-8</p>
                          </div>
                          <div className="space-y-1 pt-2">
                             <p className="text-gray-400 text-[8px]">Assessment Period</p>
                             <p className="text-gray-800">FY {selectedYear} ({activeRecord.period})</p>
                          </div>
                       </div>
                    </div>

                    {/* Statement Text */}
                    <div className="py-6 border-y-2 border-gray-50 space-y-4">
                       <p className="text-[12px] text-gray-700 leading-relaxed font-serif italic text-center px-4">
                         "This is to certify that salary and other taxable benefits were paid to the employee named above during the period mentioned, and tax has been withheld and deposited into the Federal Treasury as per Section 149 of the Income Tax Ordinance 2001."
                       </p>
                    </div>

                    {/* Financial Data */}
                    <div className="space-y-3">
                       <div className="flex justify-between items-center py-3 border-b border-gray-50 group hover:bg-gray-50/50 px-2 transition-colors">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Gross Amount Paid</span>
                          <span className="text-sm font-mono font-black text-gray-800 tracking-tighter">{formatPKR(activeRecord.gross)}</span>
                       </div>
                       <div className="flex justify-between items-center py-3 border-b border-gray-50 group hover:bg-gray-50/50 px-2 transition-colors">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Subject to Tax</span>
                          <span className="text-sm font-mono font-black text-gray-800 tracking-tighter">{formatPKR(activeRecord.taxable)}</span>
                       </div>
                       <div className="flex justify-between items-center py-5 bg-primary/[0.03] px-4 rounded-2xl border border-primary/5">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck size={18}/></div>
                             <span className="text-[10px] font-black text-primary uppercase tracking-[2px]">Income Tax Withheld</span>
                          </div>
                          <span className="text-xl font-mono font-black text-primary underline decoration-double decoration-primary/30 underline-offset-8">
                             {formatPKR(activeRecord.taxPaid)}
                          </span>
                       </div>
                    </div>

                    {/* Signature & Security */}
                    <div className="flex justify-between items-end pt-12">
                       <div className="space-y-6">
                          <div className="space-y-1">
                             <p className="font-serif text-2xl text-primary font-bold italic opacity-60">Zainab Siddiqui</p>
                             <div className="h-[2px] w-40 bg-gray-900" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest">Authorized Signatory</p>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">FLEXI HRMS FINANCE (ID-881)</p>
                          </div>
                       </div>
                       <div className="text-right flex flex-col items-end gap-3">
                          <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                             <QrCode size={56} className="text-gray-400" strokeWidth={1.5} />
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-[7px] font-mono text-gray-400 font-bold uppercase">Digital Security Hash</p>
                             <p className="text-[7px] font-mono text-primary font-black uppercase tracking-tighter">{Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
                          </div>
                       </div>
                    </div>

                    {/* Legal Footer */}
                    <div className="pt-8 border-t border-dashed border-gray-200">
                       <p className="text-[8px] text-gray-400 font-bold leading-relaxed text-center uppercase tracking-tight">
                         System generated digital original as per FBR guidelines. Any alteration renders this document invalid. Discrepancies should be reported to the HR Finance team within 7 working days.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-6 bg-gray-50 border-t flex gap-4 mt-auto">
                 <button className="flex-1 py-3 bg-white border border-gray-200 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm">
                    Request Correction
                 </button>
                 <button className="flex-[2] py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Download size={16} /> Save Document
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Compliance Info Bar */}
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-5 max-w-5xl mx-auto shadow-sm">
         <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm border border-blue-50">
            <Info size={24} />
         </div>
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Pakistan Tax Compliance Notice</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Statutory tax certificates are issued at the end of the tax year (June 30th) or upon employee separation. The current '2024-25' certificate is a provisional YTD summary for information purposes only. Final certificates will be digitally signed by the verified withholding agent.
            </p>
         </div>
      </div>
    </div>
  );
};
