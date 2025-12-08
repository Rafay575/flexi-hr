
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Building2, Eye, Pencil, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataTable, Column } from '../components/ui/DataTable';
import { Company } from '../types';
import { CompanyWizard } from '../components/CompanyWizard';
import { BulkImportDrawer } from '../components/BulkImportDrawer';

export const CompanyManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const { data: companies, isLoading } = useQuery({ 
    queryKey: ['companies'], 
    queryFn: api.getCompanies 
  });

  const handleEdit = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (companies) {
      const exportData = companies.map(c => ({
        name: c.name,
        registrationNumber: c.registrationNumber,
        sector: c.sector,
        taxId: c.taxId,
        addressLine1: c.addressLine1,
        city: c.city,
        country: c.country,
        status: c.status
      }));
      downloadCSV(exportData, `companies_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        name: row.name,
        registrationNumber: row.registrationNumber,
        sector: row.sector || '',
        addressLine1: row.addressLine1 || 'Unknown',
        city: row.city || 'Unknown',
        state: row.state || 'Unknown',
        country: row.country || 'USA',
        postalCode: row.postalCode || '00000',
        status: 'active'
      };
      await api.addCompany(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.name) errors.push('Name is required');
    if (!row.registrationNumber) errors.push('Registration Number is required');
    return errors;
  };

  const filteredCompanies = companies?.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Company>[] = [
    {
      header: 'Name',
      accessor: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
             {c.logoUrl ? <img src={c.logoUrl} alt="" className="w-full h-full object-cover rounded" /> : <Building2 size={16} />}
          </div>
          <div>
            <div className="font-medium text-slate-900">{c.name}</div>
            <div className="text-xs text-slate-500">{c.domain || 'No domain'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Code / Reg No.',
      accessor: (c) => <span className="font-mono text-slate-600">{c.registrationNumber}</span>
    },
    {
      header: 'Sector',
      accessor: (c) => <span className="text-slate-600">{c.sector || '-'}</span>
    },
    {
      header: 'Status',
      accessor: (c) => <StatusBadge status={c.status} />
    },
    {
      header: 'Divisions',
      accessor: (c) => <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium min-w-[30px]">{c._count?.divisions ?? 0}</span>,
      className: 'text-center'
    },
    {
      header: 'Depts',
      accessor: (c) => <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium min-w-[30px]">{c._count?.departments ?? 0}</span>,
      className: 'text-center'
    },
    {
      header: 'Employees',
      accessor: (c) => <span className="font-medium text-slate-900">{c._count?.employees ?? 0}</span>,
      className: 'text-center'
    },
    {
      header: 'Actions',
      width: '100px',
      className: 'text-right',
      accessor: (c) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded"
             onClick={(e) => { e.stopPropagation(); navigate(`/companies/${c.id}`); }}
             title="View Details"
           >
             <Eye size={16} />
           </button>
           <button 
             className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
             onClick={(e) => handleEdit(c, e)}
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
        title="Company Management" 
        description="Manage your legal entities, subsidiaries, and registration details."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Companies' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleExport}>
              <Download size={16} className="mr-2" /> Export
            </Button>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload size={16} className="mr-2" /> Import
            </Button>
            <Button onClick={handleCreate} className="shadow-lg shadow-primary-500/20">
              <Plus size={18} className="mr-2" />
              Add Company
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by company name or code..." 
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
        data={filteredCompanies} 
        isLoading={isLoading} 
        onRowClick={(c) => navigate(`/companies/${c.id}`)}
        emptyState={
          <div className="flex flex-col items-center justify-center py-10">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Building2 size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
             <p className="text-slate-500 mt-1 mb-6">Get started by creating your first legal entity.</p>
             <Button onClick={handleCreate}>Add Company</Button>
          </div>
        }
      />

      {isModalOpen && (
        <CompanyWizard 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          company={editingCompany} 
        />
      )}

      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Companies"
        entityName="Company"
        templateHeader="name,registrationNumber,sector,taxId,addressLine1,city,country"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />
    </div>
  );
};
