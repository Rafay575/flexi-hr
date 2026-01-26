
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRightLeft, 
  Timer, 
  FileText, 
  LayoutGrid, 
  Table as TableIcon, 
  Filter, 
  Search, 
  MoreVertical,
  ChevronRight,
  AlertTriangle,
  History,
  Check,
  User,
  Zap
} from 'lucide-react';

type RequestType = 'REGULARIZATION' | 'OT' | 'SWAP';

interface ApprovalRequest {
  id: string;
  type: RequestType;
  employee: string;
  avatar: string;
  date: string;
  details: string;
  secondaryDetails?: string;
  reason: string;
  slaHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const MOCK_REQUESTS: ApprovalRequest[] = [
  {
    id: 'REQ-101',
    type: 'REGULARIZATION',
    employee: 'Ahmed Khan',
    avatar: 'AK',
    date: 'Jan 8, 2025',
    details: 'Missing Out Punch',
    secondaryDetails: 'Proposed: 6:30 PM',
    reason: 'Internet outage at home during remote shift exit.',
    slaHours: 4,
    status: 'PENDING'
  },
  {
    id: 'REQ-102',
    type: 'OT',
    employee: 'Sara Ahmed',
    avatar: 'SA',
    date: 'Jan 9, 2025',
    details: '2.5 OT Hours',
    reason: 'Critical project deadline for Q1 release.',
    slaHours: 18,
    status: 'PENDING'
  },
  {
    id: 'REQ-103',
    type: 'SWAP',
    employee: 'Ali ↔ Fatima',
    avatar: 'SW',
    date: 'Jan 15, 2025',
    details: 'Morning ↔ Evening',
    reason: 'Medical appointment for parent.',
    slaHours: 48,
    status: 'PENDING'
  },
  {
    id: 'REQ-104',
    type: 'REGULARIZATION',
    employee: 'James Wilson',
    avatar: 'JW',
    date: 'Jan 7, 2025',
    details: 'Forgotten In-Punch',
    secondaryDetails: 'Proposed: 9:00 AM',
    reason: 'Badge reader was malfunctioning.',
    slaHours: 2,
    status: 'PENDING'
  },
  {
    id: 'REQ-105',
    type: 'OT',
    employee: 'Marcus Low',
    avatar: 'ML',
    date: 'Jan 10, 2025',
    details: '4.0 OT Hours',
    reason: 'Server maintenance window overflow.',
    slaHours: 24,
    status: 'PENDING'
  },
  {
    id: 'REQ-106',
    type: 'SWAP',
    employee: 'Elena ↔ Priya',
    avatar: 'SW',
    date: 'Jan 12, 2025',
    details: 'General ↔ Night',
    reason: 'Family event attendance.',
    slaHours: 36,
    status: 'PENDING'
  }
];

export const ManagerPendingApprovals: React.FC = () => {
  const [viewMode, setViewMode] = useState<'Cards' | 'Table'>('Cards');
  const [filter, setFilter] = useState<'All' | RequestType>('All');
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const filteredRequests = useMemo(() => {
    return filter === 'All' ? requests : requests.filter(r => r.type === filter);
  }, [filter, requests]);

  const stats = {
    pending: requests.length,
    overdue: requests.filter(r => r.slaHours < 5).length,
    approvedToday: 5
  };

  const getSlaColor = (hours: number) => {
    if (hours < 6) return 'text-red-500 bg-red-50 border-red-100';
    if (hours < 24) return 'text-orange-500 bg-orange-50 border-orange-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  const getTypeIcon = (type: RequestType) => {
    switch (type) {
      case 'REGULARIZATION': return <History size={16} className="text-indigo-500" />;
      case 'OT': return <Clock size={16} className="text-orange-500" />;
      case 'SWAP': return <ArrowRightLeft size={16} className="text-blue-500" />;
    }
  };

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    // In a real app, this would be an API call
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Pending Approvals</h2>
          <p className="text-sm text-gray-500 font-medium italic">Action required for team synchronization</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            {(['Cards', 'Table'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === mode ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {mode === 'Cards' ? <LayoutGrid size={18} /> : <TableIcon size={18} />}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-black shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
            <Check size={14} /> Bulk Approve All
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pending</p>
            <p className="text-2xl font-black text-gray-800">{stats.pending}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><FileText size={24} /></div>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Critical SLA</p>
            <p className="text-2xl font-black text-red-600">{stats.overdue}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-500 rounded-xl animate-pulse"><Timer size={24} /></div>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Approved Today</p>
            <p className="text-2xl font-black text-green-700">{stats.approvedToday}</p>
          </div>
          <div className="p-3 bg-green-100 text-green-500 rounded-xl"><CheckCircle2 size={24} /></div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {(['All', 'REGULARIZATION', 'OT', 'SWAP'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filter === cat 
                ? 'bg-[#3E3B6F] text-white border-transparent shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E3B6F] hover:text-[#3E3B6F]'
            }`}
          >
            {cat === 'All' ? 'All Requests' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {viewMode === 'Cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl border border-gray-100 shadow-md flex flex-col overflow-hidden hover:shadow-xl transition-all group">
              <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    {getTypeIcon(req.type)}
                  </div>
                  <span className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest">
                    {req.type.replace('_', ' ')}
                  </span>
                </div>
                <button className="text-gray-300 hover:text-gray-600 p-1"><MoreVertical size={16}/></button>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-gradient flex items-center justify-center text-white text-xs font-black shadow-lg">
                    {req.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{req.employee}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{req.date}</p>
                  </div>
                </div>

                <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                  <p className="text-[11px] font-black text-gray-800 mb-1 flex items-center gap-2">
                    <Zap size={12} className="text-yellow-500" /> {req.details}
                  </p>
                  {req.secondaryDetails && (
                    <p className="text-[10px] text-indigo-600 font-bold mb-2">{req.secondaryDetails}</p>
                  )}
                  <p className="text-[10px] text-gray-500 italic leading-relaxed">"{req.reason}"</p>
                </div>

                <div className={`flex items-center justify-between p-2 rounded-xl border ${getSlaColor(req.slaHours)}`}>
                  <div className="flex items-center gap-2">
                    <Timer size={14} />
                    <span className="text-[10px] font-black uppercase">SLA: {req.slaHours}h Remaining</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => handleAction(req.id, 'APPROVE')}
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-50 hover:bg-green-600 transition-all active:scale-95"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'REJECT')}
                  className="flex-1 py-2.5 bg-white border border-gray-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95"
                >
                  Reject
                </button>
                <button className="px-3 py-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Request Type</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Summary</th>
                <th className="px-6 py-4 text-center">SLA Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                        {getTypeIcon(req.type)}
                      </div>
                      <span className="text-[10px] font-black text-gray-600 uppercase">
                        {req.type.split('_').pop()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#3E3B6F] flex items-center justify-center text-white text-[9px] font-black">
                        {req.avatar}
                      </div>
                      <span className="text-xs font-bold text-gray-800">{req.employee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">{req.date}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-[200px]">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{req.details}</p>
                      <p className="text-[9px] text-gray-400 font-medium truncate italic">{req.reason}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`mx-auto w-fit px-3 py-1 rounded-full border ${getSlaColor(req.slaHours)}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                        {req.slaHours}h left
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleAction(req.id, 'APPROVE')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all">
                        <Check size={14} />
                      </button>
                      <button onClick={() => handleAction(req.id, 'REJECT')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="p-20 text-center opacity-30 flex flex-col items-center">
              <CheckCircle2 size={48} className="text-gray-300 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-gray-500">Inbox is empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
