
import React, { useState } from 'react';
import { 
  X, Save, Info, CheckCircle2, 
  Settings2, Calculator, ShieldCheck, 
  FileText, Calendar, Percent, Landmark,
  Layers, Plus, ArrowDownCircle, Link2, AlertTriangle
} from 'lucide-react';

interface DeductionComponentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type FormTab = 'BASIC' | 'CALCULATION' | 'RECOVERY' | 'FLAGS';

export const DeductionComponentForm: React.FC<DeductionComponentFormProps> = ({ isOpen, onClose, onSave }) => {
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
            <h3 className="text-xl font-bold text-gray-800">Add Deduction Component</h3>
            <p className="text-xs text-payroll-deduction mt-1 uppercase font-black tracking-widest">Mandatory & Voluntary Recoveries</p>
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
          {(['BASIC', 'CALCULATION', 'RECOVERY', 'FLAGS'] as FormTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 mr-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-[1px] ${
                activeTab === tab 
                ? 'border-payroll-deduction text-payroll-deduction' 
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
                  <input type="text" placeholder="e.g. TAX01" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-deduction/10 outline-none" />
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
                <input type="text" placeholder="e.g. Income Tax" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-deduction/10 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Deduction Category</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-deduction/10 outline-none cursor-pointer">
                  <option>Statutory (Tax/EOBI)</option>
                  <option>Loan Recovery</option>
                  <option>Salary Advance</option>
                  <option>Disciplinary Penalty</option>
                  <option>Voluntary Contribution</option>
                </select>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex gap-3">
                <AlertTriangle size={18} className="text-payroll-deduction flex-shrink-0" />
                <p className="text-xs text-red-700 leading-relaxed">
                  Statutory deductions are regulated by local laws (FBR/EOBI). Changes may affect compliance audits.
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
                    { id: 'perc_gross', label: '% of Gross', icon: Percent },
                    { id: 'slabs', label: 'Slab-based', icon: Layers },
                    { id: 'formula', label: 'Custom Formula', icon: Settings2 }
                  ].map(type => (
                    <button key={type.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-payroll-deduction hover:bg-payroll-deduction/5 text-left transition-all">
                      <type.icon size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">Slab Configuration</span>
                    <button className="text-[10px] font-black text-payroll-deduction uppercase flex items-center gap-1 hover:underline">
                      <Plus size={12}/> Add Slab
                    </button>
                 </div>
                 <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tight px-2">
                      <span>Threshold</span>
                      <span>Rate %</span>
                      <span>Fixed PKR</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="600,000" className="px-2 py-1 text-xs border rounded" />
                      <input type="text" placeholder="5%" className="px-2 py-1 text-xs border rounded" />
                      <input type="text" placeholder="0" className="px-2 py-1 text-xs border rounded" />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'RECOVERY' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recovery Priority</label>
                  <input type="number" placeholder="1 (Highest)" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Max % of Gross</label>
                  <input type="number" placeholder="50%" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recovery Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Cap at Net Salary</p>
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Do not allow negative payout</p>
                    </div>
                    <button className="w-12 h-6 bg-primary rounded-full relative px-1 flex items-center justify-end transition-all">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Stop when balance is zero</p>
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Auto-deactivate upon full recovery</p>
                    </div>
                    <button className="w-12 h-6 bg-gray-200 rounded-full relative px-1 flex items-center transition-all">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FLAGS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Link2 size={14} className="text-blue-600" /> Module Integration
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Is Statutory Deduction', desc: 'Identifies component as EOBI/Tax for exports', active: true },
                    { label: 'Link to Loan Module', desc: 'Auto-sync with outstanding loan balances', active: false },
                    { label: 'Link to Tax Engine', desc: 'Component value is dictated by Tax module', active: true },
                    { label: 'Pre-tax Deduction', desc: 'Deduct from gross before calculating tax', active: false }
                  ].map((flag, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{flag.label}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{flag.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative px-1 flex items-center transition-all ${flag.active ? 'bg-payroll-deduction' : 'bg-gray-200'}`}>
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
          <button className="py-3 bg-payroll-deduction text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
};
