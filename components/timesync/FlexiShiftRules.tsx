import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Settings2, 
  Clock, 
  Users, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  X,
  Layers,
  ArrowRight,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Hash,
  Check,
  Search,
  Filter,
  Download,
  RefreshCw,
  Moon,
  Sun,
  CalendarDays,
  Clock3,
  Target,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FlexiRule {
  id: string;
  code: string;
  name: string;
  description?: string;
  startWindow: string;
  endWindow: string;
  requiredDailyHours: number;
  requiredWeeklyHours: number;
  hasCoreHours: boolean;
  coreStart?: string;
  coreEnd?: string;
  breakDeduction: 'FIXED_60' | 'FIXED_45' | 'FIXED_30' | 'ENFORCED_PUNCH' | 'NONE';
  shortfallHandling: 'MARK_SHORT_DAY' | 'CARRY_FORWARD' | 'LEAVE_DEDUCTION' | 'MARK_ABSENT';
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  effectiveFrom?: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  location?: string;
  maxConsecutiveShortDays?: number;
  allowWeekendWork: boolean;
  weekendHoursCap?: number;
  gracePeriod?: number;
  overtimeMultiplier?: number;
}

type ViewMode = 'LIST' | 'GRID';

const SHORTFALL_OPTIONS = [
  { value: 'MARK_SHORT_DAY', label: 'Mark as Short Day', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { value: 'CARRY_FORWARD', label: 'Carry Forward', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'LEAVE_DEDUCTION', label: 'Deduct from Leave', color: 'bg-red-50 text-red-600 border-red-100' },
  { value: 'MARK_ABSENT', label: 'Mark as Absent', color: 'bg-gray-50 text-gray-600 border-gray-100' },
];

const BREAK_OPTIONS = [
  { value: 'FIXED_60', label: 'Fixed 60m Auto-deduct', duration: 60 },
  { value: 'FIXED_45', label: 'Fixed 45m Auto-deduct', duration: 45 },
  { value: 'FIXED_30', label: 'Fixed 30m Auto-deduct', duration: 30 },
  { value: 'ENFORCED_PUNCH', label: 'Enforced Punch Break', duration: null },
  { value: 'NONE', label: 'No Auto-deduction', duration: 0 },
];

// Mock data
const MOCK_RULES: FlexiRule[] = [
  { 
    id: 'FR-001', 
    code: 'STD-FLEXI', 
    name: 'Standard Flexi', 
    description: 'Standard flexible working hours for office employees',
    startWindow: '07:00', 
    endWindow: '21:00', 
    requiredDailyHours: 8, 
    requiredWeeklyHours: 40,
    hasCoreHours: true,
    coreStart: '10:00',
    coreEnd: '16:00',
    breakDeduction: 'FIXED_60',
    shortfallHandling: 'MARK_SHORT_DAY',
    employeeCount: 142, 
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'Engineering, Product',
    location: 'HQ Main, Remote',
    maxConsecutiveShortDays: 2,
    allowWeekendWork: true,
    weekendHoursCap: 4,
    gracePeriod: 15,
    overtimeMultiplier: 1.5,
  },
  { 
    id: 'FR-002', 
    code: 'FIELD-FLEXI', 
    name: 'Field Flexi', 
    description: 'Flexible hours for field staff with no core hours requirement',
    startWindow: '06:00', 
    endWindow: '22:00', 
    requiredDailyHours: 8, 
    requiredWeeklyHours: 40,
    hasCoreHours: false,
    breakDeduction: 'NONE',
    shortfallHandling: 'CARRY_FORWARD',
    employeeCount: 28, 
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'Operations, Sales',
    location: 'Field, Remote',
    maxConsecutiveShortDays: 3,
    allowWeekendWork: true,
    weekendHoursCap: 8,
    gracePeriod: 30,
    overtimeMultiplier: 1.5,
  },
  { 
    id: 'FR-003', 
    code: 'PT-FLEXI', 
    name: 'Part-time Flexi', 
    description: 'Part-time flexible working arrangement',
    startWindow: '09:00', 
    endWindow: '18:00', 
    requiredDailyHours: 4, 
    requiredWeeklyHours: 20,
    hasCoreHours: false,
    breakDeduction: 'FIXED_30',
    shortfallHandling: 'MARK_SHORT_DAY',
    employeeCount: 12, 
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'Support, Marketing',
    location: 'HQ Main',
    maxConsecutiveShortDays: 1,
    allowWeekendWork: false,
    gracePeriod: 15,
    overtimeMultiplier: 1.0,
  },
  { 
    id: 'FR-004', 
    code: 'WKLY-FLEXI', 
    name: 'Weekly Target Flexi', 
    description: 'Weekly hours target with flexible daily distribution',
    startWindow: '07:00', 
    endWindow: '23:00', 
    requiredDailyHours: 0, 
    requiredWeeklyHours: 40,
    hasCoreHours: true,
    coreStart: '11:00',
    coreEnd: '15:00',
    breakDeduction: 'ENFORCED_PUNCH',
    shortfallHandling: 'LEAVE_DEDUCTION',
    employeeCount: 5, 
    status: 'INACTIVE',
    effectiveFrom: '2024-11-01',
    effectiveTo: '2024-12-31',
    createdBy: 'Admin User',
    createdAt: '2024-10-15T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'All',
    location: 'All',
    maxConsecutiveShortDays: 2,
    allowWeekendWork: true,
    weekendHoursCap: 12,
    gracePeriod: 15,
    overtimeMultiplier: 2.0,
  },
  { 
    id: 'FR-005', 
    code: 'CREATIVE-FLEX', 
    name: 'Creative Flex', 
    description: 'Creative team flexible hours with core collaboration time',
    startWindow: '08:00', 
    endWindow: '20:00', 
    requiredDailyHours: 8, 
    requiredWeeklyHours: 40,
    hasCoreHours: true,
    coreStart: '12:00',
    coreEnd: '16:00',
    breakDeduction: 'FIXED_45',
    shortfallHandling: 'CARRY_FORWARD',
    employeeCount: 18, 
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'Design, Marketing',
    location: 'HQ Main, Remote',
    maxConsecutiveShortDays: 2,
    allowWeekendWork: true,
    weekendHoursCap: 6,
    gracePeriod: 20,
    overtimeMultiplier: 1.5,
  },
  { 
    id: 'FR-006', 
    code: 'NIGHT-FLEXI', 
    name: 'Night Flexi', 
    description: 'Flexible night shift options for operations team',
    startWindow: '20:00', 
    endWindow: '08:00', 
    requiredDailyHours: 8, 
    requiredWeeklyHours: 40,
    hasCoreHours: false,
    breakDeduction: 'FIXED_60',
    shortfallHandling: 'MARK_SHORT_DAY',
    employeeCount: 7, 
    status: 'DRAFT',
    effectiveFrom: '',
    createdBy: 'Admin User',
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z',
    department: 'Operations',
    location: 'Data Center',
    maxConsecutiveShortDays: 3,
    allowWeekendWork: true,
    weekendHoursCap: 10,
    gracePeriod: 30,
    overtimeMultiplier: 2.0,
  },
  { 
    id: 'FR-007', 
    code: 'INT-FLEXI', 
    name: 'Intern Flexi', 
    description: 'Flexible hours for interns and trainees',
    startWindow: '09:00', 
    endWindow: '18:00', 
    requiredDailyHours: 6, 
    requiredWeeklyHours: 30,
    hasCoreHours: false,
    breakDeduction: 'FIXED_45',
    shortfallHandling: 'MARK_SHORT_DAY',
    employeeCount: 0, 
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'All',
    location: 'HQ Main',
    maxConsecutiveShortDays: 1,
    allowWeekendWork: false,
    gracePeriod: 15,
    overtimeMultiplier: 1.0,
  },
];

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Operations', 'Sales', 'Marketing', 'Support', 'HR', 'Finance', 'All'];
const LOCATIONS = ['HQ Main', 'West Branch', 'East Campus', 'Data Center', 'Remote', 'Field', 'Warehouse', 'Factory', 'All'];

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
  INACTIVE: { label: 'Inactive', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  DRAFT: { label: 'Draft', color: 'bg-blue-50 text-blue-600 border-blue-100' },
};

interface FlexiRuleFormProps {
  rule?: FlexiRule;
  onSave: (rule: Omit<FlexiRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const FlexiRuleForm: React.FC<FlexiRuleFormProps> = ({
  rule,
  onSave,
  onClose,
  mode,
}) => {
  // Basic Info
  const [code, setCode] = useState(rule?.code || '');
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>(rule?.status || 'DRAFT');
  
  // Timing
  const [startWindow, setStartWindow] = useState(rule?.startWindow || '09:00');
  const [endWindow, setEndWindow] = useState(rule?.endWindow || '18:00');
  const [requiredDailyHours, setRequiredDailyHours] = useState(rule?.requiredDailyHours || 8);
  const [requiredWeeklyHours, setRequiredWeeklyHours] = useState(rule?.requiredWeeklyHours || 40);
  
  // Core Hours
  const [hasCoreHours, setHasCoreHours] = useState(rule?.hasCoreHours || false);
  const [coreStart, setCoreStart] = useState(rule?.coreStart || '11:00');
  const [coreEnd, setCoreEnd] = useState(rule?.coreEnd || '15:00');
  
  // Settings
  const [breakDeduction, setBreakDeduction] = useState(rule?.breakDeduction || 'FIXED_60');
  const [shortfallHandling, setShortfallHandling] = useState(rule?.shortfallHandling || 'MARK_SHORT_DAY');
  
  // Additional Settings
  const [maxConsecutiveShortDays, setMaxConsecutiveShortDays] = useState(rule?.maxConsecutiveShortDays || 2);
  const [allowWeekendWork, setAllowWeekendWork] = useState(rule?.allowWeekendWork || false);
  const [weekendHoursCap, setWeekendHoursCap] = useState(rule?.weekendHoursCap || 4);
  const [gracePeriod, setGracePeriod] = useState(rule?.gracePeriod || 15);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(rule?.overtimeMultiplier || 1.5);
  
  // Meta
  const [department, setDepartment] = useState(rule?.department || '');
  const [location, setLocation] = useState(rule?.location || '');
  const [effectiveFrom, setEffectiveFrom] = useState(rule?.effectiveFrom || '');
  const [effectiveTo, setEffectiveTo] = useState(rule?.effectiveTo || '');

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculateWindowHours = () => {
    const [startHour, startMin] = startWindow.split(':').map(Number);
    const [endHour, endMin] = endWindow.split(':').map(Number);
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    return (totalMinutes / 60).toFixed(1);
  };

  const getBreakDuration = () => {
    const option = BREAK_OPTIONS.find(opt => opt.value === breakDeduction);
    return option?.duration || 0;
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Code and Name are required');
      return;
    }

    if (!startWindow || !endWindow) {
      alert('Start and End windows are required');
      return;
    }

    const ruleData: Omit<FlexiRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      status,
      startWindow,
      endWindow,
      requiredDailyHours,
      requiredWeeklyHours,
      hasCoreHours,
      coreStart: hasCoreHours ? coreStart : undefined,
      coreEnd: hasCoreHours ? coreEnd : undefined,
      breakDeduction,
      shortfallHandling,
      employeeCount: rule?.employeeCount || 0,
      maxConsecutiveShortDays: maxConsecutiveShortDays > 0 ? maxConsecutiveShortDays : undefined,
      allowWeekendWork,
      weekendHoursCap: allowWeekendWork ? weekendHoursCap : undefined,
      gracePeriod,
      overtimeMultiplier,
      department: department || undefined,
      location: location || undefined,
      effectiveFrom: effectiveFrom || undefined,
      effectiveTo: effectiveTo || undefined,
    };

    onSave(ruleData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create Flexi Rule' : 'Edit Flexi Rule'}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {mode === 'edit' ? `Editing: ${rule?.code}` : 'Define new flexible working rule'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
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
                    Rule Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="STD-FLEXI, FIELD-FLEXI"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                      maxLength={10}
                    />
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400">Unique identifier</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Standard Flexi, Field Flexi"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE' | 'DRAFT')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
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
                  placeholder="Describe the flexi rule, target audience, and any special considerations..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  maxLength={200}
                />
              </div>
            </div>

            {/* SECTION B: TIMING WINDOWS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} /> Timing Windows
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Clock3 size={14} />
                  <span>{calculateWindowHours()}h total window</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Start Window <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={startWindow}
                      onChange={(e) => setStartWindow(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {formatTime(startWindow)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">Earliest possible check-in</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    End Window <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={endWindow}
                      onChange={(e) => setEndWindow(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {formatTime(endWindow)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">Latest possible check-out</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Required Daily Hours
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={requiredDailyHours}
                      onChange={(e) => setRequiredDailyHours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">h</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Set to 0 for weekly-only target</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Required Weekly Hours
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      value={requiredWeeklyHours}
                      onChange={(e) => setRequiredWeeklyHours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">h</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Weekly target hours</p>
                </div>
              </div>
            </div>

            {/* SECTION C: CORE HOURS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Target size={16} /> Core Hours
                </h4>
                <button
                  type="button"
                  onClick={() => setHasCoreHours(!hasCoreHours)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    hasCoreHours
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {hasCoreHours ? (
                    <>
                      <Check size={14} /> Core Hours Enabled
                    </>
                  ) : (
                    <>
                      <X size={14} /> No Core Hours
                    </>
                  )}
                </button>
              </div>
              
              {hasCoreHours && (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        Core Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={coreStart}
                          onChange={(e) => setCoreStart(e.target.value)}
                          className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-500">
                          {formatTime(coreStart)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        Core End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={coreEnd}
                          onChange={(e) => setCoreEnd(e.target.value)}
                          className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-500">
                          {formatTime(coreEnd)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-500/70 mt-3">
                    Employees must be present during this mandatory collaboration period
                  </p>
                </div>
              )}
            </div>

            {/* SECTION D: RULES & POLICIES */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} /> Rules & Policies
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Break Deduction
                  </label>
                  <div className="space-y-3">
                    {BREAK_OPTIONS.map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          breakDeduction === option.value
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="breakDeduction"
                          value={option.value}
                          checked={breakDeduction === option.value}
                          onChange={(e) => setBreakDeduction(e.target.value as any)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{option.label}</p>
                          {option.duration !== null && (
                            <p className="text-[10px] text-gray-500">{option.duration} minutes auto-deducted</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Shortfall Handling
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SHORTFALL_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setShortfallHandling(option.value as any)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          shortfallHandling === option.value
                            ? `${option.color} border-2`
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    How to handle hours worked below daily requirement
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION E: ADVANCED SETTINGS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={16} /> Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Max Consecutive Short Days
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={maxConsecutiveShortDays}
                      onChange={(e) => setMaxConsecutiveShortDays(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Maximum allowed back-to-back short days</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Grace Period
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">min</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Grace period for check-in/check-out</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Overtime Multiplier
                  </label>
                  <div className="relative">
                    <select
                      value={overtimeMultiplier}
                      onChange={(e) => setOvertimeMultiplier(parseFloat(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    >
                      <option value="1.0">1.0x (Regular)</option>
                      <option value="1.5">1.5x (Standard OT)</option>
                      <option value="2.0">2.0x (Double OT)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-gray-500">Overtime pay rate multiplier</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Allow Weekend Work
                  </label>
                  <button
                    type="button"
                    onClick={() => setAllowWeekendWork(!allowWeekendWork)}
                    className={`w-full py-3 rounded-xl border text-sm font-bold transition-all ${
                      allowWeekendWork
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {allowWeekendWork ? '✅ Allowed' : '❌ Not Allowed'}
                  </button>
                </div>

                {allowWeekendWork && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Weekend Hours Cap
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={weekendHoursCap}
                        onChange={(e) => setWeekendHoursCap(parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Maximum hours per weekend day</p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION F: META INFORMATION */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Meta Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Department (Optional)
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Location (Optional)
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    <option value="">All Locations</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Effective From (Optional)
                  </label>
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Effective To (Optional)
                  </label>
                  <input
                    type="date"
                    value={effectiveTo}
                    onChange={(e) => setEffectiveTo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!code.trim() || !name.trim() || !startWindow || !endWindow}
            className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> {mode === 'create' ? 'Create Flexi Rule' : 'Update Flexi Rule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const FlexiShiftRules: React.FC = () => {
  const [rules, setRules] = useState<FlexiRule[]>(MOCK_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRule, setSelectedRule] = useState<FlexiRule | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ALL');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [shortfallHandling, setShortfallHandling] = useState('MARK_SHORT_DAY');

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = 
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || rule.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rules, searchQuery, filterStatus]);

  const handleCreateRule = () => {
    setSelectedRule(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditRule = (rule: FlexiRule) => {
    setSelectedRule(rule);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewRule = (rule: FlexiRule) => {
    setSelectedRule(rule);
    setIsViewModalOpen(true);
  };

  const handleDuplicateRule = (rule: FlexiRule) => {
    const newRule: FlexiRule = {
      ...rule,
      id: `FR-${Math.floor(Math.random() * 900) + 100}`,
      code: `${rule.code}-COPY`,
      name: `${rule.name} (Copy)`,
      employeeCount: 0,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRules(prev => [newRule, ...prev]);
    setActiveActionMenu(null);
  };

  const handleToggleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { 
            ...rule, 
            status: rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            updatedAt: new Date().toISOString()
          }
        : rule
    ));
    setActiveActionMenu(null);
  };

  const handleDeleteRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule?.employeeCount && rule.employeeCount > 0) {
      alert('Cannot delete flexi rule with assigned employees');
      return;
    }
    if (window.confirm('Are you sure you want to delete this flexi rule?')) {
      setRules(prev => prev.filter(r => r.id !== ruleId));
    }
    setActiveActionMenu(null);
  };

  const handleSaveRule = (ruleData: Omit<FlexiRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (modalMode === 'edit' && selectedRule) {
      setRules(prev => prev.map(rule => 
        rule.id === selectedRule.id 
          ? { 
              ...ruleData, 
              id: selectedRule.id, 
              employeeCount: selectedRule.employeeCount,
              createdBy: selectedRule.createdBy,
              createdAt: selectedRule.createdAt, 
              updatedAt: new Date().toISOString() 
            }
          : rule
      ));
    } else {
      const newRule: FlexiRule = {
        ...ruleData,
        id: `FR-${Math.floor(Math.random() * 900) + 100}`,
        employeeCount: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRules(prev => [newRule, ...prev]);
    }
    
    setIsModalOpen(false);
    setSelectedRule(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getBreakLabel = (value: string) => {
    const option = BREAK_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getShortfallLabel = (value: string) => {
    const option = SHORTFALL_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Zap className="text-[#3E3B6F]" size={28} /> Flexi Shift Configuration
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Define autonomous work windows with core collaboration hours</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <FileText size={14} /> List
            </button>
            <button 
              onClick={() => setViewMode('GRID')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <Layers size={14} /> Grid
            </button>
          </div>
          <button 
            onClick={handleCreateRule}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Flexi Rule
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Rules</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{rules.length}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Rules</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">
              {rules.filter(r => r.status === 'ACTIVE').length}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Covered Employees</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">
              {rules.reduce((sum, r) => sum + r.employeeCount, 0)}
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Most Used</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">
              {rules.reduce((max, r) => r.employeeCount > max.employeeCount ? r : max, rules[0])?.code || 'N/A'}
            </span>
            <span className="text-xs font-bold text-white/50">Rule</span>
          </div>
        </div>
      </div>

      {/* GLOBAL FLEXI SETTINGS CARD */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-100 flex-1 space-y-6 bg-gray-50/30">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={18} className="text-[#3E3B6F]" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Constraints</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase">Master Window</label>
               <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Earliest In</p>
                    <input type="time" defaultValue="07:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
                  <ArrowRight size={14} className="text-gray-300 mt-4" />
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Latest Out</p>
                    <input type="time" defaultValue="21:00" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
               </div>
               <p className="text-[10px] text-gray-400 italic">"Employees can work their required hours anytime within this 14h window."</p>
            </div>

            <div className="space-y-4 ml-3">
               <label className="text-[10px] font-black text-gray-500 uppercase">Hour Requirements</label>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Daily Min</p>
                    <div className="relative">
                      <input type="number" defaultValue="8" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm font-black text-[#3E3B6F]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">HRS</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Weekly Target</p>
                    <div className="relative">
                      <input type="number" defaultValue="40" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm font-black text-[#3E3B6F]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">HRS</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 size={18} className="text-orange-500" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Logic & Shortfall</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase">Shortfall Handling</label>
               <select 
                 value={shortfallHandling}
                 onChange={(e) => setShortfallHandling(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#3E3B6F] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
               >
                 <option>Mark as Short Day</option>
                 <option>Carry forward to next day</option>
                 <option>Deduct from leave balance</option>
                 <option>Mark as Absent</option>
               </select>
               <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
                 <AlertCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                   Current policy: Shortfall of {'>'} 2h triggers automatic Leave Deduction if balance exists.
                 </p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-gray-500 uppercase">Enable Core Hours</label>
                 <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                   <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                 </div>
               </div>
               <div className="flex items-center gap-4 opacity-100 transition-opacity">
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Core Start</p>
                    <input type="time" defaultValue="10:00" className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Core End</p>
                    <input type="time" defaultValue="16:00" className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-sm font-black text-[#3E3B6F]" />
                  </div>
               </div>
               <p className="text-[10px] text-gray-400 italic">"Employees must be present for meetings/collab during this block."</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search rule name, code, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DRAFT">Draft</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Download size={14} /> Export
        </button>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
          <Filter size={18}/>
        </button>
      </div>

      {viewMode === 'LIST' ? (
        /* LIST VIEW */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> Flexi Rules List
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                Showing: {filteredRules.length} of {rules.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 border-b border-gray-100">
                  <th className="px-8 py-4">Rule Details</th>
                  <th className="px-6 py-4">Timing Window</th>
                  <th className="px-6 py-4">Requirements</th>
                  <th className="px-6 py-4">Core Hours</th>
                  <th className="px-6 py-4 text-center">Employees</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-center text-xs font-black text-orange-600">
                            {rule.code.substring(0, 3)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">REF: {rule.code}</p>
                          </div>
                        </div>
                        {rule.description && (
                          <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{rule.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Clock size={14} className="text-blue-500" />
                          {formatTime(rule.startWindow)} - {formatTime(rule.endWindow)}
                        </div>
                        <div className="flex gap-2">
                          {rule.allowWeekendWork && (
                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                              Weekend Work
                            </span>
                          )}
                          {rule.gracePeriod && rule.gracePeriod > 0 && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              {rule.gracePeriod}m Grace
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#3E3B6F] bg-indigo-50 px-2 py-1 rounded-lg w-fit">
                            {rule.requiredDailyHours > 0 ? `${rule.requiredDailyHours}h Daily` : 'Weekly Target'}
                          </span>
                          <span className="text-[10px] text-gray-500 mt-1">{rule.requiredWeeklyHours}h Weekly</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Break: {getBreakLabel(rule.breakDeduction)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {rule.hasCoreHours && rule.coreStart && rule.coreEnd ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                            <Target size={14} />
                            {formatTime(rule.coreStart)} - {formatTime(rule.coreEnd)}
                          </div>
                          <p className="text-[10px] text-orange-500">Mandatory Presence</p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Open Schedule</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
                        <Users size={14} className="opacity-40" /> {rule.employeeCount}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[rule.status].color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          rule.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' :
                          rule.status === 'INACTIVE' ? 'bg-gray-400' : 'bg-blue-500'
                        }`} />
                        {STATUS_CONFIG[rule.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleViewRule(rule)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditRule(rule)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit Rule"
                        >
                          <Edit2 size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveActionMenu(activeActionMenu === rule.id ? null : rule.id)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeActionMenu === rule.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                              <button
                                onClick={() => handleDuplicateRule(rule)}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <FileText size={14} /> Duplicate Rule
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => handleToggleStatus(rule.id)}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-gray-50 flex items-center gap-2"
                              >
                                {rule.status === 'ACTIVE' ? (
                                  <>
                                    <AlertTriangle size={14} className="text-red-400" /> Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={14} className="text-green-400" /> Activate
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteRule(rule.id)}
                                disabled={rule.employeeCount > 0}
                                className={`w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2 ${
                                  rule.employeeCount > 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={rule.employeeCount > 0 ? 'Cannot delete rule with assigned employees' : ''}
                              >
                                <Trash2 size={14} /> Delete Rule
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
            {filteredRules.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
                <Zap size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Flexi Rules Found</h3>
                <p className="text-sm font-medium mt-2">Adjust your search or create a new rule.</p>
              </div>
            )}
          </div>
          
          {/* TABLE FOOTER */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Active: {rules.filter(r => r.status === 'ACTIVE').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  With Core Hours: {rules.filter(r => r.hasCoreHours).length}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                <RefreshCw size={14} /> Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F]/5 text-[#3E3B6F] border border-[#3E3B6F]/10 rounded-xl text-xs font-bold hover:bg-[#3E3B6F]/10 transition-all">
                <BarChart3 size={14} /> Analytics
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRules.map(rule => (
            <div key={rule.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F] group-hover:scale-110 transition-transform">
                <Zap size={80} />
              </div>
              <div className="flex flex-col h-full relative z-10">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-center text-lg font-black text-orange-600">
                          {rule.code.substring(0, 3)}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-gray-800">{rule.name}</h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{rule.code}</p>
                        </div>
                      </div>
                      {rule.description && (
                        <p className="text-[10px] text-gray-500 line-clamp-2">{rule.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold ${STATUS_CONFIG[rule.status].color}`}>
                      {STATUS_CONFIG[rule.status].label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-black text-[#3E3B6F]">{rule.requiredDailyHours}h</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Daily</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-indigo-600">{rule.requiredWeeklyHours}h</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Weekly</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Clock size={14} className="text-blue-500" />
                      <span>{formatTime(rule.startWindow)} - {formatTime(rule.endWindow)}</span>
                    </div>
                    
                    {rule.hasCoreHours && rule.coreStart && rule.coreEnd && (
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                        <Target size={14} />
                        <span>Core: {formatTime(rule.coreStart)}-{formatTime(rule.coreEnd)}</span>
                      </div>
                    )}
                    
                    <div className="text-[10px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={10} />
                        <span>Shortfall: {getShortfallLabel(rule.shortfallHandling)}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock3 size={10} />
                        <span>Break: {getBreakLabel(rule.breakDeduction)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={12} />
                        <span>{rule.employeeCount} employees</span>
                      </div>
                      {rule.effectiveFrom && (
                        <div className="text-[10px] text-gray-400">
                          From {formatDate(rule.effectiveFrom)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewRule(rule)}
                      className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleEditRule(rule)}
                      className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:scale-105 transition-all"
                      title="Edit Rule"
                    >
                      <Edit2 size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedRule && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedRule.name}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {selectedRule.code} • {STATUS_CONFIG[selectedRule.status].label}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              {/* Rule Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Rule Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold text-gray-600">Code</span>
                        <span className="text-sm font-black text-[#3E3B6F]">{selectedRule.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_CONFIG[selectedRule.status].color}`}>
                          {STATUS_CONFIG[selectedRule.status].label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold text-gray-600">Assigned Employees</span>
                        <span className="text-sm font-black text-indigo-600">{selectedRule.employeeCount}</span>
                      </div>
                      {selectedRule.description && (
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <p className="text-xs font-bold text-blue-800">Description</p>
                          <p className="text-sm text-gray-700 mt-1">{selectedRule.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Hour Requirements</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl text-center">
                        <p className="text-2xl font-black text-blue-600">{selectedRule.requiredDailyHours}h</p>
                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Daily Target</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl text-center">
                        <p className="text-2xl font-black text-purple-600">{selectedRule.requiredWeeklyHours}h</p>
                        <p className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">Weekly Target</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Timing Windows</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-orange-700">Work Window</span>
                          <span className="text-sm font-black text-orange-800">
                            {formatTime(selectedRule.startWindow)} - {formatTime(selectedRule.endWindow)}
                          </span>
                        </div>
                        <p className="text-[10px] text-orange-600">Employees can work within this timeframe</p>
                      </div>
                      
                      {selectedRule.hasCoreHours && selectedRule.coreStart && selectedRule.coreEnd && (
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-indigo-700">Core Hours</span>
                            <span className="text-sm font-black text-indigo-800">
                              {formatTime(selectedRule.coreStart)} - {formatTime(selectedRule.coreEnd)}
                            </span>
                          </div>
                          <p className="text-[10px] text-indigo-600">Mandatory presence required</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Policies</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold text-gray-600">Break Deduction</span>
                        <span className="text-sm font-bold text-gray-800">{getBreakLabel(selectedRule.breakDeduction)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold text-gray-600">Shortfall Handling</span>
                        <span className="text-sm font-bold text-gray-800">{getShortfallLabel(selectedRule.shortfallHandling)}</span>
                      </div>
                      {selectedRule.gracePeriod && selectedRule.gracePeriod > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <span className="text-xs font-bold text-gray-600">Grace Period</span>
                          <span className="text-sm font-bold text-gray-800">{selectedRule.gracePeriod} minutes</span>
                        </div>
                      )}
                      {selectedRule.maxConsecutiveShortDays && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <span className="text-xs font-bold text-gray-600">Max Short Days</span>
                          <span className="text-sm font-bold text-gray-800">{selectedRule.maxConsecutiveShortDays} consecutive</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Meta Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Department</p>
                    <p className="text-sm font-bold text-gray-800">{selectedRule.department || 'All Departments'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
                    <p className="text-sm font-bold text-gray-800">{selectedRule.location || 'All Locations'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Effective Period</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedRule.effectiveFrom ? formatDate(selectedRule.effectiveFrom) : 'Immediate'}
                      {selectedRule.effectiveTo && ` - ${formatDate(selectedRule.effectiveTo)}`}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Created: {formatDate(selectedRule.createdAt)} by {selectedRule.createdBy}</span>
                    <span>Updated: {formatDate(selectedRule.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:shadow-lg transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditRule(selectedRule);
                }}
                className="flex-[2] py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={16} /> Edit Flexi Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <FlexiRuleForm
          rule={selectedRule || undefined}
          onSave={handleSaveRule}
          onClose={() => {
            if (window.confirm('Are you sure you want to discard your changes?')) {
              setIsModalOpen(false);
              setSelectedRule(null);
            }
          }}
          mode={modalMode}
        />
      )}
    </div>
  );
};