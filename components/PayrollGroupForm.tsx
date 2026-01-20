
import React, { useState } from 'react';
import { 
  X, Save, Plus, Search, Filter, 
  Users, UserCheck, Shield, ChevronDown, 
  Info, Trash2, LayoutGrid, Globe, Lock,
  Building2, Briefcase, Tag, Check
} from 'lucide-react';
import { PayrollStatus } from '../types';

interface PayrollGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type Criterion = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

const FIELDS = ['Branch', 'Dept', 'Grade', 'Designation', 'Cost Center', 'Employment Type'];

export const PayrollGroupForm: React.FC<PayrollGroupFormProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [status, setStatus] = useState<PayrollStatus>(PayrollStatus.Draft);
  
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', field: 'Dept', operator: 'is', value: 'Engineering' }
  ]);
  
  const [selectedField, setSelectedField] = useState(FIELDS[0]);
  const [selectedValue, setSelectedValue] = useState('');

  const addCriterion = () => {
    if (!selectedValue) return;
    const newId = Math.random().toString(36).substr(2, 9);
    setCriteria([...criteria, { id: newId, field: selectedField, operator: 'is', value: selectedValue }]);
    setSelectedValue('');
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  if (!isOpen) return null;

  const matchingCount = Math.max(0, 485 - (criteria.length * 85) + (name.length * 2));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 leading-tight">Payroll Group Configuration</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Setup disbursement & logic parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-h-[80vh]">
          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Group Code</label>
              <input 
                type="text" 
                placeholder="e.g. PK-KHI-OPS" 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Currency</label>
              <select 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Group Name</label>
            <input 
              type="text" 
              placeholder="e.g. Karachi Operations - Permanent" 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
            <textarea 
              rows={2}
              placeholder="Internal notes regarding this group purpose..." 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Criteria Builder */}
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Filter size={14} className="text-primary" /> Criteria Builder (AND Logic)
            </h4>
            
            {/* Input Row */}
            <div className="flex gap-2">
              <select 
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                value={selectedField}
                onChange={e => setSelectedField(e.target.value)}
              >
                {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <input 
                type="text" 
                placeholder="Value..." 
                className="flex-[1.5] px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none"
                value={selectedValue}
                onChange={e => setSelectedValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCriterion()}
              />
              <button 
                onClick={addCriterion}
                className="px-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Pills Display */}
            <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
              {criteria.length === 0 && <p className="text-[10px] text-gray-400 italic">No filters applied. All employees will match.</p>}
              {criteria.map((c, idx) => (
                <React.Fragment key={c.id}>
                  {idx > 0 && <span className="text-[9px] font-black text-primary/30 self-center">AND</span>}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-primary/20 rounded-full text-[11px] font-bold text-primary group animate-in slide-in-from-left-2 shadow-sm">
                    <span className="text-gray-400 font-medium">{c.field}:</span>
                    <span>{c.value}</span>
                    <button onClick={() => removeCriterion(c.id)} className="hover:text-red-500 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Preview Match */}
          <div className="p-4 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Dynamic Population</p>
                <p className="text-base font-black">{matchingCount} Employees Match</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
              View Matching
            </button>
          </div>

          {/* Access & Workflow */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <UserCheck size={14} /> Assigned Officers
              </label>
              <div className="relative group">
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold flex flex-wrap gap-1 min-h-[40px] cursor-pointer hover:border-primary/30">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">Zainab S. <X size={10} /></span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">Ahmed R. <X size={10} /></span>
                  <Plus size={12} className="text-gray-400 ml-auto self-center" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Lock size={14} /> Approval Workflow
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none cursor-pointer">
                <option>Standard (Officer - HR Manager)</option>
                <option>Executive (C-Suite Only)</option>
                <option>Direct (Auto-approve on Run)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 space-y-1">
             <div className="flex flex-col flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Initial Status</label>
                <div className="flex gap-2">
                  {[PayrollStatus.Draft, PayrollStatus.Approved].map(s => (
                    <button 
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-3 py-1 rounded text-[10px] font-black uppercase border transition-all ${status === s ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Shield size={14} className="text-green-500" /> Policy Compliant
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave({ name, code, criteria, status, currency })}
              className="px-8 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
            >
              <Save size={16} /> Save Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
