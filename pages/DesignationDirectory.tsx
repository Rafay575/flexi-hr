
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { Search, Filter, Briefcase, Plus, Pencil, Trash2, LayoutList, Network, ChevronDown, ChevronRight, User, Download, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Designation } from '../types';
import { DesignationModal } from '../components/DesignationModal';
import { Skeleton } from '../components/ui/Skeleton';
import { BulkImportDrawer } from '../components/BulkImportDrawer';

// --- Recursive Tree Node Component ---
interface ReportingNodeProps {
  node: Designation;
  allNodes: Designation[];
  onEdit: (d: Designation) => void;
  depth?: number;
}

const ReportingNode: React.FC<ReportingNodeProps> = ({ node, allNodes, onEdit, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Find direct reports
  const children = allNodes.filter(d => d.reportsToDesignationId === node.id);
  // Sort children by level (seniority) then title
  children.sort((a, b) => b.level - a.level || a.title.localeCompare(b.title));

  const hasChildren = children.length > 0;

  return (
    <div className="relative">
      <div className="flex items-start">
        {/* Connector Line for siblings (rendered by parent container usually, but handled here via margin/border logic below) */}
        
        <div className="flex flex-col items-center mr-2 pt-2">
           {hasChildren && (
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
             >
               {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
             </button>
           )}
           {!hasChildren && <div className="w-5" />} {/* Spacer */}
        </div>

        {/* Card */}
        <div 
          onClick={() => onEdit(node)}
          className={`
            group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer min-w-[280px] max-w-sm
            ${depth === 0 ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 hover:border-primary-400 hover:shadow-md'}
          `}
        >
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm
            ${depth === 0 ? 'bg-slate-800 text-slate-200' : 'bg-indigo-50 text-indigo-600'}
          `}>
             L{node.level}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold truncate ${depth === 0 ? 'text-white' : 'text-slate-900'}`}>{node.title}</h4>
            <div className={`text-xs flex items-center gap-2 ${depth === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="font-mono opacity-75">{node.code || 'NO-CODE'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User size={10} /> {node._count?.employees || 0}</span>
            </div>
          </div>

          <button className={`opacity-0 group-hover:opacity-100 p-1.5 rounded transition-opacity ${depth === 0 ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-400'}`}>
            <Pencil size={14} />
          </button>
        </div>
      </div>

      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="relative ml-4 pl-6 mt-3 space-y-3">
          {/* Vertical line connecting children */}
          <div className="absolute left-[13px] top-0 bottom-4 w-px bg-slate-200"></div>
          
          {children.map(child => (
            <div key={child.id} className="relative">
               {/* Horizontal line to child */}
               <div className="absolute -left-6 top-6 w-6 h-px bg-slate-200"></div>
               <ReportingNode node={child} allNodes={allNodes} onEdit={onEdit} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const DesignationDirectory: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [gradeFilter, setGradeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const { data: designations, isLoading } = useQuery({ 
    queryKey: ['designations'], 
    queryFn: api.getDesignations 
  });
  
  const { data: grades } = useQuery({ queryKey: ['grades'], queryFn: api.getGrades });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: api.getDepartments });

  // Helpers to resolve names
  const getGradeName = (id: string) => grades?.find(g => g.id === id)?.name || id;
  const getDeptName = (id?: string) => {
    if (!id) return 'Global';
    return departments?.find(d => d.id === id)?.name || id;
  };
  const getManagerTitle = (id?: string | null) => {
    if (!id) return '-';
    return designations?.find(d => d.id === id)?.title || id;
  };

  const handleEdit = (desg: Designation, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingDesignation(desg);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingDesignation(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (designations) {
      const exportData = designations.map(d => ({
        title: d.title,
        code: d.code,
        level: d.level,
        gradeId: d.gradeId,
        departmentId: d.departmentId,
        reportsToDesignationId: d.reportsToDesignationId,
        status: d.status
      }));
      downloadCSV(exportData, `designations_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        title: row.title,
        code: row.code,
        level: Number(row.level),
        gradeId: row.gradeId,
        departmentId: row.departmentId || undefined,
        reportsToDesignationId: row.reportsToDesignationId || null,
        status: 'active'
      };
      await api.addDesignation(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['designations'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.title) errors.push('Title is required');
    if (!row.gradeId) errors.push('Grade ID is required');
    if (!row.level) errors.push('Level is required');
    return errors;
  };

  // Filter Logic
  const filteredDesignations = designations?.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.code?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesGrade = gradeFilter ? d.gradeId === gradeFilter : true;
    const matchesDept = deptFilter ? d.departmentId === deptFilter : true;

    return matchesSearch && matchesStatus && matchesGrade && matchesDept;
  });

  // Tree Logic: Find roots (no manager OR manager not in current list)
  const rootNodes = filteredDesignations?.filter(d => 
    !d.reportsToDesignationId || !designations?.find(mgr => mgr.id === d.reportsToDesignationId)
  );

  // Sort roots by level (CEO/Top level first)
  rootNodes?.sort((a, b) => b.level - a.level);

  const columns: Column<Designation>[] = [
    {
      header: 'Title',
      accessor: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
             <Briefcase size={16} />
          </div>
          <div>
            <div className="font-medium text-slate-900">{d.title}</div>
            <div className="text-xs text-slate-500">{d.code || '-'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Job Level',
      accessor: (d) => <span className="font-mono text-slate-600">L{d.level}</span>
    },
    {
      header: 'Department',
      accessor: (d) => <span className={`text-xs px-2 py-1 rounded ${d.departmentId ? 'bg-slate-100 text-slate-700' : 'text-slate-400 italic'}`}>{getDeptName(d.departmentId)}</span>
    },
    {
      header: 'Grade / Band',
      accessor: (d) => <span className="text-slate-600">{getGradeName(d.gradeId)}</span>
    },
    {
      header: 'Reports To',
      accessor: (d) => <span className="text-slate-500 italic">{getManagerTitle(d.reportsToDesignationId)}</span>
    },
    {
      header: 'Active Emp.',
      accessor: (d) => <span className="font-medium text-slate-900">{d._count?.employees || 0}</span>,
      className: 'text-center'
    },
    {
      header: 'Status',
      accessor: (d) => <StatusBadge status={d.status} />
    },
    {
      header: 'Actions',
      width: '100px',
      className: 'text-right',
      accessor: (d) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
             onClick={(e) => handleEdit(d, e)}
             title="Edit"
           >
             <Pencil size={16} />
           </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Designation Directory" 
        description="Maintain job titles, reporting lines, and level hierarchies."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Designations' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleExport}>
              <Download size={16} className="mr-2" /> Export
            </Button>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload size={16} className="mr-2" /> Import
            </Button>
            <Button onClick={handleCreate}>
              <Plus size={18} className="mr-2" />
              Add Designation
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
           {/* Top Row: Search + View Toggle */}
           <div className="flex items-center gap-4">
             <div className="relative flex-1">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search designations..." 
                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             
             {/* View Toggle */}
             <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <LayoutList size={16} /> List
               </button>
               <button 
                 onClick={() => setViewMode('tree')}
                 className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'tree' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Network size={16} /> Reporting Map
               </button>
             </div>
           </div>

           {/* Second Row: Filters */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white text-sm"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white text-sm"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="">All Grades</option>
                {grades?.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              <select 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
           </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <DataTable 
          columns={columns} 
          data={filteredDesignations} 
          isLoading={isLoading} 
          emptyState={
            <div className="flex flex-col items-center justify-center py-10">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Briefcase size={32} className="text-slate-300" />
               </div>
               <h3 className="text-lg font-medium text-slate-900">No designations found</h3>
               <p className="text-slate-500 mt-1 mb-6">Create standard job titles to assign to employees.</p>
               <Button onClick={handleCreate}>Add Designation</Button>
            </div>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm overflow-x-auto min-h-[500px]">
          {isLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-64" />)}
             </div>
          ) : (
            <>
              {(!rootNodes || rootNodes.length === 0) ? (
                 <div className="text-center text-slate-500 py-10">
                   No reporting hierarchy found. Ensure designations have "Reports To" assigned.
                 </div>
              ) : (
                <div className="space-y-8">
                  {rootNodes.map(root => (
                    <ReportingNode 
                      key={root.id} 
                      node={root} 
                      allNodes={designations || []} 
                      onEdit={handleEdit} 
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isModalOpen && (
        <DesignationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          designation={editingDesignation} 
        />
      )}

      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Designations"
        entityName="Designation"
        templateHeader="title,code,level,gradeId,departmentId,reportsToDesignationId"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />
    </div>
  );
};
