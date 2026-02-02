
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Edit3, 
  Copy, 
  History, 
  PlayCircle, 
  Power,
  Info,
  Clock,
  Briefcase,
  Building2,
  Zap,
  Globe,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PolicyType = 'OFFICE' | 'FACTORY' | 'FIELD' | 'FLEXI';
type DeductionRule = 'LEAVE_AUTO' | 'SALARY_DEDUCT' | 'NONE';

interface AttendancePolicy {
  id: string;
  code: string;
  name: string;
  type: PolicyType;
  thresholds: {
    present: number;
    halfDay: number;
    shortDay: number;
  };
  deductionRule: DeductionRule;
  employeeCount: number;
  version: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const TYPE_CONFIG: Record<PolicyType, { label: string; color: string; icon: React.ReactNode }> = {
  OFFICE: { label: 'Office', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Briefcase size={14} /> },
  FACTORY: { label: 'Factory', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Building2 size={14} /> },
  FIELD: { label: 'Field', color: 'bg-green-50 text-green-600 border-green-100', icon: <Globe size={14} /> },
  FLEXI: { label: 'Flexi', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <Zap size={14} /> },
};

const DEDUCTION_CONFIG: Record<DeductionRule, { label: string; color: string }> = {
  LEAVE_AUTO: { label: 'Leave Auto-Deduct', color: 'text-indigo-600' },
  SALARY_DEDUCT: { label: 'Salary Deduct', color: 'text-red-600' },
  NONE: { label: 'No Deduction', color: 'text-gray-400' },
};

const MOCK_POLICIES: AttendancePolicy[] = [
  { id: 'POL-01', code: 'STD_OFF', name: 'Standard Office Policy', type: 'OFFICE', thresholds: { present: 8, halfDay: 4, shortDay: 2 }, deductionRule: 'LEAVE_AUTO', employeeCount: 450, version: 'v2.4', status: 'ACTIVE' },
  { id: 'POL-02', code: 'FAC_PROD', name: 'Production Floor Rules', type: 'FACTORY', thresholds: { present: 9, halfDay: 5, shortDay: 3 }, deductionRule: 'SALARY_DEDUCT', employeeCount: 1200, version: 'v1.1', status: 'ACTIVE' },
  { id: 'POL-03', code: 'FIELD_SALES', name: 'Field Force Attendance', type: 'FIELD', thresholds: { present: 7, halfDay: 3.5, shortDay: 1 }, deductionRule: 'NONE', employeeCount: 85, version: 'v3.0', status: 'ACTIVE' },
  { id: 'POL-04', code: 'EXEC_FLEX', name: 'Executive Flexi Rules', type: 'FLEXI', thresholds: { present: 8, halfDay: 4, shortDay: 0 }, deductionRule: 'LEAVE_AUTO', employeeCount: 32, version: 'v2.0', status: 'ACTIVE' },
  { id: 'POL-05', code: 'INT_TRAIN', name: 'Internship Program', type: 'OFFICE', thresholds: { present: 4, halfDay: 2, shortDay: 1 }, deductionRule: 'NONE', employeeCount: 15, version: 'v1.0', status: 'INACTIVE' },
];

export const AttendancePolicyList: React.FC<{ onCreateNew?: () => void }> = ({ onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredPolicies = MOCK_POLICIES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#3E3B6F]" size={28} /> Attendance Policies
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Configure work-hour thresholds and penalty calculations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Search policy code or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium w-64 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => navigate("/timesync/policy-builder/new")}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Policy
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-5">Code & Name</th>
                <th className="px-6 py-5">Policy Type</th>
                <th className="px-6 py-5">Thresholds (P/HD/SD)</th>
                <th className="px-6 py-5">Deductions</th>
                <th className="px-6 py-5 text-center">Employees</th>
                <th className="px-6 py-5">Version</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#3E3B6F]/5 flex items-center justify-center text-[10px] font-black text-[#3E3B6F] border border-[#3E3B6F]/10">
                        {policy.code.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{policy.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{policy.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${TYPE_CONFIG[policy.type].color}`}>
                      {TYPE_CONFIG[policy.type].icon}
                      {TYPE_CONFIG[policy.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-700 tabular-nums">
                      <Clock size={14} className="text-gray-300" />
                      {policy.thresholds.present}h <span className="text-gray-300">/</span> {policy.thresholds.halfDay}h <span className="text-gray-300">/</span> {policy.thresholds.shortDay}h
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold ${DEDUCTION_CONFIG[policy.deductionRule].color}`}>
                      {DEDUCTION_CONFIG[policy.deductionRule].label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-xs font-black text-gray-500 tabular-nums">
                      <Settings2 size={12} className="opacity-40" /> {policy.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[11px] font-bold text-[#3E3B6F] bg-indigo-50 px-2 py-0.5 rounded shadow-inner">
                      {policy.version}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${policy.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${policy.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                        {policy.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="Edit"><Edit3 size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="Simulate Results"><PlayCircle size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-lg transition-all" title="Version History"><History size={16}/></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all" title="Clone"><Copy size={16}/></button>
                      <div className="w-px h-4 bg-gray-100 mx-1"></div>
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Deactivate"><Power size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-3 max-w-2xl">
             <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
             <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
               <span className="font-bold text-gray-700">Policy Hierarchy:</span> Individual Assignments {'>'} Department Defaults {'>'} Site Defaults. Thresholds define the minimum net work hours required for specific attendance statuses. Regularizations override these system flags upon approval.
             </p>
          </div>
          <button className="px-6 py-2 bg-white border border-gray-200 text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
             Run Compliance Check <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
