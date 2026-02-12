
import React, { useMemo } from 'react';
import { 
  TrendingUp, Calendar, ArrowUpRight, Award, 
  Clock, History, Briefcase, ChevronRight, 
  BarChart3, Target, ArrowRight, Zap
} from 'lucide-react';

interface SalaryChange {
  date: string;
  amount: number;
  reason: string;
  previousAmount: number;
  type: 'Increment' | 'Promotion' | 'Correction' | 'Joining';
}

const MOCK_HISTORY: SalaryChange[] = [
  { date: 'Jan 01, 2025', amount: 215000, previousAmount: 180000, reason: 'Annual Performance Review (Exceeded Expectations)', type: 'Increment' },
  { date: 'Jul 01, 2024', amount: 180000, previousAmount: 145000, reason: 'Promoted to Senior Lead Engineer', type: 'Promotion' },
  { date: 'Jan 01, 2024', amount: 145000, previousAmount: 130000, reason: 'Cost of Living Adjustment', type: 'Increment' },
  { date: 'Jun 15, 2023', amount: 130000, previousAmount: 0, reason: 'Initial Joining Salary', type: 'Joining' },
];

export const MySalaryHistory: React.FC = () => {
  const currentSalary = MOCK_HISTORY[0].amount;
  const startingSalary = MOCK_HISTORY[MOCK_HISTORY.length - 1].amount;
  
  const stats = useMemo(() => {
    const growth = ((currentSalary - startingSalary) / startingSalary) * 100;
    const years = 1.6; // Mock years
    return { growth: growth.toFixed(1), years };
  }, [currentSalary, startingSalary]);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Compensation Timeline</h2>
          <p className="text-sm text-gray-500">A historical view of your growth within the organization</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <Target size={16} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Growth Index</span>
              <span className="text-xs font-black text-primary">Top 15% of Grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col relative overflow-hidden group">
  <div className="relative z-10">
    <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 mb-8 flex items-center gap-2">
      <BarChart3 size={16} className="text-primary" /> Salary Progression Chart
    </h3>
    
    <div className="h-48 relative flex items-end">
      {/* Bars with fixed minimum heights */}
      <div className="flex items-end justify-between gap-2 w-full px-2">
        {MOCK_HISTORY.slice().reverse().map((h, i) => {
          // Fixed height values for demonstration
          const heights = [40, 55, 70, 85, 100, 120, 140, 160]; // in pixels
          const barHeight = heights[i % heights.length] || 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div 
                className="w-full rounded-t-lg transition-all duration-300 hover:scale-105 hover:shadow-lg relative"
                style={{ 
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, 
                    hsl(${210 + i * 15}, 80%, 60%) 0%, 
                    hsl(${210 + i * 15}, 90%, 45%) 100%)`
                }}
              >
                {/* Value inside bar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-black text-white rotate-90 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPKR(h.amount)}
                  </span>
                </div>
              </div>
              
              {/* Date label */}
              <div className="mt-2 text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase">
                  {h.date.split(',')[1]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>

        <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1 text-center">Total Career Growth</p>
              <h4 className="text-5xl font-black text-accent tracking-tighter text-center">+{stats.growth}%</h4>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="text-center flex-1">
                <p className="text-[8px] font-bold text-white/40 uppercase">Starting</p>
                <p className="text-sm font-black">{formatPKR(startingSalary)}</p>
              </div>
              <ArrowRight className="text-white/20" size={20} />
              <div className="text-center flex-1">
                <p className="text-[8px] font-bold text-white/40 uppercase">Current</p>
                <p className="text-sm font-black text-accent">{formatPKR(currentSalary)}</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-8 p-3 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md">
            <p className="text-[10px] text-white/80 leading-relaxed text-center font-medium">
              You have achieved this growth in <span className="text-accent font-black">{stats.years} Years</span> of dedicated service.
            </p>
          </div>
          <TrendingUp className="absolute left-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="max-w-4xl mx-auto py-10 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-100 -translate-x-1/2 hidden md:block"></div>
        
        <div className="space-y-12">
          {MOCK_HISTORY.map((change, idx) => {
            const isEven = idx % 2 === 0;
            const diff = change.previousAmount > 0 ? ((change.amount - change.previousAmount) / change.previousAmount * 100).toFixed(1) : null;

            return (
              <div key={idx} className={`relative flex items-center justify-between md:justify-normal group ${isEven ? 'md:flex-row-reverse' : ''}`}>
                {/* Connector Point */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center z-10">
                  <div className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all group-hover:scale-125 ${
                    change.type === 'Promotion' ? 'bg-accent text-primary' : 
                    change.type === 'Joining' ? 'bg-gray-800 text-white' : 'bg-primary text-white'
                  }`}>
                    {change.type === 'Promotion' ? <Award size={18} /> : 
                     change.type === 'Joining' ? <Briefcase size={18} /> : <TrendingUp size={18} />}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[42%] bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group/card ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-widest">{change.date}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      change.type === 'Promotion' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {change.type}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <h4 className="text-2xl font-black text-gray-800 tracking-tighter">{formatPKR(change.amount)}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 font-medium line-through opacity-50">{formatPKR(change.previousAmount)}</p>
                      {diff && (
                        <div className="flex items-center gap-1 text-green-600 font-black text-[10px] uppercase">
                          <ArrowUpRight size={12} /> +{diff}% Change
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 leading-relaxed italic">
                      "{change.reason}"
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover/card:text-primary transition-colors flex items-center gap-1">
                      View Details <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Info */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-5 max-w-4xl mx-auto shadow-sm">
        <Clock size={24} className="text-blue-500 mt-1 shrink-0" />
        <div className="space-y-1">
          <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight">Organization Review Cycle</h5>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Compensation is typically reviewed annually in January. Mid-year adjustments are reserved for structural grade changes, internal promotions, or specific market re-alignments.
          </p>
        </div>
      </div>
    </div>
  );
};
