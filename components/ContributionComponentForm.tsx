
import React, { useState } from 'react';
import { 
  X, Save, Info, CheckCircle2, 
  Settings2, Calculator, ShieldCheck, 
  FileText, Calendar, Percent, Landmark,
  Layers, Plus, Link2, Handshake, TrendingUp
} from 'lucide-react';

interface ContributionComponentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type FormTab = 'BASIC' | 'CONFIG' | 'CAPS' | 'FLAGS';

export const ContributionComponentForm: React.FC<ContributionComponentFormProps> = ({ isOpen, onClose, onSave }) => {
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
            <h3 className="text-xl font-bold text-gray-800">Add Employer Contribution</h3>
            <p className="text-xs text-payroll-contribution mt-1 uppercase font-black tracking-widest">Company Liabilities & Provisions</p>
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
          {(['BASIC', 'CONFIG', 'CAPS', 'FLAGS'] as FormTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 mr-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-[1px] ${
                activeTab === tab 
                ? 'border-payroll-contribution text-payroll-contribution' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'CONFIG' ? 'Split Config' : tab}
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
                  <input type="text" placeholder="e.g. ER_EOBI" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-contribution/10 outline-none" />
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
                <input type="text" placeholder="e.g. EOBI Employer Share" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-contribution/10 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-contribution/10 outline-none cursor-pointer">
                  <option>EOBI (Employer)</option>
                  <option>PESSI / SESSI (Employer)</option>
                  <option>Provident Fund (Employer)</option>
                  <option>Gratuity Provision</option>
                  <option>Group Insurance Premium</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                <Handshake size={18} className="text-payroll-contribution flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Employer contributions are generally calculated based on statutory minimums or company policy matches.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'CONFIG' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Percent size={14} /> Matching & Ratio
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Employee Share %</label>
                      <input type="number" placeholder="1%" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Employer Share %</label>
                      <input type="number" placeholder="5%" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center block">Match Ratio (ER:EE)</label>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border">
                       <span className="text-sm font-bold text-gray-400">1 :</span>
                       <input type="number" placeholder="5" className="flex-1 text-center font-bold text-primary text-lg focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Calculation Base</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-payroll-contribution/10 outline-none appearance-none cursor-pointer">
                  <option>Basic Salary</option>
                  <option>Gross Salary</option>
                  <option>Minimum Wage (Statutory)</option>
                  <option>Fixed Monthly Amount</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'CAPS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-5 bg-payroll-contribution/5 rounded-xl border border-payroll-contribution/20 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-payroll-contribution">Statutory Thresholds</h4>
                  <span className="bg-payroll-contribution text-white text-[9px] font-bold px-2 py-0.5 rounded">FBR/EOBI Rules</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Maximum Wage Limit (Cap)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">PKR</span>
                      <input type="number" placeholder="31,000" className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-payroll-contribution/10 outline-none" />
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium italic">Example: EOBI contribution stops increasing after PKR 31,000 wage.</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Max Employer Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">PKR</span>
                      <input type="number" placeholder="Fixed limit per employee" className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-payroll-contribution/10 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FLAGS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <TrendingUp size={14} className="text-payroll-earning" /> Financial Impact
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Include in CTC', desc: 'Factor this liability in Total Cost to Company', active: true },
                    { label: 'Show on Payslip', desc: 'Enable visibility for employee awareness', active: true },
                    { label: 'Is Accruable Provision', desc: 'Accumulate in balance sheet (e.g. Gratuity)', active: false },
                    { label: 'Link to Statutory Return', desc: 'Include in monthly challan exports', active: true }
                  ].map((flag, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{flag.label}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{flag.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative px-1 flex items-center transition-all ${flag.active ? 'bg-payroll-contribution' : 'bg-gray-200'}`}>
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
          <button className="py-3 bg-payroll-contribution text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
};
