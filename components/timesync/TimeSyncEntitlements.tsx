import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  CheckCircle2, 
  Crown, 
  Users, 
  Smartphone, 
  Cpu, 
  ArrowUpRight, 
  Building2, 
  Calendar,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface FeatureItemProps {
  label: string;
  isLocked?: boolean;
  isIncluded?: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ label, isLocked, isIncluded }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
    <div className="flex items-center gap-3">
      {isLocked ? (
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <Lock size={10} />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-500">
          <CheckCircle2 size={12} />
        </div>
      )}
      <span className={`text-xs font-bold ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
    </div>
    {!isLocked && isIncluded && (
      <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">Included</span>
    )}
  </div>
);

const UsageMeter: React.FC<{ label: string; used: number; total: number; icon: React.ReactNode; color: string }> = ({ label, used, total, icon, color }) => {
  const percentage = (used / total) * 100;
  return (
    <div className="space-y-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-gray-50 text-gray-500`}>{icon}</div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-xs font-black text-gray-800 tabular-nums">{used} / {total}</span>
      </div>
      <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
        <div 
          style={{ width: `${percentage}%` }} 
          className={`h-full transition-all duration-1000 ${color}`}
        />
      </div>
    </div>
  );
};

export const TimeSyncEntitlements: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#3E3B6F]" size={28} /> Plan & Entitlements
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Manage your TimeSync subscription and feature permissions</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-[#3E3B6F] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
          <ArrowUpRight size={18} /> Upgrade Plan
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* CURRENT PLAN CARD */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-primary-gradient rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <Crown size={180} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 mb-6">
                <Crown size={14} className="text-[#E8D5A3]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Subscription</span>
              </div>
              
              <h3 className="text-3xl font-black mb-1">TimeSync Pro</h3>
              <p className="text-white/60 text-sm font-medium mb-8">Professional workforce management</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 font-bold uppercase tracking-widest">Valid Until:</span>
                  <span className="font-black text-[#E8D5A3]">Dec 31, 2025</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 font-bold uppercase tracking-widest">Billing Cycle:</span>
                  <span className="font-black">Annual</span>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/10">
                <button className="w-full py-4 bg-[#E8D5A3] text-[#3E3B6F] rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl">
                  Manage Billing
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Usage Counters</h4>
            <UsageMeter label="Employees" used={450} total={500} icon={<Users size={12}/>} color="bg-green-500" />
            <UsageMeter label="Hardware Devices" used={25} total={50} icon={<Smartphone size={12}/>} color="bg-blue-500" />
            <UsageMeter label="AI Queries (Jan)" used={800} total={1000} icon={<Cpu size={12}/>} color="bg-orange-500" />
          </div>
        </div>

        {/* FEATURE MATRIX */}
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CORE MODULES */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Core Access</h4>
                  <p className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Fully Enabled</p>
                </div>
              </div>
              <div className="space-y-1">
                <FeatureItem label="Shifts & Calendars" isIncluded />
                <FeatureItem label="Basic Attendance" isIncluded />
                <FeatureItem label="Grace & Penalties" isIncluded />
                <FeatureItem label="Basic Anomalies" isIncluded />
                <FeatureItem label="Regularization" isIncluded />
                <FeatureItem label="Basic Reports" isIncluded />
              </div>
            </div>

            {/* PRO MODULES */}
            <div className="bg-white rounded-3xl border border-[#3E3B6F]/20 shadow-xl shadow-[#3E3B6F]/5 p-6 space-y-6 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">ACTIVE PLAN</span>
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Pro Suite</h4>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">Advanced Intelligence</p>
                </div>
              </div>
              <div className="space-y-1">
                <FeatureItem label="Roster Planner" isIncluded />
                <FeatureItem label="Open Shifts" isIncluded />
                <FeatureItem label="Demand Grid" isIncluded />
                <FeatureItem label="AI Optimizer" isIncluded />
                <FeatureItem label="Bulk Reprocess" isIncluded />
                <FeatureItem label="OT Forecast" isIncluded />
                <FeatureItem label="Advanced Anomalies" isIncluded />
              </div>
            </div>

            {/* ENTERPRISE MODULES */}
            <div className="bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50">
                <div className="p-2 bg-white rounded-xl text-gray-300">
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Enterprise</h4>
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Scale & Security</p>
                </div>
              </div>
              <div className="space-y-1">
                <FeatureItem label="Parallel Approvals" isLocked />
                <FeatureItem label="Device Fleet Ops" isLocked />
                <FeatureItem label="Compliance Packs" isLocked />
                <FeatureItem label="SSO/SAML Integration" isLocked />
                <FeatureItem label="Retro Correction Workflow" isLocked />
                <FeatureItem label="White-labeling" isLocked />
              </div>
              <button className="w-full py-2 bg-white border border-gray-200 text-xs font-black text-gray-400 uppercase rounded-xl hover:bg-[#3E3B6F] hover:text-white hover:border-[#3E3B6F] transition-all">
                Request Demo
              </button>
            </div>
          </div>

          {/* SECURITY & COMPLIANCE AD */}
          <div className="bg-[#E8D5A3]/10 border border-[#E8D5A3]/30 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 rounded-[24px] bg-white flex items-center justify-center shadow-xl shadow-[#E8D5A3]/20 shrink-0">
               <ShieldCheck size={40} className="text-[#3E3B6F]" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
               <h4 className="text-lg font-black text-[#3E3B6F] uppercase tracking-widest">Unlock Enterprise Security</h4>
               <p className="text-sm text-gray-600 font-medium leading-relaxed">
                 Need <span className="font-bold underline">Single Sign-On (SSO)</span> or <span className="font-bold underline">Parallel Approval Hierarchies</span>? Our Enterprise tier offers high-scale security features for organizations exceeding 1,000 employees.
               </p>
            </div>
            <button className="px-8 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-105 transition-all flex items-center gap-2">
              View Comparison <ChevronRight size={16}/>
            </button>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 flex items-start gap-4">
             <Info size={20} className="text-[#3E3B6F] shrink-0 mt-1" />
             <div className="space-y-1">
                <p className="text-xs font-black text-gray-700 uppercase">Fair Usage Policy</p>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  AI query limits reset on the 1st of every month. Employee seat counts are calculated based on <span className="font-bold">Active User Profiles</span>. Terminated or archived employees do not consume plan entitlement seats.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
