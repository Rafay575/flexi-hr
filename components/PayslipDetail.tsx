
import React, { useState } from 'react';
import { 
  X, Download, Printer, Mail, Info, Bot, 
  TrendingUp, TrendingDown, Sparkles, MessageSquare,
  ShieldCheck, Landmark, User, Calendar, 
  ArrowRight, Calculator, PieChart, FileText,
  HelpCircle, ChevronRight, Wallet, ShieldAlert,
  /* Added missing icon import */
  Send
} from 'lucide-react';

interface PayslipDetailProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
}

interface ComponentExplanation {
  label: string;
  description: string;
  logic: string;
}

const GLOSSARY: Record<string, ComponentExplanation> = {
  'Basic Salary': { label: 'Basic Salary', description: 'The fundamental amount of your compensation. It serves as the basis for calculating benefits like PF and Gratuity.', logic: 'Fixed amount defined in G18 grade structure.' },
  'House Rent (HRA)': { label: 'House Rent (HRA)', description: 'Statutory allowance provided to cover housing costs. It is tax-exempt up to 45% of basic salary.', logic: 'Calculated as 45% of Basic Salary.' },
  'Utilities': { label: 'Utilities', description: 'Allowance to cover electricity, water, and fuel expenses. This component is generally fully taxable.', logic: 'Fixed percentage (10%) of Basic Salary.' },
  'Overtime Pay': { label: 'Overtime Pay', description: 'Remuneration for extra working hours beyond standard shifts.', logic: 'Rate: (Gross / 30 / 8) * 2.0 per hour.' },
  'Income Tax (WHT)': { label: 'Income Tax', description: 'Mandatory withholding tax deducted and deposited to FBR based on your annual projected taxable income.', logic: 'Applied via FBR Progressive Slab #3 (FY 2024-25).' },
  'Provident Fund': { label: 'Provident Fund', description: 'Your monthly contribution towards retirement savings. The company matches this 1:1.', logic: 'Calculated as 8.33% of Basic Salary.' }
};

export const PayslipDetail: React.FC<PayslipDetailProps> = ({ isOpen, onClose, month }) => {
  const [activeExplanation, setActiveExplanation] = useState<ComponentExplanation | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);

  if (!isOpen) return null;

  const data = {
    current: {
      basic: 107500,
      hra: 48375,
      utilities: 10750,
      overtime: 15000,
      bonus: 0,
      tax: 22500,
      pf: 8954,
      net: 150171
    },
    previous: {
      basic: 107500,
      hra: 48375,
      utilities: 10750,
      overtime: 8000,
      bonus: 0,
      tax: 21500,
      pf: 8954,
      net: 144171
    }
  };

  const formatPKR = (val: number) => val.toLocaleString();

  const comparisons = [
    { label: 'Basic Salary', curr: data.current.basic, prev: data.previous.basic },
    { label: 'House Rent (HRA)', curr: data.current.hra, prev: data.previous.hra },
    { label: 'Utilities', curr: data.current.utilities, prev: data.previous.utilities },
    { label: 'Overtime Pay', curr: data.current.overtime, prev: data.previous.overtime },
    { label: 'Income Tax (WHT)', curr: data.current.tax, prev: data.previous.tax, isDeduct: true },
    { label: 'Provident Fund', curr: data.current.pf, prev: data.previous.pf, isDeduct: true },
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gray-50 px-8 py-5 border-b flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">January 2025 Summary</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 uppercase tracking-tighter">Verified Disbursement</span>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Original</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Printer size={20}/></button>
            <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Mail size={20}/></button>
            <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-md">
               <Download size={16} /> Download PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 ml-2">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Comparison Table */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                    <PieChart size={16} className="text-primary" /> Multi-Month Variance Engine
                 </h4>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-300"/> Dec 2024</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-primary"/> Jan 2025</span>
                 </div>
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Component</th>
                      <th className="px-6 py-4 text-right">Previous</th>
                      <th className="px-6 py-4 text-right">Current</th>
                      <th className="px-6 py-4 text-right">Absolute Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {comparisons.map((c, i) => {
                      const diff = c.curr - c.prev;
                      const isZero = diff === 0;
                      return (
                        <tr 
                          key={i} 
                          className={`hover:bg-primary/[0.02] cursor-pointer transition-colors group ${activeExplanation?.label === c.label ? 'bg-primary/5' : ''}`}
                          onClick={() => setActiveExplanation(GLOSSARY[c.label] || null)}
                        >
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-700">{c.label}</span>
                                <HelpCircle size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-gray-400">{formatPKR(c.prev)}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-gray-800">{formatPKR(c.curr)}</td>
                          <td className={`px-6 py-4 text-right font-mono font-black ${isZero ? 'text-gray-300' : (diff > 0 && !c.isDeduct) || (diff < 0 && c.isDeduct) ? 'text-green-600' : 'text-red-500'}`}>
                            {isZero ? '--' : `${diff > 0 ? '+' : ''}${formatPKR(diff)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-primary/5 font-black text-primary border-t-2 border-primary/10">
                    <tr>
                      <td className="px-6 py-5 uppercase text-[10px] tracking-[2px]">Net Take-Home Salary</td>
                      <td className="px-6 py-5 text-right font-mono opacity-50">{formatPKR(data.previous.net)}</td>
                      <td className="px-6 py-5 text-right font-mono text-lg underline decoration-double underline-offset-8">{formatPKR(data.current.net)}</td>
                      <td className="px-6 py-5 text-right font-mono text-green-600">+{formatPKR(data.current.net - data.previous.net)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Landmark size={20} className="text-primary" />
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase">HBL Transfer</p>
                          <p className="text-xs font-bold text-gray-800">**** 7890</p>
                       </div>
                    </div>
                    <button className="text-[9px] font-black text-primary uppercase hover:underline">Change</button>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-purple-600" />
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase">FBR Status</p>
                       <p className="text-xs font-bold text-gray-800 uppercase">Verified Filer</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column: AI Explainer & Detail Drawer */}
            <div className="lg:col-span-5 space-y-6">
              {/* Contextual Detail Panel */}
              <div className={`bg-white rounded-3xl border-2 transition-all p-8 relative overflow-hidden ${activeExplanation ? 'border-primary shadow-xl scale-105' : 'border-gray-50 opacity-40'}`}>
                 {activeExplanation ? (
                    <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 text-primary rounded-xl"><Calculator size={20}/></div>
                          <h5 className="text-lg font-black text-gray-800">{activeExplanation.label}</h5>
                       </div>
                       <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          {activeExplanation.description}
                       </p>
                       <div className="pt-4 border-t border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Calculation Logic</p>
                          <p className="text-xs font-bold text-primary italic">"{activeExplanation.logic}"</p>
                       </div>
                       <button onClick={() => setActiveExplanation(null)} className="absolute top-4 right-4 p-1 text-gray-300 hover:text-red-500"><X size={16}/></button>
                    </div>
                 ) : (
                    <div className="text-center py-10 space-y-3">
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                          <Info size={32} />
                       </div>
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Click any component for a plain-English explanation</p>
                    </div>
                 )}
              </div>

              {/* AI Narrator Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-primary p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent rounded-xl text-primary animate-pulse shadow-lg">
                       <Bot size={24} />
                    </div>
                    <div>
                       <h4 className="font-black text-lg leading-none tracking-tight">Smart Payslip Narrator</h4>
                       <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">Automatic Insights Engine</p>
                    </div>
                 </div>

                 <div className="relative z-10 space-y-6">
                    <div className="text-sm font-medium leading-relaxed bg-white/10 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                       <p>Hi Umar! I've analyzed your Jan 2025 payout vs December.</p>
                       <div className="mt-4 flex items-start gap-3">
                          <TrendingUp size={16} className="text-green-400 mt-1 shrink-0" />
                          <span>The 4.2% increase is due to <span className="text-accent font-black">PKR 7,000 extra in Overtime</span> recorded by the TimeSync system.</span>
                       </div>
                       <div className="mt-4 flex items-start gap-3">
                          <ShieldAlert size={16} className="text-red-300 mt-1 shrink-0" />
                          <span>This pushed your monthly tax slightly higher (+PKR 1,000), but your annual slab remains #3.</span>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowAiChat(!showAiChat)}
                      className="w-full py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all active:scale-95 shadow-xl"
                    >
                       <MessageSquare size={16} /> Interactive Chat Assistant
                    </button>
                 </div>
                 <Sparkles className="absolute right-[-20px] top-[-20px] text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              </div>

              {showAiChat && (
                <div className="bg-gray-50 border border-indigo-100 rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom-4 shadow-inner">
                   <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-primary shrink-0 shadow-sm"><User size={16}/></div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                         <p className="text-xs font-bold text-gray-700 leading-tight">Can you explain slab-wise tax calculations for my annual pay?</p>
                      </div>
                   </div>
                   <div className="flex gap-3 justify-end">
                      <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[85%] border border-primary-dark">
                         <p className="text-[11px] leading-relaxed font-medium">
                            Certainly! Based on your projected annual gross of PKR 1,850,000:
                            <br/>• First 600K: 0%
                            <br/>• Next 600K: 5%
                            <br/>• Remaining: 15%
                            <br/>Monthly WHT is averaged over 12 months for consistency.
                         </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center shrink-0 shadow-sm font-black text-[10px]">AI</div>
                   </div>
                   <div className="relative pt-2">
                      <input 
                        type="text" 
                        placeholder="Type your payroll query..." 
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm" 
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-dark active:scale-90 transition-all"><Send size={14}/></button>
                   </div>
                </div>
              )}

              <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
                 <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
                 <div className="space-y-1">
                    <p className="text-[10px] text-blue-900 font-black uppercase tracking-tight">Need Support?</p>
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                       Discrepancy in attendance data? Raise a ticket with <span className="font-bold underline cursor-pointer">Payroll Helpdesk</span> before Feb 5th.
                    </p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
