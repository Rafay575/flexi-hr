
import React, { useState } from 'react';
import { 
  Check, ArrowLeft, ArrowRight, Search, Filter, 
  Download, Users, Building2, Layers, AlertTriangle,
  TrendingUp, TrendingDown, ChevronDown, ChevronRight,
  PieChart, Wallet, MinusCircle, UserPlus, Zap, 
  ArrowUpRight, Info, ExternalLink, Mail
} from 'lucide-react';

interface PayrollWizardStep5Props {
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

type ReviewTab = 'EMPLOYEE' | 'DEPARTMENT' | 'COMPONENT' | 'VARIANCE';

export const PayrollWizardStep5: React.FC<PayrollWizardStep5Props> = ({ onNext, onBack, onCancel }) => {
  const [activeTab, setActiveTab] = useState<ReviewTab>('EMPLOYEE');
  const [search, setSearch] = useState('');
  const [expandedEmp, setExpandedEmp] = useState<string | null>(null);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const renderEmployeeView = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search name, ID or department..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Filter size={14} /> Filter: High Delta
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4 w-10"></th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Designation</th>
              <th className="px-6 py-4 text-right">Gross Pay</th>
              <th className="px-6 py-4 text-right">Net Payout</th>
              <th className="px-6 py-4 text-right">Delta (vs Dec)</th>
              <th className="px-6 py-4 text-center">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { id: 'EMP-1001', name: 'Arsalan Khan', desig: 'Sr. Lead', gross: 215000, net: 185000, delta: 35000, flags: ['INCREMENT', 'VARIANCE'] },
              { id: 'EMP-1105', name: 'Zainab Bibi', desig: 'Analyst', gross: 92000, net: 82000, delta: 0, flags: [] },
              { id: 'EMP-1240', name: 'Faisal Raza', desig: 'Manager', gross: 145000, net: 125000, delta: 145000, flags: ['NEW'] },
              { id: 'EMP-1088', name: 'Mustafa Kamal', desig: 'Director', gross: 550000, net: 420000, delta: 50000, flags: ['BONUS'] },
              { id: 'EMP-1199', name: 'Umar Jafri', desig: 'Specialist', gross: 110000, net: 95000, delta: -110000, flags: ['EXIT'] },
            ].map((emp) => (
              <React.Fragment key={emp.id}>
                <tr 
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedEmp === emp.id ? 'bg-primary/5' : ''}`}
                  onClick={() => setExpandedEmp(expandedEmp === emp.id ? null : emp.id)}
                >
                  <td className="px-6 py-4 text-center">
                    {expandedEmp === emp.id ? <ChevronDown size={16} className="text-primary" /> : <ChevronRight size={16} className="text-gray-300" />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{emp.name.charAt(0)}</div>
                       <div>
                         <p className="font-bold text-gray-800">{emp.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{emp.id}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{emp.desig}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">{formatPKR(emp.gross)}</td>
                  <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(emp.net)}</td>
                  <td className={`px-6 py-4 text-right font-bold text-xs ${emp.delta > 0 ? 'text-red-500' : emp.delta < 0 ? 'text-green-600' : 'text-gray-300'}`}>
                    {emp.delta > 0 ? `+${formatPKR(emp.delta)}` : emp.delta < 0 ? `-${formatPKR(Math.abs(emp.delta))}` : '--'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1">
                      {emp.flags.map(f => (
                        <span key={f} className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          f === 'NEW' ? 'bg-green-100 text-green-700' :
                          f === 'INCREMENT' ? 'bg-blue-100 text-blue-700' :
                          f === 'VARIANCE' ? 'bg-orange-100 text-orange-700' :
                          f === 'BONUS' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {f === 'NEW' && '🆕'}
                          {f === 'INCREMENT' && '🔄'}
                          {f === 'VARIANCE' && '⚠️'}
                          {f === 'BONUS' && '💰'}
                          {f === 'EXIT' && '📤'}
                          <span className="ml-1">{f}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                {expandedEmp === emp.id && (
                  <tr className="bg-white">
                    <td colSpan={7} className="px-12 py-6 border-b">
                       <div className="grid grid-cols-3 gap-8 animate-in slide-in-from-top-2">
                          <div className="space-y-2">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Earnings</p>
                             <div className="text-xs space-y-1.5">
                                <div className="flex justify-between"><span>Basic Salary</span><span className="font-mono font-bold">107,500</span></div>
                                <div className="flex justify-between"><span>Allowances</span><span className="font-mono font-bold">92,500</span></div>
                                <div className="flex justify-between text-primary font-bold pt-1 border-t"><span>Gross Total</span><span className="font-mono">{formatPKR(emp.gross)}</span></div>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Deductions</p>
                             <div className="text-xs space-y-1.5">
                                <div className="flex justify-between"><span>Income Tax</span><span className="font-mono font-bold text-red-500">-22,500</span></div>
                                <div className="flex justify-between"><span>PF Share</span><span className="font-mono font-bold text-red-500">-7,500</span></div>
                                <div className="flex justify-between text-red-600 font-bold pt-1 border-t"><span>Total Deducts</span><span className="font-mono">-30,000</span></div>
                             </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auditor's Note</p>
                             <p className="text-[11px] text-gray-600 italic leading-relaxed">
                                "Variance of 35K triggered by annual performance increment and adjusted HRA logic for 2025."
                             </p>
                             <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                               <ExternalLink size={10} /> View Full Pay Profile
                             </button>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDepartmentView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-300">
      <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-right">Headcount</th>
              <th className="px-6 py-4 text-right">Gross Total</th>
              <th className="px-6 py-4 text-right">Net Takehome</th>
              <th className="px-6 py-4 text-right">Cost Center</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { name: 'Engineering', count: 145, gross: 18500000, net: 15400000, cc: 'TECH-ISB-01' },
              { name: 'Operations', count: 112, gross: 12200000, net: 10100000, cc: 'OPS-KHI-45' },
              { name: 'Human Resources', count: 24, gross: 2800000, net: 2350000, cc: 'ADMIN-CORP' },
              { name: 'Finance & Legal', count: 18, gross: 3100000, net: 2600000, cc: 'ADMIN-CORP' },
              { name: 'Sales & Mktg', count: 26, gross: 4200000, net: 3500000, cc: 'GROWTH-PK' },
            ].map(dept => (
              <tr key={dept.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-700 flex items-center gap-2">
                   <Building2 size={16} className="text-gray-300" /> {dept.name}
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-500">{dept.count}</td>
                <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">{formatPKR(dept.gross)}</td>
                <td className="px-6 py-4 text-right font-mono font-black text-primary">{formatPKR(dept.net)}</td>
                <td className="px-6 py-4 text-right"><span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{dept.cc}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center">
           <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 w-full">Cost Distribution</h4>
           <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 rounded-full border-[16px] border-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-accent" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <p className="text-2xl font-black text-primary leading-none">45%</p>
                 <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Tech Dept</p>
              </div>
           </div>
           <div className="space-y-2 w-full">
              {[
                { label: 'Engineering', perc: '45%', color: 'bg-primary' },
                { label: 'Operations', perc: '30%', color: 'bg-accent' },
                { label: 'Others', perc: '25%', color: 'bg-gray-300' }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-[11px] font-bold">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <span className="text-gray-600">{item.label}</span>
                   </div>
                   <span className="text-gray-400">{item.perc}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderComponentView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-payroll-earning flex items-center gap-2">
          <Wallet size={14} /> Earnings Breakdown
        </h4>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-green-50/30 border-b text-[9px] font-black text-green-800 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Component</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">Total Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {[
                { name: 'Basic Salary', count: 325, total: 22500000 },
                { name: 'House Rent (HRA)', count: 325, total: 10125000 },
                { name: 'Utilities Allowance', count: 325, total: 2250000 },
                { name: 'Overtime Payments', count: 45, total: 580000 },
                { name: 'Special Incentives', count: 12, total: 150000 },
              ].map(c => (
                <tr key={c.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-700">{c.name}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{c.count} Staff</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-green-600">{formatPKR(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-payroll-deduction flex items-center gap-2">
          <MinusCircle size={14} /> Statutory & Recoveries
        </h4>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-red-50/30 border-b text-[9px] font-black text-red-800 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Component</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">Total Deducted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {[
                { name: 'Income Tax (FBR)', count: 285, total: 3500000 },
                { name: 'Provident Fund (EE)', count: 310, total: 2775000 },
                { name: 'Loan Installments', count: 45, total: 580000 },
                { name: 'EOBI (Employee)', count: 325, total: 100750 },
                { name: 'LWP Recoveries', count: 5, total: 45000 },
              ].map(c => (
                <tr key={c.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-700">{c.name}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{c.count} Staff</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-red-600">({formatPKR(c.total)})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVarianceView = () => (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="p-5 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-orange-900 leading-tight">High Variance Threshold Exceeded (10%)</h4>
          <p className="text-xs text-orange-700 mt-1 leading-relaxed">
            The following <strong>12 profiles</strong> show significant payout changes compared to the previous cycle. These require specific justifications before the run can be approved.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4 text-right">Dec Payout</th>
              <th className="px-6 py-4 text-right">Jan Payout</th>
              <th className="px-6 py-4 text-right">Variance %</th>
              <th className="px-6 py-4">Detected Primary Reason</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { name: 'Arsalan Khan', prev: 150000, curr: 185000, var: '+23.3%', reason: 'Annual Grade Increment (G17 > G18)', confirmed: true },
              { name: 'Zohaib Ali', prev: 82000, curr: 105000, var: '+28.0%', reason: 'Special Project Bonus Payment', confirmed: true },
              { name: 'Sara Malik', prev: 75000, curr: 62000, var: '-17.3%', reason: '8 Days LWP (Unpaid Leaves)', confirmed: false },
              { name: 'Kamran Shah', prev: 120000, curr: 145000, var: '+20.8%', reason: 'Adjustment for Dec OT Arrears', confirmed: true },
            ].map(item => (
              <tr key={item.name} className="hover:bg-gray-50 group">
                <td className="px-6 py-4 font-bold text-gray-700">{item.name}</td>
                <td className="px-6 py-4 text-right text-gray-500">{formatPKR(item.prev)}</td>
                <td className="px-6 py-4 text-right font-black text-primary">{formatPKR(item.curr)}</td>
                <td className={`px-6 py-4 text-right font-black ${item.var.includes('+') ? 'text-red-500' : 'text-green-600'}`}>{item.var}</td>
                <td className="px-6 py-4 font-medium text-gray-600 italic text-xs">{item.reason}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {item.confirmed ? (
                       <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase"><Check size={12}/> OK</div>
                    ) : (
                       <button className="px-2 py-1 bg-primary text-white rounded text-[9px] font-black uppercase shadow-sm active:scale-95">Review</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Wizard Header & Steps */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 5 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  step.id < 5 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step.id < 5 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 5 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-4 mt-[-18px] ${step.id < 5 ? 'bg-green-500' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Post-Calculation Review</h2>
              <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">Verify multi-dimensional payout reports</p>
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                 <Download size={14} /> Export Full Review
              </button>
              <button className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                 <Mail size={14} /> Share for Sign-off
              </button>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 w-fit rounded-xl border border-gray-200 mb-8">
          {[
            { id: 'EMPLOYEE', label: 'By Employee', icon: Users },
            { id: 'DEPARTMENT', label: 'By Department', icon: Building2 },
            { id: 'COMPONENT', label: 'By Component', icon: Layers },
            { id: 'VARIANCE', label: 'High Variance', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ReviewTab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[500px]">
           {activeTab === 'EMPLOYEE' && renderEmployeeView()}
           {activeTab === 'DEPARTMENT' && renderDepartmentView()}
           {activeTab === 'COMPONENT' && renderComponentView()}
           {activeTab === 'VARIANCE' && renderVarianceView()}
        </div>

        {/* Informational Toast */}
        <div className="mt-10 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4">
           <Info size={20} className="text-primary mt-0.5" />
           <div className="space-y-1">
              <p className="text-[10px] text-primary/70 font-medium leading-relaxed uppercase tracking-tight italic">
                <strong>Review Policy:</strong> This phase is for visualization only. Any structural changes discovered here must be corrected via the <span className="font-bold underline cursor-pointer">Employee Pay Profiles</span> module, followed by a recalculation in Step 4.
              </p>
           </div>
        </div>

        {/* Action Bar */}
        <div className="mt-10 pt-8 border-t flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Calculate
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
              Final Submission <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
