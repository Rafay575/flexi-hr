
import React, { useState } from 'react';
import { 
  X, Save, Landmark, ShieldCheck, History, 
  Layers, Settings2, Plus, Trash2, 
  Info, AlertCircle, CheckCircle2, CreditCard,
  User, Briefcase, Calendar, Globe, Building2
} from 'lucide-react';

interface EmployeePayProfileFormProps {
  employee: {
    id: string;
    name: string;
    dept: string;
    grade: string;
  };
  onClose: () => void;
  onSave: (data: any) => void;
}

type FormTab = 'TEMPLATE' | 'OVERRIDES' | 'BANK' | 'STATUTORY' | 'HISTORY';

export const EmployeePayProfileForm: React.FC<EmployeePayProfileFormProps> = ({ employee, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<FormTab>('TEMPLATE');
  const [gross, setGross] = useState(215000);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-[700px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{employee.name}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                {employee.id} • {employee.dept} • <span className="text-primary">{employee.grade}</span>
              </p>
            </div>
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
          {[
            { id: 'TEMPLATE', label: 'Template', icon: Layers },
            { id: 'OVERRIDES', label: 'Overrides', icon: Settings2 },
            { id: 'BANK', label: 'Bank Details', icon: Landmark },
            { id: 'STATUTORY', label: 'Statutory', icon: ShieldCheck },
            { id: 'HISTORY', label: 'History', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FormTab)}
              className={`py-4 px-3 mr-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-[1px] flex items-center gap-2 ${
                activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeTab === 'TEMPLATE' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Salary Structure</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer">
                      <option>Senior Engineering Lead (G18)</option>
                      <option>Senior Manager Ops (G18)</option>
                      <option>Fixed Term Contractor</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Effective Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="date" value="2025-01-01" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Target Monthly Gross</h4>
                    <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded shadow-sm">PKR</span>
                  </div>
                  <input 
                    type="number" 
                    value={gross} 
                    onChange={(e) => setGross(parseInt(e.target.value))}
                    className="w-full bg-transparent text-4xl font-black text-primary border-none focus:ring-0 outline-none p-0"
                  />
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60">
                    <Info size={12} />
                    This gross value will be distributed across template components.
                  </div>
                </div>
              </section>

              <div className="pt-4 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Payout Preview</h4>
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-[9px] font-black text-gray-400 uppercase">
                        <th className="px-4 py-3">Component</th>
                        <th className="px-4 py-3">Logic</th>
                        <th className="px-4 py-3 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 font-bold">Basic Salary</td>
                        <td className="px-4 py-3 text-gray-400">50% of Gross</td>
                        <td className="px-4 py-3 text-right font-mono font-bold">PKR 107,500</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold">House Rent</td>
                        <td className="px-4 py-3 text-gray-400">45% of Basic</td>
                        <td className="px-4 py-3 text-right font-mono font-bold">PKR 48,375</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OVERRIDES' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Custom Adjustments</h4>
                  <p className="text-xs text-gray-500">Add values that differ from the standard grade template.</p>
                </div>
                <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1.5 hover:underline bg-primary/5 px-3 py-1.5 rounded-lg">
                  <Plus size={14} /> Add Override
                </button>
              </div>

              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Component</th>
                      <th className="px-4 py-3 text-right">Template Val</th>
                      <th className="px-4 py-3 text-right">Override Val</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    <tr>
                      <td className="px-4 py-4 font-bold text-gray-700">Special Allowance</td>
                      <td className="px-4 py-4 text-right text-gray-400">PKR 0</td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-blue-600">PKR 15,000</td>
                      <td className="px-4 py-4 text-gray-500 italic">Market Adjust...</td>
                      <td className="px-4 py-4"><Trash2 size={14} className="text-gray-300 hover:text-red-500 cursor-pointer" /></td>
                    </tr>
                    <tr className="bg-blue-50/30">
                      <td className="px-4 py-4 font-bold text-gray-700">Car Allowance</td>
                      <td className="px-4 py-4 text-right text-gray-400">Fixed</td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-blue-600">PKR 25,000</td>
                      <td className="px-4 py-4 text-gray-500 italic">Director Benefit</td>
                      <td className="px-4 py-4"><Trash2 size={14} className="text-gray-300 hover:text-red-500 cursor-pointer" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 items-start">
                <AlertCircle size={18} className="text-orange-500 mt-0.5" />
                <p className="text-xs text-orange-700 leading-relaxed">
                  <strong>Warning:</strong> Overrides bypass standardized salary rules. Ensure you have the necessary board approvals before saving these changes.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'BANK' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg"><Building2 size={16}/></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Primary Bank Account</h4>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bank Name</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none">
                      <option>Habib Bank Limited (HBL)</option>
                      <option>Meezan Bank</option>
                      <option>Standard Chartered</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Branch Name / Code</label>
                    <input type="text" placeholder="I-8 Markaz (0122)" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Account Number</label>
                    <input type="text" placeholder="1234567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">IBAN Number</label>
                    <input type="text" placeholder="PK00HABB000000..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none font-mono" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-600">Payment Distribution</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <input type="number" value="100" className="w-16 text-center py-1 font-bold border rounded" />
                      <span className="text-xs font-black text-gray-400">%</span>
                   </div>
                </div>
              </section>

              <div className="pt-4 border-t border-dashed">
                <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <Plus size={16} /> Add Secondary Bank Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'STATUTORY' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">CNIC Number</label>
                    <input type="text" placeholder="61101-1234567-1" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">NTN (National Tax Number)</label>
                    <input type="text" placeholder="1234567-8" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">EOBI Number</label>
                    <input type="text" placeholder="ABC12345678" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Social Security (SESSI/PESSI)</label>
                    <input type="text" placeholder="SS-990-112" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none font-mono" />
                  </div>
                </div>

                <div className="p-5 bg-purple-50 rounded-xl border border-purple-100 space-y-4">
                  <div className="flex items-center justify-between">
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-purple-700">Tax Residency Status</h5>
                     <div className="flex gap-2">
                        <span className="text-[9px] font-black text-white bg-green-500 px-1.5 py-0.5 rounded uppercase">Filer</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">FBR Status Verified</span>
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                  <p className="text-[10px] text-purple-600/70 font-medium italic">Verified against FBR Active Taxpayers List on Jan 10, 2025.</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                {[
                  { date: 'Jan 12, 2025', user: 'Admin User', action: 'Gross updated from 180K to 215K', type: 'UPDATE' },
                  { date: 'Jan 05, 2025', user: 'Admin User', action: 'IBAN number updated for HBL account', type: 'UPDATE' },
                  { date: 'Dec 28, 2024', user: 'System', action: 'EOBI status verified as Active', type: 'VERIFICATION' },
                  { date: 'Dec 15, 2024', user: 'Payroll Officer', action: 'Profile created and template assigned', type: 'CREATE' },
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-primary z-10" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.date}</p>
                      <h5 className="text-sm font-bold text-gray-800 mt-1">{item.action}</h5>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <User size={12} /> {item.user} • <span className="text-primary font-bold">{item.type}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <CheckCircle2 size={16} className="text-green-500" /> All Mandatory Fields Ready
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave({ gross })}
              className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
