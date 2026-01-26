import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  Clock, 
  RefreshCcw, 
  ShieldAlert, 
  Server, 
  Users, 
  ChevronRight, 
  Bell, 
  CheckCircle2, 
  ArrowUpRight, 
  MonitorSmartphone, 
  SignalHigh, 
  Settings, 
  MoreVertical,
  LucideProps
} from 'lucide-react';

interface DeviceStatus {
  id: string;
  name: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  lastSync: string;
  latency: string;
}

const MOCK_DEVICES: DeviceStatus[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `DEV-${1000 + i}`,
  name: i % 5 === 0 ? `Terminal Site ${i}` : `Gate Node ${i}`,
  status: i === 3 || i === 12 ? 'WARNING' : i === 7 || i === 21 ? 'OFFLINE' : 'ONLINE',
  lastSync: i % 4 === 0 ? '2m ago' : '45s ago',
  latency: `${Math.floor(Math.random() * 200 + 50)}ms`
}));

const ALERT_DATA = [
  { time: '2 min ago', device: 'Factory-D3', type: 'Offline', severity: 'HIGH', icon: <WifiOff size={14}/> },
  { time: '15 min ago', device: 'Main-D1', type: 'High reject rate', severity: 'MEDIUM', icon: <AlertCircle size={14}/> },
  { time: '1h ago', device: 'Hub-South', type: 'Memory High', severity: 'LOW', icon: <Activity size={14}/> },
];

export const DeviceHealthDashboard: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [hoveredDevice, setHovered] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Activity className="text-[#3E3B6F]" size={28} /> Device Health Monitor
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Real-time telemetry and hardware node status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <RefreshCcw size={14} className={`text-gray-400 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Refresh (1m)</span>
            <div 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-8 h-4 rounded-full relative p-0.5 cursor-pointer transition-all ${autoRefresh ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-all ${autoRefresh ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Devices Online', val: '23/25', pct: '92%', icon: <Wifi />, color: 'bg-green-500' },
          { label: 'Avg Sync Delay', val: '2.3', unit: 'min', icon: <Clock />, color: 'bg-indigo-500' },
          { label: 'Errors Today', val: '5', icon: <ShieldAlert />, color: 'bg-red-500' },
          { label: 'Unknown Users', val: '12', icon: <Users />, color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm group">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 rounded-lg text-white ${stat.color} shadow-lg transition-transform group-hover:scale-110`}>
                {/* Fixed: Use type assertion to cast ReactNode to ReactElement<LucideProps> for cloning with size prop */}
                {React.cloneElement(stat.icon as React.ReactElement<LucideProps>, { size: 16 })}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-black text-gray-800 tabular-nums">{stat.val}</h3>
              {stat.pct ? <span className="text-[10px] font-black text-green-500 mb-1">{stat.pct}</span> : <span className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* STATUS GRID */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <MonitorSmartphone size={16} className="text-[#3E3B6F]" /> Hardware Infrastructure Grid
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[9px] font-black text-gray-400 uppercase">Healthy</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-[9px] font-black text-gray-400 uppercase">Lag</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[9px] font-black text-gray-400 uppercase">Down</span></div>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            {MOCK_DEVICES.map((dev) => (
              <div 
                key={dev.id}
                onMouseEnter={() => setHovered(dev.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative group flex flex-col items-center"
              >
                <div className={`w-10 h-10 rounded-xl cursor-pointer transition-all hover:scale-110 shadow-sm border-2 ${
                  dev.status === 'ONLINE' ? 'bg-green-50 border-green-200 text-green-600' :
                  dev.status === 'WARNING' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                  'bg-red-50 border-red-200 text-red-600'
                } flex items-center justify-center`}>
                  <Server size={18} />
                </div>
                
                {hoveredDevice === dev.id && (
                  <div className="absolute bottom-full mb-3 w-40 bg-gray-900/95 backdrop-blur text-white rounded-xl p-3 z-50 shadow-2xl animate-in fade-in zoom-in duration-200 pointer-events-none text-left">
                    <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">{dev.id}</p>
                    <p className="text-xs font-bold mb-2 truncate">{dev.name}</p>
                    <div className="space-y-1 text-[9px] font-bold">
                       <div className="flex justify-between text-gray-400"><span>Status:</span> <span className={dev.status === 'ONLINE' ? 'text-green-400' : 'text-orange-400'}>{dev.status}</span></div>
                       <div className="flex justify-between text-gray-400"><span>Last Sync:</span> <span>{dev.lastSync}</span></div>
                       <div className="flex justify-between text-gray-400"><span>Latency:</span> <span>{dev.latency}</span></div>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-4">
             <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <SignalHigh size={16} className="text-[#3E3B6F]" /> Sync Event Timeline (24h)
             </h3>
             <div className="h-32 bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-end gap-1 relative overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-sm transition-all hover:opacity-100 ${
                      i % 12 === 0 ? 'bg-red-400 opacity-80 h-1/2' : 'bg-indigo-400 opacity-40 h-2/3'
                    }`}
                    style={{ height: `${Math.random() * 60 + 30}%` }}
                    title={`Interval ${i}: 100% Success`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 px-4 py-1 flex justify-between text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                   <span>00:00</span>
                   <span>06:00</span>
                   <span>12:00</span>
                   <span>18:00</span>
                   <span>23:59</span>
                </div>
             </div>
          </div>
        </div>

        {/* ALERTS SECTION */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                 <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Bell size={16} className="text-red-500" /> Active Health Alerts
                 </h3>
                 <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">3</span>
              </div>
              
              <div className="p-2 divide-y divide-gray-50">
                 {ALERT_DATA.map((alert, i) => (
                   <div key={i} className="p-4 hover:bg-gray-50 transition-all group rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                           alert.severity === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                         }`}>
                           {alert.severity}
                         </span>
                         <span className="text-[9px] font-bold text-gray-400 tabular-nums">{alert.time}</span>
                      </div>
                      <div className="flex gap-3">
                         <div className={`mt-0.5 text-gray-400`}>
                           {alert.icon}
                         </div>
                         <div className="flex-1">
                            <p className="text-xs font-bold text-gray-800">{alert.device}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{alert.type}</p>
                         </div>
                         <button className="p-2 opacity-0 group-hover:opacity-100 transition-all text-indigo-600">
                           <ArrowUpRight size={14} />
                         </button>
                      </div>
                      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button className="flex-1 py-1.5 bg-[#3E3B6F] text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Diagnose</button>
                         <button className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Ignore</button>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100 text-center">
                 <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                    View Alert History <ChevronRight size={12} className="inline ml-1" />
                 </button>
              </div>
           </div>

           <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm h-fit">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
              <div className="flex-1">
                 <p className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Infrastructure Health</p>
                 <p className="text-[10px] text-indigo-600/80 leading-relaxed font-medium">
                    Cloud broker is responding in <span className="font-bold">12ms</span>. All worker threads are operational. Database indexing completed at 09:00 AM.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};