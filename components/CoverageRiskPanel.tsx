import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Calendar, 
  ChevronLeft, ChevronRight, Info, Zap, Sparkles,
  ArrowRight, User, Users, Filter, LayoutGrid, FileText
} from 'lucide-react';

interface RiskAlert {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  impact: string;
}

const MOCK_ALERTS: RiskAlert[] = [
  { 
    id: '1', 
    severity: 'High', 
    title: 'Dec 25-31 Peak Risk', 
    description: '8 requests pending across Engineering and Finance.', 
    impact: 'Coverage would drop to 35%' 
  },
  { 
    id: '2', 
    severity: 'Medium', 
    title: 'Marketing Overlap', 
    description: '3 overlapping requests for Jan 15.', 
    impact: 'Social media team 40% OOO' 
  },
  { 
    id: '3', 
    severity: 'Low', 
    title: 'Engineering Stability', 
    description: 'Adequate coverage confirmed for next 2 weeks.', 
    impact: 'Stable >85%' 
  },
];

export const CoverageRiskPanel = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'High': return 'bg-red-50 text-red-700 border-red-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl shadow-sm">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Coverage Risk Analysis</h2>
            <p className="text-gray-500 font-medium">AI-powered workforce availability monitoring and scheduling alerts.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-[#3E3B6F] text-white">30 Days</button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50">90 Days</button>
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#3E3B6F] shadow-sm transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Alerts List */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={14} /> Active Priority Alerts
          </h3>
          <div className="space-y-4">
            {MOCK_ALERTS.map((alert) => (
              <div key={alert.id} className={`p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] cursor-pointer ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'High' ? <AlertTriangle size={16} /> : alert.severity === 'Medium' ? <Info size={16} /> : <CheckCircle2 size={16} />}
                    <h4 className="font-bold">{alert.title}</h4>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-white/50 rounded border border-current opacity-70">{alert.severity} Priority</span>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-80 mb-4">{alert.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-current/10">
                   <span className="text-[10px] font-bold uppercase">{alert.impact}</span>
                   <button className="text-[10px] font-bold underline flex items-center gap-1">Analyze Deeply <ChevronRight size={10}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendation Section */}
          <div className="bg-[#3E3B6F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <Sparkles size={24} className="text-[#E8D5A3]" />
                   <h4 className="font-bold text-lg leading-tight uppercase tracking-widest text-xs">AI Recommendations</h4>
                </div>
                <div className="space-y-4">
                   {[
                     "Recommend approving Fatima's request first (Critical Lead role)",
                     "Suggest Ahmed shift dates to Jan 2-4 to balance coverage",
                     "Consider deferring Sara's request to the following week"
                   ].map((rec, i) => (
                     <div key={i} className="flex gap-3 group cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs text-white/80 font-medium group-hover:text-[#E8D5A3] transition-colors">{rec}</p>
                     </div>
                   ))}
                </div>
                <button className="w-full bg-[#E8D5A3] text-[#3E3B6F] py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-black/20">
                   Apply Smart Recommendations
                </button>
             </div>
             <Zap size={180} className="absolute -bottom-12 -right-12 text-white/5 -rotate-12" />
          </div>
        </div>

        {/* Heatmap Calendar */}
        <div className="lg:col-span-7 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white rounded-lg text-gray-400 transition-colors"><ChevronLeft size={20}/></button>
              <h3 className="text-xl font-bold text-gray-900">December 2024</h3>
              <button className="p-2 hover:bg-white rounded-lg text-gray-400 transition-colors"><ChevronRight size={20}/></button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500" /> <span className="text-[10px] font-bold text-gray-400 uppercase">80%</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500" /> <span className="text-[10px] font-bold text-gray-400 uppercase">60-80%</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500" /> <span className="text-[10px] font-bold text-gray-400 uppercase">60%</span></div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-7 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-4 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest border-b border-gray-50 bg-gray-50/30">{d}</div>
            ))}
            {/* Calendar Grid Logic Mock */}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isWeekend = (day + 6) % 7 === 0 || (day + 6) % 7 === 6;
              const riskScore = day >= 25 ? 'red' : day >= 15 && day <= 20 ? 'amber' : 'emerald';
              const riskColor = riskScore === 'red' ? 'bg-red-500 text-white' : riskScore === 'amber' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white';
              
              return (
                <div 
                  key={i}
                  onMouseEnter={() => setSelectedDate(day)}
                  className={`relative h-24 border-r border-b border-gray-50 flex flex-col p-3 transition-all cursor-crosshair group ${isWeekend ? 'bg-gray-50/50' : 'bg-white'}`}
                >
                   <span className="text-xs font-bold text-gray-400">{day}</span>
                   {!isWeekend && (
                     <div className={`mt-auto h-2 w-full rounded-full ${riskScore === 'red' ? 'bg-red-100' : riskScore === 'amber' ? 'bg-amber-100' : 'bg-emerald-100'} overflow-hidden`}>
                        <div className={`h-full ${riskScore === 'red' ? 'bg-red-500' : riskScore === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'} transition-all`} style={{ width: `${day >= 25 ? '35' : day >= 15 ? '68' : '94'}%` }} />
                     </div>
                   )}
                   {/* Tooltip Overlay Mock */}
                   <div className="absolute inset-0 z-20 bg-[#3E3B6F]  transition-all p-3 flex flex-col justify-between text-white scale-95 group-hover:scale-100 rounded-lg pointer-events-none">
                      <p className="text-[10px] font-bold uppercase tracking-widest">Coverage Info</p>
                      <div>
                        <p className="text-xl font-bold">{day >= 25 ? '35%' : day >= 15 ? '68%' : '94%'}</p>
                        <p className="text-[8px] opacity-70">Active + Pending</p>
                      </div>
                      <div className="flex -space-x-1">
                         {[1,2,3].map(j => <div key={j} className="w-5 h-5 rounded-full border-2 border-[#3E3B6F] bg-accent-peach flex items-center justify-center text-[6px] font-bold text-[#3E3B6F]">U</div>)}
                      </div>
                   </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 bg-gray-50/50 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                   <Users size={20} className="text-[#3E3B6F]" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Global Coverage Avg.</p>
                   <p className="text-2xl font-bold text-gray-900">82.4%</p>
                </div>
             </div>
             {/* Added missing FileText import in lucide-react above */}
             <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2">
                <FileText size={16}/> Export Coverage Heatmap
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};