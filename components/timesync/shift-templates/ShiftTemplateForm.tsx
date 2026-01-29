import React, { useState } from 'react';
import {
  X,
  Save,
  Clock,
  Coffee,
  Users,
  Calendar,
  Sun,
  Moon,
  Zap,
  LayoutGrid,
  Settings2,
  AlertCircle,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Briefcase,
  MapPin,
  CalendarDays,
  Hash,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  ShiftTemplate,
  ShiftType,
  DayOfWeek,
  GracePeriod,
  BreakConfig,
  OvertimeConfig,
  ShiftTypeConfig,
  DayConfig,
  ShiftStatus
} from './types';

const SHIFT_TYPE_CONFIGS: Record<ShiftType, ShiftTypeConfig> = {
  FIXED: {
    type: 'FIXED',
    label: 'Fixed Shift',
    description: 'Same timing every working day',
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: <Sun size={16} />
  },
  FLEXI: {
    type: 'FLEXI',
    label: 'Flexi Shift',
    description: 'Flexible timing within a window',
    color: '#22C55E',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: <Zap size={16} />
  },
  ROTATING: {
    type: 'ROTATING',
    label: 'Rotating Shift',
    description: 'Rotates between different timings',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: <LayoutGrid size={16} />
  },
  SPLIT: {
    type: 'SPLIT',
    label: 'Split Shift',
    description: 'Split into multiple work periods',
    color: '#F97316',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: <Settings2 size={16} />
  },
  RAMZAN: {
    type: 'RAMZAN',
    label: 'Ramzan Shift',
    description: 'Special timing for Ramadan',
    color: '#EAB308',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    icon: <Moon size={16} />
  },
};

const DEPARTMENTS = [
  'Engineering', 'Operations', 'Sales', 'Marketing', 
  'HR', 'Finance', 'Support', 'IT', 'Production', 'Quality'
];

const LOCATIONS = [
  'HQ Main', 'West Branch', 'East Campus', 'Data Center', 
  'Remote', 'Factory A', 'Factory B', 'Warehouse'
];

interface ShiftTemplateFormProps {
  template?: ShiftTemplate;
  onSave: (template: Omit<ShiftTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const ShiftTemplateForm: React.FC<ShiftTemplateFormProps> = ({
  template,
  onSave,
  onClose,
  mode,
}) => {
  // Basic Info
  const [code, setCode] = useState(template?.code || '');
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [shiftType, setShiftType] = useState<ShiftType>(template?.type || 'FIXED');
  const [status, setStatus] = useState<ShiftStatus>(template?.status || 'ACTIVE');
  
  // Meta
  const [department, setDepartment] = useState(template?.department || '');
  const [location, setLocation] = useState(template?.location || '');
  const [effectiveFrom, setEffectiveFrom] = useState(template?.effectiveFrom || '');
  const [effectiveTo, setEffectiveTo] = useState(template?.effectiveTo || '');

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Code and Name are required');
      return;
    }

    const templateData: Omit<ShiftTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      type: shiftType,
      status,
      employeeCount: template?.employeeCount || 0,
      department: department || undefined,
      location: location || undefined,
      effectiveFrom: effectiveFrom || undefined,
      effectiveTo: effectiveTo || undefined,
      createdBy: 'Current User',
    };

    onSave(templateData);
  };

  const getShiftTypeConfig = (type: ShiftType) => SHIFT_TYPE_CONFIGS[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create Shift Template' : 'Edit Shift Template'}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <span className={`px-2 py-0.5 rounded-full ${
                  getShiftTypeConfig(shiftType).bgColor
                } ${getShiftTypeConfig(shiftType).textColor}`}>
                  {getShiftTypeConfig(shiftType).label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            {/* SECTION A: BASIC INFORMATION */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Hash size={16} /> Basic Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Shift Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="MORNING, NIGHT, FLEXI"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                      maxLength={10}
                    />
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400">Unique identifier for the shift</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Shift Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Morning Shift, Night Shift, Flexible Shift"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Shift Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as ShiftType)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    {Object.values(SHIFT_TYPE_CONFIGS).map(config => (
                      <option key={config.type} value={config.type}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the shift purpose, target department, or special instructions..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  maxLength={200}
                />
                <p className="text-[10px] text-gray-400 text-right">{description.length}/200</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Status
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStatus('ACTIVE')}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      status === 'ACTIVE'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg shadow-green-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Eye size={16} /> Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('INACTIVE')}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      status === 'INACTIVE'
                        ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-500'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <EyeOff size={16} /> Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION F: ADDITIONAL SETTINGS (Keeping only this from original) */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={16} /> Additional Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={14} /> Department
                  </label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none appearance-none"
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Location
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none appearance-none"
                    >
                      <option value="">Select Location</option>
                      {LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarDays size={14} /> Effective From
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={effectiveFrom}
                      onChange={(e) => setEffectiveFrom(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarDays size={14} /> Effective To
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={effectiveTo}
                      onChange={(e) => setEffectiveTo(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:shadow-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!code.trim() || !name.trim()}
            className="flex-[2] py-3.5 bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:shadow-2xl hover:shadow-[#3E3B6F]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} /> {mode === 'create' ? 'Create Shift Template' : 'Update Template'}
          </button>
        </div>
      </div>
    </div>
  );
};