
import React, { useState } from 'react';
import { 
  Search, Download, Mail, Eye, Filter, 
  ChevronDown, FileText, Printer, CheckCircle2, 
  Clock, Send, X, Landmark, User, ShieldCheck, 
  TrendingUp, DownloadCloud
} from 'lucide-react';

interface PayslipRecord {
  id: string;
  name: string;
  dept: string;
  gross: number;
  deductions: number;
  net: number;
  status: 'Generated' | 'Published' | 'Downloaded' | 'Emailed';
}

const MOCK_PAYSLIPS: PayslipRecord[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', dept: 'Engineering', gross: 215000, deductions: 30000, net: 185000, status: 'Published' },
  { id: 'EMP-1002', name: 'Saira Ahmed', dept: 'HR', gross: 125000, deductions: 18750, net: 106250, status: 'Emailed' },
  { id: 'EMP-1003', name: 'Umar Farooq', dept: 'Sales', gross: 45000, deductions: 2500, net: 42500, status: 'Generated' },
  { id: 'EMP-1004', name: 'Zainab Bibi', dept: 'Operations', gross: 92000, deductions: 10000, net: 82000, status: 'Downloaded' },
  { id: 'EMP-1005', name: 'Mustafa Kamal', dept: 'Engineering', gross: 550000, deductions: 130000, net: 420000, status: 'Published' },
];

export const PayslipViewer: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState('Jan 2025 (v1.2)');
  const [search, setSearch] = useState('');
  const [previewPayslip, setPreviewPayslip] = useState<PayslipRecord | null>(null);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const getStatusStyle = (status: PayslipRecord['status']) => {
    switch (status) {
      case 'Generated': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Published': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'Downloaded': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Emailed': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payslip Repository</h2>
          <p className="text-sm text-gray-500">Access and distribute generated payslips for the organization</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Mail size={18} /> Email Selected
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <DownloadCloud size={18} /> Download All (ZIP)
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-64">
            <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedRun}
              onChange={(e) => setSelectedRun(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 appearance-none"
            >
              <option>Jan 2025 (v1.2)</option>
              <option>Dec 2024 (v2.1)</option>
              <option>Nov 2024 (v1.4)</option>
            </select>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search employee by name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2">
            <Filter size={14} /> All Departments
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Employee Info</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5 text-right">Gross Pay</th>
                <th className="px-6 py-5 text-right">Deductions</th>
                <th className="px-6 py-5 text-right font-black">Net Salary</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PAYSLIPS.map((ps) => (
                <tr key={ps.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs border border-primary/10">{ps.name.charAt(0)}</div>
                       <div>
                         <p className="font-bold text-gray-800">{ps.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{ps.id}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-tight">{ps.dept}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-600">{formatPKR(ps.gross)}</td>
                  <td className="px-6 py-4 text-right font-mono text-red-400">-{formatPKR(ps.deductions)}</td>
                  <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(ps.net)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border shadow-sm ${getStatusStyle(ps.status)}`}>
                      {ps.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setPreviewPayslip(ps)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
                        title="Preview"
                       >
                         <Eye size={18} />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Download PDF">
                         <Download size={18} />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Email Payslip">
                         <Mail size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50 border-t flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
           <p>Showing 5 of 325 generated payslips</p>
           <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> 100% Generated</span>
              <span className="flex items-center gap-1 ml-4"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> 85% Published</span>
           </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewPayslip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setPreviewPayslip(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
            
            {/* Modal Header Actions */}
            <div className="bg-gray-50 px-8 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-md">
                   <Download size={14} /> Download PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
                   <Mail size={14} /> Email to Emp
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
                   <Printer size={14} /> Print
                </button>
              </div>
              <button onClick={() => setPreviewPayslip(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            {/* High Fidelity Payslip Layout */}
            <div className="flex-1 overflow-y-auto p-12 bg-white custom-scrollbar">
              <div className="max-w-[700px] mx-auto border-2 border-gray-50 p-12 space-y-12">
                {/* Payslip Branding */}
                <div className="flex justify-between items-start border-b-2 border-primary pb-8">
                  <div>
                    <h1 className="text-3xl font-black text-primary tracking-tighter">Flexi HRMS</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Enterprise Payroll System</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">Payslip</h2>
                    <p className="text-sm font-bold text-primary italic uppercase tracking-tighter mt-1">January 2025 Cycle</p>
                  </div>
                </div>

                {/* Employee Details Row */}
                <div className="grid grid-cols-2 gap-12 text-sm">
                  <div className="space-y-4">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Employee Name</p>
                       <p className="font-black text-gray-800 text-lg">{previewPayslip.name}</p>
                       <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">{previewPayslip.id} • {previewPayslip.dept}</p>
                    </div>
                    <div className="space-y-1 pt-2">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Designation</p>
                       <p className="font-bold text-gray-700">Senior Professional Lead (G18)</p>
                    </div>
                  </div>
                  <div className="space-y-4 border-l pl-12">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bank Name</p>
                          <p className="font-bold text-gray-700">HBL Corporate</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account No</p>
                          <p className="font-mono font-bold text-gray-700 text-xs">**** 7890</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">NTN No</p>
                          <p className="font-mono font-bold text-gray-700 text-xs">1234567-8</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pay Date</p>
                          <p className="font-bold text-gray-700">Jan 31, 2025</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Main Tables */}
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 border-b-2 border-green-50 pb-2">Earnings</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs"><span>Basic Salary</span><span className="font-mono font-bold">107,500</span></div>
                       <div className="flex justify-between text-xs"><span>House Rent (45%)</span><span className="font-mono font-bold">48,375</span></div>
                       <div className="flex justify-between text-xs"><span>Utilities (10%)</span><span className="font-mono font-bold">10,750</span></div>
                       <div className="flex justify-between text-xs"><span>Special Allowance</span><span className="font-mono font-bold">48,375</span></div>
                       <div className="flex justify-between text-xs font-black text-gray-800 pt-3 border-t border-gray-100">
                          <span className="uppercase">Gross Salary</span>
                          <span className="font-mono text-base">{previewPayslip.gross.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 border-b-2 border-red-50 pb-2">Deductions</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs"><span>Income Tax (FBR)</span><span className="font-mono font-bold">22,500</span></div>
                       <div className="flex justify-between text-xs"><span>Provident Fund (EE)</span><span className="font-mono font-bold">7,500</span></div>
                       <div className="flex justify-between text-xs font-black text-red-600 pt-3 border-t border-gray-100">
                          <span className="uppercase">Total Deductions</span>
                          <span className="font-mono text-base">({previewPayslip.deductions.toLocaleString()})</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Payout Block */}
                <div className="bg-primary p-8 rounded-2xl flex items-center justify-between text-white shadow-xl">
                  <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Net Take-home Salary</p>
                    <p className="text-3xl font-black text-accent tracking-tighter">PKR {previewPayslip.net.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-white/70 italic max-w-[200px]">
                       "Rupees {previewPayslip.net.toLocaleString()} Only"
                    </p>
                  </div>
                </div>

                {/* YTD & Provisions */}
                <div className="grid grid-cols-4 gap-4">
                   {[
                     { label: 'YTD Gross', val: 'PKR 1.5M' },
                     { label: 'YTD Tax Paid', val: 'PKR 187K' },
                     { label: 'PF Balance', val: 'PKR 225K' },
                     { label: 'Leave Bal', val: '12 Days' }
                   ].map((item, i) => (
                     <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">{item.label}</p>
                        <p className="text-[11px] font-bold text-gray-700">{item.val}</p>
                     </div>
                   ))}
                </div>

                {/* Footer Message */}
                <div className="pt-8 border-t border-dashed border-gray-200 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-green-500" />
                      <p className="text-[9px] text-gray-400 font-medium uppercase leading-relaxed max-w-xs">
                        This is a system generated document and does not require a signature. Compliance verified against FBR Slab Jan 2025.
                      </p>
                   </div>
                   <div className="text-right opacity-30">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Verification Code</p>
                      <p className="text-[8px] font-mono font-bold">FX-PR-PK-2025-001-9922</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
