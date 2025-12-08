
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Wallet, Pencil, Building, MapPin, Download, Upload } from 'lucide-react';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CostCenter } from '../types';
import { CostCenterModal } from '../components/CostCenterModal';
import { BulkImportDrawer } from '../components/BulkImportDrawer';

export const CostCenters: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingCC, setEditingCC] = useState<CostCenter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [deptFilter, setDeptFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');

  const { data: costCenters, isLoading } = useQuery({ 
    queryKey: ['costCenters'], 
    queryFn: api.getCostCenters 
  });

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: api.getDepartments });
  const { data: locations } = useQuery({ queryKey: ['locations'], queryFn: api.getLocations });

  const handleCreate = () => {
    setEditingCC(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cc: CostCenter, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingCC(cc);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (costCenters) {
      const exportData = costCenters.map(cc => ({
        name: cc.name,
        code: cc.code,
        departmentId: cc.departmentId,
        locationId: cc.locationId,
        validFrom: cc.validFrom,
        status: cc.status
      }));
      downloadCSV(exportData, `cost_centers_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        name: row.name,
        code: row.code,
        departmentId: row.departmentId,
        locationId: row.locationId,
        validFrom: row.validFrom || new Date().toISOString().split('T')[0],
        status: 'active'
      };
      // Swallow errors for bulk (or handle better in real app)
      try {
        await api.addCostCenter(payload);
      } catch (e) {
        console.error("Failed to import row", row, e);
      }
    }
    queryClient.invalidateQueries({ queryKey: ['costCenters'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.name) errors.push('Name is required');
    if (!row.code) errors.push('Code is required');
    // Basic format check for validFrom if present
    if (row.validFrom && isNaN(Date.parse(row.validFrom))) {
      errors.push('Invalid Valid From Date');
    }
    return errors;
  };

  const getDeptName = (id?: string) => departments?.find(d => d.id === id)?.name || '-';
  const getLocName = (id?: string) => locations?.find(l => l.id === id)?.name || '-';

  const filteredCCs = costCenters?.filter(cc => {
    const matchesSearch = cc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cc.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? cc.departmentId === deptFilter : true;
    const matchesLoc = locFilter ? cc.locationId === locFilter : true;
    return matchesSearch && matchesDept && matchesLoc;
  });

  const columns: Column<CostCenter>[] = [
    {
      header: 'GL Code',
      accessor: (cc) => <span className="font-mono text-slate-900 font-medium">{cc.code}</span>
    },
    {
      header: 'Name',
      accessor: (cc) => <span className="font-medium text-slate-700">{cc.name}</span>
    },
    {
      header: 'Department',
      accessor: (cc) => (
        <span className="flex items-center gap-1.5 text-slate-600 text-sm">
           {cc.departmentId && <Building size={14} className="text-slate-400" />}
           {getDeptName(cc.departmentId)}
        </span>
      )
    },
    {
      header: 'Location',
      accessor: (cc) => (
        <span className="flex items-center gap-1.5 text-slate-600 text-sm">
           {cc.locationId && <MapPin size={14} className="text-slate-400" />}
           {getLocName(cc.locationId)}
        </span>
      )
    },
    {
      header: 'Valid From',
      accessor: (cc) => <span className="text-slate-500 text-xs">{cc.validFrom}</span>
    },
    {
      header: 'Status',
      accessor: (cc) => <StatusBadge status={cc.status} />
    },
    {
      header: 'Actions',
      width: '100px',
      className: 'text-right',
      accessor: (cc) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
             onClick={(e) => handleEdit(cc, e)}
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
        title="Cost Centers" 
        description="Manage financial cost centers, GL codes, and budget allocation units."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Cost Centers' }]}
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
              Add Cost Center
            </Button>
          </div>
        }
      />
      
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
         <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search cost centers..." 
                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <select 
               className="px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white text-sm w-full md:w-48"
               value={deptFilter}
               onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments?.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select 
               className="px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 bg-white text-sm w-full md:w-48"
               value={locFilter}
               onChange={(e) => setLocFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations?.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
         </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredCCs} 
        isLoading={isLoading} 
        onRowClick={(cc) => handleEdit(cc)}
        emptyState={
          <div className="flex flex-col items-center justify-center py-10">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Wallet size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No cost centers found</h3>
             <p className="text-slate-500 mt-1 mb-6">Create cost centers to track financial data.</p>
             <Button onClick={handleCreate}>Add Cost Center</Button>
          </div>
        }
      />

      {isModalOpen && (
        <CostCenterModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          costCenter={editingCC} 
        />
      )}

      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Cost Centers"
        entityName="Cost Center"
        templateHeader="name,code,departmentId,locationId,validFrom"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />
    </div>
  );
};
