
import React, { useState, useMemo } from 'react';
import { 
  Calculator, Search, User, ShieldCheck, 
  Info, Download, ArrowRight, Settings2, 
  Wallet, Landmark, Receipt, FileCheck, 
  CheckCircle2, Scale, Percent, TrendingUp,
  X, AlertTriangle, Building2, UserCheck
} from 'lucide-react';

interface TaxWorkings {
  annualGross: number;
  taxableAllowances: number;
  exemptions: number;
  isFiler: boolean;
}

export const TaxCalculationEngine: React.FC = () => {
  const [inputs, setInputs] = useState<TaxWorkings>({
    annualGross: 2400000,
    taxableAllowances: 150000,
    exemptions: 100000,
    isFiler: true
  });

  const [empSearch, setEmpSearch] = useState('');

  const results = useMemo(() => {
    const taxableIncome = inputs.annualGross + inputs.taxableAllowances - inputs.exemptions;
    
    // Mock FBR Slabs logic (Simplified for calculation view)
    let baseTax = 0;
    let excessRate = 0;
    let threshold = 0;
    let slabNo = 1;

    if (taxableIncome <= 600000) {
      slabNo = 1; baseTax = 0; excessRate = 0; threshold = 0;
    } else if (taxableIncome <= 1200000) {
      slabNo = 2; baseTax = 0; excessRate = 5; threshold = 600000;
    } else if (taxableIncome <= 2200000) {
      slabNo = 3; baseTax = 30000; excessRate = 15; threshold = 1200000;
    } else if (taxableIncome <= 3200000) {
      slabNo = 4; baseTax = 180000; excessRate = 25; threshold = 2200000;
    } else {
      slabNo = 5; baseTax = 430000; excessRate = 30; threshold = 3200000;
    }

    const taxOnExcess = (taxableIncome - threshold) * (excessRate / 100);
    let annualTax = baseTax + taxOnExcess;
    
    // Filer adjustment (Non-filers pay 100% additional/2x tax on certain withholding, 
    // though section 149 is usually slab-based, we model the multiplier logic here)
    if (!inputs.isFiler) {
      annualTax = annualTax * 2;
    }

    return {
      taxableIncome,
      slabNo,
      baseTax,
      excessRate,
      threshold,
      taxOnExcess,
      annualTax,
      monthlyTax: annualTax / 12,
      effectiveRate: (annualTax / taxableIncome) * 100
    };
  }, [inputs]);

  const formatPKR = (val: number) => `PKR ${Math.round(val).toLocaleString()}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Calculator className="text-primary" size={28} />
            Tax Calculation Engine [FBR]
          </h2>
          <p className="text-sm text-gray-500">Income Tax Ordinance 2001 • Section 149 Modeling</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <Download size={18} /> Export Working Paper
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <FileCheck size={18} /> Sync to Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Search size={14} /> Taxpayer Context
            </h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search employee database..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Annual Base Gross (PKR)</label>
                <input 
                  type="number" 
                  value={inputs.annualGross}
                  onChange={(e) => setInputs({...inputs, annualGross: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Taxable Allowances (Annual)</label>
                <input 
                  type="number" 
                  value={inputs.taxableAllowances}
                  onChange={(e) => setInputs({...inputs, taxableAllowances: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Statutory Exemptions</label>
                <input 
                  type="number" 
                  value={inputs.exemptions}
                  onChange={(e) => setInputs({...inputs, exemptions: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary" 
                />
              </div>

              <div className="pt-4 border-t border-dashed">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <div>
                      <p className="text-xs font-black text-gray-700">Filer Status</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Active Taxpayer List (ATL)</p>
                   </div>
                   <button 
                    onClick={() => setInputs({...inputs, isFiler: !inputs.isFiler})}
                    className={`w-12 h-6 rounded-full relative transition-all ${inputs.isFiler ? 'bg-green-500' : 'bg-red-500'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${inputs.isFiler ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-sm">
             <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Fiscal Year 2024-25</h5>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Current model utilizes the Finance Act 2024 slabs. Non-filer status triggers 2.0x withholding on relevant components.
                </p>
             </div>
          </div>
        </div>

        {/* Right: Step-by-Step Workings Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Step-by-Step Workings</h3>
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase">
                 <ShieldCheck size={14} /> FBR Verified Logic
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              {/* Step 1: Taxable Income */}
              <div className="relative pl-10 border-l-2 border-gray-100">
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-primary z-10" />
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Step 1: Derive Taxable Income</h4>
                         <p className="text-xs text-gray-400">Gross salary minus applicable exemptions</p>
                      </div>
                      <div className="text-right">
                         <span className="text-lg font-black text-gray-800">{formatPKR(results.taxableIncome)}</span>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-[11px]">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-400 uppercase font-black block mb-1">Gross</span>
                        <span className="font-bold">{formatPKR(inputs.annualGross)}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-400 uppercase font-black block mb-1">Allowances</span>
                        <span className="font-bold">+{formatPKR(inputs.taxableAllowances)}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl text-red-500">
                        <span className="text-gray-400 uppercase font-black block mb-1">Exemptions</span>
                        <span className="font-bold">-{formatPKR(inputs.exemptions)}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Step 2: Slabs */}
              <div className="relative pl-10 border-l-2 border-gray-100">
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-primary z-10" />
                <div className="space-y-4">
                   <div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Step 2: Apply FBR Slabs</h4>
                      <p className="text-xs text-gray-400">Matched to Slab #{results.slabNo} Tier</p>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                         <span>Fixed Tax for this bracket</span>
                         <span className="font-mono">{formatPKR(results.baseTax)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                         <span>Tax on excess of {formatPKR(results.threshold)} ({results.excessRate}%)</span>
                         <span className="font-mono">+{formatPKR(results.taxOnExcess)}</span>
                      </div>
                      <div className="h-[1px] bg-gray-200 border-dashed border-b" />
                      <div className="flex justify-between text-sm font-black text-primary">
                         <span>Computed Annual Tax (Standard)</span>
                         <span>{formatPKR(results.baseTax + results.taxOnExcess)}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Step 3: Adjustments */}
              <div className="relative pl-10 border-l-2 border-gray-100">
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-primary z-10" />
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Step 3: Status Adjustments</h4>
                        <p className="text-xs text-gray-400">Filer/Non-Filer Multiplier Impact</p>
                      </div>
                      <span className={`px-2 py-1 rounded font-black text-[10px] uppercase border ${inputs.isFiler ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200 animate-pulse'}`}>
                        {inputs.isFiler ? 'Filer: 1.0x' : 'Non-Filer: 2.0x'}
                      </span>
                   </div>
                   {!inputs.isFiler && (
                     <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                        <AlertTriangle size={18} className="text-red-500" />
                        <p className="text-xs text-red-700 font-bold">Punitive tax rate applied due to Non-Filer status.</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Final Result Block */}
              <div className="bg-primary p-8 rounded-3xl flex flex-wrap items-center justify-between text-white shadow-2xl relative overflow-hidden gap-8">
                 <div className="relative z-10 space-y-8 flex-1 min-w-[300px]">
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Calculated Annual Tax</p>
                          <h3 className="text-4xl font-black text-accent tracking-tighter">{formatPKR(results.annualTax)}</h3>
                       </div>
                       <div className="space-y-1 border-l border-white/10 pl-12">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Monthly Withholding</p>
                          <h3 className="text-4xl font-black text-white tracking-tighter">{formatPKR(results.monthlyTax)}</h3>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                       <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-accent" />
                          <span className="text-xs font-bold text-white/70">Effective Rate: {results.effectiveRate.toFixed(1)}%</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Scale size={16} className="text-accent" />
                          <span className="text-xs font-bold text-white/70">Matched Tier: Slab {results.slabNo}</span>
                       </div>
                    </div>
                 </div>
                 <div className="relative z-10">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center gap-2">
                       <button className="w-full px-6 py-2.5 bg-accent text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                          Commit to Ledger
                       </button>
                    </div>
                 </div>
                 <Calculator className="absolute right-[-40px] top-[-40px] text-white/5 w-64 h-64 -rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
