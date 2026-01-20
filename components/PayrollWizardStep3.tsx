
import React, { useState, useEffect } from 'react';
import { 
  Check, ArrowLeft, ArrowRight, AlertCircle, 
  XCircle, AlertTriangle, CheckCircle2, Search,
  Filter, Download, Mail, ExternalLink, User,
  Landmark, Calculator, ShieldAlert, Clock, Info,
  /* Added missing icon import */
  ChevronRight
} from 'lucide-react';

interface PayrollWizardStep3Props {
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Select' },
  { id: 2, label: 'Ingest' },
  { id: 3, label: 'Validate' },
  { id: 4, label: 'Exceptions' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Approve' },
  { id: 7, label: 'Finalize' }
];

interface ExceptionGroup {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING';
  count: number;
  icon: any;
  description: string;
  employees: { id: string, name: string, detail: string }[];
  actionLabel: string;
}

const EXCEPTION_GROUPS: ExceptionGroup[] = [
  {
    id: 'bank',
    title: 'Missing Bank Details',
    severity: 'CRITICAL',
    count: 3,
    icon: Landmark,
    description: 'Employees without primary bank accounts for disbursement.',
    employees: [
      { id: 'EMP-1003', name: 'Umar Farooq', detail: 'No HBL/SCB mapping' },
      { id: 'EMP-1102', name: 'Sara Khan', detail: 'Incomplete IBAN' },
      { id: 'EMP-1145', name: 'Bilal Ahmed', detail: 'Account inactive' }
    ],
    actionLabel: 'Fix Account'
  },
  {
    id: 'negative',
    title: 'Negative Net Risk',
    severity: 'CRITICAL',
    count: 2,
    icon: ShieldAlert,
    description: 'Deductions exceeding gross pay components.',
    employees: [
      { id: 'EMP-1089', name: 'Hassan Raza', detail: 'Loan EMI exceeds net by 5k' },
      { id: 'EMP-1201', name: 'Ayesha Malik', detail: 'Multiple recoveries active' }
    ],
    actionLabel: 'Adjust Deducts'
  },
  {
    id: 'statutory',
    title: 'Missing Statutory ID',
    severity: 'CRITICAL',
    count: 2,
    icon: XCircle,
    description: 'Mandatory NTN or EOBI numbers missing for tax filing.',
    employees: [
      { id: 'EMP-1003', name: 'Umar Farooq', detail: 'Missing NTN' },
      { id: 'EMP-1256', name: 'Zohaib Ali', detail: 'EOBI Unverified' }
    ],
    actionLabel: 'Complete Profile'
  },
  {
    id: 'attendance',
    title: 'Attendance Mismatch',
    severity: 'WARNING',
    count: 3,
    icon: Clock,
    description: 'Work days vs leave balance discrepancies detected.',
    employees: [
      { id: 'EMP-1011', name: 'Fatima Noor', detail: 'LWP days unaligned' },
      { id: 'EMP-1022', name: 'Kamran Shah', detail: 'Excess OT flagged' },
      { id: 'EMP-1033', name: 'Nadia Gul', detail: 'Manual override used' }
    ],
    actionLabel: 'Verify Days'
  },
  {
    id: 'unusual',
    title: 'Unusual Amounts',
    severity: 'WARNING',
    count: 5,
    icon: AlertTriangle,
    description: 'Payout variance > 25% compared to Dec 2024.',
    employees: [
      { id: 'EMP-1005', name: 'Mustafa Kamal', detail: 'Bonus + Incentive impact' },
      { id: 'EMP-1044', name: 'Raza Jafri', detail: 'Shift allowance delta' },
      { id: 'EMP-1055', name: 'Sana Zehra', detail: 'Grade change effect' },
      { id: 'EMP-1066', name: 'Ali Hamza', detail: 'Arrears added' },
      { id: 'EMP-1077', name: 'Maria B.', detail: 'Reimbursement peak' }
    ],
    actionLabel: 'Preview Payslip'
  }
];

export const PayrollWizardStep3: React.FC<PayrollWizardStep3Props> = ({ onNext, onBack, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('bank');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsValidating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = EXCEPTION_GROUPS.filter(g => g.severity === 'CRITICAL').reduce((a, b) => a + b.count, 0);
  const warningCount = EXCEPTION_GROUPS.filter(g => g.severity === 'WARNING').reduce((a, b) => a + b.count, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Wizard Header & Steps */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 3 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  step.id < 3 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step.id < 3 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 3 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-4 mt-[-18px] ${step.id < 3 ? 'bg-green-500' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Validation Progress */}
        {isValidating ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center animate-pulse">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 * (1 - progress / 100)}
                  className="text-primary transition-all duration-500 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Calculator size={32} className="text-primary" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-800 tracking-tight">Validating Payroll Rules...</h4>
              <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Checking 485 profiles against FBR Slabs 2024-25</p>
            </div>
            <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-100 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Passed Validation</p>
                  <h5 className="text-2xl font-black text-green-800">310 <span className="text-sm font-bold opacity-60">/ 325</span></h5>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">System Warnings</p>
                  <h5 className="text-2xl font-black text-orange-800">{warningCount} <span className="text-sm font-bold opacity-60">Manual Review</span></h5>
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-200">
                  <XCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Critical Blocks</p>
                  <h5 className="text-2xl font-black text-red-800">{criticalCount} <span className="text-sm font-bold opacity-60">Requires Action</span></h5>
                </div>
              </div>
            </div>

            {/* Exceptions UI */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <AlertCircle size={16} className="text-primary" /> Run Exceptions
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-black uppercase text-gray-600 transition-all">Ignore Warnings</button>
                  <button className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-lg text-[10px] font-black uppercase text-primary transition-all flex items-center gap-1.5">
                    <Download size={12} /> Export All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Exception Categories */}
                <div className="lg:col-span-4 space-y-3">
                  {EXCEPTION_GROUPS.map(group => (
                    <button
                      key={group.id}
                      onClick={() => setExpandedGroup(group.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                        expandedGroup === group.id 
                        ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                        : 'bg-white border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          expandedGroup === group.id 
                          ? 'bg-white/10 text-white' 
                          : group.severity === 'CRITICAL' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                        }`}>
                          <group.icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">{group.title}</p>
                          <p className={`text-[9px] mt-1 font-black uppercase tracking-tighter ${
                             expandedGroup === group.id ? 'text-white/60' : 'text-gray-400'
                          }`}>
                            {group.count} Employees Affected
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={expandedGroup === group.id ? 'text-white' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>

                {/* Right: Resolution Workspace */}
                <div className="lg:col-span-8 bg-gray-50/50 rounded-2xl border border-gray-100 p-6 min-h-[400px] flex flex-col">
                  {expandedGroup ? (
                    <div className="space-y-6 flex-1 flex flex-col animate-in slide-in-from-right-2 duration-300">
                      {/* Group Header */}
                      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <h4 className="text-lg font-black text-gray-800">{EXCEPTION_GROUPS.find(g => g.id === expandedGroup)?.title}</h4>
                             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                               EXCEPTION_GROUPS.find(g => g.id === expandedGroup)?.severity === 'CRITICAL' 
                               ? 'bg-red-50 text-red-600 border-red-100' 
                               : 'bg-orange-50 text-orange-600 border-orange-100'
                             }`}>
                               {EXCEPTION_GROUPS.find(g => g.id === expandedGroup)?.severity}
                             </span>
                          </div>
                          <p className="text-xs text-gray-500 italic">{EXCEPTION_GROUPS.find(g => g.id === expandedGroup)?.description}</p>
                        </div>
                        <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline uppercase tracking-widest">
                          <Mail size={14} /> Notify Managers
                        </button>
                      </div>

                      {/* Employee Table */}
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex-1">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              <th className="px-4 py-3">Employee</th>
                              <th className="px-4 py-3">Exception Detail</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {EXCEPTION_GROUPS.find(g => g.id === expandedGroup)?.employees.map(emp => (
                              <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-[10px]">{emp.name.charAt(0)}</div>
                                    <div>
                                      <p className="font-bold text-gray-700">{emp.name}</p>
                                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{emp.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-red-500 bg-red-50/20">
                                   {emp.detail}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button className="px-3 py-1 bg-primary text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm">
                                    {EXCEPTION_GROUPS.find(g => g.id === expandedGroup)?.actionLabel}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-xl flex items-start gap-3">
                        <Info size={16} className="text-primary mt-0.5 shrink-0" />
                        <p className="text-[10px] text-primary/70 font-medium leading-relaxed uppercase tracking-tight">
                          <strong>Bulk Resolve Policy:</strong> Changes made here will update the 2025-01 run specifically. To update permanent master data, use the <span className="underline cursor-pointer font-bold">Employee Pay Profiles</span> module.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest opacity-40">Select a category to resolve</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Final Action Block */}
            <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
              criticalCount > 0 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-green-50 border-green-100 text-green-900'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${criticalCount > 0 ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                  {criticalCount > 0 ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h5 className="font-black text-lg">
                    {criticalCount > 0 
                      ? `${criticalCount} Critical Exceptions Remaining` 
                      : 'Validation Checks Complete'}
                  </h5>
                  <p className="text-sm opacity-70">
                    {criticalCount > 0 
                      ? 'You must resolve all critical blocks before proceeding to the review phase.' 
                      : 'All critical parameters verified. Warnings can be reviewed later.'}
                  </p>
                </div>
              </div>
              {criticalCount > 0 ? (
                 <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all flex items-center gap-2 uppercase tracking-widest">
                   Resolve Now <ArrowRight size={18} />
                 </button>
              ) : (
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 tracking-[2px]">
                    <CheckCircle2 size={16} /> Ready to Finalize
                 </div>
              )}
            </div>
          </div>
        )}

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
              Cancel
            </button>
            <button 
              disabled={isValidating || criticalCount > 0}
              onClick={onNext}
              className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Continue <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
