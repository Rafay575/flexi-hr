
import React from 'react';
import { 
  ShieldCheck, Gem, Lock, CheckCircle2, 
  Users, Calendar, Zap, Globe, 
  Landmark, Calculator, MessageSquare,
  ArrowUpRight, Info, Building2, HardDrive
} from 'lucide-react';

export const PayEdgeEntitlements: React.FC = () => {
  const currentPlan = "PayEdge Pro";
  const validUntil = "Dec 31, 2025";
  const employeeUsage = 485;
  const employeeLimit = 1000;
  const usagePercentage = (employeeUsage / employeeLimit) * 100;

  const coreFeatures = [
    "Rule-based Components", "Batch Processing", "Digital Payslips", 
    "Standard Reports", "ESS Portal Access"
  ];

  const proFeatures = [
    "ERP Integrations", "Loan Management", "Arrears Processing", 
    "Advanced Analytics", "PayEdge AI Assistant"
  ];

  const enterpriseFeatures = [
    "Multi-currency Payouts", "Full & Final (EOS)", "UAE/GCC Localization", 
    "Workflow Orchestration", "Audit Immutable Logs", "SSO & SAML 2.0"
  ];

  const pakistanAddOns = [
    { name: "FBR Income Tax", active: true },
    { name: "EOBI Contributions", active: true },
    { name: "Provincial SS (PESSI/SESSI)", active: true },
    { name: "Provident Fund Trust", active: true }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Plan Summary */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-primary  p-8 text-white relative">
          <div className="relative z-10 flex flex-wrap justify-between items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                  <Gem size={32} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{currentPlan}</h2>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-[2px]">Enterprise Subscription</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-accent/60" />
                  <span className="text-sm font-bold">Valid until {validUntil}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-400" />
                  <span className="text-sm font-bold">Active & Compliant</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-3 bg-black/20 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Employee Utilization</p>
                <p className="text-sm font-black text-accent">{employeeUsage} / {employeeLimit}</p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(232,213,163,0.5)]" 
                  style={{ width: `${usagePercentage}%` }} 
                />
              </div>
              <p className="text-[9px] text-white/40 font-bold text-right italic uppercase">48.5% of total capacity used</p>
            </div>
          </div>
          <Building2 className="absolute right-[-40px] top-[-40px] text-white/5 w-64 h-64 -rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier 1: Core */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 opacity-80">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[3px] text-gray-400">Core Engine</h3>
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
          <ul className="space-y-4">
            {coreFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 2: Pro (Active) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-primary space-y-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-[2px] shadow-lg">
            Current Tier
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[3px] text-primary">Pro Add-ons</h3>
            <CheckCircle2 size={20} className="text-primary" />
          </div>
          <ul className="space-y-4">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-800">
                <Zap size={16} className="text-primary fill-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 3: Enterprise (Locked) */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 space-y-6 group cursor-pointer hover:bg-white hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[3px] text-gray-400">Enterprise</h3>
            <Lock size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <ul className="space-y-4 opacity-50">
            {enterpriseFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 bg-white border border-gray-200 text-[10px] font-black uppercase text-primary rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            Upgrade to Enterprise
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Localized Add-Ons */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-primary" />
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-700">Localized Compliance</h3>
            </div>
            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Pakistan Ready</span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pakistanAddOns.map((addon, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-700">{addon.name}</span>
                <CheckCircle2 size={16} className="text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Global Regions (Expansion) */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark size={20} className="text-gray-400" />
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-700">Global Regions</h3>
            </div>
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">Locked</span>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                <Globe size={24} />
             </div>
             <div>
                <h4 className="font-bold text-gray-800">UAE & GCC Localization</h4>
                <p className="text-xs text-gray-500 max-w-[250px] mx-auto mt-1">
                  Automated WPS files, Gratuity Law compliance, and local tax rules for GCC entities.
                </p>
             </div>
             <button className="px-6 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/10 hover:bg-primary hover:text-white transition-all">
                Request Region Expansion
             </button>
          </div>
        </div>
      </div>

      {/* Support & Audit Footer */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-8 bg-gray-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
           <div className="p-4 bg-white/10 rounded-2xl">
              <MessageSquare size={28} className="text-accent" />
           </div>
           <div>
              <h4 className="text-lg font-black tracking-tight">Enterprise Success Manager</h4>
              <p className="text-xs text-white/50">Dedicated support for your payroll team available 24/7</p>
           </div>
        </div>
        <div className="flex gap-3 relative z-10">
           <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Technical Documentation
           </button>
           <button className="px-8 py-3 bg-accent text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
              Contact Sales <ArrowUpRight size={16} />
           </button>
        </div>
        <HardDrive className="absolute left-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12" />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
         <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
         <p className="text-[10px] text-blue-700 leading-relaxed font-bold uppercase tracking-tight">
           Your subscription is managed via the Flexi Cloud Console. For billing inquiries or API usage overages, please visit the <span className="underline cursor-pointer">Flexi Billing Portal</span>.
         </p>
      </div>
    </div>
  );
};
