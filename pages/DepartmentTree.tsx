
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  Users, 
  MoreHorizontal, 
  Upload, 
  Download, 
  Filter, 
  X,
  Folder,
  FolderOpen,
  GitFork,
  Trash2,
  Edit2,
  Plus
} from 'lucide-react';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { Department, OrgUnitType } from '../types';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/Skeleton';
import { DepartmentModal } from '../components/DepartmentModal';
import { BulkImportDrawer } from '../components/BulkImportDrawer';
import { PageHeader } from '../components/ui/PageHeader';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

// --- Types & Interfaces ---

interface DeptNodeProps {
  dept: Department;
  allDepts: Department[];
  level?: number;
  onEdit: (d: Department) => void;
  onAddChild: (d: Department) => void;
  onDelete: (d: Department) => void;
}

// --- Components ---

const DeptNode: React.FC<DeptNodeProps> = ({ 
  dept, 
  allDepts, 
  level = 0,
  onEdit,
  onAddChild,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const children = allDepts.filter(d => d.parentId === dept.id);
  const hasChildren = children.length > 0;

  // Icons based on type
  const getIcon = () => {
    if (dept.type === 'line' || dept.type === 'team') return <GitFork size={16} />;
    return isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />;
  };

  const getTypeLabel = (type: OrgUnitType) => {
    switch(type) {
      case 'sub-department': return 'Sub-Dept';
      case 'line': return 'Line';
      case 'team': return 'Team';
      default: return 'Dept';
    }
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div className="select-none relative">
      <div 
        className={`
          flex items-center gap-2 p-2 rounded-lg group transition-colors cursor-pointer
          ${level === 0 ? 'bg-slate-50/80 mb-1 border border-slate-100' : 'hover:bg-slate-50'}
        `}
        style={{ marginLeft: `${level * 28}px` }}
        onClick={(e) => {
          // Prevent collapse if clicking menu
          if ((e.target as HTMLElement).closest('.menu-trigger')) return;
          setIsExpanded(!isExpanded);
        }}
      >
        <button 
          className={`
            p-1 rounded text-slate-400 transition-colors
            ${hasChildren ? 'hover:bg-slate-200 hover:text-slate-600' : 'opacity-0 pointer-events-none'}
          `}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <div className={`
          flex items-center justify-center w-8 h-8 rounded shrink-0 shadow-sm
          ${dept.type === 'department' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}
        `}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 truncate">{dept.name}</span>
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${dept.status === 'active' ? 'bg-white border-slate-200 text-slate-500' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {getTypeLabel(dept.type)}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span className="font-mono">{dept.code}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Users size={10} /> {dept.headcount}</span>
          </p>
        </div>

        {/* Action Menu */}
        <div className="relative menu-trigger">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className={`
              p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200
              ${showMenu ? 'bg-slate-200 text-slate-700' : 'opacity-0 group-hover:opacity-100'}
              transition-all
            `}
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => { setShowMenu(false); onAddChild(dept); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-2"
              >
                <Plus size={14} /> Add Child Unit
              </button>
              <button 
                onClick={() => { setShowMenu(false); onEdit(dept); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
              >
                <Edit2 size={14} /> Edit
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button 
                onClick={() => { setShowMenu(false); onDelete(dept); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="relative">
           <div 
            className="absolute top-0 bottom-3 border-l-2 border-slate-100"
            style={{ left: `${(level * 28) + 19}px` }}
          />
          {children.map(child => (
            <DeptNode 
              key={child.id} 
              dept={child} 
              allDepts={allDepts} 
              level={level + 1}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DepartmentTree: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const divisionId = searchParams.get('divisionId');

  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  const [modalData, setModalData] = useState<{
    department?: Department | null;
    parentId?: string | null;
    divisionId?: string;
  }>({});

  const { data: depts, isLoading: loadingDepts } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: api.getDepartments 
  });

  const { data: divisions } = useQuery({ 
    queryKey: ['divisions'], 
    queryFn: api.getDivisions 
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDeptToDelete(null);
    },
    onError: (err: Error) => {
      alert(err.message); 
      setDeptToDelete(null); // Close on error too, usually you'd want to keep open or show error toast
    }
  });

  // Handlers
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) setSearchParams({ divisionId: val });
    else setSearchParams({});
  };

  const handleAddRoot = () => {
    setModalData({ 
      divisionId: divisionId || undefined, 
      parentId: null, 
      department: null 
    });
    setIsModalOpen(true);
  };

  const handleAddChild = (parent: Department) => {
    setModalData({ 
      divisionId: parent.divisionId, 
      parentId: parent.id, 
      department: null 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setModalData({ department: dept });
    setIsModalOpen(true);
  };

  const handleDelete = (dept: Department) => {
    setDeptToDelete(dept);
  };

  const confirmDelete = () => {
    if (deptToDelete) {
      deleteMutation.mutate(deptToDelete.id);
    }
  };

  const handleExport = () => {
    if (depts) {
      const dataToExport = divisionId 
        ? depts.filter(d => d.divisionId === divisionId)
        : depts;

      const exportData = dataToExport.map(d => ({
        id: d.id,
        name: d.name,
        code: d.code,
        type: d.type,
        divisionId: d.divisionId,
        parentId: d.parentId || '',
        headcount: d.headcount,
        status: d.status
      }));
      downloadCSV(exportData, `departments_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        name: row.name,
        code: row.code,
        type: row.type || 'department',
        divisionId: row.divisionId,
        parentId: row.parentId || null,
        status: 'active',
        headcount: 0
      };
      await api.addDepartment(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['departments'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.name) errors.push('Name is required');
    if (!row.code) errors.push('Code is required');
    if (!row.divisionId) errors.push('Division ID is required');
    if (row.type && !['department', 'sub-department', 'line', 'team'].includes(row.type)) {
      errors.push('Invalid Unit Type');
    }
    return errors;
  };

  // Filter Logic
  const rootDepts = depts?.filter(d => {
    const isRoot = !d.parentId;
    const matchesDiv = divisionId ? d.divisionId === divisionId : true;
    return isRoot && matchesDiv;
  }) || [];

  return (
    <div>
      <PageHeader 
        title="Departments & Lines" 
        description="Design organizational hierarchy and reporting lines."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Departments' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleExport}>
              <Download size={16} className="mr-2" /> Export
            </Button>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload size={16} className="mr-2" /> Import
            </Button>
            <Button onClick={handleAddRoot}>
              <Plus size={16} className="mr-2" />
              Add Department
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        
        {/* Left: Filter & Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">Division Filter</label>
            <div className="relative">
              <select 
                className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                value={divisionId || ''}
                onChange={handleDivisionChange}
              >
                <option value="">All Divisions</option>
                {divisions?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <Filter size={16} />
              </div>
            </div>
            {!divisionId && (
              <p className="text-xs text-amber-600 mt-2">
                Tip: Filter by Division to manage specific hierarchies.
              </p>
            )}
          </div>

          {/* Stats Widget */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
             <h4 className="font-semibold text-indigo-900 mb-2">Structure Stats</h4>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                   <span className="text-indigo-700">Departments</span>
                   <span className="font-bold text-indigo-900">{depts?.filter(d => d.type === 'department').length || 0}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-indigo-700">Lines & Teams</span>
                   <span className="font-bold text-indigo-900">{depts?.filter(d => d.type !== 'department').length || 0}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Tree View */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
               {divisionId 
                 ? `Hierarchy: ${divisions?.find(d => d.id === divisionId)?.name}` 
                 : 'All Organizational Units'}
             </span>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {loadingDepts ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {rootDepts.length === 0 ? (
                   <div className="text-center py-16">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GitFork size={32} className="text-slate-300" />
                     </div>
                     <h3 className="text-lg font-medium text-slate-900">No departments found</h3>
                     <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                       {divisionId 
                         ? "This division has no departments yet. Click 'Add Department' to start building the structure." 
                         : "Select a division or click 'Add Department' to create a root unit."}
                     </p>
                   </div>
                ) : (
                  rootDepts.map(root => (
                    <DeptNode 
                      key={root.id} 
                      dept={root} 
                      allDepts={depts || []} 
                      onEdit={handleEdit}
                      onAddChild={handleAddChild}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <DepartmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={modalData.department}
        parentId={modalData.parentId}
        divisionId={modalData.divisionId}
      />
      
      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Departments"
        entityName="Department"
        templateHeader="name,code,type,divisionId,parentId"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />

      <ConfirmationModal
        isOpen={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${deptToDelete?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
