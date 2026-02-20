import React, { useState, useMemo } from 'react';
import { 
  Moon, 
  Sun, 
  Snowflake, 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  MoreVertical,  
  Edit3, 
  Power, 
  X,
  ShieldCheck,
  Bell,
  Info,
  Sparkles,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Copy,
  UserPlus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Layers,
  Grid3x3,
  CalendarDays,
  Coffee,
  Timer,
  Zap,
  Thermometer,
  Cloud,
  CloudRain,
  CloudSnow,
  Droplets,
  Wind,
  Coffee as CoffeeIcon,
  Target,
  Building2,
  MapPin,
  Shield,
  Check,
  AlertTriangle,
  Settings,
  Hash,
  Send,
  BellRing,
  CalendarClock,
  CalendarRange,
  Clock3,
  Users as UsersIcon,
  Edit2,
  Archive,
  ExternalLink,
  Printer,
  BellDot,
  ChevronDown,
  BarChart3,
  TrendingUp,
  FileText,
  Globe,
  Star,
  Heart,
  Trophy,
  Award,
  Flag,
  Church,
  Gift,
  PartyPopper
} from 'lucide-react';

// Primary color configuration
const PRIMARY_COLOR = '#1E1B4B';
const PRIMARY_LIGHT = '#4A457A';
const PRIMARY_DARK = '#0F0D24';
const ACCENT_COLOR = '#E8D5A3';

type SpecialType = 'RAMZAN' | 'SUMMER' | 'WINTER' | 'EVENT' | 'CUSTOM' | 'EID' | 'HOLIDAY_SEASON' | 'MAINTENANCE' | 'EMERGENCY';
type SpecialStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'DRAFT' | 'CANCELLED';
type ScopeType = 'ALL_EMPLOYEES' | 'DEPARTMENT' | 'LOCATION' | 'ROLE' | 'RELIGION' | 'CUSTOM_GROUP';
type BreakType = 'STANDARD_60' | 'RAMZAN_30' | 'SHORT_15' | 'TEA_20' | 'CUSTOM' | 'NONE';

interface SpecialShift {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: SpecialType;
  status: SpecialStatus;
  startDate: string;
  endDate: string;
  baseShift: string;
  modifiedStartTime: string;
  modifiedEndTime: string;
  breakType: BreakType;
  breakDuration?: number;
  breakStartTime?: string;
  scope: ScopeType;
  scopeDetails?: string;
  employeeCount: number;
  departments: string[];
  locations: string[];
  payMultiplier: number;
  requireApproval: boolean;
  autoAssign: boolean;
  notificationDays: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: string;
  tags: string[];
  overrideIdleTime?: number;
  gracePeriod?: number;
  specialNotes?: string;
}

interface BreakPattern {
  id: string;
  name: string;
  duration: number;
  startTime?: string;
  description: string;
  type: BreakType;
}

const TYPE_CONFIG: Record<SpecialType, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: React.ElementType;
  description: string;
}> = {
  RAMZAN: { 
    label: 'Ramzan', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50 border-amber-100',
    icon: Moon,
    description: 'Ramadan fasting month timing adjustments'
  },
  SUMMER: { 
    label: 'Summer', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50 border-orange-100',
    icon: Sun,
    description: 'Summer season with extended daylight hours'
  },
  WINTER: { 
    label: 'Winter', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50 border-blue-100',
    icon: Snowflake,
    description: 'Winter season with reduced daylight hours'
  },
  EVENT: { 
    label: 'Event', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50 border-purple-100',
    icon: Sparkles,
    description: 'Special company events or celebrations'
  },
  CUSTOM: { 
    label: 'Custom', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50 border-gray-100',
    icon: Calendar,
    description: 'Custom-defined special shift period'
  },
  EID: { 
    label: 'Eid', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50 border-green-100',
    icon: Star,
    description: 'Eid holiday period adjustments'
  },
  HOLIDAY_SEASON: { 
    label: 'Holiday Season', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50 border-red-100',
    icon: Gift,
    description: 'Year-end holiday season adjustments'
  },
  MAINTENANCE: { 
    label: 'Maintenance', 
    color: 'text-cyan-600', 
    bgColor: 'bg-cyan-50 border-cyan-100',
    icon: Settings,
    description: 'Facility maintenance period adjustments'
  },
  EMERGENCY: { 
    label: 'Emergency', 
    color: 'text-rose-600', 
    bgColor: 'bg-rose-50 border-rose-100',
    icon: AlertTriangle,
    description: 'Emergency or crisis situation adjustments'
  },
};

const STATUS_CONFIG: Record<SpecialStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
}> = {
  UPCOMING: { label: 'Upcoming', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },
  ACTIVE: { label: 'Active', color: 'text-green-600', bgColor: 'bg-green-50 border-green-100' },
  COMPLETED: { label: 'Completed', color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-100' },
  DRAFT: { label: 'Draft', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-100' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-50 border-red-100' },
};

const SCOPE_CONFIG: Record<ScopeType, { 
  label: string; 
  icon: React.ElementType;
}> = {
  ALL_EMPLOYEES: { label: 'All Employees', icon: Users },
  DEPARTMENT: { label: 'Department', icon: Building2 },
  LOCATION: { label: 'Location', icon: MapPin },
  ROLE: { label: 'Role', icon: Shield },
  RELIGION: { label: 'Religion', icon: Church },
  CUSTOM_GROUP: { label: 'Custom Group', icon: UsersIcon },
};

const BREAK_PATTERNS: BreakPattern[] = [
  { id: 'BREAK-60', name: 'Standard Lunch', duration: 60, description: 'Regular 1-hour lunch break', type: 'STANDARD_60' },
  { id: 'BREAK-30', name: 'Ramzan Short Break', duration: 30, description: '30-minute break for fasting employees', type: 'RAMZAN_30' },
  { id: 'BREAK-15', name: 'Tea Break', duration: 15, description: 'Short 15-minute tea break', type: 'SHORT_15' },
  { id: 'BREAK-20', name: 'Prayer Break', duration: 20, description: '20-minute prayer break', type: 'TEA_20' },
  { id: 'BREAK-0', name: 'No Break', duration: 0, description: 'No scheduled breaks', type: 'NONE' },
  { id: 'BREAK-CUSTOM', name: 'Custom Break', duration: 0, description: 'Custom break configuration', type: 'CUSTOM' },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Sales', 'Marketing', 'Support', 'HR', 'Finance', 'Retail', 'Manufacturing'];
const LOCATIONS = ['All', 'Karachi HQ', 'Lahore Office', 'Islamabad Office', 'Dubai Office', 'London Hub', 'New York Office', 'Factory Site', 'Remote Teams'];
const BASE_SHIFTS = ['General Flexi', 'Morning Shift', 'Evening Shift', 'Night Shift', 'Part-time', 'Remote', 'Field Ops', 'Head Office'];

// Enhanced Mock Data
const ENHANCED_MOCK_SPECIALS: SpecialShift[] = [
  { 
    id: 'SS-001', 
    code: 'RAMZAN-2025-001',
    name: 'Ramzan Timing 2025', 
    description: 'Special working hours during Ramadan fasting month for Muslim employees',
    type: 'RAMZAN', 
    status: 'ACTIVE',
    startDate: '2025-03-01', 
    endDate: '2025-03-30', 
    baseShift: 'All Shifts', 
    modifiedStartTime: '09:00',
    modifiedEndTime: '16:00',
    breakType: 'RAMZAN_30',
    breakDuration: 30,
    breakStartTime: '13:00',
    scope: 'RELIGION',
    scopeDetails: 'Muslim Employees',
    employeeCount: 350,
    departments: ['All'],
    locations: ['All'],
    payMultiplier: 1.0,
    requireApproval: false,
    autoAssign: true,
    notificationDays: 7,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-02-28T09:00:00Z',
    createdBy: 'HR Manager',
    isPublished: true,
    publishedAt: '2025-02-28T09:00:00Z',
    publishedBy: 'HR Manager',
    tags: ['Ramadan', 'Fasting', 'Religious'],
    overrideIdleTime: 15,
    gracePeriod: 10,
    specialNotes: 'Prayer room accessible throughout the day. Light snacks provided at iftar time.'
  },
  { 
    id: 'SS-002', 
    code: 'SUMMER-2025-001',
    name: 'Summer Core Hours 2025', 
    description: 'Extended summer hours with early start to avoid afternoon heat',
    type: 'SUMMER', 
    status: 'UPCOMING',
    startDate: '2025-06-01', 
    endDate: '2025-08-31', 
    baseShift: 'General Flexi', 
    modifiedStartTime: '08:00',
    modifiedEndTime: '15:00',
    breakType: 'STANDARD_60',
    breakDuration: 60,
    breakStartTime: '12:00',
    scope: 'ALL_EMPLOYEES',
    employeeCount: 850,
    departments: ['All'],
    locations: ['All'],
    payMultiplier: 1.0,
    requireApproval: false,
    autoAssign: true,
    notificationDays: 14,
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
    createdBy: 'Operations Director',
    isPublished: true,
    publishedAt: '2025-05-15T09:00:00Z',
    publishedBy: 'Operations Director',
    tags: ['Summer', 'Heat', 'Seasonal'],
    gracePeriod: 15,
    specialNotes: 'Air-conditioned facilities available. Water coolers installed on all floors.'
  },
  { 
    id: 'SS-003', 
    code: 'EVENT-2025-001',
    name: 'Annual Strategy Week', 
    description: 'Special timing for annual corporate strategy planning',
    type: 'EVENT', 
    status: 'UPCOMING',
    startDate: '2025-01-15', 
    endDate: '2025-01-20', 
    baseShift: 'Head Office', 
    modifiedStartTime: '10:00',
    modifiedEndTime: '17:00',
    breakType: 'STANDARD_60',
    breakDuration: 60,
    breakStartTime: '13:00',
    scope: 'DEPARTMENT',
    scopeDetails: 'Management, Strategy, Leadership',
    employeeCount: 45,
    departments: ['Management', 'Strategy'],
    locations: ['Karachi HQ', 'London Hub'],
    payMultiplier: 1.0,
    requireApproval: false,
    autoAssign: true,
    notificationDays: 21,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    createdBy: 'CEO Office',
    isPublished: true,
    publishedAt: '2024-12-15T09:00:00Z',
    publishedBy: 'CEO Office',
    tags: ['Strategy', 'Planning', 'Management'],
    specialNotes: 'Catered lunches provided. All hands meetings scheduled daily at 4 PM.'
  },
  { 
    id: 'SS-004', 
    code: 'WINTER-2024-001',
    name: 'Winter Daylight Shift', 
    description: 'Adjusted winter hours to maximize daylight',
    type: 'WINTER', 
    status: 'COMPLETED',
    startDate: '2024-11-01', 
    endDate: '2024-12-31', 
    baseShift: 'Field Ops', 
    modifiedStartTime: '08:30',
    modifiedEndTime: '16:30',
    breakType: 'STANDARD_60',
    breakDuration: 60,
    breakStartTime: '12:30',
    scope: 'LOCATION',
    scopeDetails: 'Field Staff',
    employeeCount: 120,
    departments: ['Operations', 'Field Teams'],
    locations: ['Field Site'],
    payMultiplier: 1.0,
    requireApproval: false,
    autoAssign: true,
    notificationDays: 10,
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2024-12-31T09:00:00Z',
    createdBy: 'Field Manager',
    isPublished: true,
    publishedAt: '2024-10-15T09:00:00Z',
    publishedBy: 'Field Manager',
    tags: ['Winter', 'Field', 'Seasonal'],
    specialNotes: 'Winter gear provided. Hot beverage stations setup at all field locations.'
  },
  { 
    id: 'SS-005', 
    code: 'EID-2025-001',
    name: 'Eid-ul-Fitr Special Timing', 
    description: 'Reduced hours during Eid celebrations',
    type: 'EID', 
    status: 'DRAFT',
    startDate: '2025-04-10', 
    endDate: '2025-04-12', 
    baseShift: 'All Shifts', 
    modifiedStartTime: '10:00',
    modifiedEndTime: '14:00',
    breakType: 'NONE',
    scope: 'ALL_EMPLOYEES',
    employeeCount: 0,
    departments: ['All'],
    locations: ['All'],
    payMultiplier: 2.5,
    requireApproval: false,
    autoAssign: true,
    notificationDays: 5,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    createdBy: 'HR Manager',
    isPublished: false,
    tags: ['Eid', 'Celebration', 'Holiday'],
    specialNotes: 'Voluntary work only. Triple pay for working employees.'
  },
];

type ViewMode = 'LIST' | 'GRID' | 'DETAIL';

// Create Special Shift Modal Component
const CreateSpecialShiftModal: React.FC<{
  onClose: () => void;
  onCreate: (data: Omit<SpecialShift, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount' | 'isPublished'>) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SpecialType>('RAMZAN');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseShift, setBaseShift] = useState('All Shifts');
  const [modifiedStartTime, setModifiedStartTime] = useState('09:00');
  const [modifiedEndTime, setModifiedEndTime] = useState('16:00');
  const [breakType, setBreakType] = useState<BreakType>('RAMZAN_30');
  const [breakDuration, setBreakDuration] = useState(30);
  const [breakStartTime, setBreakStartTime] = useState('13:00');
  const [scope, setScope] = useState<ScopeType>('ALL_EMPLOYEES');
  const [scopeDetails, setScopeDetails] = useState('');
  const [departments, setDepartments] = useState<string[]>(['All']);
  const [locations, setLocations] = useState<string[]>(['All']);
  const [payMultiplier, setPayMultiplier] = useState(1.0);
  const [requireApproval, setRequireApproval] = useState(false);
  const [autoAssign, setAutoAssign] = useState(true);
  const [notificationDays, setNotificationDays] = useState(7);
  const [tags, setTags] = useState<string>('');
  const [overrideIdleTime, setOverrideIdleTime] = useState<number | undefined>(15);
  const [gracePeriod, setGracePeriod] = useState<number | undefined>(10);
  const [specialNotes, setSpecialNotes] = useState('');

  const TypeIcon = TYPE_CONFIG[type].icon;

  const generateCode = () => {
    if (!name || !type) return;
    const typeCode = type.slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${typeCode}-${year}-${randomNum}`;
  };

  const handleCreate = () => {
    if (!name.trim() || !code.trim() || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const shiftData = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      type,
      status: 'DRAFT' as SpecialStatus,
      startDate,
      endDate,
      baseShift,
      modifiedStartTime,
      modifiedEndTime,
      breakType,
      breakDuration: breakType !== 'NONE' ? breakDuration : undefined,
      breakStartTime: breakType !== 'NONE' ? breakStartTime : undefined,
      scope,
      scopeDetails: scope === 'ALL_EMPLOYEES' ? undefined : scopeDetails,
      departments,
      locations,
      payMultiplier,
      requireApproval,
      autoAssign,
      notificationDays,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      overrideIdleTime,
      gracePeriod,
      specialNotes: specialNotes.trim(),
    };

    onCreate(shiftData);
  };

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${modifiedStartTime}`);
    const end = new Date(`2000-01-01T${modifiedEndTime}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff.toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1B4B] to-[#3B357A] flex items-center justify-center text-white shadow-lg">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Create Special Shift</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Temporary timing override configuration
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Shift Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!code) {
                        setCode(generateCode() || '');
                      }
                    }}
                    placeholder="Ramzan Timing 2025"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Shift Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="RAMZAN-2025-001"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                      maxLength={20}
                    />
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCode(generateCode() || '')}
                    className="text-[10px] text-[#1E1B4B] font-bold hover:underline"
                  >
                    Generate Code
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose and details of this special shift..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    maxLength={500}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Special Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(TYPE_CONFIG).slice(0, 6).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setType(key as SpecialType)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                            type === key
                              ? `${config.bgColor} ${config.color} border-2`
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={14} />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: TIMING CONFIGURATION */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} /> Timing Configuration
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Base Shift Pattern
                  </label>
                  <select
                    value={baseShift}
                    onChange={(e) => setBaseShift(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  >
                    {BASE_SHIFTS.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Modified Start Time
                  </label>
                  <input
                    type="time"
                    value={modifiedStartTime}
                    onChange={(e) => setModifiedStartTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E1B4B] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Modified End Time
                  </label>
                  <input
                    type="time"
                    value={modifiedEndTime}
                    onChange={(e) => setModifiedEndTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E1B4B] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-800">Shift Duration</p>
                    <p className="text-[10px] text-blue-600">{modifiedStartTime} to {modifiedEndTime} ({calculateDuration()} hours)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-600">Break</p>
                      <p className="text-sm font-black text-purple-600">{breakDuration} min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-600">Net Hours</p>
                      <p className="text-sm font-black text-green-600">
                        {(parseFloat(calculateDuration()) - (breakDuration / 60)).toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: BREAK CONFIGURATION */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Coffee size={16} /> Break Configuration
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Break Pattern
                  </label>
                  <select
                    value={breakType}
                    onChange={(e) => {
                      setBreakType(e.target.value as BreakType);
                      const pattern = BREAK_PATTERNS.find(p => p.type === e.target.value);
                      if (pattern) {
                        setBreakDuration(pattern.duration);
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  >
                    {BREAK_PATTERNS.map(pattern => (
                      <option key={pattern.id} value={pattern.type}>{pattern.name}</option>
                    ))}
                  </select>
                </div>

                {breakType !== 'NONE' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Break Duration (minutes)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="5"
                          max="120"
                          step="5"
                          value={breakDuration}
                          onChange={(e) => setBreakDuration(parseInt(e.target.value) || 30)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">min</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Break Start Time
                      </label>
                      <input
                        type="time"
                        value={breakStartTime}
                        onChange={(e) => setBreakStartTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {breakType !== 'NONE' && (
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Info size={16} className="text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-amber-800">Break Schedule</p>
                      <p className="text-[10px] text-amber-700">
                        Break of {breakDuration} minutes starting at {breakStartTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION D: SCOPE & APPLICABILITY */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Users size={16} /> Scope & Applicability
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Application Scope
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(SCOPE_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setScope(key as ScopeType)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                            scope === key
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={14} />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {scope !== 'ALL_EMPLOYEES' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Scope Details
                      </label>
                      <input
                        type="text"
                        value={scopeDetails}
                        onChange={(e) => setScopeDetails(e.target.value)}
                        placeholder={scope === 'DEPARTMENT' ? 'Engineering, Marketing, HR' : 
                                   scope === 'LOCATION' ? 'Karachi HQ, Factory Site' : 
                                   scope === 'ROLE' ? 'Managers, Executives' : 
                                   scope === 'RELIGION' ? 'Muslim Employees' : 'Group Name'}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Departments
                      </label>
                      <select
                        value={departments[0]}
                        onChange={(e) => setDepartments(e.target.value === 'All' ? ['All'] : [e.target.value])}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                      >
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Locations
                      </label>
                      <select
                        value={locations[0]}
                        onChange={(e) => setLocations(e.target.value === 'All' ? ['All'] : [e.target.value])}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                      >
                        {LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION E: ADVANCED SETTINGS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings size={16} /> Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Auto Assign Shift
                      </label>
                      <p className="text-[10px] text-gray-500">Automatically assign to eligible employees</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoAssign(!autoAssign)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        autoAssign ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        autoAssign ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Require Approval
                      </label>
                      <p className="text-[10px] text-gray-500">Managers must approve shift changes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRequireApproval(!requireApproval)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        requireApproval ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        requireApproval ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Notification Days
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={notificationDays}
                        onChange={(e) => setNotificationDays(parseInt(e.target.value) || 7)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days before</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Pay Multiplier
                    </label>
                    <select
                      value={payMultiplier}
                      onChange={(e) => setPayMultiplier(parseFloat(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    >
                      <option value="1.0">1.0x (Regular)</option>
                      <option value="1.5">1.5x (Standard OT)</option>
                      <option value="2.0">2.0x (Double OT)</option>
                      <option value="2.5">2.5x (Premium)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Override Idle Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={overrideIdleTime || ''}
                    onChange={(e) => setOverrideIdleTime(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    placeholder="Default"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Grace Period (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={gracePeriod || ''}
                    onChange={(e) => setGracePeriod(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    placeholder="Default"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Ramadan, Religious, Seasonal"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Special Notes
                </label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Additional information, facilities, or special arrangements..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[60px] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  maxLength={300}
                />
              </div>
            </div>

            {/* COMPLIANCE INFO */}
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex gap-4">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Shift Impact & Compliance</p>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  This special shift will affect {scope === 'ALL_EMPLOYEES' ? 'all employees' : scopeDetails || 'targeted employees'}. 
                  Ensure compliance with labor laws for {calculateDuration()} hour shifts with {breakDuration} minute breaks. 
                  {payMultiplier > 1.0 && ` ${payMultiplier}x pay multiplier applies.`}
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
            onClick={handleCreate}
            disabled={!name.trim() || !code.trim() || !startDate || !endDate}
            className="flex-[2] py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:shadow-2xl hover:shadow-[#1E1B4B]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> Create Special Shift
          </button>
        </div>
      </div>
    </div>
  );
};

// Publish Special Shift Modal Component
const PublishSpecialShiftModal: React.FC<{
  shift: SpecialShift;
  onClose: () => void;
  onPublish: (shiftId: string) => void;
}> = ({ shift, onClose, onPublish }) => {
  const [notifyEmployees, setNotifyEmployees] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(
    `Special shift "${shift.name}" will be effective from ${new Date(shift.startDate).toLocaleDateString()} to ${new Date(shift.endDate).toLocaleDateString()}.`
  );

  const handlePublish = () => {
    onPublish(shift.id);
  };

  const getAffectedCount = () => {
    return shift.employeeCount.toLocaleString();
  };

  const TypeIcon = TYPE_CONFIG[shift.type].icon;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <Send size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Publish Special Shift</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {shift.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${TYPE_CONFIG[shift.type].bgColor} flex items-center justify-center`}>
                <TypeIcon size={20} className={TYPE_CONFIG[shift.type].color} />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">Ready to Publish</p>
                <p className="text-[10px] text-green-600">
                  {shift.modifiedStartTime} - {shift.modifiedEndTime} • {getAffectedCount()} employees
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
              Shift Details
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period</p>
                <p className="text-sm font-bold text-gray-700">
                  {new Date(shift.startDate).toLocaleDateString()} - {new Date(shift.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timing</p>
                <p className="text-sm font-bold text-blue-600">
                  {shift.modifiedStartTime} - {shift.modifiedEndTime}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scope</p>
                <p className="text-sm font-bold text-gray-700">
                  {SCOPE_CONFIG[shift.scope].label}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pay Rate</p>
                <p className="text-sm font-bold text-purple-600">{shift.payMultiplier}x</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Notify Employees
                </label>
                <p className="text-[10px] text-gray-500">Send email notification to affected employees</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyEmployees(!notifyEmployees)}
                className={`w-12 h-6 rounded-full relative transition-all ${
                  notifyEmployees ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  notifyEmployees ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            {notifyEmployees && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Notification Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-blue-500/5 outline-none"
                  maxLength={500}
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Publishing Impact</p>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  Publishing this special shift will affect {getAffectedCount()} employees. 
                  Shift timings will override regular schedules during the specified period.
                  {shift.autoAssign && ' Employees will be automatically assigned to this shift.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="flex-[2] py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send size={16} /> Publish Shift
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export const SpecialShifts: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [shifts, setShifts] = useState<SpecialShift[]>(ENHANCED_MOCK_SPECIALS);
  const [selectedShift, setSelectedShift] = useState<SpecialShift | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<SpecialStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<SpecialType | 'ALL'>('ALL');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const matchesSearch = 
        shift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filterStatus === 'ALL' || shift.status === filterStatus;
      const matchesType = filterType === 'ALL' || shift.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [shifts, searchQuery, filterStatus, filterType]);

  const stats = useMemo(() => {
    const totalShifts = shifts.length;
    const activeShifts = shifts.filter(s => s.status === 'ACTIVE').length;
    const upcomingShifts = shifts.filter(s => s.status === 'UPCOMING').length;
    const employeesAffected = shifts.reduce((sum, shift) => sum + shift.employeeCount, 0);
    const ramzanShifts = shifts.filter(s => s.type === 'RAMZAN').length;
    
    return { totalShifts, activeShifts, upcomingShifts, employeesAffected, ramzanShifts };
  }, [shifts]);

  const activeRamzan = shifts.find(s => s.type === 'RAMZAN' && s.status === 'ACTIVE');

  const handleCreateShift = (data: Omit<SpecialShift, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount' | 'isPublished'>) => {
    const newShift: SpecialShift = {
      ...data,
      id: `SS-${Date.now()}`,
      employeeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      isPublished: false,
    };
    setShifts(prev => [newShift, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handlePublishShift = (shiftId: string) => {
    setShifts(prev => prev.map(shift => 
      shift.id === shiftId 
        ? { 
            ...shift, 
            status: 'UPCOMING' as SpecialStatus,
            isPublished: true,
            publishedAt: new Date().toISOString(),
            publishedBy: 'Current User',
            updatedAt: new Date().toISOString()
          }
        : shift
    ));
    setIsPublishModalOpen(false);
  };

  const handleDuplicateShift = (shift: SpecialShift) => {
    const newShift: SpecialShift = {
      ...shift,
      id: `SS-${Date.now()}`,
      code: `${shift.code}-COPY`,
      name: `${shift.name} (Copy)`,
      status: 'DRAFT',
      employeeCount: 0,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };
    setShifts(prev => [newShift, ...prev]);
    setActiveActionMenu(null);
  };

  const handleDeleteShift = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift?.employeeCount && shift.employeeCount > 0) {
      alert('Cannot delete shift with assigned employees');
      return;
    }
    if (window.confirm('Are you sure you want to delete this special shift?')) {
      setShifts(prev => prev.filter(s => s.id !== shiftId));
    }
    setActiveActionMenu(null);
  };

  const handleToggleStatus = (shiftId: string, newStatus: SpecialStatus) => {
    setShifts(prev => prev.map(shift => 
      shift.id === shiftId 
        ? { ...shift, status: newStatus, updatedAt: new Date().toISOString() }
        : shift
    ));
    setActiveActionMenu(null);
  };

  const handleViewDetails = (shift: SpecialShift) => {
    setSelectedShift(shift);
    setViewMode('DETAIL');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDurationDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getShiftTimingDisplay = (shift: SpecialShift) => {
    return `${shift.modifiedStartTime} - ${shift.modifiedEndTime}`;
  };

  const getBreakDisplay = (shift: SpecialShift) => {
    if (shift.breakType === 'NONE') return 'No Break';
    return `${shift.breakDuration} min at ${shift.breakStartTime}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarDays className="text-[#1E1B4B]" size={28} /> 
            <span className="bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] bg-clip-text text-transparent">
              Special Shifts
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">
            Manage time-limited overrides for seasonal or religious periods
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'LIST' 
                  ? 'bg-[#1E1B4B] text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers size={14} /> List
            </button>
            <button 
              onClick={() => setViewMode('GRID')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'GRID' 
                  ? 'bg-[#1E1B4B] text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3x3 size={14} /> Grid
            </button>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Special Shift
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Shifts</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1E1B4B]">{stats.totalShifts}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.activeShifts}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Upcoming</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600">{stats.upcomingShifts}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ramzan Shifts</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{stats.ramzanShifts}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] p-5 rounded-2xl shadow-xl shadow-[#1E1B4B]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Employees Affected</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.employeesAffected.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ACTIVE HIGHLIGHT CARD */}
      {activeRamzan && (
        <div className="bg-white rounded-3xl border border-amber-100 shadow-xl shadow-amber-500/5 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-4 border-b border-amber-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                <Moon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 leading-tight">🌙 Ramzan Timing - ACTIVE</h3>
                <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest">Currently Applied Policy</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-1.5 bg-white text-amber-600 rounded-lg text-xs font-bold border border-amber-200 hover:bg-amber-50 transition-all">End Early</button>
               <button 
                 onClick={() => handleViewDetails(activeRamzan)}
                 className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-amber-700 transition-all"
               >
                 View Schedule
               </button>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Period</p>
              <p className="text-sm font-bold text-gray-800">{formatDate(activeRamzan.startDate)} - {formatDate(activeRamzan.endDate)}</p>
              <p className="text-[10px] text-gray-500">{getDurationDays(activeRamzan.startDate, activeRamzan.endDate)} days</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modified Window</p>
              <p className="text-sm font-bold text-amber-600">{getShiftTimingDisplay(activeRamzan)}</p>
              <p className="text-[10px] text-amber-500">Break: {getBreakDisplay(activeRamzan)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scope</p>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-800">{activeRamzan.employeeCount} Employees</span>
              </div>
              <p className="text-[10px] text-gray-500">{activeRamzan.scopeDetails}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notifications</p>
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-blue-400" />
                <span className="text-sm font-bold text-gray-800">{activeRamzan.notificationDays} days advance</span>
              </div>
              <p className="text-[10px] text-gray-500">Auto-assigned: {activeRamzan.autoAssign ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 !mT-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search special shifts by name, code, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1E1B4B]/10 outline-none"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as SpecialStatus | 'ALL')}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
          <option value="DRAFT">Draft</option>
        </select>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as SpecialType | 'ALL')}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="RAMZAN">Ramzan</option>
          <option value="SUMMER">Summer</option>
          <option value="WINTER">Winter</option>
          <option value="EVENT">Event</option>
          <option value="EID">Eid</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Filter size={14} /> More Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Download size={14} /> Export
        </button>
      </div>

      {/* MAIN CONTENT */}
      {viewMode === 'DETAIL' && selectedShift ? (
        <div className="animate-in slide-in-from-right duration-500">
          {/* DETAIL VIEW HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode('LIST')}
                className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl hover:text-[#1E1B4B] hover:bg-[#1E1B4B]/5 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{selectedShift.name}</h2>
                  <span className="text-xs font-black text-[#1E1B4B] bg-[#1E1B4B]/5 px-2 py-0.5 rounded-lg">
                    {selectedShift.code}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{selectedShift.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={() => {
                  setSelectedShift(null);
                  setViewMode('LIST');
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                <X size={14} /> Close
              </button>
            </div>
          </div>

          {/* DETAIL VIEW CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              {/* SHIFT OVERVIEW CARD */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Shift Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timing Configuration</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Modified Hours</span>
                          <span className="text-sm font-bold text-[#1E1B4B]">{getShiftTimingDisplay(selectedShift)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Base Shift</span>
                          <span className="text-sm font-bold text-gray-700">{selectedShift.baseShift}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Break Pattern</span>
                          <span className="text-sm font-bold text-gray-700">{getBreakDisplay(selectedShift)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period Details</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Start Date</span>
                          <span className="text-sm font-bold text-gray-700">{formatDate(selectedShift.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">End Date</span>
                          <span className="text-sm font-bold text-gray-700">{formatDate(selectedShift.endDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Duration</span>
                          <span className="text-sm font-bold text-gray-700">
                            {getDurationDays(selectedShift.startDate, selectedShift.endDate)} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicability</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Scope</span>
                          <span className="text-sm font-bold text-gray-700">{SCOPE_CONFIG[selectedShift.scope].label}</span>
                        </div>
                        {selectedShift.scopeDetails && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Scope Details</span>
                            <span className="text-sm font-bold text-gray-700">{selectedShift.scopeDetails}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Affected Employees</span>
                          <span className="text-sm font-bold text-gray-700">{selectedShift.employeeCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compensation</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Pay Multiplier</span>
                          <span className={`text-sm font-bold ${selectedShift.payMultiplier > 1 ? 'text-green-600' : 'text-gray-700'}`}>
                            {selectedShift.payMultiplier}x
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Grace Period</span>
                          <span className="text-sm font-bold text-gray-700">{selectedShift.gracePeriod || 'Default'} min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Idle Time Override</span>
                          <span className="text-sm font-bold text-gray-700">{selectedShift.overrideIdleTime || 'Default'} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPECIAL NOTES CARD */}
              {selectedShift.specialNotes && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
                  <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={16} /> Special Notes & Arrangements
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">{selectedShift.specialNotes}</p>
                </div>
              )}

              {/* DEPARTMENTS & LOCATIONS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Departments & Locations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Departments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedShift.departments.map(dept => (
                        <span key={dept} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedShift.locations.map(loc => (
                        <span key={loc} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* STATUS & ACTIONS CARD */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Status & Actions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[selectedShift.status].bgColor} ${STATUS_CONFIG[selectedShift.status].color}`}>
                      {STATUS_CONFIG[selectedShift.status].label}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Published</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedShift.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                      {selectedShift.isPublished ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {selectedShift.isPublished && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Published At</span>
                        <span className="text-xs font-bold text-gray-700">
                          {new Date(selectedShift.publishedAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Published By</span>
                        <span className="text-xs font-bold text-gray-700">{selectedShift.publishedBy}</span>
                      </div>
                    </>
                  )}

                  <div className="pt-4 space-y-2">
                    {!selectedShift.isPublished && (
                      <button 
                        onClick={() => {
                          setSelectedShift(null);
                          setViewMode('LIST');
                          setIsPublishModalOpen(true);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
                      >
                        <Send className="inline mr-2" size={14} /> Publish Shift
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDuplicateShift(selectedShift)}
                      className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Copy size={14} /> Duplicate Shift
                    </button>

                    {selectedShift.status === 'DRAFT' && (
                      <button 
                        onClick={() => handleDeleteShift(selectedShift.id)}
                        className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Delete Draft
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* TYPE INFO CARD */}
              <div className={`rounded-2xl border p-6 shadow-sm ${TYPE_CONFIG[selectedShift.type].bgColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${TYPE_CONFIG[selectedShift.type].bgColor} border flex items-center justify-center`}>
                    {React.createElement(TYPE_CONFIG[selectedShift.type].icon, { 
                      size: 24, 
                      className: TYPE_CONFIG[selectedShift.type].color 
                    })}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-widest ${TYPE_CONFIG[selectedShift.type].color}`}>
                      {TYPE_CONFIG[selectedShift.type].label} Shift
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{TYPE_CONFIG[selectedShift.type].description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Auto Assign</span>
                    <span className="text-xs font-bold text-gray-700">{selectedShift.autoAssign ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Require Approval</span>
                    <span className="text-xs font-bold text-gray-700">{selectedShift.requireApproval ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Notification</span>
                    <span className="text-xs font-bold text-gray-700">{selectedShift.notificationDays} days</span>
                  </div>
                </div>
              </div>

              {/* TAGS CARD */}
              {selectedShift.tags && selectedShift.tags.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedShift.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* LIST/GRID VIEW */}
          <div className={`grid gap-4 ${viewMode === 'GRID' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredShifts.map(shift => {
              const TypeIcon = TYPE_CONFIG[shift.type].icon;
              const StatusConfig = STATUS_CONFIG[shift.status];
              const ScopeConfig = SCOPE_CONFIG[shift.scope];
              const ScopeIcon = SCOPE_CONFIG[shift.scope].icon;

              return (
                <div 
                  key={shift.id} 
                  className={`bg-white rounded-2xl border ${viewMode === 'GRID' ? 'p-6' : 'p-8'} transition-all hover:shadow-lg cursor-pointer`}
                  onClick={() => handleViewDetails(shift)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl ${TYPE_CONFIG[shift.type].bgColor} flex items-center justify-center`}>
                          <TypeIcon size={20} className={TYPE_CONFIG[shift.type].color} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 leading-tight">{shift.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-[#1E1B4B] bg-[#1E1B4B]/5 px-2 py-0.5 rounded-lg">
                              {shift.code}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${StatusConfig.bgColor} ${StatusConfig.color}`}>
                              {StatusConfig.label}
                            </span>
                            {!shift.isPublished && (
                              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-600">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{shift.description}</p>
                      
                      {viewMode === 'LIST' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timing</p>
                            <p className="text-sm font-bold text-gray-700">{getShiftTimingDisplay(shift)}</p>
                            <p className="text-xs text-gray-500">Break: {getBreakDisplay(shift)}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period</p>
                            <p className="text-sm font-bold text-gray-700">{formatDate(shift.startDate)} - {formatDate(shift.endDate)}</p>
                            <p className="text-xs text-gray-500">{getDurationDays(shift.startDate, shift.endDate)} days</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scope</p>
                            <div className="flex items-center gap-2">
                              <ScopeIcon size={14} className="text-gray-400" />
                              <span className="text-sm font-bold text-gray-700">{ScopeConfig.label}</span>
                            </div>
                            <p className="text-xs text-gray-500">{shift.employeeCount.toLocaleString()} employees</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS MENU */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMenu(activeActionMenu === shift.id ? null : shift.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {activeActionMenu === shift.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-2xl z-10 animate-in fade-in">
                          <div className="p-2 space-y-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(shift);
                                setActiveActionMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                            >
                              <Eye size={14} /> View Details
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateShift(shift);
                              }}
                              className="w-full px-4 py-2 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                            >
                              <Copy size={14} /> Duplicate
                            </button>
                            
                            {!shift.isPublished && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPublishModalOpen(true);
                                  setSelectedShift(shift);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-2"
                              >
                                <Send size={14} /> Publish
                              </button>
                            )}
                            
                            {shift.status === 'ACTIVE' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(shift.id, 'COMPLETED');
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                              >
                                <CheckCircle2 size={14} /> Mark Completed
                              </button>
                            )}
                            
                            {shift.status === 'UPCOMING' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(shift.id, 'ACTIVE');
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-lg flex items-center gap-2"
                              >
                                <Power size={14} /> Activate Now
                              </button>
                            )}
                            
                            {shift.status === 'DRAFT' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteShift(shift.id);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {viewMode === 'GRID' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timing</p>
                          <p className="text-sm font-bold text-[#1E1B4B]">{getShiftTimingDisplay(shift)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period</p>
                          <p className="text-sm font-bold text-gray-700">{formatDate(shift.startDate)} - {formatDate(shift.endDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <ScopeIcon size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-600">{shift.employeeCount.toLocaleString()} employees</span>
                        </div>
                        <span className={`text-xs font-bold ${shift.payMultiplier > 1 ? 'text-green-600' : 'text-gray-500'}`}>
                          {shift.payMultiplier}x pay
                        </span>
                      </div>
                    </div>
                  )}

                  {viewMode === 'LIST' && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarClock size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Created {new Date(shift.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-600">{shift.employeeCount.toLocaleString()} employees</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${shift.payMultiplier > 1 ? 'text-green-600' : 'text-gray-500'}`}>
                          {shift.payMultiplier}x pay
                        </span>
                        {shift.tags && shift.tags.length > 0 && (
                          <div className="flex gap-1">
                            {shift.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-full">
                                {tag}
                              </span>
                            ))}
                            {shift.tags.length > 2 && (
                              <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-full">
                                +{shift.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* EMPTY STATE */}
          {filteredShifts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Special Shifts Found</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                No special shifts match your current filters. Try adjusting your search or create a new special shift.
              </p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Plus size={18} /> Create First Special Shift
              </button>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      {isCreateModalOpen && (
        <CreateSpecialShiftModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateShift}
        />
      )}

      {isPublishModalOpen && selectedShift && (
        <PublishSpecialShiftModal
          shift={selectedShift}
          onClose={() => {
            setIsPublishModalOpen(false);
            setSelectedShift(null);
          }}
          onPublish={handlePublishShift}
        />
      )}
    </div>
  );
};