import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Settings2, 
  ChevronDown, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  Users,
  Search,
  X,
  ArrowRight,
  Info,
  History,
  ChevronRight,
  Filter,
  Download,
  Copy,
  Trash2,
  Eye,
  MoreVertical,
  ShieldCheck,
  FileText,
  Layers,
  BarChart3,
  RefreshCw,
  Hash,
  Clock,
  CalendarDays,
  Bell,
  Target,
  Clock3,
  Timer,
  AlertTriangle,
  UserCheck,
  Upload,
  Save,
  CopyCheck,
  TrendingUp,
  Zap,
  Moon,
  Sun,
  PieChart,
  ClipboardCheck,
  Link as LinkIcon,
  CalendarRange,
  Check,
  AlertOctagon,
  Coffee,
  Shield,
  BookOpen,
  Settings,
  Target as TargetIcon
} from 'lucide-react';

type SatStatus = 'WORKING' | 'OFF' | 'HALF_DAY' | 'COMPRESSED';
type SatPattern = 'ALL_WORKING' | 'ALL_OFF' | 'ALT_1_3_WORKING' | 'ALT_2_4_WORKING' | 'CUSTOM' | 'ALT_1_3_OFF' | 'ALT_2_4_OFF';
type OverrideType = 'GLOBAL_HOLIDAY' | 'SPECIAL_EVENT' | 'MAINTENANCE' | 'PERSONNEL_SHORTAGE' | 'WEATHER' | 'OTHER';
type ScopeType = 'ALL_EMPLOYEES' | 'DEPARTMENT' | 'LOCATION' | 'ROLE' | 'CUSTOM_GROUP';

interface AlternateSaturdayRule {
  id: string;
  code: string;
  name: string;
  description?: string;
  pattern: SatPattern;
  year: number;
  scope: ScopeType;
  scopeDetails?: string;
  defaultStatus: SatStatus;
  halfDayHours?: number;
  compressedWeekHours?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  location?: string;
  employeeCount: number;
  complianceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  auditScore?: number;
  tags: string[];
  allowDepartmentOverride: boolean;
  requireManagerApproval: boolean;
  notificationDays: number;
  payMultiplier: number;
  maxConsecutiveWorking: number;
}

interface SaturdayOverride {
  id: string;
  date: string;
  originalStatus: SatStatus;
  overrideStatus: SatStatus;
  type: OverrideType;
  reason: string;
  appliedTo: ScopeType;
  scopeDetails?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  effective: boolean;
}

interface SaturdayRecord {
  date: string;
  satNumber: number; // 1 to 5 within the month
  month: string;
  year: number;
  defaultStatus: SatStatus;
  override?: SaturdayOverride;
  finalStatus: SatStatus;
  isHoliday: boolean;
  holidayName?: string;
}

type ViewMode = 'CALENDAR' | 'LIST' | 'GRID';

const PATTERN_CONFIG = {
  ALL_WORKING: { 
    label: 'All Saturdays Working', 
    description: 'Every Saturday is a regular working day',
    color: 'bg-red-500'
  },
  ALL_OFF: { 
    label: 'All Saturdays Off', 
    description: 'Every Saturday is a weekly off day',
    color: 'bg-green-500'
  },
  ALT_1_3_WORKING: { 
    label: '1st & 3rd Saturdays Working', 
    description: 'First and third Saturdays working, others off',
    color: 'bg-blue-500'
  },
  ALT_2_4_WORKING: { 
    label: '2nd & 4th Saturdays Working', 
    description: 'Second and fourth Saturdays working, others off',
    color: 'bg-purple-500'
  },
  ALT_1_3_OFF: { 
    label: '1st & 3rd Saturdays Off', 
    description: 'First and third Saturdays off, others working',
    color: 'bg-orange-500'
  },
  ALT_2_4_OFF: { 
    label: '2nd & 4th Saturdays Off', 
    description: 'Second and fourth Saturdays off, others working',
    color: 'bg-cyan-500'
  },
  CUSTOM: { 
    label: 'Custom Pattern', 
    description: 'Custom defined Saturday pattern',
    color: 'bg-indigo-500'
  },
};

const STATUS_CONFIG = {
  WORKING: { label: 'Working', color: 'bg-red-50 text-red-600 border-red-100' },
  OFF: { label: 'Off', color: 'bg-green-50 text-green-600 border-green-100' },
  HALF_DAY: { label: 'Half Day', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  COMPRESSED: { label: 'Compressed', color: 'bg-purple-50 text-purple-600 border-purple-100' },
};

const OVERRIDE_TYPES = [
  { value: 'GLOBAL_HOLIDAY', label: 'Global Holiday', color: 'bg-red-100 text-red-700' },
  { value: 'SPECIAL_EVENT', label: 'Special Event', color: 'bg-blue-100 text-blue-700' },
  { value: 'MAINTENANCE', label: 'Maintenance', color: 'bg-orange-100 text-orange-700' },
  { value: 'PERSONNEL_SHORTAGE', label: 'Personnel Shortage', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'WEATHER', label: 'Weather', color: 'bg-gray-100 text-gray-700' },
  { value: 'OTHER', label: 'Other', color: 'bg-indigo-100 text-indigo-700' },
];

const SCOPE_OPTIONS = [
  { value: 'ALL_EMPLOYEES', label: 'All Employees', icon: Users },
  { value: 'DEPARTMENT', label: 'Department', icon: Building2 },
  { value: 'LOCATION', label: 'Location', icon: Target },
  { value: 'ROLE', label: 'Role', icon: UserCheck },
  { value: 'CUSTOM_GROUP', label: 'Custom Group', icon: Settings2 },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Sales', 'Marketing', 'Support', 'HR', 'Finance'];
const LOCATIONS = ['All', 'HQ Main', 'Dubai Office', 'Factory Site', 'Remote', 'Field Teams'];
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="p-8 bg-red-50 rounded-xl text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-bold text-red-700 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">Error loading the view. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Enhanced Mock Data
const ENHANCED_MOCK_RULES: AlternateSaturdayRule[] = [
  { 
    id: 'ASR-001', 
    code: 'ALT-SAT-001',
    name: 'Alternate Saturday Off', 
    description: 'Standard alternate Saturday off policy for office staff',
    pattern: 'ALT_2_4_WORKING',
    year: 2025,
    scope: 'DEPARTMENT',
    scopeDetails: 'Engineering, Product, HR, Finance',
    defaultStatus: 'OFF',
    effectiveFrom: '2025-01-01',
    status: 'ACTIVE',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    department: 'Engineering, Product',
    location: 'HQ Main',
    employeeCount: 450,
    complianceLevel: 'HIGH',
    auditScore: 95,
    tags: ['Standard', 'Office', 'Alternate'],
    allowDepartmentOverride: true,
    requireManagerApproval: true,
    notificationDays: 7,
    payMultiplier: 1.5,
    maxConsecutiveWorking: 2,
  },
  { 
    id: 'ASR-002', 
    code: 'FACTORY-SAT',
    name: 'Factory Saturday Policy', 
    description: 'Factory site always working Saturdays with overtime',
    pattern: 'ALL_WORKING',
    year: 2025,
    scope: 'LOCATION',
    scopeDetails: 'Factory Site',
    defaultStatus: 'WORKING',
    halfDayHours: 4,
    effectiveFrom: '2025-01-01',
    status: 'ACTIVE',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z',
    department: 'Operations',
    location: 'Factory Site',
    employeeCount: 120,
    complianceLevel: 'HIGH',
    auditScore: 88,
    tags: ['Factory', 'Always Working', 'Overtime'],
    allowDepartmentOverride: false,
    requireManagerApproval: false,
    notificationDays: 3,
    payMultiplier: 2.0,
    maxConsecutiveWorking: 4,
  },
  { 
    id: 'ASR-003', 
    code: 'SUPPORT-SAT',
    name: 'Support Team Saturdays', 
    description: 'Support team compressed week schedule',
    pattern: 'ALT_1_3_OFF',
    year: 2025,
    scope: 'DEPARTMENT',
    scopeDetails: 'Support, Customer Service',
    defaultStatus: 'COMPRESSED',
    compressedWeekHours: 40,
    effectiveFrom: '2025-01-01',
    status: 'ACTIVE',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
    department: 'Support',
    location: 'All',
    employeeCount: 89,
    complianceLevel: 'MEDIUM',
    auditScore: 78,
    tags: ['Support', 'Compressed', '24/7'],
    allowDepartmentOverride: true,
    requireManagerApproval: true,
    notificationDays: 14,
    payMultiplier: 1.75,
    maxConsecutiveWorking: 3,
  },
  { 
    id: 'ASR-004', 
    code: 'RETAIL-SAT',
    name: 'Retail Weekend Policy', 
    description: 'Retail staff working all Saturdays with special hours',
    pattern: 'ALL_WORKING',
    year: 2025,
    scope: 'DEPARTMENT',
    scopeDetails: 'Retail, Sales',
    defaultStatus: 'WORKING',
    halfDayHours: 6,
    effectiveFrom: '2025-01-01',
    status: 'DRAFT',
    createdBy: 'Admin User',
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z',
    department: 'Retail',
    location: 'Stores',
    employeeCount: 156,
    complianceLevel: 'LOW',
    auditScore: 65,
    tags: ['Retail', 'Weekend', 'Draft'],
    allowDepartmentOverride: false,
    requireManagerApproval: false,
    notificationDays: 5,
    payMultiplier: 1.5,
    maxConsecutiveWorking: 4,
  },
  { 
    id: 'ASR-005', 
    code: 'MIDEAST-SAT',
    name: 'Middle East Saturday', 
    description: 'Middle East offices with Friday-Saturday weekend',
    pattern: 'ALL_OFF',
    year: 2025,
    scope: 'LOCATION',
    scopeDetails: 'Dubai Office, Middle East',
    defaultStatus: 'OFF',
    effectiveFrom: '2025-01-01',
    status: 'ACTIVE',
    createdBy: 'Admin User',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    department: 'All',
    location: 'Dubai Office',
    employeeCount: 45,
    complianceLevel: 'HIGH',
    auditScore: 92,
    tags: ['Middle East', 'Friday Weekend', 'Region'],
    allowDepartmentOverride: true,
    requireManagerApproval: true,
    notificationDays: 10,
    payMultiplier: 1.0,
    maxConsecutiveWorking: 1,
  },
];

// Mock overrides data
const MOCK_OVERRIDES: SaturdayOverride[] = [
  {
    id: 'OVR-001',
    date: '2025-02-01',
    originalStatus: 'WORKING',
    overrideStatus: 'OFF',
    type: 'GLOBAL_HOLIDAY',
    reason: 'Annual Company Shutdown',
    appliedTo: 'ALL_EMPLOYEES',
    approvedBy: 'HR Manager',
    approvedAt: '2024-12-15T09:00:00Z',
    createdBy: 'Admin User',
    createdAt: '2024-12-10T09:00:00Z',
    effective: true,
  },
  {
    id: 'OVR-002',
    date: '2025-08-16',
    originalStatus: 'OFF',
    overrideStatus: 'WORKING',
    type: 'SPECIAL_EVENT',
    reason: 'Extended Independence Day Celebrations - Make-up Day',
    appliedTo: 'DEPARTMENT',
    scopeDetails: 'Marketing, Events',
    approvedBy: 'Operations Director',
    approvedAt: '2025-07-01T09:00:00Z',
    createdBy: 'Event Manager',
    createdAt: '2025-06-15T09:00:00Z',
    effective: true,
  },
  {
    id: 'OVR-003',
    date: '2025-06-07',
    originalStatus: 'WORKING',
    overrideStatus: 'HALF_DAY',
    type: 'MAINTENANCE',
    reason: 'Office building maintenance - Early closure at 1 PM',
    appliedTo: 'LOCATION',
    scopeDetails: 'HQ Main',
    approvedBy: 'Facility Manager',
    approvedAt: '2025-05-20T09:00:00Z',
    createdBy: 'Facility Admin',
    createdAt: '2025-05-15T09:00:00Z',
    effective: true,
  },
];

// Mock holidays for 2025
const MOCK_HOLIDAYS = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-02-01', name: 'Annual Shutdown' },
  { date: '2025-03-21', name: 'Eid al-Fitr' },
  { date: '2025-06-01', name: 'Memorial Day' },
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
];

interface AlternateSaturdayRuleFormProps {
  rule?: AlternateSaturdayRule;
  onSave: (rule: Omit<AlternateSaturdayRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const AlternateSaturdayRuleForm: React.FC<AlternateSaturdayRuleFormProps> = ({
  rule,
  onSave,
  onClose,
  mode,
}) => {
  // Basic Information
  const [code, setCode] = useState(rule?.code || '');
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [pattern, setPattern] = useState<SatPattern>(rule?.pattern || 'ALT_2_4_WORKING');
  const [year, setYear] = useState(rule?.year || new Date().getFullYear());
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>(rule?.status || 'DRAFT');
  const [defaultStatus, setDefaultStatus] = useState<SatStatus>(rule?.defaultStatus || 'OFF');
  
  // Scope
  const [scope, setScope] = useState<ScopeType>(rule?.scope || 'ALL_EMPLOYEES');
  const [scopeDetails, setScopeDetails] = useState(rule?.scopeDetails || '');
  const [department, setDepartment] = useState(rule?.department || 'All');
  const [location, setLocation] = useState(rule?.location || 'All');
  
  // Settings
  const [halfDayHours, setHalfDayHours] = useState(rule?.halfDayHours || 4);
  const [compressedWeekHours, setCompressedWeekHours] = useState(rule?.compressedWeekHours || 40);
  const [allowDepartmentOverride, setAllowDepartmentOverride] = useState(rule?.allowDepartmentOverride || false);
  const [requireManagerApproval, setRequireManagerApproval] = useState(rule?.requireManagerApproval || false);
  const [notificationDays, setNotificationDays] = useState(rule?.notificationDays || 7);
  const [payMultiplier, setPayMultiplier] = useState(rule?.payMultiplier || 1.5);
  const [maxConsecutiveWorking, setMaxConsecutiveWorking] = useState(rule?.maxConsecutiveWorking || 2);
  
  // Meta
  const [effectiveFrom, setEffectiveFrom] = useState(rule?.effectiveFrom || '');
  const [effectiveTo, setEffectiveTo] = useState(rule?.effectiveTo || '');
  const [complianceLevel, setComplianceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>(rule?.complianceLevel || 'HIGH');
  const [tags, setTags] = useState<string>(rule?.tags?.join(', ') || '');

  const generateSaturdaysPreview = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, idx) => {
      // Simulate 5 Saturdays in each month
      return {
        month,
        saturdays: [1, 2, 3, 4, 5].map(num => {
          let satStatus: SatStatus = 'OFF';
          
          if (pattern === 'ALL_WORKING') satStatus = 'WORKING';
          else if (pattern === 'ALL_OFF') satStatus = 'OFF';
          else if (pattern === 'ALT_1_3_WORKING') satStatus = (num === 1 || num === 3 || num === 5) ? 'WORKING' : 'OFF';
          else if (pattern === 'ALT_2_4_WORKING') satStatus = (num === 2 || num === 4) ? 'WORKING' : 'OFF';
          else if (pattern === 'ALT_1_3_OFF') satStatus = (num === 2 || num === 4) ? 'WORKING' : 'OFF';
          else if (pattern === 'ALT_2_4_OFF') satStatus = (num === 1 || num === 3 || num === 5) ? 'WORKING' : 'OFF';
          else satStatus = defaultStatus;
          
          return { number: num, status: satStatus };
        })
      };
    });
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Code and Name are required');
      return;
    }

    if (!effectiveFrom) {
      alert('Effective From date is required');
      return;
    }

    const ruleData: Omit<AlternateSaturdayRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount'> = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      pattern,
      year,
      scope,
      scopeDetails: scope === 'ALL_EMPLOYEES' ? undefined : scopeDetails,
      defaultStatus,
      halfDayHours: defaultStatus === 'HALF_DAY' ? halfDayHours : undefined,
      compressedWeekHours: defaultStatus === 'COMPRESSED' ? compressedWeekHours : undefined,
      effectiveFrom,
      effectiveTo: effectiveTo || undefined,
      status,
      department: department === 'All' ? undefined : department,
      location: location === 'All' ? undefined : location,
      complianceLevel,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      allowDepartmentOverride,
      requireManagerApproval,
      notificationDays,
      payMultiplier,
      maxConsecutiveWorking,
    };

    onSave(ruleData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Settings2 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create Alternate Saturday Rule' : 'Edit Alternate Saturday Rule'}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {mode === 'edit' ? `Editing: ${rule?.code}` : 'Define new Saturday working pattern'}
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
                      placeholder="ALT-SAT-001"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider focus:ring-4 focus:ring-purple-500/5 outline-none"
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
                    placeholder="Alternate Saturday Off"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Year
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="2024"
                      max="2030"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                    />
                  </div>
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
                    placeholder="Describe the Saturday working pattern and its purpose..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-purple-500/5 outline-none"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE' | 'DRAFT')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION B: PATTERN SELECTION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={16} /> Pattern Configuration
                </h4>
                <div className="text-xs font-bold text-purple-600">
                  {pattern === 'CUSTOM' ? 'Custom Pattern' : PATTERN_CONFIG[pattern].label}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(PATTERN_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPattern(key as SatPattern)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${
                      pattern === key 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${config.color} flex items-center justify-center text-white`}>
                      {pattern === key ? <Check size={12} /> : null}
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold block mb-1 ${pattern === key ? 'text-purple-700' : 'text-gray-600'}`}>
                        {config.label}
                      </span>
                      <p className="text-[10px] text-gray-500">{config.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {pattern === 'CUSTOM' && (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      Custom Default Status
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDefaultStatus(key as SatStatus)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                            defaultStatus === key
                              ? `${config.color} border-2`
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                    
                    {defaultStatus === 'HALF_DAY' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">
                          Half Day Hours
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="8"
                            step="0.5"
                            value={halfDayHours}
                            onChange={(e) => setHalfDayHours(parseFloat(e.target.value) || 4)}
                            className="w-full bg-white border border-yellow-200 rounded-xl px-4 py-3 text-sm font-bold text-yellow-600 focus:ring-2 focus:ring-yellow-500/20 outline-none"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-yellow-500">hours</span>
                        </div>
                      </div>
                    )}
                    
                    {defaultStatus === 'COMPRESSED' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                          Compressed Week Hours
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="30"
                            max="50"
                            step="1"
                            value={compressedWeekHours}
                            onChange={(e) => setCompressedWeekHours(parseInt(e.target.value) || 40)}
                            className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm font-bold text-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-500">hours/week</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Pattern Preview */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Annual Pattern Preview
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-12 gap-2">
                    {generateSaturdaysPreview().map((month, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 text-center">{month.month}</p>
                        <div className="space-y-1">
                          {month.saturdays.map((sat, satIdx) => (
                            <div
                              key={satIdx}
                              className={`w-5 h-5 rounded text-[8px] flex items-center justify-center ${
                                sat.status === 'WORKING' ? 'bg-red-500 text-white' :
                                sat.status === 'OFF' ? 'bg-green-500 text-white' :
                                sat.status === 'HALF_DAY' ? 'bg-yellow-500 text-white' :
                                'bg-purple-500 text-white'
                              }`}
                              title={`${month.month} ${sat.number}${sat.number === 1 ? 'st' : sat.number === 2 ? 'nd' : sat.number === 3 ? 'rd' : 'th'} - ${sat.status}`}
                            >
                              {sat.number}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[9px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>Working</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Off</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Half Day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>Compressed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: SCOPE & APPLICABILITY */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Users size={16} /> Scope & Applicability
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Application Scope
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SCOPE_OPTIONS.map(scopeOption => (
                      <button
                        key={scopeOption.value}
                        type="button"
                        onClick={() => setScope(scopeOption.value as ScopeType)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                          scope === scopeOption.value
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <scopeOption.icon size={14} />
                        {scopeOption.label}
                      </button>
                    ))}
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
                        placeholder={scope === 'DEPARTMENT' ? 'Engineering, Product, HR' : 
                                   scope === 'LOCATION' ? 'HQ Main, Factory Site' : 
                                   scope === 'ROLE' ? 'Manager, Supervisor' : 'Group Name'}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>

            {/* SECTION D: ADVANCED SETTINGS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings size={16} /> Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Allow Department Override
                      </label>
                      <p className="text-[10px] text-gray-500">Departments can override this rule</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowDepartmentOverride(!allowDepartmentOverride)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        allowDepartmentOverride ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        allowDepartmentOverride ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Require Manager Approval
                      </label>
                      <p className="text-[10px] text-gray-500">Changes require manager approval</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRequireManagerApproval(!requireManagerApproval)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        requireManagerApproval ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        requireManagerApproval ? 'left-7' : 'left-1'
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
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Advance notice required for changes</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Pay Multiplier (Saturdays)
                    </label>
                    <select
                      value={payMultiplier}
                      onChange={(e) => setPayMultiplier(parseFloat(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
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
                    Max Consecutive Working
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={maxConsecutiveWorking}
                      onChange={(e) => setMaxConsecutiveWorking(parseInt(e.target.value) || 2)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Saturdays</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Maximum consecutive working Saturdays</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Effective From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION E: META INFORMATION */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Meta Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Compliance Level
                  </label>
                  <select
                    value={complianceLevel}
                    onChange={(e) => setComplianceLevel(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
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
                    placeholder="Alternate, Weekend, Overtime, Factory"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-purple-500/5 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* COMPLIANCE INFO */}
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex gap-4">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Roster Impact & Compliance</p>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  Changing this policy will affect {scope === 'ALL_EMPLOYEES' ? 'all employees' : scopeDetails || 'targeted employees'}. 
                  Saturday work requires {payMultiplier}x pay multiplier. Ensure compliance with labor laws for maximum consecutive working days.
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
            disabled={!code.trim() || !name.trim() || !effectiveFrom}
            className="flex-[2] py-3 bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> {mode === 'create' ? 'Create Saturday Rule' : 'Update Saturday Rule'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Override Form Component
const OverrideForm: React.FC<{
  date: string;
  originalStatus: SatStatus;
  onSave: (override: Omit<SaturdayOverride, 'id' | 'createdAt' | 'createdBy' | 'effective'>) => void;
  onClose: () => void;
}> = ({ date, originalStatus, onSave, onClose }) => {
  const [overrideStatus, setOverrideStatus] = useState<SatStatus>(originalStatus);
  const [overrideType, setOverrideType] = useState<OverrideType>('OTHER');
  const [reason, setReason] = useState('');
  const [appliedTo, setAppliedTo] = useState<ScopeType>('ALL_EMPLOYEES');
  const [scopeDetails, setScopeDetails] = useState('');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSave = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for the override');
      return;
    }

    onSave({
      date,
      originalStatus,
      overrideStatus,
      type: overrideType,
      reason: reason.trim(),
      appliedTo,
      scopeDetails: appliedTo === 'ALL_EMPLOYEES' ? undefined : scopeDetails,
    });
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Add Saturday Override</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {formatDate(date)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-800">Current Schedule</p>
                <p className="text-[10px] text-blue-600">Original: {STATUS_CONFIG[originalStatus].label}</p>
              </div>
              <ArrowRight size={16} className="text-blue-400" />
              <div>
                <p className="text-xs font-bold text-blue-800">Override to</p>
                <div className="flex items-center gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setOverrideStatus(key as SatStatus)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        overrideStatus === key
                          ? `${config.color} border-2`
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Override Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {OVERRIDE_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setOverrideType(type.value as OverrideType)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center ${
                    overrideType === type.value
                      ? `${type.color} border-2`
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Reason for Override <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this override is needed..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-orange-500/5 outline-none"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Applied To
            </label>
            <select
              value={appliedTo}
              onChange={(e) => setAppliedTo(e.target.value as ScopeType)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/5 outline-none"
            >
              {SCOPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {appliedTo !== 'ALL_EMPLOYEES' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Scope Details
              </label>
              <input
                type="text"
                value={scopeDetails}
                onChange={(e) => setScopeDetails(e.target.value)}
                placeholder={appliedTo === 'DEPARTMENT' ? 'Engineering, Marketing' : 
                           appliedTo === 'LOCATION' ? 'HQ Main, Factory' : 
                           appliedTo === 'ROLE' ? 'Managers, Supervisors' : 'Group Name'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/5 outline-none"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim()}
            className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> Save Override
          </button>
        </div>
      </div>
    </div>
  );
};

export const AlternateSaturdayRules: React.FC = () => {
  const [rules, setRules] = useState<AlternateSaturdayRule[]>(ENHANCED_MOCK_RULES);
  const [year, setYear] = useState(2025);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isOverrideFormOpen, setIsOverrideFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedRule, setSelectedRule] = useState<AlternateSaturdayRule | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [viewMode, setViewMode] = useState<ViewMode>('CALENDAR');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ALL');
  const [filterPattern, setFilterPattern] = useState<'ALL' | SatPattern>('ALL');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<SaturdayOverride[]>(MOCK_OVERRIDES);
  const [holidays] = useState(MOCK_HOLIDAYS);

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = 
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filterStatus === 'ALL' || rule.status === filterStatus;
      const matchesPattern = filterPattern === 'ALL' || rule.pattern === filterPattern;
      
      return matchesSearch && matchesStatus && matchesPattern;
    });
  }, [rules, searchQuery, filterStatus, filterPattern]);
const RULE_STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
  INACTIVE: { label: 'Inactive', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  DRAFT: { label: 'Draft', color: 'bg-blue-50 text-blue-600 border-blue-100' },
};
  const saturdays = useMemo(() => {
    const list: SaturdayRecord[] = [];
    const date = new Date(year, 0, 1);
    
    // Find first Saturday
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1);
    }

    while (date.getFullYear() === year) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfMonth = date.getDate();
      const satNumber = Math.ceil(dayOfMonth / 7);
      const month = date.toLocaleString('default', { month: 'long' });
      
      // Find if there's a rule for this Saturday
      const applicableRule = rules.find(r => 
        r.year === year && 
        r.status === 'ACTIVE' &&
        new Date(dateStr) >= new Date(r.effectiveFrom) &&
        (!r.effectiveTo || new Date(dateStr) <= new Date(r.effectiveTo))
      );

      let defaultStatus: SatStatus = 'OFF';
      if (applicableRule) {
        if (applicableRule.pattern === 'ALL_WORKING') defaultStatus = 'WORKING';
        else if (applicableRule.pattern === 'ALL_OFF') defaultStatus = 'OFF';
        else if (applicableRule.pattern === 'ALT_1_3_WORKING') {
          defaultStatus = (satNumber === 1 || satNumber === 3 || satNumber === 5) ? 'WORKING' : 'OFF';
        } else if (applicableRule.pattern === 'ALT_2_4_WORKING') {
          defaultStatus = (satNumber === 2 || satNumber === 4) ? 'WORKING' : 'OFF';
        } else if (applicableRule.pattern === 'ALT_1_3_OFF') {
          defaultStatus = (satNumber === 2 || satNumber === 4) ? 'WORKING' : 'OFF';
        } else if (applicableRule.pattern === 'ALT_2_4_OFF') {
          defaultStatus = (satNumber === 1 || satNumber === 3 || satNumber === 5) ? 'WORKING' : 'OFF';
        } else {
          defaultStatus = applicableRule.defaultStatus;
        }
      }

      const override = overrides.find(o => o.date === dateStr);
      const holiday = holidays.find(h => h.date === dateStr);
      
      list.push({
        date: dateStr,
        satNumber,
        month,
        year,
        defaultStatus,
        override,
        finalStatus: override ? override.overrideStatus : defaultStatus,
        isHoliday: !!holiday,
        holidayName: holiday?.name,
      });
      
      date.setDate(date.getDate() + 7);
    }
    return list;
  }, [year, rules, overrides, holidays]);

  const stats = useMemo(() => {
    const totalRules = rules.length;
    const activeRules = rules.filter(r => r.status === 'ACTIVE').length;
    const totalEmployees = rules.reduce((sum, r) => sum + r.employeeCount, 0);
    const workingSaturdays = saturdays.filter(s => s.finalStatus === 'WORKING').length;
    const offSaturdays = saturdays.filter(s => s.finalStatus === 'OFF').length;
    const overrideCount = overrides.length;
    
    return { totalRules, activeRules, totalEmployees, workingSaturdays, offSaturdays, overrideCount };
  }, [rules, saturdays, overrides]);

  const handleCreateRule = () => {
    setSelectedRule(null);
    setModalMode('create');
    setIsConfigOpen(true);
  };

  const handleEditRule = (rule: AlternateSaturdayRule) => {
    setSelectedRule(rule);
    setModalMode('edit');
    setIsConfigOpen(true);
  };

  const handleDuplicateRule = (rule: AlternateSaturdayRule) => {
    const newRule: AlternateSaturdayRule = {
      ...rule,
      id: `ASR-${Math.floor(Math.random() * 900) + 100}`,
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
      alert('Cannot delete Saturday rule with assigned employees');
      return;
    }
    if (window.confirm('Are you sure you want to delete this Saturday rule?')) {
      setRules(prev => prev.filter(r => r.id !== ruleId));
    }
    setActiveActionMenu(null);
  };

  const handleSaveRule = (ruleData: Omit<AlternateSaturdayRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'employeeCount'>) => {
    if (modalMode === 'edit' && selectedRule) {
      setRules(prev => prev.map(rule => 
        rule.id === selectedRule.id 
          ? { 
              ...ruleData as AlternateSaturdayRule, 
              id: selectedRule.id, 
              employeeCount: selectedRule.employeeCount,
              createdBy: selectedRule.createdBy,
              createdAt: selectedRule.createdAt, 
              updatedAt: new Date().toISOString() 
            }
          : rule
      ));
    } else {
      const newRule: AlternateSaturdayRule = {
        ...ruleData as AlternateSaturdayRule,
        id: `ASR-${Math.floor(Math.random() * 900) + 100}`,
        employeeCount: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRules(prev => [newRule, ...prev]);
    }
    
    setIsConfigOpen(false);
    setSelectedRule(null);
  };

  const handleAddOverride = (date: string, originalStatus: SatStatus) => {
    setSelectedDate(date);
    setIsOverrideFormOpen(true);
  };

  const handleSaveOverride = (overrideData: Omit<SaturdayOverride, 'id' | 'createdAt' | 'createdBy' | 'effective'>) => {
    const newOverride: SaturdayOverride = {
      ...overrideData,
      id: `OVR-${Date.now()}`,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      effective: true,
    };
    setOverrides(prev => [...prev, newOverride]);
    setIsOverrideFormOpen(false);
  };

  const handleDeleteOverride = (overrideId: string) => {
    setOverrides(prev => prev.filter(o => o.id !== overrideId));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: SatStatus) => {
    return {
      WORKING: 'bg-red-500',
      OFF: 'bg-green-500',
      HALF_DAY: 'bg-yellow-500',
      COMPRESSED: 'bg-purple-500',
    }[status];
  };

  const getStatusLabel = (status: SatStatus) => {
    return STATUS_CONFIG[status].label;
  };

  return (
    <ErrorBoundary>

    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Settings2 className="text-[#3E3B6F]" size={28} /> Enhanced Alternate Saturday Rules
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">
            Comprehensive Saturday working pattern management with overrides and compliance tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('CALENDAR')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'CALENDAR' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <Calendar size={14} /> Calendar
            </button>
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
          <select 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 outline-none shadow-sm focus:ring-4 focus:ring-[#3E3B6F]/5"
          >
            <option value={2024}>Year: 2024</option>
            <option value={2025}>Year: 2025</option>
            <option value={2026}>Year: 2026</option>
            <option value={2027}>Year: 2027</option>
          </select>
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
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Rules</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">{stats.activeRules}</span>
            <span className="text-xs text-gray-500">of {stats.totalRules} total</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Covered Employees</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.totalEmployees}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Working Saturdays</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{stats.workingSaturdays}</span>
            <span className="text-xs text-gray-500">of {saturdays.length}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Active Overrides</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.overrideCount}</span>
          </div>
        </div>
      </div>

      {/* CURRENT YEAR SUMMARY */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-purple-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{year} Saturday Summary</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-[9px] font-black text-gray-400 uppercase">Working</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[9px] font-black text-gray-400 uppercase">Off</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-[9px] font-black text-gray-400 uppercase">Half Day</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, monthIdx) => {
              const monthSaturdays = saturdays.filter(s => 
                new Date(s.date).getMonth() === monthIdx
              );
              return (
                <div key={monthIdx} className="space-y-1">
                  <p className="text-[9px] font-bold text-gray-400 text-center">
                    {new Date(year, monthIdx).toLocaleString('default', { month: 'short' })}
                  </p>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5].map((satNum, idx) => {
                      const sat = monthSaturdays.find(s => s.satNumber === satNum);
                      return (
                        <div
                          key={idx}
                          className={`w-5 h-5 rounded text-[8px] flex items-center justify-center mx-auto ${
                            sat ? getStatusColor(sat.finalStatus) + ' text-white' : 'bg-gray-100 text-gray-300'
                          } ${sat?.override ? 'ring-2 ring-offset-1 ring-orange-400' : ''}`}
                          title={sat ? `${formatDate(sat.date)}: ${getStatusLabel(sat.finalStatus)}${sat.override ? ' (Override)' : ''}` : 'No Saturday'}
                        >
                          {satNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500/10 outline-none"
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
        <select 
          value={filterPattern}
          onChange={(e) => setFilterPattern(e.target.value as any)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Patterns</option>
          <option value="ALL_WORKING">All Working</option>
          <option value="ALL_OFF">All Off</option>
          <option value="ALT_1_3_WORKING">1st & 3rd Working</option>
          <option value="ALT_2_4_WORKING">2nd & 4th Working</option>
          <option value="ALT_1_3_OFF">1st & 3rd Off</option>
          <option value="ALT_2_4_OFF">2nd & 4th Off</option>
          <option value="CUSTOM">Custom</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Download size={14} /> Export
        </button>
      </div>

      {viewMode === 'CALENDAR' ? (
        /* CALENDAR VIEW - Enhanced Saturday Calendar */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="text-purple-500" size={16} /> {year} Saturday Calendar
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                {saturdays.length} Saturdays
              </span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-6 py-4">Occurrence</th>
                  <th className="px-6 py-4">Month</th>
                  <th className="px-6 py-4 text-center">Schedule Status</th>
                  <th className="px-6 py-4">Override Policy</th>
                  <th className="px-6 py-4">Holiday</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {saturdays.map((sat) => {
                  const dateObj = new Date(sat.date);
                  const isToday = sat.date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <tr key={sat.date} className={`group transition-all hover:bg-gray-50/80 ${isToday ? 'bg-blue-50/30' : ''} ${sat.override ? 'bg-orange-50/20' : ''}`}>
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-800 tabular-nums">
                              {formatDate(sat.date)}
                            </span>
                            {isToday && (
                              <span className="text-[8px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                TODAY
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-[#3E3B6F] bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          {sat.satNumber}{sat.satNumber === 1 ? 'st' : sat.satNumber === 2 ? 'nd' : sat.satNumber === 3 ? 'rd' : 'th'} Saturday
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-gray-600">{sat.month}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[sat.finalStatus].color}`}>
                            {getStatusLabel(sat.finalStatus)}
                          </span>
                          {sat.defaultStatus !== sat.finalStatus && (
                            <span className="text-[8px] text-gray-500">(Original: {getStatusLabel(sat.defaultStatus)})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {sat.override ? (
                          <div className="flex items-start gap-2">
                            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(sat.override.overrideStatus)}`}></div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">
                                Override to {getStatusLabel(sat.override.overrideStatus)}
                              </span>
                              <span className="text-[9px] text-gray-500 font-medium italic">
                                "{sat.override.reason}"
                              </span>
                              {sat.override.appliedTo !== 'ALL_EMPLOYEES' && (
                                <span className="text-[8px] text-gray-400 mt-1">
                                  Scope: {sat.override.scopeDetails}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {sat.isHoliday ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-red-600">{sat.holidayName}</span>
                              <span className="text-[8px] text-red-400">Public Holiday</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1  transition-all">
                          <button 
                            onClick={() => handleAddOverride(sat.date, sat.defaultStatus)}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                            title="Add Override"
                          >
                            <Edit3 size={16}/>
                          </button>
                          {sat.override && (
                            <button 
                              onClick={() => handleDeleteOverride(sat.override!.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove Override"
                            >
                              <Trash2 size={16}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* TABLE FOOTER */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Working: {stats.workingSaturdays}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Off: {stats.offSaturdays}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Overrides: {stats.overrideCount}
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
      ) : viewMode === 'LIST' ? (
        /* LIST VIEW - Rules List */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> Alternate Saturday Rules
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
                  <th className="px-6 py-4">Pattern & Year</th>
                  <th className="px-6 py-4">Scope</th>
                  <th className="px-6 py-4 text-center">Employees</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Effective Period</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center text-purple-600">
                          <Settings2 size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-gray-800">{rule.name}</p>
                            <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {rule.code}
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">
                            {PATTERN_CONFIG[rule.pattern].label}
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
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-tighter border border-gray-200">
                          {PATTERN_CONFIG[rule.pattern].label}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar size={12} />
                          <span className="font-bold">{rule.year}</span>
                        </div>
                        <div className="flex gap-1">
                          {rule.allowDepartmentOverride && (
                            <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                              Override Allowed
                            </span>
                          )}
                          {rule.requireManagerApproval && (
                            <span className="text-[8px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                              Approval Required
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Users size={12} />
                          <span>{SCOPE_OPTIONS.find(s => s.value === rule.scope)?.label}</span>
                        </div>
                        {rule.scopeDetails && (
                          <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{rule.scopeDetails}</p>
                        )}
                        {(rule.department || rule.location) && (
                          <p className="text-[9px] text-gray-400">
                            {rule.department && rule.department !== 'All' ? rule.department.split(',')[0] : ''}
                            {rule.location && rule.location !== 'All' ? ` • ${rule.location.split(',')[0]}` : ''}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#3E3B6F]/5 rounded-lg text-xs font-black text-[#3E3B6F] tabular-nums">
                        <Users size={12} /> {rule.employeeCount}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${RULE_STATUS_CONFIG[rule.status].color}`}>
  {RULE_STATUS_CONFIG[rule.status].label}
</span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold ${
                          rule.complianceLevel === 'HIGH' ? 'bg-green-100 text-green-700' :
                          rule.complianceLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {rule.complianceLevel} Compliance
                        </span>
                      </div>
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
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEditRule(rule)}
                          className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all"
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
                <Settings2 size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Saturday Rules Found</h3>
                <p className="text-sm font-medium mt-2">Adjust your search or create a new rule.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* GRID VIEW - Rules Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRules.map(rule => (
            <div key={rule.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F] group-hover:scale-110 transition-transform">
                <Settings2 size={80} />
              </div>
              <div className="flex flex-col h-full relative z-10">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <Settings2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-800">{rule.name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{rule.code}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${RULE_STATUS_CONFIG[rule.status].color}`}>
  {RULE_STATUS_CONFIG[rule.status].label}
</span>
                      <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {rule.year}
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
                      <p className="text-lg font-black text-purple-600">{rule.payMultiplier}x</p>
                      <p className="text-[10px] text-purple-800 uppercase font-bold">Pay Rate</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Calendar size={14} className="text-purple-500" />
                      <span>{PATTERN_CONFIG[rule.pattern].label}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-gray-500">
                        {SCOPE_OPTIONS.find(s => s.value === rule.scope)?.label}
                      </div>
                      <div className="flex gap-1">
                        {rule.allowDepartmentOverride && (
                          <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            Override
                          </span>
                        )}
                        {rule.requireManagerApproval && (
                          <span className="text-[8px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                            Approval
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-gray-500">
                      Effective: {new Date(rule.effectiveFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {rule.effectiveTo && ` - ${new Date(rule.effectiveTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
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
                      <div className="text-xs text-gray-500">
                        {rule.department?.split(',')[0] || 'All Depts'}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {rule.location?.split(',')[0] || 'All Locations'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditRule(rule)}
                      className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      Edit Rule
                    </button>
                    <button 
                      onClick={() => {
                        // View calendar for this rule
                        setYear(rule.year);
                        setViewMode('CALENDAR');
                      }}
                      className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:scale-105 transition-all"
                      title="View Calendar"
                    >
                      <Calendar size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OVERRIDE FORM MODAL */}
      {isOverrideFormOpen && selectedDate && (
        <OverrideForm
          date={selectedDate}
          originalStatus={saturdays.find(s => s.date === selectedDate)?.defaultStatus || 'OFF'}
          onSave={handleSaveOverride}
          onClose={() => setIsOverrideFormOpen(false)}
        />
      )}

      {/* RULE FORM MODAL */}
      {isConfigOpen && (
        <AlternateSaturdayRuleForm
          rule={selectedRule || undefined}
          onSave={handleSaveRule}
          onClose={() => {
            if (window.confirm('Are you sure you want to discard your changes?')) {
              setIsConfigOpen(false);
              setSelectedRule(null);
            }
          }}
          mode={modalMode}
        />
      )}
    </div>
    </ErrorBoundary>

  );
};