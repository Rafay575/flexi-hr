import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Clock, 
  UserCheck, 
  Copy, 
  History, 
  Power, 
  Settings2,
  Calendar,
  Moon,
  Sun,
  LayoutGrid,
  Zap,
  ArrowRight,
  Download,
  Eye,
  Trash2,
  Edit2,
  BarChart3,
  Briefcase,
  MapPin,
  CalendarDays,
  Hash,
  EyeOff,
} from 'lucide-react';
import { ShiftTemplate, ShiftType, ShiftStatus } from './types';
import { ShiftTemplateForm } from './ShiftTemplateForm';

const TYPE_CONFIG = {
  FIXED: { label: 'Fixed', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Sun size={12} /> },
  FLEXI: { label: 'Flexi', color: 'bg-green-50 text-green-600 border-green-100', icon: <Zap size={12} /> },
  ROTATING: { label: 'Rotating', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <LayoutGrid size={12} /> },
  SPLIT: { label: 'Split', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Settings2 size={12} /> },
  RAMZAN: { label: 'Ramzan', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Moon size={12} /> },
};

// Updated mock data to match simplified ShiftTemplate interface
const MOCK_SHIFTS: ShiftTemplate[] = [
  { 
    id: 'ST-001',
    code: 'MORN', 
    name: 'Morning Shift', 
    description: 'Standard morning shift for all departments',
    type: 'FIXED', 
    employeeCount: 85, 
    status: 'ACTIVE',
    department: 'Engineering',
    location: 'HQ Main',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-002',
    code: 'EVE', 
    name: 'Evening Shift', 
    description: 'Evening shift for customer support',
    type: 'FIXED', 
    employeeCount: 42, 
    status: 'ACTIVE',
    department: 'Support',
    location: 'HQ Main',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-003',
    code: 'NIGHT', 
    name: 'Night Shift', 
    description: 'Night operations shift',
    type: 'FIXED', 
    employeeCount: 12, 
    status: 'ACTIVE',
    department: 'Operations',
    location: 'Data Center',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-004',
    code: 'FLEXI', 
    name: 'General Flexi', 
    description: 'Flexible working hours for all departments',
    type: 'FLEXI', 
    employeeCount: 30, 
    status: 'ACTIVE',
    department: 'All',
    location: 'Remote',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-005',
    code: 'RMZ', 
    name: 'Ramzan Shift', 
    description: 'Special shift for Ramadan period',
    type: 'RAMZAN', 
    employeeCount: 156, 
    status: 'INACTIVE',
    department: 'All',
    location: 'HQ Main',
    effectiveFrom: '2025-03-01',
    effectiveTo: '2025-04-30',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-006',
    code: 'SPLT', 
    name: 'Split Shift', 
    description: 'Split shift for warehouse operations',
    type: 'SPLIT', 
    employeeCount: 8, 
    status: 'ACTIVE',
    department: 'Operations',
    location: 'Warehouse',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-007',
    code: 'ROTA', 
    name: 'Rotation A', 
    description: 'Rotating shift for manufacturing',
    type: 'ROTATING', 
    employeeCount: 24, 
    status: 'ACTIVE',
    department: 'Manufacturing',
    location: 'Factory',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  { 
    id: 'ST-008',
    code: 'INT', 
    name: 'Intern Shift', 
    description: 'Flexible shift for interns',
    type: 'FLEXI', 
    employeeCount: 15, 
    status: 'ACTIVE',
    department: 'All',
    location: 'HQ Main',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    createdBy: 'Admin User',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
];

export const ShiftTemplatesList = () => {
  const [shifts, setShifts] = useState<ShiftTemplate[]>(MOCK_SHIFTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ShiftType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<ShiftStatus | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedShift, setSelectedShift] = useState<ShiftTemplate | null>(null);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const matchesSearch = shift.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           shift.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           shift.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           shift.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || shift.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || shift.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [shifts, searchQuery, filterType, filterStatus]);

  const handleCreateTemplate = () => {
    setSelectedShift(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditTemplate = (shift: ShiftTemplate) => {
    setSelectedShift(shift);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleViewTemplate = (shift: ShiftTemplate) => {
    alert(`Viewing template: ${shift.name}\n\nThis would open a detailed view in a real implementation.`);
  };

  const handleDuplicateTemplate = (shift: ShiftTemplate) => {
    const newShift: ShiftTemplate = {
      ...shift,
      id: `ST-${Math.floor(Math.random() * 900) + 100}`,
      code: `${shift.code}-COPY`,
      name: `${shift.name} (Copy)`,
      employeeCount: 0,
      status: 'ACTIVE' as ShiftStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setShifts(prev => [newShift, ...prev]);
    setActiveActionMenu(null);
  };

  const handleToggleStatus = (shiftId: string) => {
    setShifts(prev => prev.map(shift => 
      shift.id === shiftId 
        ? { ...shift, status: shift.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE', updatedAt: new Date().toISOString() }
        : shift
    ));
    setActiveActionMenu(null);
  };

  const handleDeleteTemplate = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift?.employeeCount && shift.employeeCount > 0) {
      alert('Cannot delete shift template with assigned employees');
      return;
    }
    if (window.confirm('Are you sure you want to delete this shift template?')) {
      setShifts(prev => prev.filter(s => s.id !== shiftId));
    }
    setActiveActionMenu(null);
  };

  const handleSaveTemplate = (templateData: Omit<ShiftTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (formMode === 'edit' && selectedShift) {
      // Update existing template
      setShifts(prev => prev.map(shift => 
        shift.id === selectedShift.id 
          ? { 
              ...templateData, 
              id: selectedShift.id, 
              employeeCount: selectedShift.employeeCount,
              createdAt: selectedShift.createdAt, 
              updatedAt: new Date().toISOString() 
            }
          : shift
      ));
    } else {
      // Add new template
      const newShift: ShiftTemplate = {
        ...templateData,
        id: `ST-${Math.floor(Math.random() * 900) + 100}`,
        employeeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Ensure all required fields are present
        createdBy: templateData.createdBy || 'Current User',
      };
      setShifts(prev => [newShift, ...prev]);
    }
    
    setShowForm(false);
    setSelectedShift(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Shift Templates</h2>
          <p className="text-sm text-gray-500 font-medium italic">Configure and manage shift templates for your organization</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input 
              type="text" 
              placeholder="Search code, name, department or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium w-64 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={handleCreateTemplate}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Template
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => { setFilterType('ALL'); setFilterStatus('ALL'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            filterType === 'ALL' && filterStatus === 'ALL' 
              ? 'bg-[#3E3B6F] text-white border-transparent shadow-md' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Shifts
        </button>
        
        {/* Type Filters */}
        {(['FIXED', 'FLEXI', 'ROTATING', 'SPLIT', 'RAMZAN'] as ShiftType[]).map(type => (
          <button 
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              filterType === type 
                ? 'bg-[#3E3B6F] text-white border-transparent shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {TYPE_CONFIG[type].icon}
            {TYPE_CONFIG[type].label}
          </button>
        ))}

        {/* Status Filters */}
        <div className="ml-4 pl-4 border-l border-gray-200">
          <button 
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              filterStatus === 'ACTIVE' 
                ? 'bg-green-500 text-white border-transparent shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilterStatus('INACTIVE')}
            className={`ml-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              filterStatus === 'INACTIVE' 
                ? 'bg-gray-500 text-white border-transparent shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Templates</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{shifts.length}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Templates</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">
              {shifts.filter(s => s.status === 'ACTIVE').length}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assigned Employees</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">
              {shifts.reduce((sum, s) => sum + (s.employeeCount || 0), 0)}
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Shift Types</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">
              {new Set(shifts.map(s => s.type)).size}
            </span>
            <span className="text-xs font-bold text-white/50">Types</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Code & Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Department & Location</th>
                <th className="px-6 py-4">Effective Period</th>
                <th className="px-6 py-4 text-center">Employees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3E3B6F] to-[#4A457A] flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-[#3E3B6F]/10">
                        {shift.code}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{shift.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 line-clamp-2 max-w-[200px]">
                          {shift.description || 'No description provided'}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">ID: {shift.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${TYPE_CONFIG[shift.type].color}`}>
                      {TYPE_CONFIG[shift.type].icon}
                      {TYPE_CONFIG[shift.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      {shift.department ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                          <Briefcase size={14} className="text-blue-500" />
                          {shift.department}
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-gray-400">No department</div>
                      )}
                      {shift.location ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                          <MapPin size={14} className="text-green-500" />
                          {shift.location}
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-gray-400">No location</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <CalendarDays size={14} className="text-purple-500" />
                        From: {formatDate(shift.effectiveFrom)}
                      </div>
                      {shift.effectiveTo ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                          <CalendarDays size={14} className="text-orange-500" />
                          To: {formatDate(shift.effectiveTo)}
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-green-600">No end date</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#3E3B6F] bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      <UserCheck size={14} /> {shift.employeeCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${shift.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${shift.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                        {shift.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-medium text-gray-500">
                      {formatDate(shift.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button 
                        onClick={() => handleViewTemplate(shift)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Template"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditTemplate(shift)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Template"
                      >
                        <Edit2 size={16} />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveActionMenu(activeActionMenu === shift.id ? null : shift.id)}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                          title="More actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeActionMenu === shift.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => handleDuplicateTemplate(shift)}
                              className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Copy size={14} /> Duplicate Template
                            </button>
                            <button
                              onClick={() => {
                                alert('Version history would open here');
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <History size={14} /> Version History
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() => handleToggleStatus(shift.id)}
                              className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Power size={14} className={
                                shift.status === 'ACTIVE' ? 'text-red-400' : 'text-green-400'
                              } />
                              {shift.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(shift.id)}
                              disabled={(shift.employeeCount || 0) > 0}
                              className={`w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2 ${
                                (shift.employeeCount || 0) > 0
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={(shift.employeeCount || 0) > 0 ? 'Cannot delete template with assigned employees' : ''}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredShifts.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
              <Settings2 size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Templates Found</h3>
              <p className="text-sm font-medium mt-2">Adjust your search or create a new template.</p>
            </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 Active: {shifts.filter(s => s.status === 'ACTIVE').length}
               </span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-gray-400"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 Inactive: {shifts.filter(s => s.status === 'INACTIVE').length}
               </span>
             </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download size={14} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F]/5 text-[#3E3B6F] border border-[#3E3B6F]/10 rounded-xl text-xs font-bold hover:bg-[#3E3B6F]/10 transition-all">
              <BarChart3 size={14} /> Analytics
            </button>
          </div>
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <ShiftTemplateForm
          template={selectedShift || undefined}
          onSave={handleSaveTemplate}
          onClose={() => {
            if (window.confirm('Are you sure you want to discard your changes?')) {
              setShowForm(false);
              setSelectedShift(null);
            }
          }}
          mode={formMode}
        />
      )}
    </div>
  );
};