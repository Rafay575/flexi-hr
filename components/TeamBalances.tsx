
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, FileSpreadsheet, ChevronDown, ChevronRight, 
  AlertTriangle, CheckCircle2, User, ArrowUpDown, Info
} from 'lucide-react';

interface EmployeeBalance {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  annual: { used: number; total: number };
  casual: { used: number; total: number };
  sick: { used: number; total: number };
  compOff: { used: number; total: number };
  isOnLeave: boolean;
}

const MOCK_TEAM: EmployeeBalance[] = [
  { id: 'EMP-101', name: 'John Doe', avatar: 'JD', dept: 'Engineering', annual: { used: 8, total: 24 }, casual: { used: 3, total: 10 }, sick: { used: 2, total: 12 }, compOff: { used: 0, total: 2 }, isOnLeave: false },
  { id: 'EMP-102', name: 'Sara Khan', avatar: 'SK', dept: 'Product', annual: { used: 22, total: 24 }, casual: { used: 9, total: 10 }, sick: { used: 1, total: 12 }, compOff: { used: 1, total: 1 }, isOnLeave: true },
  { id: 'EMP-103', name: 'Ahmed Ali', avatar: 'AA', dept: 'Engineering', annual: { used: 12, total: 24 }, casual: { used: 5, total: 10 }, sick: { used: 11, total: 12 }, compOff: { used: 2, total: 2 }, isOnLeave: false },
  { id: 'EMP-104', name: 'Zoya Malik', avatar: 'ZM', dept: 'Design', annual: { used: 5, total: 24 }, casual: { used: 2, total: 10 }, sick: { used: 0, total: 12 }, compOff: { used: 0, total: 0 }, isOnLeave: false },
  { id: 'EMP-105', name: 'Ali Raza', avatar: 'AR', dept: 'Engineering', annual: { used: 24, total: 24 }, casual: { used: 10, total: 10 }, sick: { used: 12, total: 12 }, compOff: { used: 5, total: 5 }, isOnLeave: false },
  { id: 'EMP-106', name: 'Mona Shah', avatar: 'MS', dept: 'Engineering', annual: { used: 2, total: 24 }, casual: { used: 1, total: 10 }, sick: { used: 1, total: 12 }, compOff: { used: 0, total: 3 }, isOnLeave: false },
  { id: 'EMP-107', name: 'Hamza Aziz', avatar: 'HA', dept: 'Design', annual: { used: 15, total: 24 }, casual: { used: 4, total: 10 }, sick: { used: 2, total: 12 }, compOff: { used: 1, total: 1 }, isOnLeave: false },
];

export const TeamBalances = () => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredTeam = useMemo(() => {
    return MOCK_TEAM.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.id.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'All' || emp.dept === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [search, deptFilter]);

  const getBalanceDisplay = (used: number, total: number) => {
    const rem = total - used;
    const colorClass = rem === 0 ? 'text-red-500 font-bold' : rem < 3 ? 'text-orange-500 font-bold' : 'text-gray-700';
    return (
      <div className="flex flex-col">
        <span className={colorClass}>{rem} / {total}</span>
        <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
          <div 
            className={`h-full ${rem === 0 ? 'bg-red-500' : rem < 3 ? 'bg-orange-500' : 'bg-[#3E3B6F]'}`} 
            style={{ width: `${(rem / total) * 100}%` }} 
          />
        </div>
      </div>
    );
  };

  const getStatusBadge = (emp: EmployeeBalance) => {
    const totalRem = (emp.annual.total - emp.annual.used) + (emp.casual.total - emp.casual.used) + (emp.sick.total - emp.sick.used);
    
    if (emp.isOnLeave) return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">On Leave</span>;
    if (totalRem < 5) return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">Low Balance</span>;
    return <span className="text-emerald-500 font-bold text-[10px] uppercase flex items-center gap-1"><CheckCircle2 size={12} /> OK</span>;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Team Balances</h2>
          <p className="text-gray-500">Monitor entitlements and availability across your department.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-[#3E3B6F]/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
          </select>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10">
            <FileSpreadsheet size={18} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Annual</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Casual</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sick</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comp-Off</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Total Rem.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeam.map((emp) => {
                const totalRem = (emp.annual.total - emp.annual.used) + (emp.casual.total - emp.casual.used) + (emp.sick.total - emp.sick.used);
                const isExpanded = expandedRow === emp.id;
                
                return (
                  <React.Fragment key={emp.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${isExpanded ? 'bg-gray-50/50' : ''}`}
                      onClick={() => setExpandedRow(isExpanded ? null : emp.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-sm">
                            {emp.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">{emp.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-1.5">{emp.id} • {emp.dept}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">{getBalanceDisplay(emp.annual.used, emp.annual.total)}</td>
                      <td className="px-6 py-5 text-sm">{getBalanceDisplay(emp.casual.used, emp.casual.total)}</td>
                      <td className="px-6 py-5 text-sm">{getBalanceDisplay(emp.sick.used, emp.sick.total)}</td>
                      <td className="px-6 py-5 text-sm">{emp.compOff.total > 0 ? getBalanceDisplay(emp.compOff.used, emp.compOff.total) : <span className="text-gray-300">-</span>}</td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-bold ${totalRem < 5 ? 'text-red-600' : 'text-[#3E3B6F]'}`}>
                            {totalRem} d
                          </span>
                          {totalRem < 5 && <AlertTriangle size={12} className="text-red-500 mt-1" />}
                        </div>
                      </td>
                      <td className="px-6 py-5">{getStatusBadge(emp)}</td>
                      <td className="px-6 py-5 text-right">
                        <ChevronRight size={18} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50/30">
                        <td colSpan={8} className="px-12 py-6">
                          <div className="flex gap-8">
                            <div className="flex-1 space-y-4">
                              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} /> Recent Transactions for {emp.name}
                              </h5>
                              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                {[
                                  { type: 'Accrual', date: 'Jan 31, 2025', desc: 'Monthly Accrual', qty: '+2.00', color: 'text-emerald-500' },
                                  { type: 'Leave', date: 'Jan 15, 2025', desc: 'Annual Leave (LV-102)', qty: '-3.00', color: 'text-red-500' },
                                  { type: 'Carry', date: 'Jan 01, 2025', desc: 'CF from 2024', qty: '+5.00', color: 'text-emerald-500' },
                                ].map((t, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 text-xs border-b border-gray-50 last:border-0">
                                    <div>
                                      <p className="font-bold text-gray-700">{t.desc}</p>
                                      <p className="text-gray-400">{t.date}</p>
                                    </div>
                                    <span className={`font-bold ${t.color}`}>{t.qty} d</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="w-64 space-y-4">
                               <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Year Utilization</h5>
                               <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                  <div className="flex justify-between text-xs">
                                     <span className="text-gray-500">Avg. Response Time</span>
                                     <span className="font-bold text-gray-700">4.2h</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                     <span className="text-gray-500">Reliability Score</span>
                                     <span className="font-bold text-emerald-600">98%</span>
                                  </div>
                                  <button className="w-full mt-2 py-2 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all">
                                    VIEW FULL AUDIT
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
            <tfoot className="bg-gray-50/50">
               <tr className="border-t-2 border-gray-100 font-bold text-gray-700">
                 <td className="px-6 py-4 text-xs uppercase tracking-widest text-gray-400">Team Averages</td>
                 <td className="px-6 py-4 text-sm">16.4 d</td>
                 <td className="px-6 py-4 text-sm">7.2 d</td>
                 <td className="px-6 py-4 text-sm">8.8 d</td>
                 <td className="px-6 py-4 text-sm">1.5 d</td>
                 <td className="px-6 py-4 text-center">
                    <span className="text-sm text-[#3E3B6F]">Σ 244 Total Days</span>
                 </td>
                 <td colSpan={2} className="px-6 py-4"></td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
