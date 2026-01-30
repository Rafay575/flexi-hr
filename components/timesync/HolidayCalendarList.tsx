import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  MoreVertical, 
  ChevronRight, 
  Edit3, 
  Copy, 
  UserPlus, 
  Eye,
  X,
  ChevronLeft,
  CalendarDays,
  Globe,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  Info,
  Filter,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  Target,
  Shield,
  Clock3,
  Bell,
  Hash,
  Layers,
  TrendingUp,
  ArrowRight,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  FileText,
  Zap,
  Coffee,
  BookOpen,
  ChevronDown,
  Settings,
  Settings2,
  PieChart,
  ClipboardCheck,
  Link as LinkIcon,
  CalendarRange,
  AlertOctagon,
  ShieldCheck,
  BellRing,
  CalendarClock,
  Globe2,
  Map,
  Flag,
  Gift,
  PartyPopper,
  Church,

  Star,
  Crown,
  Sparkles,
  Rocket,
  Heart,
  Trophy,
  Award,
  Target as TargetIcon,
  UserCheck,
  Timer,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun as SunIcon,
  CloudSun,
  Wind,
  Thermometer,
  Umbrella,
  Droplets,
  Waves,
  Send,
  Mail,
  BellDot,
  Grid3x3,
  Archive,
  ExternalLink,
  Share2,
  Printer,
  Lock,
  Unlock,
  Volume2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Phone,
  PhoneOff,
  Headphones,
  Cpu,
  Database,
  Server,
  Network,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Power,
  ZapOff,
  AlertOctagon as AlertOctagonIcon,
  Meh,
  Frown,
  Smile,
  Laugh,
  ThumbsUp,
  ThumbsDown,
  Heart as HeartIcon,
  Star as StarIcon,
  Bookmark,
  BookmarkCheck,
  Share,
  DownloadCloud,
  UploadCloud,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  FileCode,
  Image,
  Music,
  Film,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  Wallet,
  BarChart,
  LineChart,
  TrendingDown,
  Activity,
  Wind as WindIcon,
  ThermometerSun,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Sunset,
  Sunrise,
  Moon as MoonIcon,
  Grid as GridIcon
} from 'lucide-react';

// Primary color configuration
const PRIMARY_COLOR = '#1E1B4B';
const PRIMARY_LIGHT = '#4A457A';
const PRIMARY_DARK = '#0F0D24';
const ACCENT_COLOR = '#E8D5A3';

type HolidayType = 'PUBLIC' | 'RESTRICTED' | 'COMPANY' | 'OPTIONAL' | 'RELIGIOUS' | 'NATIONAL' | 'STATE' | 'LOCAL';
type HolidayStatus = 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
type CalendarStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'PENDING_APPROVAL';
type ScopeType = 'GLOBAL' | 'DEPARTMENT' | 'LOCATION' | 'ROLE' | 'EMPLOYEE_GROUP';
type PublishOption = 'IMMEDIATELY' | 'SCHEDULED' | 'MANUAL';
type RecurringPattern = 'YEARLY' | 'FIXED_WEEKDAY' | 'LUNAR' | 'CUSTOM';

interface Holiday {
  id: string;
  date: string;
  name: string;
  description?: string;
  type: HolidayType;
  status: HolidayStatus;
  recurring: boolean;
  recurringPattern?: RecurringPattern;
  halfDay: boolean;
  halfDayHours?: number;
  tags: string[];
  countryCode?: string;
  state?: string;
  city?: string;
  payMultiplier: number;
  mandatory: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  overrideAllowed: boolean;
  maxWorkersAllowed?: number;
  specialNotes?: string;
}

interface HolidayCalendar {
  id: string;
  code: string;
  name: string;
  description?: string;
  year: number;
  holidayCount: number;
  sites: string[];
  departments: string[];
  employeeCount: number;
  status: CalendarStatus;
  holidays: Holiday[];
  scope: ScopeType;
  scopeDetails?: string;
  country: string;
  state?: string;
  complianceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isTemplate: boolean;
  templateSource?: string;
  tags: string[];
  allowOverrides: boolean;
  requireApproval: boolean;
  notificationDays: number;
  publishedAt?: string;
  publishedBy?: string;
  publishSchedule?: string;
  isPublished: boolean;
}

const TYPE_CONFIG: Record<HolidayType, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: React.ElementType;
}> = {
  PUBLIC: { 
    label: 'Public Holiday', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50 border-purple-100',
    icon: Flag
  },
  RESTRICTED: { 
    label: 'Restricted Holiday', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50 border-blue-100',
    icon: AlertCircle
  },
  COMPANY: { 
    label: 'Company Holiday', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50 border-green-100',
    icon: Building2
  },
  OPTIONAL: { 
    label: 'Optional Holiday', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50 border-gray-100',
    icon: Coffee
  },
  RELIGIOUS: { 
    label: 'Religious Holiday', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50 border-amber-100',
    icon: Church
  },
  NATIONAL: { 
    label: 'National Holiday', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50 border-red-100',
    icon: Trophy
  },
  STATE: { 
    label: 'State Holiday', 
    color: 'text-indigo-600', 
    bgColor: 'bg-indigo-50 border-indigo-100',
    icon: MapPin
  },
  LOCAL: { 
    label: 'Local Holiday', 
    color: 'text-cyan-600', 
    bgColor: 'bg-cyan-50 border-cyan-100',
    icon: Map
  },
};

const STATUS_CONFIG: Record<CalendarStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
}> = {
  ACTIVE: { label: 'Active', color: 'text-green-600', bgColor: 'bg-green-50 border-green-100' },
  DRAFT: { label: 'Draft', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },
  ARCHIVED: { label: 'Archived', color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-100' },
  PENDING_APPROVAL: { label: 'Pending Approval', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-100' },
};

const HOLIDAY_STATUS_CONFIG: Record<HolidayStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
}> = {
  CONFIRMED: { label: 'Confirmed', color: 'text-green-600', bgColor: 'bg-green-50' },
  TENTATIVE: { label: 'Tentative', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-50' },
};

const COUNTRIES = [
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Sales', 'Marketing', 'Support', 'HR', 'Finance', 'Retail', 'Manufacturing'];
const SITES = ['All', 'Karachi HQ', 'Lahore Office', 'Islamabad Office', 'Dubai Office', 'London Hub', 'New York Office', 'Factory Site', 'Remote Teams'];

// Enhanced Mock Data
const ENHANCED_MOCK_CALENDARS: HolidayCalendar[] = [
  { 
    id: 'CAL-2025-PK-001', 
    code: 'PAK-STD-2025',
    name: 'Pakistan Standard Holidays 2025', 
    description: 'Official public holidays for Pakistan offices with regional variations',
    year: 2025, 
    holidayCount: 8, 
    sites: ['Karachi HQ', 'Lahore Office', 'Islamabad Office', 'Factory Site'], 
    departments: ['All'],
    employeeCount: 2450, 
    status: 'ACTIVE',
    scope: 'GLOBAL',
    country: 'Pakistan',
    state: 'Sindh',
    complianceLevel: 'HIGH',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    createdBy: 'Admin User',
    isTemplate: false,
    tags: ['Public', 'Official', 'Standard'],
    allowOverrides: true,
    requireApproval: true,
    notificationDays: 30,
    isPublished: true,
    publishedAt: '2024-12-01T09:00:00Z',
    publishedBy: 'Admin User',
    holidays: [
      { 
        id: 'H1-2025-PK', 
        date: '2025-02-05', 
        name: 'Kashmir Day', 
        description: 'Solidarity with Kashmir',
        type: 'PUBLIC', 
        status: 'CONFIRMED',
        recurring: true,
        recurringPattern: 'YEARLY',
        halfDay: false,
        tags: ['National', 'Public'],
        countryCode: 'PK',
        state: 'All',
        payMultiplier: 2.0,
        mandatory: true,
        createdAt: '2024-11-15T09:00:00Z',
        updatedAt: '2024-11-15T09:00:00Z',
        createdBy: 'System',
        overrideAllowed: false,
        maxWorkersAllowed: 50,
        specialNotes: 'Essential services may operate with approval'
      },
      { 
        id: 'H2-2025-PK', 
        date: '2025-03-23', 
        name: 'Pakistan Day', 
        description: 'Commemoration of Pakistan Resolution',
        type: 'NATIONAL', 
        status: 'CONFIRMED',
        recurring: true,
        recurringPattern: 'YEARLY',
        halfDay: false,
        tags: ['National', 'Public', 'Parade'],
        countryCode: 'PK',
        payMultiplier: 2.5,
        mandatory: true,
        createdAt: '2024-11-15T09:00:00Z',
        updatedAt: '2024-11-15T09:00:00Z',
        createdBy: 'System',
        overrideAllowed: false,
        specialNotes: 'Military parade in Islamabad'
      },
      { 
        id: 'H3-2025-PK', 
        date: '2025-05-01', 
        name: 'Labour Day', 
        type: 'PUBLIC', 
        status: 'CONFIRMED',
        recurring: true,
        halfDay: false,
        tags: ['International', 'Workers'],
        countryCode: 'PK',
        payMultiplier: 2.0,
        mandatory: true,
        createdAt: '2024-11-15T09:00:00Z',
        updatedAt: '2024-11-15T09:00:00Z',
        createdBy: 'System',
        overrideAllowed: true,
        maxWorkersAllowed: 100
      },
      { 
        id: 'H4-2025-PK', 
        date: '2025-08-14', 
        name: 'Independence Day', 
        type: 'NATIONAL', 
        status: 'CONFIRMED',
        recurring: true,
        halfDay: false,
        tags: ['National', 'Independence', 'Celebration'],
        countryCode: 'PK',
        payMultiplier: 2.5,
        mandatory: true,
        createdAt: '2024-11-15T09:00:00Z',
        updatedAt: '2024-11-15T09:00:00Z',
        createdBy: 'System',
        overrideAllowed: false
      }
    ]
  },
  { 
    id: 'CAL-2025-US-001', 
    code: 'US-ENG-2025',
    name: 'US Engineering Team Holidays', 
    description: 'Holiday schedule for US-based engineering teams',
    year: 2025, 
    holidayCount: 10, 
    sites: ['New York Office', 'Remote Teams'], 
    departments: ['Engineering', 'Product', 'Design'],
    employeeCount: 156, 
    status: 'ACTIVE',
    scope: 'DEPARTMENT',
    scopeDetails: 'Engineering teams only',
    country: 'United States',
    complianceLevel: 'MEDIUM',
    createdAt: '2024-11-20T09:00:00Z',
    updatedAt: '2024-12-05T09:00:00Z',
    createdBy: 'HR Manager',
    isTemplate: false,
    tags: ['Engineering', 'US', 'Tech'],
    allowOverrides: true,
    requireApproval: false,
    notificationDays: 14,
    isPublished: true,
    publishedAt: '2024-12-05T09:00:00Z',
    publishedBy: 'HR Manager',
    holidays: []
  },
  { 
    id: 'CAL-2025-AE-001', 
    code: 'UAE-STD-2025',
    name: 'UAE Public Holidays 2025', 
    description: 'Standard holidays for UAE offices with Islamic calendar integration',
    year: 2025, 
    holidayCount: 12, 
    sites: ['Dubai Office'], 
    departments: ['All'],
    employeeCount: 89, 
    status: 'PENDING_APPROVAL',
    scope: 'LOCATION',
    scopeDetails: 'Dubai Office only',
    country: 'UAE',
    complianceLevel: 'HIGH',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
    createdBy: 'Regional Manager',
    isTemplate: false,
    tags: ['UAE', 'Middle East', 'Islamic'],
    allowOverrides: false,
    requireApproval: true,
    notificationDays: 45,
    isPublished: false,
    holidays: []
  },
  { 
    id: 'CAL-2025-UK-002', 
    code: 'UK-MFG-2025',
    name: 'UK Manufacturing Holiday Calendar', 
    description: 'Factory and manufacturing site holidays in UK',
    year: 2025, 
    holidayCount: 8, 
    sites: ['Factory Site'], 
    departments: ['Manufacturing', 'Operations'],
    employeeCount: 450, 
    status: 'DRAFT',
    scope: 'DEPARTMENT',
    scopeDetails: 'Manufacturing department',
    country: 'United Kingdom',
    complianceLevel: 'HIGH',
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-25T09:00:00Z',
    createdBy: 'Operations Director',
    isTemplate: false,
    tags: ['Manufacturing', 'Factory', 'UK'],
    allowOverrides: false,
    requireApproval: true,
    notificationDays: 60,
    isPublished: false,
    holidays: []
  },
  { 
    id: 'CAL-2025-TEMPLATE', 
    code: 'TEMPLATE-2025',
    name: 'Global Holiday Template 2025', 
    description: 'Template with major international holidays',
    year: 2025, 
    holidayCount: 25, 
    sites: ['All'], 
    departments: ['All'],
    employeeCount: 0, 
    status: 'DRAFT',
    scope: 'GLOBAL',
    country: 'Global',
    complianceLevel: 'MEDIUM',
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2024-10-01T09:00:00Z',
    createdBy: 'System',
    isTemplate: true,
    templateSource: 'UN International Days',
    tags: ['Template', 'Global', 'International'],
    allowOverrides: true,
    requireApproval: false,
    notificationDays: 0,
    isPublished: false,
    holidays: []
  },
  { 
    id: 'CAL-2024-PK-001', 
    code: 'PAK-STD-2024',
    name: 'Pakistan Holidays 2024', 
    description: 'Archived 2024 holiday calendar',
    year: 2024, 
    holidayCount: 17, 
    sites: ['Karachi HQ', 'Lahore Office'], 
    departments: ['All'],
    employeeCount: 2100, 
    status: 'ARCHIVED',
    scope: 'GLOBAL',
    country: 'Pakistan',
    complianceLevel: 'HIGH',
    createdAt: '2023-11-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    createdBy: 'Admin User',
    isTemplate: false,
    tags: ['Archived', '2024', 'Pakistan'],
    allowOverrides: true,
    requireApproval: true,
    notificationDays: 30,
    isPublished: true,
    publishedAt: '2024-01-01T09:00:00Z',
    publishedBy: 'Admin User',
    holidays: []
  },
];

const UPCOMING_HOLIDAYS = [
  { id: '1', date: '2025-01-01', name: 'New Year\'s Day', calendar: 'Global Template', type: 'PUBLIC' as HolidayType },
  { id: '2', date: '2025-02-05', name: 'Kashmir Day', calendar: 'Pakistan Standard', type: 'NATIONAL' as HolidayType },
  { id: '3', date: '2025-02-14', name: 'Valentine\'s Day', calendar: 'Optional Holidays', type: 'OPTIONAL' as HolidayType },
  { id: '4', date: '2025-03-08', name: 'International Women\'s Day', calendar: 'Global Template', type: 'COMPANY' as HolidayType },
  { id: '5', date: '2025-03-23', name: 'Pakistan Day', calendar: 'Pakistan Standard', type: 'NATIONAL' as HolidayType },
];

type ViewMode = 'LIST' | 'GRID' | 'DETAIL';

// Create Calendar Modal Component
const CreateCalendarModal: React.FC<{
  onClose: () => void;
  onCreate: (data: Omit<HolidayCalendar, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'holidays' | 'holidayCount' | 'employeeCount' | 'isPublished'>) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [scope, setScope] = useState<ScopeType>('GLOBAL');
  const [scopeDetails, setScopeDetails] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [state, setState] = useState('');
  const [sites, setSites] = useState<string[]>(['All']);
  const [departments, setDepartments] = useState<string[]>(['All']);
  const [tags, setTags] = useState<string>('');
  const [allowOverrides, setAllowOverrides] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [notificationDays, setNotificationDays] = useState(30);
  const [complianceLevel, setComplianceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [isImportingTemplate, setIsImportingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const generateCode = () => {
    if (!name || !country) return;
    const countryCode = COUNTRIES.find(c => c.name === country)?.code || 'GLB';
    const yearCode = year.toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${countryCode}-${yearCode}-${randomNum}`;
  };

  const handleCreate = () => {
    if (!name.trim() || !code.trim()) {
      alert('Calendar name and code are required');
      return;
    }

    const calendarData = {
      code: code.toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      year,
      scope,
      scopeDetails: scope === 'GLOBAL' ? undefined : scopeDetails,
      country,
      state: state || undefined,
      sites,
      departments,
      status: 'DRAFT' as CalendarStatus,
      complianceLevel,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      allowOverrides,
      requireApproval,
      notificationDays,
      isTemplate: false,
    };

    onCreate(calendarData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1B4B] to-[#3B357A] flex items-center justify-center text-white shadow-lg">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Create Holiday Calendar</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Setup regional holiday schedule
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
                    Calendar Name <span className="text-red-500">*</span>
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
                    placeholder="Pakistan Standard Holidays 2025"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Calendar Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="PAK-2025-001"
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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose and scope of this holiday calendar..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    State/Province (Optional)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Sindh, California"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: SCOPE & APPLICABILITY */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Users size={16} /> Scope & Applicability
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Scope
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as ScopeType)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                  >
                    <option value="GLOBAL">Global - All Employees</option>
                    <option value="DEPARTMENT">Department Specific</option>
                    <option value="LOCATION">Location Specific</option>
                    <option value="ROLE">Role Specific</option>
                    <option value="EMPLOYEE_GROUP">Employee Group</option>
                  </select>
                </div>

                {scope !== 'GLOBAL' && (
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
                                 scope === 'ROLE' ? 'Managers, Executives' : 'Group Name'}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Sites
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SITES.slice(0, 4).map(site => (
                      <button
                        key={site}
                        type="button"
                        onClick={() => {
                          if (site === 'All') {
                            setSites(['All']);
                          } else {
                            setSites(prev => 
                              prev.includes('All') 
                                ? [site]
                                : prev.includes(site)
                                ? prev.filter(s => s !== site)
                                : [...prev, site]
                            );
                          }
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                          sites.includes(site) 
                            ? 'bg-[#1E1B4B] text-white border-[#1E1B4B]' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {site}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">Selected: {sites.join(', ')}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Departments
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPARTMENTS.slice(0, 4).map(dept => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          if (dept === 'All') {
                            setDepartments(['All']);
                          } else {
                            setDepartments(prev => 
                              prev.includes('All') 
                                ? [dept]
                                : prev.includes(dept)
                                ? prev.filter(d => d !== dept)
                                : [...prev, dept]
                            );
                          }
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                          departments.includes(dept) 
                            ? 'bg-[#1E1B4B] text-white border-[#1E1B4B]' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">Selected: {departments.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* SECTION C: SETTINGS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Settings size={16} /> Calendar Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Allow Overrides
                      </label>
                      <p className="text-[10px] text-gray-500">Allow departments to override holidays</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowOverrides(!allowOverrides)}
                      className={`w-12 h-6 rounded-full relative transition-all ${
                        allowOverrides ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        allowOverrides ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Require Approval
                      </label>
                      <p className="text-[10px] text-gray-500">Changes require manager approval</p>
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
                        max="90"
                        value={notificationDays}
                        onChange={(e) => setNotificationDays(parseInt(e.target.value) || 30)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">days</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Advance notice for holiday announcements</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Compliance Level
                    </label>
                    <select
                      value={complianceLevel}
                      onChange={(e) => setComplianceLevel(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    >
                      <option value="HIGH">High Compliance</option>
                      <option value="MEDIUM">Medium Compliance</option>
                      <option value="LOW">Low Compliance</option>
                    </select>
                  </div>
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
                  placeholder="Public, Official, Standard, Regional"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                />
              </div>
            </div>

            {/* TEMPLATE IMPORT OPTION */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-indigo-700">Import from Template</p>
                    <button
                      type="button"
                      onClick={() => setIsImportingTemplate(!isImportingTemplate)}
                      className="text-[10px] font-black text-indigo-800 uppercase tracking-widest hover:underline"
                    >
                      {isImportingTemplate ? 'Cancel' : 'Import Template'}
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-600/80 leading-relaxed">
                    Pre-fill this calendar with official holidays from selected country templates.
                  </p>
                  
                  {isImportingTemplate && (
                    <div className="mt-4 space-y-2">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                      >
                        <option value="">Select a template...</option>
                        <option value="PK">Pakistan - Official Holidays</option>
                        <option value="US">USA - Federal Holidays</option>
                        <option value="UK">UK - Bank Holidays</option>
                        <option value="AE">UAE - Public Holidays</option>
                      </select>
                      {selectedTemplate && (
                        <p className="text-[10px] text-indigo-600">
                          Will import 10-15 standard holidays for {selectedTemplate}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COMPLIANCE INFO */}
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex gap-4">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Compliance Notice</p>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  Creating a holiday calendar affects {scope === 'GLOBAL' ? 'all employees' : 'targeted groups'}. 
                  Ensure compliance with local labor laws for mandatory holidays and pay rates. 
                  {requireApproval && ' Changes will require manager approval.'}
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
            disabled={!name.trim() || !code.trim()}
            className="flex-[2] py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:shadow-2xl hover:shadow-[#1E1B4B]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> Create Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Holiday Modal Component
const AddHolidayModal: React.FC<{
  calendar: HolidayCalendar;
  onClose: () => void;
  onSave: (holiday: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
}> = ({ calendar, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<HolidayType>('PUBLIC');
  const [status, setStatus] = useState<HolidayStatus>('CONFIRMED');
  const [description, setDescription] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>('YEARLY');
  const [halfDay, setHalfDay] = useState(false);
  const [halfDayHours, setHalfDayHours] = useState(4);
  const [mandatory, setMandatory] = useState(true);
  const [payMultiplier, setPayMultiplier] = useState(2.0);
  const [overrideAllowed, setOverrideAllowed] = useState(false);
  const [maxWorkersAllowed, setMaxWorkersAllowed] = useState<number | undefined>(undefined);
  const [specialNotes, setSpecialNotes] = useState('');
  const [tags, setTags] = useState<string>('');

  const handleSave = () => {
    if (!name.trim() || !date) {
      alert('Holiday name and date are required');
      return;
    }

    const holidayData = {
      date,
      name: name.trim(),
      description: description.trim(),
      type,
      status,
      recurring,
      recurringPattern: recurring ? recurringPattern : undefined,
      halfDay,
      halfDayHours: halfDay ? halfDayHours : undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      countryCode: COUNTRIES.find(c => c.name === calendar.country)?.code,
      state: calendar.state,
      payMultiplier,
      mandatory,
      overrideAllowed,
      maxWorkersAllowed,
      specialNotes: specialNotes.trim(),
    };

    onSave(holidayData);
  };

  const TypeIcon = TYPE_CONFIG[type].icon;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1B4B] to-[#3B357A] flex items-center justify-center text-white shadow-lg">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Add Holiday to Calendar</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {calendar.name} ({calendar.year})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                Holiday Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Independence Day, New Year's Day"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Holiday Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TYPE_CONFIG).slice(0, 4).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key as HolidayType)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                        type === key
                          ? `${config.bgColor} ${config.color} border-2`
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={14} />
                      {config.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CONFIRMED', 'TENTATIVE', 'CANCELLED'] as HolidayStatus[]).map((stat) => (
                  <button
                    key={stat}
                    type="button"
                    onClick={() => setStatus(stat)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      status === stat
                        ? stat === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100 border-2' :
                          stat === 'TENTATIVE' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 border-2' :
                          'bg-red-50 text-red-600 border-red-100 border-2'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or notes about this holiday..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[60px] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Recurring
                  </label>
                  <p className="text-[10px] text-gray-500">Repeat every year</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRecurring(!recurring)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    recurring ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    recurring ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Half Day
                  </label>
                  <p className="text-[10px] text-gray-500">Half day holiday</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHalfDay(!halfDay)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    halfDay ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    halfDay ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              {halfDay && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">hours</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
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

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Mandatory
                  </label>
                  <p className="text-[10px] text-gray-500">All employees must take off</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMandatory(!mandatory)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    mandatory ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    mandatory ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Override Allowed
                  </label>
                  <p className="text-[10px] text-gray-500">Allow work on this holiday</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOverrideAllowed(!overrideAllowed)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    overrideAllowed ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    overrideAllowed ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {overrideAllowed && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Max Workers Allowed
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={maxWorkersAllowed || ''}
                      onChange={(e) => setMaxWorkersAllowed(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                      placeholder="No limit"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">employees</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Public, National, Celebration"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Special Notes
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Additional information or restrictions..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[60px] focus:ring-4 focus:ring-[#1E1B4B]/5 outline-none"
              maxLength={200}
            />
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-blue-500" />
              <div>
                <p className="text-xs font-bold text-blue-700">Holiday Preview</p>
                <p className="text-[10px] text-blue-600">
                  {name || 'New Holiday'} • {date ? new Date(date).toLocaleDateString() : 'Select date'} • 
                  {type} • {payMultiplier}x pay • {mandatory ? 'Mandatory' : 'Optional'}
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
            onClick={handleSave}
            disabled={!name.trim() || !date}
            className="flex-[2] py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:shadow-2xl hover:shadow-[#1E1B4B]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> Add Holiday
          </button>
        </div>
      </div>
    </div>
  );
};

// Publish Calendar Modal Component
const PublishCalendarModal: React.FC<{
  calendar: HolidayCalendar;
  onClose: () => void;
  onPublish: (calendarId: string, publishOption: PublishOption, schedule?: string) => void;
}> = ({ calendar, onClose, onPublish }) => {
  const [publishOption, setPublishOption] = useState<PublishOption>('IMMEDIATELY');
  const [publishSchedule, setPublishSchedule] = useState('');
  const [notifyEmployees, setNotifyEmployees] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(`The ${calendar.year} holiday calendar has been published. Please review the updated holiday schedule.`);

  const handlePublish = () => {
    onPublish(calendar.id, publishOption, publishOption === 'SCHEDULED' ? publishSchedule : undefined);
  };

  const getAffectedCount = () => {
    return calendar.employeeCount.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <Send size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Publish Calendar</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {calendar.name}
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
              <CheckCircle2 size={20} className="text-green-600" />
              <div>
                <p className="text-sm font-bold text-green-800">Ready to Publish</p>
                <p className="text-[10px] text-green-600">
                  Calendar has {calendar.holidayCount} holidays and affects {getAffectedCount()} employees
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
              Publish Options
            </h4>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPublishOption('IMMEDIATELY')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                  publishOption === 'IMMEDIATELY' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg ${publishOption === 'IMMEDIATELY' ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center text-white`}>
                  {publishOption === 'IMMEDIATELY' ? <Check size={12} /> : null}
                </div>
                <div>
                  <span className={`text-xs font-bold ${publishOption === 'IMMEDIATELY' ? 'text-green-600' : 'text-gray-600'}`}>
                    Publish Immediately
                  </span>
                  <p className="text-[10px] text-gray-500">Calendar goes live immediately</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPublishOption('SCHEDULED')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                  publishOption === 'SCHEDULED' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg ${publishOption === 'SCHEDULED' ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center text-white`}>
                  {publishOption === 'SCHEDULED' ? <Check size={12} /> : null}
                </div>
                <div>
                  <span className={`text-xs font-bold ${publishOption === 'SCHEDULED' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Schedule Publish
                  </span>
                  <p className="text-[10px] text-gray-500">Set future date for publishing</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPublishOption('MANUAL')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                  publishOption === 'MANUAL' 
                    ? 'border-gray-500 bg-gray-50' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg ${publishOption === 'MANUAL' ? 'bg-gray-500' : 'bg-gray-200'} flex items-center justify-center text-white`}>
                  {publishOption === 'MANUAL' ? <Check size={12} /> : null}
                </div>
                <div>
                  <span className={`text-xs font-bold ${publishOption === 'MANUAL' ? 'text-gray-600' : 'text-gray-500'}`}>
                    Manual Activation
                  </span>
                  <p className="text-[10px] text-gray-500">Activate later via calendar settings</p>
                </div>
              </button>
            </div>
          </div>

          {publishOption === 'SCHEDULED' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishSchedule}
                onChange={(e) => setPublishSchedule(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
              />
            </div>
          )}

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
                  Publishing this calendar will immediately affect {getAffectedCount()} employees across {calendar.sites.length} sites. 
                  All holiday policies will become active and visible to assigned employees.
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
            <Send size={16} /> Publish Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

// Holiday Detail Modal Component
const HolidayDetailModal: React.FC<{
  holiday: Holiday;
  onClose: () => void;
}> = ({ holiday, onClose }) => {
  const TypeIcon = TYPE_CONFIG[holiday.type].icon;
  const country = COUNTRIES.find(c => c.code === holiday.countryCode);
  
  return (
    <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${TYPE_CONFIG[holiday.type].bgColor} flex items-center justify-center ${TYPE_CONFIG[holiday.type].color}`}>
              <TypeIcon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{holiday.name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Type</span>
              <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${TYPE_CONFIG[holiday.type].bgColor} ${TYPE_CONFIG[holiday.type].color}`}>
                {TYPE_CONFIG[holiday.type].label}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</span>
              <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${HOLIDAY_STATUS_CONFIG[holiday.status].bgColor} ${HOLIDAY_STATUS_CONFIG[holiday.status].color}`}>
                {HOLIDAY_STATUS_CONFIG[holiday.status].label}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pay Rate</span>
              <span className="text-sm font-bold text-purple-600">{holiday.payMultiplier}x</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Mandatory</span>
              <span className={`text-sm font-bold ${holiday.mandatory ? 'text-red-600' : 'text-green-600'}`}>
                {holiday.mandatory ? 'Yes' : 'No'}
              </span>
            </div>
            
            {holiday.halfDay && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Half Day Hours</span>
                <span className="text-sm font-bold text-yellow-600">{holiday.halfDayHours} hours</span>
              </div>
            )}
            
            {holiday.recurring && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Recurring</span>
                <span className="text-sm font-bold text-green-600">Yes ({holiday.recurringPattern})</span>
              </div>
            )}
            
            {holiday.overrideAllowed && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Work Allowed</span>
                <span className="text-sm font-bold text-blue-600">
                  {holiday.maxWorkersAllowed ? `Max ${holiday.maxWorkersAllowed} employees` : 'Unlimited'}
                </span>
              </div>
            )}
            
            {country && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Country</span>
                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  {country.flag} {country.name}
                </span>
              </div>
            )}
          </div>

          {holiday.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Description</h4>
              <p className="text-sm text-gray-600">{holiday.description}</p>
            </div>
          )}

          {holiday.specialNotes && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Special Notes</h4>
              <p className="text-sm text-gray-600">{holiday.specialNotes}</p>
            </div>
          )}

          {holiday.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {holiday.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Created: {new Date(holiday.createdAt).toLocaleDateString()}</span>
              <span>By: {holiday.createdBy}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Edit functionality would go here
              alert('Edit holiday functionality');
            }}
            className="flex-1 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Edit Holiday
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export const HolidayCalendarList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [calendars, setCalendars] = useState<HolidayCalendar[]>(ENHANCED_MOCK_CALENDARS);
  const [selectedCalendar, setSelectedCalendar] = useState<HolidayCalendar | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isCreateCalendarOpen, setIsCreateCalendarOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [isPublishCalendarOpen, setIsPublishCalendarOpen] = useState(false);
  const [isHolidayDetailOpen, setIsHolidayDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState(2025);
  const [filterStatus, setFilterStatus] = useState<CalendarStatus | 'ALL'>('ALL');
  const [filterCountry, setFilterCountry] = useState<string>('ALL');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const filteredCalendars = useMemo(() => {
    return calendars.filter(cal => {
      const matchesSearch = 
        cal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cal.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cal.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesYear = cal.year === filterYear;
      const matchesStatus = filterStatus === 'ALL' || cal.status === filterStatus;
      const matchesCountry = filterCountry === 'ALL' || cal.country === filterCountry;
      
      return matchesSearch && matchesYear && matchesStatus && matchesCountry;
    });
  }, [calendars, searchQuery, filterYear, filterStatus, filterCountry]);

  const stats = useMemo(() => {
    const totalCalendars = calendars.length;
    const activeCalendars = calendars.filter(c => c.status === 'ACTIVE').length;
    const publishedCalendars = calendars.filter(c => c.isPublished).length;
    const totalHolidays = calendars.reduce((sum, cal) => sum + cal.holidayCount, 0);
    const employeesCovered = calendars.reduce((sum, cal) => sum + cal.employeeCount, 0);
    const upcomingHolidays = UPCOMING_HOLIDAYS.length;
    
    return { totalCalendars, activeCalendars, publishedCalendars, totalHolidays, employeesCovered, upcomingHolidays };
  }, [calendars]);

  const handleCreateCalendar = (data: Omit<HolidayCalendar, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'holidays' | 'holidayCount' | 'employeeCount' | 'isPublished'>) => {
    const newCalendar: HolidayCalendar = {
      ...data,
      id: `CAL-${Date.now()}`,
      holidayCount: 0,
      employeeCount: 0,
      holidays: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      isPublished: false,
    };
    setCalendars(prev => [newCalendar, ...prev]);
    setIsCreateCalendarOpen(false);
  };

  const handleAddHoliday = (holidayData: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!selectedCalendar) return;

    const newHoliday: Holiday = {
      ...holidayData,
      id: `HOL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };

    setCalendars(prev => prev.map(cal => 
      cal.id === selectedCalendar.id 
        ? { 
            ...cal, 
            holidays: [...cal.holidays, newHoliday],
            holidayCount: cal.holidayCount + 1,
            updatedAt: new Date().toISOString()
          }
        : cal
    ));
    
    setIsAddHolidayOpen(false);
  };

  const handlePublishCalendar = (calendarId: string, publishOption: PublishOption, schedule?: string) => {
    const publishDate = publishOption === 'SCHEDULED' && schedule 
      ? new Date(schedule).toISOString() 
      : new Date().toISOString();

    setCalendars(prev => prev.map(cal => 
      cal.id === calendarId 
        ? { 
            ...cal, 
            status: 'ACTIVE',
            isPublished: true,
            publishedAt: publishDate,
            publishedBy: 'Current User',
            publishSchedule: schedule,
            updatedAt: new Date().toISOString()
          }
        : cal
    ));
    setIsPublishCalendarOpen(false);
  };

  const handleDuplicateCalendar = (calendar: HolidayCalendar) => {
    const newCalendar: HolidayCalendar = {
      ...calendar,
      id: `CAL-${Date.now()}`,
      code: `${calendar.code}-COPY`,
      name: `${calendar.name} (Copy)`,
      status: 'DRAFT',
      isPublished: false,
      employeeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };
    setCalendars(prev => [newCalendar, ...prev]);
    setActiveActionMenu(null);
  };

  const handleDeleteCalendar = (calendarId: string) => {
    const cal = calendars.find(c => c.id === calendarId);
    if (cal?.employeeCount && cal.employeeCount > 0) {
      alert('Cannot delete calendar with assigned employees');
      return;
    }
    if (window.confirm('Are you sure you want to delete this holiday calendar?')) {
      setCalendars(prev => prev.filter(c => c.id !== calendarId));
    }
    setActiveActionMenu(null);
  };

  const handleToggleStatus = (calendarId: string, newStatus: CalendarStatus) => {
    setCalendars(prev => prev.map(cal => 
      cal.id === calendarId 
        ? { ...cal, status: newStatus, updatedAt: new Date().toISOString() }
        : cal
    ));
    setActiveActionMenu(null);
  };

  const handleViewDetails = (cal: HolidayCalendar) => {
    setSelectedCalendar(cal);
    setViewMode('DETAIL');
  };

  const handleViewHolidayDetail = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsHolidayDetailOpen(true);
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getCountryFlag = (countryName: string) => {
    const country = COUNTRIES.find(c => c.name === countryName);
    return country?.flag || '🏳️';
  };

  const renderYearCalendar = () => {
    if (!selectedCalendar) return null;

    const months = Array.from({ length: 12 }, (_, i) => 
      new Date(selectedCalendar.year, i, 1).toLocaleString('default', { month: 'long' })
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month, monthIdx) => {
          const monthHolidays = selectedCalendar.holidays.filter(h => {
            const date = new Date(h.date);
            return date.getMonth() === monthIdx && date.getFullYear() === selectedCalendar.year;
          });
          const firstDay = new Date(selectedCalendar.year, monthIdx, 1).getDay();
          const daysInMonth = new Date(selectedCalendar.year, monthIdx + 1, 0).getDate();
          
          return (
            <div key={monthIdx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-purple-800 uppercase tracking-widest">{month}</h4>
                  <span className="text-[10px] font-bold text-purple-600 bg-white px-2 py-1 rounded-full">
                    {monthHolidays.length} holiday{monthHolidays.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center text-[9px] font-bold text-gray-400 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 42 }).map((_, idx) => {
                    const day = idx - firstDay + 1;
                    const isCurrentMonth = day > 0 && day <= daysInMonth;
                    
                    if (!isCurrentMonth) {
                      return <div key={idx} className="aspect-square"></div>;
                    }

                    const date = new Date(selectedCalendar.year, monthIdx, day);
                    const dateStr = date.toISOString().split('T')[0];
                    const holiday = selectedCalendar.holidays.find(h => h.date === dateStr);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <div
                        key={idx}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold relative group cursor-pointer ${
                          holiday 
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md' 
                            : isToday
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : isWeekend
                            ? 'bg-gray-50 text-gray-400'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => holiday && handleViewHolidayDetail(holiday)}
                      >
                        <span>{day}</span>
                        {holiday && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400 ring-2 ring-white"></div>
                        )}
                        {isToday && !holiday && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {monthHolidays.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {monthHolidays.slice(0, 2).map(holiday => {
                      const Icon = TYPE_CONFIG[holiday.type].icon;
                      return (
                        <div key={holiday.id} className="flex items-center gap-2 mb-1 last:mb-0">
                          <div className={`w-6 h-6 rounded-lg ${TYPE_CONFIG[holiday.type].bgColor} flex items-center justify-center`}>
                            <Icon size={12} className={TYPE_CONFIG[holiday.type].color} />
                          </div>
                          <span className="text-[10px] font-medium text-gray-700 truncate">
                            {holiday.name}
                          </span>
                        </div>
                      );
                    })}
                    {monthHolidays.length > 2 && (
                      <div className="text-[9px] text-gray-500 text-center font-medium">
                        +{monthHolidays.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <CalendarDays className="text-[#1E1B4B]" size={28} /> 
            <span className="bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] bg-clip-text text-transparent">
              Holiday Calendars
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">
            Configure regional and site-specific holiday schedules with compliance tracking
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
              <GridIcon size={14} /> Grid
            </button>
          </div>
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 outline-none shadow-sm focus:ring-4 focus:ring-[#1E1B4B]/5"
          >
            <option value={2024}>Year: 2024</option>
            <option value={2025}>Year: 2025</option>
            <option value={2026}>Year: 2026</option>
          </select>
          <button 
            onClick={() => setIsCreateCalendarOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Calendar
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Calendars</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1E1B4B]">{stats.totalCalendars}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-600">{stats.activeCalendars}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Published</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600">{stats.publishedCalendars}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Holidays</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600">{stats.totalHolidays}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] p-5 rounded-2xl shadow-xl shadow-[#1E1B4B]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Employees Covered</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">{stats.employeesCovered.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* UPCOMING HOLIDAYS */}
      <div className="bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] rounded-3xl p-6 text-white shadow-xl shadow-[#1E1B4B]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Upcoming Holidays</h3>
              <p className="text-[11px] text-white/70 font-medium">Next 30 days across all calendars</p>
            </div>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl transition-all border border-white/10 flex items-center gap-2">
            <Bell size={12} /> Set Reminders
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {UPCOMING_HOLIDAYS.map((holiday, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                  {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${TYPE_CONFIG[holiday.type].bgColor} ${TYPE_CONFIG[holiday.type].color}`}>
                  {holiday.type.charAt(0)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{holiday.name}</h4>
              <p className="text-[10px] text-white/60 font-medium">{holiday.calendar}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[9px] text-white/40">
                  {getDayName(holiday.date)}
                </span>
                <ChevronRight size={12} className="text-white/30 group-hover:text-white/60 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search calendars by name, code, description, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1E1B4B]/10 outline-none"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as CalendarStatus | 'ALL')}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
        </select>
        <select 
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
        >
          <option value="ALL">All Countries</option>
          {[...new Set(calendars.map(c => c.country))].map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Filter size={14} /> More Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
          <Download size={14} /> Export
        </button>
      </div>

      {/* MAIN CONTENT */}
      {viewMode === 'DETAIL' && selectedCalendar ? (
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
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{selectedCalendar.name}</h2>
                  <span className="text-xs font-black text-[#1E1B4B] bg-[#1E1B4B]/5 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {selectedCalendar.code}
                  </span>
                  {selectedCalendar.isPublished && (
                    <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Published
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 font-medium">{selectedCalendar.year} • {selectedCalendar.country}</span>
                  <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                    <MapPin size={12} /> {selectedCalendar.sites.length} sites
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!selectedCalendar.isPublished ? (
                <button 
                  onClick={() => setIsPublishCalendarOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Send size={18} /> Publish Calendar
                </button>
              ) : (
                <button 
                  onClick={() => setIsAddHolidayOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#1E1B4B]/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus size={18} /> Add Holiday
                </button>
              )}
            </div>
          </div>

          {/* CALENDAR STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Holidays</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-600">{selectedCalendar.holidayCount}</span>
                <span className="text-xs text-gray-400">days</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Employees Covered</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-600">{selectedCalendar.employeeCount.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Compliance Level</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${
                  selectedCalendar.complianceLevel === 'HIGH' ? 'text-green-600' :
                  selectedCalendar.complianceLevel === 'MEDIUM' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {selectedCalendar.complianceLevel}
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${STATUS_CONFIG[selectedCalendar.status].color}`}>
                  {STATUS_CONFIG[selectedCalendar.status].label}
                </span>
              </div>
            </div>
          </div>

          {/* YEAR CALENDAR VIEW */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={18} className="text-purple-500" /> {selectedCalendar.year} Calendar Overview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                  {selectedCalendar.holidays.length} holidays marked
                </span>
              </div>
            </div>
            {renderYearCalendar()}
          </div>

          {/* HOLIDAY LIST */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="text-purple-500" size={18} /> Holiday Schedule
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 uppercase tracking-tighter">
                      {selectedCalendar.holidays.length} Events
                    </span>
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700">
                      Sort by Date
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Holiday Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedCalendar.holidays.map((holiday) => {
                        const HolidayIcon = TYPE_CONFIG[holiday.type].icon;
                        return (
                          <tr 
                            key={holiday.id} 
                            className="group hover:bg-gray-50 transition-all cursor-pointer"
                            onClick={() => handleViewHolidayDetail(holiday)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-800 tabular-nums">
                                  {new Date(holiday.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                  {getDayName(holiday.date)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${TYPE_CONFIG[holiday.type].bgColor} flex items-center justify-center`}>
                                  <HolidayIcon size={14} className={TYPE_CONFIG[holiday.type].color} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-700">{holiday.name}</p>
                                  {holiday.description && (
                                    <p className="text-[11px] text-gray-500 truncate max-w-[200px]">{holiday.description}</p>
                                  )}
                                  <div className="flex items-center gap-1 mt-1">
                                    {holiday.recurring && (
                                      <span className="text-[8px] text-indigo-500 font-black uppercase tracking-tighter bg-indigo-50 px-1 py-0.5 rounded">
                                        RECURRING
                                      </span>
                                    )}
                                    {holiday.halfDay && (
                                      <span className="text-[8px] text-yellow-600 font-black uppercase tracking-tighter bg-yellow-50 px-1 py-0.5 rounded">
                                        HALF DAY
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${TYPE_CONFIG[holiday.type].bgColor} ${TYPE_CONFIG[holiday.type].color}`}>
                                {TYPE_CONFIG[holiday.type].label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${HOLIDAY_STATUS_CONFIG[holiday.status].bgColor} ${HOLIDAY_STATUS_CONFIG[holiday.status].color}`}>
                                {holiday.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 justify-end transition-all">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewHolidayDetail(holiday);
                                  }}
                                  className="p-2 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Edit holiday
                                  }}
                                  className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* CALENDAR INFO */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Info size={16} /> Calendar Information
                  </h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scope</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCalendar.scope}</p>
                    {selectedCalendar.scopeDetails && (
                      <p className="text-[11px] text-gray-500">{selectedCalendar.scopeDetails}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sites</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCalendar.sites.map(site => (
                        <span key={site} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100">
                          {site}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCalendar.departments.map(dept => (
                        <span key={dept} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCalendar.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-bold rounded border border-purple-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created</span>
                      <span className="text-[11px] font-bold text-gray-600">
                        {new Date(selectedCalendar.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</span>
                      <span className="text-[11px] font-bold text-gray-600">
                        {new Date(selectedCalendar.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPLIANCE CHECK */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-100">Compliance Check</h4>
                    <p className="text-[11px] text-emerald-100/70">Labor law verification</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/90 leading-relaxed font-medium mb-4">
                  All {selectedCalendar.holidayCount} public holidays match the {selectedCalendar.year} Government Gazette. 
                  {selectedCalendar.complianceLevel === 'HIGH' && ' Full compliance with labor regulations.'}
                  {selectedCalendar.complianceLevel === 'MEDIUM' && ' Minor adjustments needed for full compliance.'}
                  {selectedCalendar.complianceLevel === 'LOW' && ' Review required for labor law compliance.'}
                </p>
                <button className="w-full text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-3 px-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2">
                  <Shield size={12} /> Run Compliance Audit
                </button>
              </div>

              {/* ACTIONS */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Settings size={16} /> Quick Actions
                </h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleDuplicateCalendar(selectedCalendar)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Copy size={16} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Duplicate Calendar</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <UserPlus size={16} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Apply to Employees</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        <Download size={16} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Export as CSV</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Bell size={16} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Configure Notifications</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'LIST' ? (
        /* LIST VIEW */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Globe size={18} className="text-[#1E1B4B]" /> Holiday Calendars
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                Showing: {filteredCalendars.length} of {calendars.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 border-b border-gray-100">
                  <th className="px-8 py-4">Calendar Details</th>
                  <th className="px-6 py-4">Year & Country</th>
                  <th className="px-6 py-4">Scope</th>
                  <th className="px-6 py-4 text-center">Stats</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCalendars.map((cal) => (
                  <tr key={cal.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1B4B]/5 to-[#3B357A]/5 border border-[#1E1B4B]/10 flex items-center justify-center text-[#1E1B4B]">
                          {cal.isTemplate ? <FileText size={20} /> : <Globe size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-gray-800">{cal.name}</p>
                            <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {cal.code}
                            </span>
                            {cal.isTemplate && (
                              <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                TEMPLATE
                              </span>
                            )}
                          </div>
                          {cal.description && (
                            <p className="text-[10px] text-gray-500 truncate max-w-[300px]">{cal.description}</p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cal.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                            {cal.tags.length > 2 && (
                              <span className="text-[8px] font-bold text-gray-400">+{cal.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-[#1E1B4B] tabular-nums">{cal.year}</span>
                          <span className="text-lg">{getCountryFlag(cal.country)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500">{cal.country}</span>
                          {cal.state && (
                            <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {cal.state}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 size={12} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-600">{cal.sites.length} sites</span>
                        </div>
                        <p className="text-[9px] text-gray-400 truncate max-w-[120px]">
                          {cal.sites.slice(0, 2).join(', ')}
                          {cal.sites.length > 2 && ` +${cal.sites.length - 2}`}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {cal.allowOverrides && (
                            <span className="text-[7px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded border border-green-100">
                              Override
                            </span>
                          )}
                          {cal.requireApproval && (
                            <span className="text-[7px] font-bold text-orange-600 bg-orange-50 px-1 py-0.5 rounded border border-orange-100">
                              Approval
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex flex-col items-center gap-1 px-3 py-2 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-black text-purple-600 tabular-nums">{cal.holidayCount}</span>
                          <span className="text-[10px] text-gray-400">holidays</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={10} className="text-gray-400" />
                          <span className="text-[9px] font-bold text-gray-500">{cal.employeeCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${STATUS_CONFIG[cal.status].bgColor} ${STATUS_CONFIG[cal.status].color}`}>
                          {STATUS_CONFIG[cal.status].label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold ${
                          cal.complianceLevel === 'HIGH' ? 'bg-green-100 text-green-700' :
                          cal.complianceLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {cal.complianceLevel} Compliance
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleViewDetails(cal)}
                          className="p-2 text-gray-400 hover:text-[#1E1B4B] hover:bg-[#1E1B4B]/5 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {!cal.isPublished && (
                          <button 
                            onClick={() => {
                              setSelectedCalendar(cal);
                              setIsPublishCalendarOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Publish"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        <div className="relative">
                          <button 
                            onClick={() => setActiveActionMenu(activeActionMenu === cal.id ? null : cal.id)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeActionMenu === cal.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                              <button
                                onClick={() => handleDuplicateCalendar(cal)}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy size={14} /> Duplicate Calendar
                              </button>
                              <button
                                onClick={() => handleViewDetails(cal)}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit3 size={14} /> Edit Calendar
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              {cal.status === 'ACTIVE' ? (
                                <button
                                  onClick={() => handleToggleStatus(cal.id, 'ARCHIVED')}
                                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Archive size={14} /> Archive
                                </button>
                              ) : cal.status === 'DRAFT' ? (
                                <button
                                  onClick={() => handleToggleStatus(cal.id, 'ACTIVE')}
                                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-green-700 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <CheckCircle2 size={14} /> Activate
                                </button>
                              ) : cal.status === 'ARCHIVED' ? (
                                <button
                                  onClick={() => handleToggleStatus(cal.id, 'DRAFT')}
                                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <RefreshCw size={14} /> Restore
                                </button>
                              ) : null}
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => handleDeleteCalendar(cal.id)}
                                disabled={cal.employeeCount > 0}
                                className={`w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2 ${
                                  cal.employeeCount > 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={cal.employeeCount > 0 ? 'Cannot delete calendar with assigned employees' : ''}
                              >
                                <Trash2 size={14} /> Delete Calendar
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
            {filteredCalendars.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
                <CalendarDays size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Calendars Found</h3>
                <p className="text-sm font-medium mt-2">Adjust your search or create a new calendar.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalendars.map(cal => (
            <div key={cal.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#1E1B4B] group-hover:scale-110 transition-transform">
                <CalendarDays size={80} />
              </div>
              <div className="flex flex-col h-full relative z-10">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E1B4B]/5 to-[#3B357A]/5 border border-[#1E1B4B]/10 flex items-center justify-center text-[#1E1B4B]">
                        {cal.isTemplate ? <FileText size={24} /> : <Globe size={24} />}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-800 line-clamp-1">{cal.name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{cal.code}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${STATUS_CONFIG[cal.status].bgColor} ${STATUS_CONFIG[cal.status].color}`}>
                        {STATUS_CONFIG[cal.status].label}
                      </span>
                      <span className="text-xs font-black text-gray-400 tabular-nums">{cal.year}</span>
                    </div>
                  </div>
                  
                  {cal.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-3">{cal.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCountryFlag(cal.country)}</span>
                      <span className="text-[10px] font-bold text-gray-600">{cal.country}</span>
                    </div>
                    {cal.isTemplate && (
                      <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        TEMPLATE
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6 flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
                      <p className="text-xl font-black text-purple-600">{cal.holidayCount}</p>
                      <p className="text-[10px] text-purple-800 uppercase font-bold">Holidays</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                      <p className="text-xl font-black text-blue-600">{cal.employeeCount}</p>
                      <p className="text-[10px] text-blue-800 uppercase font-bold">Employees</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{cal.sites.slice(0, 2).join(', ')}</span>
                      {cal.sites.length > 2 && <span className="text-[10px] text-gray-400">+{cal.sites.length - 2}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        cal.complianceLevel === 'HIGH' ? 'bg-green-100 text-green-700' :
                        cal.complianceLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {cal.complianceLevel}
                      </span>
                      <div className="flex gap-1">
                        {cal.allowOverrides && (
                          <span className="text-[8px] font-bold text-green-600" title="Override Allowed">○</span>
                        )}
                        {cal.requireApproval && (
                          <span className="text-[8px] font-bold text-orange-600" title="Approval Required">⚠</span>
                        )}
                      </div>
                    </div>
                    
                    {cal.tags && cal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {cal.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDetails(cal)}
                      className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      View Calendar
                    </button>
                    <button 
                      onClick={() => handleDuplicateCalendar(cal)}
                      className="p-2.5 bg-gradient-to-r from-[#1E1B4B] to-[#3B357A] text-white rounded-xl hover:scale-105 transition-all"
                      title="Duplicate"
                    >
                      <Copy size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {isCreateCalendarOpen && (
        <CreateCalendarModal
          onClose={() => setIsCreateCalendarOpen(false)}
          onCreate={handleCreateCalendar}
        />
      )}

      {isAddHolidayOpen && selectedCalendar && (
        <AddHolidayModal
          calendar={selectedCalendar}
          onClose={() => setIsAddHolidayOpen(false)}
          onSave={handleAddHoliday}
        />
      )}

      {isPublishCalendarOpen && selectedCalendar && (
        <PublishCalendarModal
          calendar={selectedCalendar}
          onClose={() => setIsPublishCalendarOpen(false)}
          onPublish={handlePublishCalendar}
        />
      )}

      {isHolidayDetailOpen && selectedHoliday && (
        <HolidayDetailModal
          holiday={selectedHoliday}
          onClose={() => setIsHolidayDetailOpen(false)}
        />
      )}
    </div>
  );
};