
import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Calendar, 
  UserCheck,
  Timer,
  UserMinus,
  Plane,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

type MemberStatus = 'PRESENT' | 'BREAK' | 'LATE' | 'ABSENT' | 'LEAVE' | 'NOT_IN';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
  inTime: string;
  outTime: string;
  hours: string;
  issues?: { type: 'LATE' | 'MISSING' | 'OT', label: string }[];
}

interface PendingAction {
  id: string;
  type: 'Regularization' | 'OT Request' | 'Shift Swap';
  employee: string;
  details: string;
  sla: string;
}

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Alex Rivera', role: 'Senior Dev', status: 'PRESENT', inTime: '08:55 AM', outTime: '--', hours: '5.2h', issues: [{type: 'OT', label: 'OT Pending'}] },
  { id: '2', name: 'Sarah Chen', role: 'UI Designer', status: 'BREAK', inTime: '09:10 AM', outTime: '--', hours: '4.8h', issues: [{type: 'LATE', label: 'Late 15m'}] },
  { id: '3', name: 'James Wilson', role: 'Product Lead', status: 'LATE', inTime: '09:45 AM', outTime: '--', hours: '4.2h', issues: [{type: 'MISSING', label: 'Missing Out'}] },
  { id: '4', name: 'Priya Das', role: 'QA Engineer', status: 'PRESENT', inTime: '08:45 AM', outTime: '--', hours: '5.5h' },
  { id: '5', name: 'Marcus Low', role: 'DevOps', status: 'LEAVE', inTime: '--', outTime: '--', hours: '--' },
  { id: '6', name: 'Elena Frost', role: 'Junior Dev', status: 'ABSENT', inTime: '--', outTime: '--', hours: '0h' },
  { id: '7', name: 'Tom Hardy', role: 'Backend Dev', status: 'PRESENT', inTime: '09:00 AM', outTime: '--', hours: '5.0h' },
  { id: '8', name: 'Lisa Ray', role: 'HRBP', status: 'NOT_IN', inTime: '--', outTime: '--', hours: '--' },
  { id: '9', name: 'Kevin Hart', role: 'System Admin', status: 'PRESENT', inTime: '08:30 AM', outTime: '--', hours: '6.0h' },
  { id: '10', name: 'Nina Simone', role: 'Analyst', status: 'PRESENT', inTime: '09:05 AM', outTime: '--', hours: '4.9h' },
  { id: '11', name: 'Oscar Isaac', role: 'Mobile Dev', status: 'PRESENT', inTime: '08:58 AM', outTime: '--', hours: '5.1h' },
  { id: '12', name: 'Wanda M.', role: 'Scrum Master', status: 'PRESENT', inTime: '08:50 AM', outTime: '--', hours: '5.3h' },
  { id: '13', name: 'Pietro M.', role: 'Backend', status: 'LATE', inTime: '09:30 AM', outTime: '--', hours: '3.5h', issues: [{type: 'LATE', label: 'Late 30m'}] },
  { id: '14', name: 'Vision AI', role: 'Architect', status: 'PRESENT', inTime: '08:00 AM', outTime: '--', hours: '7.0h' },
  { id: '15', name: 'Natasha R.', role: 'SecOps', status: 'LEAVE', inTime: '--', outTime: '--', hours: '--' },
];

const MOCK_PENDING: PendingAction[] = [
  { id: 'P1', type: 'Regularization', employee: 'James Wilson', details: 'Missed Out Punch (Jan 09)', sla: '4h left' },
  { id: 'P2', type: 'OT Request', employee: 'Alex Rivera', details: 'Project Crunch (+3.5h)', sla: '2h left' },
  { id: 'P3', type: 'Shift Swap', employee: 'Nina Simone', details: 'Swap with Tom Hardy (Jan 12)', sla: '1d left' },
];

const STATUS_CONFIG: Record<MemberStatus, { label: string, color: string, dot: string }> = {
  PRESENT: { label: 'Present', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  BREAK: { label: 'On Break', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  LATE: { label: 'Late', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  ABSENT: { label: 'Absent', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  LEAVE: { label: 'On Leave', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  NOT_IN: { label: 'Not Yet In', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

export const TeamDashboard: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('Engineering Alpha');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Team Dashboard</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500 font-medium tracking-wide uppercase text-[10px]">Active Team:</span>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1 shadow-sm cursor-pointer hover:bg-gray-50 group">
              <span className="text-xs font-bold text-[#3E3B6F] mr-2">{selectedTeam}</span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-[#3E3B6F]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-700">Today: Jan 10, 2025</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-opacity">
            <Filter size={14} /> Customize View
          </button>
        </div>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Present', val: '12', pct: '80%', icon: <UserCheck size={20} />, color: 'bg-green-500' },
          { label: 'Late', val: '2', pct: '13%', icon: <Timer size={20} />, color: 'bg-orange-500' },
          { label: 'Absent', val: '1', pct: '7%', icon: <UserMinus size={20} />, color: 'bg-red-500' },
          { label: 'On Leave', val: '2', pct: '-', icon: <Plane size={20} />, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-white ${stat.color} shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 block uppercase tracking-widest">{stat.label}</span>
                <span className="text-2xl font-black text-gray-800 leading-none">{stat.val}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
               <span className="text-[10px] font-bold text-gray-400 tracking-tighter">Engagement Rate</span>
               <span className="text-[10px] font-black text-[#3E3B6F]">{stat.pct}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* TEAM GRID */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2">
                <Users size={18} /> Live Team Status
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-[9px] font-black text-green-700 uppercase">Live Sync</span>
                </div>
                <button className="text-gray-400 hover:text-[#3E3B6F]"><MoreHorizontal size={18} /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">In Time</th>
                    <th className="px-6 py-4">Out Time</th>
                    <th className="px-6 py-4">Hours</th>
                    <th className="px-6 py-4">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_TEAM.map((member) => {
                    const cfg = STATUS_CONFIG[member.status];
                    return (
                      <tr key={member.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#3E3B6F]/5 flex items-center justify-center text-[11px] font-black text-[#3E3B6F] border border-[#3E3B6F]/10">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{member.name}</p>
                              <p className="text-[10px] text-gray-500 font-medium truncate">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cfg.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${member.status === 'PRESENT' ? 'animate-pulse' : ''}`}></div>
                            {cfg.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold text-gray-700 tabular-nums">{member.inTime}</td>
                        <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tabular-nums">{member.outTime}</td>
                        <td className="px-6 py-4 text-[11px] font-black text-[#3E3B6F] tabular-nums">{member.hours}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {member.issues?.map((issue, idx) => (
                              <button key={idx} className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1 transition-all ${
                                issue.type === 'LATE' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 
                                issue.type === 'MISSING' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              }`}>
                                {issue.label}
                                {issue.type === 'MISSING' && <ExternalLink size={8} />}
                              </button>
                            )) || <span className="text-gray-200 font-bold">—</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
               <button className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                 View All Team Members <ChevronRight size={14} />
               </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          {/* APPROVAL QUEUE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" /> Pending Approvals
              </h3>
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-100 animate-bounce">3</span>
            </div>
            
            <div className="flex-1 p-2 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {MOCK_PENDING.map(action => (
                <div key={action.id} className="p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                      {action.type}
                    </span>
                    <span className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded">
                      <Clock size={10} /> {action.sla}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-800">{action.employee}</p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{action.details}</p>
                  
                  <div className="mt-4 flex gap-2  transition-all">
                    <button className="flex-1 py-2 bg-[#3E3B6F] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95">
                      <Check size={14} />
                    </button>
                    <button className="flex-1 py-2 bg-white border border-gray-200 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-all active:scale-95">
                      <X size={14} />
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-all">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="m-4 py-3 border border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all">
              View All Pending
            </button>
          </div>

          {/* COVERAGE CHART */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 size={16} className="text-[#3E3B6F]" /> Team Coverage
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#3E3B6F]"></div>
                  <span className="text-[8px] font-black text-gray-400 uppercase">Live</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                  <span className="text-[8px] font-black text-gray-400 uppercase">Req</span>
                </div>
              </div>
            </div>

            {/* BARS */}
            <div className="h-44 flex items-end justify-between gap-1 px-1 relative">
              {[6, 8, 10, 12, 14, 16, 18, 20, 22].map((hour, i) => {
                const liveH = [15, 45, 85, 95, 65, 90, 75, 50, 20][i];
                const reqH = [25, 60, 95, 95, 95, 95, 85, 60, 30][i];
                const isShort = liveH < reqH - 15;
                
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div className="w-full flex justify-center gap-0.5 h-full items-end">
                      <div 
                        style={{ height: `${liveH}%` }} 
                        className={`w-2.5 rounded-t-sm transition-all group-hover:scale-y-105 ${isShort ? 'bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-[#3E3B6F]'}`}
                      ></div>
                      <div style={{ height: `${reqH}%` }} className="w-1 bg-gray-100 rounded-t-sm opacity-50"></div>
                    </div>
                    <span className="text-[8px] font-black text-gray-400 mt-2">{hour}h</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white px-2 py-1 rounded text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                       {liveH}% / {reqH}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-4">
              <div className="bg-red-100 p-2 rounded-xl h-fit">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Coverage Warning</p>
                <p className="text-[10px] text-red-700 leading-relaxed font-medium">
                   हेडकाउंट (Headcount) is expected to dip below <span className="font-black">60%</span> between <span className="font-black">2 PM — 4 PM</span>.
                </p>
                <button className="mt-3 text-[9px] font-black text-red-800 uppercase tracking-widest border-b border-red-300 hover:border-red-600 transition-all">Review Lunch Blocks</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
