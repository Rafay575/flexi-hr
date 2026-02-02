
import React, { useState } from 'react';
import { 
  Wallet, FileSpreadsheet, Search, Filter, Clock, CheckCircle2, 
  CheckSquare, XCircle, Eye, MoreHorizontal, DollarSign, 
  ArrowUpRight, Download, CreditCard, History, ChevronRight
} from 'lucide-react';

interface EncashmentHRRecord {
  id: string;
  employee: string;
  avatar: string;
  dept: string;
  type: string;
  days: number;
  amount: number;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Processed' | 'Rejected';
  processedOn?: string;
}

const MOCK_ENCASHMENTS: EncashmentHRRecord[] = [
  { id: 'ENC-2025-001', employee: 'Ahmed Khan', avatar: 'AK', dept: 'Engineering', type: 'Annual Leave', days: 5, amount: 25000, submitted: '2h ago', status: 'Pending' },
  { id: 'ENC-2025-002', employee: 'Sara Miller', avatar: 'SM', dept: 'Product', type: 'Annual Leave', days: 8, amount: 40000, submitted: '5h ago', status: 'Pending' },
  { id: 'ENC-2025-003', employee: 'Tom Chen', avatar: 'TC', dept: 'Engineering', type: 'Comp-Off', days: 2, amount: 9600, submitted: '1d ago', status: 'Approved' },
  { id: 'ENC-2025-004', employee: 'Anna Bell', avatar: 'AB', dept: 'Design', type: 'Annual Leave', days: 10, amount: 50000, submitted: 'Jan 12, 2025', status: 'Processed', processedOn: 'Jan 15, 2025' },
  { id: 'ENC-2025-005', employee: 'Zoya Malik', avatar: 'ZM', dept: 'Engineering', type: 'Comp-Off', days: 1, amount: 4800, submitted: 'Jan 10, 2025', status: 'Rejected' },
  { id: 'ENC-2025-006', employee: 'Ali Raza', avatar: 'AR', dept: 'HR', type: 'Annual Leave', days: 4, amount: 20000, submitted: '3h ago', status: 'Pending' },
  { id: 'ENC-2025-007', employee: 'Mona Shah', avatar: 'MS', dept: 'Engineering', type: 'Annual Leave', days: 5, amount: 25000, submitted: 'Jan 14, 2025', status: 'Approved' },
];

export const EncashmentRequestsList = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = MOCK_ENCASHMENTS.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Processed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Wallet size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">Encashment Requests</h2>
            <p className="text-gray-500 font-medium">Review and process leave balance liquidation for payroll.</p>
          </div>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Download size={18} /> Export for PayEdge
        </button>
      </div>

      {/* Financial Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Payouts</p>
            <p className="text-2xl font-bold text-gray-900">PKR 125,000</p>
            <p className="text-[10px] text-amber-600 font-bold mt-1">8 REQUESTS</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approved (Month)</p>
            <p className="text-2xl font-bold text-gray-900">PKR 180,000</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">12 REQUESTS</p>
          </div>
        </div>
        <div className="bg-[#3E3B6F] p-6 rounded-[32px] shadow-lg shadow-[#3E3B6F]/20 flex items-center gap-5 text-white">
          <div className="p-4 bg-white/10 text-[#E8D5A3] rounded-2xl"><CreditCard size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Paid (2025)</p>
            <p className="text-2xl font-bold">PKR 675,000</p>
            <p className="text-[10px] text-[#E8D5A3] font-bold mt-1">45 PROCESSED</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs & Search */}
        <div className="px-8 py-2 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {['Pending', 'Approved', 'Processed', 'Rejected', 'All'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedIds([]); }}
                className={`px-5 py-5 text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#3E3B6F]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#3E3B6F] rounded-t-full" />}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-sm relative py-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search employee or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="px-8 py-4 bg-[#3E3B6F] text-white flex items-center justify-between animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
               <span className="text-sm font-bold">{selectedIds.length} items selected</span>
               <div className="h-4 w-px bg-white/20" />
               <button onClick={() => setSelectedIds([])} className="text-xs text-white/60 hover:text-white underline">Clear Selection</button>
            </div>
            <div className="flex gap-3">
              {activeTab === 'Pending' && (
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                  <CheckSquare size={16} /> Approve Selected
                </button>
              )}
              {activeTab === 'Approved' && (
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20">
                  <CreditCard size={16} /> Mark as Paid
                </button>
              )}
              <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/10">
                <FileSpreadsheet size={16} /> Export for Payroll
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 w-12">
                   <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedIds(e.target.checked ? filteredData.map(r => r.id) : [])}
                    className="rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                   />
                </th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Days</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-[#3E3B6F] focus:ring-[#3E3B6F]" 
                    />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs uppercase shadow-inner">
                        {item.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.employee}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{item.dept} • {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-bold text-gray-900">{item.days.toFixed(1)} d</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-emerald-600">PKR {item.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-600">{item.submitted}</span>
                      {item.processedOn && <span className="text-[9px] font-bold text-blue-500 uppercase mt-1">Paid: {item.processedOn}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2  transition-all">
                      {item.status === 'Pending' && (
                        <>
                          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle2 size={16}/></button>
                          <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={16}/></button>
                        </>
                      )}
                      {item.status === 'Approved' && (
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Mark as Processed"><CreditCard size={16}/></button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg"><Eye size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={32} />
              </div>
              <p className="text-gray-400 font-medium italic">No {activeTab.toLowerCase()} requests found.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <History size={16} className="text-[#3E3B6F]" /> Audit Trail
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Every encashment request is logged and requires multi-level verification. Approved requests are exported to the payroll module at the end of each fiscal period.
          </p>
          <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
             <button className="text-xs font-bold text-[#3E3B6F] hover:underline flex items-center gap-2">
               View Full Process Logs <ChevronRight size={14} />
             </button>
             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ISO 27001 Compliant</span>
          </div>
        </div>

        <div className="bg-primary-gradient rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="relative z-10 space-y-4">
             <h4 className="text-xl font-bold">Payroll Lock In Progress</h4>
             <p className="text-white/60 text-sm">System is currently preparing the Jan 2025 payout file. 8 approved requests will be included in this batch.</p>
             <button className="bg-[#E8D5A3] text-[#3E3B6F] px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-lg">
               Review Batch v2.1
             </button>
           </div>
           <DollarSign className="absolute -right-10 -bottom-10 text-white/5" size={200} />
        </div>
      </div>
    </div>
  );
};
