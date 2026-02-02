
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Save, Rocket, Plus, GripVertical, Trash2, 
  Settings2, Eye, History, ChevronDown, Calculator,
  Wallet, MinusCircle, HandCoins, Info, TrendingUp,
  // Fix: Added missing Layers icon
  Layers
} from 'lucide-react';

interface ComponentRow {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION' | 'CONTRIBUTION';
  calculation: 'FIXED' | 'PERC_BASIC' | 'PERC_GROSS' | 'STATUTORY';
  value: number;
}

export const SalaryTemplateBuilder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [templateName, setTemplateName] = useState('Standard Senior Management');
  const [templateCode, setTemplateCode] = useState('SSM-2025');
  const [baseGross, setBaseGross] = useState(250000);
  
  const [components, setComponents] = useState<ComponentRow[]>([
    { id: '1', name: 'Basic Salary', type: 'EARNING', calculation: 'PERC_GROSS', value: 50 },
    { id: '2', name: 'House Rent Allowance', type: 'EARNING', calculation: 'PERC_BASIC', value: 45 },
    { id: '3', name: 'Utilities Allowance', type: 'EARNING', calculation: 'PERC_BASIC', value: 10 },
    { id: '4', name: 'Income Tax', type: 'DEDUCTION', calculation: 'STATUTORY', value: 0 },
    { id: '5', name: 'PF Employee', type: 'DEDUCTION', calculation: 'PERC_BASIC', value: 8.33 },
    { id: '6', name: 'PF Employer', type: 'CONTRIBUTION', calculation: 'PERC_BASIC', value: 8.33 },
  ]);

  // Real-time calculation engine
  const calculatedData = useMemo(() => {
    let basic = 0;
    const items = components.map(c => {
      let amount = 0;
      if (c.name === 'Basic Salary') {
        amount = (baseGross * c.value) / 100;
        basic = amount;
      } else if (c.calculation === 'PERC_BASIC') {
        amount = (basic * c.value) / 100;
      } else if (c.calculation === 'PERC_GROSS') {
        amount = (baseGross * c.value) / 100;
      } else if (c.calculation === 'STATUTORY') {
        // Mock statutory for income tax
        amount = baseGross > 100000 ? (baseGross - 100000) * 0.15 : 0;
      } else {
        amount = c.value;
      }
      return { ...c, amount };
    });

    const totalEarnings = items.filter(i => i.type === 'EARNING').reduce((a, b) => a + b.amount, 0);
    const totalDeductions = items.filter(i => i.type === 'DEDUCTION').reduce((a, b) => a + b.amount, 0);
    const netSalary = totalEarnings - totalDeductions;

    return { items, totalEarnings, totalDeductions, netSalary };
  }, [components, baseGross]);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Salary Template Builder</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{templateCode}</span>
              <span className="text-xs text-gray-400 font-medium tracking-tight italic">Last edited 2 mins ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
            <Save size={16} /> Save Draft
          </button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
            <Rocket size={16} /> Publish Version
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor (60%) */}
        <div className="w-[60%] overflow-y-auto p-8 bg-white border-r custom-scrollbar">
          <div className="space-y-8 max-w-4xl">
            {/* Header Info */}
            <section className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Template Name</label>
                <input 
                  type="text" 
                  value={templateName} 
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Target Grade</label>
                <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none">
                  <option>Grade 18 - Senior Lead</option>
                  <option>Grade 19 - Director</option>
                  <option>Grade 20 - VP / C-Suite</option>
                </select>
              </div>
            </section>

            {/* Components Editor */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <Layers size={16} /> Structure Elements
                </h3>
                <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline">
                  <Plus size={14} /> Add Component
                </button>
              </div>

              {/* Component Groups */}
              {(['EARNING', 'DEDUCTION', 'CONTRIBUTION'] as const).map(groupType => (
                <div key={groupType} className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2">
                    {groupType === 'EARNING' && <Wallet size={12} className="text-payroll-earning" />}
                    {groupType === 'DEDUCTION' && <MinusCircle size={12} className="text-payroll-deduction" />}
                    {groupType === 'CONTRIBUTION' && <HandCoins size={12} className="text-payroll-contribution" />}
                    <span className={
                      groupType === 'EARNING' ? 'text-payroll-earning' : 
                      groupType === 'DEDUCTION' ? 'text-payroll-deduction' : 
                      'text-payroll-contribution'
                    }>
                      {groupType}S
                    </span>
                  </div>
                  
                  <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                        <tr>
                          <th className="px-4 py-3 w-8"></th>
                          <th className="px-4 py-3">Component</th>
                          <th className="px-4 py-3">Calculation</th>
                          <th className="px-4 py-3 text-right">Rate/Value</th>
                          <th className="px-4 py-3 text-right w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {components.filter(c => c.type === groupType).map(comp => (
                          <tr key={comp.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-4 py-3 cursor-grab"><GripVertical size={14} className="text-gray-300" /></td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold text-gray-700">{comp.name}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                {comp.calculation.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-mono font-black text-gray-800">
                                {comp.calculation === 'STATUTORY' ? '--' : `${comp.value}${comp.calculation.includes('PERC') ? '%' : ''}`}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1  transition-opacity">
                                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded"><Settings2 size={14} /></button>
                                <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Version History Accordion */}
            <div className="pt-8 border-t">
              <button className="flex items-center justify-between w-full group">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <History size={16} /> Version History
                </h3>
                <ChevronDown size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
              </button>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-primary">V2.1</span>
                    <div>
                      <p className="text-xs font-bold text-gray-700 text-left">Adjusted HRA to 45% as per 2024 policy</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Jan 02, 2025 • Admin User</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-primary uppercase">Restore</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview (40%) */}
        <div className="w-[40%] bg-bgMain p-8 overflow-y-auto border-l shadow-inner custom-scrollbar">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Eye size={16} /> Real-time Preview
              </h3>
              <div className="flex items-center gap-2 px-2 py-1 bg-white rounded border border-gray-200 text-[10px] font-bold text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Sync Active
              </div>
            </div>

            {/* Gross Payout Slider */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Target Monthly Gross</p>
                  <h4 className="text-2xl font-black text-primary">{formatPKR(baseGross)}</h4>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl text-primary">
                  <TrendingUp size={24} />
                </div>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="1000000" 
                step="5000" 
                value={baseGross} 
                onChange={(e) => setBaseGross(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] font-black text-gray-300 uppercase">
                <span>50K</span>
                <span>250K</span>
                <span>500K</span>
                <span>750K</span>
                <span>1M</span>
              </div>
            </div>

            {/* Mock Payslip Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold tracking-tight">Provisional Payslip</h5>
                  <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded uppercase border border-white/5 tracking-widest">Jan 2025</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase mb-1">Estimated Net Payout</p>
                    <p className="text-3xl font-black text-accent leading-none">{formatPKR(calculatedData.netSalary)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/50 uppercase mb-1">CTC Impact</p>
                    <p className="text-lg font-bold text-white/90">{formatPKR(baseGross + calculatedData.items.filter(i => i.type === 'CONTRIBUTION').reduce((a, b) => a + b.amount, 0))}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Earnings */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-payroll-earning uppercase tracking-widest border-b border-payroll-earning/10 pb-1">Earnings</p>
                    {calculatedData.items.filter(i => i.type === 'EARNING').map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">{item.name}</span>
                        <span className="font-mono font-bold text-gray-800">{formatPKR(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-xs pt-2 border-t font-bold text-gray-800">
                      <span>Total Gross</span>
                      <span className="font-mono">{formatPKR(calculatedData.totalEarnings)}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-payroll-deduction uppercase tracking-widest border-b border-payroll-deduction/10 pb-1">Deductions</p>
                    {calculatedData.items.filter(i => i.type === 'DEDUCTION').map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">{item.name}</span>
                        <span className="font-mono font-bold text-payroll-deduction">-{formatPKR(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-xs pt-2 border-t font-bold text-gray-800">
                      <span>Total Deducts</span>
                      <span className="font-mono">-{formatPKR(calculatedData.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-xl flex items-start gap-3">
                  <Info size={16} className="text-primary mt-0.5" />
                  <p className="text-[10px] text-primary/70 font-medium leading-relaxed uppercase tracking-tight italic">
                    Note: This is a system-generated simulation based on current tax slabs (2024-25). Actual payout may vary based on exact attendance and reimbursement claims.
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
