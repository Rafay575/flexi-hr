
import React, { useState, useMemo } from 'react';
import { 
  FileJson, FileSpreadsheet, Send, CheckCircle2, 
  AlertCircle, ArrowRight, ShieldCheck, Database,
  Settings2, Search, Filter, Layers, Calculator,
  ExternalLink, Info, Check, RefreshCw
} from 'lucide-react';

interface GLMapping {
  component: string;
  glAccount: string;
  glName: string;
  type: 'DEBIT' | 'CREDIT';
  costCenter: string;
  amount: number;
}

const MOCK_MAPPINGS: GLMapping[] = [
  { component: 'Basic Salary', glAccount: '501001', glName: 'Salaries & Wages Exp', type: 'DEBIT', costCenter: 'ENGINEERING', amount: 22500000 },
  { component: 'House Rent', glAccount: '501002', glName: 'Staff Allowances Exp', type: 'DEBIT', costCenter: 'ENGINEERING', amount: 10125000 },
  { component: 'Income Tax', glAccount: '202005', glName: 'WHT Payable - Salaries', type: 'CREDIT', costCenter: 'CORPORATE', amount: 3500000 },
  { component: 'Provident Fund (EE)', glAccount: '202010', glName: 'PF Payable - Employee', type: 'CREDIT', costCenter: 'CORPORATE', amount: 2775000 },
  { component: 'Net Salary Payable', glAccount: '201001', glName: 'Salaries Clearing A/C', type: 'CREDIT', costCenter: 'CORPORATE', amount: 26350000 },
];

export const JVExport: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState('Jan 2025 (v1.2)');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const totals = useMemo(() => {
    const debits = MOCK_MAPPINGS.filter(m => m.type === 'DEBIT').reduce((a, b) => a + b.amount, 0);
    const credits = MOCK_MAPPINGS.filter(m => m.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);
    return { debits, credits, balanced: debits === credits };
  }, []);

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(2)}M`;
  const formatFullPKR = (val: number) => val.toLocaleString();

  const handlePostToERP = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setPostSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Accounting JV Export</h2>
          <p className="text-sm text-gray-500">Map payroll components to General Ledger accounts for ERP integration</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Settings2 size={18} /> Global Mapping
          </button>
          <div className="relative">
            <select 
              value={selectedRun}
              onChange={(e) => setSelectedRun(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none appearance-none cursor-pointer"
            >
              <option>Jan 2025 (v1.2)</option>
              <option>Dec 2024 Final</option>
            </select>
          </div>
        </div>
      </div>

      {/* Balance Indicator Banner */}
      <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-xl transition-all ${
        totals.balanced ? 'bg-green-600 border-green-700 text-white' : 'bg-red-600 border-red-700 text-white'
      }`}>
        <div className="flex items-center gap-6">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
            {totals.balanced ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              {totals.balanced ? 'Trial Balance Verified' : 'Voucher Unbalanced'}
            </h3>
            <p className="text-sm opacity-80">
              {totals.balanced 
                ? 'All debit and credit entries match. Voucher is ready for ERP transmission.' 
                : 'There is a discrepancy in the component mapping. Please review GL accounts.'}
            </p>
          </div>
        </div>
        <div className="flex gap-8 pr-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/50 uppercase">Total Debits</p>
            <p className="text-2xl font-black">{formatPKR(totals.debits)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/50 uppercase">Total Credits</p>
            <p className="text-2xl font-black">{formatPKR(totals.credits)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mapping Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Layers size={14} /> Voucher Line Items
              </h4>
              <button className="text-[10px] font-black text-primary uppercase hover:underline">Download Template</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/30 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Pay Component</th>
                  <th className="px-6 py-4">GL Account</th>
                  <th className="px-6 py-4">Cost Center</th>
                  <th className="px-6 py-4 text-right">Debit (PKR)</th>
                  <th className="px-6 py-4 text-right">Credit (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_MAPPINGS.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700">{m.component}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] font-black text-primary">{m.glAccount}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold truncate max-w-[150px]">{m.glName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded border uppercase">{m.costCenter}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">
                      {m.type === 'DEBIT' ? formatFullPKR(m.amount) : '--'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-red-500">
                      {m.type === 'CREDIT' ? formatFullPKR(m.amount) : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-black">
                <tr>
                  <td colSpan={3} className="px-6 py-5 text-right text-[10px] uppercase text-gray-400 tracking-widest">Total Trial Balance</td>
                  <td className="px-6 py-5 text-right font-mono text-primary text-base underline decoration-double">{formatFullPKR(totals.debits)}</td>
                  <td className="px-6 py-5 text-right font-mono text-primary text-base underline decoration-double">{formatFullPKR(totals.credits)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right: Actions & Validation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">ERP Integration</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <Database size={16} className="text-primary" />
                      <span className="text-xs font-black text-gray-700 uppercase">Target System</span>
                   </div>
                   <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">SAP S/4HANA</span>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Connection Status:</span>
                      <span className="text-green-600 font-bold">Encrypted Link OK</span>
                   </div>
                   <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Posting Period:</span>
                      <span className="text-gray-800 font-bold">2025/001</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all group">
                    <FileSpreadsheet size={20} className="text-green-600" />
                    <span className="text-[10px] font-black uppercase text-gray-500">Excel Export</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all group">
                    <FileJson size={20} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase text-gray-500">JSON API</span>
                 </button>
              </div>

              <div className="h-[1px] bg-gray-100 my-2" />

              {!postSuccess ? (
                <button 
                  onClick={handlePostToERP}
                  disabled={isPosting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPosting ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                  {isPosting ? 'Posting to ERP...' : 'Post to General Ledger'}
                </button>
              ) : (
                <div className="bg-green-500 text-white p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
                  <CheckCircle2 size={24} />
                  <div>
                    <p className="text-xs font-black uppercase">Success!</p>
                    <p className="text-[10px] opacity-90 font-bold">DOC ID: 190002245 POSTED</p>
                  </div>
                  <button onClick={() => setPostSuccess(false)} className="ml-auto opacity-50 hover:opacity-100"><X size={16}/></button>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4">
               <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Post-Posting Checklist</h4>
               <div className="space-y-2">
                  {[
                    { label: 'Debit/Credit Equality', status: true },
                    { label: 'Valid GL Account Strings', status: true },
                    { label: 'Active Cost Center Mapping', status: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <Check size={10} strokeWidth={4} />
                      </div>
                      {item.label}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
         <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
         <div className="space-y-1">
            <p className="text-xs text-blue-700 font-medium leading-relaxed uppercase tracking-tight">
              <strong>Audit Enforcement:</strong> Once a JV is successfully posted to the ERP, the corresponding payroll run is marked as <span className="font-bold">Accounting Closed</span>. Reversal of the JV must be performed within the ERP and documented for internal audit.
            </p>
         </div>
      </div>
    </div>
  );
};

// Helper for X icon missing in initial thinking but useful for UI state
const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);
