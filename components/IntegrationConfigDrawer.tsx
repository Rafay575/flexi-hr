import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Save, 
  RefreshCcw, 
  Info,
  CheckCircle2,
  Database,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

interface IntegrationConfigDrawerProps {
  integrationId: string;
  name: string;
  onClose: () => void;
}

export const IntegrationConfigDrawer: React.FC<IntegrationConfigDrawerProps> = ({ integrationId, name, onClose }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(false);

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult(true);
    }, 1500);
  };

  const renderPayEdge = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payroll Mapping</h4>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">OT Earning Head</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-4 focus:ring-[#3E3B6F]/5">
              <option>OT_PREMIUM_BASIC</option>
              <option>OVERTIME_WAGES_L1</option>
              <option>SPECIAL_DUTY_HOURS</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">Absence Deduction Head</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-4 focus:ring-[#3E3B6F]/5">
              <option>ABSENCE_DEDUCT_01</option>
              <option>UNPAID_LEAVE_ADJ</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">Late Penalty Head</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-4 focus:ring-[#3E3B6F]/5">
              <option>ATTN_PENALTY_LATE</option>
              <option>PUNCTUALITY_ADJ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Automation</h4>
        <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">Sync Frequency</span>
            <select className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-black uppercase">
              <option>Every 6 Hours</option>
              <option>Daily at Midnight</option>
              <option>On Demand Only</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-gray-700">Include Pending OT</p>
              <p className="text-[9px] text-gray-400">Sync requests awaiting approval</p>
            </div>
            <div className="w-10 h-5 bg-gray-200 rounded-full relative p-1 cursor-pointer">
              <div className="w-3 h-3 bg-white rounded-full absolute left-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaveEase = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status Overlays</h4>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase">
              <tr>
                <th className="p-3">LeaveEase Status</th>
                <th className="p-3">TimeSync Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-bold text-gray-700">
              <tr>
                <td className="p-3">Approved Leave</td>
                <td className="p-3 text-indigo-600 uppercase text-[10px]">On Leave (No Punch Req)</td>
              </tr>
              <tr>
                <td className="p-3">Pending Request</td>
                <td className="p-3 text-gray-400 uppercase text-[10px]">Working (No Overlay)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <p className="text-xs font-black text-indigo-900 uppercase">Reprocess on Approval</p>
            <p className="text-[10px] text-indigo-700 font-medium leading-tight">Retroactively fix attendance status once leave is approved.</p>
          </div>
          <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
            <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPeopleHub = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Master Data Sync Fields</h4>
        <div className="grid grid-cols-2 gap-3">
          {['Employee IDs', 'Department Map', 'Device Mappings', 'Grade Levels', 'Reporting Lines', 'Cost Centers'].map(field => (
            <label key={field} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
              <div className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center">
                <div className="w-2 h-2 bg-[#3E3B6F] rounded-sm" />
              </div>
              <span className="text-xs font-bold text-gray-700">{field}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Auto-Assign Defaults</span>
          <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer shadow-inner">
            <div className="w-3 h-3 bg-white rounded-full absolute right-1 shadow-sm"></div>
          </div>
        </div>
        <div className="p-4 bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-2xl flex gap-3">
          <Info size={16} className="text-[#3E3B6F] shrink-0" />
          <p className="text-[10px] text-gray-600 font-medium italic">New employees synced from PeopleHub will inherit site-default shifts automatically.</p>
        </div>
      </div>
    </div>
  );

  const renderPerformPro = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm"><Zap size={18} className="text-purple-600" /></div>
            <h4 className="text-sm font-black text-purple-900 uppercase">Behavioral Signals</h4>
          </div>
          <div className="w-10 h-5 bg-purple-600 rounded-full relative p-1 cursor-pointer">
            <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
        <p className="text-[10px] text-purple-700 font-medium">Export punctuality and adherence data as scoring signals to performance appraisals.</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Signal Types</h4>
        <div className="space-y-2">
          {['Punctuality Index', 'Shift Continuity', 'OT Reliability', 'Policy Compliance'].map(sig => (
            <label key={sig} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-purple-200 transition-all">
               <span className="text-xs font-bold text-gray-700">{sig}</span>
               <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Privacy Level</label>
        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
           <option>High (Aggregated Team Score)</option>
           <option>Medium (Individual Score, No Details)</option>
           <option>Low (Full Raw Audit Access)</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 z-[300] w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
      {/* HEADER */}
      <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3E3B6F] text-white flex items-center justify-center shadow-lg shadow-[#3E3B6F]/20">
            <Settings2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Interface Configuration</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        {integrationId === 'int-1' && renderPayEdge()}
        {integrationId === 'int-2' && renderLeaveEase()}
        {integrationId === 'int-3' && renderPeopleHub()}
        {integrationId === 'int-4' && renderPerformPro()}

        {/* SECURITY FOOTER */}
        <div className="mt-12 pt-8 border-t border-gray-100">
           <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                 <Lock size={16} className="text-gray-400" />
                 <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Handshake Security</h5>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[11px] font-bold"><span className="text-gray-400">Auth Method:</span> <span className="text-gray-700">mTLS + OAuth2</span></div>
                 <div className="flex justify-between text-[11px] font-bold"><span className="text-gray-400">Last Token Refresh:</span> <span className="text-gray-700">Jan 15, 09:00 AM</span></div>
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
        <button 
          onClick={handleTest}
          disabled={isTesting}
          className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          {isTesting ? <RefreshCcw size={16} className="animate-spin" /> : <Layers size={16} />}
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
        <button 
          className="flex-[2] py-4 bg-[#3E3B6F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save Settings
        </button>
      </div>

      {/* TEST RESULT TOAST MOCK */}
      {testResult && (
        <div className="absolute bottom-32 left-10 right-10 bg-green-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
           <CheckCircle2 size={24} />
           <div>
              <p className="text-xs font-black uppercase">Handshake Successful</p>
              <p className="text-[10px] opacity-90 font-medium">Integration service responded in 142ms.</p>
           </div>
           <button onClick={() => setTestResult(false)} className="ml-auto p-1 hover:bg-white/10 rounded-full"><X size={16}/></button>
        </div>
      )}
    </div>
  );
};
