
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  ChevronDown, ChevronRight, Copy, 
  Eye, History, FileCheck, Layers,
  Users, Calculator, ExternalLink
} from 'lucide-react';
import { SalaryTemplateBuilder } from './SalaryTemplateBuilder';

interface TemplateComponent {
  name: string;
  type: 'EARNING' | 'DEDUCTION' | 'CONTRIBUTION';
  calculation: string;
  value: string;
}

interface SalaryTemplate {
  id: string;
  code: string;
  name: string;
  grade: string;
  componentCount: number;
  assignedEmployees: number;
  version: string;
  status: 'Published' | 'Draft' | 'Locked';
  components: TemplateComponent[];
}

const MOCK_TEMPLATES: SalaryTemplate[] = [
  {
    id: '1',
    code: 'EXEC-G20',
    name: 'Executive Management (G20)',
    grade: 'G20 - C-Suite',
    componentCount: 12,
    assignedEmployees: 5,
    version: 'v2.4',
    status: 'Published',
    components: [
      { name: 'Basic Salary', type: 'EARNING', calculation: 'Fixed', value: 'PKR 450,000' },
      { name: 'House Rent', type: 'EARNING', calculation: '45% of Basic', value: 'PKR 202,500' },
      { name: 'Utilities', type: 'EARNING', calculation: '10% of Basic', value: 'PKR 45,000' },
      { name: 'Income Tax', type: 'DEDUCTION', calculation: 'Slab-based', value: 'Variable' },
      { name: 'PF Employer', type: 'CONTRIBUTION', calculation: '8.33% of Basic', value: 'PKR 37,485' }
    ]
  },
  {
    id: '2',
    code: 'ENG-SR-18',
    name: 'Senior Engineering Staff',
    grade: 'G18 - Lead',
    componentCount: 8,
    assignedEmployees: 42,
    version: 'v1.2',
    status: 'Published',
    components: [
      { name: 'Basic Salary', type: 'EARNING', calculation: 'Fixed', value: 'PKR 180,000' },
      { name: 'Fuel Allowance', type: 'EARNING', calculation: 'Fixed', value: 'PKR 25,000' },
      { name: 'PF Employee', type: 'DEDUCTION', calculation: '8.33% of Basic', value: 'PKR 14,994' }
    ]
  },
  {
    id: '3',
    code: 'OPS-G15',
    name: 'Operations Standard',
    grade: 'G15 - Associate',
    componentCount: 6,
    assignedEmployees: 124,
    version: 'v1.0',
    status: 'Locked',
    components: [
      { name: 'Basic Salary', type: 'EARNING', calculation: 'Fixed', value: 'PKR 65,000' },
      { name: 'EOBI Employee', type: 'DEDUCTION', calculation: 'Statutory', value: 'PKR 180' }
    ]
  },
  {
    id: '4',
    code: 'SALE-COMM',
    name: 'Sales Commission structure',
    grade: 'Multiple',
    componentCount: 5,
    assignedEmployees: 88,
    version: 'v3.1',
    status: 'Draft',
    components: [
      { name: 'Base Pay', type: 'EARNING', calculation: 'Fixed', value: 'PKR 40,000' },
      { name: 'Commission', type: 'EARNING', calculation: 'Performance %', value: 'Variable' }
    ]
  }
];

export const SalaryTemplatesList: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  if (isBuilding) {
    return <SalaryTemplateBuilder onBack={() => setIsBuilding(false)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Salary Templates</h2>
          <p className="text-sm text-gray-500">Master structures for grade-based compensation</p>
        </div>
        <button 
          onClick={() => setIsBuilding(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-white sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search templates by code or name..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
              <Filter size={14} /> Grade: All
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50">
              <Layers size={14} /> Version: Latest
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <th className="px-6 py-5 w-10"></th>
                <th className="px-6 py-5">Template Code</th>
                <th className="px-6 py-5">Template Name</th>
                <th className="px-6 py-5">Grade Group</th>
                <th className="px-6 py-5 text-center">Components</th>
                <th className="px-6 py-5 text-center">Assigned</th>
                <th className="px-6 py-5">Version</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {MOCK_TEMPLATES.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${isExpanded ? 'bg-primary/[0.02]' : ''}`}
                      onClick={() => toggleRow(item.id)}
                    >
                      <td className="px-6 py-4">
                        {isExpanded ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-gray-300" />}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-primary">{item.code}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{item.grade}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-700">{item.componentCount}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-500">
                          <Users size={14} />
                          <span className="font-bold">{item.assignedEmployees}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 border rounded uppercase">{item.version}</span>
                      </td>
                      <td className="px-6 py-4">
                        <TemplateStatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" title="Clone Template">
                            <Copy size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" title="Preview Payslip">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={9} className="px-12 py-6 border-b">
                          <div className="bg-white rounded-xl border border-gray-200 shadow-inner overflow-hidden animate-in slide-in-from-top-2 duration-300">
                            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Calculator size={14} /> Component Breakdown
                              </h5>
                              <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                                <ExternalLink size={12} /> Edit Components
                              </button>
                            </div>
                            <table className="w-full text-left">
                              <thead>
                                <tr className="text-[9px] font-black text-gray-400 uppercase tracking-tighter border-b bg-gray-50/30">
                                  <th className="px-6 py-3">Component Name</th>
                                  <th className="px-6 py-3">Type</th>
                                  <th className="px-6 py-3">Calculation Logic</th>
                                  <th className="px-6 py-3 text-right">Effective Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {item.components.map((comp, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-3 font-bold text-gray-700">{comp.name}</td>
                                    <td className="px-6 py-3">
                                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                        comp.type === 'EARNING' ? 'bg-payroll-earning/10 text-payroll-earning' :
                                        comp.type === 'DEDUCTION' ? 'bg-payroll-deduction/10 text-payroll-deduction' :
                                        'bg-payroll-contribution/10 text-payroll-contribution'
                                      }`}>
                                        {comp.type}
                                      </span>
                                    </td>
                                    <td className="px-6 py-3 text-xs text-gray-500 italic">{comp.calculation}</td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-gray-800">{comp.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="p-4 bg-primary/5 flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-400 uppercase">Last Modified</span>
                                  <span className="text-xs font-bold text-gray-600">Jan 12, 2025 by Admin</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-400 uppercase">Version History</span>
                                  <button className="text-xs font-bold text-primary flex items-center gap-1">
                                    <History size={12} /> 12 changes detected
                                  </button>
                                </div>
                              </div>
                              <button className="px-4 py-2 bg-white border border-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all">
                                Apply to 42 Pending Employees
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>Showing 4 Salary Templates</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-status-approved"></div> Published</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-status-draft"></div> Draft</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-status-locked"></div> Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateStatusBadge: React.FC<{ status: SalaryTemplate['status'] }> = ({ status }) => {
  const styles = {
    Published: 'bg-green-50 text-green-600 border-green-200',
    Draft: 'bg-gray-50 text-gray-400 border-gray-200 border-dashed',
    Locked: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};
