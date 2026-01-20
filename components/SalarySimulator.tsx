
import React, { useState, useMemo } from 'react';
import { 
  Play, Download, CheckCircle2, AlertTriangle, 
  TrendingUp, Calculator, Users, Layers,
  ArrowRight, Info, Percent, Wallet, 
  ShieldAlert, BarChart3, ChevronRight, X
} from 'lucide-react';

type SimMode = 'SINGLE' | 'TEMPLATE' | 'BULK';

export const SalarySimulator: React.FC = () => {
  const [mode, setMode] = useState<SimMode>('SINGLE');
  const [isSimulating, setIsSimulating] = useState(false);
  const [incrementPerc, setIncrementPerc] = useState(10);
  const [targetGross, setTargetGross] = useState(250000);

  // Simulation Logic
  const results = useMemo(() => {
    const currentGross = 200000;
    const simulatedGross = mode === 'SINGLE' ? currentGross * (1 + incrementPerc / 100) : targetGross;
    
    // Mock tax slab movement
    const currentTax = currentGross * 0.12;
    const simulatedTax = simulatedGross * 0.15; // Higher slab simulation
    
    return {
      current: { gross: currentGross, tax: currentTax, net: currentGross - currentTax },
      simulated: { gross: simulatedGross, tax: simulatedTax, net: simulatedGross - simulatedTax },
      delta: {
        gross: simulatedGross - currentGross,
        tax: simulatedTax - currentTax,
        net: (simulatedGross - simulatedTax) - (currentGross - currentTax)
      }
    };
  }, [mode, incrementPerc, targetGross]);

  const formatPKR = (val: number) => `PKR ${Math.round(val).toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
            <Bot size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Salary Simulator</h2>
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">PRO</span>
            </div>
            <p className="text-sm text-gray-500">Forecasting fiscal impact and tax slab movements</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} /> Export Results
          </button>
          <button 
            onClick={() => setIsSimulating(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Play size={18} fill="currentColor" /> Run Simulation
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 w-fit rounded-xl border border-gray-200">
        <button 
          onClick={() => setMode('SINGLE')}
          className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'SINGLE' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
        >
          <User size={14} /> Single Employee
        </button>
        <button 
          onClick={() => setMode('TEMPLATE')}
          className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'TEMPLATE' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
        >
          <Layers size={14} /> Template What-If
        </button>
        <button 
          onClick={() => setMode('BULK')}
          className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'BULK' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
        >
          <Users size={14} /> Bulk Impact
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Simulation parameters</h3>
            
            {mode === 'SINGLE' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Search Employee</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Arsalan Khan (EMP-1001)" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Increment Percentage</label>
                    <span className="text-sm font-black text-primary">{incrementPerc}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="50" step="1" 
                    value={incrementPerc} 
                    onChange={(e) => setIncrementPerc(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                </div>
              </div>
            )}

            {mode === 'TEMPLATE' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Template</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none">
                    <option>Executive Management (G20)</option>
                    <option>Standard Operations (G15)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Test Gross Value</label>
                  <input 
                    type="number" 
                    value={targetGross} 
                    onChange={(e) => setTargetGross(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" 
                  />
                </div>
              </div>
            )}

            {mode === 'BULK' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Apply Increment To</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none">
                    <option>Entire Organization</option>
                    <option>Engineering Department</option>
                    <option>Grade 18 & Above</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Annual Percentage (%)</label>
                  <input 
                    type="number" 
                    value={incrementPerc} 
                    onChange={(e) => setIncrementPerc(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" 
                  />
                </div>
              </div>
            )}

            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
              <Info size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-indigo-700 leading-relaxed font-medium uppercase tracking-tight">
                Simulations are sandboxed and do not affect current payroll records until "Apply Changes" is explicitly triggered.
              </p>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">Impacted Count</span>
                <span className="text-sm font-black">{mode === 'BULK' ? '485' : '01'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">Total Cost Delta</span>
                <span className="text-sm font-black text-accent">+{formatPKR(results.delta.gross * (mode === 'BULK' ? 485 : 1))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {!isSimulating ? (
            <div className="h-full bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="p-6 bg-gray-50 rounded-full text-gray-300 mb-6">
                <BarChart3 size={48} />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Ready to Simulate</h4>
              <p className="text-sm text-gray-500 max-w-xs mt-2">Adjust your parameters on the left and click "Run Simulation" to see fiscal forecasts.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              {/* Comparison Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current State</p>
                  <h5 className="text-2xl font-black text-gray-800 leading-none">{formatPKR(results.current.net)}</h5>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 italic">Net Take-home</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Simulated State</p>
                    <h5 className="text-2xl font-black text-indigo-600 leading-none">{formatPKR(results.simulated.net)}</h5>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                          <TrendingUp size={10} /> +{incrementPerc}%
                       </span>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <TrendingUp size={80} />
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Component Comparison</h4>
                </div>
                <table className="w-full text-left">
                  <thead className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b">
                    <tr>
                      <th className="px-6 py-4">Metric</th>
                      <th className="px-6 py-4 text-right">Current</th>
                      <th className="px-6 py-4 text-right">Simulated</th>
                      <th className="px-6 py-4 text-right">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    <tr>
                      <td className="px-6 py-4 font-bold text-gray-700">Monthly Gross</td>
                      <td className="px-6 py-4 text-right text-gray-500">{formatPKR(results.current.gross)}</td>
                      <td className="px-6 py-4 text-right font-black text-primary">{formatPKR(results.simulated.gross)}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">+{formatPKR(results.delta.gross)}</td>
                    </tr>
                    <tr className="bg-red-50/20">
                      <td className="px-6 py-4 font-bold text-gray-700 flex items-center gap-2">
                        Income Tax <ShieldAlert size={14} className="text-red-400" />
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">{formatPKR(results.current.tax)}</td>
                      <td className="px-6 py-4 text-right font-black text-red-600">{formatPKR(results.simulated.tax)}</td>
                      <td className="px-6 py-4 text-right text-red-600 font-bold">+{formatPKR(results.delta.tax)}</td>
                    </tr>
                    <tr className="bg-indigo-50/10">
                      <td className="px-6 py-4 font-bold text-indigo-700">Net Salary</td>
                      <td className="px-6 py-4 text-right text-gray-400 italic">{formatPKR(results.current.net)}</td>
                      <td className="px-6 py-4 text-right font-black text-indigo-600">{formatPKR(results.simulated.net)}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">+{formatPKR(results.delta.net)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Slab Warning */}
              {results.delta.tax > (results.delta.gross * 0.2) && (
                <div className="p-5 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-orange-800">Tax Slab Escalation Detected</h5>
                    <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                      This increment pushes the profile into a higher FBR tax bracket. 
                      <strong> {Math.round((results.delta.tax / results.delta.gross) * 100)}% </strong> of this increment is lost to additional taxation.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  onClick={() => setIsSimulating(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50"
                >
                  Reset Simulation
                </button>
                <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Apply Changes to Records
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper components missing from imports
const Bot = ({ size }: { size: number }) => <Calculator size={size} />;
const User = ({ size }: { size: number }) => <Users size={size} />;
const Search = ({ className, size }: { className?: string, size: number }) => <Calculator className={className} size={size} />;
