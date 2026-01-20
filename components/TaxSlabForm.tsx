
import React, { useState, useMemo } from 'react';
import { 
  X, Plus, Trash2, ShieldCheck, Download, 
  RefreshCw, CheckCircle2, AlertTriangle, 
  Calendar, Calculator, ArrowRight, Save,
  Info, Scale
} from 'lucide-react';

interface TaxSlab {
  id: string;
  from: number;
  to: number | 'unlimited';
  fixedTax: number;
  rate: number;
}

interface TaxSlabFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialSlabs?: TaxSlab[];
}

export const TaxSlabForm: React.FC<TaxSlabFormProps> = ({ isOpen, onClose, onSave, initialSlabs }) => {
  const [slabs, setSlabs] = useState<TaxSlab[]>(initialSlabs || [
    { id: '1', from: 0, to: 600000, fixedTax: 0, rate: 0 },
    { id: '2', from: 600000, to: 1200000, fixedTax: 0, rate: 5 },
    { id: '3', from: 1200000, to: 'unlimited', fixedTax: 30000, rate: 15 }
  ]);

  const [testIncome, setTestIncome] = useState<number>(2500000);
  const [isImporting, setIsImporting] = useState(false);

  // Fix: Added missing formatPKR helper function to fix "Cannot find name 'formatPKR'" errors
  const formatPKR = (val: number | 'unlimited') => 
    val === 'unlimited' ? '∞' : val.toLocaleString();

  const validations = useMemo(() => {
    const sorted = [...slabs].sort((a, b) => a.from - b.from);
    let continuous = true;
    let overlapping = false;
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (current.to !== next.from) continuous = false;
      if (typeof current.to === 'number' && current.to > next.from) overlapping = true;
    }

    const lastOpen = slabs.some(s => s.to === 'unlimited');
    
    return { continuous, noOverlap: !overlapping, lastOpen };
  }, [slabs]);

  const previewCalc = useMemo(() => {
    const income = testIncome;
    const applicableSlab = slabs.find(s => 
      income >= s.from && (s.to === 'unlimited' || income < s.to)
    );

    if (!applicableSlab) return { tax: 0, effectiveRate: 0 };

    const taxOnExcess = (income - applicableSlab.from) * (applicableSlab.rate / 100);
    const totalTax = applicableSlab.fixedTax + taxOnExcess;
    const effectiveRate = (totalTax / income) * 100;

    return { totalTax, effectiveRate, slab: applicableSlab };
  }, [testIncome, slabs]);

  if (!isOpen) return null;

  const addSlab = () => {
    const lastSlab = slabs[slabs.length - 1];
    const newFrom = lastSlab.to === 'unlimited' ? lastSlab.from + 1000000 : lastSlab.to;
    setSlabs([...slabs, { 
      id: Math.random().toString(36).substr(2, 9),
      from: Number(newFrom),
      to: 'unlimited',
      fixedTax: 0,
      rate: 0
    }]);
  };

  const removeSlab = (id: string) => {
    if (slabs.length <= 1) return;
    setSlabs(slabs.filter(s => s.id !== id));
  };

  const updateSlab = (id: string, field: keyof TaxSlab, value: any) => {
    setSlabs(slabs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const importFBR = () => {
    setIsImporting(true);
    setTimeout(() => {
      // Mock FBR Data Import
      setSlabs([
        { id: 'f1', from: 0, to: 600000, fixedTax: 0, rate: 0 },
        { id: 'f2', from: 600000, to: 1200000, fixedTax: 0, rate: 5 },
        { id: 'f3', from: 1200000, to: 2200000, fixedTax: 30000, rate: 15 },
        { id: 'f4', from: 2200000, to: 3200000, fixedTax: 180000, rate: 25 },
        { id: 'f5', from: 3200000, to: 4100000, fixedTax: 430000, rate: 30 },
        { id: 'f6', from: 4100000, to: 'unlimited', fixedTax: 700000, rate: 35 },
      ]);
      setIsImporting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Income Tax Slab Editor</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FBR Ordinance 2001 • Section 149</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={importFBR}
              disabled={isImporting}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2"
             >
                {isImporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                Import FBR Slabs
             </button>
             <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">
                Import Prev Year
             </button>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 ml-2">
                <X size={20} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Table Side */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl overflow-hidden shadow-inner">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="bg-gray-100 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-4 py-4 w-12 text-center">#</th>
                        <th className="px-4 py-4">From (PKR)</th>
                        <th className="px-4 py-4">To (PKR)</th>
                        <th className="px-4 py-4">Fixed Tax</th>
                        <th className="px-4 py-4">Rate %</th>
                        <th className="px-4 py-4 w-10"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {slabs.map((slab, i) => (
                      <tr key={slab.id} className="bg-white hover:bg-primary/[0.01]">
                        <td className="px-4 py-3 text-center font-black text-gray-300">{i + 1}</td>
                        <td className="px-4 py-3">
                           <input 
                            type="number" 
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs font-mono font-bold" 
                            value={slab.from} 
                            onChange={(e) => updateSlab(slab.id, 'from', Number(e.target.value))}
                           />
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs font-mono font-bold" 
                                value={slab.to === 'unlimited' ? '∞' : slab.to} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateSlab(slab.id, 'to', val === '∞' || val === '' ? 'unlimited' : Number(val));
                                }}
                              />
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <input 
                            type="number" 
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs font-mono font-bold text-gray-600" 
                            value={slab.fixedTax} 
                            onChange={(e) => updateSlab(slab.id, 'fixedTax', Number(e.target.value))}
                           />
                        </td>
                        <td className="px-4 py-3">
                           <input 
                            type="number" 
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs font-black text-primary bg-primary/5" 
                            value={slab.rate} 
                            onChange={(e) => updateSlab(slab.id, 'rate', Number(e.target.value))}
                           />
                        </td>
                        <td className="px-4 py-3">
                           <button onClick={() => removeSlab(slab.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               <button 
                onClick={addSlab}
                className="w-full py-4 bg-gray-50 border-t border-dashed border-gray-200 text-[10px] font-black uppercase text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
               >
                  <Plus size={14} /> Add New Threshold Tier
               </button>
            </div>

            {/* Validation Feedback */}
            <div className="grid grid-cols-3 gap-4">
              <ValidationPill label="Range Continuity" ok={validations.continuous} />
              <ValidationPill label="No Overlapping" ok={validations.noOverlap} />
              <ValidationPill label="Open-ended Cap" ok={validations.lastOpen} />
            </div>

            <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
               <Calendar size={20} className="text-primary mt-1" />
               <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Effective From</label>
                     <input type="date" defaultValue="2024-07-01" className="w-full bg-transparent border-b border-primary/20 text-sm font-bold text-gray-700 outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Effective To</label>
                     <input type="date" defaultValue="2025-06-30" className="w-full bg-transparent border-b border-primary/20 text-sm font-bold text-gray-700 outline-none focus:border-primary" />
                  </div>
               </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/20 space-y-6 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                    <ShieldCheck size={14} /> Live Calc Sandbox
                  </h4>
                  <div className="space-y-2">
                     <label className="text-[9px] font-bold text-white/50 uppercase">Test Annual Taxable Income</label>
                     <input 
                      type="number" 
                      value={testIncome}
                      onChange={(e) => setTestIncome(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xl font-black outline-none focus:bg-white/20 transition-all" 
                     />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-4">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[9px] font-bold text-white/40 uppercase">Total Annual Tax</p>
                           <p className="text-3xl font-black text-accent">{formatPKR(previewCalc.totalTax)}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-bold text-white/40 uppercase">Eff. Rate</p>
                           <p className="text-xl font-black">{previewCalc.effectiveRate.toFixed(1)}%</p>
                        </div>
                     </div>
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] leading-relaxed">
                        <span className="text-accent font-black">Matched Slab {slabs.indexOf(previewCalc.slab!) + 1}:</span> {previewCalc.slab ? `(${formatPKR(previewCalc.slab.from)} - ${previewCalc.slab.to === 'unlimited' ? '∞' : formatPKR(previewCalc.slab.to)})` : 'None'}
                     </div>
                  </div>
               </div>
               <Scale className="absolute right-[-20px] bottom-[-20px] text-white/5 w-40 h-40 rotate-12" />
            </div>

            <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl space-y-3 shadow-sm">
               <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle size={18} />
                  <h5 className="text-xs font-black uppercase tracking-tight">Recalculation Trigger</h5>
               </div>
               <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                  Saving these slabs will mark <strong>485 employee records</strong> as 'Dirty'. The system will force a recalculation of YTD tax and monthly WHT for the next run.
               </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                    <Info size={16} />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">
                    Slabs should represent <span className="text-primary font-black">Annual</span> figures. Monthly WHT is automatically derived.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${Object.values(validations).every(v => v) ? 'bg-green-50' : 'bg-red-50 animate-pulse'}`} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {Object.values(validations).every(v => v) ? 'Logical Structure Verified' : 'Check Validation Errors'}
              </span>
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                 Cancel
              </button>
              <button 
                onClick={() => onSave(slabs)}
                disabled={!Object.values(validations).every(v => v)}
                className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <Save size={18} /> Save & Deploy Slabs
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ValidationPill = ({ label, ok }: { label: string, ok: boolean }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter ${
    ok ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
  }`}>
     <span>{label}</span>
     {ok ? <CheckCircle2 size={12} strokeWidth={3} /> : <AlertTriangle size={12} strokeWidth={3} />}
  </div>
);
