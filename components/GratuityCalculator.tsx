
import React, { useState, useMemo } from 'react';
import { 
  Calculator, Search, User, Calendar, ShieldCheck, 
  Info, Download, ArrowRight, Settings2, Scale,
  Wallet, Landmark, Receipt, FileCheck, CheckCircle2
} from 'lucide-react';

interface GratuityPolicy {
  id: string;
  name: string;
  minYears: number;
  rates: {
    tier1: number; // 1-5 years
    tier2: number; // >5 years
  };
}

const DEFAULT_POLICY: GratuityPolicy = {
  id: 'PK-STD-2024',
  name: 'Pakistan Standard Labour Law',
  minYears: 1,
  rates: { tier1: 21, tier2: 30 }
};

export const GratuityCalculator: React.FC = () => {
  const [empSearch, setEmpSearch] = useState('');
  const [doj, setDoj] = useState('2018-06-15');
  const [lwd, setLwd] = useState('2025-01-31');
  const [basicSalary, setBasicSalary] = useState(125000);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const results = useMemo(() => {
    const start = new Date(doj);
    const end = new Date(lwd);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const completedYears = Math.floor(totalDays / 365.25);
    const fractionYears = (totalDays / 365.25).toFixed(2);

    const dailyRate = basicSalary / 30;
    let appliedRate = 0;
    
    if (completedYears < DEFAULT_POLICY.minYears) appliedRate = 0;
    else if (completedYears <= 5) appliedRate = DEFAULT_POLICY.rates.tier1;
    else appliedRate = DEFAULT_POLICY.rates.tier2;

    const grossGratuity = dailyRate * appliedRate * parseFloat(fractionYears);
    const taxExempt = 300000;
    const taxableAmount = Math.max(0, grossGratuity - taxExempt);
    const taxRate = 0.10; // Simplified flat 10% on excess for model
    const taxValue = taxableAmount * taxRate;
    const netGratuity = grossGratuity - taxValue;

    return {
      completedYears,
      fractionYears,
      dailyRate,
      appliedRate,
      grossGratuity,
      taxExempt,
      taxableAmount,
      taxValue,
      netGratuity
    };
  }, [doj, lwd, basicSalary]);

  const formatPKR = (val: number) => `PKR ${Math.round(val).toLocaleString()}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Gratuity Modeling Engine</h2>
          <p className="text-sm text-gray-500">Calculate end-of-service benefits based on tenure and statutory rules</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <Download size={18} /> Export Model
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <FileCheck size={18} /> Use in Settlement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <User size={14} /> Employee Selection
              </h3>
              <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded">Manual Mode</span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search database or type name..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date of Joining</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="date" 
                      value={doj}
                      onChange={(e) => setDoj(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Last Working Day</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="date" 
                      value={lwd}
                      onChange={(e) => setLwd(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Last Drawn Basic Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">PKR</span>
                  <input 
                    type="number" 
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-lg font-black text-primary outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-accent" size={24} />
                <h4 className="text-sm font-black uppercase tracking-tight">Active Policy</h4>
              </div>
              <button onClick={() => setShowPolicyModal(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings2 size={16} />
              </button>
            </div>
            <div className="relative z-10 space-y-3">
              <p className="text-xs font-bold text-white/70">{DEFAULT_POLICY.name}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <p className="text-[8px] font-black text-white/40 uppercase">1-5 Years</p>
                  <p className="text-sm font-black text-accent">{DEFAULT_POLICY.rates.tier1} Days / Yr</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <p className="text-[8px] font-black text-white/40 uppercase">&gt; 5 Years</p>
                  <p className="text-sm font-black text-accent">{DEFAULT_POLICY.rates.tier2} Days / Yr</p>
                </div>
              </div>
            </div>
            <Landmark className="absolute right-[-20px] bottom-[-20px] text-white/5 w-40 h-40 rotate-12" />
          </div>
        </div>

        {/* Right: Calculation Worksheet */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Calculation Results</h3>
              <div className="flex items-center gap-2">
                 <Scale size={14} className="text-gray-400" />
                 <span className="text-[10px] font-black text-gray-500 uppercase">Statutory Method</span>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Completed Service</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-3xl font-black text-gray-800">{results.completedYears}</h4>
                      <span className="text-sm font-bold text-gray-400 uppercase">Years Full</span>
                    </div>
                    <p className="text-[10px] text-primary font-bold">Actual: {results.fractionYears} yrs</p>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between text-xs font-medium">
                       <span className="text-gray-500">Daily Salary Rate (Basic/30)</span>
                       <span className="text-gray-800 font-bold">{Math.round(results.dailyRate).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium">
                       <span className="text-gray-500">Policy Rate Applied</span>
                       <span className="text-primary font-black uppercase tracking-tighter">{results.appliedRate} Days / Yr</span>
                     </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center space-y-2 relative overflow-hidden group">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">Gross Gratuity</p>
                    <h3 className="text-3xl font-black text-primary relative z-10">{formatPKR(results.grossGratuity)}</h3>
                    <Calculator className="absolute -right-4 -bottom-4 text-primary/5 w-24 h-24 rotate-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-green-600" />
                      <span className="text-[10px] font-black text-green-700 uppercase">Tax Exemption</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-green-700">{formatPKR(results.taxExempt)}</span>
                  </div>
                </div>
              </div>

              {/* Taxation Breakdown */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Taxable Portion</p>
                    <p className="text-sm font-black text-gray-700">{formatPKR(results.taxableAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Tax Value (Est)</p>
                    <p className="text-sm font-black text-red-500">-{formatPKR(results.taxValue)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Effective Rate</p>
                    <p className="text-sm font-black text-gray-700">{results.taxableAmount > 0 ? '10.0%' : '0.0%'}</p>
                  </div>
                </div>
              </div>

              {/* Final Takehome */}
              <div className="bg-primary p-8 rounded-2xl flex items-center justify-between text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[2px] mb-1">Final Net Gratuity Payout</p>
                  <h2 className="text-4xl font-black text-accent tracking-tighter">{formatPKR(results.netGratuity)}</h2>
                </div>
                <div className="relative z-10 text-right">
                  <div className="p-3 bg-white/10 rounded-full backdrop-blur-md inline-flex">
                    <Wallet size={32} className="text-accent" />
                  </div>
                </div>
                <div className="absolute left-0 bottom-0 w-full h-1 bg-white/10" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 shadow-sm">
             <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">Pakistan Labour Law 12(6)</h5>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  The calculator applies the 15-day/20-day/30-day formula based on the industrial establishment rules. Tax exemption of PKR 300,000 is applied as per Second Schedule of the Income Tax Ordinance.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
