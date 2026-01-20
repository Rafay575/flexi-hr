
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, X, User, Briefcase, 
  Calendar, Landmark, ShieldCheck, Calculator, 
  Wallet, MinusCircle, FileText, Send, Bell, 
  Trash2, Info, Building2, ClipboardCheck, 
  Clock, Download, CreditCard, Award,
  CheckCircle2, Eye
} from 'lucide-react';
import { FullFinalStatement } from './FullFinalStatement';

interface EOSSettlementWizardProps {
  onCancel: () => void;
  onComplete: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { id: 1, label: 'Verify' },
  { id: 2, label: 'Calculate' },
  { id: 3, label: 'Clearance' },
  { id: 4, label: 'Approve' },
  { id: 5, label: 'Pay & Close' }
];

export const EOSSettlementWizard: React.FC<EOSSettlementWizardProps> = ({ onCancel, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showGratuityWorkings, setShowGratuityWorkings] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const mockEmp = {
    id: 'EMP-1199',
    name: 'Umar Jafri',
    dept: 'Engineering',
    designation: 'Specialist',
    joinDate: '2020-07-15',
    lwd: '2025-01-15',
    exitType: 'Resignation',
    noticeServed: '30 Days',
    shortfall: '0 Days',
    leaveBalance: 12.5,
    activeLoan: 45000,
    basicSalary: 85000,
    grossSalary: 145000
  };

  const calc = useMemo(() => {
    const proratedSal = 72500; // Half month
    const leaveEncash = Math.round((mockEmp.basicSalary / 30) * mockEmp.leaveBalance);
    const gratuity = 185000;
    const reimb = 12500;
    const earnings = proratedSal + leaveEncash + gratuity + reimb;
    
    const noticeRec = 0;
    const loanBal = 45000;
    const tax = earnings * 0.15;
    const deductions = noticeRec + loanBal + tax;
    
    return {
      proratedSal, leaveEncash, gratuity, reimb, earnings,
      noticeRec, loanBal, tax, deductions,
      net: earnings - deductions
    };
  }, []);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Full & Final Settlement</h2>
            <p className="text-sm text-gray-500 uppercase font-black tracking-widest text-primary/60">Processing: {mockEmp.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
           <Clock size={16} className="text-primary" />
           <span className="text-xs font-black text-primary uppercase">Draft Stage</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10 px-10">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep === s.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  currentStep > s.id ? 'bg-green-50 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {currentStep > s.id ? <Check size={18} /> : <span className="text-xs font-black">{s.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === s.id ? 'text-primary' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-[-15px] mt-[-18px] ${currentStep > s.id ? 'bg-green-500' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: VERIFY */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                    <User size={14} /> Employee & Exit Context
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                     <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg">UJ</div>
                        <div>
                           <p className="font-black text-gray-800">{mockEmp.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">{mockEmp.id} • {mockEmp.dept}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">Exit Type</p>
                           <p className="font-bold text-gray-700">{mockEmp.exitType}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">Last Day</p>
                           <p className="font-bold text-red-600">{mockEmp.lwd}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">Notice Served</p>
                           <p className="font-bold text-gray-700">{mockEmp.noticeServed}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">Shortfall</p>
                           <p className="font-bold text-gray-700">{mockEmp.shortfall}</p>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                    <ShieldCheck size={14} /> Employment Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Service Tenure</p>
                        <p className="text-sm font-black text-gray-800">4.5 Years</p>
                     </div>
                     <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Leave Balance</p>
                        <p className="text-sm font-black text-gray-800">{mockEmp.leaveBalance} Days</p>
                     </div>
                     <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Active Loan</p>
                        <p className="text-sm font-black text-red-500">{formatPKR(mockEmp.activeLoan)}</p>
                     </div>
                     <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Company Assets</p>
                        <p className="text-sm font-black text-orange-500">03 Handed Over</p>
                     </div>
                  </div>
               </section>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
               <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
               <p className="text-[10px] text-blue-700 font-medium leading-relaxed uppercase tracking-tight italic">
                 Verify exit details against the resignation letter/termination notice. Mismatch in 'Shortfall' will impact notice recovery calculations in Step 2.
               </p>
            </div>
          </div>
        )}

        {/* STEP 2: CALCULATE */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                     <Wallet size={16} className="text-green-600" /> Settlement Earnings (+)
                   </h3>
                   <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                         <tbody className="divide-y divide-gray-50 font-medium">
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-600">Final Salary (Prorated)</td><td className="px-6 py-4 text-right font-mono font-bold text-gray-800">{formatPKR(calc.proratedSal)}</td></tr>
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-600">Leave Encashment (12.5 Days)</td><td className="px-6 py-4 text-right font-mono font-bold text-gray-800">{formatPKR(calc.leaveEncash)}</td></tr>
                            <tr className="hover:bg-gray-50">
                               <td className="px-6 py-4 text-gray-600 flex items-center justify-between">
                                  <span>Gratuity Payout</span>
                                  <button onClick={() => setShowGratuityWorkings(!showGratuityWorkings)} className="text-[9px] font-black text-primary uppercase hover:underline">Workings {showGratuityWorkings ? '↑' : '↓'}</button>
                               </td>
                               <td className="px-6 py-4 text-right font-mono font-bold text-gray-800">{formatPKR(calc.gratuity)}</td>
                            </tr>
                            {showGratuityWorkings && (
                              <tr className="bg-gray-50 animate-in slide-in-from-top-2">
                                 <td colSpan={2} className="px-10 py-4 text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                                    Logic: Last Basic (85K) x Service (4.5Y) x Gratuity Rule (15 Days/Y) = {formatPKR(calc.gratuity)}
                                 </td>
                              </tr>
                            )}
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-600">Pending Reimbursements</td><td className="px-6 py-4 text-right font-mono font-bold text-gray-800">{formatPKR(calc.reimb)}</td></tr>
                         </tbody>
                         <tfoot className="bg-green-50 font-black">
                            <tr><td className="px-6 py-4 text-green-700 uppercase text-[10px]">Total Earnings</td><td className="px-6 py-4 text-right text-green-700 font-mono text-lg">{formatPKR(calc.earnings)}</td></tr>
                         </tfoot>
                      </table>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                     <MinusCircle size={16} className="text-red-600" /> Settlement Deductions (-)
                   </h3>
                   <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                         <tbody className="divide-y divide-gray-50 font-medium">
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-600">Notice Period Recovery</td><td className="px-6 py-4 text-right font-mono font-bold text-gray-800">{formatPKR(calc.noticeRec)}</td></tr>
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-600">Outstanding Loan Balance</td><td className="px-6 py-4 text-right font-mono font-bold text-red-500">-{formatPKR(calc.loanBal)}</td></tr>
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-600">Final Income Tax (Adj)</td><td className="px-6 py-4 text-right font-mono font-bold text-red-500">-{formatPKR(calc.tax)}</td></tr>
                         </tbody>
                         <tfoot className="bg-red-50 font-black">
                            <tr><td className="px-6 py-4 text-red-700 uppercase text-[10px]">Total Deductions</td><td className="px-6 py-4 text-right text-red-700 font-mono text-lg">{formatPKR(calc.deductions)}</td></tr>
                         </tfoot>
                      </table>
                   </div>
                   <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Final Net Settlement</p>
                         <h4 className="text-3xl font-black text-accent leading-none">{formatPKR(calc.net)}</h4>
                      </div>
                      <Calculator size={32} className="text-accent/20" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: CLEARANCE */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Departmental Clearance Checklist</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase hover:bg-primary/10 transition-all">
                   <Bell size={14} /> Send Reminder to Depts
                </button>
             </div>
             <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead>
                      <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                         <th className="px-6 py-4">Department</th>
                         <th className="px-6 py-4 text-center">Status</th>
                         <th className="px-6 py-4">Cleared By</th>
                         <th className="px-6 py-4">Timestamp</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 font-medium">
                      {[
                        { dept: 'IT / Assets', status: 'CLEARED', by: 'Mustafa Kamal', time: 'Jan 10, 2025' },
                        { dept: 'Finance / Loans', status: 'PENDING', by: '--', time: '--' },
                        { dept: 'HR / Documents', status: 'CLEARED', by: 'Zainab Siddiqui', time: 'Jan 12, 2025' },
                        { dept: 'Department Head', status: 'CLEARED', by: 'Arsalan Khan', time: 'Jan 11, 2025' },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                           <td className="px-6 py-4 font-bold text-gray-700">{item.dept}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border shadow-sm ${
                                item.status === 'CLEARED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                              }`}>{item.status}</span>
                           </td>
                           <td className="px-6 py-4 text-gray-600 font-bold">{item.by}</td>
                           <td className="px-6 py-4 text-gray-400 font-mono text-xs">{item.time}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Handed-over Company Assets</h3>
                <div className="grid grid-cols-3 gap-6">
                   {[
                     { label: 'Laptop', id: 'TAG-IT-9922', status: 'Received' },
                     { label: 'Access Card', id: 'TAG-ADM-012', status: 'Received' },
                     { label: 'Fuel Card', id: 'TAG-FIN-881', status: 'Blocked' }
                   ].map((a, i) => (
                     <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Building2 size={16} className="text-primary/40" />
                           <div>
                              <p className="text-xs font-bold text-gray-700">{a.label}</p>
                              <p className="text-[9px] text-gray-400 font-mono">{a.id}</p>
                           </div>
                        </div>
                        <CheckCircle2 size={16} className="text-green-500" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* STEP 4: APPROVE */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Review & Authorization</h3>
                   <div className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                      <div className="relative">
                         <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-white shadow-sm z-10"><Check size={12}/></div>
                         <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase">Initiated By</p>
                            <p className="text-sm font-bold text-gray-700">Jane Doe (You)</p>
                            <p className="text-[10px] text-gray-400">System Log: Automated F&F calculation applied.</p>
                         </div>
                      </div>
                      <div className="relative opacity-50 grayscale">
                         <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-gray-200 z-10"></div>
                         <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase">HR Audit</p>
                            <p className="text-sm font-bold text-gray-700">Zainab Siddiqui</p>
                            <p className="text-[10px] text-gray-400 italic">Waiting for submission...</p>
                         </div>
                      </div>
                      <div className="relative opacity-50 grayscale">
                         <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-gray-200 z-10"></div>
                         <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase">Finance Approval</p>
                            <p className="text-sm font-bold text-gray-700">M. Ahmed Raza</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-500">Approver Notes</label>
                      <textarea rows={4} className="w-full p-4 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 h-32 resize-none" placeholder="Add justification for special payments or deductions..." />
                   </div>
                   <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                      <FileText size={16} /> Attach Exit Interview
                   </button>
                </div>
             </div>
             <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><Info size={24}/></div>
                   <p className="text-sm font-bold text-primary">Calculation verified against FBR Slab Jan 2025.</p>
                </div>
                <button 
                  onClick={() => setCurrentStep(5)}
                  className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
                >
                   Submit for Sign-off <Send size={16} />
                </button>
             </div>
          </div>
        )}

        {/* STEP 5: PAY & CLOSE */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Payment Gateway</h3>
                   <div className="bg-white p-6 rounded-2xl border-2 border-primary shadow-xl space-y-6 relative overflow-hidden">
                      <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12"><Landmark size={80}/></div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase">HBL Account Transfer</p>
                         <p className="text-lg font-black text-primary">PKR **** 7890</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase">Settlement Amount</p>
                         <h3 className="text-3xl font-black text-gray-800">{formatPKR(calc.net)}</h3>
                      </div>
                      <button className="w-full py-4 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                         <CreditCard size={18} /> Mark as Paid
                      </button>
                   </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Final Documentation</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'F&F Statement', icon: FileText, size: '2.1 MB', action: () => setIsPreviewOpen(true) },
                        { label: 'Experience Certificate', icon: Award, size: '1.4 MB' },
                        { label: 'Service Letter', icon: FileText, size: '1.1 MB' },
                        { label: 'Policy Clearance', icon: ShieldCheck, size: '0.8 MB' },
                      ].map((doc, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-primary/20 transition-all">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                 <doc.icon size={16} />
                              </div>
                              <button onClick={doc.action} className="text-left">
                                 <p className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors">{doc.label}</p>
                                 <p className="text-[9px] text-gray-400 font-mono">{doc.size}</p>
                              </button>
                           </div>
                           <div className="flex gap-1">
                              {doc.action && (
                                <button onClick={doc.action} className="p-1.5 text-gray-300 hover:text-primary transition-colors">
                                   <Eye size={16} />
                                </button>
                              )}
                              <button className="p-1.5 text-gray-300 hover:text-primary transition-colors"><Download size={16}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                      <div>
                         <h4 className="text-sm font-bold text-indigo-900 leading-tight">Bundle for ESS Portal</h4>
                         <p className="text-xs text-indigo-700">Digital copies will be available to Umar Jafri for 60 days.</p>
                      </div>
                      <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700">Publish Pack</button>
                   </div>
                </div>
             </div>
             
             <div className="pt-8 border-t flex justify-center">
                <button 
                  onClick={onComplete}
                  className="px-16 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-3 active:scale-95"
                >
                   Archive & Close Settlement <Check size={20} />
                </button>
             </div>
          </div>
        )}

        {/* Footer Actions */}
        {currentStep < 4 && (
          <div className="mt-10 pt-8 border-t flex items-center justify-between">
            <button 
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((currentStep - 1) as Step)}
              className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex gap-4">
              <button 
                onClick={onCancel}
                className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Save Draft
              </button>
              <button 
                onClick={() => setCurrentStep((currentStep + 1) as Step)}
                className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* F&F Statement Preview Modal */}
      <FullFinalStatement isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
};
