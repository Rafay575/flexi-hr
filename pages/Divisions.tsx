
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Layers, Pencil, GitFork, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataTable, Column } from '../components/ui/DataTable';
import { Division } from '../types';
import { DivisionModal } from '../components/DivisionModal';
import { BulkImportDrawer } from '../components/BulkImportDrawer';

export const Divisions: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: divisions, isLoading } = useQuery({ 
    queryKey: ['divisions'], 
    queryFn: api.getDivisions 
  });

  const { data: companies } = useQuery({ queryKey: ['companies'], queryFn: api.getCompanies });

  const getCompanyName = (id: string) => companies?.find(c => c.id === id)?.name || id;

  const handleEdit = (div: Division, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDivision(div);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingDivision(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (divisions) {
      const exportData = divisions.map(d => ({
        name: d.name,
        code: d.code,
        companyId: d.companyId,
        region: d.region,
        status: d.status
      }));
      downloadCSV(exportData, `divisions_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        name: row.name,
        code: row.code,
        companyId: row.companyId,
        region: row.region || '',
        status: 'active'
      };
      await api.addDivision(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['divisions'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.name) errors.push('Name is required');
    if (!row.code) errors.push('Code is required');
    if (!row.companyId) errors.push('Company ID is required');
    return errors;
  };

  const filteredDivisions = divisions?.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Division>[] = [
    {
      header: 'Division Name',
      accessor: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
             <Layers size={16} />
          </div>
          <div>
            <div className="font-medium text-slate-900">{d.name}</div>
            <div className="text-xs text-slate-500">{getCompanyName(d.companyId)}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Code',
      accessor: (d) => <span className="font-mono text-slate-600">{d.code}</span>
    },
    {
      header: 'Region',
      accessor: (d) => <span className="text-slate-600">{d.region || '-'}</span>
    },
    {
      header: 'Head of Division',
      accessor: (d) => <span className="text-slate-500 italic">{d.headOfDivisionId || 'Not Assigned'}</span>
    },
    {
      header: 'Status',
      accessor: (d) => <StatusBadge status={d.status} />
    },
    {
      header: 'Actions',
      width: '140px',
      className: 'text-right',
      accessor: (d) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors"
             onClick={(e) => { 
                e.stopPropagation(); 
                navigate(`/departments?divisionId=${d.id}`); 
             }}
             title="View Departments"
           >
             <GitFork size={14} /> Depts
           </button>
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
        title="Divisions & Groups" 
        description="Manage top-level business units, regional groups, and functional divisions."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Divisions' }]}
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
              Add Division
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by name, code or company..." 
             className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="w-full sm:w-48">
          <select 
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredDivisions} 
        isLoading={isLoading} 
        onRowClick={(d) => navigate(`/departments?divisionId=${d.id}`)}
        emptyState={
          <div className="flex flex-col items-center justify-center py-10">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Layers size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No divisions found</h3>
             <p className="text-slate-500 mt-1 mb-6">Create divisions to group your departments and lines.</p>
             <Button onClick={handleCreate}>Add Division</Button>
          </div>
        }
      />

      {isModalOpen && (
        <DivisionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          division={editingDivision} 
        />
      )}

      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Divisions"
        entityName="Division"
        templateHeader="name,code,companyId,region"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />
    </div>
  );
};
