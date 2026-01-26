import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Search, 
  Filter, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  History, 
  TrendingUp, 
  MapPin, 
  Smartphone, 
  Fingerprint, 
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  Clock,
  Activity,
  UserX,
  Target,
  FileSearch,
  Crosshair,
  X,
  ShieldCheck
} from 'lucide-react';

const Users2: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

type AnomalyType = 'BUDDY_PUNCHING' | 'TIME_MANIPULATION' | 'PATTERN_ANOMALY' | 'LOCATION_FRAUD';
type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface AIAnomaly {
  id: string;
  employee: { name: string; avatar: string; id: string };
  type: AnomalyType;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  evidence: string;
  dataPoints: string[];
  status: 'PENDING' | 'INVESTIGATING' | 'CONFIRMED' | 'DISMISSED';
  detectedAt: string;
}

const TYPE_CONFIG: Record<AnomalyType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  BUDDY_PUNCHING: { label: 'Buddy Punching', icon: <Users2 size={16} />, color: 'text-red-600', bgColor: 'bg-red-50 border-red-100' },
  TIME_MANIPULATION: { label: 'Time Manipulation', icon: <History size={16} />, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-100' },
  PATTERN_ANOMALY: { label: 'Pattern Anomaly', icon: <TrendingUp size={16} />, color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-100' },
  LOCATION_FRAUD: { label: 'Location Fraud', icon: <MapPin size={16} />, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-100' },
};

const MOCK_ANOMALIES: AIAnomaly[] = [
  {
    id: 'AI-901',
    employee: { name: 'Michael Chen', avatar: 'MC', id: 'FLX-204' },
    type: 'BUDDY_PUNCHING',
    confidence: 94,
    confidenceLevel: 'HIGH',
    evidence: 'Same hardware ID used for 3 different employees within 12 seconds.',
    dataPoints: ['Device ID: #ZK-402', 'IP: 192.168.1.42', 'Interval: 4s, 3s, 5s'],
    status: 'PENDING',
    detectedAt: 'Today, 09:05 AM'
  },
  {
    id: 'AI-902',
    employee: { name: 'Sarah Jenkins', avatar: 'SJ', id: 'FLX-001' },
    type: 'LOCATION_FRAUD',
    confidence: 82,
    confidenceLevel: 'MEDIUM',
    evidence: 'Impossible travel velocity detected between consecutive geo-punches.',
    dataPoints: ['Point A: HQ (09:00)', 'Point B: Client X (09:05)', 'Distance: 12km'],
    status: 'INVESTIGATING',
    detectedAt: 'Today, 09:15 AM'
  },
  {
    id: 'AI-903',
    employee: { name: 'Elena Rodriguez', avatar: 'ER', id: 'FLX-045' },
    type: 'PATTERN_ANOMALY',
    confidence: 75,
    confidenceLevel: 'MEDIUM',
    evidence: 'Employee consistently arrives exactly 14 minutes late (1 min before penalty).',
    dataPoints: ['Occurrence: 12/14 days', 'Avg Delay: 14.2m', 'Standard Dev: 0.2m'],
    status: 'PENDING',
    detectedAt: 'Jan 14, 2025'
  },
  {
    id: 'AI-904',
    employee: { name: 'David Miller', avatar: 'DM', id: 'FLX-089' },
    type: 'TIME_MANIPULATION',
    confidence: 91,
    confidenceLevel: 'HIGH',
    evidence: 'Retroactive punch added via system bypass; local device clock drift detected.',
    dataPoints: ['Method: Manual SQL', 'Clock Offset: -180s', 'Authorized: NO'],
    status: 'PENDING',
    detectedAt: 'Jan 13, 2025'
  },
];

export const AIAnomalyDetection: React.FC = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AIAnomaly | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">AI Anomaly Detection</h2>
            <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-purple-200 uppercase tracking-widest">PRO</span>
          </div>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Neural engine scanning for fraud, clock manipulation, and impossible travel</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            <Activity size={16} className="text-purple-400" /> System Re-Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Zap size={20}/></div>
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Neural Watchlist</h3>
               </div>
               <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                    type="text" 
                    placeholder="Filter by employee or ID..." 
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium w-48 focus:ring-4 focus:ring-purple-500/5 outline-none" 
                   />
                 </div>
                 <button className="p-2 text-gray-400 hover:text-purple-600 bg-white border border-gray-200 rounded-xl shadow-sm transition-all"><Filter size={16}/></button>
               </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/30">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-5">Confidence</th>
                    <th className="px-6 py-5">Employee</th>
                    <th className="px-6 py-5">Anomaly Type</th>
                    <th className="px-6 py-5">Evidence Summary</th>
                    <th className="px-6 py-5">Detected</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ANOMALIES.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedAnomaly(item)}
                      className={`group hover:bg-purple-50/30 transition-all cursor-pointer ${selectedAnomaly?.id === item.id ? 'bg-purple-50/50' : ''}`}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className={`w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden relative`}>
                              <div 
                                style={{ width: `${item.confidence}%` }} 
                                className={`h-full transition-all ${item.confidenceLevel === 'HIGH' ? 'bg-red-500' : item.confidenceLevel === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'}`} 
                              />
                           </div>
                           <span className={`text-[11px] font-black tabular-nums ${item.confidenceLevel === 'HIGH' ? 'text-red-600' : 'text-gray-600'}`}>
                             {item.confidence}%
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                            {item.employee.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{item.employee.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{item.employee.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${TYPE_CONFIG[item.type].bgColor} ${TYPE_CONFIG[item.type].color}`}>
                           {TYPE_CONFIG[item.type].icon}
                           {TYPE_CONFIG[item.type].label}
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="text-[11px] text-gray-600 font-medium line-clamp-1 italic">"{item.evidence}"</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tabular-nums">{item.detectedAt}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-white rounded-lg shadow-none hover:shadow-sm transition-all"><Eye size={16}/></button>
                           <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"><XCircle size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedAnomaly ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-gray-100 bg-[#3E3B6F] text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <Cpu size={18} className="text-purple-400 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest">AI Forensics</h3>
                </div>
                <button onClick={() => setSelectedAnomaly(null)} className="p-1 hover:bg-white/10 rounded-full transition-all text-white/60"><X size={18}/></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pattern Strength</h4>
                    <span className="text-lg font-black text-[#3E3B6F] tabular-nums">{selectedAnomaly.confidence}%</span>
                  </div>
                  <div className="p-5 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 space-y-4">
                     {selectedAnomaly.dataPoints.map((dp, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="text-[11px] font-bold text-gray-700 tabular-nums">{dp}</span>
                       </div>
                     ))}
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Clock size={14} /> Timeline Analysis
                   </h4>
                   <div className="h-24 bg-purple-50/50 rounded-2xl border border-purple-100 p-4 relative overflow-hidden flex items-end gap-1">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const h = Math.random() * 60 + 20;
                        const isAnomalous = i === 9 || i === 18;
                        return (
                          <div 
                            key={i} 
                            style={{ height: `${h}%` }} 
                            className={`flex-1 rounded-t-sm transition-all ${isAnomalous ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] h-full' : 'bg-purple-300 opacity-30'}`}
                          />
                        )
                      })}
                   </div>
                </div>

                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-3">
                   <div className="flex items-center gap-3 text-indigo-700">
                      <Target size={18} />
                      <h5 className="text-xs font-black uppercase tracking-widest">System Recommendation</h5>
                   </div>
                   <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
                     The regularity of this behavior suggests <span className="font-bold underline">intentional policy exploitation</span>. We recommend marking this as a violation.
                   </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3 shrink-0">
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95 transition-all">
                    Confirm Fraud
                  </button>
                  <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center opacity-30 min-h-[500px]">
              <FileSearch size={64} className="text-gray-300 mb-6" />
              <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest">AI Investigator</h3>
              <p className="text-xs font-medium text-gray-400 mt-2 max-w-[200px]">Select an anomaly from the neural watchlist to see the AI evidence trail.</p>
            </div>
          )}

          <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl flex gap-4">
             <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                <ShieldCheck size={20} className="text-purple-600" />
             </div>
             <div className="flex-1">
                <p className="text-xs font-black text-purple-900 uppercase tracking-widest mb-1">Neural Guard v4.2</p>
                <p className="text-[10px] text-purple-700/80 leading-relaxed font-medium">
                   Engine is processing <span className="font-bold">8,500 punches</span> per hour.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};