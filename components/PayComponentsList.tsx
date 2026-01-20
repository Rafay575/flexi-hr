
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  CheckCircle2, XCircle, Calculator, 
  Wallet, MinusCircle, ShieldCheck, 
  HandCoins, Zap, ChevronDown
} from 'lucide-react';
import { EarningComponentForm } from './EarningComponentForm';
import { DeductionComponentForm } from './DeductionComponentForm';
import { ContributionComponentForm } from './ContributionComponentForm';

type ComponentType = 'EARNING' | 'DEDUCTION' | 'CONTRIBUTION' | 'TAX' | 'REIMBURSEMENT';

interface PayComponent {
  code: string;
  name: string;
  type: ComponentType;
  calculation: string;
  frequency: 'Monthly' | 'Annual' | 'Ad-hoc';
  taxable: boolean;
  status: 'Active' | 'Inactive';
  flags: {
    otBase?: boolean;
    gratuity?: boolean;
    pf?: boolean;
    eobi?: boolean;
  };
}

const TYPE_CONFIG: Record<ComponentType, { color: string; bg: string; icon: any; label: string }> = {
  EARNING: { label: 'Earnings', color: 'text-payroll-earning', bg: 'bg-payroll-earning/10', icon: Wallet },
  DEDUCTION: { label: 'Deductions', color: 'text-payroll-deduction', bg: 'bg-payroll-deduction/10', icon: MinusCircle },
  CONTRIBUTION: { label: 'Contributions', color: 'text-payroll-contribution', bg: 'bg-payroll-contribution/10', icon: HandCoins },
  TAX: { label: 'Tax', color: 'text-payroll-tax', bg: 'bg-payroll-tax/10', icon: ShieldCheck },
  REIMBURSEMENT: { label: 'Reimbursements', color: 'text-payroll-reimbursement', bg: 'bg-payroll-reimbursement/10', icon: Zap },
};

const MOCK_COMPONENTS: PayComponent[] = [
  { code: 'B001', name: 'Basic Salary', type: 'EARNING', calculation: 'Fixed', frequency: 'Monthly', taxable: true, status: 'Active', flags: { otBase: true, gratuity: true, pf: true, eobi: true } },
  { code: 'H002', name: 'House Rent Allowance', type: 'EARNING', calculation: '45% of Basic', frequency: 'Monthly', taxable: false, status: 'Active', flags: { gratuity: true } },
  { code: 'U003', name: 'Utilities Allowance', type: 'EARNING', calculation: '10% of Basic', frequency: 'Monthly', taxable: true, status: 'Active', flags: {} },
  { code: 'T004', name: 'Income Tax', type: 'TAX', calculation: 'FBR Slabs 2024-25', frequency: 'Monthly', taxable: false, status: 'Active', flags: {} },
  { code: 'P005', name: 'Provident Fund (Employee)', type: 'DEDUCTION', calculation: '8.33% of Basic', frequency: 'Monthly', taxable: false, status: 'Active', flags: { pf: true } },
  { code: 'P006', name: 'Provident Fund (Company)', type: 'CONTRIBUTION', calculation: '8.33% of Basic', frequency: 'Monthly', taxable: false, status: 'Active', flags: { pf: true } },
  { code: 'E007', name: 'EOBI (Employee)', type: 'DEDUCTION', calculation: 'Fixed (PKR 180)', frequency: 'Monthly', taxable: false, status: 'Active', flags: { eobi: true } },
  { code: 'E008', name: 'EOBI (Company)', type: 'CONTRIBUTION', calculation: 'Fixed (PKR 540)', frequency: 'Monthly', taxable: false, status: 'Active', flags: { eobi: true } },
  { code: 'M009', name: 'Fuel Reimbursement', type: 'REIMBURSEMENT', calculation: 'Limit vs Actual', frequency: 'Ad-hoc', taxable: false, status: 'Active', flags: {} },
  { code: 'C010', name: 'Conveyance Allowance', type: 'EARNING', calculation: 'Fixed', frequency: 'Monthly', taxable: true, status: 'Active', flags: { gratuity: true } },
  { code: 'O011', name: 'Overtime Payment', type: 'EARNING', calculation: '2.0x Hourly', frequency: 'Monthly', taxable: true, status: 'Active', flags: { otBase: true } },
  { code: 'L012', name: 'Loan Recovery', type: 'DEDUCTION', calculation: 'Installment', frequency: 'Monthly', taxable: false, status: 'Active', flags: {} },
  { code: 'G013', name: 'Gratuity Provision', type: 'CONTRIBUTION', calculation: '15 Days Basic', frequency: 'Annual', taxable: false, status: 'Active', flags: { gratuity: true } },
];

export const PayComponentsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | ComponentType>('ALL');
  const [search, setSearch] = useState('');
  const [isEarningFormOpen, setIsEarningFormOpen] = useState(false);
  const [isDeductionFormOpen, setIsDeductionFormOpen] = useState(false);
  const [isContributionFormOpen, setIsContributionFormOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const stats = {
    TOTAL: 45,
    EARNING: 18,
    DEDUCTION: 12,
    CONTRIBUTION: 6,
    TAX: 4,
    REIMBURSEMENT: 5
  };

  const filteredComponents = MOCK_COMPONENTS.filter(c => {
    const matchesTab = activeTab === 'ALL' || c.type === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Pay Components</h2>
          <p className="text-sm text-gray-500">Define rule-based earnings, deductions, and statutory funds</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Component <ChevronDown size={14} className={`transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isAddMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsAddMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-40 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setIsEarningFormOpen(true); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-payroll-earning/10 hover:text-payroll-earning transition-colors"
                >
                  <Wallet size={16} /> New Earning
                </button>
                <button 
                  onClick={() => { setIsDeductionFormOpen(true); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-payroll-deduction/10 hover:text-payroll-deduction transition-colors"
                >
                  <MinusCircle size={16} /> New Deduction
                </button>
                <button 
                  onClick={() => { setIsContributionFormOpen(true); setIsAddMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-payroll-contribution/10 hover:text-payroll-contribution transition-colors"
                >
                  <HandCoins size={16} /> New Contribution
                </button>
                <div className="h-[1px] bg-gray-100 my-1" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed">
                  <Zap size={16} /> Reimbursement (Auto)
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(Object.keys(stats) as Array<keyof typeof stats>).map((key) => {
          const config = key === 'TOTAL' ? { bg: 'bg-white', text: 'text-gray-800', label: 'All Components' } : { bg: TYPE_CONFIG[key as ComponentType].bg, text: TYPE_CONFIG[key as ComponentType].color, label: TYPE_CONFIG[key as ComponentType].label };
          return (
            <div key={key} className={`${config.bg} p-6 rounded-lg shadow-md border border-gray-100 flex flex-col justify-center`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${config.text} opacity-70 mb-1`}>{config.label}</p>
              <h4 className={`text-2xl font-black ${config.text}`}>{stats[key]}</h4>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b space-y-4 bg-white sticky top-0 z-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto">
              <button onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>All</button>
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as ComponentType)}
                  className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === key ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 flex-1 min-w-[300px] md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search code or component name..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 flex items-center gap-2 text-xs font-bold uppercase">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b sticky-header">
                <th className="px-6 py-5">Code</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Calculation</th>
                <th className="px-6 py-5">Frequency</th>
                <th className="px-6 py-5 text-center">Taxable</th>
                <th className="px-6 py-5 text-center">Impact Flags</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredComponents.map((item) => {
                const config = TYPE_CONFIG[item.type];
                return (
                  <tr key={item.code} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-gray-400">{item.code}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded font-black text-[9px] uppercase tracking-tighter ${config.bg} ${config.color}`}>
                        <config.icon size={10} />
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calculator size={14} className="text-gray-300" />
                        {item.calculation}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {item.frequency}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.taxable ? (
                        <CheckCircle2 size={18} className="text-status-approved mx-auto" />
                      ) : (
                        <XCircle size={18} className="text-gray-200 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <FlagIcon active={item.flags.otBase} label="OT" title="Affects OT Base" color="bg-orange-100 text-orange-600" />
                        <FlagIcon active={item.flags.gratuity} label="GR" title="Affects Gratuity" color="bg-blue-100 text-blue-600" />
                        <FlagIcon active={item.flags.pf} label="PF" title="Affects Provident Fund" color="bg-indigo-100 text-indigo-600" />
                        <FlagIcon active={item.flags.eobi} label="EB" title="Affects EOBI" color="bg-green-100 text-green-600" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 hover:text-primary hover:bg-gray-100 rounded-md transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs font-bold text-gray-400">
          <p className="uppercase tracking-widest">Showing {filteredComponents.length} of {stats.TOTAL} components</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-500 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-primary">Next</button>
          </div>
        </div>
      </div>

      <EarningComponentForm 
        isOpen={isEarningFormOpen} 
        onClose={() => setIsEarningFormOpen(false)} 
        onSave={(data) => {
          console.log('Saved earning:', data);
          setIsEarningFormOpen(false);
        }} 
      />

      <DeductionComponentForm 
        isOpen={isDeductionFormOpen} 
        onClose={() => setIsDeductionFormOpen(false)} 
        onSave={(data) => {
          console.log('Saved deduction:', data);
          setIsDeductionFormOpen(false);
        }} 
      />

      <ContributionComponentForm
        isOpen={isContributionFormOpen}
        onClose={() => setIsContributionFormOpen(false)}
        onSave={(data) => {
          console.log('Saved contribution:', data);
          setIsContributionFormOpen(false);
        }}
      />
    </div>
  );
};

const FlagIcon: React.FC<{ active?: boolean; label: string; title: string; color: string }> = ({ active, label, title, color }) => {
  if (!active) return <div className="w-6 h-6 border border-gray-100 rounded bg-gray-50/50" />;
  return (
    <div 
      title={title}
      className={`w-6 h-6 flex items-center justify-center rounded text-[8px] font-black transition-transform hover:scale-110 cursor-help ${color}`}
    >
      {label}
    </div>
  );
};
