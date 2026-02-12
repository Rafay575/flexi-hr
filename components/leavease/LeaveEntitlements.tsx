import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, CheckCircle2, Zap, 
  Users, Layers, GitMerge, Bot, Rocket, ArrowUpRight,
  ChevronRight, Info, AlertTriangle, Database, RefreshCw,
  X
} from 'lucide-react';

interface UsageMeterProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
}

const UsageMeter = ({ label, current, max, unit = "" }: UsageMeterProps) => {
  const percentage = (current / max) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-gray-900">{current} <span className="text-gray-400">/ {max} {unit}</span></p>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-[#3E3B6F]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const LeaveEntitlements = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const tiers = [
    {
      name: 'CORE',
      status: 'included',
      features: ['Leave Types & Requests', 'Basic Approvals', 'Basic Accrual', 'Basic Reports', 'Notifications']
    },
    {
      name: 'PRO',
      status: 'active',
      features: ['Sandwich Policy', 'Comp-Off Management', 'Encashment', 'Policy Simulator', 'Official Duty/Travel', 'Earned Leave Incentives', 'AI Assistant']
    },
    {
      name: 'ENTERPRISE',
      status: 'locked',
      features: ['Parallel Approvals', 'Retro After Lock', 'Adjustment Approvals', 'Advanced Audit Export', 'SSO Integration', 'Custom Integrations']
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Plan & Entitlements</h2>
            <p className="text-gray-500 font-medium">Manage your LeaveEase subscription and monitor resource limits.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Tiers Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Plan Card */}
          <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E8D5A3] rounded-xl text-[#3E3B6F]">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-3xl font-bold">LeaveEase Pro</h3>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Subscription Valid Until</p>
                    <p className="text-lg font-bold">Dec 31, 2025</p>
                  </div>
                  <div className="w-px h-10 bg-white/10 hidden md:block" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Employees</p>
                    <p className="text-lg font-bold text-[#E8D5A3]">245 / 500</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-[#E8D5A3] text-[#3E3B6F] px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-white transition-all active:scale-95 flex items-center gap-2"
              >
                Upgrade Plan <ArrowUpRight size={20} />
              </button>
            </div>
            <Zap size={200} className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" />
          </div>

          {/* Features Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`bg-white rounded-[32px] border p-8 flex flex-col h-full transition-all ${
                  tier.status === 'active' ? 'border-[#3E3B6F] shadow-xl ring-2 ring-[#3E3B6F]/5' : 'border-gray-100 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-8">
                  <h4 className={`text-xs font-bold uppercase tracking-[0.2em] ${tier.status === 'locked' ? 'text-gray-400' : 'text-[#3E3B6F]'}`}>
                    {tier.name}
                  </h4>
                  {tier.status === 'locked' && (
                    <button 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#3E3B6F] rounded-lg transition-colors"
                    >
                      <Lock size={16} />
                    </button>
                  )}
                  {tier.status === 'active' && (
                    <span className="bg-indigo-600 text-white p-1 rounded-full"><CheckCircle2 size={12}/></span>
                  )}
                </div>

                <ul className="space-y-4 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-3 text-xs font-medium leading-relaxed ${tier.status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tier.status === 'locked' ? (
                        <Lock size={14} className="shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>

                {tier.status === 'locked' && (
                  <button 
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full mt-8 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-[#3E3B6F] transition-all"
                  >
                    Unlock Features
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Usage Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 space-y-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Database size={18} className="text-[#3E3B6F]" /> Resource Usage
            </h3>
            
            <div className="space-y-6">
              <UsageMeter label="Licensed Employees" current={245} max={500} unit="Staff" />
              <UsageMeter label="Leave Type Configs" current={8} max={20} />
              <UsageMeter label="Workflow Builder Slots" current={5} max={10} />
              <UsageMeter label="AI Copilot Queries" current={600} max={1000} unit="/ mo" />
            </div>

            <div className="pt-6 border-t border-gray-50">
               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                    You have reached <span className="font-bold">60% of your AI query quota</span> for February. Quota resets in 18 days.
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
             <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Billing Cycle</h4>
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-lg font-bold text-gray-900">Jan 01, 2026</p>
                   <p className="text-xs text-gray-500 font-medium italic">Annual Standard Renewal</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-[#3E3B6F]">$4,800.00</p>
                   <button className="text-[10px] font-bold text-indigo-500 hover:underline">Manage Billing</button>
                </div>
             </div>
          </div>

          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <Info size={20} className="text-indigo-600 shrink-0" />
             <p className="text-[11px] text-indigo-800 font-medium leading-relaxed">
               Enterprise features like Parallel Approvals and Custom Integrations require manual activation by our implementation team. 
             </p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUpgradeModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#3E3B6F] p-10 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl"><Rocket size={24}/></div>
                <div>
                  <h3 className="text-2xl font-bold">Request Upgrade</h3>
                  <p className="text-white/50 text-sm">Elevate to LeaveEase Enterprise</p>
                </div>
              </div>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                 <h4 className="text-sm font-bold text-gray-700">What's included in Enterprise?</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['SSO/SAML Login', 'Parallel Approvals', 'API Webhooks', 'Unlimited AI', 'Dedicated Support', 'Custom Reporting'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <CheckCircle2 size={14} className="text-emerald-500" /> {f}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Employee Slots</span>
                   <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none">
                      <option>None (Current 500)</option>
                      <option>Add 500 (+ $1,200/yr)</option>
                      <option>Unlimited (+ $4,500/yr)</option>
                   </select>
                </label>
                <label className="block space-y-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add a message for your account manager</span>
                   <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none h-24 resize-none" placeholder="Let us know your requirements..." />
                </label>
              </div>

              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="w-full py-4 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2"
              >
                Send Request to Sales <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};