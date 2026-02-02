
import React from 'react';
import { 
  Calendar, Clock, AlertCircle, CheckCircle2, Users, 
  ShieldAlert, TrendingUp, Download, Settings, ChevronRight,
  ExternalLink, BarChart, Info, ShieldCheck
} from 'lucide-react';

// --- Shared Components ---
export const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={20} className="text-white" />
      </div>
      {subtitle && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</span>}
    </div>
    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
    <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
  </div>
);

const SectionHeader = ({ title, action }: { title: string, action?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-bold text-[#3E3B6F] flex items-center gap-2">
      <div className="w-1 h-6 bg-[#E8D5A3] rounded-full" />
      {title}
    </h3>
    {action && (
      <button className="text-sm font-bold text-[#3E3B6F] hover:underline flex items-center gap-1 group">
        {action} <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    )}
  </div>
);

// --- Employee Section ---
export const EmployeeView = ({ onApply }: { onApply: () => void }) => {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Available" value="126" icon={Calendar} colorClass="bg-[#3E3B6F]" subtitle="All Types" />
        <StatCard title="Pending Requests" value="3" icon={Clock} colorClass="bg-amber-500" />
        <StatCard title="Next Leave" value="10 Feb" icon={CheckCircle2} colorClass="bg-emerald-500" subtitle="Approved" />
        <StatCard title="Expiring Soon" value="5" icon={AlertCircle} colorClass="bg-red-500" subtitle="This Quarter" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader title="My Calendar Preview" action="View Full Calendar" />
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex gap-3 min-w-max pb-2">
              {days.map((date, i) => {
                const isToday = i === 0;
                const isHoliday = date.getDay() === 0 || date.getDay() === 6;
                const isLeave = date.getDate() === 10 || date.getDate() === 11;
                return (
                  <div key={i} className={`flex flex-col items-center p-3 rounded-xl min-w-[70px] border transition-all cursor-pointer hover:border-[#3E3B6F]
                    ${isToday ? 'bg-[#3E3B6F] text-white border-[#3E3B6F]' : 'bg-gray-50 border-transparent'}
                  `}>
                    <span className={`text-[10px] font-bold uppercase mb-1 ${isToday ? 'text-white/60' : 'text-gray-400'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-xl font-bold">{date.getDate()}</span>
                    {isLeave && <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    {isHoliday && <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Approved</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Pending</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-400" /> Holiday</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Quick Actions" />
          <div className="space-y-4">
            <button onClick={onApply} className="w-full bg-[#3E3B6F] text-white p-6 rounded-xl shadow-lg shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-between group">
              <div className="text-left">
                <p className="font-bold text-lg">Apply Leave</p>
                <p className="text-xs text-white/70">Submit a new request</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20">
                <ExternalLink size={20} />
              </div>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-center">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Entitlements</p>
                <p className="font-bold text-[#3E3B6F]">Balances</p>
              </button>
              <button className="p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-center">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Support</p>
                <p className="font-bold text-[#3E3B6F]">Policy</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Manager Section ---
export const ManagerView = () => (
  <div className="space-y-8 mt-12 pt-12 border-t border-gray-200">
    <SectionHeader title="My Team" action="View Team Hub" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Team Pending" value="12" icon={Clock} colorClass="bg-amber-500" subtitle="Action Required" />
      <StatCard title="On Leave Today" value="4" icon={Users} colorClass="bg-emerald-500" subtitle="Out of Office" />
      <StatCard title="Coverage Risk" value="High" icon={ShieldAlert} colorClass="bg-red-500" subtitle="Critical (Feb 15)" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Upcoming Approvals</p>
        <div className="space-y-4">
          {[
            { name: 'Sarah Miller', type: 'Annual', date: 'Feb 12 - 15', sla: 'Overdue' },
            { name: 'Tom Chen', type: 'Sick Leave', date: 'Feb 05 - 05', sla: '2h left' },
            { name: 'Anna Bell', type: 'Casual', date: 'Feb 20 - 21', sla: '2d left' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {item.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.type} • {item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.sla === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'}`}>
                  {item.sla}
                </span>
                <button className="block text-xs font-bold text-[#3E3B6F] mt-1  transition-opacity underline">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Coverage Snapshot (This Week)</p>
        <div className="space-y-6">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 w-8">{day}</span>
              <div className="flex -space-x-2">
                {Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, j) => (
                  <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-accent-peach flex items-center justify-center text-[10px] font-bold text-[#3E3B6F]">
                    +
                  </div>
                ))}
              </div>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${80 - (i * 10)}%` }} />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{80 - (i * 10)}% Coverage</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- HR Section ---
export const HRView = () => (
  <div className="space-y-8 mt-12 pt-12 border-t border-gray-200 pb-12">
    <SectionHeader title="HR Overview" action="Launch HR Console" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Org Pending" value="84" icon={CheckSquare} colorClass="bg-[#3E3B6F]" />
      <StatCard title="Overdue SLA" value="14" icon={AlertCircle} colorClass="bg-red-500" />
      <StatCard title="Accrual Jobs" value="Running" icon={Settings} colorClass="bg-emerald-500" />
      <StatCard title="Encashments" value="23" icon={TrendingUp} colorClass="bg-indigo-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Utilization by Type</p>
          <div className="relative w-32 h-32">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="64" cy="64" r="50" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
               <circle cx="64" cy="64" r="50" fill="transparent" stroke="#3E3B6F" strokeWidth="12" strokeDasharray="314" strokeDashoffset="100" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#3E3B6F]">68%</div>
          </div>
          <p className="mt-4 text-xs font-medium text-gray-500">Annual Leave is most used</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex flex-col justify-between">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">System Health</p>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payroll Integration</span>
                <span className="text-emerald-500 font-bold">Connected</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Daily Accrual Job</span>
                <span className="text-emerald-500 font-bold">Success</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Email Notifications</span>
                <span className="text-emerald-500 font-bold">Active</span>
             </div>
          </div>
          <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50">Diagnostic Hub</button>
        </div>
      </div>

      <div className="bg-[#3E3B6F] rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Admin Quick Links</p>
          <div className="space-y-2">
            {[
              { label: 'Run Accrual Job', icon: Settings },
              { label: 'Year-End Processing', icon: Calendar },
              { label: 'Generate SLA Report', icon: Download },
              { label: 'View Audit Logs', icon: Info }
            ].map((link, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                <link.icon size={18} className="text-[#E8D5A3]" />
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-4 opacity-10">
          <ShieldCheck size={120} />
        </div>
      </div>
    </div>
  </div>
);

const CheckSquare = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);
