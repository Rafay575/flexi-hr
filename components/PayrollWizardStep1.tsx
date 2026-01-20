
import React, { useState } from 'react';
import { 
  Calendar, Check, ChevronRight, Users, 
  Settings2, AlertTriangle, Building2, 
  ArrowRight, Info, Layers, UserPlus, UserMinus
} from 'lucide-react';

interface PayrollWizardStep1Props {
  onNext: (data: any) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Select' },
  { id: 2, label: 'Ingest' },
  { id: 3, label: 'Calculate' },
  { id: 4, label: 'Exceptions' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Approve' },
  { id: 7, label: 'Finalize' }
];

const MOCK_GROUPS = [
  { id: 'G1', name: 'Islamabad Corporate Staff', count: 145 },
  { id: 'G2', name: 'Karachi Operations', count: 280 },
  { id: 'G3', name: 'Executive Management', count: 12 },
  { id: 'G4', name: 'Sales Commission Group', count: 35 },
  { id: 'G5', name: 'Fixed Term Contractors', count: 13 }
];

export const PayrollWizardStep1: React.FC<PayrollWizardStep1Props> = ({ onNext, onCancel }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['G1', 'G2']);
  const [runType, setRunType] = useState('Regular');
  const [includeJoiners, setIncludeJoiners] = useState(true);
  const [includeExits, setIncludeExits] = useState(false);

  const totalEmployees = MOCK_GROUPS
    .filter(g => selectedGroups.includes(g.id))
    .reduce((acc, curr) => acc + curr.count, 0);

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Wizard Header & Steps */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id === 1 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                  step.id < 1 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step.id < 1 ? <Check size={18} /> : <span className="text-xs font-black">{step.id}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  step.id === 1 ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-100 mx-4 mt-[-18px]" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Configuration */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Period & Type
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Payroll Period</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer"
                  >
                    <option value="2025-01">January 2025 (Open)</option>
                    <option value="2024-12">December 2024 (Correction Only)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Run Nature</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Regular', 'Supplementary', 'Bonus'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setRunType(type)}
                        className={`px-3 py-2.5 rounded-lg border text-[10px] font-black uppercase transition-all ${
                          runType === type ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                <Settings2 size={16} className="text-primary" /> Execution Options
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setIncludeJoiners(!includeJoiners)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${includeJoiners ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100'}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <UserPlus size={18} className={includeJoiners ? 'text-green-600' : 'text-gray-300'} />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Include New Joiners</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Auto-add employees joined this period</p>
                    </div>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-all ${includeJoiners ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeJoiners ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>

                <button 
                  onClick={() => setIncludeExits(!includeExits)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${includeExits ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-gray-100'}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <UserMinus size={18} className={includeExits ? 'text-orange-600' : 'text-gray-300'} />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Include Exits / F&F</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Process final settlements in this batch</p>
                    </div>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-all ${includeExits ? 'bg-orange-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeExits ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Group Selection & Preview */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <Layers size={16} className="text-primary" /> Target Groups
                </h3>
                <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">
                  {selectedGroups.length} Selected
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 max-h-[250px] overflow-y-auto space-y-2 custom-scrollbar">
                {MOCK_GROUPS.map(group => (
                  <label 
                    key={group.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedGroups.includes(group.id) ? 'bg-white border-primary/20 shadow-sm' : 'bg-transparent border-transparent grayscale'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => toggleGroup(group.id)}
                        className="w-4 h-4 accent-primary rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-700">{group.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400">{group.count} Emps</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Run Check Warning */}
            {selectedGroups.includes('G1') && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 animate-in shake duration-500">
                <AlertTriangle size={18} className="text-orange-500 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-orange-900">Active Run Detected</h4>
                  <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                    A 'Draft' run (v1.0) already exists for Islamabad Corporate. Proceeding will overwrite or increment version to v1.1.
                  </p>
                </div>
              </div>
            )}

            {/* Selection Summary */}
            <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Batch Volume</p>
                  <h4 className="text-3xl font-black text-accent leading-none mt-1">{totalEmployees}</h4>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <Users size={28} className="text-accent" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Department Composition</h5>
                <div className="space-y-2">
                  {[
                    { dept: 'Engineering', count: Math.round(totalEmployees * 0.45), perc: 45 },
                    { dept: 'Operations', count: Math.round(totalEmployees * 0.35), perc: 35 },
                    { dept: 'Others', count: Math.round(totalEmployees * 0.20), perc: 20 }
                  ].map((d, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-white/80">{d.dept}</span>
                        <span>{d.count}</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${d.perc}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-10 pt-8 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
            <Info size={14} className="text-primary" /> Selecting scope does not commit data
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={selectedGroups.length === 0}
              onClick={() => onNext({ selectedPeriod, selectedGroups, runType })}
              className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Ingestion <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
