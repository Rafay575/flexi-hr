import React, { useState } from 'react';
import { 
  TrendingUp, Calendar, Filter, RefreshCw, 
  Info, Sparkles, Zap, ArrowUpRight, BarChart3,
  ChevronRight, BrainCircuit, AlertTriangle, Users,
  // Added missing CheckCircle2 import
  CheckCircle2
} from 'lucide-react';

export const LeaveForecast = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [years, setYears] = useState(2);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Mock data for the chart: values 0-100 representing leave volume
  const actualData = [45, 30, 40, 55, 60, 85, 75, 50, 45, 55, 65, 95];
  const forecastData = [48, 35, 82, 50, 58, 88, 70, 48, 52, 60, 68, 98];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Forecast</h2>
            <p className="text-gray-500 font-medium">Predictive modeling of workforce availability based on historical patterns.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {[1, 2, 3].map(y => (
              <button 
                key={y}
                onClick={() => setYears(y)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${years === y ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {y}Y Data
              </button>
            ))}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} className="text-[#E8D5A3]" />}
            Generate New Forecast
          </button>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-red-50 text-red-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase">Peak Period</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">Dec 24 - Jan 02</h4>
          <p className="text-xs text-gray-500 font-medium mt-1">Expected 85% of Engineering to apply for leave.</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-[#E8D5A3]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <Zap size={24} />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">High Probability</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">Marketing: March</h4>
          <p className="text-xs text-gray-500 font-medium mt-1">85% confidence score for increased sick leave duration.</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Optimal window</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">Feb 01 - Feb 14</h4>
          <p className="text-xs text-gray-500 font-medium mt-1">Lowest forecasted leave volume. Ideal for major releases.</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 lg:p-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-[#3E3B6F]" /> 12-Month Projection (2025)
            </h3>
            <p className="text-sm text-gray-400 font-medium italic">Confidence Band: 92% based on {years} years of historical data</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#3E3B6F] rounded-full" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Actual (2024)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-indigo-300 border-t border-dashed border-indigo-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Forecast (2025)</span>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full relative flex items-end justify-between px-4 pb-12">
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 flex justify-between px-4 opacity-5 pointer-events-none">
             {months.map(m => <div key={m} className="w-px h-full bg-gray-900" />)}
          </div>
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-12 opacity-5 pointer-events-none">
             {[0,1,2,3].map(i => <div key={i} className="w-full h-px bg-gray-900" />)}
          </div>

          <svg className="absolute inset-0 w-full h-[350px] overflow-visible" preserveAspectRatio="none">
            {/* Confidence Area */}
            <path 
              d={`M 0 350 ${forecastData.map((v, i) => `L ${(i / 11) * 100}% ${350 - (v + 10) * 3}`).join(' ')} L 100% 350 Z`}
              fill="rgba(62, 59, 111, 0.05)"
              className="transition-all duration-1000"
            />
            {/* Actual Line */}
            <path 
              d={actualData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / 11) * 100}% ${350 - v * 3}`).join(' ')}
              fill="none" stroke="#3E3B6F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className="transition-all duration-1000"
            />
            {/* Forecast Line */}
            <path 
              d={forecastData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / 11) * 100}% ${350 - v * 3}`).join(' ')}
              fill="none" stroke="#4A4680" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round"
              className="transition-all duration-1000 opacity-60"
            />
          </svg>

          {months.map((m, i) => (
            <div key={m} className="flex flex-col items-center gap-4 z-10">
               <div className="group relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3E3B6F] ring-4 ring-white shadow-sm" />
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#3E3B6F] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    Est: {forecastData[i]} days
                  </div>
               </div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Insights & Analysis */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2 px-2">
            <Info size={16} className="text-[#3E3B6F]" /> Strategic Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <Users size={20}/>
                <h4 className="font-bold text-sm uppercase">Engineering Trends</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Predictable peaks in Summer (June-July) correlate with school vacations. Recommend restricting critical updates during these windows.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-purple-600">
                <Calendar size={20}/>
                <h4 className="font-bold text-sm uppercase">Festival Correlation</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                High correlation found between Eid dates and Casual Leave spikes. AI predicts a <span className="font-bold text-purple-600">+45%</span> volume increase for March.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle size={20}/>
                <h4 className="font-bold text-sm uppercase">Lapse Liability</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Forecast shows significant lapse risk in Q4. Early notifications in October could reduce year-end workflow bottleneck.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <BarChart3 size={20}/>
                <h4 className="font-bold text-sm uppercase">Resource Planning</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                February is the highest productivity window. Consider scheduling training or off-sites for the first two weeks.
              </p>
            </div>
          </div>
        </div>

        {/* Global Impact & Action */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-primary-gradient rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 space-y-8">
                <div>
                   <h4 className="text-2xl font-bold">Manager Advisory</h4>
                   <p className="text-white/60 text-sm mt-2">Recommended policy adjustments based on forecasted trends.</p>
                </div>
                
                <div className="space-y-4">
                   {[
                     "Enable stricter coverage limits for Dec 25-31",
                     "Notify Marketing team of low balance risks by Feb 15",
                     "Plan maintenance window for Feb 05-10"
                   ].map((adv, i) => (
                     <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8D5A3] mt-2 group-hover:scale-150 transition-all" />
                        <p className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">{adv}</p>
                     </div>
                   ))}
                </div>

                <button className="w-full bg-white text-[#3E3B6F] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#E8D5A3] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95">
                   Implement Advisories <ChevronRight size={16} />
                </button>
             </div>
             <TrendingUp size={240} className="absolute -bottom-16 -right-16 text-white/5 -rotate-12" />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-8 space-y-4 flex items-center gap-6">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <BarChart3 className="text-[#3E3B6F]" size={32} />
             </div>
             <div>
                <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Model Fidelity</h4>
                <p className="text-2xl font-bold text-[#3E3B6F]">94.2% <span className="text-xs text-indigo-400 font-medium italic">(High)</span></p>
                <p className="text-xs text-indigo-700/60 mt-1">Trained on {years * 12} data points including public holidays and historical rosters.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};