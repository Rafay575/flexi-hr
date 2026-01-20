
import React, { useState } from 'react';
import { 
  ShieldCheck, Calculator, Save, Plus, Trash2, 
  Edit3, ToggleLeft, Percent, Scale, Landmark,
  AlertTriangle, CheckCircle2, ChevronDown, Info,
  Settings2, FileText, UserCheck, Download
} from 'lucide-react';
import { TaxSlabForm } from './TaxSlabForm';

interface TaxSlab {
  id: string;
  min: number;
  max: number | 'unlimited';
  rate: number;
  fixedAmount: number;
}

const MOCK_SLABS: TaxSlab[] = [
  { id: '1', min: 0, max: 600000, rate: 0, fixedAmount: 0 },
  { id: '2', min: 600000, max: 1200000, rate: 5, fixedAmount: 0 },
  { id: '3', min: 1200000, max: 2200000, rate: 15, fixedAmount: 30000 },
  { id: '4', min: 2200000, max: 3200000, rate: 25, fixedAmount: 180000 },
  { id: '5', min: 3200000, max: 4100000, rate: 30, fixedAmount: 430000 },
  { id: '6', min: 4100000, max: 'unlimited', rate: 35, fixedAmount: 700000 },
];

export const TaxConfiguration: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [slabs, setSlabs] = useState<TaxSlab[]>(MOCK_SLABS);
  const [isSlabModalOpen, setIsSlabModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    nonFilerMultiplier: 100, // 100% additional (2x)
    averagingMethod: 'Actual YTD + Projected',
    includeERProvident: true,
    includeERGratuity: false
  });

  const formatPKR = (val: number | 'unlimited') => 
    val === 'unlimited' ? '∞' : val.toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-primary" size={28} />
            Tax Compliance Configuration [PK]
          </h2>
          <p className="text-sm text-gray-500">Configure FBR Income Tax Ordinance 2001 rules & slabs</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {['2022-23', '2023-24', '2024-25'].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  selectedYear === year ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Save size={18} /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SLABS TABLE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/30 flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                 <Calculator size={16} /> Tax Slabs (Annual Taxable Income)
               </h3>
               <button 
                onClick={() => setIsSlabModalOpen(true)}
                className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-primary/5 text-primary hover:bg-primary/10"
               >
                 <Edit3 size={14} />
                 Advanced Editor
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Income Range (Min - Max)</th>
                    <th className="px-8 py-5 text-center">Tax Rate (%)</th>
                    <th className="px-8 py-5 text-right">Fixed Amount</th>
                    <th className="px-8 py-5 text-right">Effective Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {slabs.map((slab, i) => (
                    <tr key={slab.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4">
                        <span className="font-mono font-bold text-gray-700">
                          {formatPKR(slab.min)} — {formatPKR(slab.max)}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="font-black text-primary bg-primary/5 px-2 py-1 rounded">{slab.rate}%</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className="font-mono font-bold text-gray-600">{formatPKR(slab.fixedAmount)}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-[10px] font-black text-gray-400 uppercase">
                          {slab.fixedAmount > 0 ? `${formatPKR(slab.fixedAmount)} + ` : ''}
                          {slab.rate}% of amount - {formatPKR(slab.min)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EXEMPTIONS BLOCK */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
             <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <Percent size={16} /> Exemption & Relief Rules
                </h3>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standard Statutory Relief</h4>
                   <div className="space-y-3">
                      <ExemptionToggle label="Medical Allowance Relief" detail="Exempt up to 10% of Basic Salary" active={true} />
                      <ExemptionToggle label="HRA Statutory Cap" detail="Exempt up to 45% of Basic Salary" active={true} />
                      <ExemptionToggle label="Gratuity Exemption" detail="Exempt up to PKR 300,000" active={true} />
                      <ExemptionToggle label="Leave Encashment Relief" detail="Government/Industrial specific rules" active={false} />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custom Exemptions</h4>
                      <button className="text-[9px] font-black text-primary uppercase flex items-center gap-1"><Plus size={10}/> Add</button>
                   </div>
                   <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-left text-xs">
                         <tbody className="divide-y divide-gray-200/50">
                            <tr><td className="px-4 py-3 font-bold text-gray-600">Rebate for Senior Citizens</td><td className="px-4 py-3 text-right text-primary font-black">50%</td></tr>
                            <tr><td className="px-4 py-3 font-bold text-gray-600">Education Relief</td><td className="px-4 py-3 text-right text-primary font-black">Fixed</td></tr>
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* SETTINGS SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 space-y-8 relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-xl"><Settings2 size={24} className="text-accent" /></div>
                   <h3 className="text-lg font-black uppercase tracking-tight leading-none">Global Settings</h3>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-sm font-bold">Filer/Non-Filer Logic</p>
                         <p className="text-[10px] text-white/50 uppercase font-black">Apply 100% additional WHT</p>
                      </div>
                      <button className="w-12 h-6 bg-accent rounded-full relative px-1 flex items-center"><div className="w-4 h-4 bg-primary rounded-full shadow-sm ml-auto" /></button>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Averaging Method</label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer hover:bg-white/20 transition-all appearance-none">
                         <option className="text-gray-900">Actual YTD + Projected Remaining</option>
                         <option className="text-gray-900">Current Month Annualized</option>
                      </select>
                   </div>

                   <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                         <input type="checkbox" className="w-4 h-4 accent-accent rounded" checked={settings.includeERProvident} readOnly />
                         <span className="text-xs font-medium text-white/80">Tax Employer PF Contribution</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <input type="checkbox" className="w-4 h-4 accent-accent rounded" checked={settings.includeERGratuity} readOnly />
                         <span className="text-xs font-medium text-white/80">Tax Employer Gratuity Provision</span>
                      </div>
                   </div>
                </div>
             </div>
             <Scale className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4 shadow-sm">
             <AlertTriangle size={24} className="text-orange-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-orange-900 uppercase tracking-tight leading-none">Fiscal Year Sync</h5>
                <p className="text-xs text-orange-700 leading-relaxed font-medium">
                  Changing slabs will trigger a <span className="font-bold underline">Recalculation Batch</span> for the entire organization for the next payroll run. This cannot be undone.
                </p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Documentation Assets
             </h4>
             <div className="space-y-2">
                <button className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-xl transition-all group">
                   <span className="text-xs font-bold uppercase tracking-tight">FBR Ordinance 2024</span>
                   <Download size={14} className="text-gray-300 group-hover:text-primary" />
                </button>
                <button className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-xl transition-all group">
                   <span className="text-xs font-bold uppercase tracking-tight">Tax Slab History (5yr)</span>
                   <Download size={14} className="text-gray-300 group-hover:text-primary" />
                </button>
             </div>
          </div>
        </div>
      </div>

      <TaxSlabForm 
        isOpen={isSlabModalOpen}
        onClose={() => setIsSlabModalOpen(false)}
        onSave={(newSlabs) => {
          console.log('Deploying new slabs:', newSlabs);
          setIsSlabModalOpen(false);
        }}
        initialSlabs={slabs.map(s => ({
          id: s.id,
          from: s.min,
          to: s.max,
          fixedTax: s.fixedAmount,
          rate: s.rate
        }))}
      />
    </div>
  );
};

const ExemptionToggle = ({ label, detail, active }: { label: string, detail: string, active: boolean }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl transition-all group">
     <div>
        <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{label}</p>
        <p className="text-[10px] text-gray-400 font-medium">{detail}</p>
     </div>
     <button className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-green-500' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
     </button>
  </div>
);
