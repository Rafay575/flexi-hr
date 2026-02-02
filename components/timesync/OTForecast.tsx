import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ChevronDown, 
  Download, 
  Filter, 
  Clock, 
  DollarSign, 
  Zap, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Info,
  Layers,
  Users,
  Target,
  FileText,
  LineChart as LineIcon,
  // Added missing ChevronRight icon
  ChevronRight
} from 'lucide-react';

interface ForecastDay {
  date: string;
  historical?: number;
  forecast: number;
  isHigh: boolean;
  reason?: string;
}

const MOCK_FORECAST: ForecastDay[] = [
  { date: 'Jan 06', historical: 42, forecast: 45, isHigh: false },
  { date: 'Jan 07', historical: 38, forecast: 40, isHigh: false },
  { date: 'Jan 08', historical: 55, forecast: 52, isHigh: false },
  { date: 'Jan 09', historical: 48, forecast: 50, isHigh: false },
  { date: 'Jan 10', forecast: 65, isHigh: true, reason: 'Q1 Project Deadline' },
  { date: 'Jan 11', forecast: 40, isHigh: true, reason: 'Weekend Coverage Gap' },
  { date: 'Jan 12', forecast: 10, isHigh: false },
  { date: 'Jan 13', forecast: 48, isHigh: false },
  { date: 'Jan 14', forecast: 52, isHigh: false },
  { date: 'Jan 15', forecast: 55, isHigh: false },
  { date: 'Jan 16', forecast: 58, isHigh: false },
  { date: 'Jan 17', forecast: 72, isHigh: true, reason: 'Batch Processing Window' },
];

export const OTForecast: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('Engineering');
  const [period, setPeriod] = useState('Next 7 Days');

  const stats = {
    predictedHours: 320,
    predictedCost: 800000,
    confidence: 85,
    trend: '+12%'
  };

  const drivers = [
    { label: 'Project Deadline', pct: 40, color: 'bg-[#3E3B6F]' },
    { label: 'Leave Overlap', pct: 30, color: 'bg-indigo-400' },
    { label: 'Understaffing', pct: 20, color: 'bg-purple-400' },
    { label: 'Demand Increase', pct: 10, color: 'bg-pink-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3E3B6F] rounded-xl text-white shadow-lg">
            <LineIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">OT Forecast</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Predictive Engine v2.1 Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 text-xs font-bold text-[#3E3B6F] bg-transparent outline-none cursor-pointer border-r border-gray-100"
            >
              <option>Next 7 Days</option>
              <option>Next 14 Days</option>
              <option>Full Month</option>
            </select>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-transparent outline-none cursor-pointer"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Operations</option>
              <option>Sales</option>
            </select>
          </div>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Predicted OT Hours</p>
              <h3 className="text-3xl font-black text-gray-800 tabular-nums">{stats.predictedHours}h</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-red-500 text-[10px] font-black relative z-10">
            <ArrowUpRight size={14} /> {stats.trend} vs Last Period
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
            <Clock size={120} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Predicted Payroll Cost</p>
              <h3 className="text-3xl font-black text-gray-800 tabular-nums">PKR {(stats.predictedCost / 1000).toFixed(0)}k</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Est. Average PKR 2,500/hr</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
            <DollarSign size={120} />
          </div>
        </div>

        <div className="bg-primary-gradient p-6 rounded-3xl shadow-xl shadow-[#3E3B6F]/20 text-white relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Forecast Confidence</p>
              <h3 className="text-3xl font-black text-[#E8D5A3] tabular-nums">{stats.confidence}%</h3>
            </div>
            <div className="p-3 bg-white/10 text-[#E8D5A3] rounded-2xl group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-[10px] font-bold text-white/70">Historical Accuracy: High</span>
          </div>
          <Target size={120} className="absolute -right-8 -bottom-8 text-white/5 opacity-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART AREA */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-[#3E3B6F]" /> OT Volume Projection
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3E3B6F]"></div><span className="text-[9px] font-black text-gray-400 uppercase">Historical</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border-2 border-[#3E3B6F] border-dashed"></div><span className="text-[9px] font-black text-gray-400 uppercase">Forecast</span></div>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] flex items-end justify-between gap-2 relative border-b border-l border-gray-100 pt-10 px-2">
            {/* Confidence Band Shading (CSS Hack) */}
            <div className="absolute inset-x-2 bottom-0 bg-indigo-50/30 top-[40%] rounded-t-3xl pointer-events-none" />

            {MOCK_FORECAST.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Historical Line Segment (if available) */}
                {day.historical !== undefined && (
                  <div 
                    style={{ height: `${day.historical}%` }} 
                    className="absolute bottom-0 w-2 bg-[#3E3B6F] rounded-t-sm z-10 group-hover:opacity-100 opacity-60 transition-opacity"
                  />
                )}
                
                {/* Forecast Line Segment */}
                <div 
                  style={{ height: `${day.forecast}%` }} 
                  className={`w-2 border-l-2 border-r-2 border-t-2 border-dashed border-[#3E3B6F] rounded-t-sm bg-indigo-100/50 z-0 transition-all ${day.isHigh ? 'border-red-500 bg-red-50' : ''}`}
                >
                  {day.isHigh && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                       <AlertTriangle size={14} className="text-red-500 animate-bounce" />
                    </div>
                  )}
                </div>
                
                <span className="text-[8px] font-black text-gray-400 mt-3 uppercase whitespace-nowrap">{day.date}</span>
                
                {/* TOOLTIP */}
                <div className="absolute bottom-full mb-4 bg-gray-900 text-white rounded-xl p-3 z-20 shadow-2xl  transition-opacity pointer-events-none w-32">
                   <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">{day.date}</p>
                   <div className="space-y-1 text-[9px] font-bold">
                      <div className="flex justify-between"><span>Forecast:</span> <span>{day.forecast}h</span></div>
                      {day.reason && <div className="text-orange-400 mt-1 italic">Reason: {day.reason}</div>}
                   </div>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DRIVERS & RECOMMENDATIONS */}
        <div className="space-y-6">
          {/* DRIVERS CHART */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers size={16} /> OT Distribution Drivers
            </h3>
            <div className="space-y-5">
              {drivers.map(driver => (
                <div key={driver.label} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-gray-500">{driver.label}</span>
                    <span className="text-[#3E3B6F]">{driver.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${driver.color} transition-all duration-1000`} 
                      style={{ width: `${driver.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI RECOMMENDATIONS */}
          <div className="bg-[#3E3B6F] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col h-fit">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={80} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-[#E8D5A3]">
              <Info size={16} /> Optimization Steps
            </h3>
            <div className="space-y-4 relative z-10 mb-6">
               <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8D5A3] text-[#3E3B6F] flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <p className="text-[11px] font-medium text-white/80 leading-relaxed">Approve <span className="text-white font-bold">12 open shift claims</span> in Operations to mitigate understaffing risk.</p>
               </div>
               <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8D5A3] text-[#3E3B6F] flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <p className="text-[11px] font-medium text-white/80 leading-relaxed">Reschedule <span className="text-white font-bold">QA Regression testing</span> from Jan 10 to Jan 14.</p>
               </div>
               <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8D5A3] text-[#3E3B6F] flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <p className="text-[11px] font-medium text-white/80 leading-relaxed">Authorize <span className="text-white font-bold">Contractor Pool 4</span> for the Saturday coverage gap.</p>
               </div>
            </div>
            <button className="w-full py-3 bg-white text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Execute Optimization
            </button>
          </div>
        </div>
      </div>

      {/* HIGH OT DAYS SECTION */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-red-50/30 flex items-center justify-between">
           <h3 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
             <AlertTriangle size={16} /> Critical Predicted Peaks
           </h3>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Immediate Attention Required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
           <div className="p-8 flex items-center gap-8 group hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex flex-col items-center justify-center text-red-600 shrink-0">
                 <span className="text-[10px] font-black uppercase leading-none">JAN</span>
                 <span className="text-2xl font-black tabular-nums">10</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-base font-bold text-gray-800 mb-1">Friday Deadline Surge</h4>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <Clock size={14} className="text-gray-400" />
                       <span className="text-sm font-black text-red-600 tabular-nums">~65 Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Users size={14} className="text-gray-400" />
                       <span className="text-[11px] font-bold text-gray-500">22 Staff Impacted</span>
                    </div>
                 </div>
              </div>
              <button className="p-3 text-gray-300 hover:text-[#3E3B6F] transition-all"><ChevronRight size={24}/></button>
           </div>
           <div className="p-8 flex items-center gap-8 group hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex flex-col items-center justify-center text-orange-600 shrink-0">
                 <span className="text-[10px] font-black uppercase leading-none">JAN</span>
                 <span className="text-2xl font-black tabular-nums">11</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-base font-bold text-gray-800 mb-1">Saturday Coverage Gap</h4>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <Clock size={14} className="text-gray-400" />
                       <span className="text-sm font-black text-orange-600 tabular-nums">~40 Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Users size={14} className="text-gray-400" />
                       <span className="text-[11px] font-bold text-gray-500">8 Staff Impacted</span>
                    </div>
                 </div>
              </div>
              <button className="p-3 text-gray-300 hover:text-[#3E3B6F] transition-all"><ChevronRight size={24}/></button>
           </div>
        </div>
      </div>
    </div>
  );
};

const BarChart2: React.FC<{ size: number, className: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);