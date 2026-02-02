
import React, { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  RefreshCcw, 
  MoreVertical, 
  Fingerprint, 
  ScanFace, 
  CreditCard, 
  Monitor, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  Signal, 
  Wifi, 
  WifiOff, 
  Settings2, 
  Database, 
  FileText, 
  Power,
  Users,
  LucideProps
} from 'lucide-react';
import { DeviceForm } from '../DeviceForm';

type DeviceType = 'BIOMETRIC' | 'FACE' | 'CARD' | 'KIOSK';
type DeviceStatus = 'ONLINE' | 'DELAYED' | 'OFFLINE';

interface DeviceRecord {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  lastSync: string;
  employeeCount: number;
  ipAddress: string;
  firmware: string;
}

const TYPE_CONFIG: Record<DeviceType, { label: string; icon: React.ReactNode; color: string }> = {
  BIOMETRIC: { label: 'Fingerprint', icon: <Fingerprint size={16} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  FACE: { label: 'Face Recognition', icon: <ScanFace size={16} />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  CARD: { label: 'Card Reader', icon: <CreditCard size={16} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  KIOSK: { label: 'Tablet Kiosk', icon: <Monitor size={16} />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
};

const STATUS_UI: Record<DeviceStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  ONLINE: { label: 'Online', color: 'text-green-600 bg-green-50', dot: 'bg-green-500', icon: <Wifi size={14} /> },
  DELAYED: { label: 'Delayed', color: 'text-orange-600 bg-orange-50', dot: 'bg-orange-500', icon: <Signal size={14} /> },
  OFFLINE: { label: 'Offline', color: 'text-red-600 bg-red-50', dot: 'bg-red-500', icon: <WifiOff size={14} /> },
};

const MOCK_DEVICES: DeviceRecord[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `DEV-${1000 + i}`,
  name: i === 0 ? 'Main Lobby Terminal' : i === 1 ? 'Production Gate A' : `Site Device #${i + 1}`,
  type: (['BIOMETRIC', 'FACE', 'CARD', 'KIOSK'] as DeviceType[])[i % 4],
  location: ['Karachi HQ', 'Lahore Site', 'Islamabad DC', 'Remote Hub'][i % 4],
  status: i < 20 ? 'ONLINE' : i < 23 ? 'DELAYED' : 'OFFLINE',
  lastSync: i < 5 ? `${i * 2} min ago` : '15 min ago',
  employeeCount: Math.floor(Math.random() * 200) + 50,
  ipAddress: `192.168.1.${100 + i}`,
  firmware: 'v4.2.1-stable'
}));

export const DeviceManagementList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceRecord | null>(null);

  const filteredItems = useMemo(() => {
    return MOCK_DEVICES.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleEdit = (device: DeviceRecord) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingDevice(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Smartphone className="text-[#3E3B6F]" size={28} /> Device Management
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest">
              <Activity size={10} className="animate-pulse" /> System Health: 92%
            </div>
            <p className="text-sm text-gray-500 font-medium italic">Configure and monitor hardware terminal synchronization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGlobalSync}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} /> Full System Sync
          </button>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Register Device
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', val: '25', icon: <Smartphone />, color: 'bg-[#3E3B6F]' },
          { label: 'Online Now', val: '23', pct: '92%', icon: <Wifi />, color: 'bg-green-500' },
          { label: 'Critical/Offline', val: '2', icon: <WifiOff />, color: 'bg-red-500' },
          { label: 'Last Sync', val: '5 min ago', icon: <RefreshCcw />, color: 'bg-indigo-500' },
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
              <h3 className="text-2xl font-black text-gray-800">{stat.val}</h3>
              {stat.pct && <span className="text-[10px] font-black text-green-500 mb-1">{stat.pct}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Name or IP Address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium border-none outline-none focus:ring-0"
          />
        </div>
        <div className="h-6 w-px bg-gray-100 hidden md:block"></div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['Type', 'Status', 'Location'].map(f => (
            <button key={f} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-white hover:border-gray-200 transition-all whitespace-nowrap">
              <Filter size={14} /> {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Device ID & Name</th>
                <th className="px-6 py-5">Technology</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Connectivity</th>
                <th className="px-6 py-5">Last Data Sync</th>
                <th className="px-6 py-5 text-center">Users Mapped</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${STATUS_UI[item.status].dot.replace('bg-', 'border-').replace('500', '100')} ${STATUS_UI[item.status].color}`}>
                        {TYPE_CONFIG[item.type].icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest tabular-nums">{item.id} • {item.ipAddress}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${TYPE_CONFIG[item.type].color}`}>
                      {TYPE_CONFIG[item.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <MapPin size={14} className="text-gray-300" />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_UI[item.status].color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_UI[item.status].dot} ${item.status === 'ONLINE' ? 'animate-pulse' : ''}`} />
                      {STATUS_UI[item.status].icon}
                      {STATUS_UI[item.status].label}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 tabular-nums">{item.lastSync}</span>
                      <span className="text-[9px] text-gray-400 font-medium">Automatic Interval</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-black text-indigo-700 tabular-nums">
                      <Users size={12} /> {item.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="Manual Sync"><RefreshCcw size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all" title="View Logs"><FileText size={16}/></button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" 
                        title="Settings"
                      >
                        <Settings2 size={16} />
                      </button>
                      <div className="w-px h-4 bg-gray-200 mx-1"></div>
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Deactivate"><Power size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center opacity-30">
              <Database size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Hardware Found</h3>
              <p className="text-sm font-medium mt-2">Adjust your filters or register a new terminal.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isFormOpen && (
        <DeviceForm 
          onClose={() => setIsFormOpen(false)} 
          device={editingDevice} 
        />
      )}

      {/* HEALTH LEGEND & HELP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 flex gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
               <ShieldCheck size={24} />
            </div>
            <div>
               <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-1">Encrypted Sync Active</h4>
               <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
                 All hardware communication uses <span className="font-bold">AES-256 encryption</span>. Data packets are reconciled every 60 seconds against the cloud master roster.
               </p>
            </div>
         </div>
         <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600 shrink-0">
               <AlertCircle size={24} />
            </div>
            <div>
               <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest mb-1">Hardware Alerts (2)</h4>
               <p className="text-[11px] text-orange-700/80 leading-relaxed font-medium">
                 <span className="font-bold">Site Device #24</span> reporting unstable latency (500ms). Please check local network backbone in Islamabad DC.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
