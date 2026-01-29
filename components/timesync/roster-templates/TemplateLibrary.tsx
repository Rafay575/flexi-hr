import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  FileText,
  Calendar,
  Users,
  Edit2,
  Copy,
  Archive,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { RosterTemplate, TemplateStatus, PatternType } from './types';

const SHIFT_CONFIGS = {
  M: { label: 'Morning', color: '#3B82F6', bgColor: 'bg-blue-500', textColor: 'text-white' },
  E: { label: 'Evening', color: '#22C55E', bgColor: 'bg-green-500', textColor: 'text-white' },
  N: { label: 'Night', color: '#8B5CF6', bgColor: 'bg-purple-600', textColor: 'text-white' },
  F: { label: 'Flexi', color: '#14B8A6', bgColor: 'bg-teal-500', textColor: 'text-white' },
  OFF: { label: 'Off', color: '#9CA3AF', bgColor: 'bg-gray-100', textColor: 'text-gray-400' },
};

const PATTERN_TYPE_COLORS = {
  FIXED: 'bg-blue-100 text-blue-700 border-blue-200',
  ROTATING: 'bg-purple-100 text-purple-700 border-purple-200',
  CUSTOM: 'bg-amber-100 text-amber-700 border-amber-200',
};

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-200',
  DRAFT: 'bg-orange-100 text-orange-700 border-orange-200',
  ARCHIVED: 'bg-gray-100 text-gray-700 border-gray-200',
};

// Mock data
const initialTemplates: RosterTemplate[] = [
  {
    id: 'TMP-1001',
    name: 'Factory 24/7 Rotation',
    description: '3-team rotation covering 24/7 operations with 8-hour shifts',
    patternType: 'ROTATING',
    patternTypeLabel: 'Rotating',
    cycleDays: 21,
    includedShifts: ['M', 'E', 'N'],
    activeTeamsCount: 8,
    status: 'ACTIVE',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: 'TMP-1002',
    name: 'Office Standard Week',
    description: 'Standard 5-day work week with flexible start times',
    patternType: 'FIXED',
    patternTypeLabel: 'Fixed',
    cycleDays: 7,
    includedShifts: ['M', 'F'],
    activeTeamsCount: 12,
    status: 'ACTIVE',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'TMP-1003',
    name: 'Healthcare Shift Pattern',
    description: '12-hour shifts for hospital staff with weekend rotation',
    patternType: 'ROTATING',
    patternTypeLabel: 'Rotating',
    cycleDays: 28,
    includedShifts: ['M', 'N'],
    activeTeamsCount: 5,
    status: 'ACTIVE',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    id: 'TMP-1004',
    name: 'Retail Weekend Coverage',
    description: 'Enhanced weekend staffing for retail operations',
    patternType: 'CUSTOM',
    patternTypeLabel: 'Custom',
    cycleDays: 14,
    includedShifts: ['M', 'E', 'F'],
    activeTeamsCount: 0,
    status: 'DRAFT',
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    id: 'TMP-1005',
    name: 'Warehouse Night Shift',
    description: 'Dedicated night shift for warehouse operations',
    patternType: 'FIXED',
    patternTypeLabel: 'Fixed',
    cycleDays: 7,
    includedShifts: ['N'],
    activeTeamsCount: 3,
    status: 'ARCHIVED',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'TMP-1006',
    name: 'Call Center Rotation',
    description: '4-team rotation for 24/7 call center coverage',
    patternType: 'ROTATING',
    patternTypeLabel: 'Rotating',
    cycleDays: 28,
    includedShifts: ['M', 'E', 'N', 'F'],
    activeTeamsCount: 6,
    status: 'ACTIVE',
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'TMP-1007',
    name: 'Tech Support Flexible',
    description: 'Flexible hours with on-call weekend support',
    patternType: 'CUSTOM',
    patternTypeLabel: 'Custom',
    cycleDays: 14,
    includedShifts: ['F'],
    activeTeamsCount: 2,
    status: 'DRAFT',
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
  },
  {
    id: 'TMP-1008',
    name: 'Weekend Only Schedule',
    description: 'Special weekend shift pattern for part-time staff',
    patternType: 'FIXED',
    patternTypeLabel: 'Fixed',
    cycleDays: 7,
    includedShifts: ['M', 'E'],
    activeTeamsCount: 4,
    status: 'ACTIVE',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-16'),
  },
];

interface TemplateLibraryProps {
  onViewTemplate: (template: RosterTemplate) => void;
  onEditTemplate: (template: RosterTemplate) => void;
  onCreateTemplate: () => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onViewTemplate,
  onEditTemplate,
  onCreateTemplate,
}) => {
  const [templates, setTemplates] = useState<RosterTemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | 'ALL'>('ALL');
  const [patternTypeFilter, setPatternTypeFilter] = useState<PatternType | 'ALL'>('ALL');
  const [cycleDaysRange, setCycleDaysRange] = useState<[number, number]>([1, 84]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'ALL' || template.status === statusFilter;
      
      // Pattern type filter
      const matchesPatternType = patternTypeFilter === 'ALL' || template.patternType === patternTypeFilter;
      
      // Cycle days filter
      const matchesCycleDays = template.cycleDays >= cycleDaysRange[0] && template.cycleDays <= cycleDaysRange[1];
      
      return matchesSearch && matchesStatus && matchesPatternType && matchesCycleDays;
    });
  }, [templates, searchQuery, statusFilter, patternTypeFilter, cycleDaysRange]);

  const handleDuplicate = (template: RosterTemplate) => {
    const newTemplate: RosterTemplate = {
      ...template,
      id: `TMP-${Math.floor(Math.random() * 9000) + 1000}`,
      name: `${template.name} (Copy)`,
      status: 'DRAFT',
      activeTeamsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates(prev => [newTemplate, ...prev]);
    setActiveActionMenu(null);
  };

  const handleArchive = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, status: 'ARCHIVED' as TemplateStatus } : t
    ));
    setActiveActionMenu(null);
  };

  const handleDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.activeTeamsCount && template.activeTeamsCount > 0) {
      alert('Cannot delete template with active team assignments');
      return;
    }
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    setActiveActionMenu(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusIcon = (status: TemplateStatus) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle2 size={12} className="text-green-600" />;
      case 'DRAFT': return <FileText size={12} className="text-orange-600" />;
      case 'ARCHIVED': return <Archive size={12} className="text-gray-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Calendar className="text-[#3E3B6F]" size={28} /> Roster Templates
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">
            Reusable schedule blueprints for efficient roster planning
          </p>
        </div>
        <button
          onClick={onCreateTemplate}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Create Template
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              type="text"
              placeholder="Search templates by name, description, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                showFilters 
                  ? 'bg-[#3E3B6F] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* EXPANDED FILTERS */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status === 'ALL' ? 'ALL' : status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        (status === 'ALL' ? statusFilter === 'ALL' : statusFilter === status)
                          ? 'bg-[#3E3B6F] text-white'
                          : 'bg-white text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Pattern Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['ALL', 'FIXED', 'ROTATING', 'CUSTOM'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setPatternTypeFilter(type === 'ALL' ? 'ALL' : type)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        (type === 'ALL' ? patternTypeFilter === 'ALL' : patternTypeFilter === type)
                          ? 'bg-[#3E3B6F] text-white'
                          : 'bg-white text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Cycle Days: {cycleDaysRange[0]} - {cycleDaysRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="84"
                    value={cycleDaysRange[0]}
                    onChange={(e) => setCycleDaysRange([parseInt(e.target.value), cycleDaysRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="1"
                    max="84"
                    value={cycleDaysRange[1]}
                    onChange={(e) => setCycleDaysRange([cycleDaysRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TEMPLATES TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Template Name</th>
                <th className="px-6 py-5">Pattern Type</th>
                <th className="px-6 py-5">Cycle & Shifts</th>
                <th className="px-6 py-5 text-center">Active Teams</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredTemplates.map(template => (
                <tr 
                  key={template.id} 
                  className="hover:bg-gray-50/80 transition-all cursor-default group"
                  onClick={() => onViewTemplate(template)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{template.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-1 max-w-xs">{template.description}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                          {template.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${PATTERN_TYPE_COLORS[template.patternType]}`}
                    >
                      {template.patternTypeLabel}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-800">{template.cycleDays} days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {template.includedShifts.map(shift => (
                          <div
                            key={shift}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border shadow-sm ${
                              SHIFT_CONFIGS[shift].bgColor
                            } ${SHIFT_CONFIGS[shift].textColor}`}
                            title={SHIFT_CONFIGS[shift].label}
                          >
                            {shift}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-sm font-black text-gray-800">{template.activeTeamsCount}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(template.status)}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        STATUS_COLORS[template.status].split(' ')[1]
                      }`}>
                        {template.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-gray-800">{formatDate(template.updatedAt)}</p>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTemplate(template);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenu(activeActionMenu === template.id ? null : template.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                          title="More actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeActionMenu === template.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(template);
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Copy size={14} /> Duplicate Template
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchive(template.id);
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Archive size={14} /> Archive
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(template.id);
                              }}
                              disabled={template.activeTeamsCount > 0}
                              className={`w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2 ${
                                template.activeTeamsCount > 0
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={template.activeTeamsCount > 0 ? 'Cannot delete template with active assignments' : ''}
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

          {filteredTemplates.length === 0 && (
            <div className="p-20 text-center opacity-30 flex flex-col items-center">
              <FileText size={64} className="text-gray-300 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest text-gray-500">
                No templates found
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {searchQuery || statusFilter !== 'ALL' || patternTypeFilter !== 'ALL' 
                  ? 'Try adjusting your filters' 
                  : 'Create your first template to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Total Templates
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{templates.length}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Active Templates
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">
              {templates.filter(t => t.status === 'ACTIVE').length}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Active Teams
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">
              {templates.reduce((sum, t) => sum + t.activeTeamsCount, 0)}
            </span>
          </div>
        </div>
        <div className="bg-primary-gradient p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
            Coverage Types
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">
              {new Set(templates.map(t => t.patternType)).size}
            </span>
            <span className="text-xs font-bold text-white/50">Patterns</span>
          </div>
        </div>
      </div>
    </div>
  );
};