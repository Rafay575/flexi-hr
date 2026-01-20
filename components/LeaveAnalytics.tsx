import React, { useState } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Clock, DollarSign, 
  ChevronDown, Download, Users, Filter, Calendar,
  ArrowUpRight, Target, Info, Search, X, ChevronRight,
  TrendingDown, LayoutDashboard
} from 'lucide-react';

export const LeaveAnalytics = () => {
  const [drillDown, setDrillDown] = useState<string | null>(null);

  const kpis = [
    { label: 'Avg Days / Employee', value: '8.5', icon: Users, trend: '+0.4', trendUp: true, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Most Used Type', value: 'Annual', sub: '45% of total', icon: PieChart, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Avg Approval Time', value: '6.2h', icon: Clock, trend: '-1.2h', trendUp: false, color: 'text-amber-600 bg-amber-50' },
    { label: 'Pending Encashment', value: 'PKR 450k', icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Analytics</h2>
          <p className="text-gray-500 font-medium">Strategic insights into workforce availability and leave liabilities.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <select className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-transparent outline-none">
              <option>Year 2025</option>
              <option>Year 2024</option>
            </select>
            <div className="w-px h-4 bg-gray-200 self-center mx-1" />
            <select className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-transparent outline-none">
              <option>All Quarters</option>
              <option>Q1</option>
              <option>Q2</option>
            </select>
          </div>
          <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-400 hover:text-[#3E3B6F] shadow-sm transition-all">
            <Filter size={18} />
          </button>
          <button className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${kpi.color}`}>
                <kpi.icon size={24} />
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {kpi.trendUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {kpi.trend}
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-2xl font-bold text-gray-900">{kpi.value}</h4>
              {kpi.sub && <span className="text-[10px] font-bold text-gray-400">{kpi.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Utilization Donut */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Utilization by Type</h3>
            <button className="text-gray-400 hover:text-[#3E3B6F]"><Info size={16}/></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-8 group cursor-pointer" onClick={() => setDrillDown('Utilization Breakdown')}>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" fill="transparent" stroke="#EEF2FF" strokeWidth="24" />
                <circle cx="96" cy="96" r="80" fill="transparent" stroke="#3E3B6F" strokeWidth="24" strokeDasharray="502" strokeDashoffset="276" className="transition-all duration-1000" />
                <circle cx="96" cy="96" r="80" fill="transparent" stroke="#10B981" strokeWidth="24" strokeDasharray="502" strokeDashoffset="410" className="transition-all duration-1000" />
                <circle cx="96" cy="96" r="80" fill="transparent" stroke="#F59E0B" strokeWidth="24" strokeDasharray="502" strokeDashoffset="460" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">45%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Annual</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-2 h-2 rounded-full bg-[#3E3B6F]" /> Annual (45%)</div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Casual (25%)</div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-2 h-2 rounded-full bg-amber-500" /> Sick (15%)</div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-2 h-2 rounded-full bg-indigo-200" /> Other (15%)</div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Monthly Leave Trend</h3>
            <div className="flex gap-2">
               {['All', 'Annual', 'Sick'].map(f => (
                 <button key={f} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${f === 'All' ? 'bg-indigo-50 text-[#3E3B6F]' : 'text-gray-400 hover:bg-gray-50'}`}>{f}</button>
               ))}
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-1 relative px-4">
             {/* Simple Line Graph Mockup */}
             <div className="absolute inset-x-8 top-1/2 h-px bg-gray-50 z-0" />
             <div className="absolute inset-x-8 top-1/4 h-px bg-gray-50 z-0" />
             <div className="absolute inset-x-8 top-3/4 h-px bg-gray-50 z-0" />
             
             {[40, 60, 45, 70, 90, 85, 60, 75, 40, 50, 65, 80].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10 group relative">
                 <div className="w-full max-w-[12px] bg-indigo-100 rounded-full h-[180px] relative overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-[#3E3B6F] rounded-full transition-all duration-1000" style={{ height: `${h}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#3E3B6F] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h} days
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Dept Comparison */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Department Benchmarking</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Avg Days per Employee</span>
          </div>
          <div className="space-y-6">
            {[
              { dept: 'Sales & Marketing', val: 12.4, color: 'bg-indigo-600' },
              { dept: 'Operations', val: 9.8, color: 'bg-[#3E3B6F]' },
              { dept: 'Engineering', val: 8.5, color: 'bg-emerald-500' },
              { dept: 'Product', val: 7.2, color: 'bg-amber-500' },
              { dept: 'Finance', val: 5.4, color: 'bg-purple-500' },
              { dept: 'HR & Admin', val: 4.8, color: 'bg-gray-400' },
            ].map((d, i) => (
              <div key={i} className="space-y-2 cursor-pointer group" onClick={() => setDrillDown(`Dept Analysis: ${d.dept}`)}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-700 group-hover:text-[#3E3B6F] transition-colors">{d.dept}</span>
                  <span className="text-gray-900">{d.val} d</span>
                </div>
                <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden">
                   <div className={`h-full ${d.color} transition-all duration-1000`} style={{ width: `${(d.val / 15) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Gauge & Insights */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center">
             <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-8 self-start">Approval Compliance</h3>
             <div className="relative w-48 h-32 overflow-hidden mb-4">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="#EEF2FF" strokeWidth="24" strokeDasharray="251 251" />
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="#10B981" strokeWidth="24" strokeDasharray="236 502" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 top-12 flex flex-col items-center justify-center">
                   <span className="text-4xl font-bold text-emerald-600">94%</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Within SLA</span>
                </div>
             </div>
             <div className="w-full flex justify-between px-4">
                <div className="text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Current</p>
                   <p className="text-sm font-bold text-gray-900">94%</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Target</p>
                   <p className="text-sm font-bold text-[#3E3B6F]">90%</p>
                </div>
             </div>
          </div>

          <div className="bg-primary-gradient p-8 rounded-[40px] text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-[#E8D5A3]">
                   <Target size={24} />
                   <h4 className="font-bold uppercase tracking-widest text-xs">Liability Forecast</h4>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                   Based on current trends, <span className="font-bold text-[#E8D5A3]">~1,200 leave days</span> will lapse at year-end, reducing corporate liability by <span className="font-bold text-[#E8D5A3]">PKR 2.4M</span>.
                </p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                   Run Full Liability Report
                </button>
             </div>
             <BarChart3 className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" size={200} />
          </div>
        </div>

        {/* Top Leave Takers */}
        <div className="lg:col-span-12 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                 <Users size={18} className="text-[#3E3B6F]" /> Top Leave Utilization (YTD)
              </h3>
              <Search size={18} className="text-gray-400 cursor-pointer hover:text-[#3E3B6F]" />
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/30">
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Days Taken</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Types</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Trend</th>
                       <th className="px-8 py-5"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {[
                       { name: 'Usman Ali', dept: 'Sales', days: 22, types: ['Annual', 'Unpaid'], trend: '+15%' },
                       { name: 'Sana Khan', dept: 'Engineering', days: 18.5, types: ['Sick', 'Casual'], trend: '+4%' },
                       { name: 'Raza Javeed', dept: 'Marketing', days: 16, types: ['Annual'], trend: '-2%' },
                       { name: 'Fatima Noor', dept: 'Product', days: 15, types: ['Annual', 'Maternity'], trend: '+100%' },
                       { name: 'Kamran Akmal', dept: 'Sales', days: 14.5, types: ['Casual'], trend: '+8%' },
                    ].map((row, i) => (
                       <tr key={i} className="hover:bg-gray-50/30 transition-colors group cursor-pointer" onClick={() => setDrillDown(`User Focus: ${row.name}`)}>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F] text-xs">
                                   {row.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-sm font-bold text-gray-900">{row.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-medium text-gray-500">{row.dept}</td>
                          <td className="px-8 py-5 text-sm font-bold text-[#3E3B6F] text-center">{row.days} d</td>
                          <td className="px-8 py-5">
                             <div className="flex gap-1.5">
                                {row.types.map(t => (
                                   <span key={t} className="px-2 py-0.5 bg-indigo-50 text-[#3E3B6F] text-[9px] font-bold uppercase rounded border border-indigo-100">{t}</span>
                                ))}
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className={`text-xs font-bold ${row.trend.includes('+') ? 'text-red-500' : 'text-emerald-500'}`}>{row.trend}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <ChevronRight size={18} className="text-gray-300 group-hover:text-[#3E3B6F] transition-all" />
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Drill-down Drawer */}
      {drillDown && (
        <div className="fixed inset-0 z-[150] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrillDown(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[500px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl"><LayoutDashboard size={24}/></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Drill-down Detail</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{drillDown}</p>
                  </div>
               </div>
               <button onClick={() => setDrillDown(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                 <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-modal-scroll">
               <div className="p-12 text-center space-y-6">
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center mx-auto text-indigo-200">
                     <PieChart size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Dynamic Analysis Ready</h4>
                    <p className="text-sm text-gray-400 mt-2">In a production environment, this would display filtered lists, correlation metrics, or raw data contributing to the selected chart element.</p>
                  </div>
                  <button className="px-8 py-3 bg-[#3E3B6F] text-white rounded-xl font-bold hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 mx-auto">
                    <Download size={18}/> Export Raw Dataset
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};