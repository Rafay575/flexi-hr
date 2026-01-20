
import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, 
  ChevronDown, ChevronRight, UserCheck, 
  CalendarClock, Globe, ShieldCheck, Layers,
  CreditCard, Briefcase, ExternalLink, Info
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { PayrollStatus } from '../types';
import { PayrollGroupForm } from './PayrollGroupForm';

interface PayrollGroup {
  id: string;
  code: string;
  name: string;
  criteria: string;
  employeeCount: number;
  currency: string;
  officer: string;
  status: PayrollStatus;
  frequency: 'Monthly' | 'Bi-Weekly' | 'Weekly';
  lastRun: string;
}

const MOCK_GROUPS: PayrollGroup[] = [
  { id: 'GRP-001', code: 'CORP-ISL', name: 'Islamabad Corporate Staff', criteria: 'Location: ISB AND Type: Permanent', employeeCount: 145, currency: 'PKR', officer: 'Zainab Siddiqui', status: PayrollStatus.Approved, frequency: 'Monthly', lastRun: 'Dec 31, 2024' },
  { id: 'GRP-002', code: 'FACT-KHI', name: 'Karachi Factory Workers', criteria: 'Dept: Production AND Wage: Daily', employeeCount: 280, currency: 'PKR', officer: 'Ahmed Raza', status: PayrollStatus.Locked, frequency: 'Weekly', lastRun: 'Jan 12, 2025' },
  { id: 'GRP-003', code: 'EXEC-INT', name: 'International Executives', criteria: 'Grade: G20+', employeeCount: 12, currency: 'USD', officer: 'Jane Doe', status: PayrollStatus.Published, frequency: 'Monthly', lastRun: 'Dec 28, 2024' },
  { id: 'GRP-004', code: 'SALE-COMM', name: 'Sales Commission Only', criteria: 'Dept: Sales AND Sub-type: Comm-based', employeeCount: 35, currency: 'PKR', officer: 'Ahmed Raza', status: PayrollStatus.Draft, frequency: 'Bi-Weekly', lastRun: 'N/A' },
  { id: 'GRP-005', code: 'CONT-FT', name: 'Fixed Term Contractors', criteria: 'Contract: Active AND EndDate > Today', employeeCount: 13, currency: 'PKR', officer: 'Zainab Siddiqui', status: PayrollStatus.Pending, frequency: 'Monthly', lastRun: 'Dec 31, 2024' },
];

export const PayrollGroupsList: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredGroups = MOCK_GROUPS.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payroll Groups</h2>
          <p className="text-sm text-gray-500">Segment employees into distinct processing and disbursement cycles</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Group
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-white flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search groups by name or code..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
              <Filter size={14} /> Frequency: All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b sticky-header">
                <th className="px-6 py-5 w-10"></th>
                <th className="px-6 py-5">Code</th>
                <th className="px-6 py-5">Group Name</th>
                <th className="px-6 py-5">Employees</th>
                <th className="px-6 py-5 text-center">Currency</th>
                <th className="px-6 py-5">Assigned Officer</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredGroups.map((group) => {
                const isExpanded = expandedId === group.id;
                return (
                  <React.Fragment key={group.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${isExpanded ? 'bg-primary/[0.02]' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : group.id)}
                    >
                      <td className="px-6 py-4">
                        {isExpanded ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-gray-300" />}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-primary">{group.code}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{group.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{group.frequency}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users size={16} className="text-gray-400" />
                          <span className="font-bold">{group.employeeCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded border uppercase">
                          {group.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {group.officer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-bold text-gray-600">{group.officer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={group.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-300 hover:text-primary hover:bg-white rounded transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={8} className="px-12 py-8 border-b">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                            {/* Group Criteria Card */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Layers size={14} /> Group Inclusion Criteria
                              </h5>
                              <div className="p-4 bg-gray-50 rounded-lg font-mono text-xs text-primary leading-relaxed border border-gray-100">
                                {group.criteria}
                              </div>
                              <div className="flex items-center gap-6 pt-2">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-400 uppercase">Last Processed</span>
                                  <span className="text-xs font-bold text-gray-600">{group.lastRun}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-400 uppercase">Next Cycle</span>
                                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                                    <CalendarClock size={12} /> Jan 31, 2025
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Employee Sample Card */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                  <UserCheck size={14} /> Group Members Sample
                                </h5>
                                <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                                  View All <ExternalLink size={12} />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['Arsalan K.', 'Saira A.', 'Umar F.', 'Zainab B.', 'Mustafa K.', 'Hassan R.', 'Fatima Z.'].map((name, i) => (
                                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[11px] font-bold text-gray-600 group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default">
                                    <div className="w-4 h-4 rounded-full bg-primary/10 text-[8px] flex items-center justify-center font-black">
                                      {name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {name}
                                  </div>
                                ))}
                                <div className="px-3 py-1.5 bg-gray-100 rounded-full text-[11px] font-black text-gray-400">
                                  +{group.employeeCount - 7} more
                                </div>
                              </div>
                              <div className="pt-2">
                                <button className="w-full py-2.5 bg-primary/5 text-primary rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-colors border border-primary/10 flex items-center justify-center gap-2">
                                  <ShieldCheck size={14} /> Run Compliance Check
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>Showing {filteredGroups.length} Payroll Groups</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gray-400" />
                  <span>PKR & USD Enabled</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informational Toast */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-4 shadow-sm max-w-2xl">
        <Info size={20} className="text-blue-500 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900 leading-tight tracking-tight">System Smart-Grouping</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Groups marked as "Approved" are ready for the January cycle. Any changes to employee master data (Dept/Grade) will automatically trigger a membership re-evaluation during the next sync.
          </p>
        </div>
      </div>

      <PayrollGroupForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(data) => {
          console.log('Saved group:', data);
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};
