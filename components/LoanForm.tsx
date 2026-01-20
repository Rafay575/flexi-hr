
import React, { useState, useMemo } from 'react';
import { 
  X, Save, Send, Search, Calculator, 
  Calendar, CreditCard, ShieldCheck, 
  FileText, Upload, Info, Trash2, 
  Percent, Clock, User, Landmark,
  ChevronRight, ArrowRight, LayoutList
} from 'lucide-react';

interface LoanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type FormTab = 'DETAILS' | 'SCHEDULE' | 'DOCUMENTS';

export const LoanForm: React.FC<LoanFormProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<FormTab>('DETAILS');
  const [formData, setFormData] = useState({
    empId: '',
    loanType: 'Personal',
    principal: 100000,
    interestType: 'Free',
    rate: 0,
    tenure: 12,
    startMonth: '2025-02',
    autoDeduct: true,
    maxCap: 50,
    approver: 'Zainab Siddiqui'
  });

  const calculation = useMemo(() => {
    const p = formData.principal;
    const t = formData.tenure;
    const r = formData.rate / 100 / 12;
    
    let totalInterest = 0;
    let emi = 0;

    if (formData.interestType === 'Free') {
      emi = p / t;
    } else if (formData.interestType === 'Fixed') {
      totalInterest = p * (formData.rate / 100) * (t / 12);
      emi = (p + totalInterest) / t;
    } else { // Reducing
      emi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
      totalInterest = (emi * t) - p;
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(p + totalInterest)
    };
  }, [formData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <HandCoins size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 leading-tight">Loan Application</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Lending Request</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50/50 px-6">
          {(['DETAILS', 'SCHEDULE', 'DOCUMENTS'] as FormTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-[1px] ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'DETAILS' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Employee & Type */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Search Employee</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="EMP ID or Name..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Loan Type</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none"
                    value={formData.loanType}
                    onChange={(e) => setFormData({...formData, loanType: e.target.value})}
                  >
                    <option>Salary Advance</option>
                    <option>Personal</option>
                    <option>Emergency</option>
                    <option>Car</option>
                    <option>House</option>
                  </select>
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Principal (PKR)</label>
                  <input 
                    type="number" 
                    value={formData.principal}
                    onChange={(e) => setFormData({...formData, principal: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Interest Type</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none"
                    value={formData.interestType}
                    onChange={(e) => setFormData({...formData, interestType: e.target.value as any})}
                  >
                    <option value="Free">Interest Free</option>
                    <option value="Fixed">Fixed Rate</option>
                    <option value="Reducing">Reducing Bal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tenure (Mo)</label>
                  <input 
                    type="number" 
                    value={formData.tenure}
                    onChange={(e) => setFormData({...formData, tenure: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none"
                  />
                </div>
              </div>

              {/* Quick Preview Card */}
              <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20 grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-white/40 uppercase">Principal</p>
                  <p className="text-sm font-black">{formData.principal.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-white/40 uppercase">Total Int.</p>
                  <p className="text-sm font-black text-accent">+{calculation.totalInterest.toLocaleString()}</p>
                </div>
                <div className="space-y-1 col-span-2 border-l border-white/10 pl-6">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">Monthly EMI</p>
                  <p className="text-2xl font-black">{calculation.emi.toLocaleString()}</p>
                </div>
              </div>

              {/* Recovery & Approval */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Calculator size={14}/> Recovery Rules
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
                      <div className="flex items-center gap-2">
                         <Calendar size={14} className="text-gray-400" />
                         <span className="text-xs font-bold text-gray-600">Start Month</span>
                      </div>
                      <input type="month" value={formData.startMonth} className="bg-transparent text-xs font-bold outline-none text-primary" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
                      <div className="flex items-center gap-2">
                         <Percent size={14} className="text-gray-400" />
                         <span className="text-xs font-bold text-gray-600">Max % Cap</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input type="number" value={formData.maxCap} className="w-8 text-right bg-transparent text-xs font-bold outline-none" />
                        <span className="text-[10px] font-black text-gray-300">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ShieldCheck size={14}/> Approval Chain
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                      <span className="text-xs font-bold text-primary">Required Approval</span>
                      <button 
                        onClick={() => setFormData({...formData, autoDeduct: !formData.autoDeduct})}
                        className={`w-8 h-4 rounded-full relative transition-all ${formData.autoDeduct ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.autoDeduct ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase">Approver</label>
                       <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none">
                          <option>Zainab Siddiqui (HR Manager)</option>
                          <option>Ahmed Raza (Finance Head)</option>
                       </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SCHEDULE' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <LayoutList size={16} /> Repayment Schedule
                </h4>
                <div className="text-xs font-bold text-gray-500 italic">Total Payable: PKR {calculation.totalPayable.toLocaleString()}</div>
              </div>
              <div className="border rounded-2xl overflow-hidden shadow-inner bg-gray-50/50">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-gray-100 border-b font-black text-gray-400 uppercase tracking-tighter">
                    <tr>
                      <th className="px-6 py-3">Inst #</th>
                      <th className="px-6 py-3">Repayment Date</th>
                      <th className="px-6 py-3 text-right">Principal</th>
                      <th className="px-6 py-3 text-right">Interest</th>
                      <th className="px-6 py-3 text-right">EMI Amount</th>
                      <th className="px-6 py-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-black text-gray-400">{String(i + 1).padStart(2, '0')}</td>
                        <td className="px-6 py-3 font-bold text-gray-700">31-Jan-2025</td>
                        <td className="px-6 py-3 text-right text-gray-500">{(formData.principal / formData.tenure).toFixed(0)}</td>
                        <td className="px-6 py-3 text-right text-gray-500">0</td>
                        <td className="px-6 py-3 text-right font-black text-primary">{calculation.emi.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right font-mono font-bold">{(formData.principal - (calculation.emi * (i + 1))).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 italic">
                      <td colSpan={6} className="px-6 py-3 text-center text-gray-400">... and {formData.tenure - 5} more installments</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                 <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
                   Schedule is tentative. Dates will align with the specific payroll cycle payment dates.
                 </p>
              </div>
            </div>
          )}

          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-4">
                  {[
                    { label: 'Loan Agreement (Signed)', req: true },
                    { label: 'Personal ID Copy', req: true },
                    { label: 'Supporting Evidence', req: false },
                  ].map((doc, i) => (
                    <div key={i} className="p-6 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all bg-gray-50/30">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-primary transition-colors text-gray-400">
                             <FileText size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-gray-700 uppercase tracking-wide">{doc.label}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{doc.req ? 'Mandatory' : 'Optional'} • PDF/JPG</p>
                          </div>
                       </div>
                       <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all">
                          <Upload size={14} /> Upload File
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
              Ready for {formData.approver.split(' ')[0]}'s review
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                Save Draft
              </button>
              <button 
                onClick={() => onSave(formData)}
                className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
              >
                <Send size={18} /> Submit Application
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons missing from main imports but used here
const HandCoins = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
    <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L13 15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);
