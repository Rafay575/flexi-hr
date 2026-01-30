import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MoreVertical, 
  Users, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Info, 
  RefreshCcw, 
  ChevronRight,
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Eye,
  Copy,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Layers,
  Download,
  Filter,
  BarChart3,
  Hash,
  Settings2,
  Clock,
  Bell,
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  TrendingUp,
  Zap,
  Moon,
  Sun,
  Target,
  Clock3,
  BookOpen,
  PieChart,
  UserCheck,
  Link as LinkIcon,
  CopyCheck,
  Upload,
  Save,
  CalendarRange,
  Timer
} from 'lucide-react';

type RuleType = 'FIXED' | 'ROTATING' | 'CUSTOM_CYCLE' | 'ALT_WEEKENDS';
type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
type FrequencyUnit = 'DAYS' | 'WEEKS' | 'MONTHS';

interface RotationPattern {
  workDays: number;
  offDays: number;
  cycleLength: number; // in days
  startDate: string;
}

interface CustomCycle {
  id: string;
  pattern: DayOfWeek[];
  cycleLength: number; // in weeks
  description: string;
}

interface WeeklyOffRule {
  id: string;
  code: string;
  name: string;
  type: RuleType;
  description?: string;
  pattern: string;
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  location?: string;
  rotationPattern?: RotationPattern;
  customCycle?: CustomCycle;
  allowOverride: boolean;
  overrideApprovalRequired: boolean;
  holidayHandling: 'SEPARATE' | 'INCLUDE' | 'EXTEND';
  complianceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  auditScore?: number;
  tags: string[];
  maxConsecutiveWorkDays?: number;
  minOffDaysBetweenShifts?: number;
  weekendDays: DayOfWeek[];
  specialRules?: string[];
}

type ViewMode = 'LIST' | 'GRID';

const RULE_TYPES = [
  { value: 'FIXED', label: 'Fixed Weekly Off', icon: CalendarCheck, color: 'bg-blue-500' },
  { value: 'ROTATING', label: 'Rotating Cycle', icon: RefreshCcw, color: 'bg-purple-500' },
  { value: 'CUSTOM_CYCLE', label: 'Custom Cycle', icon: CalendarDays, color: 'bg-green-500' },
  { value: 'ALT_WEEKENDS', label: 'Alternate Weekends', icon: Calendar, color: 'bg-orange-500' },
];

const DAYS_OF_WEEK = [
  { value: 'MON', label: 'Monday', short: 'Mon' },
  { value: 'TUE', label: 'Tuesday', short: 'Tue' },
  { value: 'WED', label: 'Wednesday', short: 'Wed' },
  { value: 'THU', label: 'Thursday', short: 'Thu' },
  { value: 'FRI', label: 'Friday', short: 'Fri' },
  { value: 'SAT', label: 'Saturday', short: 'Sat' },
  { value: 'SUN', label: 'Sunday', short: 'Sun' },
];

const HOLIDAY_HANDLING_OPTIONS = [
  { value: 'SEPARATE', label: 'Separate from Weekly Off', description: 'Holidays don\'t affect weekly off schedule' },
  { value: 'INCLUDE', label: 'Include as Off Day', description: 'Holidays count as weekly off days' },
  { value: 'EXTEND', label: 'Extend Adjacent Off', description: 'Extend nearby weekly off if holiday falls adjacent' },
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
const ENHANCED_MOCK_RULES: WeeklyOffRule[] = [
  { 
    id: 'WOR-001', 
    code: 'WK-OFF-001',
    name: 'Sat-Sun Standard Off', 
    type: 'FIXED', 
    description: 'Standard weekend off for office employees',
    pattern: 'Sat, Sun', 
    employeeCount: 850, 
    status: 'ACTIVE',
    effectiveFrom: '2024-01-01',
    createdBy: 'Admin User',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    department: 'Engineering, Product, HR',
    location: 'HQ Main',
    allowOverride: true,
    overrideApprovalRequired: true,
    holidayHandling: 'SEPARATE',
    complianceLevel: 'HIGH',
    auditScore: 95,
    tags: ['Standard', 'Weekend', 'Office'],
    maxConsecutiveWorkDays: 5,
    minOffDaysBetweenShifts: 1,
    weekendDays: ['SAT', 'SUN'],
    specialRules: ['Cannot work more than 12 consecutive days'],
  },
  { 
    id: 'WOR-002', 
    code: 'WK-OFF-002',
    name: 'Friday Only (Middle East)', 
    type: 'FIXED', 
    description: 'Friday weekly off for Middle East operations',
    pattern: 'Fri', 
    employeeCount: 120, 
    status: 'ACTIVE',
    effectiveFrom: '2024-01-01',
    createdBy: 'Admin User',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    department: 'Operations, Support',
    location: 'Dubai Office, Remote',
    allowOverride: false,
    overrideApprovalRequired: false,
    holidayHandling: 'INCLUDE',
    complianceLevel: 'HIGH',
    auditScore: 92,
    tags: ['Middle East', 'Friday', 'Region-specific'],
    maxConsecutiveWorkDays: 6,
    minOffDaysBetweenShifts: 0,
    weekendDays: ['FRI'],
    specialRules: ['Friday prayer consideration'],
  },
  { 
    id: 'WOR-003', 
    code: 'WK-OFF-003',
    name: 'Rotating 5-2 Cycle', 
    type: 'ROTATING', 
    description: '5 days work, 2 days off rotating schedule for 24/7 operations',
    pattern: '5 Days On, 2 Days Off', 
    employeeCount: 210, 
    status: 'ACTIVE',
    effectiveFrom: '2024-01-01',
    createdBy: 'Admin User',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
    department: 'Operations, Support',
    location: 'All',
    rotationPattern: {
      workDays: 5,
      offDays: 2,
      cycleLength: 7,
      startDate: '2024-01-01',
    },
    allowOverride: true,
    overrideApprovalRequired: true,
    holidayHandling: 'EXTEND',
    complianceLevel: 'MEDIUM',
    auditScore: 78,
    tags: ['Rotating', '24/7', 'Operations'],
    maxConsecutiveWorkDays: 7,
    minOffDaysBetweenShifts: 2,
    weekendDays: [],
    specialRules: ['Night shift differential applies'],
  },
  { 
    id: 'WOR-004', 
    code: 'WK-OFF-004',
    name: 'Alternate Weekends', 
    type: 'ALT_WEEKENDS', 
    description: 'Alternating weekends for fair distribution',
    pattern: 'Alt Sat-Sun, Next Week Sun only', 
    employeeCount: 45, 
    status: 'ACTIVE',
    effectiveFrom: '2024-03-15',
    effectiveTo: '2024-12-31',
    createdBy: 'Admin User',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    department: 'Sales, Marketing',
    location: 'Field Teams',
    allowOverride: true,
    overrideApprovalRequired: false,
    holidayHandling: 'SEPARATE',
    complianceLevel: 'HIGH',
    auditScore: 88,
    tags: ['Alternating', 'Fair', 'Field'],
    maxConsecutiveWorkDays: 6,
    minOffDaysBetweenShifts: 1,
    weekendDays: ['SAT', 'SUN'],
    specialRules: ['Weekends alternate every week'],
  },
  { 
    id: 'WOR-005', 
    code: 'WK-OFF-005',
    name: 'Custom 4-Day Work Week', 
    type: 'CUSTOM_CYCLE', 
    description: '4-day work week with 3 days off',
    pattern: 'Mon-Thu Work, Fri-Sun Off', 
    employeeCount: 32, 
    status: 'INACTIVE',
    effectiveFrom: '2024-02-01',
    effectiveTo: '2024-06-30',
    createdBy: 'Admin User',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-06-30T09:00:00Z',
    department: 'Product, Design',
    location: 'HQ Main',
    customCycle: {
      id: 'CYC-001',
      pattern: ['MON', 'TUE', 'WED', 'THU'],
      cycleLength: 1,
      description: 'Work Monday through Thursday, off Friday through Sunday'
    },
    allowOverride: false,
    overrideApprovalRequired: false,
    holidayHandling: 'EXTEND',
    complianceLevel: 'MEDIUM',
    auditScore: 65,
    tags: ['4-Day', 'Experiment', 'Productivity'],
    maxConsecutiveWorkDays: 4,
    minOffDaysBetweenShifts: 3,
    weekendDays: ['FRI', 'SAT', 'SUN'],
    specialRules: ['Compressed work week trial'],
  },
  { 
    id: 'WOR-006', 
    code: 'WK-OFF-006',
    name: 'Retail Rotating Schedule', 
    type: 'ROTATING', 
    description: 'Retail store rotating schedule with variable weekends',
    pattern: '6 Days On, 1 Day Off (Rotating)', 
    employeeCount: 156, 
    status: 'ACTIVE',
    effectiveFrom: '2024-01-01',
    createdBy: 'Admin User',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    department: 'Retail, Sales',
    location: 'Stores',
    rotationPattern: {
      workDays: 6,
      offDays: 1,
      cycleLength: 7,
      startDate: '2024-01-01',
    },
    allowOverride: true,
    overrideApprovalRequired: true,
    holidayHandling: 'INCLUDE',
    complianceLevel: 'HIGH',
    auditScore: 91,
    tags: ['Retail', 'Rotating', 'Store'],
    maxConsecutiveWorkDays: 6,
    minOffDaysBetweenShifts: 1,
    weekendDays: [],
    specialRules: ['Weekend work required', 'Holiday pay applies'],
  },
  { 
    id: 'WOR-007', 
    code: 'WK-OFF-007',
    name: 'Sunday Only - Hospitality', 
    type: 'FIXED', 
    description: 'Sunday weekly off for hospitality staff',
    pattern: 'Sun', 
    employeeCount: 89, 
    status: 'DRAFT',
    effectiveFrom: '2025-01-01',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'Hospitality, Services',
    location: 'Hotel Properties',
    allowOverride: false,
    overrideApprovalRequired: false,
    holidayHandling: 'SEPARATE',
    complianceLevel: 'MEDIUM',
    auditScore: 70,
    tags: ['Hospitality', 'Sunday', 'Draft'],
    maxConsecutiveWorkDays: 6,
    minOffDaysBetweenShifts: 0,
    weekendDays: ['SUN'],
    specialRules: ['Weekend premium rates apply'],
  },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Sales', 'Marketing', 'Support', 'HR', 'Finance', 'Retail', 'Hospitality'];
const LOCATIONS = ['All', 'HQ Main', 'Dubai Office', 'Stores', 'Hotel Properties', 'Field Teams', 'Remote'];

interface WeeklyOffRuleFormProps {
  rule?: WeeklyOffRule;
  onSave: (rule: Omit<WeeklyOffRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const WeeklyOffRuleForm: React.FC<WeeklyOffRuleFormProps> = ({
  rule,
  onSave,
  onClose,
  mode,
}) => {
  // Basic Information
  const [code, setCode] = useState(rule?.code || '');
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [type, setType] = useState<RuleType>(rule?.type || 'FIXED');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>(rule?.status || 'DRAFT');
  
  // Fixed Days
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(rule?.weekendDays || ['SAT', 'SUN']);
  
  // Rotation Pattern
  const [workDays, setWorkDays] = useState(rule?.rotationPattern?.workDays || 5);
  const [offDays, setOffDays] = useState(rule?.rotationPattern?.offDays || 2);
  const [cycleStartDate, setCycleStartDate] = useState(rule?.rotationPattern?.startDate || '');
  
  // Custom Cycle
  const [customPattern, setCustomPattern] = useState<DayOfWeek[]>(rule?.customCycle?.pattern || []);
  const [cycleLength, setCycleLength] = useState(rule?.customCycle?.cycleLength || 1);
  const [cycleDescription, setCycleDescription] = useState(rule?.customCycle?.description || '');
  
  // Settings
  const [allowOverride, setAllowOverride] = useState(rule?.allowOverride || false);
  const [overrideApprovalRequired, setOverrideApprovalRequired] = useState(rule?.overrideApprovalRequired || false);
  const [holidayHandling, setHolidayHandling] = useState(rule?.holidayHandling || 'SEPARATE');
  const [maxConsecutiveWorkDays, setMaxConsecutiveWorkDays] = useState(rule?.maxConsecutiveWorkDays || 6);
  const [minOffDaysBetweenShifts, setMinOffDaysBetweenShifts] = useState(rule?.minOffDaysBetweenShifts || 1);
  
  // Meta
  const [department, setDepartment] = useState(rule?.department || 'All');
  const [location, setLocation] = useState(rule?.location || 'All');
  const [effectiveFrom, setEffectiveFrom] = useState(rule?.effectiveFrom || '');
  const [effectiveTo, setEffectiveTo] = useState(rule?.effectiveTo || '');
  const [complianceLevel, setComplianceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>(rule?.complianceLevel || 'HIGH');
  const [tags, setTags] = useState<string>(rule?.tags?.join(', ') || '');

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleCustomDay = (day: DayOfWeek) => {
    setCustomPattern(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const generatePatternString = () => {
    switch (type) {
      case 'FIXED':
        return selectedDays.map(day => 
          DAYS_OF_WEEK.find(d => d.value === day)?.short
        ).join(', ');
      case 'ROTATING':
        return `${workDays} Days On, ${offDays} Days Off`;
      case 'ALT_WEEKENDS':
        return 'Alternating Weekends';
      case 'CUSTOM_CYCLE':
        return customPattern.map(day => 
          DAYS_OF_WEEK.find(d => d.value === day)?.short
        ).join(', ') + ' (Custom)';
      default:
        return '';
    }
  };

  const calculateCycleLength = () => {
    if (type === 'ROTATING') {
      return workDays + offDays;
    }
    return cycleLength;
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Code and Name are required');
      return;
    }

    if (type === 'FIXED' && selectedDays.length === 0) {
      alert('Please select at least one off day');
      return;
    }

    if (type === 'ROTATING' && (workDays <= 0 || offDays <= 0)) {
      alert('Work days and off days must be greater than 0');
      return;
    }

    if (type === 'CUSTOM_CYCLE' && customPattern.length === 0) {
      alert('Please select at least one off day for custom cycle');
      return;
    }

    const ruleData: Omit<WeeklyOffRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount'> = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      type,
      status,
      pattern: generatePatternString(),
      effectiveFrom,
      effectiveTo: effectiveTo || undefined,
      department: department === 'All' ? undefined : department,
      location: location === 'All' ? undefined : location,
      rotationPattern: type === 'ROTATING' ? {
        workDays,
        offDays,
        cycleLength: workDays + offDays,
        startDate: cycleStartDate || effectiveFrom,
      } : undefined,
      customCycle: type === 'CUSTOM_CYCLE' ? {
        id: `CYC-${Date.now()}`,
        pattern: customPattern,
        cycleLength,
        description: cycleDescription,
      } : undefined,
      allowOverride,
      overrideApprovalRequired,
      holidayHandling,
      complianceLevel,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      maxConsecutiveWorkDays: maxConsecutiveWorkDays > 0 ? maxConsecutiveWorkDays : undefined,
      minOffDaysBetweenShifts: minOffDaysBetweenShifts >= 0 ? minOffDaysBetweenShifts : undefined,
      weekendDays: selectedDays,
      specialRules: [],
    };

    onSave(ruleData);
  };

  const renderRuleTypeContent = () => {
    switch (type) {
      case 'FIXED':
        return (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Select Weekly Off Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button 
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value as DayOfWeek)}
                    className={`py-3 rounded-xl text-xs font-black transition-all border ${
                      selectedDays.includes(day.value as DayOfWeek)
                        ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Weekend (Sat-Sun)', days: ['SAT', 'SUN'] as DayOfWeek[] },
                  { label: 'Middle East (Fri)', days: ['FRI'] as DayOfWeek[] },
                  { label: 'Sunday Only', days: ['SUN'] as DayOfWeek[] },
                  { label: 'Mon-Tue Off', days: ['MON', 'TUE'] as DayOfWeek[] },
                ].map(preset => (
                  <button 
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedDays(preset.days)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ROTATING':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Work Days (On)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={workDays}
                    onChange={(e) => setWorkDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">days</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Off Days (Rest)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={offDays}
                    onChange={(e) => setOffDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">days</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Cycle Start Date
              </label>
              <input
                type="date"
                value={cycleStartDate}
                onChange={(e) => setCycleStartDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Visual Pattern Preview
                </label>
                <span className="text-xs font-bold text-gray-500">
                  {calculateCycleLength()} day cycle
                </span>
              </div>
              <div className="flex gap-1.5 h-8">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-md border shadow-sm ${
                      i < workDays 
                        ? 'bg-blue-500 border-blue-600/20' 
                        : 'bg-indigo-100 border-indigo-200'
                    }`}
                    title={i < workDays ? 'Work Day' : 'Weekly Off'}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <span>Week 1</span>
                <span>Week 2</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center gap-3">
              <RefreshCcw size={18} className="text-blue-500" />
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Rotating shifts are ideal for 24/7 operations. Employees will cycle through work and off days automatically in the roster.
              </p>
            </div>
          </div>
        );

      case 'ALT_WEEKENDS':
        return (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={20} className="text-orange-500" />
                <div>
                  <p className="text-xs font-bold text-orange-700">Alternating Weekends</p>
                  <p className="text-[10px] text-orange-600">Employees alternate between different weekend patterns</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                      Weekend Pattern 1
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setSelectedDays(['SAT', 'SUN'])}
                        className={`py-2 rounded-lg text-xs font-bold border ${
                          JSON.stringify(selectedDays) === JSON.stringify(['SAT', 'SUN'])
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        Sat-Sun
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedDays(['FRI', 'SAT'])}
                        className={`py-2 rounded-lg text-xs font-bold border ${
                          JSON.stringify(selectedDays) === JSON.stringify(['FRI', 'SAT'])
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        Fri-Sat
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                      Weekend Pattern 2
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setSelectedDays(['SUN'])}
                        className={`py-2 rounded-lg text-xs font-bold border ${
                          JSON.stringify(selectedDays) === JSON.stringify(['SUN'])
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        Sun Only
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedDays(['SAT'])}
                        className={`py-2 rounded-lg text-xs font-bold border ${
                          JSON.stringify(selectedDays) === JSON.stringify(['SAT'])
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        Sat Only
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    Alternation Frequency
                  </label>
                  <select className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm font-bold text-orange-600 outline-none">
                    <option>Every Week</option>
                    <option>Every 2 Weeks</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="text-[10px] text-gray-500 italic">
              Note: System will automatically assign alternating patterns to employees for fair distribution of weekends.
            </div>
          </div>
        );

      case 'CUSTOM_CYCLE':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Select Custom Off Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button 
                    key={day.value}
                    type="button"
                    onClick={() => toggleCustomDay(day.value as DayOfWeek)}
                    className={`py-3 rounded-xl text-xs font-black transition-all border ${
                      customPattern.includes(day.value as DayOfWeek)
                        ? 'bg-green-500 text-white border-green-500 shadow-lg'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Cycle Length
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-green-500/5 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">weeks</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Cycle Description
                </label>
                <textarea
                  value={cycleDescription}
                  onChange={(e) => setCycleDescription(e.target.value)}
                  placeholder="Describe the custom cycle pattern..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-green-500/5 outline-none"
                  maxLength={200}
                />
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl">
              <div className="flex items-center gap-3">
                <CalendarDays size={20} className="text-green-500" />
                <div>
                  <p className="text-xs font-bold text-green-700">Custom Cycle Summary</p>
                  <p className="text-[10px] text-green-600">
                    {customPattern.length > 0 
                      ? `Off days: ${customPattern.map(day => 
                          DAYS_OF_WEEK.find(d => d.value === day)?.short
                        ).join(', ')}`
                      : 'No days selected'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create Weekly Off Rule' : 'Edit Weekly Off Rule'}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {mode === 'edit' ? `Editing: ${rule?.code}` : 'Define new weekly off pattern'}
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
                      placeholder="WK-OFF-001"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider focus:ring-4 focus:ring-blue-500/5 outline-none"
                      maxLength={12}
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
                    placeholder="Sat-Sun Standard Off"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
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
                    Rule Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {RULE_TYPES.map(ruleType => (
                      <button
                        key={ruleType.value}
                        type="button"
                        onClick={() => setType(ruleType.value as RuleType)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                          type === ruleType.value
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${ruleType.color} flex items-center justify-center text-white`}>
                          {React.createElement(ruleType.icon, { size: 12 })}
                        </div>
                        {ruleType.label}
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
                    placeholder="Describe the weekly off pattern and its purpose..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-blue-500/5 outline-none"
                    maxLength={200}
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: RULE TYPE SPECIFIC SETTINGS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 size={16} /> Rule Configuration
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Timer size={14} />
                  <span>{calculateCycleLength()} day cycle</span>
                </div>
              </div>
              
              {renderRuleTypeContent()}
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-800">Pattern Preview</p>
                    <p className="text-[10px] text-blue-600">{generatePatternString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-800">Days Per Cycle</p>
                    <p className="text-[10px] text-blue-600">{calculateCycleLength()} days total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: ADVANCED SETTINGS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} /> Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Allow Override
                      </label>
                      <p className="text-[10px] text-gray-500">Employees can request changes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowOverride(!allowOverride)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        allowOverride ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        allowOverride ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  {allowOverride && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Override Requires Approval
                      </label>
                      <button
                        type="button"
                        onClick={() => setOverrideApprovalRequired(!overrideApprovalRequired)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          overrideApprovalRequired
                            ? 'bg-orange-50 text-orange-600 border-orange-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {overrideApprovalRequired ? (
                          <>
                            <CheckCircle2 size={14} /> Manager Approval Required
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} /> Auto-approved
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Holiday Handling
                  </label>
                  <div className="space-y-3">
                    {HOLIDAY_HANDLING_OPTIONS.map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          holidayHandling === option.value
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="holidayHandling"
                          value={option.value}
                          checked={holidayHandling === option.value}
                          onChange={(e) => setHolidayHandling(e.target.value as any)}
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
                    Max Consecutive Work Days
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={maxConsecutiveWorkDays}
                      onChange={(e) => setMaxConsecutiveWorkDays(parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Maximum allowed back-to-back work days</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Min Off Days Between Shifts
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={minOffDaysBetweenShifts}
                      onChange={(e) => setMinOffDaysBetweenShifts(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Minimum rest between shift cycles</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Compliance Level
                  </label>
                  <select
                    value={complianceLevel}
                    onChange={(e) => setComplianceLevel(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                  >
                    <option value="HIGH">High Compliance</option>
                    <option value="MEDIUM">Medium Compliance</option>
                    <option value="LOW">Low Compliance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION D: META INFORMATION */}
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
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
                    Effective From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Standard, Weekend, Office, Compliance"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                />
              </div>
            </div>

            {/* SECTION E: COMPLIANCE INFO */}
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex gap-4">
              <Info className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Payroll & Compliance Impact</p>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  Calculations for "Work on Weekly Off" will be triggered if employees punch in during designated rest periods. 
                  Holiday pay rules apply based on selected holiday handling method. Maximum consecutive work days must comply with labor laws.
                </p>
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
            disabled={!code.trim() || !name.trim() || !effectiveFrom || 
              (type === 'FIXED' && selectedDays.length === 0) ||
              (type === 'ROTATING' && (workDays <= 0 || offDays <= 0)) ||
              (type === 'CUSTOM_CYCLE' && customPattern.length === 0)}
            className="flex-[2] py-3 bg-gradient-to-r from-blue-500 to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> {mode === 'create' ? 'Create Weekly Off Rule' : 'Update Weekly Off Rule'}
          </button>
        </div>
      </div>
    </div>
  );
};

// View Modal Component
const ViewWeeklyOffRuleModal: React.FC<{
  rule: WeeklyOffRule;
  onClose: () => void;
  onEdit: () => void;
}> = ({ rule, onClose, onEdit }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getRuleTypeIcon = (type: RuleType) => {
    const ruleType = RULE_TYPES.find(t => t.value === type);
    return ruleType ? React.createElement(ruleType.icon, { size: 20 }) : <CalendarCheck size={20} />;
  };

  const getRuleTypeColor = (type: RuleType) => {
    const ruleType = RULE_TYPES.find(t => t.value === type);
    return ruleType?.color || 'bg-blue-500';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${getRuleTypeColor(rule.type)} flex items-center justify-center text-white shadow-lg`}>
              {getRuleTypeIcon(rule.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{rule.name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {rule.code} • {STATUS_CONFIG[rule.status].label}
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
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Rule Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Code</span>
                    <span className="text-sm font-black text-blue-600">{rule.code}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Type</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg ${getRuleTypeColor(rule.type)} flex items-center justify-center text-white`}>
                        {getRuleTypeIcon(rule.type)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        {RULE_TYPES.find(t => t.value === rule.type)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_CONFIG[rule.status].color}`}>
                      {STATUS_CONFIG[rule.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Assigned Employees</span>
                    <span className="text-sm font-black text-indigo-600">{rule.employeeCount}</span>
                  </div>
                  {rule.description && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-800">Description</p>
                      <p className="text-sm text-gray-700 mt-1">{rule.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Pattern Details</h4>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700">Pattern</span>
                    <span className="text-sm font-black text-blue-800">{rule.pattern}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-3">
                    {DAYS_OF_WEEK.map(day => (
                      <div
                        key={day.value}
                        className={`py-2 rounded-lg text-center text-xs font-bold ${
                          rule.weekendDays.includes(day.value as DayOfWeek)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {day.short}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Settings & Policies</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Allow Override</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      rule.allowOverride
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.allowOverride ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Holiday Handling</span>
                    <span className="text-sm font-bold text-gray-800">
                      {HOLIDAY_HANDLING_OPTIONS.find(h => h.value === rule.holidayHandling)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">Compliance</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${COMPLIANCE_CONFIG[rule.complianceLevel].color}`}>
                      {COMPLIANCE_CONFIG[rule.complianceLevel].label}
                    </span>
                  </div>
                  {rule.maxConsecutiveWorkDays && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold text-gray-600">Max Consecutive Work Days</span>
                      <span className="text-sm font-bold text-gray-800">{rule.maxConsecutiveWorkDays} days</span>
                    </div>
                  )}
                  {rule.minOffDaysBetweenShifts && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold text-gray-600">Min Off Days Between Shifts</span>
                      <span className="text-sm font-bold text-gray-800">{rule.minOffDaysBetweenShifts} days</span>
                    </div>
                  )}
                </div>
              </div>

              {rule.rotationPattern && (
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Rotation Details</h4>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-black text-purple-600">{rule.rotationPattern.workDays}</p>
                        <p className="text-[10px] text-purple-800 uppercase font-bold">Work Days</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-violet-600">{rule.rotationPattern.offDays}</p>
                        <p className="text-[10px] text-violet-800 uppercase font-bold">Off Days</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs font-bold text-purple-700">{rule.rotationPattern.cycleLength} day cycle</p>
                      <p className="text-[10px] text-purple-600">Started: {formatDate(rule.rotationPattern.startDate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Meta Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Department</p>
                <p className="text-sm font-bold text-gray-800">{rule.department || 'All Departments'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
                <p className="text-sm font-bold text-gray-800">{rule.location || 'All Locations'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Effective Period</p>
                <p className="text-sm font-bold text-gray-800">
                  {formatDate(rule.effectiveFrom)}
                  {rule.effectiveTo && ` - ${formatDate(rule.effectiveTo)}`}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Created: {formatDate(rule.createdAt)} by {rule.createdBy}</span>
                <span>Updated: {formatDate(rule.updatedAt)}</span>
              </div>
              {rule.tags && rule.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {rule.tags.map(tag => (
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
            className="flex-[2] py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Edit3 size={16} /> Edit Weekly Off Rule
          </button>
        </div>
      </div>
    </div>
  );
};

export const WeeklyOffRules: React.FC = () => {
  const [rules, setRules] = useState<WeeklyOffRule[]>(ENHANCED_MOCK_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRule, setSelectedRule] = useState<WeeklyOffRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | RuleType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [filterCompliance, setFilterCompliance] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = 
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'ALL' || rule.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || rule.status === filterStatus;
      const matchesDepartment = filterDepartment === 'ALL' || 
        (rule.department && rule.department.includes(filterDepartment));
      const matchesCompliance = filterCompliance === 'ALL' || rule.complianceLevel === filterCompliance;
      
      return matchesSearch && matchesType && matchesStatus && matchesDepartment && matchesCompliance;
    });
  }, [rules, searchQuery, filterType, filterStatus, filterDepartment, filterCompliance]);

  const stats = useMemo(() => {
    const totalRules = rules.length;
    const activeRules = rules.filter(r => r.status === 'ACTIVE').length;
    const totalEmployees = rules.reduce((sum, r) => sum + r.employeeCount, 0);
    const fixedRules = rules.filter(r => r.type === 'FIXED').length;
    const rotatingRules = rules.filter(r => r.type === 'ROTATING').length;
    const avgCompliance = rules.reduce((sum, r) => sum + (r.auditScore || 0), 0) / rules.length;
    
    return { totalRules, activeRules, totalEmployees, fixedRules, rotatingRules, avgCompliance: Math.round(avgCompliance) };
  }, [rules]);

  const handleCreateRule = () => {
    setSelectedRule(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditRule = (rule: WeeklyOffRule) => {
    setSelectedRule(rule);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewRule = (rule: WeeklyOffRule) => {
    setSelectedRule(rule);
    setIsViewModalOpen(true);
  };

  const handleDuplicateRule = (rule: WeeklyOffRule) => {
    const newRule: WeeklyOffRule = {
      ...rule,
      id: `WOR-${Math.floor(Math.random() * 900) + 100}`,
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
      alert('Cannot delete weekly off rule with assigned employees');
      return;
    }
    if (window.confirm('Are you sure you want to delete this weekly off rule?')) {
      setRules(prev => prev.filter(r => r.id !== ruleId));
    }
    setActiveActionMenu(null);
  };

  const handleSaveRule = (ruleData: Omit<WeeklyOffRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount'>) => {
    if (modalMode === 'edit' && selectedRule) {
      setRules(prev => prev.map(rule => 
        rule.id === selectedRule.id 
          ? { 
              ...ruleData as WeeklyOffRule, 
              id: selectedRule.id, 
              employeeCount: selectedRule.employeeCount,
              createdBy: selectedRule.createdBy,
              createdAt: selectedRule.createdAt, 
              updatedAt: new Date().toISOString() 
            }
          : rule
      ));
    } else {
      const newRule: WeeklyOffRule = {
        ...ruleData as WeeklyOffRule,
        id: `WOR-${Math.floor(Math.random() * 900) + 100}`,
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

  const getRuleTypeColor = (type: RuleType) => {
    const ruleType = RULE_TYPES.find(t => t.value === type);
    return ruleType?.color || 'bg-blue-500';
  };

  const getRuleTypeIcon = (type: RuleType) => {
    const ruleType = RULE_TYPES.find(t => t.value === type);
    return ruleType ? React.createElement(ruleType.icon, { size: 18 }) : <CalendarCheck size={18} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarCheck className="text-[#3E3B6F]" size={28} /> Enhanced Weekly Off Rules
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">
            Comprehensive weekly off pattern management with rotation cycles and compliance tracking
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
            onClick={handleCreateRule}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Rule
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Rules</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.totalRules}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Rules</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.activeRules}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Covered Employees</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{stats.totalEmployees}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Fixed vs Rotating</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">
              {stats.fixedRules}:{stats.rotatingRules}
            </span>
          </div>
        </div>
      </div>

      {/* GLOBAL WEEKLY OFF SETTINGS */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 size={20} className="text-blue-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Global Weekly Off Policies</h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all">
            <ClipboardCheck size={14} /> Configure
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Weekend</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-blue-600 focus:ring-4 focus:ring-blue-500/5">
              <option>Saturday - Sunday</option>
              <option>Friday - Saturday</option>
              <option>Sunday Only</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Holiday Impact</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-blue-600 focus:ring-4 focus:ring-blue-500/5">
              <option>Extend adjacent weekly off</option>
              <option>Separate from weekly off</option>
              <option>Count as additional off</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Work Streak</label>
            <div className="relative">
              <input
                type="number"
                defaultValue="12"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-blue-600 focus:ring-4 focus:ring-blue-500/5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days</span>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Info size={14} className="text-blue-500" />
            <span className="font-medium">These global policies serve as defaults and can be overridden by individual rule configurations.</span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-0 !m-0 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search rule name, code, description, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/10 outline-none"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="FIXED">Fixed</option>
          <option value="ROTATING">Rotating</option>
          <option value="CUSTOM_CYCLE">Custom Cycle</option>
          <option value="ALT_WEEKENDS">Alternate Weekends</option>
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
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.filter(d => d !== 'All').map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
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
              <ShieldCheck size={18} className="text-green-500" /> Weekly Off Rules List
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
                  <th className="px-6 py-4">Pattern Type</th>
                  <th className="px-6 py-4">Off Pattern</th>
                  <th className="px-6 py-4 text-center">Employees</th>
                  <th className="px-6 py-4">Effective Period</th>
                  <th className="px-6 py-4">Status & Compliance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${getRuleTypeColor(rule.type)}/10 border-${getRuleTypeColor(rule.type).replace('bg-', '')}/20 text-${getRuleTypeColor(rule.type).replace('bg-', '')}`}>
                          {getRuleTypeIcon(rule.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                            <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {rule.code}
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">
                            {RULE_TYPES.find(t => t.value === rule.type)?.label}
                          </p>
                          {rule.description && (
                            <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-1">{rule.description}</p>
                          )}
                          {rule.tags && rule.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {rule.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                              {rule.tags.length > 2 && (
                                <span className="text-[8px] font-bold text-gray-400">+{rule.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            rule.type === 'FIXED' ? 'bg-blue-50 text-blue-600' :
                            rule.type === 'ROTATING' ? 'bg-purple-50 text-purple-600' :
                            rule.type === 'CUSTOM_CYCLE' ? 'bg-green-50 text-green-600' :
                            'bg-orange-50 text-orange-600'
                          }`}>
                            {rule.type.replace('_', ' ')}
                          </span>
                          {rule.allowOverride && (
                            <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                              Override Allowed
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500">
                          {rule.rotationPattern ? `${rule.rotationPattern.workDays}/${rule.rotationPattern.offDays}` : 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-tighter border border-gray-200">
                          {rule.pattern}
                        </span>
                        {rule.weekendDays.length > 0 && (
                          <div className="flex gap-1">
                            {DAYS_OF_WEEK.map(day => (
                              <div
                                key={day.value}
                                className={`w-5 h-5 rounded text-[8px] flex items-center justify-center ${
                                  rule.weekendDays.includes(day.value as DayOfWeek)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                                title={day.label}
                              >
                                {day.short.charAt(0)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#3E3B6F]/5 rounded-lg text-xs font-black text-[#3E3B6F] tabular-nums">
                        <Users size={12} /> {rule.employeeCount}
                      </div>
                      {rule.department && (
                        <p className="text-[9px] text-gray-500 mt-1 truncate max-w-[100px] mx-auto">
                          {rule.department.split(',')[0]}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-gray-500 tabular-nums">
                          {new Date(rule.effectiveFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {rule.effectiveTo && (
                          <p className="text-[10px] text-gray-400">
                            to {new Date(rule.effectiveTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[rule.status].color}`}>
                          {STATUS_CONFIG[rule.status].label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold ${COMPLIANCE_CONFIG[rule.complianceLevel].color}`}>
                          {COMPLIANCE_CONFIG[rule.complianceLevel].label}
                        </span>
                      </div>
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
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Rule"
                        >
                          <Edit3 size={16} />
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
                                <Copy size={14} /> Duplicate Rule
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
                <CalendarCheck size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Weekly Off Rules Found</h3>
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
                  Active: {stats.activeRules}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Fixed: {stats.fixedRules}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Rotating: {stats.rotatingRules}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                <RefreshCcw size={14} /> Refresh
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
                <CalendarCheck size={80} />
              </div>
              <div className="flex flex-col h-full relative z-10">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${getRuleTypeColor(rule.type)}/10 border-${getRuleTypeColor(rule.type).replace('bg-', '')}/20 text-${getRuleTypeColor(rule.type).replace('bg-', '')}`}>
                        {getRuleTypeIcon(rule.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-800">{rule.name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{rule.code}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${STATUS_CONFIG[rule.status].color}`}>
                        {STATUS_CONFIG[rule.status].label}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${COMPLIANCE_CONFIG[rule.complianceLevel].color}`}>
                        {COMPLIANCE_CONFIG[rule.complianceLevel].label}
                      </span>
                    </div>
                  </div>
                  
                  {rule.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-3">{rule.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                      <p className="text-lg font-black text-blue-600">{rule.employeeCount}</p>
                      <p className="text-[10px] text-blue-800 uppercase font-bold">Employees</p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl">
                      <p className="text-lg font-black text-purple-600">
                        {rule.rotationPattern ? rule.rotationPattern.cycleLength : 'N/A'}
                      </p>
                      <p className="text-[10px] text-purple-800 uppercase font-bold">Day Cycle</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Calendar size={14} className="text-blue-500" />
                      <span className="truncate">{rule.pattern}</span>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {DAYS_OF_WEEK.map(day => (
                        <div
                          key={day.value}
                          className={`py-1.5 rounded text-center text-[10px] font-bold ${
                            rule.weekendDays.includes(day.value as DayOfWeek)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          title={day.label}
                        >
                          {day.short}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {rule.allowOverride && (
                          <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            Override
                          </span>
                        )}
                        {rule.rotationPattern && (
                          <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                            Rotating
                          </span>
                        )}
                      </div>
                      {rule.maxConsecutiveWorkDays && (
                        <span className="text-[8px] font-bold text-gray-500">
                          Max {rule.maxConsecutiveWorkDays}d streak
                        </span>
                      )}
                    </div>
                    
                    {rule.tags && rule.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {rule.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-gray-500">
                        Effective: {new Date(rule.effectiveFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {rule.department?.split(',')[0] || 'All Depts'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewRule(rule)}
                      className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleEditRule(rule)}
                      className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:scale-105 transition-all"
                      title="Edit Rule"
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
      {isViewModalOpen && selectedRule && (
        <ViewWeeklyOffRuleModal
          rule={selectedRule}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            handleEditRule(selectedRule);
          }}
        />
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <WeeklyOffRuleForm
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