
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Users, Download, Upload } from 'lucide-react';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/button';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Grade } from '../types';
import { GradeModal } from '../components/GradeModal';
import { BulkImportDrawer } from '../components/BulkImportDrawer';

export const Grades: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: grades, isLoading } = useQuery({ 
    queryKey: ['grades'], 
    queryFn: api.getGrades 
  });

  const handleCreate = () => {
    setEditingGrade(null);
    setIsModalOpen(true);
  };

  const handleEdit = (grade: Grade, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (grades) {
      const exportData = grades.map(g => ({
        name: g.name,
        code: g.code,
        level: g.level,
        currency: g.currency,
        minBaseSalary: g.minBaseSalary,
        maxBaseSalary: g.maxBaseSalary,
        status: g.status
      }));
      downloadCSV(exportData, `grades_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        name: row.name,
        code: row.code,
        level: Number(row.level),
        currency: row.currency || 'USD',
        minBaseSalary: Number(row.minBaseSalary || 0),
        maxBaseSalary: Number(row.maxBaseSalary || 0),
        status: 'active'
      };
      await api.addGrade(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['grades'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.name) errors.push('Name is required');
    if (!row.code) errors.push('Code is required');
    if (!row.level) errors.push('Level is required');
    return errors;
  };

  const filteredGrades = grades?.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort by Level (Numerical) usually descending for seniority (e.g., 1 is highest)
  const sortedGrades = filteredGrades?.sort((a, b) => b.level - a.level);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
  };

  const columns: Column<Grade>[] = [
    {
      header: 'Code',
      accessor: (g) => <span className="font-mono text-slate-900 font-medium">{g.code}</span>
    },
    {
      header: 'Grade Name',
      accessor: (g) => <span className="font-medium text-slate-700">{g.name}</span>
    },
    {
      header: 'Level',
      accessor: (g) => <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-slate-100 text-slate-700 font-bold text-xs">{g.level}</span>
    },
    {
      header: 'Min Salary',
      accessor: (g) => <span className="text-slate-600 font-mono text-xs">{formatCurrency(g.minBaseSalary, g.currency)}</span>
    },
    {
      header: 'Max Salary',
      accessor: (g) => <span className="text-slate-600 font-mono text-xs">{formatCurrency(g.maxBaseSalary, g.currency)}</span>
    },
    {
      header: 'Status',
      accessor: (g) => <StatusBadge status={g.status} />
    },
    {
      header: 'Actions',
      width: '100px',
      className: 'text-right',
      accessor: (g) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
             onClick={(e) => handleEdit(g, e)}
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
        title="Grades & Bands" 
        description="Define salary bands, grade levels, and compensation structures."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Grades & Bands' }]}
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
              Add Grade
            </Button>
          </div>
        }
      />
      
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="relative">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search grades by name or code..." 
             className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all max-w-md"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={sortedGrades} 
        isLoading={isLoading} 
        onRowClick={(g) => handleEdit(g)}
        emptyState={
          <div className="flex flex-col items-center justify-center py-10">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No grades found</h3>
             <p className="text-slate-500 mt-1 mb-6">Create your first compensation grade.</p>
             <Button onClick={handleCreate}>Add Grade</Button>
          </div>
        }
      />

      {isModalOpen && (
        <GradeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          grade={editingGrade} 
        />
      )}

      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Grades"
        entityName="Grade"
        templateHeader="name,code,level,currency,minBaseSalary,maxBaseSalary"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />
    </div>
  );
};
