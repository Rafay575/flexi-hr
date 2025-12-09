
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
        <button className="px-5 py-2.5 bg-neutral-primary text-white text-sm font-medium rounded-lg hover:bg-neutral-secondary transition-colors shadow-sm">
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
                className="mt-6 px-4 py-2 border border-neutral-border bg-white text-neutral-primary text-sm font-medium rounded-lg hover:bg-neutral-page hover:text-flexi-blue transition-colors shadow-sm"
            >
                {actionLabel}
            </button>
        )}
    </div>
);

const ErrorState = ({ message = "An unexpected error occurred." }) => (
    <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-in shake">
        <AlertOctagon className="w-5 h-5 text-state-error shrink-0" />
        <p className="text-sm font-medium text-red-800">{message}</p>
    </div>
);


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
  { id: 'a5', type: 'Job Change', title: 'Reporting Manager Update', description: 'Changed from Sarah Connor to Alex Morgan', date: 'Jan 01, 2022', user: 'Alexandra M.', icon: Users, color: 'bg-blue-100 text-flexi-blue border-blue-200' },
  { id: 'a6', type: 'Hiring', title: 'Onboarding Completed', description: 'All mandatory documents and training finished', date: 'Mar 20, 2021', user: 'System', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'a7', type: 'Hiring', title: 'Offer Accepted', description: 'Joined as Senior UX Designer', date: 'Mar 15, 2021', user: 'Sarah Jenkins', icon: UserPlus, color: 'bg-green-100 text-green-700 border-green-200' },
];

const Employee360: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [userPermissions] = useState<Permission[]>(MOCK_USER_PERMISSIONS); // In real app, this comes from context/auth
  
  const [isEditJobDrawerOpen, setIsEditJobDrawerOpen] = useState(false);
  const [isManageTagsDrawerOpen, setIsManageTagsDrawerOpen] = useState(false);
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState<HistoryEvent | null>(null);
  
  // Payroll State
  const [assignedTagIds, setAssignedTagIds] = useState<string[]>(['t1', 't2', 't3', 't4', 't5', 't8', 't9', 't13']);
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  // Attendance State
  const [currentAttendanceDate, setCurrentAttendanceDate] = useState(new Date());

  // Leaves State
  const [currentLeaveMonth, setCurrentLeaveMonth] = useState(new Date());

  // Documents State
  const [docViewMode, setDocViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocCategory, setSelectedDocCategory] = useState('All');
  const [previewDoc, setPreviewDoc] = useState<EmployeeDocument | null>(null);

  // Notes State
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [isAddNoteDrawerOpen, setIsAddNoteDrawerOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePinned, setNewNotePinned] = useState(false);

  // Activity State
  const [activityFilter, setActivityFilter] = useState('All');

  // Permission Logic
  const hasPermission = (permission?: Permission) => {
      if (!permission) return true;
      return userPermissions.includes(permission);
  };

  const visibleTabs = useMemo(() => TABS.filter(tab => hasPermission(tab.permission)), [userPermissions]);

  // Handle Tab Switch (Security Check)
  const handleTabSwitch = (tabId: string) => {
      const tabDef = TABS.find(t => t.id === tabId);
      if (tabDef && hasPermission(tabDef.permission)) {
          setActiveTab(tabId);
      }
  };

  // Check if current active tab is allowed (e.g. if permissions change dynamically)
  const isCurrentTabAllowed = useMemo(() => {
      const tabDef = TABS.find(t => t.id === activeTab);
      return tabDef ? hasPermission(tabDef.permission) : false;
  }, [activeTab, userPermissions]);

  // Mock Profile Data
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

  // Mock Job Data
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

  // Mock History Events (Grouped)
  const historyEvents: HistoryEvent[] = [
    { 
        id: 'evt-0',
        type: 'Transfer Request',
        status: 'Pending',
        date: 'Oct 26, 2023',
        time: '11:00 AM',
        reason: 'Requested relocation to London office for personal reasons.',
        changedBy: { name: 'Sarah Jenkins', role: 'Senior UX Designer', avatar: 'https://picsum.photos/200/200?random=10' },
        changes: [
             { field: 'Location', before: 'New York HQ', after: 'London Office' }
        ]
    },
    { 
        id: 'evt-1', 
        type: 'Promotion', 
        status: 'Completed',
        date: 'Mar 15, 2023',
        time: '10:42 AM', 
        reason: 'Annual Performance Review 2022 - Exceeded Expectations',
        changedBy: { name: 'System', role: 'Automated Process' },
        changes: [
            { field: 'Designation', before: 'UX Designer', after: 'Senior UX Designer' },
            { field: 'Grade', before: 'L3 - Mid Level', after: 'L4 - Senior Individual Contributor' }
        ]
    },
    { 
        id: 'evt-2', 
        type: 'Transfer', 
        status: 'Approved',
        date: 'Jan 01, 2022',
        time: '09:15 AM', 
        reason: 'Internal Mobility Application - Project Titan',
        changedBy: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' },
        changes: [
            { field: 'Department', before: 'Marketing Creative', after: 'Product Design' },
            { field: 'Reporting Manager', before: 'Sarah Connor', after: 'Alex Morgan' },
            { field: 'Location', before: 'London Office', after: 'New York HQ' }
        ]
    },
    { 
        id: 'evt-3', 
        type: 'Data Correction', 
        status: 'Completed',
        date: 'Mar 20, 2021',
        time: '02:30 PM', 
        reason: 'Correction of initial onboarding data entry error regarding cost center.',
        changedBy: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' },
        changes: [
            { field: 'Cost Center', before: 'CC-101 (General)', after: 'CC-402 (Product R&D)' }
        ]
    }
  ];

  // Mock Timeline Data (Summary Tab)
  const timelineEvents = [
    { id: 1, title: 'Leave Request Approved', date: 'Oct 24, 2023', description: 'Casual Leave (2 Days)', icon: Umbrella, color: 'text-state-success bg-green-50' },
    { id: 2, title: 'Completed Compliance Training', date: 'Oct 15, 2023', description: 'Data Privacy & Security 101', icon: FileCheck, color: 'text-flexi-blue bg-flexi-light' },
    { id: 3, title: 'Quarterly Appraisal', date: 'Oct 01, 2023', description: 'Rating: 4.8/5 (Exceeds Expectations)', icon: Star, color: 'text-state-warning bg-yellow-50' },
    { id: 4, title: 'Role Designation Update', date: 'Mar 15, 2023', description: 'Promoted to Senior UX Designer', icon: Briefcase, color: 'text-flexi-blue bg-flexi-light' },
  ];

  // Mock Leave Data
  const leaveBalances: LeaveBalance[] = [
      { type: 'Annual Leave', used: 12, total: 20, color: 'bg-flexi-blue', icon: Palmtree },
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

  // Mock Performance Data
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

  // Derived Payroll Data
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

  // --- ATTENDANCE HELPERS ---
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

          // Add some randomness
          if (!isWeekend) {
              const rand = Math.random();
              if (rand > 0.95) status = 'Absent';
              else if (rand > 0.9) status = 'Leave';
              else if (rand > 0.85) status = 'Holiday';
              else {
                 // Present variations
                 if (Math.random() > 0.8) {
                     checkIn = '09:24 AM';
                     isLate = true;
                     totalHours = '08:36';
                 }
                 if (Math.random() > 0.9) {
                     checkOut = '08:00 PM';
                     totalHours = '11:00';
                     overtime = '02:00';
                 }
                 if (Math.random() > 0.95) {
                     checkOut = '04:30 PM';
                     isEarlyOut = true;
                     totalHours = '07:30';
                 }
              }
          }

          if (status !== 'Present') {
              checkIn = '-';
              checkOut = '-';
              totalHours = '-';
              isLate = false;
              isEarlyOut = false;
              overtime = undefined;
          }

          logs.push({
              date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              day: dayName,
              dayNum: i,
              status,
              checkIn,
              checkOut,
              totalHours,
              isLate,
              isEarlyOut,
              overtime
          });
      }
      return logs.reverse(); // Newest first
  };

  const attendanceLogs = useMemo(() => generateAttendanceData(currentAttendanceDate), [currentAttendanceDate]);

  const changeMonth = (delta: number) => {
      const newDate = new Date(currentAttendanceDate);
      newDate.setMonth(newDate.getMonth() + delta);
      setCurrentAttendanceDate(newDate);
  };

  // --- LEAVE HELPERS ---
  const changeLeaveMonth = (delta: number) => {
    const newDate = new Date(currentLeaveMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentLeaveMonth(newDate);
  };

  const renderLeaveCalendar = () => {
    const year = currentLeaveMonth.getFullYear();
    const month = currentLeaveMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    
    const days = [];
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-14 sm:h-20 bg-neutral-page/10 border border-neutral-border/50"></div>);
    }
    
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        // Mock logic for calendar view (demo purposes)
        const isOct = month === 9; // Oct
        const isNov = month === 10; // Nov
        
        let cellClass = 'bg-white hover:bg-neutral-page';
        let badge = null;

        if (isOct && (d === 24 || d === 25)) {
            cellClass = 'bg-green-50 border-green-200';
            badge = <div className="text-[10px] text-green-700 font-bold bg-green-100 px-1 rounded mt-1 truncate">Annual</div>;
        } else if (isNov && (d >= 15 && d <= 18)) {
            cellClass = 'bg-yellow-50 border-yellow-200';
            badge = <div className="text-[10px] text-yellow-700 font-bold bg-yellow-100 px-1 rounded mt-1 truncate">Casual</div>;
        }

        days.push(
            <div key={d} className={`h-14 sm:h-20 border border-neutral-border p-1 sm:p-2 transition-colors flex flex-col items-start ${cellClass}`}>
                <span className={`text-xs font-semibold text-neutral-primary`}>{d}</span>
                {badge}
            </div>
        );
    }
    return days;
  };

  // --- DOCS HELPERS ---
  const filteredDocs = useMemo(() => {
    if (selectedDocCategory === 'All') return DOCUMENTS_DATA;
    return DOCUMENTS_DATA.filter(doc => doc.category === selectedDocCategory);
  }, [selectedDocCategory]);

  const getFileIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
        case 'jpg': 
        case 'png': return <ImageIcon className="w-8 h-8 text-blue-500" />;
        case 'xlsx': return <Grid className="w-8 h-8 text-green-600" />;
        default: return <FileIcon className="w-8 h-8 text-neutral-500" />;
    }
  };

  // --- NOTES HELPERS ---
  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    
    const newNote: Note = {
      id: `n${Date.now()}`,
      author: { name: 'Alexandra M.', role: 'HR Manager', avatar: 'https://picsum.photos/100/100?random=50' },
      content: newNoteContent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isPinned: newNotePinned
    };
    
    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setNewNotePinned(false);
    setIsAddNoteDrawerOpen(false);
  };

  const deleteNote = (id: string) => {
      setNotes(notes.filter(n => n.id !== id));
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const otherNotes = notes.filter(n => !n.isPinned);

  // --- ACTIVITY HELPERS ---
  const filteredActivities = useMemo(() => {
    if (activityFilter === 'All') return ACTIVITY_LOGS;
    // Simple mock filter logic
    if (activityFilter === 'HR') return ACTIVITY_LOGS.filter(a => a.type === 'Hiring' || a.type === 'Exit' || a.type === 'Transfer');
    if (activityFilter === 'System') return ACTIVITY_LOGS.filter(a => a.user === 'System');
    return ACTIVITY_LOGS;
  }, [activityFilter]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px] relative">
      
      {/* LEFT SIDE: Fixed Profile Summary */}
      <aside className="w-full lg:w-80 shrink-0 flex flex-col bg-white rounded-xl border border-neutral-border shadow-sm overflow-hidden h-full">
        {/* Profile Header */}
        <div className="p-6 flex flex-col items-center text-center border-b border-neutral-border bg-gradient-to-b from-white to-neutral-page/50">
           <div className="relative mb-4">
              <img 
                src={employee.avatar} 
                alt={employee.name} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-state-success border-2 border-white rounded-full"></span>
           </div>
           
           <h2 className="text-xl font-bold text-neutral-primary font-sans">{employee.name}</h2>
           <p className="text-sm font-medium text-flexi-blue mt-1">{employee.designation}</p>
           
           <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-neutral-page border border-neutral-border rounded text-xs font-mono text-neutral-secondary">
                {employee.id}
              </span>
              <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-state-success rounded text-xs font-bold uppercase tracking-wide">
                {employee.status}
              </span>
           </div>

           <div className="flex gap-2 mt-6 w-full">
              <button className="flex-1 py-2 text-xs font-bold text-white bg-flexi-blue rounded-lg hover:bg-flexi-end transition-colors shadow-sm">
                Actions
              </button>
              <button className="p-2 text-neutral-secondary border border-neutral-border rounded-lg hover:bg-neutral-page transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-neutral-secondary border border-neutral-border rounded-lg hover:bg-neutral-page transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Profile Details Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Contact Info */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Contact & Work</h3>
                
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-page rounded-lg text-neutral-secondary">
                        <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-neutral-secondary mb-0.5">Email Address</p>
                        <p className="text-sm font-medium text-neutral-primary truncate" title={employee.email}>{employee.email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-page rounded-lg text-neutral-secondary">
                        <Phone className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-secondary mb-0.5">Phone</p>
                        <p className="text-sm font-medium text-neutral-primary">{employee.phone}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-page rounded-lg text-neutral-secondary">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-secondary mb-0.5">Department</p>
                        <p className="text-sm font-medium text-neutral-primary">{employee.department}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-page rounded-lg text-neutral-secondary">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-secondary mb-0.5">Location</p>
                        <p className="text-sm font-medium text-neutral-primary">{employee.location}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-page rounded-lg text-neutral-secondary">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-secondary mb-0.5">Joining Date</p>
                        <p className="text-sm font-medium text-neutral-primary">{employee.joinDate}</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-neutral-border">
                <div className="p-4 bg-flexi-light/30 border border-flexi-blue/10 rounded-lg">
                    <h4 className="text-sm font-bold text-flexi-blue mb-1">OnboardX Status</h4>
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
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-border shadow-sm overflow-hidden h-full">
        
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
                            ${isActive 
                                ? 'border-flexi-blue text-flexi-blue bg-flexi-light/10' 
                                : 'border-transparent text-neutral-secondary hover:text-neutral-primary hover:bg-neutral-page'
                            }
                        `}
                    >
                        <tab.icon className={`w-4 h-4 ${isActive ? 'text-flexi-blue' : 'text-neutral-muted'}`} />
                        {tab.label}
                    </button>
                )
              })}
           </div>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto bg-neutral-page/30 p-6">
            <div className="max-w-5xl mx-auto h-full flex flex-col">
                
                {/* PERMISSION CHECK: If the active tab is restricted and user somehow got here, show Access Denied */}
                {!isCurrentTabAllowed ? (
                    <AccessDeniedState />
                ) : (
                    <>
                        {/* 1. SUMMARY TAB */}
                        {activeTab === 'summary' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                {/* ... (Summary Tab Content Remains Same) ... */}
                                {/* 1. Primary Info Tiles */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Leave Balance */}
                                    <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-orange-50 text-state-warning">
                                                <Umbrella className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-medium text-neutral-muted bg-neutral-page px-2 py-1 rounded-full">Annual</span>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-3xl font-bold text-neutral-primary">12</h4>
                                            <p className="text-sm text-neutral-secondary font-medium mt-1">Leave Balance</p>
                                            <p className="text-xs text-neutral-muted mt-1">Out of 20 days per year</p>
                                        </div>
                                        <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-1/4 translate-y-1/4">
                                            <Umbrella className="w-24 h-24" />
                                        </div>
                                    </div>
                                    {/* Attendance */}
                                    <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-flexi-light text-flexi-blue">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-state-success">
                                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4%
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-3xl font-bold text-neutral-primary">98%</h4>
                                            <p className="text-sm text-neutral-secondary font-medium mt-1">Avg. Attendance</p>
                                            <p className="text-xs text-neutral-muted mt-1">Based on last 30 days</p>
                                        </div>
                                        <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-1/4 translate-y-1/4">
                                            <Clock className="w-24 h-24" />
                                        </div>
                                    </div>
                                    {/* Performance */}
                                    <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-yellow-50 text-state-warning">
                                                <Star className="w-5 h-5 fill-state-warning" />
                                            </div>
                                            <span className="text-xs font-medium text-flexi-blue bg-flexi-light px-2 py-1 rounded-full">Top 10%</span>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-3xl font-bold text-neutral-primary">4.8<span className="text-lg text-neutral-muted font-normal">/5</span></h4>
                                            <p className="text-sm text-neutral-secondary font-medium mt-1">Performance Score</p>
                                            <p className="text-xs text-neutral-muted mt-1">Last Review: Outstanding</p>
                                        </div>
                                        <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-1/4 translate-y-1/4">
                                            <Award className="w-24 h-24" />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Split Layout: Timeline vs Actions/Chips */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    {/* Main Col: Timeline */}
                                    <div className="xl:col-span-2 bg-white rounded-xl border border-neutral-border shadow-sm p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-neutral-primary flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-flexi-blue" /> Recent Timeline
                                            </h3>
                                            <button className="text-xs font-medium text-flexi-blue hover:text-flexi-end transition-colors">View All History</button>
                                        </div>
                                        
                                        <div className="relative pl-2">
                                            {/* Vertical Line */}
                                            <div className="absolute top-2 bottom-0 left-[21px] w-px bg-neutral-border"></div>
                                            
                                            <div className="space-y-8">
                                                {timelineEvents.map((event) => (
                                                    <div key={event.id} className="relative flex items-start gap-4 group">
                                                        <div className={`relative z-10 w-11 h-11 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 ${event.color}`}>
                                                            <event.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 pt-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-bold text-neutral-primary group-hover:text-flexi-blue transition-colors">{event.title}</h4>
                                                                <span className="text-xs text-neutral-muted font-medium bg-neutral-page px-2 py-1 rounded-full">{event.date}</span>
                                                            </div>
                                                            <p className="text-sm text-neutral-secondary mt-1">{event.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Col: Chips & Actions */}
                                    <div className="space-y-6">
                                        {/* Quick Actions */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-5">
                                            <h3 className="font-bold text-neutral-primary text-sm mb-4">Quick Actions</h3>
                                            <div className="space-y-2">
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-border hover:border-flexi-blue hover:bg-flexi-light/20 transition-all group text-left">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 bg-neutral-page rounded text-neutral-secondary group-hover:text-flexi-blue">
                                                            <Download className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium text-neutral-primary">Download Payslip</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-blue" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-border hover:border-flexi-blue hover:bg-flexi-light/20 transition-all group text-left">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 bg-neutral-page rounded text-neutral-secondary group-hover:text-flexi-blue">
                                                            <CalendarDays className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium text-neutral-primary">Schedule 1:1</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-blue" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-border hover:border-flexi-blue hover:bg-flexi-light/20 transition-all group text-left">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 bg-neutral-page rounded text-neutral-secondary group-hover:text-flexi-blue">
                                                            <AlertCircle className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium text-neutral-primary">Report Issue</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-neutral-muted group-hover:text-flexi-blue" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Employment Badges/Chips */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-5">
                                            <h3 className="font-bold text-neutral-primary text-sm mb-4">Badges & Attributes</h3>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="px-3 py-1.5 rounded-full bg-blue-50 text-flexi-blue text-xs font-bold border border-blue-100 shadow-sm flex items-center gap-1.5">
                                                    <Award className="w-3 h-3" /> High Performer
                                                </div>
                                                <div className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100 shadow-sm">
                                                    Remote First
                                                </div>
                                                <div className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 shadow-sm">
                                                    Scrum Master
                                                </div>
                                                <div className="px-3 py-1.5 rounded-full bg-neutral-page text-neutral-secondary text-xs font-medium border border-neutral-border shadow-sm">
                                                    5 Year Veteran
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. JOB & ORG TAB - (Content Remains Same) */}
                        {activeTab === 'job' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Job & Organization</h3>
                                        <p className="text-sm text-neutral-secondary">Manage employment details and hierarchy.</p>
                                    </div>
                                    {hasPermission('MANAGE_JOB') && (
                                        <button 
                                            onClick={() => setIsEditJobDrawerOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-flexi-blue bg-white border border-neutral-border rounded-lg hover:bg-flexi-light/20 hover:border-flexi-blue/30 transition-all shadow-sm group"
                                        >
                                            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                                            Edit Details
                                        </button>
                                    )}
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Card 1: Job Information */}
                                    <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6">
                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-border">
                                            <Briefcase className="w-4 h-4 text-flexi-blue" />
                                            <h4 className="font-bold text-neutral-primary text-sm">Job Information</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Designation</p>
                                                    <p className="text-sm font-medium text-neutral-primary">{jobDetails.designation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Employee Grade</p>
                                                    <p className="text-sm font-medium text-neutral-primary">{jobDetails.grade}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Job Type</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-state-success border border-green-100">
                                                        {jobDetails.jobType}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Work Shift</p>
                                                    <p className="text-sm font-medium text-neutral-primary flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-neutral-muted" />
                                                        {jobDetails.workShift}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Card 2: Organization Details */}
                                    <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6">
                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-border">
                                            <Building2 className="w-4 h-4 text-flexi-blue" />
                                            <h4 className="font-bold text-neutral-primary text-sm">Organization Details</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Department</p>
                                                    <p className="text-sm font-medium text-neutral-primary">{jobDetails.department}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Sub-Department</p>
                                                    <p className="text-sm font-medium text-neutral-primary">{jobDetails.subDepartment}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Location</p>
                                                    <p className="text-sm font-medium text-neutral-primary flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-neutral-muted" />
                                                        {jobDetails.location}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-secondary mb-1">Cost Center</p>
                                                    <p className="text-sm font-medium text-neutral-primary font-mono text-xs bg-neutral-page px-2 py-1 rounded w-fit">
                                                        {jobDetails.costCenter}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reporting Hierarchy */}
                                <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-border">
                                        <Users className="w-4 h-4 text-flexi-blue" />
                                        <h4 className="font-bold text-neutral-primary text-sm">Reporting Lines</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 p-4 border border-neutral-border rounded-lg bg-neutral-page/10">
                                            <p className="text-xs text-neutral-secondary mb-3 font-semibold uppercase tracking-wide">Reporting Manager</p>
                                            <div className="flex items-center gap-3">
                                                <img src={jobDetails.manager.avatar} alt={jobDetails.manager.name} className="w-12 h-12 rounded-full border border-neutral-border" />
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-primary">{jobDetails.manager.name}</p>
                                                    <p className="text-xs text-flexi-blue font-medium">{jobDetails.manager.role}</p>
                                                    <p className="text-[10px] text-neutral-muted mt-0.5 font-mono">{jobDetails.manager.id}</p>
                                                </div>
                                                <button className="ml-auto text-xs font-medium text-neutral-secondary border border-neutral-border px-3 py-1.5 rounded hover:bg-white transition-colors">
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center text-neutral-muted">
                                            <div className="border-t border-dashed border-neutral-300 w-16"></div>
                                            <div className="text-[10px] bg-neutral-page px-2 py-1 rounded-full text-neutral-secondary border border-neutral-border -ml-8 relative z-10">Reports To</div>
                                            <div className="border-t border-dashed border-neutral-300 w-8"></div>
                                        </div>
                                        <div className="flex-1 p-4 border border-flexi-blue/20 bg-flexi-light/10 rounded-lg">
                                            <p className="text-xs text-neutral-secondary mb-3 font-semibold uppercase tracking-wide">This Employee</p>
                                            <div className="flex items-center gap-3">
                                                <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full border border-white shadow-sm" />
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-primary">{employee.name}</p>
                                                    <p className="text-xs text-flexi-blue font-medium">{jobDetails.designation}</p>
                                                    <p className="text-[10px] text-neutral-muted mt-0.5 font-mono">{employee.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Updated Assignment History Timeline */}
                                <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-2">
                                            <History className="w-4 h-4 text-flexi-blue" />
                                            <h4 className="font-bold text-neutral-primary text-sm">Assignment & Transfer History</h4>
                                        </div>
                                        <button className="text-xs font-medium text-flexi-blue hover:text-flexi-end hover:underline">
                                            View Full Log
                                        </button>
                                    </div>
                                    
                                    <div className="relative border-l border-neutral-border ml-3 space-y-8">
                                        {historyEvents.map((evt, idx) => {
                                            const isPending = evt.status === 'Pending';
                                            const isRejected = evt.status === 'Rejected';
                                            
                                            return (
                                                <div key={evt.id} className="relative pl-8">
                                                    {/* Timeline Dot */}
                                                    <div className={`absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm 
                                                        ${isPending ? 'bg-yellow-500' : isRejected ? 'bg-red-500' : 'bg-flexi-blue'}
                                                    `}></div>
                                                    
                                                    {/* Event Card */}
                                                    <div className="flex flex-col gap-3 group">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                            <h5 className="text-sm font-bold text-neutral-primary">{evt.type}</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                                                                    ${isPending ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                      isRejected ? 'bg-red-50 text-red-700 border-red-200' :
                                                                      'bg-green-50 text-green-700 border-green-200'}
                                                                `}>
                                                                    {evt.status}
                                                                </span>
                                                                <span className="text-xs text-neutral-muted flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" /> {evt.date}
                                                                </span>
                                                                <span className="text-xs text-neutral-muted flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> {evt.time}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Diff / Changes Block */}
                                                        <div className="bg-neutral-page/30 rounded-lg border border-neutral-border p-4 hover:border-flexi-blue/30 transition-colors">
                                                            <div className="text-xs text-neutral-secondary italic mb-3">"{evt.reason}"</div>
                                                            <div className="space-y-2">
                                                                {evt.changes.map((change, i) => (
                                                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                                                                        <span className="font-bold text-neutral-muted uppercase w-24 shrink-0">{change.field}</span>
                                                                        <div className="flex items-center gap-3 flex-1">
                                                                            <span className="text-neutral-500 line-through decoration-neutral-300">{change.before}</span>
                                                                            <ArrowRight className="w-3 h-3 text-neutral-300" />
                                                                            <span className="font-semibold text-flexi-blue">{change.after}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            
                                                            <div className="mt-3 pt-3 border-t border-neutral-border/50 flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                                                                    {evt.changedBy.avatar ? (
                                                                        <img src={evt.changedBy.avatar} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <User className="w-3 h-3 text-neutral-500" />
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-neutral-secondary">
                                                                    Initiated by <span className="font-medium text-neutral-primary">{evt.changedBy.name}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. PAYROLL TAGS TAB - (Content Remains Same) */}
                        {activeTab === 'payroll' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                                {/* Header & Metrics */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Payroll Tags & Components</h3>
                                        <p className="text-sm text-neutral-secondary">Manage salary components, benefits, and deductions.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-xs font-bold">Compliant</span>
                                        </div>
                                        <button 
                                            onClick={() => setIsManageTagsDrawerOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-flexi-blue rounded-lg hover:bg-flexi-end shadow-sm transition-all"
                                        >
                                            <Tag className="w-4 h-4" /> 
                                            Manage Tags
                                        </button>
                                    </div>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(['Earnings', 'Deductions', 'Perks', 'Statutory'] as TagCategory[]).map(cat => {
                                        const count = getTagsByCategory(cat).length;
                                        return (
                                            <div key={cat} className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider">{cat}</p>
                                                    <p className="text-2xl font-bold text-neutral-primary mt-1">{count}</p>
                                                </div>
                                                <div className={`p-2.5 rounded-lg ${getCategoryColor(cat).split(' ')[0]} ${getCategoryColor(cat).split(' ')[1]}`}>
                                                    {getCategoryIcon(cat)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Categorized Tag Grids */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(['Earnings', 'Deductions', 'Perks', 'Statutory'] as TagCategory[]).map(cat => {
                                        const catTags = getTagsByCategory(cat);
                                        return (
                                            <div key={cat} className="bg-white rounded-xl border border-neutral-border shadow-sm flex flex-col h-full">
                                                <div className="p-4 border-b border-neutral-border bg-neutral-page/20 flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-md ${getCategoryColor(cat).split(' ')[0]} ${getCategoryColor(cat).split(' ')[1]}`}>
                                                        {getCategoryIcon(cat)}
                                                    </div>
                                                    <h4 className="font-bold text-neutral-primary text-sm">{cat}</h4>
                                                </div>
                                                <div className="p-5 flex-1">
                                                    {catTags.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {catTags.map(tag => (
                                                                <div 
                                                                    key={tag.id} 
                                                                    className={`
                                                                        group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:shadow-sm cursor-default
                                                                        ${getCategoryColor(cat)}
                                                                    `}
                                                                    title={tag.description}
                                                                >
                                                                    {tag.label}
                                                                    {/* Info Tooltip Icon */}
                                                                    {tag.description && (
                                                                        <span className="opacity-0 group-hover:opacity-50 transition-opacity">
                                                                            •
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-24 text-neutral-muted">
                                                            <Tag className="w-6 h-6 mb-2 opacity-20" />
                                                            <p className="text-xs">No {cat.toLowerCase()} tags assigned.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 4. ATTENDANCE TAB - (Content Remains Same) */}
                        {activeTab === 'attendance' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                                {/* ... Attendance Content ... */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    {/* Month Navigation */}
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary mb-2">Attendance & Time</h3>
                                        <div className="flex items-center gap-3 bg-white border border-neutral-border rounded-lg p-1 shadow-sm">
                                            <button 
                                                onClick={() => changeMonth(-1)}
                                                className="p-2 hover:bg-neutral-page rounded-md text-neutral-secondary hover:text-flexi-blue transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <div className="w-40 text-center">
                                                <span className="text-sm font-bold text-neutral-primary">
                                                    {currentAttendanceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => changeMonth(1)}
                                                className="p-2 hover:bg-neutral-page rounded-md text-neutral-secondary hover:text-flexi-blue transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Tiles */}
                                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                                        <div className="min-w-[140px] p-4 bg-white border border-neutral-border rounded-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-2 text-neutral-secondary">
                                                <Timer className="w-4 h-4 text-flexi-blue" />
                                                <span className="text-xs font-semibold uppercase">Avg. Hrs</span>
                                            </div>
                                            <p className="text-2xl font-bold text-neutral-primary">8h 42m</p>
                                        </div>
                                        <div className="min-w-[140px] p-4 bg-white border border-neutral-border rounded-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-2 text-neutral-secondary">
                                                <CheckCircle className="w-4 h-4 text-state-success" />
                                                <span className="text-xs font-semibold uppercase">On Time</span>
                                            </div>
                                            <p className="text-2xl font-bold text-neutral-primary">92%</p>
                                        </div>
                                        <div className="min-w-[140px] p-4 bg-white border border-neutral-border rounded-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-2 text-neutral-secondary">
                                                <AlertTriangle className="w-4 h-4 text-state-warning" />
                                                <span className="text-xs font-semibold uppercase">Late</span>
                                            </div>
                                            <p className="text-2xl font-bold text-neutral-primary">2 Days</p>
                                        </div>
                                        <div className="min-w-[140px] p-4 bg-white border border-neutral-border rounded-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-2 text-neutral-secondary">
                                                <Moon className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs font-semibold uppercase">Overtime</span>
                                            </div>
                                            <p className="text-2xl font-bold text-neutral-primary">12h</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Daily Timeline View */}
                                <div className="bg-white rounded-xl border border-neutral-border shadow-sm overflow-hidden">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1.5fr] md:grid-cols-[100px,120px,1fr,1fr,1.5fr] gap-4 p-4 border-b border-neutral-border bg-neutral-page/50 text-xs font-bold text-neutral-muted uppercase tracking-wider items-center">
                                        <div className="pl-2">Date</div>
                                        <div>Status</div>
                                        <div className="hidden md:block">Punch In</div>
                                        <div className="hidden md:block">Punch Out</div>
                                        <div>Duration & Badges</div>
                                    </div>

                                    {/* Table Body */}
                                    <div className="divide-y divide-neutral-border">
                                        {attendanceLogs.map((log) => {
                                            const isWeekend = log.status === 'Weekend';
                                            const isAbsent = log.status === 'Absent' || log.status === 'Leave';
                                            
                                            return (
                                                <div 
                                                    key={log.dayNum} 
                                                    className={`grid grid-cols-[1fr,1fr,1fr,1fr,1.5fr] md:grid-cols-[100px,120px,1fr,1fr,1.5fr] gap-4 p-4 items-center transition-colors
                                                        ${isWeekend ? 'bg-neutral-page/20' : 'hover:bg-neutral-page/30'}
                                                        ${log.status === 'Absent' ? 'bg-red-50/30' : ''}
                                                    `}
                                                >
                                                    {/* Date Column */}
                                                    <div className="flex flex-col pl-2">
                                                        <span className={`text-sm font-bold ${isWeekend ? 'text-neutral-muted' : 'text-neutral-primary'}`}>
                                                            {String(log.dayNum).padStart(2, '0')}
                                                        </span>
                                                        <span className="text-xs text-neutral-muted font-medium uppercase">{log.day}</span>
                                                    </div>

                                                    {/* Status Column */}
                                                    <div>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                                                            ${log.status === 'Present' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            log.status === 'Weekend' ? 'bg-neutral-100 text-neutral-500 border-neutral-200' :
                                                            log.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            log.status === 'Holiday' ? 'bg-blue-50 text-flexi-blue border-blue-200' :
                                                            'bg-orange-50 text-orange-700 border-orange-200' // Leave
                                                            }
                                                        `}>
                                                            {log.status}
                                                        </span>
                                                    </div>

                                                    {/* Time Columns (Hidden on mobile) */}
                                                    <div className="hidden md:block text-sm text-neutral-primary font-medium">
                                                        {log.checkIn}
                                                    </div>
                                                    <div className="hidden md:block text-sm text-neutral-primary font-medium">
                                                        {log.checkOut}
                                                    </div>

                                                    {/* Duration & Badges */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {!isWeekend && !isAbsent && log.status !== 'Holiday' && (
                                                            <span className="text-sm font-bold text-neutral-primary mr-2 font-mono">
                                                                {log.totalHours} <span className="text-xs text-neutral-muted font-sans font-normal">hrs</span>
                                                            </span>
                                                        )}
                                                        
                                                        {/* Visual Indicators */}
                                                        {log.isLate && (
                                                            <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200 flex items-center gap-1" title="Late Arrival">
                                                                LATE
                                                            </div>
                                                        )}
                                                        {log.isEarlyOut && (
                                                            <div className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded border border-orange-200 flex items-center gap-1" title="Early Out">
                                                                EARLY
                                                            </div>
                                                        )}
                                                        {log.overtime && (
                                                            <div className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded border border-purple-200 flex items-center gap-1" title={`Overtime: ${log.overtime}`}>
                                                                + {log.overtime} OT
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* 5. LEAVES TAB - (Content Remains Same) */}
                        {activeTab === 'leaves' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                                {/* ... Leaves Content ... */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Leave Management</h3>
                                        <p className="text-sm text-neutral-secondary">View balances, history, and plan time off.</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-flexi-blue text-white text-sm font-bold rounded-lg hover:bg-flexi-end shadow-sm transition-all">
                                        <Plus className="w-4 h-4" /> Apply Leave
                                    </button>
                                </div>

                                {/* Balance Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {leaveBalances.map((balance) => (
                                        <div key={balance.type} className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-bold text-neutral-muted uppercase">{balance.type}</p>
                                                    <h4 className="text-2xl font-bold text-neutral-primary mt-1">{balance.total - balance.used} <span className="text-xs font-normal text-neutral-secondary">avail</span></h4>
                                                </div>
                                                <div className={`p-2 rounded-lg ${balance.color} bg-opacity-10 text-opacity-100`}>
                                                    <balance.icon className={`w-5 h-5 ${balance.color.replace('bg-', 'text-')}`} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] text-neutral-secondary mb-1">
                                                    <span>Used: {balance.used}</span>
                                                    <span>Total: {balance.total}</span>
                                                </div>
                                                <div className="w-full bg-neutral-page h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${balance.color}`} 
                                                        style={{ width: `${(balance.used / balance.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Split: Calendar vs History */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    
                                    {/* Calendar Section (2 cols) */}
                                    <div className="xl:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-neutral-primary flex items-center gap-2">
                                                    <CalendarDays className="w-4 h-4 text-flexi-blue" /> Leave Calendar
                                                </h4>
                                                <div className="flex items-center gap-2 bg-neutral-page p-1 rounded-lg">
                                                    <button 
                                                        onClick={() => changeLeaveMonth(-1)}
                                                        className="p-1 hover:bg-white rounded shadow-sm text-neutral-secondary transition-colors"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-xs font-bold px-2 min-w-[100px] text-center">
                                                        {currentLeaveMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button 
                                                        onClick={() => changeLeaveMonth(1)}
                                                        className="p-1 hover:bg-white rounded shadow-sm text-neutral-secondary transition-colors"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Month Grid */}
                                            <div className="grid grid-cols-7 gap-px bg-neutral-border border border-neutral-border rounded-lg overflow-hidden">
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                    <div key={day} className="bg-neutral-page/50 p-2 text-center text-[10px] font-bold text-neutral-secondary uppercase tracking-wider">
                                                        {day}
                                                    </div>
                                                ))}
                                                {renderLeaveCalendar()}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mt-4 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                                                    <span className="text-neutral-secondary">Approved Leave</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                                                    <span className="text-neutral-secondary">Pending Request</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3 h-3 bg-neutral-page border border-neutral-border rounded"></div>
                                                    <span className="text-neutral-secondary">Working Day</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar: Upcoming & History */}
                                    <div className="space-y-6">
                                        {/* Upcoming Leaves */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-5">
                                            <h4 className="font-bold text-neutral-primary text-sm mb-4">Upcoming Leaves</h4>
                                            {leaveRequests.filter(l => l.status === 'Approved' || l.status === 'Pending').slice(0, 2).map(req => (
                                                <div key={req.id} className="mb-3 last:mb-0 p-3 bg-neutral-page/30 border border-neutral-border rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                            req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {req.status}
                                                        </span>
                                                        <span className="text-xs text-neutral-muted">{req.days} Days</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-neutral-primary">{req.type}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-secondary">
                                                        <Calendar className="w-3 h-3" />
                                                        {req.startDate} - {req.endDate}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Leave History List */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-0 overflow-hidden">
                                            <div className="p-4 border-b border-neutral-border flex justify-between items-center">
                                                <h4 className="font-bold text-neutral-primary text-sm">History</h4>
                                                <button className="text-xs text-flexi-blue font-medium hover:underline">View All</button>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {leaveRequests.map((req, idx) => (
                                                    <div key={req.id} className={`p-4 hover:bg-neutral-page/30 transition-colors ${idx !== leaveRequests.length - 1 ? 'border-b border-neutral-border' : ''}`}>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-xs font-bold text-neutral-primary">{req.type}</span>
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                                                req.status === 'Approved' ? 'text-green-700 bg-green-50' :
                                                                req.status === 'Pending' ? 'text-yellow-700 bg-yellow-50' :
                                                                'text-red-700 bg-red-50'
                                                            }`}>{req.status}</span>
                                                        </div>
                                                        <p className="text-xs text-neutral-secondary mb-1">{req.startDate} ({req.days} days)</p>
                                                        <p className="text-[10px] text-neutral-muted truncate">Reason: {req.reason}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* 6. PERFORMANCE TAB - (Content Remains Same) */}
                        {activeTab === 'performance' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                                {/* ... Performance Content ... */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Performance & Goals</h3>
                                        <p className="text-sm text-neutral-secondary">Review goals, appraisals, and feedback.</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-flexi-blue text-white text-sm font-bold rounded-lg hover:bg-flexi-end shadow-sm transition-all">
                                        <Plus className="w-4 h-4" /> Add Goal
                                    </button>
                                </div>

                                {/* KPI Scorecards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm">
                                        <div className="flex items-center gap-2 text-neutral-secondary text-xs font-bold uppercase tracking-wider mb-2">
                                            <Star className="w-4 h-4 text-flexi-blue" /> Overall Rating
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-neutral-primary">4.8</span>
                                            <span className="text-sm text-neutral-muted mb-1">/ 5.0</span>
                                        </div>
                                        <p className="text-xs text-state-success mt-1 font-medium">Outstanding</p>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm">
                                        <div className="flex items-center gap-2 text-neutral-secondary text-xs font-bold uppercase tracking-wider mb-2">
                                            <Target className="w-4 h-4 text-flexi-blue" /> Goals Completed
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-neutral-primary">75%</span>
                                            <span className="text-sm text-neutral-muted mb-1">YTD</span>
                                        </div>
                                        <p className="text-xs text-neutral-secondary mt-1">3 of 4 completed</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm">
                                        <div className="flex items-center gap-2 text-neutral-secondary text-xs font-bold uppercase tracking-wider mb-2">
                                            <Zap className="w-4 h-4 text-flexi-blue" /> 9-Box Grid
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* Mini Grid Visual */}
                                            <div className="grid grid-cols-3 gap-0.5 w-12 h-12 bg-neutral-border p-0.5 rounded">
                                                {[...Array(9)].map((_, i) => (
                                                    <div key={i} className={`rounded-[1px] ${i === 2 ? 'bg-flexi-blue' : 'bg-neutral-page'}`}></div>
                                                ))}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-primary">Star</p>
                                                <p className="text-[10px] text-neutral-secondary">High Potential</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm">
                                        <div className="flex items-center gap-2 text-neutral-secondary text-xs font-bold uppercase tracking-wider mb-2">
                                            <MessageCircle className="w-4 h-4 text-flexi-blue" /> Feedback
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-neutral-primary">12</span>
                                            <span className="text-sm text-neutral-muted mb-1">Received</span>
                                        </div>
                                        <p className="text-xs text-state-success mt-1 font-medium">Mostly Positive</p>
                                    </div>
                                </div>

                                {/* Main Grid Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column (2/3) */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Active Goals */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm overflow-hidden">
                                            <div className="p-5 border-b border-neutral-border flex justify-between items-center bg-neutral-page/30">
                                                <h4 className="font-bold text-neutral-primary text-sm flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-flexi-blue" /> Active OKRs / Goals
                                                </h4>
                                                <button className="text-xs font-medium text-flexi-blue hover:underline">View All</button>
                                            </div>
                                            <div className="divide-y divide-neutral-border">
                                                {performanceGoals.map(goal => (
                                                    <div key={goal.id} className="p-5 hover:bg-neutral-page/20 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider bg-neutral-page px-1.5 py-0.5 rounded border border-neutral-200">
                                                                    {goal.category}
                                                                </span>
                                                                <h5 className="text-sm font-bold text-neutral-primary mt-1">{goal.title}</h5>
                                                            </div>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                                goal.status === 'On Track' ? 'bg-green-100 text-green-700' :
                                                                goal.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                                                                goal.status === 'Behind' ? 'bg-red-100 text-red-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {goal.status}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="mt-3">
                                                            <div className="flex justify-between text-xs text-neutral-secondary mb-1.5">
                                                                <span>Progress</span>
                                                                <span className="font-bold">{goal.progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-neutral-page h-2 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                                        goal.progress === 100 ? 'bg-state-success' : 'bg-flexi-blue'
                                                                    }`} 
                                                                    style={{ width: `${goal.progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-3 text-xs text-neutral-muted">
                                                            <Calendar className="w-3.5 h-3.5" /> Due: {goal.dueDate}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Review History */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm overflow-hidden">
                                            <div className="p-5 border-b border-neutral-border flex justify-between items-center bg-neutral-page/30">
                                                <h4 className="font-bold text-neutral-primary text-sm flex items-center gap-2">
                                                    <History className="w-4 h-4 text-flexi-blue" /> Review History
                                                </h4>
                                            </div>
                                            <div className="divide-y divide-neutral-border">
                                                {performanceReviews.map(review => (
                                                    <div key={review.id} className="p-4 flex items-center justify-between hover:bg-neutral-page/20 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                                                review.rating >= 4.5 ? 'bg-green-100 text-green-700' : 
                                                                review.rating >= 3.5 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {review.rating}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-bold text-neutral-primary">{review.name}</h5>
                                                                <p className="text-xs text-neutral-secondary mt-0.5">Reviewer: {review.reviewer} • {review.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-neutral-page rounded border border-neutral-border text-neutral-600">
                                                                {review.status}
                                                            </span>
                                                            <button className="text-neutral-400 hover:text-flexi-blue transition-colors">
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (1/3) */}
                                    <div className="space-y-6">
                                        {/* Skills Matrix */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-5">
                                            <h4 className="font-bold text-neutral-primary text-sm mb-4 flex items-center gap-2">
                                                <BarChart2 className="w-4 h-4 text-flexi-blue" /> Competencies
                                            </h4>
                                            <div className="space-y-4">
                                                {skills.map((skill, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-xs mb-1.5">
                                                            <span className="font-medium text-neutral-primary">{skill.name}</span>
                                                            <span className="font-bold text-neutral-secondary">{skill.score}/10</span>
                                                        </div>
                                                        <div className="w-full bg-neutral-page h-1.5 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-flexi-blue/80 rounded-full" 
                                                                style={{ width: `${skill.score * 10}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Feedback */}
                                        <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-5">
                                            <h4 className="font-bold text-neutral-primary text-sm mb-4 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-flexi-blue" /> Recent Feedback
                                            </h4>
                                            <div className="space-y-4">
                                                {feedbackItems.map(item => (
                                                    <div key={item.id} className="bg-neutral-page/30 p-3 rounded-lg border border-neutral-border">
                                                        <p className="text-xs text-neutral-primary italic mb-2">"{item.text}"</p>
                                                        <div className="flex items-center gap-2 border-t border-neutral-border/50 pt-2">
                                                            <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-[8px] font-bold">
                                                                {item.user.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-bold text-neutral-primary truncate">{item.user}</p>
                                                                <p className="text-[9px] text-neutral-secondary truncate">{item.role}</p>
                                                            </div>
                                                            <span className="text-[9px] text-neutral-muted">{item.date}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-full mt-4 text-xs font-medium text-flexi-blue py-2 border border-dashed border-flexi-blue/30 rounded-lg hover:bg-flexi-light/20 transition-colors">
                                                Request Feedback
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* 7. DOCUMENTS TAB - (Content Remains Same) */}
                        {activeTab === 'docs' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col">
                                {/* ... Document Tab Content ... */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Documents</h3>
                                        <p className="text-sm text-neutral-secondary">Manage and organize employee files.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="bg-white border border-neutral-border rounded-lg flex p-1">
                                            <button 
                                                onClick={() => setDocViewMode('grid')}
                                                className={`p-1.5 rounded-md transition-colors ${docViewMode === 'grid' ? 'bg-neutral-page text-flexi-blue shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
                                            >
                                                <Grid className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setDocViewMode('list')}
                                                className={`p-1.5 rounded-md transition-colors ${docViewMode === 'list' ? 'bg-neutral-page text-flexi-blue shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
                                            >
                                                <List className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-flexi-blue text-white text-sm font-bold rounded-lg hover:bg-flexi-end shadow-sm transition-all">
                                            <UploadCloud className="w-4 h-4" /> Upload
                                        </button>
                                    </div>
                                </div>

                                {/* Layout: Sidebar & Content */}
                                <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                                    
                                    {/* Categories Sidebar */}
                                    <div className="w-full md:w-56 shrink-0 space-y-1">
                                        {DOC_CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedDocCategory(cat)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                    selectedDocCategory === cat 
                                                    ? 'bg-flexi-light/30 text-flexi-blue border border-flexi-blue/20' 
                                                    : 'text-neutral-secondary hover:bg-neutral-page hover:text-neutral-primary border border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <FolderOpen className={`w-4 h-4 ${selectedDocCategory === cat ? 'fill-flexi-blue/20' : ''}`} />
                                                    {cat}
                                                </div>
                                                {cat === 'All' && <span className="text-xs bg-neutral-page px-1.5 py-0.5 rounded text-neutral-muted">{DOCUMENTS_DATA.length}</span>}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Files Area */}
                                    <div className="flex-1 bg-white border border-neutral-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                                        {filteredDocs.length > 0 ? (
                                            <div className="flex-1 overflow-y-auto p-4">
                                                
                                                {/* GRID VIEW */}
                                                {docViewMode === 'grid' && (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {filteredDocs.map(doc => (
                                                            <div 
                                                                key={doc.id}
                                                                onClick={() => setPreviewDoc(doc)}
                                                                className="group bg-white border border-neutral-border rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:border-flexi-blue hover:shadow-md transition-all relative"
                                                            >
                                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button className="p-1.5 hover:bg-neutral-page rounded-lg text-neutral-muted hover:text-neutral-primary">
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                <div className="w-16 h-16 rounded-xl bg-neutral-page/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                    {getFileIcon(doc.type)}
                                                                </div>
                                                                <h4 className="text-sm font-medium text-neutral-primary w-full truncate mb-1" title={doc.name}>
                                                                    {doc.name}
                                                                </h4>
                                                                <p className="text-[10px] text-neutral-secondary font-mono bg-neutral-page px-1.5 py-0.5 rounded mb-2">
                                                                    {doc.type.toUpperCase()} • {doc.size}
                                                                </p>
                                                                <p className="text-[10px] text-neutral-muted mt-auto">
                                                                    {doc.uploadDate}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* LIST VIEW */}
                                                {docViewMode === 'list' && (
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-neutral-page/50 border-b border-neutral-border sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 font-semibold text-neutral-secondary text-xs uppercase tracking-wider">Name</th>
                                                                <th className="px-4 py-3 font-semibold text-neutral-secondary text-xs uppercase tracking-wider">Category</th>
                                                                <th className="px-4 py-3 font-semibold text-neutral-secondary text-xs uppercase tracking-wider">Date</th>
                                                                <th className="px-4 py-3 font-semibold text-neutral-secondary text-xs uppercase tracking-wider">Size</th>
                                                                <th className="px-4 py-3 text-right"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-neutral-border">
                                                            {filteredDocs.map(doc => (
                                                                <tr key={doc.id} className="hover:bg-neutral-page/30 transition-colors group cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            {getFileIcon(doc.type)}
                                                                            <span className="font-medium text-neutral-primary">{doc.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-neutral-secondary">{doc.category}</td>
                                                                    <td className="px-4 py-3 text-neutral-secondary">{doc.uploadDate}</td>
                                                                    <td className="px-4 py-3 text-neutral-secondary font-mono text-xs">{doc.size}</td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <button className="p-1.5 text-neutral-muted hover:text-flexi-blue hover:bg-flexi-light/20 rounded">
                                                                                <Download className="w-4 h-4" />
                                                                            </button>
                                                                            <button className="p-1.5 text-neutral-muted hover:text-flexi-blue hover:bg-flexi-light/20 rounded">
                                                                                <Eye className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        ) : (
                                            <EmptyDataState 
                                                title="No documents found" 
                                                description={`There are no documents in the '${selectedDocCategory}' category.`}
                                                icon={FolderOpen}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 8. NOTES TAB - (Content Remains Same) */}
                        {activeTab === 'notes' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col">
                                {/* ... Notes Content ... */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Notes & Remarks</h3>
                                        <p className="text-sm text-neutral-secondary">Private internal notes about this employee.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddNoteDrawerOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-flexi-blue text-white text-sm font-bold rounded-lg hover:bg-flexi-end shadow-sm transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add Note
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2">
                                    {notes.length > 0 ? (
                                        <div className="max-w-3xl mx-auto space-y-8">
                                            
                                            {/* Pinned Notes Section */}
                                            {pinnedNotes.length > 0 && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-xs font-bold text-neutral-muted uppercase tracking-wider mb-4">
                                                        <Pin className="w-3.5 h-3.5 fill-neutral-400" /> Pinned Notes
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {pinnedNotes.map(note => (
                                                            <div key={note.id} className="relative bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm group">
                                                                <div className="absolute top-4 right-4">
                                                                    <Pin className="w-4 h-4 text-yellow-600 fill-yellow-600 transform rotate-45" />
                                                                </div>
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <img src={note.author.avatar} alt={note.author.name} className="w-8 h-8 rounded-full border border-yellow-200" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-neutral-primary">{note.author.name}</p>
                                                                        <p className="text-xs text-neutral-secondary">{note.date}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-neutral-primary leading-relaxed pl-11">
                                                                    {note.content}
                                                                </p>
                                                                <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => deleteNote(note.id)}
                                                                        className="p-1.5 hover:bg-yellow-100 rounded text-yellow-700/50 hover:text-yellow-700"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timeline Section */}
                                            <div>
                                                <h4 className="flex items-center gap-2 text-xs font-bold text-neutral-muted uppercase tracking-wider mb-4">
                                                    <Activity className="w-3.5 h-3.5" /> Recent History
                                                </h4>
                                                <div className="space-y-6 pl-2">
                                                    {otherNotes.map((note, idx) => (
                                                        <div key={note.id} className="relative pl-8 group">
                                                            {/* Connector Line */}
                                                            {idx !== otherNotes.length - 1 && (
                                                                <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-neutral-border"></div>
                                                            )}
                                                            
                                                            {/* Avatar Marker */}
                                                            <div className="absolute top-0 left-0 w-6 h-6 rounded-full border border-white shadow-sm overflow-hidden z-10">
                                                                <img src={note.author.avatar} alt="" className="w-full h-full object-cover" />
                                                            </div>

                                                            {/* Note Card */}
                                                            <div className="bg-white border border-neutral-border rounded-lg p-4 hover:border-flexi-blue/30 hover:shadow-sm transition-all">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-bold text-neutral-primary">{note.author.name}</span>
                                                                        <span className="text-xs text-neutral-muted">{note.author.role} • {note.date}</span>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => deleteNote(note.id)}
                                                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-page rounded text-neutral-400 hover:text-state-error transition-all"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                                <p className="text-sm text-neutral-secondary leading-relaxed">
                                                                    {note.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    ) : (
                                        <EmptyDataState 
                                            title="No notes yet" 
                                            description="Add a note to track important information or observations about this employee."
                                            icon={StickyNote}
                                            actionLabel="Create First Note"
                                            onAction={() => setIsAddNoteDrawerOpen(true)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 9. ACTIVITY LOG TAB (NEW) */}
                        {activeTab === 'activity' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-primary">Employee Activity Log</h3>
                                        <p className="text-sm text-neutral-secondary">Comprehensive timeline of all events and changes.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="flex items-center gap-2 bg-white border border-neutral-border rounded-lg px-3 py-2 text-sm">
                                            <Filter className="w-4 h-4 text-neutral-muted" />
                                            <select 
                                                value={activityFilter}
                                                onChange={(e) => setActivityFilter(e.target.value)}
                                                className="bg-transparent border-none outline-none text-neutral-primary font-medium cursor-pointer"
                                            >
                                                <option value="All">All Activities</option>
                                                <option value="HR">HR Actions</option>
                                                <option value="System">System Logs</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-4 py-2">
                                    <div className="max-w-3xl mx-auto space-y-0">
                                        {filteredActivities.map((activity, idx) => (
                                            <div key={activity.id} className="relative flex gap-6 pb-8 group last:pb-0">
                                                {/* Connector Line */}
                                                {idx !== filteredActivities.length - 1 && (
                                                    <div className="absolute top-10 left-[27px] bottom-0 w-px bg-neutral-border"></div>
                                                )}
                                                
                                                {/* Icon Bubble */}
                                                <div className={`relative z-10 w-14 h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 ${activity.color}`}>
                                                    <activity.icon className="w-6 h-6" />
                                                </div>

                                                {/* Content Card */}
                                                <div className="flex-1 pt-1">
                                                    <div className="bg-white border border-neutral-border rounded-xl p-5 hover:shadow-md hover:border-flexi-blue/30 transition-all relative">
                                                        {/* Arrow pointing to bubble */}
                                                        <div className="absolute top-6 -left-2 w-4 h-4 bg-white border-l border-b border-neutral-border transform rotate-45 group-hover:border-l-flexi-blue/30 group-hover:border-b-flexi-blue/30 transition-colors"></div>
                                                        
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 bg-neutral-page text-neutral-secondary border border-neutral-border">
                                                                    {activity.type}
                                                                </span>
                                                                <h4 className="text-base font-bold text-neutral-primary">{activity.title}</h4>
                                                            </div>
                                                            <span className="text-xs font-medium text-neutral-muted whitespace-nowrap bg-neutral-page px-2 py-1 rounded-full">
                                                                {activity.date}
                                                            </span>
                                                        </div>
                                                        
                                                        <p className="text-sm text-neutral-secondary mb-3">{activity.description}</p>
                                                        
                                                        <div className="flex items-center gap-2 pt-3 border-t border-neutral-border/50">
                                                            <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                                                                {activity.user.charAt(0)}
                                                            </div>
                                                            <span className="text-xs text-neutral-500">
                                                                Action by <span className="font-semibold text-neutral-700">{activity.user}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder for other tabs */}
                        {!['summary', 'job', 'payroll', 'attendance', 'leaves', 'performance', 'docs', 'notes', 'activity'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-in fade-in">
                                <div className="w-16 h-16 bg-white border border-neutral-border rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                {TABS.find(t => t.id === activeTab)?.icon && React.createElement(TABS.find(t => t.id === activeTab)!.icon, { className: "w-8 h-8 text-flexi-blue" })}
                                </div>
                                <h3 className="text-xl font-bold text-neutral-primary">{TABS.find(t => t.id === activeTab)?.label}</h3>
                                <p className="text-neutral-secondary mt-2">This module is under construction.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </div>

      {/* EDIT JOB DETAILS DRAWER - (Remains Same) */}
      {isEditJobDrawerOpen && (
        <>
            <div 
                className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-[1px] z-40 transition-opacity"
                onClick={() => setIsEditJobDrawerOpen(false)}
            />
            <div className={`fixed top-0 right-0 bottom-0 z-50 w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col ${isEditJobDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-neutral-border bg-neutral-page/30">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-primary">Update Job Details</h3>
                            <p className="text-xs text-neutral-secondary">Modify role, organization, or reporting lines.</p>
                        </div>
                        <button 
                            onClick={() => setIsEditJobDrawerOpen(false)}
                            className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                </div>
                <div className="flex-1 p-6">
                    <p className="text-neutral-secondary text-sm">Form content here...</p>
                </div>
                <div className="p-5 border-t border-neutral-border bg-neutral-page/30 flex items-center justify-end gap-3">
                    <button onClick={() => setIsEditJobDrawerOpen(false)} className="px-4 py-2 text-sm font-medium border border-neutral-border rounded-lg">Cancel</button>
                </div>
            </div>
        </>
      )}

      {/* MANAGE PAYROLL TAGS DRAWER - (Remains Same) */}
      {isManageTagsDrawerOpen && (
        <>
             <div 
                className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-[1px] z-[60] transition-opacity"
                onClick={() => setIsManageTagsDrawerOpen(false)}
            />
            <div className={`fixed top-0 right-0 bottom-0 z-[70] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col ${isManageTagsDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* ... Drawer Content ... */}
                <div className="p-5 border-b border-neutral-border bg-neutral-page/30 flex items-center justify-between">
                    <div>
                         <h3 className="text-lg font-bold text-neutral-primary">Manage Payroll Tags</h3>
                         <p className="text-xs text-neutral-secondary">Add or remove salary components.</p>
                    </div>
                    <button 
                        onClick={() => setIsManageTagsDrawerOpen(false)}
                        className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-neutral-border sticky top-0 bg-white z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
                        <input 
                            type="text"
                            placeholder="Search tags..."
                            value={tagSearchQuery}
                            onChange={(e) => setTagSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-border rounded-lg focus:ring-2 focus:ring-flexi-blue focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {(['Earnings', 'Deductions', 'Perks', 'Statutory'] as TagCategory[]).map(cat => {
                        const filteredTags = ALL_PAYROLL_TAGS.filter(t => 
                            t.category === cat && 
                            t.label.toLowerCase().includes(tagSearchQuery.toLowerCase())
                        );

                        if (filteredTags.length === 0) return null;

                        return (
                            <div key={cat}>
                                <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-3 px-1">{cat}</h4>
                                <div className="space-y-2">
                                    {filteredTags.map(tag => {
                                        const isAssigned = assignedTagIds.includes(tag.id);
                                        return (
                                            <div 
                                                key={tag.id}
                                                onClick={() => !tag.isSystem && toggleTag(tag.id)}
                                                className={`
                                                    flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer select-none
                                                    ${isAssigned 
                                                        ? 'bg-flexi-light/30 border-flexi-blue/40 shadow-sm' 
                                                        : 'bg-white border-neutral-border hover:border-neutral-secondary/50'
                                                    }
                                                    ${tag.isSystem ? 'opacity-80 cursor-not-allowed bg-neutral-page/50' : ''}
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded ${getCategoryColor(cat).split(' ')[0]} ${getCategoryColor(cat).split(' ')[1]}`}>
                                                        {getCategoryIcon(cat)}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${isAssigned ? 'text-flexi-blue' : 'text-neutral-primary'}`}>{tag.label}</p>
                                                        {tag.description && <p className="text-[10px] text-neutral-muted">{tag.description}</p>}
                                                    </div>
                                                </div>
                                                
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                                    isAssigned 
                                                    ? 'bg-flexi-blue border-flexi-blue' 
                                                    : 'border-neutral-300 bg-white'
                                                }`}>
                                                    {isAssigned && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-neutral-border bg-neutral-page/30 flex justify-end gap-3">
                     <div className="flex-1 flex items-center gap-2 text-xs text-neutral-muted">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full"></div> System tags are locked
                     </div>
                     <button 
                        onClick={() => setIsManageTagsDrawerOpen(false)}
                        className="px-6 py-2 bg-flexi-blue text-white text-sm font-bold rounded-lg hover:bg-flexi-end shadow-sm transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </>
      )}

      {/* ASSIGNMENT HISTORY DETAILS DRAWER - (Remains Same) */}
      {selectedHistoryEvent && (
        <>
             <div 
                className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-[2px] z-[60] transition-opacity"
                onClick={() => setSelectedHistoryEvent(null)}
            />
            <div className="fixed top-0 right-0 bottom-0 z-[70] w-full md:w-[500px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 border-l border-neutral-border flex flex-col">
                {/* ... History Drawer Content ... */}
                <div className="p-5 border-b border-neutral-border bg-neutral-page/30 flex items-start justify-between">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                                selectedHistoryEvent.type === 'Promotion' ? 'bg-purple-100 text-purple-700' :
                                selectedHistoryEvent.type === 'Transfer' ? 'bg-blue-100 text-flexi-blue' :
                                'bg-gray-100 text-neutral-600'
                            }`}>
                                {selectedHistoryEvent.type}
                            </span>
                            <span className="text-xs text-neutral-muted font-mono">{selectedHistoryEvent.id}</span>
                         </div>
                         <h3 className="text-lg font-bold text-neutral-primary">Change Details</h3>
                         <div className="flex items-center gap-2 text-xs text-neutral-secondary mt-1">
                             <Calendar className="w-3.5 h-3.5" /> {selectedHistoryEvent.date}
                             <span className="text-neutral-300">|</span>
                             <Clock className="w-3.5 h-3.5" /> {selectedHistoryEvent.time}
                         </div>
                    </div>
                    <button 
                        onClick={() => setSelectedHistoryEvent(null)}
                        className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-neutral-page/50 rounded-lg p-4 border border-neutral-border">
                        <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileQuestion className="w-3.5 h-3.5" /> Change Reason
                        </h4>
                        <p className="text-sm text-neutral-primary leading-relaxed">
                            {selectedHistoryEvent.reason}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> Assignment Changes
                        </h4>
                        <div className="space-y-3">
                            {selectedHistoryEvent.changes.map((change, index) => (
                                <div key={index} className="border border-neutral-border rounded-lg overflow-hidden">
                                    <div className="bg-neutral-page/30 px-3 py-2 border-b border-neutral-border flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-flexi-blue"></div>
                                        <span className="text-xs font-bold text-neutral-primary uppercase">{change.field}</span>
                                    </div>
                                    <div className="p-3 grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                                        <div className="bg-neutral-50 p-2 rounded border border-neutral-100 min-h-[40px] flex items-center">
                                            <span className="text-sm text-neutral-500 line-through decoration-neutral-300 decoration-1">
                                                {change.before}
                                            </span>
                                        </div>
                                        <div className="text-neutral-400 flex justify-center">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                        <div className="bg-blue-50/50 p-2 rounded border border-blue-100 min-h-[40px] flex items-center">
                                            <span className="text-sm font-semibold text-flexi-blue">
                                                {change.after}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-neutral-border pt-4">
                         <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-3">Audit Log</h4>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-neutral-border">
                                {selectedHistoryEvent.changedBy.avatar ? (
                                    <img src={selectedHistoryEvent.changedBy.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-neutral-500" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-neutral-secondary">Changed by</p>
                                <p className="text-sm font-bold text-neutral-primary">{selectedHistoryEvent.changedBy.name}</p>
                                <p className="text-xs text-neutral-muted">{selectedHistoryEvent.changedBy.role}</p>
                            </div>
                         </div>
                    </div>
                </div>
                <div className="p-4 border-t border-neutral-border bg-neutral-page/30 flex justify-end">
                    <button 
                        onClick={() => setSelectedHistoryEvent(null)}
                        className="px-4 py-2 bg-white border border-neutral-border rounded-lg text-sm font-medium text-neutral-primary hover:bg-neutral-page transition-colors shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </>
      )}

      {/* DOCUMENT PREVIEW MODAL - (Remains Same) */}
      {previewDoc && (
        <>
            <div 
                className="fixed inset-0 bg-neutral-primary/40 backdrop-blur-sm z-[80] transition-opacity"
                onClick={() => setPreviewDoc(null)}
            />
            <div className="fixed inset-4 md:inset-10 z-[90] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
                {/* ... Doc Preview Content ... */}
                <div className="flex-1 bg-neutral-page/50 flex flex-col items-center justify-center border-r border-neutral-border p-8 relative">
                    <div className="absolute top-4 left-4 flex gap-2">
                        <button onClick={() => setPreviewDoc(null)} className="md:hidden p-2 bg-white rounded-full shadow-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="w-full max-w-lg aspect-[3/4] bg-white border border-neutral-border shadow-lg flex flex-col items-center justify-center p-8">
                         {getFileIcon(previewDoc.type)}
                         <h3 className="mt-4 text-lg font-bold text-neutral-primary text-center break-all">{previewDoc.name}</h3>
                         <p className="text-neutral-secondary mt-2">Preview not available in demo</p>
                         <button className="mt-6 px-4 py-2 bg-neutral-primary text-white text-sm font-bold rounded-lg hover:bg-neutral-secondary transition-colors">
                            Download File
                         </button>
                    </div>
                </div>

                <div className="w-full md:w-96 bg-white flex flex-col">
                    <div className="p-5 border-b border-neutral-border flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-primary">File Details</h3>
                            <p className="text-xs text-neutral-secondary">Uploaded on {previewDoc.uploadDate}</p>
                        </div>
                        <button onClick={() => setPreviewDoc(null)} className="hidden md:block p-2 text-neutral-secondary hover:bg-neutral-page rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* ... Doc Metadata ... */}
                    <div className="p-5 border-b border-neutral-border space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-neutral-muted mb-1">File Type</p>
                                <p className="text-sm font-medium text-neutral-primary uppercase">{previewDoc.type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-muted mb-1">Size</p>
                                <p className="text-sm font-medium text-neutral-primary">{previewDoc.size}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-muted mb-1">Category</p>
                                <p className="text-sm font-medium text-neutral-primary">{previewDoc.category}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-muted mb-1">Uploaded By</p>
                                <p className="text-sm font-medium text-neutral-primary">{previewDoc.uploadedBy}</p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button className="text-xs text-state-error font-medium flex items-center gap-2 hover:underline">
                                <Trash2 className="w-3.5 h-3.5" /> Delete File
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History className="w-3.5 h-3.5" /> Version History
                        </h4>
                        <div className="space-y-6 relative pl-2">
                            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-neutral-border"></div>
                            {previewDoc.versions.map((ver, i) => (
                                <div key={i} className="relative pl-4">
                                    <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${i === 0 ? 'bg-flexi-blue' : 'bg-neutral-300'}`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm font-bold ${i === 0 ? 'text-neutral-primary' : 'text-neutral-secondary'}`}>
                                                {ver.version} {i === 0 && <span className="text-[10px] bg-flexi-light text-flexi-blue px-1.5 py-0.5 rounded ml-2">Current</span>}
                                            </p>
                                            <p className="text-xs text-neutral-secondary mt-0.5">Uploaded by {ver.user}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-neutral-primary font-medium">{ver.date}</p>
                                            <p className="text-[10px] text-neutral-muted mt-0.5">{ver.size}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
      )}

      {/* ADD NOTE DRAWER - (Remains Same) */}
      {isAddNoteDrawerOpen && (
        <>
            <div 
                className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-[1px] z-40 transition-opacity"
                onClick={() => setIsAddNoteDrawerOpen(false)}
            />
            <div className={`fixed top-0 right-0 bottom-0 z-50 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col ${isAddNoteDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* ... Add Note Drawer Content ... */}
                <div className="flex items-center justify-between p-5 border-b border-neutral-border bg-neutral-page/30">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-primary">Add Note</h3>
                            <p className="text-xs text-neutral-secondary">Create a private remark for this employee.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddNoteDrawerOpen(false)}
                            className="p-2 text-neutral-secondary hover:bg-neutral-border rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                </div>
                
                <div className="flex-1 p-6 flex flex-col">
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-neutral-primary mb-2">Note Content</label>
                        <textarea 
                            autoFocus
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Type your observations here..."
                            className="w-full h-48 p-4 text-sm border border-neutral-border rounded-lg focus:ring-2 focus:ring-flexi-blue focus:border-transparent outline-none resize-none"
                        ></textarea>
                     </div>
                     
                     <div className="mt-4">
                         <label className="flex items-center gap-3 p-3 border border-neutral-border rounded-lg cursor-pointer hover:bg-neutral-page/30 transition-colors">
                             <input 
                                type="checkbox"
                                checked={newNotePinned}
                                onChange={(e) => setNewNotePinned(e.target.checked)}
                                className="w-4 h-4 text-flexi-blue border-neutral-300 rounded focus:ring-flexi-blue"
                             />
                             <div className="flex items-center gap-2">
                                <Pin className={`w-4 h-4 ${newNotePinned ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-500'}`} />
                                <span className="text-sm font-medium text-neutral-primary">Pin this note</span>
                             </div>
                         </label>
                         <p className="text-xs text-neutral-muted mt-2 ml-1">Pinned notes appear at the top of the list.</p>
                     </div>
                </div>

                <div className="p-5 border-t border-neutral-border bg-neutral-page/30 flex items-center justify-end gap-3">
                    <button 
                        onClick={() => setIsAddNoteDrawerOpen(false)} 
                        className="px-4 py-2 text-sm font-medium border border-neutral-border bg-white rounded-lg hover:bg-neutral-page transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveNote}
                        disabled={!newNoteContent.trim()}
                        className="px-4 py-2 text-sm font-bold text-white bg-flexi-blue rounded-lg hover:bg-flexi-end transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        Save Note
                    </button>
                </div>
            </div>
        </>
      )}

    </div>
  );
};

export default Employee360;