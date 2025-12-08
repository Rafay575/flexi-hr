
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Clock, User, FileDiff } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { api } from '../services/mockData';
import { AuditEntry } from '../types';
import { Skeleton } from './ui/Skeleton';
import { StatusBadge } from './ui/StatusBadge';

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: string;
  entityName?: string;
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ 
  isOpen, 
  onClose, 
  entityId, 
  entityType,
  entityName 
}) => {
  const { data: logs, isLoading } = useQuery({ 
    queryKey: ['audit', entityType, entityId], 
    queryFn: () => api.getAuditLogs({ entityId, entityType }),
    enabled: isOpen && !!entityId
  });

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Audit History"
      description={`Change log for ${entityType}: ${entityName || entityId}`}
      size="md"
    >
      <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 py-2">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="mb-8 ml-6 relative">
              <span className="absolute -left-[33px] bg-white border-2 border-slate-100 rounded-full w-4 h-4"></span>
              <Skeleton className="h-20 w-full" />
            </div>
          ))
        ) : (
          logs?.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No history found for this item.</div>
          ) : (
            logs?.map(entry => (
              <AuditItem key={entry.id} entry={entry} />
            ))
          )
        )}
      </div>
    </Drawer>
  );
};

const AuditItem: React.FC<{ entry: AuditEntry }> = ({ entry }) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700 border-green-200';
      case 'delete': return 'bg-red-100 text-red-700 border-red-200';
      case 'activate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deactivate': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionIcon = (action: string) => {
    // Icons can be conditional here if needed
    return <Activity size={14} />;
  };

  return (
    <div className="ml-6 relative">
      {/* Timeline Dot */}
      <span className={`absolute -left-[35px] top-1 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm z-10 ${getActionColor(entry.action)}`}>
        {getActionIcon(entry.action)}
      </span>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border mb-2 inline-block ${getActionColor(entry.action)}`}>
              {entry.action}
            </span>
            <p className="text-sm font-medium text-slate-900">{entry.details}</p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} />
            {new Date(entry.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Changes Diff */}
        {entry.changes && Object.keys(entry.changes).length > 0 && (
          <div className="mt-3 bg-slate-50 rounded p-2 text-xs border border-slate-100">
             <div className="flex items-center gap-1 text-slate-500 mb-1 font-medium">
               <FileDiff size={12} /> Changes:
             </div>
             <ul className="space-y-1">
               {Object.entries(entry.changes).map(([key, val]) => (
                 <li key={key} className="grid grid-cols-[100px_1fr] gap-2">
                   <span className="text-slate-500 truncate" title={key}>{key}:</span>
                   <span className="font-mono">
                     <span className="text-red-500 line-through mr-2 opacity-70">{String(val.from)}</span>
                     <span className="text-green-600">{String(val.to)}</span>
                   </span>
                 </li>
               ))}
             </ul>
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <User size={12} />
          <span>Action by: <span className="font-medium text-slate-700">{entry.actor.name}</span></span>
        </div>
      </div>
    </div>
  );
};
