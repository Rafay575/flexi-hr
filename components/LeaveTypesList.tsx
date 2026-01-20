
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, MoreHorizontal, Eye, Edit3, 
  Copy, History, Power, X, ChevronRight, Info,
  CheckCircle2, AlertCircle, Clock, Database, ShieldCheck,
  Users
} from 'lucide-react';
import { LeaveTypeForm } from './LeaveTypeForm';
import { LeaveTypeVersionHistory } from './LeaveTypeVersionHistory';
import { EligibilityGroupForm } from './EligibilityGroupForm';

interface LeaveTypeConfig {
  code: string;
  name: string;
  category: 'Paid' | 'Unpaid';
  unit: 'Days' | 'Half-days' | 'Hours';
  quota: string;
  accrual: 'Monthly' | 'Annual' | 'On Join' | 'None';
  eligible: number;
  status: 'Active' | 'Inactive';
  description: string;
}

const DEFAULT_TYPES: LeaveTypeConfig[] = [
  { code: 'ANNUAL', name: 'Annual Leave', category: 'Paid', unit: 'Days', quota: '14 days/year', accrual: 'Monthly', eligible: 450, status: 'Active', description: 'Standard vacation leave earned monthly.' },
  { code: 'CASUAL', name: 'Casual Leave', category: 'Paid', unit: 'Days', quota: '10 days/year', accrual: 'Annual', eligible: 450, status: 'Active', description: 'For unforeseen personal matters.' },
  { code: 'SICK', name: 'Sick Leave', category: 'Paid', unit: 'Days', quota: '12 days/year', accrual: 'Monthly', eligible: 450, status: 'Active', description: 'Medical leave for self-illness.' },
  { code: 'MATERNITY', name: 'Maternity Leave', category: 'Paid', unit: 'Days', quota: '90 days/event', accrual: 'None', eligible: 210, status: 'Active', description: 'Paid leave for expecting mothers.' },
  { code: 'PATERNITY', name: 'Paternity Leave', category: 'Paid', unit: 'Days', quota: '10 days/event', accrual: 'None', eligible: 240, status: 'Active', description: 'Leave for new fathers.' },
  { code: 'UNPAID', name: 'Unpaid Leave', category: 'Unpaid', unit: 'Days', quota: 'Unlimited', accrual: 'None', eligible: 450, status: 'Active', description: 'Leave without pay for extended absence.' },
  { code: 'COMPOFF', name: 'Comp-Off', category: 'Paid', unit: 'Days', quota: 'Based on Credits', accrual: 'None', eligible: 450, status: 'Active', description: 'Compensatory leave for extra work.' },
  { code: 'SHORT', name: 'Short Leave', category: 'Paid', unit: 'Hours', quota: '2 hours/month', accrual: 'Monthly', eligible: 450, status: 'Active', description: 'Brief absence during work hours.' },
  { code: 'BEREAVE', name: 'Bereavement Leave', category: 'Paid', unit: 'Days', quota: '3 days/event', accrual: 'None', eligible: 450, status: 'Active', description: 'Leave for loss of immediate family.' },
  { code: 'STUDY', name: 'Study Leave', category: 'Paid', unit: 'Days', quota: '15 days/year', accrual: 'On Join', eligible: 100, status: 'Inactive', description: 'Professional development leave.' },
];

export const LeaveTypesList = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedType, setSelectedType] = useState<LeaveTypeConfig | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);

  const filteredTypes = useMemo(() => {
    return DEFAULT_TYPES.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Leave Types</h2>
          <p className="text-gray-500 font-medium">Configure and manage leave entitlements for the organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsGroupFormOpen(true)}
            className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Users size={18} /> Manage Groups
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all"
          >
            <Plus size={18} /> Create Leave Type
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Header/Filters */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Paid">Paid Only</option>
            <option value="Unpaid">Unpaid Only</option>
          </select>
          <select 
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="p-2.5 text-gray-400 hover:text-[#3E3B6F] transition-colors bg-white border border-gray-200 rounded-xl shadow-sm">
            <Filter size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quota</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accrual</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Eligible</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTypes.map((type) => (
                <tr 
                  key={type.code} 
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-[#3E3B6F] px-2 py-1 bg-indigo-50 rounded uppercase tracking-wider border border-indigo-100">
                      {type.code}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900">{type.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      type.category === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {type.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-600">{type.unit}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-700">{type.quota}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E3B6F]">
                      <Clock size={14} className="text-indigo-400" /> {type.accrual}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="text-sm font-bold text-gray-700">{type.eligible}</div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">staff</p>
                  </td>
                  <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                      <button 
                        className={`w-10 h-5 rounded-full relative transition-colors ${type.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${type.status === 'Active' ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="relative inline-block group/menu">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-20">
                         <div className="p-2 space-y-1">
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><Eye size={14}/> View Details</button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setIsFormOpen(true); }}
                             className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"
                           >
                             <Edit3 size={14}/> Edit Config
                           </button>
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"><Copy size={14}/> Clone Type</button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setIsHistoryOpen(true); }}
                             className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg"
                           >
                             <History size={14}/> Version History
                           </button>
                           <div className="h-px bg-gray-50 my-1" />
                           <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"><Power size={14}/> Deactivate</button>
                         </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedType && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedType(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[500px] bg-[#F5F5F5] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
                  <Database size={24}/>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">{selectedType.name}</h3>
                   <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">{selectedType.code}</p>
                </div>
              </div>
              <button onClick={() => setSelectedType(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Configuration Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Accrual Policy</p>
                    <p className="text-sm font-bold text-[#3E3B6F] flex items-center gap-1.5"><Clock size={14}/> {selectedType.accrual}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Unit of Measure</p>
                    <p className="text-sm font-bold text-gray-800">{selectedType.unit}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Entitlement</p>
                    <p className="text-sm font-bold text-gray-800">{selectedType.quota}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedType.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>{selectedType.status}</span>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</h4>
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                     "{selectedType.description}"
                   </p>
                 </div>
              </section>

              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Usage Insights</h4>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className="text-xs font-bold text-gray-700">92% Utilization Rate</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300"/>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-amber-500" />
                        <span className="text-xs font-bold text-gray-700">Encashment Restricted</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300"/>
                   </div>
                 </div>
              </section>

              <section className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eligibility Access</h4>
                 <div className="bg-[#3E3B6F] p-6 rounded-[24px] text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <p className="text-xs font-medium text-white/70 leading-relaxed">
                        Currently assigned to <span className="font-bold text-[#E8D5A3]">{selectedType.eligible}</span> employees across 8 departments including Engineering, Sales, and HR.
                      </p>
                      <button 
                        onClick={() => setIsGroupFormOpen(true)}
                        className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all border border-white/10"
                      >
                        MANAGE ACCESS LIST
                      </button>
                    </div>
                    <ShieldCheck className="absolute bottom-[-10px] right-[-10px] opacity-10" size={100} />
                 </div>
              </section>
            </div>

            <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex-1 py-3 px-6 bg-[#3E3B6F] text-white font-bold rounded-2xl hover:bg-[#4A4680] shadow-xl shadow-[#3E3B6F]/20 transition-all"
              >
                Edit Configuration
              </button>
              <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 border border-gray-100 rounded-2xl transition-all">
                <Power size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Type Config Form */}
      <LeaveTypeForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedType} 
      />

      {/* Version History Drawer */}
      <LeaveTypeVersionHistory 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        typeName={selectedType?.name || 'Annual Leave'}
      />

      {/* Eligibility Group Form */}
      <EligibilityGroupForm 
        isOpen={isGroupFormOpen}
        onClose={() => setIsGroupFormOpen(false)}
      />
    </div>
  );
};
