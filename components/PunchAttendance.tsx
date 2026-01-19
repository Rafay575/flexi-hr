
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Camera, 
  QrCode, 
  Monitor, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RefreshCcw,
  Navigation
} from 'lucide-react';

type PunchMethod = 'GEO' | 'SELFIE' | 'QR' | 'WEB' | 'BIOMETRIC';

export const PunchAttendance: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMethod, setActiveMethod] = useState<PunchMethod | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = () => {
    // Mock punch processing
    setIsSuccess(true);
  };

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl border border-green-100 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-100">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Punch Recorded!</h2>
        <p className="text-gray-500 mb-8 font-medium">Your attendance has been synced successfully.</p>
        
        <div className="w-full max-w-sm space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest">Type</span>
            <span className="font-bold text-gray-800">Punch In</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest">Time</span>
            <span className="font-bold text-gray-800">{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest">Method</span>
            <span className="font-bold text-[#3E3B6F]">{activeMethod}-Verification</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest">Location</span>
            <span className="font-bold text-green-600">Office HQ</span>
          </div>
        </div>

        <button 
          onClick={() => { setIsSuccess(false); setActiveMethod(null); }}
          className="mt-8 px-8 py-3 bg-primary-gradient text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          View Today's Status
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Punch Attendance</h2>
          <p className="text-gray-500 font-medium">Select a verification method to record your presence</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <Clock size={24} className="text-[#3E3B6F]" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Server Time</p>
            <p className="text-xl font-bold text-gray-800 tabular-nums">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* OPTION 1: GEO PUNCH */}
        <div className={`bg-white rounded-2xl border-2 transition-all p-6 cursor-pointer hover:shadow-xl ${activeMethod === 'GEO' ? 'border-[#3E3B6F] ring-4 ring-[#3E3B6F]/5' : 'border-gray-100'}`} onClick={() => setActiveMethod('GEO')}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${activeMethod === 'GEO' ? 'bg-[#3E3B6F] text-white' : 'bg-blue-50 text-blue-600'}`}>
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Location Punch</h3>
          </div>
          
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-200">
               <Navigation className="text-blue-500 animate-pulse" size={32} />
               <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold flex justify-between">
                 <span className="text-gray-500">Distance: 15m</span>
                 <span className="text-green-600">Within Geofence ✓</span>
               </div>
            </div>
            {activeMethod === 'GEO' && (
              <button onClick={handlePunch} className="w-full bg-[#3E3B6F] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 animate-in slide-in-from-top-2">
                Punch In
              </button>
            )}
          </div>
        </div>

        {/* OPTION 2: SELFIE PUNCH */}
        <div className={`bg-white rounded-2xl border-2 transition-all p-6 cursor-pointer hover:shadow-xl ${activeMethod === 'SELFIE' ? 'border-[#3E3B6F] ring-4 ring-[#3E3B6F]/5' : 'border-gray-100'}`} onClick={() => { setActiveMethod('SELFIE'); startCamera(); }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${activeMethod === 'SELFIE' ? 'bg-[#3E3B6F] text-white' : 'bg-purple-50 text-purple-600'}`}>
              <Camera size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Selfie Punch</h3>
          </div>

          <div className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
              {isCapturing ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera size={32} className="text-white/20 mx-auto mb-2" />
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Verify Identity</p>
                </div>
              )}
            </div>
            {activeMethod === 'SELFIE' && (
              <button onClick={handlePunch} className="w-full bg-[#3E3B6F] text-white py-3 rounded-xl font-bold shadow-lg animate-in slide-in-from-top-2 flex items-center justify-center gap-2">
                <Camera size={18} /> Capture & Punch
              </button>
            )}
          </div>
        </div>

        {/* OPTION 4: WEB PUNCH */}
        <div className={`bg-white rounded-2xl border-2 transition-all p-6 cursor-pointer hover:shadow-xl ${activeMethod === 'WEB' ? 'border-[#3E3B6F] ring-4 ring-[#3E3B6F]/5' : 'border-gray-100'}`} onClick={() => setActiveMethod('WEB')}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${activeMethod === 'WEB' ? 'bg-[#3E3B6F] text-white' : 'bg-green-50 text-green-600'}`}>
              <Monitor size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Web Punch</h3>
          </div>

          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <Monitor size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workstation IP</p>
                <p className="text-sm font-bold text-gray-800">192.168.1.142 <span className="text-green-500">✓</span></p>
              </div>
            </div>
            {activeMethod === 'WEB' && (
              <button onClick={handlePunch} className="w-full bg-[#3E3B6F] text-white py-3 rounded-xl font-bold shadow-lg animate-in slide-in-from-top-2">
                Record Entry
              </button>
            )}
          </div>
        </div>

        {/* OPTION 5: BIOMETRIC MESSAGE */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 border-dashed p-6 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
              <Fingerprint size={24} />
            </div>
            <h3 className="font-bold text-gray-400">Biometric Required</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Your site policies require a biometric punch. Please use the terminal at:
              </p>
              <ul className="space-y-2">
                <li className="text-[11px] font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Main Entrance (Dev #1)
                </li>
                <li className="text-[11px] font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Back Gate (Dev #2)
                </li>
              </ul>
            </div>
            <button className="w-full py-2 text-xs font-bold text-primary hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100">
              Having issues? Report Problem
            </button>
          </div>
        </div>

        {/* QR SCANNER (Placeholder UI) */}
        <div className={`bg-white rounded-2xl border-2 transition-all p-6 cursor-pointer hover:shadow-xl ${activeMethod === 'QR' ? 'border-[#3E3B6F] ring-4 ring-[#3E3B6F]/5' : 'border-gray-100'}`} onClick={() => setActiveMethod('QR')}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${activeMethod === 'QR' ? 'bg-[#3E3B6F] text-white' : 'bg-orange-50 text-orange-600'}`}>
              <QrCode size={24} />
            </div>
            <h3 className="font-bold text-gray-800">QR Scanner</h3>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 group hover:border-orange-200 transition-colors">
            <QrCode size={48} className="text-gray-200 group-hover:text-orange-400 transition-colors" />
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-4">Open Scanner</p>
          </div>
        </div>

      </div>

      {/* ANOMALY ALERT */}
      <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 animate-pulse">
        <AlertCircle className="text-red-500 shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold text-red-800">Outside Geofence Alert</p>
          <p className="text-xs text-red-600">You are currently 250m outside the Office HQ geofence. Use Selfie-Punch or request an exception if working remotely.</p>
        </div>
      </div>
    </div>
  );
};
