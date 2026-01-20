
import React, { useState } from 'react';
import { 
  Check, ArrowLeft, ArrowRight, TrendingUp, TrendingDown,
  Info, Download, Eye, RefreshCw, BarChart3,
  Wallet, MinusCircle, HandCoins, Building2,
  ChevronRight, ArrowUpRight, ArrowDownRight,
  PieChart, LayoutList
} from 'lucide-react';

interface PayrollWizardStep4Props {
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Select' },
  { id: 2, label: 'Ingest' },
  { id: 3, label: 'Validate' },
  { id: 4, label: 'Review' },
  { id: 5, label: 'Approve' },
  { id: 6, label: 'Finalize' },
  { id: 7, label: 'Disburse' }
];

export const PayrollWizardStep4: React.FC<PayrollWizardStep4Props> = ({ onNext, onBack, onCancel }) => {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(2)}M`;
  const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Wizard Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 4 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  step.id < 4 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step.id < 4 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 4 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-4 mt-[-18px] ${step.id < 4 ? 'bg-green-500' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Calculation Summary</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black uppercase bg-primary text-white px-2 py-0.5 rounded tracking-tighter shadow-sm">Version 1.2</span>
                 <span className="text-xs text-gray-400 italic">Generated Jan 15, 2025 • 11:30 AM</span>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                 <Download size={14} /> Audit Report
              </button>
              <button className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                 <LayoutList size={14} /> View Employee-wise
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Detailed Breakdown Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-primary p-6 text-white flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[2px] text-white/50 mb-1">Total Net Disbursement</p>
                  <h3 className="text-4xl font-black text-accent leading-none">PKR 29.80M</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-white/50 mb-1">Total CTC Impact</p>
                   <p className="text-xl font-bold text-white">PKR 42.15M</p>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
                {/* Earnings Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="p-1.5 bg-green-50 text-green-600 rounded">
                      <Wallet size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-800">Gross Earnings</h4>
                    <span className="ml-auto text-xs font-black text-green-600">PKR 37.00M</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Basic Salary', val: 22500000 },
                      { label: 'Standard Allowances', val: 12750000 },
                      { label: 'Overtime Payouts', val: 580000 },
                      { label: 'Bonuses & Incentives', val: 150000 },
                      { label: 'Expense Reimbursements', val: 85000 }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm group cursor-default">
                        <span className="text-gray-500 font-medium group-hover:text-primary transition-colors">{item.label}</span>
                        <span className="font-mono font-bold text-gray-700">{formatFullPKR(item.val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="p-1.5 bg-red-50 text-red-600 rounded">
                      <MinusCircle size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-800">Total Deductions</h4>
                    <span className="ml-auto text-xs font-black text-red-600">PKR 7.20M</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Provident Fund (EE)', val: 2775000 },
                      { label: 'Income Tax (FBR)', val: 3500000 },
                      { label: 'EOBI Contribution', val: 100750 },
                      { label: 'Loan EMIs', val: 580000 },
                      { label: 'Other Recoveries', val: 244250 }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm group cursor-default">
                        <span className="text-gray-500 font-medium group-hover:text-red-500 transition-colors">{item.label}</span>
                        <span className="font-mono font-bold text-gray-700">({formatFullPKR(item.val)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Employer Provisions</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-1 border rounded">PF ER: 2.7M</span>
                    <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-1 border rounded">EOBI ER: 300K</span>
                    <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-1 border rounded">Gratuity: 2.1M</span>
                  </div>
                </div>
                <button className="text-[10px] font-black text-primary uppercase hover:underline">Full CTC View</button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" /> Variance Analysis (vs Dec 2024)
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Metric</th>
                      <th className="px-6 py-4 text-center">Dec 2024</th>
                      <th className="px-6 py-4 text-center">Jan 2025</th>
                      <th className="px-6 py-4 text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-700">Total Employees</td>
                      <td className="px-6 py-4 text-center text-gray-500">312</td>
                      <td className="px-6 py-4 text-center text-primary font-black underline">325</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">+13 Joined</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-700">Gross Payroll</td>
                      <td className="px-6 py-4 text-center text-gray-500">{formatPKR(35800000)}</td>
                      <td className="px-6 py-4 text-center text-primary font-black">{formatPKR(37000000)}</td>
                      <td className="px-6 py-4 text-right text-red-500 font-bold">+{formatPKR(1200000)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-700">Net Disbursement</td>
                      <td className="px-6 py-4 text-center text-gray-500">{formatPKR(28900000)}</td>
                      <td className="px-6 py-4 text-center text-indigo-600 font-black">{formatPKR(29800000)}</td>
                      <td className="px-6 py-4 text-right text-red-500 font-bold">+{formatPKR(900000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Variance Breakdown & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Payroll Delta Explained</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'New Joiners Impact', val: 625000, trend: 'up' },
                  { label: 'Grade/Salary Increments', val: 150000, trend: 'up' },
                  { label: 'Overtime Variance', val: 80000, trend: 'up' },
                  { label: 'Leaves w/o Pay (LWP)', val: -45000, trend: 'down' },
                  { label: 'Loan Recoveries', val: 90000, trend: 'up' }
                ].map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-transparent hover:border-primary/10 transition-all">
                    <div className="flex items-center gap-3">
                      {v.trend === 'up' ? (
                        <ArrowUpRight size={16} className="text-red-500" />
                      ) : (
                        <ArrowDownRight size={16} className="text-green-500" />
                      )}
                      <span className="text-xs font-bold text-gray-600">{v.label}</span>
                    </div>
                    <span className={`text-[11px] font-black ${v.val > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {v.val > 0 ? '+' : ''}{v.val.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                   <PieChart size={16} className="text-primary" />
                   <h4 className="text-[10px] font-black text-primary uppercase">Volume Analysis</h4>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                   <div className="h-full bg-primary" style={{ width: '60%' }} />
                   <div className="h-full bg-accent" style={{ width: '25%' }} />
                   <div className="h-full bg-gray-300" style={{ width: '15%' }} />
                </div>
                <div className="mt-3 flex justify-between text-[9px] font-bold text-gray-400">
                   <span>Permanent (60%)</span>
                   <span>Contract (25%)</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
              <div className="flex gap-3">
                <Info size={20} className="text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800 leading-relaxed font-medium uppercase tracking-tight">
                  Calculations are final. Proceeding will trigger the approval workflow for <strong>3 tiers of management</strong>.
                </p>
              </div>
              <button 
                onClick={handleRecalculate}
                disabled={isRecalculating}
                className="w-full py-3 bg-white border border-orange-200 text-orange-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
              >
                {isRecalculating ? (
                   <>
                     <RefreshCw size={14} className="animate-spin" /> Recalculating Batch...
                   </>
                ) : (
                   <>
                     <RefreshCw size={14} /> Force Recalculate
                   </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-10 pt-8 border-t flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Discard Run
            </button>
            <button 
              onClick={onNext}
              className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
            >
              Ready for Approval <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
