
import React, { useState } from 'react';
import { 
  X, Save, Send, Info, ChevronRight, Calculator, ShieldCheck, 
  Users, Clock, Zap, FileText, Settings2, Palette, Eye,
  Lock, Calendar, HeartPulse, Coffee, Baby, Plane
} from 'lucide-react';

type TabId = 'basic' | 'quota' | 'counting' | 'balance' | 'eligibility' | 'accrual' | 'compliance';

export const LeaveTypeForm: React.FC<{ isOpen: boolean; onClose: () => void; initialData?: any }> = ({ isOpen, onClose, initialData }) => {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [formData, setFormData] = useState({
    code: 'ANNUAL',
    name: 'Annual Leave',
    category: 'Paid',
    unit: 'Days',
    quotaType: 'fixed',
    annualQuota: 14,
    minRequest: 1,
    maxRequest: 14,
    advanceNotice: 3,
    backdated: 0,
    includeWeekends: false,
    includeHolidays: false,
    sandwichRule: true,
    negativeBalance: 'not_allowed',
    carryForward: true,
    maxCarryForward: 5,
    gender: 'Any',
    tenure: 0,
    probation: false,
    accrualType: 'Monthly',
    attachmentRequired: 'threshold',
    attachmentThreshold: 3,
    color: '#3E3B6F'
  });

  if (!isOpen) return null;

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'basic', label: 'Basic Info', icon: <FileText size={16} /> },
    { id: 'quota', label: 'Quota & Limits', icon: <Calculator size={16} /> },
    { id: 'counting', label: 'Counting Rules', icon: <Settings2 size={16} /> },
    { id: 'balance', label: 'Balance Policy', icon: <Zap size={16} /> },
    { id: 'eligibility', label: 'Eligibility', icon: <Users size={16} /> },
    { id: 'accrual', label: 'Accrual', icon: <Clock size={16} /> },
    { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={16} /> },
  ];

  const update = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-[#F5F5F5] w-full max-w-6xl h-[90vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl scale-in-center">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-[#3E3B6F]">
              <Settings2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{initialData ? `Edit Leave Type: ${formData.name}` : 'Create Leave Type'}</h2>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded border border-amber-100">v3 (Draft)</span>
              </div>
              <p className="text-sm text-gray-400 font-medium">Configure rules, entitlements and compliance workflows.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
              <Save size={18} /> Save Draft
            </button>
            <button className="px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 hover:bg-[#4A4680] transition-all flex items-center gap-2">
              <Send size={18} /> Publish v3
            </button>
            <button onClick={onClose} className="p-2 ml-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Tabs */}
          <div className="w-64 bg-white border-r border-gray-100 py-6 overflow-y-auto">
            <div className="px-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-[#3E3B6F] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-8 px-8">
              <button className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest hover:underline flex items-center gap-2">
                Version History <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Center Form Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-form-scroll">
            <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {activeTab === 'basic' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type Code *</label>
                      <input 
                        type="text" 
                        value={formData.code}
                        onChange={(e) => update('code', e.target.value.toUpperCase())}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20"
                        placeholder="e.g. ANNUAL"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name *</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/20 resize-none"
                      placeholder="Explain the purpose of this leave type..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                      <div className="flex gap-4">
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#3E3B6F] group">
                          <input type="radio" name="cat" defaultChecked className="text-[#3E3B6F]" />
                          <span className="text-sm font-bold text-gray-700">Paid</span>
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#3E3B6F]">
                          <input type="radio" name="cat" className="text-[#3E3B6F]" />
                          <span className="text-sm font-bold text-gray-700">Unpaid</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unit</label>
                      <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none">
                        <option>Days</option>
                        <option>Half-days</option>
                        <option>Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quota' && (
                <div className="space-y-8">
                  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700">Annual Quota Allocation</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">Unlimited</span>
                        <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Fixed Yearly Amount</p>
                        <input type="number" defaultValue={14} className="w-full p-4 bg-gray-50 rounded-xl text-2xl font-bold text-[#3E3B6F] outline-none" />
                      </div>
                      <span className="mb-4 text-gray-400 font-bold uppercase text-[10px]">Days / Year</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min per Request</label>
                      <input type="number" defaultValue={0.5} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max per Request</label>
                      <input type="number" defaultValue={14} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Advance Notice (Days)</label>
                      <input type="number" defaultValue={3} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Backdated Allow (Days)</label>
                      <input type="number" defaultValue={0} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'counting' && (
                <div className="space-y-6">
                  {[
                    { label: 'Include Weekends in Count', desc: 'Saturdays and Sundays will be deducted from balance.' },
                    { label: 'Include Holidays in Count', desc: 'Public holidays will be deducted from balance.' },
                    { label: 'Sandwich Rule Applies', desc: 'Holidays between two leave days are counted as leave.', pro: true },
                    { label: 'Roster-Aware Counting', desc: 'Use shift data from TimeSync module.', pro: true },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-gray-800">{rule.label}</h5>
                          {rule.pro && <span className="px-1.5 py-0.5 bg-indigo-50 text-[#3E3B6F] text-[8px] font-bold rounded">PRO</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{rule.desc}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${i === 2 ? 'bg-[#3E3B6F]' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${i === 2 ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'balance' && (
                <div className="space-y-8">
                   <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Insufficient Balance Handling</label>
                     <div className="grid gap-3">
                        {['Reject Request', 'Allow Negative (with limit)', 'Auto-convert to Unpaid'].map((opt, i) => (
                          <label key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-[#3E3B6F]">
                            <input type="radio" name="insuf" defaultChecked={i === 0} className="text-[#3E3B6F]" />
                            <span className="text-sm font-bold text-gray-700">{opt}</span>
                          </label>
                        ))}
                     </div>
                   </div>

                   <div className="p-6 bg-indigo-900 text-white rounded-[24px] space-y-6 relative overflow-hidden shadow-xl">
                      <Zap size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <RefreshCwIcon size={20} className="text-indigo-300" />
                            <h5 className="font-bold">Carry Forward Rules</h5>
                          </div>
                          <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
                            <div className="absolute left-6 top-1 w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Max Days CF</p>
                             <input type="number" defaultValue={5} className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white font-bold outline-none" />
                           </div>
                           <div className="space-y-2">
                             <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Expiry Period</p>
                             <select className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white font-bold outline-none appearance-none">
                               <option>End of Q1</option>
                               <option>Never</option>
                             </select>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'eligibility' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employee Scope</label>
                    <div className="flex gap-4">
                      <label className="flex-1 p-5 bg-white border-2 border-[#3E3B6F] rounded-2xl cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <Users size={20} className="text-[#3E3B6F]" />
                          <input type="radio" name="scope" defaultChecked />
                        </div>
                        <p className="text-sm font-bold text-gray-800">All Employees</p>
                        <p className="text-[10px] text-gray-400 uppercase mt-1">450 Eligible staff</p>
                      </label>
                      <label className="flex-1 p-5 bg-white border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <Users size={20} className="text-gray-400" />
                          <input type="radio" name="scope" />
                        </div>
                        <p className="text-sm font-bold text-gray-800">Specific Groups</p>
                        <p className="text-[10px] text-gray-400 uppercase mt-1">Segment by dept, site...</p>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gender Exclusion</label>
                      <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none">
                        <option>Any</option>
                        <option>Male Only</option>
                        <option>Female Only</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min Tenure (Months)</label>
                      <input type="number" defaultValue={0} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employment Types</label>
                    <div className="flex flex-wrap gap-3">
                      {['Permanent', 'Contract', 'Intern', 'Trainee'].map((type, i) => (
                        <label key={i} className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-indigo-50 transition-all">
                          <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded text-[#3E3B6F]" />
                          <span className="text-xs font-bold text-gray-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'accrual' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accrual Frequency</label>
                      <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none">
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Annual</option>
                        <option>None (Full quota on Jan 1)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount per period</label>
                      <div className="relative">
                        <input type="number" defaultValue={1.16} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none font-bold" />
                        <span className="absolute right-3 top-3 text-[10px] font-bold text-gray-400 uppercase">Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Calculator size={20}/></div>
                       <div>
                         <h5 className="text-sm font-bold text-gray-800">Proration Enabled</h5>
                         <p className="text-xs text-gray-400">Calculate accrual based on join/exit dates.</p>
                       </div>
                     </div>
                     <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document Attachment Rule</label>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Never', 'Always', 'By Threshold'].map((opt, i) => (
                          <label key={i} className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-[#3E3B6F] text-center group">
                            <input type="radio" name="attach" defaultChecked={i === 2} className="mb-4" />
                            <span className="text-sm font-bold text-gray-700">{opt}</span>
                            {i === 2 && (
                              <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400">After</span>
                                <input type="number" defaultValue={3} className="w-12 p-1 border rounded text-center text-xs font-bold" />
                                <span className="text-[10px] font-bold text-gray-400">Days</span>
                              </div>
                            )}
                          </label>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Approval Workflow</label>
                     <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3E3B6F] text-white flex items-center justify-center font-bold text-[10px]">1</div>
                          <span className="text-sm font-bold text-gray-700">Immediate Manager</span>
                        </div>
                        <div className="ml-4 border-l-2 border-dashed border-gray-300 pl-8 space-y-4 py-2">
                          <button className="text-[10px] font-bold text-[#3E3B6F] flex items-center gap-1.5 hover:underline">
                            <Plus size={14}/> ADD ADDITIONAL APPROVER ROLE
                          </button>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Preview Sidebar */}
          <div className="w-80 bg-white border-l border-gray-100 p-8 overflow-y-auto shrink-0">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Configuration Preview</h4>
            
            <div className="bg-[#F5F5F5] rounded-3xl p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4" style={{ backgroundColor: formData.color }}>
                   <Calendar size={32} />
                 </div>
                 <h5 className="font-bold text-gray-900">{formData.name}</h5>
                 <p className="text-xs text-gray-400 font-mono mt-1">{formData.code}</p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Yearly Quota</span>
                   <span className="font-bold text-gray-900">{formData.annualQuota} Days</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Accrual</span>
                   <span className="font-bold text-gray-900">{formData.accrualType}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Carry Forward</span>
                   <span className="font-bold text-emerald-600">{formData.carryForward ? `Yes (${formData.maxCarryForward}d)` : 'No'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Sandwich Rule</span>
                   <span className="font-bold text-amber-600">{formData.sandwichRule ? 'Applied' : 'None'}</span>
                 </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                 <div className="flex items-center gap-2 mb-3">
                   <Info size={14} className="text-indigo-400" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Impact Summary</span>
                 </div>
                 <p className="text-[10px] leading-relaxed text-gray-500 italic">
                   Staff can apply for up to {formData.annualQuota} days yearly, accrued {formData.accrualType.toLowerCase()}. 
                   {formData.advanceNotice} days advance notice required. 
                   Eligibility limited to {formData.gender === 'Any' ? 'all' : formData.gender} staff.
                 </p>
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all">
                <Eye size={14} /> SIMULATE IMPACT
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
          .custom-form-scroll::-webkit-scrollbar { width: 4px; }
          .custom-form-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scale-in-center { animation: scale-in-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
          @keyframes scale-in-center {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

const RefreshCwIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
