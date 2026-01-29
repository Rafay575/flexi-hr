import React, { useState, useMemo } from 'react';
import { 
  Coffee, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  Hash,
  FileText,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Info,
  CalendarDays,
  Settings2,
  Target,
  Layers,
  Clock3,
  Bell,
  Lock,
  Unlock,
  CopyCheck,
  CalendarRange,
  TrendingUp,
  AlertOctagon,
  Timer,
  Coffee as CoffeeIcon,
  Cloud,
  Shield,
  BookOpen,
  PieChart,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';

type BreakType = 'Lunch' | 'Tea' | 'Prayer' | 'Custom' | 'Snack' | 'Rest';
type EnforcementType = 'MANUAL_PUNCH' | 'AUTO_DEDUCT' | 'FLEXIBLE' | 'ENFORCED';

interface BreakConfig {
  id: string;
  code: string;
  name: string;
  type: BreakType;
  description?: string;
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  timing: string;
  isPaid: boolean;
  fridayOverride: 'Same' | string;
  fridayStartTime?: string;
  fridayEndTime?: string;
  shiftCount: number;
  department?: string;
  location?: string;
  enforcement: EnforcementType;
  minWorkHoursBefore: number;
  maxWorkHoursAfter: number;
  allowSplit: boolean;
  splitMaxParts?: number;
  gracePeriod: number;
  autoExtend: boolean;
  autoExtendThreshold?: number;
  requiresManagerApproval: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  effectiveFrom?: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  complianceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  auditScore?: number;
  tags: string[];
  maxUsagePerDay?: number;
  weekendAllowed: boolean;
  holidayAllowed: boolean;
  overtimeAllowed: boolean;
}

type ViewMode = 'LIST' | 'GRID';

const BREAK_TYPES = [
  { value: 'Lunch', label: 'Lunch Break', icon: CoffeeIcon, color: 'bg-orange-500' },
  { value: 'Tea', label: 'Tea/Coffee Break', icon: Coffee, color: 'bg-amber-500' },
  { value: 'Prayer', label: 'Prayer Break', icon: Moon, color: 'bg-indigo-500' },
  { value: 'Snack', label: 'Snack Break', icon: Zap, color: 'bg-yellow-500' },
  { value: 'Rest', label: 'Rest Break', icon: Sun, color: 'bg-blue-500' },
  { value: 'Custom', label: 'Custom Break', icon: Clock, color: 'bg-purple-500' },
];

const ENFORCEMENT_OPTIONS = [
  { value: 'MANUAL_PUNCH', label: 'Manual Punch Required', description: 'Employees must clock in/out for break' },
  { value: 'AUTO_DEDUCT', label: 'Auto-deduct', description: 'Break automatically deducted from work hours' },
  { value: 'FLEXIBLE', label: 'Flexible Timing', description: 'Employees can take break within a window' },
  { value: 'ENFORCED', label: 'Enforced Break', description: 'System forces break after work threshold' },
];

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
  INACTIVE: { label: 'Inactive', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  DRAFT: { label: 'Draft', color: 'bg-blue-50 text-blue-600 border-blue-100' },
};

const COMPLIANCE_CONFIG = {
  HIGH: { label: 'High Compliance', color: 'bg-green-100 text-green-700 border-green-200' },
  MEDIUM: { label: 'Medium Compliance', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  LOW: { label: 'Low Compliance', color: 'bg-red-100 text-red-700 border-red-200' },
};

// Enhanced Mock Data
const ENHANCED_MOCK_BREAKS: BreakConfig[] = [
  { 
    id: 'BR-001', 
    code: 'LUNCH-STD',
    name: 'Standard Lunch', 
    type: 'Lunch', 
    description: 'Standard 60-minute lunch break for all employees',
    duration: 60, 
    startTime: '13:00',
    endTime: '14:00',
    timing: '1:00 PM - 2:00 PM', 
    isPaid: false, 
    fridayOverride: '12:30 PM - 2:30 PM',
    fridayStartTime: '12:30',
    fridayEndTime: '14:30',
    shiftCount: 156, 
    department: 'All',
    location: 'All',
    enforcement: 'MANUAL_PUNCH',
    minWorkHoursBefore: 3,
    maxWorkHoursAfter: 6,
    allowSplit: false,
    gracePeriod: 15,
    autoExtend: false,
    requiresManagerApproval: false,
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    complianceLevel: 'HIGH',
    auditScore: 95,
    tags: ['Mandatory', 'Meal', 'Compliant'],
    maxUsagePerDay: 1,
    weekendAllowed: true,
    holidayAllowed: true,
    overtimeAllowed: false,
  },
  { 
    id: 'BR-002', 
    code: 'TEA-MORN',
    name: 'Morning Tea', 
    type: 'Tea', 
    description: 'Short tea/coffee break for refreshment',
    duration: 15, 
    startTime: '11:00',
    endTime: '11:15',
    timing: '11:00 AM - 11:15 AM', 
    isPaid: true, 
    fridayOverride: 'Same',
    shiftCount: 142, 
    department: 'Engineering, Product',
    location: 'HQ Main',
    enforcement: 'FLEXIBLE',
    minWorkHoursBefore: 1.5,
    maxWorkHoursAfter: 2,
    allowSplit: false,
    gracePeriod: 5,
    autoExtend: true,
    autoExtendThreshold: 20,
    requiresManagerApproval: false,
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    complianceLevel: 'HIGH',
    auditScore: 92,
    tags: ['Paid', 'Refreshment', 'Flexible'],
    maxUsagePerDay: 2,
    weekendAllowed: true,
    holidayAllowed: true,
    overtimeAllowed: true,
  },
  { 
    id: 'BR-003', 
    code: 'PRAYER-ASR',
    name: 'Asr Prayer', 
    type: 'Prayer', 
    description: 'Prayer break accommodating religious practices',
    duration: 20, 
    startTime: '16:30',
    endTime: '16:50',
    timing: '4:30 PM - 4:50 PM', 
    isPaid: true, 
    fridayOverride: 'Same',
    shiftCount: 45, 
    department: 'All',
    location: 'HQ Main, Remote',
    enforcement: 'MANUAL_PUNCH',
    minWorkHoursBefore: 0,
    maxWorkHoursAfter: 8,
    allowSplit: true,
    splitMaxParts: 2,
    gracePeriod: 10,
    autoExtend: false,
    requiresManagerApproval: false,
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z',
    complianceLevel: 'HIGH',
    auditScore: 98,
    tags: ['Religious', 'Paid', 'Flexible'],
    maxUsagePerDay: 5,
    weekendAllowed: true,
    holidayAllowed: true,
    overtimeAllowed: true,
  },
  { 
    id: 'BR-004', 
    code: 'BREAK-EVE',
    name: 'Evening Break', 
    type: 'Rest', 
    description: 'Evening rest break for long shifts',
    duration: 15, 
    startTime: '17:00',
    endTime: '17:15',
    timing: '5:00 PM - 5:15 PM', 
    isPaid: true, 
    fridayOverride: 'Same',
    shiftCount: 89, 
    department: 'Operations, Support',
    location: 'All',
    enforcement: 'AUTO_DEDUCT',
    minWorkHoursBefore: 6,
    maxWorkHoursAfter: 8,
    allowSplit: false,
    gracePeriod: 10,
    autoExtend: true,
    autoExtendThreshold: 25,
    requiresManagerApproval: false,
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    complianceLevel: 'MEDIUM',
    auditScore: 78,
    tags: ['Auto-deduct', 'Paid', 'Long-shift'],
    maxUsagePerDay: 1,
    weekendAllowed: true,
    holidayAllowed: true,
    overtimeAllowed: true,
  },
  { 
    id: 'BR-005', 
    code: 'IFTAR-RMZ',
    name: 'Ramzan Iftar', 
    type: 'Custom', 
    description: 'Special break during Ramadan for Iftar',
    duration: 30, 
    startTime: '18:30',
    endTime: '19:00',
    timing: '6:30 PM - 7:00 PM', 
    isPaid: false, 
    fridayOverride: 'Same',
    shiftCount: 23, 
    department: 'All',
    location: 'HQ Main',
    enforcement: 'ENFORCED',
    minWorkHoursBefore: 0,
    maxWorkHoursAfter: 24,
    allowSplit: false,
    gracePeriod: 15,
    autoExtend: false,
    requiresManagerApproval: false,
    status: 'ACTIVE',
    effectiveFrom: '2025-03-01',
    effectiveTo: '2025-04-30',
    createdBy: 'Admin User',
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z',
    complianceLevel: 'HIGH',
    auditScore: 88,
    tags: ['Seasonal', 'Religious', 'Cultural'],
    maxUsagePerDay: 1,
    weekendAllowed: true,
    holidayAllowed: true,
    overtimeAllowed: false,
  },
  { 
    id: 'BR-006', 
    code: 'SNACK-PM',
    name: 'Afternoon Snack', 
    type: 'Snack', 
    description: 'Quick snack break for afternoon energy boost',
    duration: 10, 
    startTime: '15:30',
    endTime: '15:40',
    timing: '3:30 PM - 3:40 PM', 
    isPaid: true, 
    fridayOverride: 'Same',
    shiftCount: 67, 
    department: 'All',
    location: 'All',
    enforcement: 'FLEXIBLE',
    minWorkHoursBefore: 4,
    maxWorkHoursAfter: 6,
    allowSplit: false,
    gracePeriod: 5,
    autoExtend: false,
    requiresManagerApproval: false,
    status: 'DRAFT',
    createdBy: 'Admin User',
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2024-12-20T09:00:00Z',
    complianceLevel: 'MEDIUM',
    auditScore: 65,
    tags: ['Paid', 'Quick', 'Optional'],
    maxUsagePerDay: 2,
    weekendAllowed: false,
    holidayAllowed: false,
    overtimeAllowed: true,
  },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Sales', 'Marketing', 'Support', 'HR', 'Finance'];
const LOCATIONS = ['All', 'HQ Main', 'West Branch', 'East Campus', 'Remote', 'Field'];

interface BreakConfigFormProps {
  config?: BreakConfig;
  onSave: (config: Omit<BreakConfig, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'shiftCount'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const BreakConfigForm: React.FC<BreakConfigFormProps> = ({
  config,
  onSave,
  onClose,
  mode,
}) => {
  // Basic Information
  const [code, setCode] = useState(config?.code || '');
  const [name, setName] = useState(config?.name || '');
  const [description, setDescription] = useState(config?.description || '');
  const [type, setType] = useState<BreakType>(config?.type || 'Lunch');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>(config?.status || 'DRAFT');
  
  // Timing
  const [startTime, setStartTime] = useState(config?.startTime || '13:00');
  const [endTime, setEndTime] = useState(config?.endTime || '14:00');
  const [duration, setDuration] = useState(config?.duration || 60);
  
  // Friday Override
  const [hasFridayOverride, setHasFridayOverride] = useState(config?.fridayOverride !== 'Same');
  const [fridayStartTime, setFridayStartTime] = useState(config?.fridayStartTime || '12:30');
  const [fridayEndTime, setFridayEndTime] = useState(config?.fridayEndTime || '14:30');
  
  // Settings
  const [isPaid, setIsPaid] = useState(config?.isPaid || false);
  const [enforcement, setEnforcement] = useState<EnforcementType>(config?.enforcement || 'MANUAL_PUNCH');
  const [gracePeriod, setGracePeriod] = useState(config?.gracePeriod || 15);
  const [minWorkHoursBefore, setMinWorkHoursBefore] = useState(config?.minWorkHoursBefore || 3);
  const [maxWorkHoursAfter, setMaxWorkHoursAfter] = useState(config?.maxWorkHoursAfter || 6);
  
  // Advanced Settings
  const [allowSplit, setAllowSplit] = useState(config?.allowSplit || false);
  const [splitMaxParts, setSplitMaxParts] = useState(config?.splitMaxParts || 2);
  const [autoExtend, setAutoExtend] = useState(config?.autoExtend || false);
  const [autoExtendThreshold, setAutoExtendThreshold] = useState(config?.autoExtendThreshold || 20);
  const [requiresManagerApproval, setRequiresManagerApproval] = useState(config?.requiresManagerApproval || false);
  const [maxUsagePerDay, setMaxUsagePerDay] = useState(config?.maxUsagePerDay || 1);
  const [weekendAllowed, setWeekendAllowed] = useState(config?.weekendAllowed || true);
  const [holidayAllowed, setHolidayAllowed] = useState(config?.holidayAllowed || true);
  const [overtimeAllowed, setOvertimeAllowed] = useState(config?.overtimeAllowed || false);
  
  // Meta
  const [department, setDepartment] = useState(config?.department || 'All');
  const [location, setLocation] = useState(config?.location || 'All');
  const [effectiveFrom, setEffectiveFrom] = useState(config?.effectiveFrom || '');
  const [effectiveTo, setEffectiveTo] = useState(config?.effectiveTo || '');
  const [complianceLevel, setComplianceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>(config?.complianceLevel || 'HIGH');
  const [tags, setTags] = useState<string>(config?.tags?.join(', ') || '');

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    if (field === 'start') {
      setStartTime(value);
      const newDuration = calculateDuration(value, endTime);
      if (newDuration > 0) setDuration(newDuration);
    } else {
      setEndTime(value);
      const newDuration = calculateDuration(startTime, value);
      if (newDuration > 0) setDuration(newDuration);
    }
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Code and Name are required');
      return;
    }

    if (!startTime || !endTime) {
      alert('Start and End times are required');
      return;
    }

    if (duration <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    const configData: Omit<BreakConfig, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'shiftCount'> = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      type,
      status,
      duration,
      startTime,
      endTime,
      timing: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      isPaid,
      fridayOverride: hasFridayOverride ? `${formatTime(fridayStartTime)} - ${formatTime(fridayEndTime)}` : 'Same',
      fridayStartTime: hasFridayOverride ? fridayStartTime : undefined,
      fridayEndTime: hasFridayOverride ? fridayEndTime : undefined,
      enforcement,
      minWorkHoursBefore,
      maxWorkHoursAfter,
      allowSplit,
      splitMaxParts: allowSplit ? splitMaxParts : undefined,
      gracePeriod,
      autoExtend,
      autoExtendThreshold: autoExtend ? autoExtendThreshold : undefined,
      requiresManagerApproval,
      complianceLevel,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      maxUsagePerDay: maxUsagePerDay > 0 ? maxUsagePerDay : undefined,
      weekendAllowed,
      holidayAllowed,
      overtimeAllowed,
      department: department === 'All' ? undefined : department,
      location: location === 'All' ? undefined : location,
      effectiveFrom: effectiveFrom || undefined,
      effectiveTo: effectiveTo || undefined,
    };

    onSave(configData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center  p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create Break Configuration' : 'Edit Break Configuration'}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {mode === 'edit' ? `Editing: ${config?.code}` : 'Define new break policy'}
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
                    Break Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="LUNCH-STD, TEA-MORN"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                      maxLength={10}
                    />
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400">Unique identifier</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Break Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Standard Lunch, Morning Tea"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Break Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BREAK_TYPES.map(breakType => (
                      <button
                        key={breakType.value}
                        type="button"
                        onClick={() => setType(breakType.value as BreakType)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                          type === breakType.value
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${breakType.color} flex items-center justify-center text-white`}>
                          {React.createElement(breakType.icon, { size: 12 })}
                        </div>
                        {breakType.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the break policy, purpose, and any special considerations..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    maxLength={200}
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: TIMING & DURATION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} /> Timing & Duration
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Timer size={14} />
                  <span>{duration} minutes</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {formatTime(startTime)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {formatTime(endTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-800">Duration Summary</p>
                    <p className="text-[10px] text-blue-600">
                      {formatTime(startTime)} to {formatTime(endTime)} = {duration} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-800">Compliance Check</p>
                    <p className="text-[10px] text-blue-600">
                      {duration >= 45 ? '✓ Meets labor law requirements' : '⚠ May not meet minimum requirements'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: FRIDAY SPECIAL */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={16} /> Friday Special Settings
                </h4>
                <button
                  type="button"
                  onClick={() => setHasFridayOverride(!hasFridayOverride)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    hasFridayOverride
                      ? 'bg-orange-50 text-orange-600 border border-orange-100'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {hasFridayOverride ? (
                    <>
                      <Check size={14} /> Friday Override Enabled
                    </>
                  ) : (
                    <>
                      <X size={14} /> Same as Regular Days
                    </>
                  )}
                </button>
              </div>
              
              {hasFridayOverride && (
                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                        Friday Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={fridayStartTime}
                          onChange={(e) => setFridayStartTime(e.target.value)}
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm font-bold text-orange-600 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                          {formatTime(fridayStartTime)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                        Friday End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={fridayEndTime}
                          onChange={(e) => setFridayEndTime(e.target.value)}
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm font-bold text-orange-600 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                          {formatTime(fridayEndTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-orange-500/70 mt-3">
                    Friday break timing will override regular timing for Jummah prayer or other considerations
                  </p>
                </div>
              )}
            </div>

            {/* SECTION D: BREAK POLICIES */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} /> Break Policies
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Compensation Type
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPaid(!isPaid)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isPaid
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {isPaid ? 'Paid Break' : 'Unpaid Break'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    {isPaid 
                      ? 'Break time is compensated and counts toward total work hours'
                      : 'Break time is unpaid and deducted from total work hours'
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Enforcement Method
                  </label>
                  <div className="space-y-3">
                    {ENFORCEMENT_OPTIONS.map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          enforcement === option.value
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="enforcement"
                          value={option.value}
                          checked={enforcement === option.value}
                          onChange={(e) => setEnforcement(e.target.value as EnforcementType)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{option.label}</p>
                          <p className="text-[10px] text-gray-500">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-[10px] text-gray-500">Allowed late arrival/early departure</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Min Work Hours Before
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={minWorkHoursBefore}
                      onChange={(e) => setMinWorkHoursBefore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Minimum work before break allowed</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Max Work Hours After
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={maxWorkHoursAfter}
                      onChange={(e) => setMaxWorkHoursAfter(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Maximum work after break before next break</p>
                </div>
              </div>
            </div>

            {/* SECTION E: ADVANCED SETTINGS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={16} /> Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Allow Split Break
                      </label>
                      <p className="text-[10px] text-gray-500">Break can be taken in multiple parts</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowSplit(!allowSplit)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        allowSplit ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        allowSplit ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  {allowSplit && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Maximum Parts
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="2"
                          max="6"
                          value={splitMaxParts}
                          onChange={(e) => setSplitMaxParts(parseInt(e.target.value) || 2)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Auto-extend Break
                      </label>
                      <p className="text-[10px] text-gray-500">Automatically extend if work continues</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoExtend(!autoExtend)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        autoExtend ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        autoExtend ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  {autoExtend && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Extension Threshold
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={autoExtendThreshold}
                          onChange={(e) => setAutoExtendThreshold(parseInt(e.target.value) || 20)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">min</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Max Usage Per Day
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={maxUsagePerDay}
                      onChange={(e) => setMaxUsagePerDay(parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">times</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Weekend Allowed
                  </label>
                  <button
                    type="button"
                    // onClick={() => setWeekendAllowed(!weekendAllowed)}
                    className={`w-full py-3 rounded-xl border text-sm font-bold transition-all ${
                      weekendAllowed
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {weekendAllowed ? '✅ Allowed' : '❌ Not Allowed'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Holiday Allowed
                  </label>
                  <button
                    type="button"
                    // onClick={() => setHolidayAllowed(!holidayAllowed)}
                    className={`w-full py-3 rounded-xl border text-sm font-bold transition-all ${
                      holidayAllowed
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {holidayAllowed ? '✅ Allowed' : '❌ Not Allowed'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Requires Manager Approval
                  </label>
                  <button
                    type="button"
                    onClick={() => setRequiresManagerApproval(!requiresManagerApproval)}
                    className={`w-full py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      requiresManagerApproval
                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {requiresManagerApproval ? (
                      <>
                        <Lock size={14} /> Approval Required
                      </>
                    ) : (
                      <>
                        <Unlock size={14} /> No Approval Needed
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Overtime Allowed
                  </label>
                  <button
                    type="button"
                    onClick={() => setOvertimeAllowed(!overtimeAllowed)}
                    className={`w-full py-3 rounded-xl border text-sm font-bold transition-all ${
                      overtimeAllowed
                        ? 'bg-purple-50 text-purple-600 border-purple-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {overtimeAllowed ? '✅ Allowed' : '❌ Not Allowed'}
                  </button>
                </div>
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
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Effective From
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
                    Effective To
                  </label>
                  <input
                    type="date"
                    value={effectiveTo}
                    onChange={(e) => setEffectiveTo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Compliance Level
                  </label>
                  <select
                    value={complianceLevel}
                    onChange={(e) => setComplianceLevel(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  >
                    <option value="HIGH">High Compliance</option>
                    <option value="MEDIUM">Medium Compliance</option>
                    <option value="LOW">Low Compliance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Mandatory, Paid, Flexible, Religious"
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
            disabled={!code.trim() || !name.trim() || !startTime || !endTime || duration <= 0}
            className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> {mode === 'create' ? 'Create Break Configuration' : 'Update Break Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

// View Modal Component
const ViewBreakConfigModal: React.FC<{
  config: BreakConfig;
  onClose: () => void;
  onEdit: () => void;
}> = ({ config, onClose, onEdit }) => {
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center  p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{config.name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {config.code} • {STATUS_CONFIG[config.status].label}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Break Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Code</span>
                    <span className="text-sm font-black text-[#3E3B6F]">{config.code}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Type</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg ${
                        config.type === 'Lunch' ? 'bg-orange-500' :
                        config.type === 'Tea' ? 'bg-amber-500' :
                        config.type === 'Prayer' ? 'bg-indigo-500' :
                        config.type === 'Snack' ? 'bg-yellow-500' :
                        config.type === 'Rest' ? 'bg-blue-500' : 'bg-purple-500'
                      } flex items-center justify-center text-white`}>
                        {config.type === 'Lunch' && <CoffeeIcon size={12} />}
                        {config.type === 'Tea' && <Coffee size={12} />}
                        {config.type === 'Prayer' && <Moon size={12} />}
                        {config.type === 'Snack' && <Zap size={12} />}
                        {config.type === 'Rest' && <Sun size={12} />}
                        {config.type === 'Custom' && <Clock size={12} />}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{config.type} Break</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_CONFIG[config.status].color}`}>
                      {STATUS_CONFIG[config.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Usage</span>
                    <span className="text-sm font-black text-indigo-600">{config.shiftCount} shifts</span>
                  </div>
                  {config.description && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-800">Description</p>
                      <p className="text-sm text-gray-700 mt-1">{config.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Timing Details</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-700">Regular Timing</span>
                      <span className="text-sm font-black text-blue-800">
                        {formatTime(config.startTime)} - {formatTime(config.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-600">Duration</span>
                      <span className="text-sm font-black text-blue-800">{config.duration} minutes</span>
                    </div>
                  </div>
                  
                  {config.fridayOverride !== 'Same' && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-orange-700">Friday Override</span>
                        <span className="text-sm font-black text-orange-800">{config.fridayOverride}</span>
                      </div>
                      <p className="text-[10px] text-orange-600">Special timing for Friday prayers</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Policies & Settings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Compensation</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      config.isPaid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {config.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Enforcement</span>
                    <span className="text-sm font-bold text-gray-800">
                      {ENFORCEMENT_OPTIONS.find(e => e.value === config.enforcement)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Grace Period</span>
                    <span className="text-sm font-bold text-gray-800">{config.gracePeriod} minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Min Work Before</span>
                    <span className="text-sm font-bold text-gray-800">{config.minWorkHoursBefore} hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Max Work After</span>
                    <span className="text-sm font-bold text-gray-800">{config.maxWorkHoursAfter} hours</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Advanced Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {config.allowSplit && (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl text-center">
                      <p className="text-sm font-black text-green-600">Split Allowed</p>
                      <p className="text-[10px] text-green-800">{config.splitMaxParts || 2} parts max</p>
                    </div>
                  )}
                  {config.autoExtend && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl text-center">
                      <p className="text-sm font-black text-blue-600">Auto-extend</p>
                      <p className="text-[10px] text-blue-800">After {config.autoExtendThreshold} min</p>
                    </div>
                  )}
                  {config.requiresManagerApproval && (
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl text-center">
                      <p className="text-sm font-black text-orange-600">Approval Required</p>
                      <p className="text-[10px] text-orange-800">Manager approval</p>
                    </div>
                  )}
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl text-center">
                    <p className="text-sm font-black text-purple-600">Max/Day</p>
                    <p className="text-[10px] text-purple-800">{config.maxUsagePerDay || 1} times</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Meta Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Department</p>
                <p className="text-sm font-bold text-gray-800">{config.department || 'All Departments'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
                <p className="text-sm font-bold text-gray-800">{config.location || 'All Locations'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Compliance</p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${COMPLIANCE_CONFIG[config.complianceLevel].color}`}>
                  {COMPLIANCE_CONFIG[config.complianceLevel].label}
                </span>
                {config.auditScore && (
                  <p className="text-sm font-black text-gray-800 mt-1">{config.auditScore}% score</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Created: {formatDate(config.createdAt)} by {config.createdBy}</span>
                <span>Updated: {formatDate(config.updatedAt)}</span>
              </div>
              {config.tags && config.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {config.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:shadow-lg transition-all"
          >
            Close
          </button>
          <button 
            onClick={onEdit}
            className="flex-[2] py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Edit3 size={16} /> Edit Break Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export const BreakConfigurationsList: React.FC = () => {
  const [breaks, setBreaks] = useState<BreakConfig[]>(ENHANCED_MOCK_BREAKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedConfig, setSelectedConfig] = useState<BreakConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | BreakType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ALL');
  const [filterPaid, setFilterPaid] = useState<'ALL' | boolean>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const filteredBreaks = useMemo(() => {
    return breaks.filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'ALL' || b.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
      const matchesPaid = filterPaid === 'ALL' || b.isPaid === filterPaid;
      
      return matchesSearch && matchesType && matchesStatus && matchesPaid;
    });
  }, [breaks, searchQuery, filterType, filterStatus, filterPaid]);

  const stats = useMemo(() => {
    const totalBreaks = breaks.length;
    const activeBreaks = breaks.filter(b => b.status === 'ACTIVE').length;
    const totalShiftUsage = breaks.reduce((sum, b) => sum + b.shiftCount, 0);
    const averageDuration = breaks.reduce((sum, b) => sum + b.duration, 0) / breaks.length;
    const paidBreaks = breaks.filter(b => b.isPaid).length;
    
    return { totalBreaks, activeBreaks, totalShiftUsage, averageDuration: Math.round(averageDuration), paidBreaks };
  }, [breaks]);

  const handleCreateConfig = () => {
    setSelectedConfig(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditConfig = (config: BreakConfig) => {
    setSelectedConfig(config);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewConfig = (config: BreakConfig) => {
    setSelectedConfig(config);
    setIsViewModalOpen(true);
  };

  const handleDuplicateConfig = (config: BreakConfig) => {
    const newConfig: BreakConfig = {
      ...config,
      id: `BR-${Math.floor(Math.random() * 900) + 100}`,
      code: `${config.code}-COPY`,
      name: `${config.name} (Copy)`,
      shiftCount: 0,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBreaks(prev => [newConfig, ...prev]);
    setActiveActionMenu(null);
  };

  const handleToggleStatus = (configId: string) => {
    setBreaks(prev => prev.map(config => 
      config.id === configId 
        ? { 
            ...config, 
            status: config.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            updatedAt: new Date().toISOString()
          }
        : config
    ));
    setActiveActionMenu(null);
  };

  const handleDeleteConfig = (configId: string) => {
    const config = breaks.find(b => b.id === configId);
    if (config?.shiftCount && config.shiftCount > 0) {
      alert('Cannot delete break configuration currently in use by shifts');
      return;
    }
    if (window.confirm('Are you sure you want to delete this break configuration?')) {
      setBreaks(prev => prev.filter(b => b.id !== configId));
    }
    setActiveActionMenu(null);
  };

  const handleSaveConfig = (configData: Omit<BreakConfig, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'shiftCount'>) => {
    if (modalMode === 'edit' && selectedConfig) {
      setBreaks(prev => prev.map(config => 
        config.id === selectedConfig.id 
          ? { 
              ...configData as BreakConfig, 
              id: selectedConfig.id, 
              shiftCount: selectedConfig.shiftCount,
              createdBy: selectedConfig.createdBy,
              createdAt: selectedConfig.createdAt, 
              updatedAt: new Date().toISOString() 
            }
          : config
      ));
    } else {
      const newConfig: BreakConfig = {
        ...configData as BreakConfig,
        id: `BR-${Math.floor(Math.random() * 900) + 100}`,
        shiftCount: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBreaks(prev => [newConfig, ...prev]);
    }
    
    setIsModalOpen(false);
    setSelectedConfig(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Coffee className="text-[#3E3B6F]" size={28} /> Enhanced Break Configurations
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">
            Comprehensive break policy management with compliance tracking and advanced features
          </p>
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
            onClick={handleCreateConfig}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Break Config
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Configs</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.totalBreaks}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Configs</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.activeBreaks}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Usage</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{stats.totalShiftUsage}</span>
            <span className="text-xs text-gray-500">shifts</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Avg Duration</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.averageDuration}m</span>
          </div>
        </div>
      </div>

      {/* GLOBAL BREAK POLICIES CARD */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Global Break Policies</h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F]/5 text-[#3E3B6F] rounded-xl text-xs font-bold hover:bg-[#3E3B6F]/10 transition-all">
            <Settings2 size={14} /> Configure
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Maximum Daily Breaks</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="4"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">breaks</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Max per employee per day
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mandatory Break After</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">hours</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Labor law compliance
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Minimum Break Duration</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="15"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-[#3E3B6F] focus:ring-4 focus:ring-[#3E3B6F]/5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">minutes</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                For break to count
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Info size={14} className="text-blue-500" />
            <span className="font-medium">These global policies apply to all break configurations and cannot be overridden by individual settings.</span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search break name, code, description, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="Lunch">Lunch</option>
          <option value="Tea">Tea/Coffee</option>
          <option value="Prayer">Prayer</option>
          <option value="Snack">Snack</option>
          <option value="Rest">Rest</option>
          <option value="Custom">Custom</option>
        </select>
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
        <select 
          value={filterPaid.toString()}
          onChange={(e) => setFilterPaid(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Compensation</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Download size={14} /> Export
        </button>
      </div>

      {viewMode === 'LIST' ? (
        /* LIST VIEW */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> Break Configurations
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                Showing: {filteredBreaks.length} of {breaks.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 border-b border-gray-100">
                  <th className="px-8 py-4">Break Details</th>
                  <th className="px-6 py-4">Timing & Duration</th>
                  <th className="px-6 py-4">Policies</th>
                  <th className="px-6 py-4">Friday Special</th>
                  <th className="px-6 py-4 text-center">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBreaks.map((config) => (
                  <tr key={config.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          config.type === 'Lunch' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                          config.type === 'Tea' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                          config.type === 'Prayer' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                          config.type === 'Snack' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
                          config.type === 'Rest' ? 'bg-cyan-50 border-cyan-100 text-cyan-600' :
                          'bg-purple-50 border-purple-100 text-purple-600'
                        }`}>
                          {config.type === 'Lunch' && <CoffeeIcon size={20} />}
                          {config.type === 'Tea' && <Coffee size={20} />}
                          {config.type === 'Prayer' && <Moon size={20} />}
                          {config.type === 'Snack' && <Zap size={20} />}
                          {config.type === 'Rest' && <Sun size={20} />}
                          {config.type === 'Custom' && <Clock size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-gray-800">{config.name}</p>
                            <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {config.code}
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{config.type} Break</p>
                          {config.description && (
                            <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-1">{config.description}</p>
                          )}
                          {config.tags && config.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {config.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                              {config.tags.length > 2 && (
                                <span className="text-[8px] font-bold text-gray-400">+{config.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Clock size={14} className="text-blue-500" />
                          {config.timing}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-[#3E3B6F]">{config.duration}m</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            config.isPaid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {config.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {config.weekendAllowed && (
                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                              Weekend
                            </span>
                          )}
                          {config.holidayAllowed && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              Holiday
                            </span>
                          )}
                          {config.overtimeAllowed && (
                            <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                              Overtime
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-gray-600">
                          {ENFORCEMENT_OPTIONS.find(e => e.value === config.enforcement)?.label}
                        </div>
                        <div className="flex gap-1">
                          {config.allowSplit && (
                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                              Split Allowed
                            </span>
                          )}
                          {config.autoExtend && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              Auto-extend
                            </span>
                          )}
                        </div>
                        {config.gracePeriod > 0 && (
                          <p className="text-[9px] text-gray-500">{config.gracePeriod}m grace</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {config.fridayOverride === 'Same' ? (
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">No Change</span>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-orange-600">
                            <Calendar size={12} />
                            {config.fridayOverride}
                          </div>
                          <p className="text-[9px] text-orange-500">Friday override active</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                        <Users size={14} /> {config.shiftCount} Shifts
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[config.status].color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            config.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' :
                            config.status === 'INACTIVE' ? 'bg-gray-400' : 'bg-blue-500'
                          }`} />
                          {STATUS_CONFIG[config.status].label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold ${COMPLIANCE_CONFIG[config.complianceLevel].color}`}>
                          {COMPLIANCE_CONFIG[config.complianceLevel].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleViewConfig(config)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditConfig(config)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit Config"
                        >
                          <Edit3 size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveActionMenu(activeActionMenu === config.id ? null : config.id)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeActionMenu === config.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                              <button
                                onClick={() => handleDuplicateConfig(config)}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy size={14} /> Duplicate Config
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => handleToggleStatus(config.id)}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-gray-50 flex items-center gap-2"
                              >
                                {config.status === 'ACTIVE' ? (
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
                                onClick={() => handleDeleteConfig(config.id)}
                                disabled={config.shiftCount > 0}
                                className={`w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2 ${
                                  config.shiftCount > 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={config.shiftCount > 0 ? 'Cannot delete config in use by shifts' : ''}
                              >
                                <Trash2 size={14} /> Delete Config
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
            {filteredBreaks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
                <Coffee size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Break Configurations Found</h3>
                <p className="text-sm font-medium mt-2">Adjust your search or create a new configuration.</p>
              </div>
            )}
          </div>
          
          {/* TABLE FOOTER */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Active: {stats.activeBreaks}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Paid Breaks: {stats.paidBreaks}
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
          {filteredBreaks.map(config => (
            <div key={config.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F] group-hover:scale-110 transition-transform">
                <Coffee size={80} />
              </div>
              <div className="flex flex-col h-full relative z-10">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        config.type === 'Lunch' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                        config.type === 'Tea' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        config.type === 'Prayer' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                        config.type === 'Snack' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
                        config.type === 'Rest' ? 'bg-cyan-50 border-cyan-100 text-cyan-600' :
                        'bg-purple-50 border-purple-100 text-purple-600'
                      }`}>
                        {config.type === 'Lunch' && <CoffeeIcon size={24} />}
                        {config.type === 'Tea' && <Coffee size={24} />}
                        {config.type === 'Prayer' && <Moon size={24} />}
                        {config.type === 'Snack' && <Zap size={24} />}
                        {config.type === 'Rest' && <Sun size={24} />}
                        {config.type === 'Custom' && <Clock size={24} />}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-800">{config.name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{config.code}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold ${STATUS_CONFIG[config.status].color}`}>
                        {STATUS_CONFIG[config.status].label}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${COMPLIANCE_CONFIG[config.complianceLevel].color}`}>
                        {COMPLIANCE_CONFIG[config.complianceLevel].label}
                      </span>
                    </div>
                  </div>
                  
                  {config.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-3">{config.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-black text-[#3E3B6F]">{config.duration}m</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-indigo-600">{config.shiftCount}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Shifts</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Clock size={14} className="text-blue-500" />
                      <span>{config.timing}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        config.isPaid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {config.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <div className="flex gap-1">
                        {config.allowSplit && (
                          <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            Split
                          </span>
                        )}
                        {config.autoExtend && (
                          <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            Auto-extend
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {config.fridayOverride !== 'Same' && (
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                        <Calendar size={12} />
                        <span>Friday: {config.fridayOverride.split(' - ')[0]}</span>
                      </div>
                    )}
                    
                    {config.tags && config.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {config.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {ENFORCEMENT_OPTIONS.find(e => e.value === config.enforcement)?.label?.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {config.gracePeriod}m grace
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewConfig(config)}
                      className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleEditConfig(config)}
                      className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:scale-105 transition-all"
                      title="Edit Config"
                    >
                      <Edit3 size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedConfig && (
        <ViewBreakConfigModal
          config={selectedConfig}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            handleEditConfig(selectedConfig);
          }}
        />
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <BreakConfigForm
          config={selectedConfig || undefined}
          onSave={handleSaveConfig}
          onClose={() => {
            if (window.confirm('Are you sure you want to discard your changes?')) {
              setIsModalOpen(false);
              setSelectedConfig(null);
            }
          }}
          mode={modalMode}
        />
      )}
    </div>
  );
};