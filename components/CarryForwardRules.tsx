
import React, { useState } from 'react';
import { 
  Save, Calendar, Info, ChevronRight, Calculator, AlertTriangle, 
  RefreshCw, TrendingUp, Users, ArrowRightLeft, ShieldCheck, Eye
} from 'lucide-react';

interface CarryForwardRule {
  type: string;
  enabled: boolean;
  maxDays: number;
  expiry: 'End of Q1' | 'End of Q2' | 'End of Year' | 'Never' | 'Custom';
  projectedDays: number;
  impactedStaff: number;
}

const MOCK_RULES: CarryForwardRule[] = [
  { type: 'Annual Leave', enabled: true, maxDays: 10, expiry: 'End of Q1', projectedDays: 1840, impactedStaff: 310 },
  { type: 'Casual Leave', enabled: false, maxDays: 0, expiry: 'End of Year', projectedDays: 0, impactedStaff: 0 },
  { type: 'Sick Leave', enabled: true, maxDays: 5, expiry: 'Never', projectedDays: 610, impactedStaff: 125 },
  { type: 'Comp-Off', enabled: true, maxDays: 2, expiry: 'End of Q1', projectedDays: 45, impactedStaff: 22 },
  { type: 'Study Leave', enabled: true, maxDays: 15, expiry: 'Never', projectedDays: 150, impactedStaff: 10 },
];

export const CarryForwardRules = () => {
  const [rules, setRules] = useState<CarryForwardRule[]>(MOCK_RULES);
  const [isModified, setIsModified] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const updateRule = (index: number, updates: Partial<CarryForwardRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    setRules(newRules);
    setIsModified(true);
  };

  const handlePreview = () => {
    setIsPreviewLoading(true);
    setTimeout(() => {
      setIsPreviewLoading(false);
      setShowPreview(true);
    }, 1200);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Carry Forward Rules</h2>
          <p className="text-gray-500 font-medium">Configure how unused leave balances transition between years.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#3E3B6F] outline-none shadow-sm focus:ring-2 focus:ring-[#3E3B6F]/10">
            <option>Year 2024 → 2025</option>
            <option>Year 2023 → 2024</option>
          </select>
          <button 
            disabled={!isModified}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
              isModified 
                ? 'bg-[#3E3B6F] text-white shadow-[#3E3B6F]/20 hover:bg-[#4A4680]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save size={18} /> Save All Changes
          </button>
        </div>
      </div>

      {/* Schedule Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-6 shadow-sm flex items-center justify-between gap-6 overflow-hidden relative">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#3E3B6F] shadow-sm">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900/60 uppercase tracking-widest">Scheduled Event</p>
            <p className="text-xl font-bold text-[#3E3B6F]">Year-end processing: Jan 5, 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-indigo-200 rounded-xl relative z-10">
          <Info size={16} className="text-indigo-600" />
          <p className="text-xs font-bold text-indigo-700">Rules apply only to active staff</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-white/10 -skew-x-12 translate-x-32" />
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Leave Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Carry Forward</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Max Days</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Expiry</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Projected CF</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rules.map((rule, idx) => (
                <tr key={rule.type} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5 font-bold text-gray-900">{rule.type}</td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => updateRule(idx, { enabled: !rule.enabled })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${rule.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <input 
                      type="number" 
                      disabled={!rule.enabled}
                      value={rule.maxDays}
                      onChange={(e) => updateRule(idx, { maxDays: parseInt(e.target.value) || 0 })}
                      className={`w-20 p-2 border border-transparent rounded-lg font-bold text-center outline-none transition-all ${
                        rule.enabled ? 'bg-gray-50 hover:bg-white hover:border-gray-200 focus:bg-white focus:border-[#3E3B6F] text-[#3E3B6F]' : 'bg-transparent text-gray-300'
                      }`}
                    />
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      disabled={!rule.enabled}
                      value={rule.expiry}
                      onChange={(e) => updateRule(idx, { expiry: e.target.value as any })}
                      className={`p-2 border border-transparent rounded-lg font-bold text-xs outline-none transition-all ${
                        rule.enabled ? 'bg-gray-50 hover:bg-white hover:border-gray-200 text-gray-700' : 'bg-transparent text-gray-300'
                      }`}
                    >
                      <option>End of Q1</option>
                      <option>End of Q2</option>
                      <option>End of Year</option>
                      <option>Never</option>
                      <option>Custom</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    {rule.enabled ? (
                      <div>
                        <p className="text-sm font-bold text-[#3E3B6F]">~{rule.projectedDays.toLocaleString()} days</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{rule.impactedStaff} employees</p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-300 italic">No Carry Forward</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#3E3B6F] transition-all opacity-0 group-hover:opacity-100">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Year-End Projection</h3>
            <p className="text-sm text-gray-500 font-medium max-w-lg">
              Simulate how current balances will be processed based on the rules defined above. This calculation includes all approved leaves up to Dec 31.
            </p>
          </div>
          <button 
            onClick={handlePreview}
            disabled={isPreviewLoading}
            className="px-10 py-4 bg-[#E8D5A3] text-[#3E3B6F] font-bold rounded-2xl hover:shadow-xl transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isPreviewLoading ? <RefreshCw className="animate-spin" size={20} /> : <Calculator size={20} />}
            {showPreview ? 'Re-calculate Projection' : 'Preview Year-End Processing'}
          </button>
        </div>

        {showPreview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-6 duration-700">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Users size={18}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Total Balances</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4,120</p>
                <p className="text-xs text-gray-400 font-medium">Days as of Dec 31</p>
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <ArrowRightLeft size={18}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">To Carry Forward</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">2,450</p>
                <p className="text-xs text-indigo-400 font-medium">Within rule limits</p>
              </div>
            </div>

            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle size={18}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">To Lapse</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">1,670</p>
                <p className="text-xs text-red-400 font-medium">Balances above caps</p>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <TrendingUp size={18}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Liability Shift</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">-$120k</p>
                <p className="text-xs text-emerald-400 font-medium">Financial Impact (Est)</p>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
               <div className="space-y-6">
                 <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   <Calculator size={16} className="text-[#3E3B6F]" /> Projected Lapse by Department
                 </h4>
                 <div className="space-y-4">
                   {[
                     { dept: 'Engineering', lapse: 450, total: 1200 },
                     { dept: 'Sales', lapse: 620, total: 1000 },
                     { dept: 'HR & Ops', lapse: 120, total: 500 },
                     { dept: 'Product', lapse: 480, total: 1420 },
                   ].map(d => (
                     <div key={d.dept} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-gray-600">{d.dept}</span>
                          <span className="text-red-500">{d.lapse} Days</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                           <div className="h-full bg-red-400" style={{ width: `${(d.lapse/d.total)*100}%` }} />
                           <div className="h-full bg-indigo-400" style={{ width: `${(1 - d.lapse/d.total)*100}%` }} />
                        </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-[#3E3B6F] p-8 rounded-[32px] text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                   <h4 className="text-xl font-bold">Finalize Rules</h4>
                   <p className="text-sm text-white/60">Once satisfied, save changes. The system will notify employees of their projected lapse days on <span className="font-bold text-[#E8D5A3]">Dec 1, 2024</span>.</p>
                   <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2">
                     <ShieldCheck size={18}/> Review Communication Draft
                   </button>
                 </div>
                 <Calculator size={200} className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" />
               </div>
            </div>
          </div>
        )}

        {!showPreview && !isPreviewLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
             <div className="p-5 bg-white rounded-full shadow-sm text-gray-300">
               <TrendingUp size={40} />
             </div>
             <div>
               <h4 className="font-bold text-gray-800">No Projection Data</h4>
               <p className="text-sm text-gray-400 max-w-xs mx-auto">Click the preview button above to run the 2024→2025 transition simulation.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
