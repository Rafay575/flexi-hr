
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Fingerprint, 
  Camera, 
  Monitor, 
  QrCode, 
  Nfc, 
  MapPin, 
  Plus, 
  MoreVertical, 
  Building2, 
  User, 
  ChevronRight, 
  Save, 
  Settings2, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  X,
  // Added missing Zap icon import
  Zap
} from 'lucide-react';

type MethodId = 'BIOMETRIC' | 'GEO' | 'SELFIE' | 'WEB' | 'QR' | 'NFC';

interface MethodDef {
  id: MethodId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const METHODS: MethodDef[] = [
  { id: 'BIOMETRIC', label: 'Biometric/Device', icon: <Fingerprint size={20} />, description: 'Hardware terminals (Finger/Face)' },
  { id: 'GEO', label: 'Mobile Geo', icon: <MapPin size={20} />, description: 'GPS verified mobile punch' },
  { id: 'SELFIE', label: 'Mobile Selfie', icon: <Camera size={20} />, description: 'Facial capture via mobile app' },
  { id: 'WEB', label: 'Web Punch', icon: <Monitor size={20} />, description: 'Browser based workstation punch' },
  { id: 'QR', label: 'QR/Kiosk', icon: <QrCode size={20} />, description: 'Scan dynamic QR at site kiosk' },
  { id: 'NFC', label: 'NFC/Badge', icon: <Nfc size={20} />, description: 'Contactless RFID/NFC cards' },
];

export const PunchMethodsConfig: React.FC = () => {
  const [enabledMethods, setEnabledMethods] = useState<Set<MethodId>>(new Set(['BIOMETRIC', 'GEO', 'SELFIE']));
  const [activeDetail, setActiveDetail] = useState<MethodId>('GEO');

  const toggleMethod = (id: MethodId) => {
    const next = new Set(enabledMethods);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setEnabledMethods(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#3E3B6F]" size={28} /> Punch Method Policy
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Govern how employees authenticate their presence across different sites</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Save size={18} /> Save Global Policy
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* COMPANY DEFAULT */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={16} /> Company Default Methods
              </h3>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Primary Organization Baseline</span>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {METHODS.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => toggleMethod(m.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      enabledMethods.has(m.id) ? 'border-[#3E3B6F] bg-[#3E3B6F]/5' : 'border-gray-50 bg-white hover:border-gray-100'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${enabledMethods.has(m.id) ? 'bg-[#3E3B6F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-black text-gray-800 tracking-tight">{m.label}</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${enabledMethods.has(m.id) ? 'border-[#3E3B6F] bg-[#3E3B6F]' : 'border-gray-200'}`}>
                          {enabledMethods.has(m.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
                  These methods are enabled globally. You can define stricter requirements (e.g. Biometric Only) or exceptions (e.g. Web Punch) at the site or individual employee level below.
                </p>
              </div>
            </div>
          </div>

          {/* SITE OVERRIDES */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={16} /> Site Specific Overrides
              </h3>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest hover:underline">
                <Plus size={14} /> Add Site Override
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4">Site Name</th>
                    <th className="px-6 py-4">Override Active</th>
                    <th className="px-6 py-4">Allowed Methods</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { site: 'Factory HQ', override: true, methods: 'Biometric Only', color: 'text-red-600 bg-red-50' },
                    { site: 'Field Office', override: true, methods: 'Geo, Selfie', color: 'text-blue-600 bg-blue-50' },
                    { site: 'Head Office', override: false, methods: '(Company Default)', color: 'text-gray-400 bg-gray-50' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-4 text-xs font-bold text-gray-800">{row.site}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${row.override ? 'text-indigo-600 bg-indigo-50' : 'text-gray-300 bg-gray-100'}`}>
                          {row.override ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg border uppercase tracking-tighter ${row.color}`}>
                          {row.methods}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-300 hover:text-[#3E3B6F] opacity-0 group-hover:opacity-100 transition-all"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EMPLOYEE OVERRIDES */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <User size={16} /> Employee Overrides
              </h3>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest hover:underline">
                <Plus size={14} /> Add Employee Override
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4">Employee</th>
                    <th className="px-6 py-4">Override</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Approved By</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                        <div className="w-6 h-6 rounded bg-[#3E3B6F] text-white flex items-center justify-center text-[8px] font-black uppercase tracking-widest">AK</div>
                        Ahmed Khan
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-tighter">Web Punch Added</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-gray-500 font-medium italic">"Working from home (Medical)"</td>
                    <td className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tabular-nums">Jane Doe (HR) • Jan 01</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* METHOD DETAILS SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-[#3E3B6F] text-white flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 {/* Corrected: Zap is now imported */}
                 <Zap size={16} className="text-[#E8D5A3]" /> Technical Logic
               </h3>
               <select 
                value={activeDetail} 
                onChange={(e) => setActiveDetail(e.target.value as MethodId)}
                className="bg-white/10 border-none text-[10px] font-bold rounded-lg px-2 py-1 outline-none text-white cursor-pointer"
               >
                 {METHODS.map(m => <option key={m.id} value={m.id} className="text-gray-800">{m.label}</option>)}
               </select>
            </div>

            <div className="p-8 space-y-8 min-h-[500px]">
              {activeDetail === 'GEO' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Geofence Accuracy</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Radius</p>
                        <div className="relative">
                          <input type="number" defaultValue="200" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">M</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Threshold</p>
                        <div className="relative">
                          <input type="number" defaultValue="50" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">M</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-700">Allow outside with reason</span>
                      <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-700">Enforce Mock GPS check</span>
                      <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetail === 'SELFIE' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Camera size={18} className="text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-900">AI Face Verification</span>
                    </div>
                    <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage Policy</label>
                     <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-[11px] font-bold text-gray-600">Retain Image</span>
                           <div className="w-8 h-4 bg-gray-200 rounded-full relative p-0.5 cursor-pointer">
                              <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 shadow-sm"></div>
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-gray-400">Retention Period</span>
                           <span className="font-black text-[#3E3B6F]">90 Days</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                     <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                     <p className="text-[9px] text-orange-700 leading-relaxed font-medium">Liveness check (Blink/Smile) is enabled by default to prevent photo-spoofing.</p>
                  </div>
                </div>
              )}

              {activeDetail === 'WEB' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <span className="text-xs font-bold text-gray-700">IP White-listing</span>
                    <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Allowed IP Ranges</label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold tabular-nums h-24" 
                      placeholder="192.168.1.1&#10;112.54.21.0/24"
                    />
                    <p className="text-[9px] text-gray-400 italic">"Punches from other IPs will be flagged as Geo Violations."</p>
                  </div>
                </div>
              )}

              {activeDetail === 'QR' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">QR Refresh Interval</label>
                    <div className="relative">
                      <input type="number" defaultValue="30" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seconds</span>
                    </div>
                    <p className="text-[9px] text-gray-400 italic mt-1">Short intervals prevent sharing of static QR codes.</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <span className="text-xs font-bold text-gray-700">Require PIN after scan</span>
                    <div className="w-10 h-5 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-3">
              <Lock size={14} className="text-gray-400" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Encrypted Logic Engine v4.2</p>
            </div>
          </div>

          <div className="bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 p-6 rounded-3xl">
             <div className="flex gap-4">
                <ShieldCheck size={20} className="text-[#3E3B6F] shrink-0 mt-1" />
                <div>
                   <h4 className="text-xs font-black text-[#3E3B6F] uppercase tracking-widest mb-1">Security Audit</h4>
                   <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                     Your configuration currently uses <span className="font-bold underline">Three-Factor Auth</span> (Device + Mobile + Selfie) for Factory staff, which is the recommended security posture.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
