
import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, ShieldAlert, 
  Landmark, CheckCircle2,
  Users, Layers, Download, UserPlus,
  AlertTriangle, Settings2, Eye
} from 'lucide-react';
import { PayrollStatus } from '../types';
import { EmployeePayProfileForm } from './EmployeePayProfileForm';

interface EmployeeProfile {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  grade: string;
  template: string | null;
  gross: number;
  overridesCount: number;
  bankInfo: boolean;
  statutoryInfo: boolean;
  status: PayrollStatus;
}

const MOCK_PROFILES: EmployeeProfile[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', avatar: 'AK', dept: 'Engineering', grade: 'G18', template: 'ENG-SR-18', gross: 215000, overridesCount: 2, bankInfo: true, statutoryInfo: true, status: PayrollStatus.Approved },
  { id: 'EMP-1002', name: 'Saira Ahmed', avatar: 'SA', dept: 'HR', grade: 'G15', template: 'OPS-G15', gross: 85000, overridesCount: 0, bankInfo: true, statutoryInfo: true, status: PayrollStatus.Approved },
  { id: 'EMP-1003', name: 'Umar Farooq', avatar: 'UF', dept: 'Sales', grade: 'G12', template: null, gross: 45000, overridesCount: 0, bankInfo: false, statutoryInfo: false, status: PayrollStatus.Pending },
  { id: 'EMP-1004', name: 'Zainab Bibi', avatar: 'ZB', dept: 'Operations', grade: 'G15', template: 'OPS-G15', gross: 92000, overridesCount: 1, bankInfo: true, statutoryInfo: true, status: PayrollStatus.Approved },
  { id: 'EMP-1005', name: 'Mustafa Kamal', avatar: 'MK', dept: 'Engineering', grade: 'G20', template: 'EXEC-G20', gross: 550000, overridesCount: 4, bankInfo: true, statutoryInfo: true, status: PayrollStatus.Approved },
];

const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

export const EmployeePayProfilesList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MISSING_TEMPLATE' | 'OVERRIDES'>('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Employee Pay Profiles</h2>
          <p className="text-sm text-gray-500">Manage individual salary mappings and exception overrides</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Download size={18} /> Export Profiles
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <UserPlus size={18} /> Assign Template
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><Users size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
            <h4 className="text-xl font-black text-gray-800">485</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">With Template</p>
            <h4 className="text-xl font-black text-gray-800">480</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Missing Config</p>
            <h4 className="text-xl font-black text-red-600">05</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Settings2 size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Overrides</p>
            <h4 className="text-xl font-black text-blue-600">23</h4>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b space-y-4 bg-white sticky top-0 z-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setFilterType('ALL')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterType === 'ALL' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
              >
                All Profiles
              </button>
              <button 
                onClick={() => setFilterType('MISSING_TEMPLATE')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterType === 'MISSING_TEMPLATE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
              >
                Missing Template
              </button>
              <button 
                onClick={() => setFilterType('OVERRIDES')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterType === 'OVERRIDES' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
              >
                With Overrides
              </button>
            </div>
            
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by ID or name..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b sticky-header">
                <th className="px-6 py-5">Employee Info</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">Grade</th>
                <th className="px-6 py-5">Structure Template</th>
                <th className="px-6 py-5 text-right">Base Gross</th>
                <th className="px-6 py-5 text-center">Overrides</th>
                <th className="px-6 py-5 text-center">Compliance</th>
                <th className="px-6 py-5 text-right w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {MOCK_PROFILES.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                        {profile.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{profile.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{profile.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-600">{profile.dept}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded">{profile.grade}</span>
                  </td>
                  <td className="px-6 py-4">
                    {profile.template ? (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Layers size={14} />
                        <span className="font-bold text-xs">{profile.template}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-500 italic">
                        <AlertTriangle size={14} />
                        <span className="font-bold text-xs tracking-tight">Not Assigned</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-gray-800">{formatPKR(profile.gross)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {profile.overridesCount > 0 ? (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100">
                        {profile.overridesCount} Active
                      </span>
                    ) : (
                      <span className="text-gray-300">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`p-1.5 rounded-md ${profile.bankInfo ? 'text-green-500 bg-green-50' : 'text-red-400 bg-red-50 animate-pulse'}`} title={profile.bankInfo ? "Bank Account Linked" : "Missing Bank Details"}>
                        <Landmark size={16} />
                      </div>
                      <div className={`p-1.5 rounded-md ${profile.statutoryInfo ? 'text-green-500 bg-green-50' : 'text-red-400 bg-red-50 animate-pulse'}`} title={profile.statutoryInfo ? "Statutory Details Verified" : "Missing NTN/EOBI"}>
                        <ShieldAlert size={16} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedEmployee(profile)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" 
                        title="Edit Profile"
                      >
                        <Settings2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" title="View History">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>Showing 5 direct direct profiles</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-500 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-primary">Next</button>
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeePayProfileForm 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
          onSave={(data) => {
            console.log('Saved profile:', data);
            setSelectedEmployee(null);
          }} 
        />
      )}

      {/* Bulk Action Footer Bar (Conditional) */}
      <div className="p-4 bg-primary rounded-xl shadow-2xl flex items-center justify-between text-white animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">5</div>
          <p className="text-sm font-bold">Selected Employees</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest border border-white/20 transition-all">Bulk Update Grade</button>
          <button className="px-4 py-2 bg-accent text-primary rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all">Mass Assign Template</button>
        </div>
      </div>
    </div>
  );
};
