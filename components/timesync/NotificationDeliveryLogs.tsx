
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Mail, 
  Smartphone, 
  Bell, 
  MessageSquare, 
  RefreshCcw, 
  ChevronRight, 
  MoreVertical,
  ArrowUpRight,
  Eye,
  Activity,
  // Fixed: Added missing Info icon import
  Info
} from 'lucide-react';

type DeliveryStatus = 'DELIVERED' | 'FAILED' | 'PENDING' | 'BOUNCED';
type Channel = 'EMAIL' | 'PUSH' | 'SMS' | 'IN_APP';

interface DeliveryLog {
  id: string;
  timestamp: string;
  event: string;
  recipient: { name: string; email: string };
  channel: Channel;
  status: DeliveryStatus;
  provider: string;
}

const STATUS_UI: Record<DeliveryStatus, { label: string; color: string; dot: string }> = {
  DELIVERED: { label: 'Delivered', color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' },
  FAILED: { label: 'Failed', color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500' },
  PENDING: { label: 'Pending', color: 'text-orange-600 bg-orange-50 border-orange-100', dot: 'bg-orange-500' },
  BOUNCED: { label: 'Bounced', color: 'text-purple-600 bg-purple-50 border-purple-100', dot: 'bg-purple-500' },
};

const CHANNEL_ICONS: Record<Channel, React.ReactNode> = {
  EMAIL: <Mail size={14} />,
  PUSH: <Smartphone size={14} />,
  SMS: <MessageSquare size={14} />,
  IN_APP: <Bell size={14} />,
};

const MOCK_LOGS: DeliveryLog[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `LOG-${9000 + i}`,
  timestamp: `2025-01-15 11:${(i % 60).toString().padStart(2, '0')} AM`,
  event: ['punch.success', 'anomaly.late', 'ot.approved', 'roster.published'][i % 4],
  recipient: { 
    name: ['Sarah Chen', 'Ahmed Khan', 'James Wilson', 'Priya Das'][i % 4],
    email: ['s.chen@flexi.com', 'a.khan@flexi.com', 'j.wilson@flexi.com', 'p.das@flexi.com'][i % 4]
  },
  channel: (['EMAIL', 'PUSH', 'SMS', 'IN_APP'] as Channel[])[i % 4],
  status: i % 15 === 0 ? 'FAILED' : i % 25 === 0 ? 'BOUNCED' : i % 30 === 0 ? 'PENDING' : 'DELIVERED',
  provider: i % 4 === 0 ? 'SendGrid' : i % 4 === 1 ? 'Firebase' : i % 4 === 2 ? 'Twilio' : 'Internal',
}));

export const NotificationDeliveryLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'ALL'>('ALL');

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchesSearch = log.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           log.event.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <History className="text-[#3E3B6F]" size={28} /> Delivery Logs
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Real-time audit trail for all system notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Success Rate</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-green-600">98.5%</p>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 rounded">+0.2%</span>
            </div>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
            <CheckCircle2 size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Failed (Last 24h)</p>
            <p className="text-3xl font-black text-red-600 tabular-nums">12</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
            <XCircle size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Latency</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-[#3E3B6F]">1.2s</p>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">End-to-End</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Activity size={28} />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by recipient or event type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium border-none outline-none focus:ring-0 bg-transparent"
          />
        </div>
        <div className="h-6 w-px bg-gray-100 hidden md:block"></div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl overflow-x-auto no-scrollbar">
          {(['ALL', 'DELIVERED', 'FAILED', 'PENDING', 'BOUNCED'] as const).map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === status ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* LOG TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-6 py-5">Event</th>
                <th className="px-6 py-5">Recipient</th>
                <th className="px-6 py-5">Channel</th>
                <th className="px-6 py-5">Provider</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-gray-800 tabular-nums">{log.timestamp}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{log.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <code className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {log.event}
                    </code>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{log.recipient.name}</span>
                      <span className="text-[9px] text-gray-400 truncate max-w-[150px]">{log.recipient.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <div className="p-1.5 bg-gray-100 rounded-lg text-gray-400 group-hover:text-[#3E3B6F] transition-colors">
                        {CHANNEL_ICONS[log.channel]}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest">{log.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{log.provider}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_UI[log.status].color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_UI[log.status].dot}`} />
                      {STATUS_UI[log.status].label}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1  transition-all">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm" title="View Payload">
                        <Eye size={16} />
                      </button>
                      {log.status === 'FAILED' && (
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all" title="Retry Delivery">
                          <RefreshCcw size={16} />
                        </button>
                      )}
                      <button className="p-2 text-gray-300 hover:text-gray-600"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredLogs.length} logs of last 24 hours</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-[10px] font-black uppercase tracking-widest">
               <Info size={12} />
               Logs are retained for 30 days
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
