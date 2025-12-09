
import React, { useState } from 'react';
import { 
  ArrowRightLeft, Search, Filter, MoreHorizontal, ArrowRight, 
  Calendar, User, CheckCircle, XCircle, Clock, AlertCircle, Plus,
  ChevronLeft
} from 'lucide-react';
import { Transfer, Employee } from '../types';
import { DEPARTMENTS } from '../mockData';
import TransferWizard from './TransferWizard';

interface TransfersProps {
  transfers: Transfer[];
  employees: Employee[];
  onTransferCreate: (transfer: Transfer) => void;
}

const Transfers: React.FC<TransfersProps> = ({ transfers, employees, onTransferCreate }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Filter Logic
  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.initiator.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesDept = deptFilter === 'All' || t.department === deptFilter;
    const matchesType = typeFilter === 'All' || t.type === typeFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesType;
  });

  const getStatusColor = (status: Transfer['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-state-success border-green-200';
      case 'Rejected': return 'bg-red-50 text-state-error border-red-200';
      case 'In Progress': return 'bg-blue-50 text-flexi-blue border-blue-200';
      case 'Pending': return 'bg-yellow-50 text-state-warning border-yellow-200';
      default: return 'bg-neutral-page text-neutral-secondary border-neutral-border';
    }
  };

  const getStatusIcon = (status: Transfer['status']) => {
      switch (status) {
        case 'Approved': return <CheckCircle className="w-3.5 h-3.5" />;
        case 'Rejected': return <XCircle className="w-3.5 h-3.5" />;
        case 'In Progress': return <ArrowRightLeft className="w-3.5 h-3.5" />;
        case 'Pending': return <Clock className="w-3.5 h-3.5" />;
      }
  };

  const handleWizardSubmit = (newTransfer: Transfer) => {
      onTransferCreate(newTransfer);
      setShowWizard(false);
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";
  const selectClass = "w-full pl-3 pr-8 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary appearance-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary outline-none cursor-pointer transition-all";

  // --- WIZARD VIEW ---
  if (showWizard) {
      return (
          <TransferWizard 
            employees={employees}
            onCancel={() => setShowWizard(false)}
            onSubmit={handleWizardSubmit}
          />
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-neutral-primary tracking-tight mb-2">Transfers & Promotions</h2>
            <p className="text-neutral-secondary font-light">Manage internal movements, role changes, and location transfers.</p>
        </div>
        <button 
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-3 bg-flexi-primary text-white text-sm font-bold rounded-lg hover:bg-flexi-secondary shadow-sm transition-all"
        >
            <Plus className="w-4 h-4" /> Initiate Transfer
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted h-4 w-4" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by employee or initiator..."
                className={inputClass}
            />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <div className="relative min-w-[140px]">
                <select 
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className={selectClass}
                >
                    <option value="All">All Depts</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={selectClass}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
                <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={selectClass}
                >
                    <option value="All">All Types</option>
                    <option value="Department">Department</option>
                    <option value="Location">Location</option>
                    <option value="Role">Role Change</option>
                    <option value="Promotion">Promotion</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-muted pointer-events-none" />
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-page border-b border-neutral-border">
                    <tr>
                        <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Employee</th>
                        <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Transfer Details</th>
                        <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Initiated By</th>
                        <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Dates</th>
                        <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-semibold text-neutral-secondary uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                    {filteredTransfers.length > 0 ? (
                        filteredTransfers.map(t => (
                            <tr key={t.id} className="hover:bg-[#F0EFF6] transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full border border-neutral-border object-cover" />
                                        <div>
                                            <div className="font-semibold text-neutral-primary text-sm">{t.name}</div>
                                            <div className="text-xs text-neutral-muted font-mono">{t.employeeId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider bg-neutral-page w-fit px-1.5 py-0.5 rounded border border-neutral-200">
                                            {t.type}
                                        </span>
                                        <div className="flex items-center gap-2 text-sm text-neutral-primary font-medium mt-1">
                                            <span className="text-neutral-500 line-through decoration-neutral-300">{t.from}</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                                            <span className="text-flexi-primary">{t.to}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                                            {t.initiator.charAt(0)}
                                        </div>
                                        <span className="text-sm text-neutral-primary">{t.initiator}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-secondary">
                                            <Clock className="w-3 h-3" /> Req: {t.requestDate}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-primary font-medium">
                                            <Calendar className="w-3 h-3 text-flexi-primary" /> Eff: {t.effectiveDate}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(t.status)}`}>
                                        {getStatusIcon(t.status)}
                                        {t.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-neutral-muted hover:bg-neutral-page hover:text-flexi-primary rounded-lg transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center bg-white rounded-xl">
                                    <div className="w-12 h-12 bg-neutral-page rounded-full flex items-center justify-center mb-3">
                                        <ArrowRightLeft className="w-6 h-6 text-neutral-muted" />
                                    </div>
                                    <h3 className="text-neutral-primary font-semibold">No transfers found</h3>
                                    <p className="text-neutral-secondary text-sm mt-1">Try adjusting your filters.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Transfers;
