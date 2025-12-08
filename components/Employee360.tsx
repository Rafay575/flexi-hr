
import React, { useState, useMemo } from 'react';
import { 
  User, Briefcase, CreditCard, Clock, Umbrella, TrendingUp, FileText, MessageSquare, Activity, 
  Mail, Phone, MapPin, Calendar, CheckCircle, MoreHorizontal, Share2, 
  Download, CalendarDays, Award, ArrowUpRight, FileCheck, AlertCircle, 
  ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Edit2, Building2, 
  Users, Layers, X, Save, History, FileQuestion,
  Tag, Plus, Search, DollarSign, Percent, ShieldCheck, Gift, Timer, 
  AlertTriangle, Moon, Sun, Coffee, Palmtree, Plane, Target, BarChart2, 
  Zap, MessageCircle, Grid, List, FolderOpen, Eye, Trash2, UploadCloud, Star,
  File as FileIcon, 
  Image as ImageIcon,
  Pin, StickyNote,
  UserPlus, Filter,
  Lock, ShieldAlert, FileX, Ban, AlertOctagon,
  CheckCircle2, XCircle
} from 'lucide-react';

// --- TYPES & PERMISSIONS ---
type Permission = 'VIEW_SUMMARY' | 'VIEW_JOB' | 'VIEW_PAYROLL' | 'VIEW_ATTENDANCE' | 'VIEW_LEAVES' | 'VIEW_PERFORMANCE' | 'VIEW_DOCUMENTS' | 'VIEW_SENSITIVE_NOTES' | 'VIEW_ACTIVITY_LOG' | 'MANAGE_JOB';

interface TabDef {
  id: string;
  label: string;
  icon: any;
  permission?: Permission;
}

const TABS: TabDef[] = [
  { id: 'summary', label: 'Summary', icon: User, permission: 'VIEW_SUMMARY' },
  { id: 'job', label: 'Job & Org', icon: Briefcase, permission: 'VIEW_JOB' },
  { id: 'payroll', label: 'Payroll Tags', icon: CreditCard, permission: 'VIEW_PAYROLL' },
  { id: 'attendance', label: 'Attendance', icon: Clock, permission: 'VIEW_ATTENDANCE' },
  { id: 'leaves', label: 'Leaves', icon: Umbrella, permission: 'VIEW_LEAVES' },
  { id: 'performance', label: 'Performance', icon: TrendingUp, permission: 'VIEW_PERFORMANCE' },
  { id: 'docs', label: 'Documents', icon: FileText, permission: 'VIEW_DOCUMENTS' },
  { id: 'notes', label: 'Notes', icon: MessageSquare, permission: 'VIEW_SENSITIVE_NOTES' },
  { id: 'activity', label: 'Activity', icon: Activity, permission: 'VIEW_ACTIVITY_LOG' },
];

// Mock User Permissions (Power User / HR Admin View)
const MOCK_USER_PERMISSIONS: Permission[] = [
    'VIEW_SUMMARY', 'VIEW_JOB', 'VIEW_PAYROLL', 'VIEW_ATTENDANCE', 
    'VIEW_LEAVES', 'VIEW_PERFORMANCE', 'VIEW_DOCUMENTS', 
    'VIEW_SENSITIVE_NOTES', 'VIEW_ACTIVITY_LOG', 'MANAGE_JOB'
];

// Enhanced Mock Data for History Events
interface HistoryChange {
    field: string;
    before: string;
    after: string;
}

interface HistoryEvent {
    id: string;
    type: string;
    status: 'Approved' | 'Pending' | 'Rejected' | 'Completed';
    date: string;
    time: string;
    reason: string;
    changedBy: {
        name: string;
        role: string;
        avatar?: string;
    };
    changes: HistoryChange[];
}

// --- ATTENDANCE TYPES ---
type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Weekend';

interface AttendanceLog {
    date: string;
    day: string;
    dayNum: number;
    status: AttendanceStatus;
    checkIn?: string;
    checkOut?: string;
    totalHours?: string;
    isLate?: boolean;
    isEarlyOut?: boolean;
    overtime?: string;
}

// --- PAYROLL MOCK DATA ---
type TagCategory = 'Earnings' | 'Deductions' | 'Perks' | 'Statutory';

interface PayrollTag {
  id: string;
  label: string;
  category: TagCategory;
  description?: string;
  isSystem?: boolean; // Cannot be removed
}

const ALL_PAYROLL_TAGS: PayrollTag[] = [
    { id: 't1', label: 'Basic Salary', category: 'Earnings', isSystem: true, description: 'Base component of salary structure' },
    { id: 't2', label: 'HRA', category: 'Earnings', description: 'House Rent Allowance (40% of Basic)' },
    { id: 't3', label: 'Provident Fund', category: 'Deductions', isSystem: true, description: 'Mandatory PF contribution (12%)' },
    { id: 't4', label: 'Professional Tax', category: 'Deductions', isSystem: true, description: 'State specific tax deduction' },
    { id: 't5', label: 'Health Insurance', category: 'Perks', description: 'Group Medical Cover - Family Floater' },
    { id: 't6', label: 'Remote Allowance', category: 'Earnings', description: 'Wfh operational costs' },
    { id: 't7', label: 'Gym Reimbursement', category: 'Perks', description: 'Wellness benefit up to $50/mo' },
    { id: 't8', label: 'TDS - New Regime', category: 'Statutory', description: 'Tax Deducted at Source' },
    { id: 't9', label: 'Gratuity Eligible', category: 'Statutory', isSystem: true, description: ' eligible after 5 years' },
    { id: 't10', label: 'Internet Allowance', category: 'Earnings', description: 'Broadband reimbursement' },
    { id: 't11', label: 'Car Lease', category: 'Deductions', description: 'Corporate lease recovery' },
    { id: 't12', label: 'Stock Options (ESOP)', category: 'Perks', description: 'Vested over 4 years' },
    { id: 't13', label: 'Special Allowance', category: 'Earnings', description: 'Balancing component' },
    { id: 't14', label: 'Meal Card', category: 'Perks', description: 'Tax-free food coupon' },
];

// --- LEAVES MOCK DATA ---
interface LeaveBalance {
    type: string;
    used: number;
    total: number;
    color: string;
    icon: any;
}

interface LeaveRequest {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    appliedOn: string;
}

// --- PERFORMANCE MOCK DATA ---
interface Goal {
    id: string;
    title: string;
    dueDate: string;
    progress: number;
    status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
    category: 'Business' | 'Development';
}

interface ReviewCycle {
    id: string;
    name: string;
    date: string;
    rating: number; // out of 5
    reviewer: string;
    status: 'Completed' | 'In Progress' | 'Signed Off';
}

interface Skill {
    name: string;
    score: number; // 1-10
}

// --- DOCUMENTS MOCK DATA ---
interface DocVersion {
    version: string;
    date: string;
    user: string;
    size: string;
}

interface EmployeeDocument {
    id: string;
    name: string;
    category: string;
    type: 'pdf' | 'jpg' | 'png' | 'docx' | 'xlsx';
    size: string;
    uploadDate: string;
    uploadedBy: string;
    versions: DocVersion[];
}

const DOCUMENTS_DATA: EmployeeDocument[] = [
    { 
        id: 'd1', name: 'Employment_Contract_Signed.pdf', category: 'Employment', type: 'pdf', size: '2.4 MB', uploadDate: 'Mar 15, 2021', uploadedBy: 'Alexandra M.',
        versions: [{ version: 'v1.0', date: 'Mar 15, 2021', user: 'Alexandra M.', size: '2.4 MB' }]
    },
    { 
        id: 'd2', name: 'University_Degree_Cert.jpg', category: 'Education', type: 'jpg', size: '4.1 MB', uploadDate: 'Mar 10, 2021', uploadedBy: 'Sarah Jenkins',
        versions: [{ version: 'v1.0', date: 'Mar 10, 2021', user: 'Sarah Jenkins', size: '4.1 MB' }]
    },
    { 
        id: 'd3', name: 'Tax_Declaration_FY23-24.xlsx', category: 'Tax & Compliance', type: 'xlsx', size: '45 KB', uploadDate: 'Apr 02, 2023', uploadedBy: 'Sarah Jenkins',
        versions: [
            { version: 'v2.1', date: 'Apr 02, 2023', user: 'Sarah Jenkins', size: '45 KB' },
            { version: 'v1.0', date: 'Mar 28, 2023', user: 'Sarah Jenkins', size: '42 KB' }
        ]
    },
    { 
        id: 'd4', name: 'Passport_Scan_Front.png', category: 'Personal ID', type: 'png', size: '1.2 MB', uploadDate: 'Mar 10, 2021', uploadedBy: 'Sarah Jenkins',
        versions: [{ version: 'v1.0', date: 'Mar 10, 2021', user: 'Sarah Jenkins', size: '1.2 MB' }]
    },
    { 
        id: 'd5', name: 'Relieving_Letter_Prev_Emp.pdf', category: 'Employment', type: 'pdf', size: '850 KB', uploadDate: 'Mar 12, 2021', uploadedBy: 'Sarah Jenkins',
        versions: [{ version: 'v1.0', date: 'Mar 12, 2021', user: 'Sarah Jenkins', size: '850 KB' }]
    },
    { 
        id: 'd6', name: 'Promotion_Letter_L4.pdf', category: 'Employment', type: 'pdf', size: '1.1 MB', uploadDate: 'Mar 15, 2023', uploadedBy: 'System',
        versions: [{ version: 'v1.0', date: 'Mar 15, 2023', user: 'System', size: '1.1 MB' }]
    },
    { 
        id: 'd7', name: 'Payslip_Oct_2023.pdf', category: 'Payroll', type: 'pdf', size: '120 KB', uploadDate: 'Oct 31, 2023', uploadedBy: 'System',
        versions: [{ version: 'v1.0', date: 'Oct 31, 2023', user: 'System', size: '120 KB' }]
    },
];

const DOC_CATEGORIES = ['All', 'Personal ID', 'Education', 'Employment', 'Tax & Compliance', 'Payroll', 'Medical'];

// --- NOTES MOCK DATA ---
interface Note {
  id: string;
  author: { name: string; role: string; avatar: string };
  content: string;
  date: string;
  isPinned: boolean;
}

const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    author: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' },
    content: 'Discussed potential leadership path during the Q3 review. Sarah is keen on mentoring junior designers. Recommend for "Lead" training program next quarter.',
    date: 'Oct 15, 2023, 10:30 AM',
    isPinned: true
  },
  {
    id: 'n2',
    author: { name: 'Alex Morgan', role: 'VP of Design', avatar: 'https://picsum.photos/100/100?random=20' },
    content: 'Exceptional work on the Design System v2.0 launch. The team velocity increased by 20% due to the new components.',
    date: 'Sep 28, 2023, 04:15 PM',
    isPinned: false
  },
  {
     id: 'n3',
     author: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' },
     content: 'Flight risk assessment: Low. Just purchased a house nearby and expressed long-term commitment.',
     date: 'Aug 10, 2023, 11:00 AM',
     isPinned: false
  }
];

// --- ACTIVITY LOG MOCK DATA ---
interface ActivityLog {
  id: string;
  type: 'Hiring' | 'Job Change' | 'Attendance' | 'Leave' | 'Transfer' | 'Exit' | 'Performance' | 'Document';
  title: string;
  description: string;
  date: string;
  user: string;
  icon: any;
  color: string;
}

const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'a1', type: 'Leave', title: 'Leave Request Approved', description: 'Annual Leave for 2 days (Oct 24-25)', date: 'Oct 20, 2023', user: 'Alex Morgan', icon: Umbrella, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'a2', type: 'Performance', title: 'Goal Completed', description: 'Achieved "Advanced Prototyping Certification"', date: 'Oct 15, 2023', user: 'Sarah Jenkins', icon: Target, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'a3', type: 'Attendance', title: 'Late Arrival Flag', description: 'Clocked in at 10:15 AM (Threshold: 09:30 AM)', date: 'Oct 12, 2023', user: 'System', icon: AlertTriangle, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'a4', type: 'Document', title: 'Payslip Generated', description: 'Payslip for September 2023 is now available', date: 'Sep 30, 2023', user: 'System', icon: FileText, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: 'a5', type: 'Job Change', title: 'Reporting Manager Update', description: 'Changed from Sarah Connor to Alex Morgan', date: 'Jan 01, 2022', user: 'Alexandra M.', icon: Users, color: 'bg-blue-100 text-flexi-primary border-blue-200' },
  { id: 'a6', type: 'Hiring', title: 'Onboarding Completed', description: 'All mandatory documents and training finished', date: 'Mar 20, 2021', user: 'System', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'a7', type: 'Hiring', title: 'Offer Accepted', description: 'Joined as Senior UX Designer', date: 'Mar 15, 2021', user: 'Sarah Jenkins', icon: UserPlus, color: 'bg-green-100 text-green-700 border-green-200' },
];

// --- REUSABLE UI COMPONENTS ---

const AccessDeniedState = () => (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Lock className="w-10 h-10 text-state-error" />
        </div>
        <h3 className="text-xl font-bold text-neutral-primary mb-2">Access Restricted</h3>
        <p className="text-neutral-secondary max-w-md mx-auto mb-6">
            You do not have permission to view this module. Please contact your system administrator if you believe this is an error.
        </p>
        <button className="px-5 py-3 bg-neutral-primary text-white text-sm font-medium rounded-lg hover:bg-neutral-secondary transition-colors shadow-sm">
            Return to Summary
        </button>
    </div>
);

const EmptyDataState = ({ 
    title = "No Data Found", 
    description = "There are no items to display at this time.", 
    icon: Icon = FileX,
    actionLabel,
    onAction
}: { 
    title?: string; 
    description?: string; 
    icon?: any; 
    actionLabel?: string; 
    onAction?: () => void;
}) => (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center animate-in fade-in">
        <div className="w-16 h-16 bg-neutral-page border border-neutral-border rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Icon className="w-8 h-8 text-neutral-muted" />
        </div>
        <h3 className="text-lg font-bold text-neutral-primary">{title}</h3>
        <p className="text-sm text-neutral-secondary mt-2 max-w-xs mx-auto">{description}</p>
        {actionLabel && onAction && (
            <button 
                onClick={onAction}
                className="mt-6 px-4 py-3 border border-neutral-border bg-white text-neutral-primary text-sm font-medium rounded-lg hover:bg-neutral-page hover:text-flexi-primary transition-colors shadow-sm"
            >
                {actionLabel}
            </button>
        )}
    </div>
);

const Employee360: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [userPermissions] = useState<Permission[]>(MOCK_USER_PERMISSIONS); 
  
  const [isEditJobDrawerOpen, setIsEditJobDrawerOpen] = useState(false);
  const [isManageTagsDrawerOpen, setIsManageTagsDrawerOpen] = useState(false);
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState<HistoryEvent | null>(null);
  
  const [assignedTagIds, setAssignedTagIds] = useState<string[]>(['t1', 't2', 't3', 't4', 't5', 't8', 't9', 't13']);
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  const [currentAttendanceDate, setCurrentAttendanceDate] = useState(new Date());
  const [currentLeaveMonth, setCurrentLeaveMonth] = useState(new Date());

  const [docViewMode, setDocViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocCategory, setSelectedDocCategory] = useState('All');
  const [previewDoc, setPreviewDoc] = useState<EmployeeDocument | null>(null);

  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [isAddNoteDrawerOpen, setIsAddNoteDrawerOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePinned, setNewNotePinned] = useState(false);

  const [activityFilter, setActivityFilter] = useState('All');

  const hasPermission = (permission?: Permission) => {
      if (!permission) return true;
      return userPermissions.includes(permission);
  };

  const visibleTabs = useMemo(() => TABS.filter(tab => hasPermission(tab.permission)), [userPermissions]);

  const handleTabSwitch = (tabId: string) => {
      const tabDef = TABS.find(t => t.id === tabId);
      if (tabDef && hasPermission(tabDef.permission)) {
          setActiveTab(tabId);
      }
  };

  const isCurrentTabAllowed = useMemo(() => {
      const tabDef = TABS.find(t => t.id === activeTab);
      return tabDef ? hasPermission(tabDef.permission) : false;
  }, [activeTab, userPermissions]);

  // Data helpers...
  const employee = {
    name: "Sarah Jenkins",
    id: "EMP-2023-1042",
    designation: "Senior UX Designer",
    department: "Product Design",
    location: "New York, USA",
    status: "Active",
    joinDate: "Mar 15, 2021",
    email: "sarah.jenkins@flexi.com",
    phone: "+1 (555) 012-3456",
    manager: "Alex Morgan",
    avatar: "https://picsum.photos/200/200?random=10"
  };

  const jobDetails = {
    designation: "Senior UX Designer",
    grade: "L4 - Senior Individual Contributor",
    jobType: "Full-Time Permanent",
    workShift: "General Shift (9:00 AM - 6:00 PM)",
    department: "Product Design",
    subDepartment: "Consumer Mobile Apps",
    location: "New York HQ, Floor 4",
    costCenter: "CC-402 (Product R&D)",
    manager: {
        name: "Alex Morgan",
        role: "VP of Design",
        avatar: "https://picsum.photos/200/200?random=20",
        id: "EMP-2019-0043"
    }
  };

  const historyEvents: HistoryEvent[] = [
    { 
        id: 'evt-0', type: 'Transfer Request', status: 'Pending', date: 'Oct 26, 2023', time: '11:00 AM',
        reason: 'Requested relocation to London office for personal reasons.',
        changedBy: { name: 'Sarah Jenkins', role: 'Senior UX Designer', avatar: 'https://picsum.photos/200/200?random=10' },
        changes: [{ field: 'Location', before: 'New York HQ', after: 'London Office' }]
    },
    { 
        id: 'evt-1', type: 'Promotion', status: 'Completed', date: 'Mar 15, 2023', time: '10:42 AM', 
        reason: 'Annual Performance Review 2022 - Exceeded Expectations',
        changedBy: { name: 'System', role: 'Automated Process' },
        changes: [{ field: 'Designation', before: 'UX Designer', after: 'Senior UX Designer' }, { field: 'Grade', before: 'L3 - Mid Level', after: 'L4 - Senior Individual Contributor' }]
    },
    { 
        id: 'evt-2', type: 'Transfer', status: 'Approved', date: 'Jan 01, 2022', time: '09:15 AM', 
        reason: 'Internal Mobility Application - Project Titan',
        changedBy: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' },
        changes: [{ field: 'Department', before: 'Marketing Creative', after: 'Product Design' }, { field: 'Reporting Manager', before: 'Sarah Connor', after: 'Alex Morgan' }, { field: 'Location', before: 'London Office', after: 'New York HQ' }]
    }
  ];

  const timelineEvents = [
    { id: 1, title: 'Leave Request Approved', date: 'Oct 24, 2023', description: 'Casual Leave (2 Days)', icon: Umbrella, color: 'text-state-success bg-green-50' },
    { id: 2, title: 'Completed Compliance Training', date: 'Oct 15, 2023', description: 'Data Privacy & Security 101', icon: FileCheck, color: 'text-flexi-primary bg-flexi-light' },
    { id: 3, title: 'Quarterly Appraisal', date: 'Oct 01, 2023', description: 'Rating: 4.8/5 (Exceeds Expectations)', icon: Star, color: 'text-state-warning bg-yellow-50' },
    { id: 4, title: 'Role Designation Update', date: 'Mar 15, 2023', description: 'Promoted to Senior UX Designer', icon: Briefcase, color: 'text-flexi-primary bg-flexi-light' },
  ];

  const leaveBalances: LeaveBalance[] = [
      { type: 'Annual Leave', used: 12, total: 20, color: 'bg-flexi-primary', icon: Palmtree },
      { type: 'Sick Leave', used: 3, total: 10, color: 'bg-state-error', icon: Activity },
      { type: 'Casual Leave', used: 5, total: 8, color: 'bg-state-warning', icon: Coffee },
      { type: 'Comp Off', used: 1, total: 3, color: 'bg-purple-600', icon: Clock },
  ];

  const leaveRequests: LeaveRequest[] = [
      { id: 'lr-1', type: 'Annual Leave', startDate: 'Oct 24, 2023', endDate: 'Oct 25, 2023', days: 2, reason: 'Family function', status: 'Approved', appliedOn: 'Oct 10, 2023' },
      { id: 'lr-2', type: 'Sick Leave', startDate: 'Sep 12, 2023', endDate: 'Sep 12, 2023', days: 1, reason: 'Viral fever', status: 'Approved', appliedOn: 'Sep 12, 2023' },
      { id: 'lr-3', type: 'Casual Leave', startDate: 'Nov 15, 2023', endDate: 'Nov 18, 2023', days: 4, reason: 'Vacation', status: 'Pending', appliedOn: 'Oct 20, 2023' },
      { id: 'lr-4', type: 'Annual Leave', startDate: 'Aug 01, 2023', endDate: 'Aug 05, 2023', days: 5, reason: 'Summer trip', status: 'Rejected', appliedOn: 'Jul 15, 2023' },
  ];

  const performanceGoals: Goal[] = [
      { id: 'g1', title: 'Launch Mobile App Redesign v2.0', dueDate: 'Dec 31, 2023', progress: 85, status: 'On Track', category: 'Business' },
      { id: 'g2', title: 'Improve Design System Adoption', dueDate: 'Nov 15, 2023', progress: 60, status: 'At Risk', category: 'Business' },
      { id: 'g3', title: 'Complete Advanced Prototyping Certification', dueDate: 'Dec 15, 2023', progress: 100, status: 'Completed', category: 'Development' },
      { id: 'g4', title: 'Mentor 2 Junior Designers', dueDate: 'Ongoing', progress: 40, status: 'On Track', category: 'Development' },
  ];

  const performanceReviews: ReviewCycle[] = [
      { id: 'rev-1', name: 'Annual Review 2023', date: 'Mar 15, 2023', rating: 4.8, reviewer: 'Alex Morgan', status: 'Completed' },
      { id: 'rev-2', name: 'Mid-Year Check-in 2023', date: 'Sep 10, 2023', rating: 4.5, reviewer: 'Alex Morgan', status: 'Signed Off' },
      { id: 'rev-3', name: 'Annual Review 2022', date: 'Mar 10, 2022', rating: 4.2, reviewer: 'Sarah Connor', status: 'Completed' },
  ];

  const skills: Skill[] = [
      { name: 'UI/UX Design', score: 9.5 },
      { name: 'User Research', score: 8.0 },
      { name: 'Prototyping', score: 9.0 },
      { name: 'Leadership', score: 7.5 },
      { name: 'Communication', score: 8.5 },
  ];

  const feedbackItems = [
      { id: 'f1', user: 'Mike Ross', role: 'Product Manager', text: 'Sarah did an incredible job on the dashboard layout. It significantly improved user retention.', date: 'Oct 12' },
      { id: 'f2', user: 'Alex Morgan', role: 'VP of Design', text: 'Great initiative on the new design system components.', date: 'Sep 28' },
  ];

  const assignedTags = useMemo(() => {
    return ALL_PAYROLL_TAGS.filter(tag => assignedTagIds.includes(tag.id));
  }, [assignedTagIds]);

  const getTagsByCategory = (cat: TagCategory) => assignedTags.filter(t => t.category === cat);

  const toggleTag = (tagId: string) => {
    if (assignedTagIds.includes(tagId)) {
        setAssignedTagIds(assignedTagIds.filter(id => id !== tagId));
    } else {
        setAssignedTagIds([...assignedTagIds, tagId]);
    }
  };

  const getCategoryColor = (cat: TagCategory) => {
      switch(cat) {
          case 'Earnings': return 'bg-green-50 text-green-700 border-green-200';
          case 'Deductions': return 'bg-red-50 text-red-700 border-red-200';
          case 'Perks': return 'bg-purple-50 text-purple-700 border-purple-200';
          case 'Statutory': return 'bg-slate-50 text-slate-700 border-slate-200';
          default: return 'bg-neutral-page text-neutral-secondary border-neutral-border';
      }
  };

  const getCategoryIcon = (cat: TagCategory) => {
      switch(cat) {
          case 'Earnings': return <DollarSign className="w-4 h-4" />;
          case 'Deductions': return <Percent className="w-4 h-4" />;
          case 'Perks': return <Gift className="w-4 h-4" />;
          case 'Statutory': return <ShieldCheck className="w-4 h-4" />;
      }
  };

  const generateAttendanceData = (date: Date): AttendanceLog[] => {
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const logs: AttendanceLog[] = [];
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for(let i = 1; i <= daysInMonth; i++) {
          const d = new Date(date.getFullYear(), date.getMonth(), i);
          const dayName = weekdays[d.getDay()];
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          
          let status: AttendanceStatus = isWeekend ? 'Weekend' : 'Present';
          let checkIn = '09:00 AM';
          let checkOut = '06:00 PM';
          let totalHours = '09:00';
          let isLate = false;
          let isEarlyOut = false;
          let overtime = undefined;

          if (!isWeekend) {
              const rand = Math.random();
              if (rand > 0.95) status = 'Absent';
              else if (rand > 0.9) status = 'Leave';
              else if (rand > 0.85) status = 'Holiday';
              else {
                 if (Math.random() > 0.8) { checkIn = '09:24 AM'; isLate = true; totalHours = '08:36'; }
                 if (Math.random() > 0.9) { checkOut = '08:00 PM'; totalHours = '11:00'; overtime = '02:00'; }
                 if (Math.random() > 0.95) { checkOut = '04:30 PM'; isEarlyOut = true; totalHours = '07:30'; }
              }
          }

          if (status !== 'Present') { checkIn = '-'; checkOut = '-'; totalHours = '-'; isLate = false; isEarlyOut = false; overtime = undefined; }

          logs.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), day: dayName, dayNum: i, status, checkIn, checkOut, totalHours, isLate, isEarlyOut, overtime });
      }
      return logs.reverse();
  };

  const attendanceLogs = useMemo(() => generateAttendanceData(currentAttendanceDate), [currentAttendanceDate]);

  const changeMonth = (delta: number) => {
      const newDate = new Date(currentAttendanceDate);
      newDate.setMonth(newDate.getMonth() + delta);
      setCurrentAttendanceDate(newDate);
  };

  const changeLeaveMonth = (delta: number) => {
    const newDate = new Date(currentLeaveMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentLeaveMonth(newDate);
  };

  const renderLeaveCalendar = () => {
    const year = currentLeaveMonth.getFullYear();
    const month = currentLeaveMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) { days.push(<div key={`empty-${i}`} className="h-14 sm:h-20 bg-neutral-page/10 border border-neutral-border/50"></div>); }
    for (let d = 1; d <= daysInMonth; d++) {
        const isOct = month === 9;
        const isNov = month === 10;
        let cellClass = 'bg-white hover:bg-neutral-page';
        let badge = null;
        if (isOct && (d === 24 || d === 25)) { cellClass = 'bg-green-50 border-green-200'; badge = <div className="text-[10px] text-green-700 font-bold bg-green-100 px-1 rounded mt-1 truncate">Annual</div>; } 
        else if (isNov && (d >= 15 && d <= 18)) { cellClass = 'bg-yellow-50 border-yellow-200'; badge = <div className="text-[10px] text-yellow-700 font-bold bg-yellow-100 px-1 rounded mt-1 truncate">Casual</div>; }
        days.push(<div key={d} className={`h-14 sm:h-20 border border-neutral-border p-1 sm:p-2 transition-colors flex flex-col items-start ${cellClass}`}><span className={`text-xs font-semibold text-neutral-primary`}>{d}</span>{badge}</div>);
    }
    return days;
  };

  const filteredDocs = useMemo(() => {
    if (selectedDocCategory === 'All') return DOCUMENTS_DATA;
    return DOCUMENTS_DATA.filter(doc => doc.category === selectedDocCategory);
  }, [selectedDocCategory]);

  const getFileIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
        case 'jpg': case 'png': return <ImageIcon className="w-8 h-8 text-blue-500" />;
        case 'xlsx': return <Grid className="w-8 h-8 text-green-600" />;
        default: return <FileIcon className="w-8 h-8 text-neutral-500" />;
    }
  };

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    const newNote: Note = { id: `n${Date.now()}`, author: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' }, content: newNoteContent, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }), isPinned: newNotePinned };
    setNotes([newNote, ...notes]); setNewNoteContent(''); setNewNotePinned(false); setIsAddNoteDrawerOpen(false);
  };

  const deleteNote = (id: string) => { setNotes(notes.filter(n => n.id !== id)); };
  const pinnedNotes = notes.filter(n => n.isPinned);
  const otherNotes = notes.filter(n => !n.isPinned);

  const filteredActivities = useMemo(() => {
    if (activityFilter === 'All') return ACTIVITY_LOGS;
    if (activityFilter === 'HR') return ACTIVITY_LOGS.filter(a => a.type === 'Hiring' || a.type === 'Exit' || a.type === 'Transfer');
    if (activityFilter === 'System') return ACTIVITY_LOGS.filter(a => a.user === 'System');
    return ACTIVITY_LOGS;
  }, [activityFilter]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] min-h-[600px] relative">
      
      {/* LEFT SIDE: Fixed Profile Summary */}
      <aside className="w-full lg:w-80 shrink-0 flex flex-col bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden h-full">
        {/* Profile Header */}
        <div className="p-6 flex flex-col items-center text-center border-b border-neutral-border bg-gradient-to-br from-flexi-primary to-flexi-secondary">
           <div className="relative mb-4">
              <img src={employee.avatar} alt={employee.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-state-success border-2 border-white rounded-full"></span>
           </div>
           
           <h2 className="text-3xl font-bold text-white font-sans">{employee.name}</h2>
           <p className="text-sm font-medium text-flexi-gold mt-1">{employee.designation}</p>
           
           <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-xs font-mono text-white/90">{employee.id}</span>
              <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-white rounded text-xs font-bold uppercase tracking-wide">{employee.status}</span>
           </div>

           <div className="flex gap-2 mt-6 w-full">
              <button className="flex-1 px-4 py-3 text-xs font-bold text-flexi-primary bg-white rounded-lg hover:bg-flexi-gold hover:text-flexi-primary transition-colors shadow-sm">Actions</button>
              <button className="px-4 py-3 text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"><Share2 className="w-4 h-4" /></button>
              <button className="px-4 py-3 text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
           </div>
        </div>

        {/* Profile Details Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Contact & Work</h3>
                {[
                    { label: 'Email Address', value: employee.email, icon: Mail },
                    { label: 'Phone', value: employee.phone, icon: Phone },
                    { label: 'Department', value: employee.department, icon: Briefcase },
                    { label: 'Location', value: employee.location, icon: MapPin },
                    { label: 'Joining Date', value: employee.joinDate, icon: Calendar }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="p-2 bg-neutral-page rounded-lg text-neutral-secondary"><item.icon className="w-4 h-4" /></div>
                        <div className="overflow-hidden">
                            <p className="text-label text-neutral-secondary mb-0.5">{item.label}</p>
                            <p className="text-sm font-medium text-neutral-primary truncate" title={item.value}>{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t border-neutral-border">
                <div className="p-4 bg-flexi-light/30 border border-flexi-primary/10 rounded-lg">
                    <h4 className="text-sm font-bold text-flexi-primary mb-1">OnboardX Status</h4>
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-state-success" />
                        <span className="text-sm font-medium text-neutral-primary">Completed</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-state-success w-full"></div>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* RIGHT SIDE: Content Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-border shadow-card overflow-hidden h-full">
        
        {/* Tabs Header */}
        <div className="border-b border-neutral-border px-2 pt-2 bg-white sticky top-0 z-10">
           <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
              {visibleTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabSwitch(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap
                            ${isActive ? 'border-flexi-primary text-flexi-primary bg-flexi-light/10' : 'border-transparent text-neutral-secondary hover:text-neutral-primary hover:bg-neutral-page'}
                        `}
                    >
                        <tab.icon className={`w-4 h-4 ${isActive ? 'text-flexi-primary' : 'text-neutral-muted'}`} />
                        {tab.label}
                    </button>
                )
              })}
           </div>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto bg-neutral-page/30 p-6">
            <div className="max-w-5xl mx-auto h-full flex flex-col">
                {!isCurrentTabAllowed ? (
                    <AccessDeniedState />
                ) : (
                    <>
                        {/* 1. SUMMARY TAB */}
                        {activeTab === 'summary' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all duration-300 flex flex-col relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-orange-50 text-state-warning"><Umbrella className="w-5 h-5" /></div>
                                            <span className="text-xs font-medium text-neutral-muted bg-neutral-page px-2 py-1 rounded-full">Annual</span>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-3xl font-bold text-neutral-primary">12</h4>
                                            <p className="text-sm text-neutral-secondary font-medium mt-1">Leave Balance</p>
                                            <p className="text-xs text-neutral-muted mt-1">Out of 20 days per year</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all duration-300 flex flex-col relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-flexi-light text-flexi-primary"><Clock className="w-5 h-5" /></div>
                                            <div className="flex items-center text-xs font-bold text-state-success"><ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4%</div>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-3xl font-bold text-neutral-primary">98%</h4>
                                            <p className="text-sm text-neutral-secondary font-medium mt-1">Avg. Attendance</p>
                                            <p className="text-xs text-neutral-muted mt-1">Based on last 30 days</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-card hover:shadow-soft transition-all duration-300 flex flex-col relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-yellow-50 text-state-warning"><Star className="w-5 h-5 fill-state-warning" /></div>
                                            <span className="text-xs font-medium text-flexi-primary bg-flexi-light px-2 py-1 rounded-full">Top 10%</span>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-3xl font-bold text-neutral-primary">4.8<span className="text-lg text-neutral-muted font-normal">/5</span></h4>
                                            <p className="text-sm text-neutral-secondary font-medium mt-1">Performance Score</p>
                                            <p className="text-xs text-neutral-muted mt-1">Last Review: Outstanding</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    <div className="xl:col-span-2 bg-white rounded-xl border border-neutral-border shadow-card flex flex-col">
                                        <div className="p-6 border-b border-neutral-border flex justify-between items-center bg-neutral-page/10">
                                            <h3 className="font-bold text-lg text-neutral-primary flex items-center gap-2"><Activity className="w-5 h-5 text-flexi-primary" /> Recent Timeline</h3>
                                            <button className="text-xs font-medium text-flexi-primary hover:text-flexi-secondary transition-colors">View All History</button>
                                        </div>
                                        <div className="p-6 relative">
                                            <div className="absolute top-6 bottom-6 left-[37px] w-px bg-neutral-border"></div>
                                            <div className="space-y-8">
                                                {timelineEvents.map((event) => (
                                                    <div key={event.id} className="relative flex items-start gap-4 group">
                                                        <div className={`relative z-10 w-11 h-11 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 ${event.color}`}><event.icon className="w-5 h-5" /></div>
                                                        <div className="flex-1 pt-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-bold text-neutral-primary group-hover:text-flexi-primary transition-colors">{event.title}</h4>
                                                                <span className="text-xs text-neutral-muted font-medium bg-neutral-page px-2 py-1 rounded-full">{event.date}</span>
                                                            </div>
                                                            <p className="text-sm text-neutral-secondary mt-1">{event.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-card">
                                            <div className="p-6 border-b border-neutral-border bg-neutral-page/10">
                                                <h3 className="font-bold text-lg text-neutral-primary">Quick Actions</h3>
                                            </div>
                                            <div className="p-6 space-y-3">
                                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-border hover:border-flexi-primary hover:bg-flexi-light/20 transition-all group text-left shadow-sm hover:shadow-md bg-white">
                                                    <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-page rounded text-neutral-secondary group-hover:text-flexi-primary"><Download className="w-4 h-4" /></div><span className="text-sm font-medium text-neutral-primary">Download Payslip</span></div><ChevronRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-primary" />
                                                </button>
                                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-border hover:border-flexi-primary hover:bg-flexi-light/20 transition-all group text-left shadow-sm hover:shadow-md bg-white">
                                                    <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-page rounded text-neutral-secondary group-hover:text-flexi-primary"><CalendarDays className="w-4 h-4" /></div><span className="text-sm font-medium text-neutral-primary">Schedule 1:1</span></div><ChevronRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-primary" />
                                                </button>
                                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-border hover:border-flexi-primary hover:bg-flexi-light/20 transition-all group text-left shadow-sm hover:shadow-md bg-white">
                                                    <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-page rounded text-neutral-secondary group-hover:text-flexi-primary"><AlertCircle className="w-4 h-4" /></div><span className="text-sm font-medium text-neutral-primary">Report Issue</span></div><ChevronRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-primary" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-card">
                                            <div className="p-6 border-b border-neutral-border bg-neutral-page/10">
                                                <h3 className="font-bold text-lg text-neutral-primary">Badges & Attributes</h3>
                                            </div>
                                            <div className="p-6 flex flex-wrap gap-2">
                                                <div className="px-3 py-1.5 rounded-full bg-blue-50 text-flexi-primary text-xs font-bold border border-blue-100 shadow-sm flex items-center gap-1.5"><Award className="w-3 h-3" /> High Performer</div>
                                                <div className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100 shadow-sm">Remote First</div>
                                                <div className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 shadow-sm">Scrum Master</div>
                                                <div className="px-3 py-1.5 rounded-full bg-neutral-page text-neutral-secondary text-xs font-medium border border-neutral-border shadow-sm">5 Year Veteran</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. JOB & ORG TAB */}
                        {activeTab === 'job' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-primary">Job & Organization</h3>
                                        <p className="text-sm text-neutral-secondary">Manage employment details and hierarchy.</p>
                                    </div>
                                    {hasPermission('MANAGE_JOB') && (
                                        <button onClick={() => setIsEditJobDrawerOpen(true)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-flexi-primary bg-white border border-neutral-border rounded-lg hover:bg-flexi-light/20 hover:border-flexi-primary/30 transition-all shadow-sm group"><Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Edit Details</button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-xl border border-neutral-border shadow-card">
                                        <div className="p-6 border-b border-neutral-border flex items-center gap-2 bg-neutral-page/10"><Briefcase className="w-4 h-4 text-flexi-primary" /><h4 className="font-bold text-neutral-primary text-lg">Job Information</h4></div>
                                        <div className="p-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div><p className="text-label text-neutral-secondary mb-1">Designation</p><p className="text-sm font-bold text-neutral-primary">{jobDetails.designation}</p></div>
                                                <div><p className="text-label text-neutral-secondary mb-1">Employee Grade</p><p className="text-sm font-bold text-neutral-primary">{jobDetails.grade}</p></div>
                                                <div><p className="text-label text-neutral-secondary mb-1">Job Type</p><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-state-success border border-green-100">{jobDetails.jobType}</span></div>
                                                <div><p className="text-label text-neutral-secondary mb-1">Work Shift</p><p className="text-sm font-bold text-neutral-primary flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-neutral-muted" />{jobDetails.workShift}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-neutral-border shadow-card">
                                        <div className="p-6 border-b border-neutral-border flex items-center gap-2 bg-neutral-page/10"><Building2 className="w-4 h-4 text-flexi-primary" /><h4 className="font-bold text-neutral-primary text-lg">Organization Details</h4></div>
                                        <div className="p-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div><p className="text-label text-neutral-secondary mb-1">Department</p><p className="text-sm font-bold text-neutral-primary">{jobDetails.department}</p></div>
                                                <div><p className="text-label text-neutral-secondary mb-1">Sub-Department</p><p className="text-sm font-bold text-neutral-primary">{jobDetails.subDepartment}</p></div>
                                                <div><p className="text-label text-neutral-secondary mb-1">Location</p><p className="text-sm font-bold text-neutral-primary flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neutral-muted" />{jobDetails.location}</p></div>
                                                <div><p className="text-label text-neutral-secondary mb-1">Cost Center</p><p className="text-sm font-bold text-neutral-primary font-mono text-xs bg-neutral-page px-2 py-1 rounded w-fit">{jobDetails.costCenter}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl border border-neutral-border shadow-card">
                                    <div className="p-6 border-b border-neutral-border flex items-center gap-2 bg-neutral-page/10"><Users className="w-4 h-4 text-flexi-primary" /><h4 className="font-bold text-neutral-primary text-lg">Reporting Lines</h4></div>
                                    <div className="p-6 flex items-center gap-4">
                                        <div className="flex-1 p-6 border border-neutral-border rounded-xl bg-neutral-page/10 shadow-sm">
                                            <p className="text-xs text-neutral-secondary mb-3 font-semibold uppercase tracking-wide">Reporting Manager</p>
                                            <div className="flex items-center gap-3">
                                                <img src={jobDetails.manager.avatar} alt={jobDetails.manager.name} className="w-12 h-12 rounded-full border border-neutral-border" />
                                                <div><p className="text-sm font-bold text-neutral-primary">{jobDetails.manager.name}</p><p className="text-xs text-flexi-primary font-medium">{jobDetails.manager.role}</p><p className="text-[10px] text-neutral-muted mt-0.5 font-mono">{jobDetails.manager.id}</p></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 border border-flexi-primary/20 bg-flexi-light/10 rounded-xl shadow-sm">
                                            <p className="text-xs text-neutral-secondary mb-3 font-semibold uppercase tracking-wide">This Employee</p>
                                            <div className="flex items-center gap-3">
                                                <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full border border-white shadow-sm" />
                                                <div><p className="text-sm font-bold text-neutral-primary">{employee.name}</p><p className="text-xs text-flexi-primary font-medium">{jobDetails.designation}</p><p className="text-[10px] text-neutral-muted mt-0.5 font-mono">{employee.id}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. PAYROLL TAGS TAB */}
                        {activeTab === 'payroll' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div><h3 className="text-xl font-semibold text-neutral-primary">Payroll Tags & Components</h3><p className="text-sm text-neutral-secondary">Manage salary components, benefits, and deductions.</p></div>
                                    <button onClick={() => setIsManageTagsDrawerOpen(true)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-flexi-primary rounded-lg hover:bg-flexi-secondary shadow-sm transition-all"><Tag className="w-4 h-4" /> Manage Tags</button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {(['Earnings', 'Deductions', 'Perks', 'Statutory'] as TagCategory[]).map(cat => {
                                        const count = getTagsByCategory(cat).length;
                                        return (
                                            <div key={cat} className="bg-white p-6 rounded-xl border border-neutral-border shadow-card flex items-center justify-between hover:shadow-soft transition-all">
                                                <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider">{cat}</p><p className="text-2xl font-bold text-neutral-primary mt-1">{count}</p></div>
                                                <div className={`p-2.5 rounded-lg ${getCategoryColor(cat).split(' ')[0]} ${getCategoryColor(cat).split(' ')[1]}`}>{getCategoryIcon(cat)}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(['Earnings', 'Deductions', 'Perks', 'Statutory'] as TagCategory[]).map(cat => {
                                        const catTags = getTagsByCategory(cat);
                                        return (
                                            <div key={cat} className="bg-white rounded-xl border border-neutral-border shadow-card flex flex-col h-full">
                                                <div className="p-6 border-b border-neutral-border bg-neutral-page/10 flex items-center gap-2"><div className={`p-1.5 rounded-md ${getCategoryColor(cat).split(' ')[0]} ${getCategoryColor(cat).split(' ')[1]}`}>{getCategoryIcon(cat)}</div><h4 className="font-bold text-neutral-primary text-lg">{cat}</h4></div>
                                                <div className="p-6 flex-1">{catTags.length > 0 ? (<div className="flex flex-wrap gap-2">{catTags.map(tag => (<div key={tag.id} className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:shadow-sm cursor-default ${getCategoryColor(cat)}`} title={tag.description}>{tag.label}</div>))}</div>) : (<div className="flex flex-col items-center justify-center h-24 text-neutral-muted"><Tag className="w-6 h-6 mb-2 opacity-20" /><p className="text-xs">No {cat.toLowerCase()} tags assigned.</p></div>)}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ... Other tabs follow similar structure ... */}
                    </>
                )}
            </div>
        </div>
      </div>
      
      {/* MANAGE TAGS DRAWER */}
      {isManageTagsDrawerOpen && (
        <>
            <div className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsManageTagsDrawerOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[560px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col">
                <div className="p-6 border-b border-neutral-border bg-neutral-page/30 flex justify-between items-center"><div><h3 className="text-lg font-bold text-neutral-primary">Manage Payroll Tags</h3><p className="text-xs text-neutral-secondary">Add or remove salary components.</p></div><button onClick={() => setIsManageTagsDrawerOpen(false)} className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full"><X className="w-5 h-5" /></button></div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-neutral-border"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
                    <input 
                        type="text" 
                        value={tagSearchQuery} 
                        onChange={(e) => setTagSearchQuery(e.target.value)} 
                        placeholder="Search tags..." 
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-border text-sm focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted" 
                    />
                    </div></div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">{(['Earnings', 'Deductions', 'Perks', 'Statutory'] as TagCategory[]).map(cat => { const catTags = ALL_PAYROLL_TAGS.filter(t => t.category === cat && t.label.toLowerCase().includes(tagSearchQuery.toLowerCase())); if (catTags.length === 0) return null; return (<div key={cat}>
                        <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-3">{cat}</h4>
                        <div className="space-y-2">{catTags.map(tag => { const isSelected = assignedTagIds.includes(tag.id); return (
                            <button key={tag.id} onClick={() => !tag.isSystem && toggleTag(tag.id)} disabled={tag.isSystem} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${tag.isSystem ? 'bg-neutral-page border-neutral-border opacity-70 cursor-not-allowed' : isSelected ? 'bg-flexi-light/30 border-flexi-primary ring-1 ring-flexi-primary/20' : 'bg-white border-neutral-border hover:border-neutral-400'}`}><div><p className={`text-sm font-medium ${isSelected ? 'text-flexi-primary' : 'text-neutral-primary'}`}>{tag.label} {tag.isSystem && <span className="text-[10px] text-neutral-muted ml-1">(System)</span>}</p><p className="text-xs text-neutral-secondary">{tag.description}</p></div>{isSelected && <CheckCircle className="w-5 h-5 text-flexi-primary" />}</button>
                        ); })}</div>
                    </div>) })}</div>
                </div>
                <div className="p-6 border-t border-neutral-border bg-neutral-page/30 flex justify-end"><button onClick={() => setIsManageTagsDrawerOpen(false)} className="px-6 py-3 bg-flexi-primary text-white font-bold rounded-lg hover:bg-flexi-secondary shadow-sm transition-all">Done</button></div>
            </div>
        </>
      )}

      {/* ADD NOTE DRAWER */}
      {isAddNoteDrawerOpen && (
        <>
            <div className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsAddNoteDrawerOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[560px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col">
                <div className="p-6 border-b border-neutral-border bg-neutral-page/30 flex justify-between items-center"><div><h3 className="text-lg font-bold text-neutral-primary">Add New Note</h3><p className="text-xs text-neutral-secondary">Visible to admins and managers.</p></div><button onClick={() => setIsAddNoteDrawerOpen(false)} className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full"><X className="w-5 h-5" /></button></div>
                <div className="flex-1 p-6 space-y-6">
                    <div>
                        <label className="block text-label font-medium text-neutral-secondary mb-1.5">Note Content</label>
                        <textarea 
                            rows={8} 
                            value={newNoteContent} 
                            onChange={(e) => setNewNoteContent(e.target.value)} 
                            className="w-full px-4 py-3 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted resize-none" 
                            placeholder="Type your note here..." 
                        />
                    </div>
                    <label className="flex items-center gap-3 p-4 border border-neutral-border rounded-lg cursor-pointer hover:bg-neutral-page transition-colors"><input type="checkbox" checked={newNotePinned} onChange={(e) => setNewNotePinned(e.target.checked)} className="w-5 h-5 text-flexi-primary border-neutral-300 rounded focus:ring-flexi-primary" /><div className="flex-1"><span className="text-sm font-bold text-neutral-primary block">Pin Note</span><span className="text-xs text-neutral-secondary">Pinned notes appear at the top highlighted in yellow.</span></div><Pin className={`w-5 h-5 ${newNotePinned ? 'text-flexi-primary fill-flexi-primary' : 'text-neutral-muted'}`} /></label>
                </div>
                <div className="p-6 border-t border-neutral-border bg-neutral-page/30 flex gap-3"><button onClick={() => setIsAddNoteDrawerOpen(false)} className="flex-1 px-4 py-3 bg-white border border-neutral-border text-neutral-primary font-bold rounded-lg hover:bg-neutral-page transition-colors">Cancel</button><button onClick={handleSaveNote} disabled={!newNoteContent.trim()} className="flex-1 px-4 py-3 bg-flexi-primary text-white font-bold rounded-lg hover:bg-flexi-secondary disabled:opacity-50 transition-colors shadow-sm">Save Note</button></div>
            </div>
        </>
      )}

    </div>
  );
};

export default Employee360;
