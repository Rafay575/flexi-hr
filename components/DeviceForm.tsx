
import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Settings2, 
  Database, 
  Cloud, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  RefreshCcw, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Zap,
  Globe,
  Save,
  Link
} from 'lucide-react';

interface DeviceFormProps {
  onClose: () => void;
  device?: any; // If present, we are in Edit mode
}

type TabId = 'BASIC' | 'LOCATION' | 'CONNECTION' | 'MAPPING' | 'SECURITY';

export const DeviceForm: React.FC<DeviceFormProps> = ({ onClose, device }) => {
  const [activeTab, setActiveTab] = useState<TabId>('BASIC');
  const [connectionType, setConnectionType] = useState<'PUSH' | 'PULL' | 'DB'>('PUSH');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'SUCCESS' | 'FAILED' | null>(null);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('SUCCESS');
    }, 1500);
  };

  const tabs = [
    { id: 'BASIC', label: 'Basic', icon: <Smartphone size={14} /> },
    { id: 'LOCATION', label: 'Location', icon: <MapPin size={14} /> },
    { id: 'CONNECTION', label: 'Connection', icon: <Cloud size={14} /> },
    { id: 'MAPPING', label: 'Mapping', icon: <Settings2 size={14} /> },
    { id: 'SECURITY', label: 'Security', icon: <ShieldCheck size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{device ? 'Edit Device' : 'Register New Device'}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hardware Node Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR TABS */}
          <div className="w-48 bg-gray-50 border-r border-gray-100 p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white shadow-sm text-[#3E3B6F]' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* FORM CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'BASIC' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hardware Device ID *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. ZK-402-FF" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Friendly Name *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none" placeholder="e.g. Main Lobby Terminal" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Device Type *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option>Biometric (Fingerprint)</option>
                      <option>Face Recognition</option>
                      <option>Card Reader (RFID)</option>
                      <option>Android Kiosk</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model / Make</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="e.g. ZKTeco SilkID" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Serial Number</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="SN-8829-XJ-2025" />
                </div>
              </div>
            )}

            {activeTab === 'LOCATION' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Site *</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option>Karachi HQ</option>
                      <option>Lahore Site</option>
                      <option>Islamabad DC</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Location Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="e.g. Server Room Entrance" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GPS Coordinates (Geofencing)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Latitude (e.g. 24.8607)" />
                    <input type="text" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Longitude (e.g. 67.0011)" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CONNECTION' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connection Protocol</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['PUSH', 'PULL', 'DB'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setConnectionType(type)}
                        className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-2 ${
                          connectionType === type ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        {type === 'PUSH' && <Zap size={18} />}
                        {type === 'PULL' && <RefreshCcw size={18} />}
                        {type === 'DB' && <Database size={18} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{type} API</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  {connectionType === 'PUSH' && (
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Webhook Endpoint (Read Only)</label>
                      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200">
                        <code className="text-[11px] font-bold text-indigo-600 truncate flex-1">https://api.timesync.io/v1/punches/push</code>
                        <Link size={14} className="text-gray-400" />
                      </div>
                      <p className="text-[9px] text-gray-400 italic">Configure this URL in your hardware's push settings.</p>
                    </div>
                  )}
                  {connectionType === 'PULL' && (
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cron Schedule Expression</label>
                      <input type="text" defaultValue="*/5 * * * *" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black tabular-nums" />
                      <p className="text-[9px] text-gray-400 italic">Current: "Every 5 minutes"</p>
                    </div>
                  )}
                  {connectionType === 'DB' && (
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DB Connection String</label>
                      <input type="password" value="************************" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-6 py-3 bg-white border-2 border-[#3E3B6F] text-[#3E3B6F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E3B6F] hover:text-white transition-all flex items-center gap-2"
                  >
                    {isTesting ? <RefreshCcw size={14} className="animate-spin" /> : <Activity size={14} />}
                    Test Connection
                  </button>
                  {testResult === 'SUCCESS' && (
                    <div className="flex items-center gap-2 text-green-600 animate-in slide-in-from-left-2">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Handshake Successful</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'MAPPING' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                  <Info size={18} className="text-orange-500 shrink-0" />
                  <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
                    Map JSON keys from the device payload to system attributes. Case sensitive.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID Key *</label>
                    <input type="text" defaultValue="emp_id" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp Key *</label>
                    <input type="text" defaultValue="event_time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Type (Direction) Key</label>
                    <input type="text" defaultValue="punch_type" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Device Identifier Key</label>
                    <input type="text" defaultValue="terminal_id" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SECURITY' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generated API Key</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value="TS_8892_AXL_00921820" className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs font-black tabular-nums text-gray-500" />
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-[#3E3B6F] hover:bg-gray-50 transition-all">Copy</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IP Whitelist (Optional)</label>
                  <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold tabular-nums" placeholder="Enter IP addresses separated by commas..." />
                  <p className="text-[9px] text-gray-400 font-medium">Restricts data processing to only these originating IPs.</p>
                </div>
                <div className="p-6 bg-[#3E3B6F]/5 border border-[#3E3B6F]/10 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={16} /> Advanced Safety
                  </h4>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-800">Deduplication Window</p>
                        <p className="text-[9px] text-gray-500">Ignore identical punches within X minutes.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="number" defaultValue="5" className="w-16 bg-white border border-gray-200 rounded-lg p-2 text-xs font-black text-center" />
                        <span className="text-[9px] font-bold text-gray-400">MINS</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-xs font-bold text-gray-800">Automatic Retry on Failure</p>
                     <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl shadow-sm h-fit">
            <Globe size={14} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Timezone: UTC +05:00</span>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
              Discard
            </button>
            <button className="px-10 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <Save size={18} /> {device ? 'Update Terminal' : 'Commit Terminal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
