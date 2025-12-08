

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ShieldCheck, Activity, User, Clock, FileDiff, RefreshCw, Calendar } from 'lucide-react';
import { api } from '../services/mockData';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';
import { AuditEntry } from '../types';
import { Button } from '../components/ui/Button';

export const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: logs, isLoading, refetch, isRefetching } = useQuery({ 
    queryKey: ['audit-logs'], 
    queryFn: () => api.getAuditLogs() 
  });

  // Extract unique actors for filter dropdown
  const uniqueActors = Array.from(new Set(logs?.map(l => l.actor.name))).sort();

  const filteredLogs = logs?.filter(log => {
    // 1. Search Term
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Type Filter
    const matchesType = typeFilter ? log.entityType === typeFilter : true;
    
    // 3. Action Filter
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    
    // 4. Actor Filter
    const matchesActor = actorFilter ? log.actor.name === actorFilter : true;

    // 5. Date Range
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(log.timestamp) >= new Date(dateFrom);
    }
    if (dateTo) {
      // Add one day to include the end date fully
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      matchesDate = matchesDate && new Date(log.timestamp) < endDate;
    }

    return matchesSearch && matchesType && matchesAction && matchesActor && matchesDate;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-green-600 bg-green-50 border-green-100';
      case 'update': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'delete': return 'text-red-600 bg-red-50 border-red-100';
      case 'activate': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'deactivate': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const columns: Column<AuditEntry>[] = [
    {
      header: 'Event',
      accessor: (log) => (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg border ${getActionColor(log.action)}`}>
            <Activity size={16} />
          </div>
          <div>
            <div className="font-medium text-slate-900">{log.entityType}: {log.entityName}</div>
            <div className="text-xs text-slate-500 mt-0.5">{log.details}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Action',
      accessor: (log) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${getActionColor(log.action)}`}>
          {log.action}
        </span>
      )
    },
    {
      header: 'Changed By',
      accessor: (log) => (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
             <User size={12} />
          </div>
          {log.actor.name}
        </div>
      )
    },
    {
      header: 'Timestamp',
      accessor: (log) => (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={14} />
          {new Date(log.timestamp).toLocaleString()}
        </div>
      )
    },
    {
      header: 'Changes',
      width: '300px',
      accessor: (log) => (
        log.changes ? (
          <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
             {Object.keys(log.changes).slice(0, 3).map(key => (
               <div key={key} className="grid grid-cols-[80px_1fr] gap-1">
                 <span className="text-slate-500 truncate font-medium">{key}:</span>
                 <div className="flex items-center gap-1 font-mono text-[10px]">
                   <span className="text-red-400 line-through opacity-70 truncate max-w-[60px]">{String(log.changes![key].from)}</span>
                   <span className="text-slate-300">→</span>
                   <span className="text-green-600 truncate max-w-[60px]">{String(log.changes![key].to)}</span>
                 </div>
               </div>
             ))}
             {Object.keys(log.changes).length > 3 && (
               <span className="text-[10px] text-primary-600 italic">+{Object.keys(log.changes).length - 3} more fields...</span>
             )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">No specific field diff</span>
        )
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Audit Log" 
        description="Comprehensive system-wide event history, security logs, and data changes."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Audit Log' }]}
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw size={16} className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Log
          </Button>
        }
      />
      
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm space-y-4">
        {/* Row 1: Search */}
        <div className="relative">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search logs by entity, user, or details..." 
             className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Row 2: Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
           {/* Entity Filter */}
           <div className="relative">
             <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <select 
               className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white appearance-none text-sm"
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
             >
               <option value="">All Entities</option>
               <option value="Company">Company</option>
               <option value="Division">Division</option>
               <option value="Department">Department</option>
               <option value="Designation">Designation</option>
               <option value="Grade">Grade</option>
               <option value="Location">Location</option>
               <option value="CostCenter">Cost Center</option>
             </select>
           </div>

           {/* Action Filter */}
           <div className="relative">
             <Activity size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <select 
               className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white appearance-none text-sm"
               value={actionFilter}
               onChange={(e) => setActionFilter(e.target.value)}
             >
               <option value="">All Actions</option>
               <option value="create">Create</option>
               <option value="update">Update</option>
               <option value="delete">Delete</option>
               <option value="activate">Activate</option>
               <option value="deactivate">Deactivate</option>
             </select>
           </div>

           {/* Actor Filter */}
           <div className="relative">
             <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <select 
               className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white appearance-none text-sm"
               value={actorFilter}
               onChange={(e) => setActorFilter(e.target.value)}
             >
               <option value="">All Users</option>
               {uniqueActors.map(actor => (
                 <option key={actor} value={actor}>{actor}</option>
               ))}
             </select>
           </div>

           {/* Date From */}
           <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={16} />
              </div>
              <input 
                type="date"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 text-sm text-slate-600"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Start Date"
              />
           </div>

           {/* Date To */}
           <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={16} />
              </div>
              <input 
                type="date"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 text-sm text-slate-600"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="End Date"
              />
           </div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredLogs} 
        isLoading={isLoading} 
        emptyState={
          <div className="flex flex-col items-center justify-center py-16">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={40} className="text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">No audit records found</h3>
             <p className="text-slate-500 mt-2 max-w-md text-center">
               System events and data changes will appear here. Try adjusting your filters or performing some actions in the system.
             </p>
          </div>
        }
      />
    </div>
  );
};