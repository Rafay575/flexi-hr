
import React, { useState } from 'react';
import { 
  Plane, Briefcase, MapPin, Calendar, Clock, CheckCircle2, 
  XCircle, MoreHorizontal, ChevronRight, Search, Plus, 
  Info, ArrowRight, Download, Filter, FileText, Globe, X,
  Map, User, ExternalLink
} from 'lucide-react';
import { ODRequestForm } from './ODRequestForm';
import { TravelRequestForm } from './TravelRequestForm';

interface ODTravelRequest {
  id: string;
  type: 'Official Duty' | 'Local Travel' | 'Inter-city Travel' | 'International Travel';
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Active' | 'Completed' | 'Cancelled';
  itinerary?: {
    from: string;
    to: string;
    mode: string;
    time: string;
  }[];
  appliedOn: string;
  timeSyncStatus: string;
}

const MOCK_DATA: ODTravelRequest[] = [
  { 
    id: 'OD-2025-001', type: 'International Travel', startDate: 'Jan 20, 2025', endDate: 'Jan 25, 2025', 
    destination: 'Dubai, UAE', purpose: 'Tech Expo 2025 Exhibitor', status: 'Approved',
    appliedOn: 'Jan 05, 2025', timeSyncStatus: 'Marked as OD in attendance for Jan 20-25',
    itinerary: [
      { from: 'Karachi (KHI)', to: 'Dubai (DXB)', mode: 'Emirates EK601', time: '12:00 PM' },
      { from: 'Dubai (DXB)', to: 'Karachi (KHI)', mode: 'Emirates EK602', time: '08:00 PM' }
    ]
  },
  { 
    id: 'OD-2025-002', type: 'Official Duty', startDate: 'Jan 15, 2025', endDate: 'Jan 17, 2025', 
    destination: 'Local Client Office', purpose: 'On-site ERP Implementation', status: 'Active',
    appliedOn: 'Jan 10, 2025', timeSyncStatus: 'Attendance bypassed via OD override'
  },
  { 
    id: 'OD-2025-003', type: 'Inter-city Travel', startDate: 'Feb 10, 2025', endDate: 'Feb 12, 2025', 
    destination: 'Lahore, PK', purpose: 'Quarterly Team Sync', status: 'Pending',
    appliedOn: '2h ago', timeSyncStatus: 'Pending Approval'
  },
  { 
    id: 'OD-2025-004', type: 'Local Travel', startDate: 'Jan 12, 2025', endDate: 'Jan 12, 2025', 
    destination: 'City Center Hub', purpose: 'Hardware Maintenance', status: 'Completed',
    appliedOn: 'Jan 10, 2025', timeSyncStatus: 'Attendance synchronized'
  }
];

export const MyODTravelRequests = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<ODTravelRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isODFormOpen, setIsODFormOpen] = useState(false);
  const [isTravelFormOpen, setIsTravelFormOpen] = useState(false);

  const getTypeBadge = (type: ODTravelRequest['type']) => {
    switch (type) {
      case 'Official Duty': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Local Travel': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Inter-city Travel': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'International Travel': return 'bg-purple-50 text-purple-600 border-purple-100';
    }
  };

  const getStatusColor = (status: ODTravelRequest['status']) => {
    switch (status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-50';
      case 'Pending': return 'text-amber-600 bg-amber-50';
      case 'Active': return 'text-indigo-600 bg-indigo-50 border-indigo-100 animate-pulse';
      case 'Completed': return 'text-gray-500 bg-gray-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
    }
  };

  const filteredData = MOCK_DATA.filter(item => {
    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'OD' && item.type === 'Official Duty') ||
                       (activeTab === 'Travel' && item.type.includes('Travel')) ||
                       (activeTab === 'Pending' && item.status === 'Pending') ||
                       (activeTab === 'Approved' && item.status === 'Approved');
    const matchesSearch = item.destination.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">My Official Duty & Travel</h2>
          <p className="text-gray-500 font-medium">Manage and track your out-of-office work assignments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsODFormOpen(true)}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Briefcase size={18} className="text-blue-500" /> New OD
          </button>
          <button 
            onClick={() => setIsTravelFormOpen(true)}
            className="bg-[#3E3B6F] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
          >
            <Plane size={18} className="text-[#E8D5A3]" /> New Travel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-[32px] text-white flex items-center gap-5 shadow-xl shadow-indigo-600/20">
          <div className="p-4 bg-white/10 rounded-2xl"><Globe size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Currently Active</p>
            <p className="text-2xl font-bold">1 Assignment</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Calendar size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900">2 Requests</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awaiting Approval</p>
            <p className="text-2xl font-bold text-gray-900">1 Request</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs & Search */}
        <div className="px-8 py-2 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {['All', 'OD', 'Travel', 'Pending', 'Approved'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-5 text-xs font-bold transition-all relative whitespace-nowrap ${
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
              placeholder="Search destination or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID / Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedRequest(item)}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-[#3E3B6F] uppercase">{item.id}</span>
                      <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-bold uppercase border w-fit ${getTypeBadge(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{item.startDate}</span>
                      <span className="text-[10px] text-gray-400 uppercase">to {item.endDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-gray-400" />
                       <span className="text-sm font-medium text-gray-700">{item.destination}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]">{item.purpose}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg transition-all ">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map size={32} />
              </div>
              <p className="text-gray-400 font-medium italic">No requests found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[500px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${getTypeBadge(selectedRequest.type)}`}>
                  {selectedRequest.type === 'Official Duty' ? <Briefcase size={24}/> : <Plane size={24}/>}
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">{selectedRequest.id}</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedRequest.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-modal-scroll">
              {/* Core Details */}
              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignment Details</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Status</p>
                      <p className={`text-sm font-bold ${getStatusColor(selectedRequest.status).split(' ')[0]}`}>{selectedRequest.status}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Applied On</p>
                      <p className="text-sm font-bold text-gray-800">{selectedRequest.appliedOn}</p>
                    </div>
                    <div className="col-span-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Start Date</p>
                        <p className="text-sm font-bold text-gray-800">{selectedRequest.startDate}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-300" />
                      <div className="flex-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">End Date</p>
                        <p className="text-sm font-bold text-gray-800">{selectedRequest.endDate}</p>
                      </div>
                    </div>
                 </div>
              </section>

              {/* Destination & Purpose */}
              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose & Scope</h4>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex items-start gap-3">
                       <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
                       <p className="text-sm font-bold text-gray-800">{selectedRequest.destination}</p>
                    </div>
                    <div className="flex items-start gap-3 pt-4 border-t border-gray-50">
                       <FileText className="text-gray-400 shrink-0 mt-0.5" size={16} />
                       <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedRequest.purpose}"</p>
                    </div>
                 </div>
              </section>

              {/* Itinerary (Conditional) */}
              {selectedRequest.itinerary && (
                <section className="space-y-4 animate-in slide-in-from-bottom-2">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Itinerary</h4>
                   <div className="space-y-3">
                      {selectedRequest.itinerary.map((leg, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                           <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm"><Plane size={16}/></div>
                           <div className="flex-1">
                              <p className="text-xs font-bold text-indigo-900">{leg.from} → {leg.to}</p>
                              <p className="text-[10px] text-indigo-600/70 font-medium">{leg.mode} • {leg.time}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
              )}

              {/* TimeSync Status */}
              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attendance Integration</h4>
                 <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <div>
                       <p className="text-xs font-bold text-emerald-900 mb-1 uppercase tracking-tight tracking-widest">TimeSync Overlay Active</p>
                       <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                         {selectedRequest.timeSyncStatus}
                       </p>
                    </div>
                 </div>
              </section>

              {/* Approval Trail */}
              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approval History</h4>
                 <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      <p className="text-xs font-bold text-gray-800">Submitted</p>
                      <p className="text-[10px] text-gray-400">Ahmed Khan • {selectedRequest.appliedOn}</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute left-[-25px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${selectedRequest.status === 'Pending' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                      <p className="text-xs font-bold text-gray-800">Manager Approval</p>
                      <p className="text-[10px] text-gray-400">{selectedRequest.status === 'Pending' ? 'Sarah Miller (Reviewing)' : 'Sarah Miller • Jan 12'}</p>
                    </div>
                    {selectedRequest.type.includes('International') && (
                      <div className="relative">
                        <div className={`absolute left-[-25px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${selectedRequest.status === 'Pending' ? 'bg-gray-200' : 'bg-emerald-500'}`} />
                        <p className="text-xs font-bold text-gray-800">HR/Finance Review</p>
                        <p className="text-[10px] text-gray-400">{selectedRequest.status === 'Pending' ? 'Pending previous' : 'Zeeshan Malik • Jan 13'}</p>
                      </div>
                    )}
                 </div>
              </section>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
              {selectedRequest.status === 'Pending' && (
                <>
                  <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all">Edit</button>
                  <button className="flex-1 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all">Cancel</button>
                </>
              )}
              {selectedRequest.status === 'Approved' && (
                <button className="w-full py-3 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all">Cancel Request</button>
              )}
              {(selectedRequest.status === 'Active' || selectedRequest.status === 'Completed') && (
                <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-xl font-bold hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2">
                  <Download size={18} /> Download Assignment PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New OD Request Form */}
      <ODRequestForm isOpen={isODFormOpen} onClose={() => setIsODFormOpen(false)} />
      
      {/* New Travel Request Form */}
      <TravelRequestForm isOpen={isTravelFormOpen} onClose={() => setIsTravelFormOpen(false)} />

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
};
