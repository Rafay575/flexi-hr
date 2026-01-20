
import React, { useState } from 'react';
import { 
  X, Save, Info, CheckCircle2, 
  Settings2, Calculator, ShieldCheck, 
  FileText, Calendar, Percent, Landmark,
  // Fix: Added missing Layers and Plus icons
  Layers, Plus
} from 'lucide-react';

interface EarningComponentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type FormTab = 'BASIC' | 'CALCULATION' | 'RULES' | 'FLAGS';

export const EarningComponentForm: React.FC<EarningComponentFormProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<FormTab>('BASIC');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Add Earning Component</h3>
            <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">New Earning Configuration</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b px-6 bg-gray-50/50">
          {(['BASIC', 'CALCULATION', 'RULES', 'FLAGS'] as FormTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 mr-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-[1px] ${
                activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activeTab === 'BASIC' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Component Code</label>
                  <input type="text" placeholder="e.g. HRA01" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
                  <div className="flex items-center gap-2 h-10">
                    <button className="w-12 h-6 bg-green-500 rounded-full relative px-1 flex items-center transition-all">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
                    </button>
                    <span className="text-xs font-bold text-gray-600">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Component Name</label>
                <input type="text" placeholder="e.g. House Rent Allowance" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer">
                  <option>Fixed Salary</option>
                  <option>Variable / Performance</option>
                  <option>Allowance</option>
                  <option>Bonus / One-time</option>
                  <option>Reimbursement</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                <Info size={18} className="text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  The component category determines how this earning is treated in general ledger reporting and tax summaries.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'CALCULATION' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Calculation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'fixed', label: 'Fixed Amount', icon: Calculator },
                    { id: 'perc_basic', label: '% of Basic', icon: Percent },
                    { id: 'perc_gross', label: '% of Gross', icon: Layers },
                    { id: 'formula', label: 'Custom Formula', icon: Settings2 }
                  ].map(type => (
                    <button key={type.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-all">
                      <type.icon size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Value / %</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Frequency</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer">
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annually</option>
                    <option>Ad-hoc / Manual</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Proration & Rounding</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Prorate based on attendance</span>
                    <button className="w-10 h-5 bg-gray-200 rounded-full relative px-1 flex items-center"><div className="w-3 h-3 bg-white rounded-full" /></button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Round to nearest PKR 10</span>
                    <button className="w-10 h-5 bg-primary rounded-full relative px-1 flex items-center justify-end"><div className="w-3 h-3 bg-white rounded-full" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RULES' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Minimum Cap</label>
                  <input type="number" placeholder="PKR" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Maximum Cap</label>
                  <input type="number" placeholder="PKR" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Effective From Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Eligibility Criteria</h4>
                <div className="p-4 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center gap-2 text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                  <Plus size={20} />
                  <span className="text-xs font-bold uppercase tracking-tight">Add Eligibility Rule</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FLAGS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-purple-600" /> Statutory Compliance
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Taxable Component', desc: 'Income tax calculation on this earning', active: true },
                    { label: 'Impact EOBI Contribution', desc: 'Employee Old-Age Benefits Institution', active: true },
                    { label: 'Impact Social Security (PESSI)', desc: 'Provincial Social Security contribution', active: false },
                    { label: 'Impact Provident Fund', desc: 'Company and Employee retirement fund', active: true }
                  ].map((flag, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center justify-between group">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{flag.label}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{flag.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative px-1 flex items-center transition-all ${flag.active ? 'bg-primary' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm ${flag.active ? 'ml-auto' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Landmark size={14} className="text-orange-600" /> Internal Policy Impacts
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Part of OT Base', desc: 'Used to calculate hourly overtime rate', active: true },
                    { label: 'Part of Gratuity Base', desc: 'Used for end-of-service gratuity math', active: true },
                    { label: 'Part of Leave Encashment', desc: 'Used for unused leave payouts', active: false }
                  ].map((flag, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{flag.label}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{flag.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative px-1 flex items-center transition-all ${flag.active ? 'bg-primary' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm ${flag.active ? 'ml-auto' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50/50 grid grid-cols-2 gap-4">
          <button className="py-3 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <FileText size={16} /> Save Draft
          </button>
          <button className="py-3 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
};
