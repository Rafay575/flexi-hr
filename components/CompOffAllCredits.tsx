
import React, { useState } from 'react';
import { 
  Zap, FileSpreadsheet, Search, Filter, Clock, AlertTriangle, 
  CheckCircle2, History, Users, MoreHorizontal, Mail, 
  Calendar, ArrowUpRight, CheckSquare, XCircle, ChevronRight
} from 'lucide-react';

interface OrgCompOff {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  earnedDate: string;
  amount: number;
  expiryDate: string;
  status: 'Available' | 'Pending' | 'Used' | 'Expired';
  source: string;
  daysRemaining?: number;
}

const MOCK_ORG_CREDITS: OrgCompOff[] = [
  { id: 'CO-501', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', earnedDate: 'Dec 25, 2024', amount: 1.0, expiryDate: 'Mar 25, 2025', status: 'Available', source: 'Worked Holiday', daysRemaining: 45 },
  { id: 'CO-502', employee: 'Sara Miller', avatar: 'SM', dept: 'Product', earnedDate: 'Jan 05, 2025', amount: 1.0, expiryDate: 'Apr 05, 2025', status: 'Available', source: 'Extra Shift', daysRemaining: 56 },
  { id: 'CO-503', employee: 'Tom Chen', avatar: 'TC', dept: 'Engineering', earnedDate: 'Feb 10, 2025', amount: 0.5, expiryDate: 'May 10, 2025', status: 'Pending', source: 'Approved OT' },
  { id: 'CO-504', employee: 'Anna Bell', avatar: 'AB', dept: 'Design', earnedDate: 'Jan 15, 2025', amount: 1.0, expiryDate: 'Feb 28, 2025', status: 'Available', source: 'Worked Holiday', daysRemaining: 12 },
  { id: 'CO-505', employee: 'Zoya Malik', avatar: 'ZM', dept: 'Engineering', earnedDate: 'Nov 12, 2024', amount: 1.0, expiryDate: 'Feb 12, 2025', status: 'Available', source: 'Worked Holiday', daysRemaining: 2 },
  { id: 'CO-506', employee: 'Ali Raza', avatar: 'AR', dept: 'HR', earnedDate: 'Dec 10, 2024', amount: 1.0, expiryDate: 'Mar 10, 2025', status: 'Used', source: 'Extra Shift' },
];

export const CompOffAllCredits = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = MOCK_ORG_CREDITS.filter(item => {
    if (activeTab === 'Pending Requests' && item.status !== 'Pending') return false;
    if (activeTab === 'Expiring Soon' && (!item.daysRemaining || item.daysRemaining > 30)) return false;
    return item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">All Comp-Off Credits</h2>
          <p className="text-gray-500 font-medium">Organization-wide administration of earned leave credits.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <FileSpreadsheet size={18} /> Export Excel
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="p-2 bg-indigo-50 text-[#3E3B6F] rounded-lg w-fit"><Zap size={20}/></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Outstanding</p>
          <h4 className="text-2xl font-bold text-gray-900">456.0 Days</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit"><Clock size={20}/></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Approval</p>
          <h4 className="text-2xl font-bold text-gray-900">12 Requests</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg w-fit"><AlertTriangle size={20}/></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiring This Month</p>
          <h4 className="text-2xl font-bold text-red-600">45.0 Days</h4>
        </div>
        <div className="bg-[#3E3B6F] p-6 rounded-3xl shadow-lg shadow-[#3E3B6F]/20 space-y-3 text-white">
          <div className="p-2 bg-white/10 text-[#E8D5A3] rounded-lg w-fit"><History size={20}/></div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Credited This Year</p>
          <h4 className="text-2xl font-bold text-white">890.0 Days</h4>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-2 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {['All', 'Pending Requests', 'Expiring Soon', 'By Department'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedIds([]); }}
                className={`px-5 py-4 text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#3E3B6F]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#3E3B6F] rounded-t-full" />}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-sm relative py-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && activeTab === 'Expiring Soon' && (
          <div className="px-8 py-3 bg-[#3E3B6F] text-white flex items-center justify-between animate-in slide-in-from-top-4">
            <span className="text-sm font-bold">{selectedIds.length} items selected</span>
            <div className="flex gap-3">
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2">
                <Calendar size={14} /> Extend Expiry
              </button>
              <button className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 shadow-lg shadow-red-500/20">
                <AlertTriangle size={14} /> Process Lapse
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {activeTab === 'By Department' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outstanding</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiring</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Used This Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Engineering', out: 145, pen: 4, exp: 12, used: 210 },
                  { name: 'Product', out: 82, pen: 2, exp: 5, used: 120 },
                  { name: 'Design', out: 45, pen: 1, exp: 3, used: 85 },
                  { name: 'Sales', out: 120, pen: 5, exp: 18, used: 310 },
                  { name: 'HR', out: 64, pen: 0, exp: 7, used: 165 },
                ].map((dept) => (
                  <tr key={dept.name} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-900">{dept.name}</td>
                    <td className="px-8 py-5 font-bold text-[#3E3B6F]">{dept.out.toFixed(1)} d</td>
                    <td className="px-8 py-5 font-medium text-amber-600">{dept.pen} req</td>
                    <td className="px-8 py-5 font-medium text-red-600">{dept.exp.toFixed(1)} d</td>
                    <td className="px-8 py-5 font-medium text-gray-500">{dept.used.toFixed(1)} d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  {activeTab === 'Expiring Soon' && <th className="px-8 py-5 w-12"><input type="checkbox" className="rounded text-[#3E3B6F]" /></th>}
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earned On</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                    {activeTab === 'Expiring Soon' && (
                      <td className="px-8 py-5">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                        />
                      </td>
                    )}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                          {item.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.employee}</p>
                          <p className="text-[10px] text-gray-400">{item.dept} • {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-[#3E3B6F]">{item.amount.toFixed(1)} day</td>
                    <td className="px-8 py-5 text-xs text-gray-600">{item.earnedDate}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-700">{item.expiryDate}</span>
                        {item.daysRemaining && item.daysRemaining <= 30 && (
                          <span className={`text-[9px] font-bold uppercase mt-1 ${item.daysRemaining <= 7 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                            {item.daysRemaining} days left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        item.status === 'Used' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2  transition-all">
                        {item.status === 'Pending' ? (
                          <>
                            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckSquare size={16}/></button>
                            <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={16}/></button>
                          </>
                        ) : activeTab === 'Expiring Soon' ? (
                          <>
                            <button title="Extend" className="p-2 text-[#3E3B6F] hover:bg-indigo-50 rounded-lg transition-all"><Calendar size={16}/></button>
                            <button title="Notify" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Mail size={16}/></button>
                          </>
                        ) : (
                          <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg"><MoreHorizontal size={18}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
