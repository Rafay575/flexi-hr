
import React from 'react';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  isLoading, 
  emptyState,
  onRowClick 
}: DataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex gap-8">
             {columns.map((col, idx) => (
                <Skeleton key={idx} className="h-4 w-32" />
             ))}
          </div>
        </div>
        <div className="p-5 space-y-6">
           {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-8">
                 {columns.map((col, idx) => (
                    <Skeleton key={idx} className="h-4 flex-1" />
                 ))}
              </div>
           ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-card">
        {emptyState || (
          <div className="text-slate-500 font-medium">No data available</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onRowClick?.(item)}
                className={`group transition-all duration-150 ${onRowClick ? 'cursor-pointer hover:bg-slate-50 hover:shadow-inner' : ''}`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-6 py-4 align-middle font-medium text-slate-700 ${col.className || ''}`}>
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}