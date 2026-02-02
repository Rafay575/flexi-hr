import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  History, 
  ArrowRightLeft, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  X, 
  CheckCircle2, 
  ChevronDown,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Plus,
  Download,
  FileText,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Smartphone,
  Check,
  XCircle,
  CalendarDays,
  Bell,
  AlertCircle,
  Zap,
  Sun,
  Moon,
  Settings2,
  User,
  UserX,
  ChevronLeft,
  ChevronsRight,
  Target,
  Hash,
  Briefcase,
  MapPin,
  Globe,
  CheckSquare,
  Square
} from 'lucide-react';

type ViewMode = 'BY_EMPLOYEE' | 'BY_SHIFT' | 'BY_TEMPLATE';
type AssignmentStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'DRAFT';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  location: string;
  grade: string;
  hireDate: string;
  photo?: string;
}

interface ShiftAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  templateId: string;
  templateName: string;
  templateCode: string;
  shiftType: 'FIXED' | 'FLEXI' | 'ROTATING' | 'SPLIT' | 'RAMZAN';
  effectiveFrom: string;
  effectiveTo?: string;
  workCalendar: string;
  status: AssignmentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface ShiftTemplate {
  id: string;
  code: string;
  name: string;
  type: 'FIXED' | 'FLEXI' | 'ROTATING' | 'SPLIT' | 'RAMZAN';
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  department?: string;
  location?: string;
}

// Enhanced Mock Data
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Jenkins', employeeId: 'FLX-001', department: 'Engineering', position: 'Senior Developer', email: 'sarah.j@company.com', phone: '+1 (555) 123-4567', location: 'HQ Main', grade: 'E4', hireDate: '2023-01-15' },
  { id: '2', name: 'Michael Chen', employeeId: 'FLX-024', department: 'Product', position: 'Product Manager', email: 'michael.c@company.com', phone: '+1 (555) 234-5678', location: 'Remote', grade: 'E5', hireDate: '2023-03-22' },
  { id: '3', name: 'Amara Okafor', employeeId: 'FLX-112', department: 'Design', position: 'UX Designer', email: 'amara.o@company.com', phone: '+1 (555) 345-6789', location: 'HQ Main', grade: 'E3', hireDate: '2023-05-10' },
  { id: '4', name: 'David Miller', employeeId: 'FLX-089', department: 'Engineering', position: 'DevOps Engineer', email: 'david.m@company.com', phone: '+1 (555) 456-7890', location: 'Data Center', grade: 'E4', hireDate: '2022-11-30' },
  { id: '5', name: 'Elena Rodriguez', employeeId: 'FLX-045', department: 'Operations', position: 'Operations Manager', email: 'elena.r@company.com', phone: '+1 (555) 567-8901', location: 'HQ Main', grade: 'E5', hireDate: '2022-08-15' },
  { id: '6', name: 'James Wilson', employeeId: 'FLX-078', department: 'Sales', position: 'Sales Director', email: 'james.w@company.com', phone: '+1 (555) 678-9012', location: 'West Branch', grade: 'E6', hireDate: '2021-12-01' },
  { id: '7', name: 'Priya Sharma', employeeId: 'FLX-156', department: 'Marketing', position: 'Marketing Lead', email: 'priya.s@company.com', phone: '+1 (555) 789-0123', location: 'HQ Main', grade: 'E4', hireDate: '2023-02-28' },
  { id: '8', name: 'Thomas Lee', employeeId: 'FLX-092', department: 'Finance', position: 'Financial Analyst', email: 'thomas.l@company.com', phone: '+1 (555) 890-1234', location: 'HQ Main', grade: 'E3', hireDate: '2023-07-01' },
  { id: '9', name: 'Olivia Martin', employeeId: 'FLX-201', department: 'Engineering', position: 'Frontend Developer', email: 'olivia.m@company.com', phone: '+1 (555) 901-2345', location: 'Remote', grade: 'E2', hireDate: '2024-01-15' },
  { id: '10', name: 'Robert Garcia', employeeId: 'FLX-202', department: 'Support', position: 'Customer Support', email: 'robert.g@company.com', phone: '+1 (555) 012-3456', location: 'HQ Main', grade: 'E2', hireDate: '2024-02-01' },
  { id: '11', name: 'Lisa Wang', employeeId: 'FLX-203', department: 'HR', position: 'HR Specialist', email: 'lisa.w@company.com', phone: '+1 (555) 123-4567', location: 'HQ Main', grade: 'E3', hireDate: '2023-11-15' },
  { id: '12', name: 'Carlos Silva', employeeId: 'FLX-204', department: 'Operations', position: 'Warehouse Manager', email: 'carlos.s@company.com', phone: '+1 (555) 234-5678', location: 'Warehouse', grade: 'E4', hireDate: '2022-10-01' },
  { id: '13', name: 'Aisha Patel', employeeId: 'FLX-205', department: 'Engineering', position: 'Backend Developer', email: 'aisha.p@company.com', phone: '+1 (555) 345-6789', location: 'Remote', grade: 'E3', hireDate: '2024-01-20' },
  { id: '14', name: 'Kevin Brown', employeeId: 'FLX-206', department: 'Sales', position: 'Account Executive', email: 'kevin.b@company.com', phone: '+1 (555) 456-7890', location: 'West Branch', grade: 'E3', hireDate: '2023-09-10' },
  { id: '15', name: 'Sophia Kim', employeeId: 'FLX-207', department: 'Design', position: 'UI Designer', email: 'sophia.k@company.com', phone: '+1 (555) 567-8901', location: 'HQ Main', grade: 'E2', hireDate: '2024-03-05' },
  { id: '16', name: 'Daniel White', employeeId: 'FLX-208', department: 'Marketing', position: 'Content Strategist', email: 'daniel.w@company.com', phone: '+1 (555) 678-9012', location: 'Remote', grade: 'E3', hireDate: '2023-12-15' },
  { id: '17', name: 'Emma Davis', employeeId: 'FLX-209', department: 'Finance', position: 'Accountant', email: 'emma.d@company.com', phone: '+1 (555) 789-0123', location: 'HQ Main', grade: 'E2', hireDate: '2024-01-10' },
  { id: '18', name: 'Marcus Taylor', employeeId: 'FLX-210', department: 'Operations', position: 'Logistics Coordinator', email: 'marcus.t@company.com', phone: '+1 (555) 890-1234', location: 'Warehouse', grade: 'E3', hireDate: '2023-08-22' },
  { id: '19', name: 'Nina Johnson', employeeId: 'FLX-211', department: 'Engineering', position: 'QA Engineer', email: 'nina.j@company.com', phone: '+1 (555) 901-2345', location: 'Remote', grade: 'E2', hireDate: '2024-02-15' },
  { id: '20', name: 'Samuel Green', employeeId: 'FLX-212', department: 'Product', position: 'Product Analyst', email: 'samuel.g@company.com', phone: '+1 (555) 012-3456', location: 'HQ Main', grade: 'E3', hireDate: '2023-10-01' },
];

const MOCK_ASSIGNMENTS: ShiftAssignment[] = [
  { id: 'SA-001', employeeId: 'FLX-001', employeeName: 'Sarah Jenkins', department: 'Engineering', templateId: 'ST-001', templateName: 'Morning Shift', templateCode: 'MORN', shiftType: 'FIXED', effectiveFrom: '2025-01-01', workCalendar: 'Standard 5-Day', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-12-01', updatedAt: '2024-12-01' },
  { id: 'SA-002', employeeId: 'FLX-024', employeeName: 'Michael Chen', department: 'Product', templateId: 'ST-004', templateName: 'General Flexi', templateCode: 'FLEXI', shiftType: 'FLEXI', effectiveFrom: '2025-01-10', workCalendar: 'Standard 5-Day', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-12-05', updatedAt: '2024-12-05' },
  { id: 'SA-003', employeeId: 'FLX-112', employeeName: 'Amara Okafor', department: 'Design', templateId: 'ST-001', templateName: 'Morning Shift', templateCode: 'MORN', shiftType: 'FIXED', effectiveFrom: '2025-01-01', workCalendar: 'Creative Flex', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-12-01', updatedAt: '2024-12-01' },
  { id: 'SA-004', employeeId: 'FLX-089', employeeName: 'David Miller', department: 'Engineering', templateId: 'ST-003', templateName: 'Night Shift', templateCode: 'NIGHT', shiftType: 'FIXED', effectiveFrom: '2024-12-15', workCalendar: 'Standard 5-Day', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-11-30', updatedAt: '2024-11-30' },
  { id: 'SA-006', employeeId: 'FLX-078', employeeName: 'James Wilson', department: 'Sales', templateId: 'ST-005', templateName: 'Ramzan Shift', templateCode: 'RMZ', shiftType: 'RAMZAN', effectiveFrom: '2025-03-01', effectiveTo: '2025-04-30', workCalendar: 'Ramadan Calendar', status: 'PENDING', createdBy: 'Admin User', createdAt: '2024-12-10', updatedAt: '2024-12-10' },
  { id: 'SA-007', employeeId: 'FLX-156', employeeName: 'Priya Sharma', department: 'Marketing', templateId: 'ST-004', templateName: 'General Flexi', templateCode: 'FLEXI', shiftType: 'FLEXI', effectiveFrom: '2024-11-01', effectiveTo: '2024-12-31', workCalendar: 'Standard 5-Day', status: 'EXPIRED', createdBy: 'Admin User', createdAt: '2024-10-15', updatedAt: '2024-10-15' },
  { id: 'SA-008', employeeId: 'FLX-092', employeeName: 'Thomas Lee', department: 'Finance', templateId: 'ST-001', templateName: 'Morning Shift', templateCode: 'MORN', shiftType: 'FIXED', effectiveFrom: '2024-12-01', workCalendar: 'Standard 5-Day', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-11-25', updatedAt: '2024-11-25' },
  { id: 'SA-009', employeeId: 'FLX-201', employeeName: 'Olivia Martin', department: 'Engineering', templateId: 'ST-004', templateName: 'General Flexi', templateCode: 'FLEXI', shiftType: 'FLEXI', effectiveFrom: '2024-12-01', workCalendar: 'Standard 5-Day', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-11-20', updatedAt: '2024-11-20' },
  { id: 'SA-010', employeeId: 'FLX-202', employeeName: 'Robert Garcia', department: 'Support', templateId: 'ST-002', templateName: 'Evening Shift', templateCode: 'EVE', shiftType: 'FIXED', effectiveFrom: '2024-12-01', workCalendar: 'Standard 5-Day', status: 'ACTIVE', createdBy: 'Admin User', createdAt: '2024-11-28', updatedAt: '2024-11-28' },
];

const MOCK_TEMPLATES: ShiftTemplate[] = [
  { id: 'ST-001', code: 'MORN', name: 'Morning Shift', type: 'FIXED', employeeCount: 85, status: 'ACTIVE', department: 'Engineering', location: 'HQ Main' },
  { id: 'ST-002', code: 'EVE', name: 'Evening Shift', type: 'FIXED', employeeCount: 42, status: 'ACTIVE', department: 'Support', location: 'HQ Main' },
  { id: 'ST-003', code: 'NIGHT', name: 'Night Shift', type: 'FIXED', employeeCount: 12, status: 'ACTIVE', department: 'Operations', location: 'Data Center' },
  { id: 'ST-004', code: 'FLEXI', name: 'General Flexi', type: 'FLEXI', employeeCount: 30, status: 'ACTIVE', department: 'All', location: 'Remote' },
  { id: 'ST-005', code: 'RMZ', name: 'Ramzan Shift', type: 'RAMZAN', employeeCount: 156, status: 'INACTIVE', department: 'All', location: 'HQ Main' },
  { id: 'ST-006', code: 'SPLT', name: 'Split Shift', type: 'SPLIT', employeeCount: 8, status: 'ACTIVE', department: 'Operations', location: 'Warehouse' },
  { id: 'ST-007', code: 'ROTA', name: 'Rotation A', type: 'ROTATING', employeeCount: 24, status: 'ACTIVE', department: 'Manufacturing', location: 'Factory' },
];

const SHIFT_TYPE_CONFIG = {
  FIXED: { label: 'Fixed', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Sun size={12} /> },
  FLEXI: { label: 'Flexi', color: 'bg-green-50 text-green-600 border-green-100', icon: <Zap size={12} /> },
  ROTATING: { label: 'Rotating', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <LayoutGrid size={12} /> },
  SPLIT: { label: 'Split', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Settings2 size={12} /> },
  RAMZAN: { label: 'Ramzan', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Moon size={12} /> },
};

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
  PENDING: { label: 'Pending', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  EXPIRED: { label: 'Expired', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  DRAFT: { label: 'Draft', color: 'bg-blue-50 text-blue-600 border-blue-100' },
};

export const ShiftAssignment: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('BY_EMPLOYEE');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);
  const [bulkStep, setBulkStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus | 'ALL'>('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<ShiftAssignment | null>(null);
  const [selectedEmployeesForBulk, setSelectedEmployeesForBulk] = useState<string[]>([]);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    '2 pending assignments need approval',
    '5 employees have expiring assignments this month',
    'New shift template available: Weekend Shift'
  ]);
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('ALL');
// Add these state variables at the top of your ShiftAssignment component
const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
const [effectiveFrom, setEffectiveFrom] = useState('');
const [workCalendar, setWorkCalendar] = useState('');
const [notes, setNotes] = useState('');
const [employeeSearch, setEmployeeSearch] = useState('');

// Add this filtered employees function
const filteredEmployees = useMemo(() => {
  return MOCK_EMPLOYEES.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearch.toLowerCase());
    return matchesSearch;
  });
}, [employeeSearch]);

// Update the handleIndividualAssignment function to pre-select the employee

  // Get unassigned employees
  const unassignedEmployees = useMemo(() => {
    const assignedEmployeeIds = MOCK_ASSIGNMENTS
      .filter(a => a.status === 'ACTIVE' || a.status === 'PENDING')
      .map(a => a.employeeId);
    return MOCK_EMPLOYEES.filter(emp => !assignedEmployeeIds.includes(emp.employeeId));
  }, []);

  // Filter unassigned employees for modal
  const filteredUnassignedEmployees = useMemo(() => {
    return unassignedEmployees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(unassignedSearch.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(unassignedSearch.toLowerCase()) ||
        emp.department.toLowerCase().includes(unassignedSearch.toLowerCase());
      const matchesDepartment = selectedDepartmentFilter === 'ALL' || emp.department === selectedDepartmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [unassignedEmployees, unassignedSearch, selectedDepartmentFilter]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return MOCK_ASSIGNMENTS.filter(assignment => {
      const matchesSearch = 
        assignment.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.templateName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'ALL' || assignment.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'ALL' || assignment.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, selectedDepartment, selectedStatus]);

  // Get department options
  const departments = useMemo(() => {
    const uniqueDepts = Array.from(new Set(MOCK_ASSIGNMENTS.map(a => a.department)));
    return ['ALL', ...uniqueDepts];
  }, []);

  // Get departments for unassigned filter
  const unassignedDepartments = useMemo(() => {
    const uniqueDepts = Array.from(new Set(unassignedEmployees.map(emp => emp.department)));
    return ['ALL', ...uniqueDepts];
  }, [unassignedEmployees]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleIndividualAssignment = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsIndividualModalOpen(true);
    setIsUnassignedModalOpen(false);
  };

  const handleBulkAssignUnassigned = () => {
    setSelectedEmployeesForBulk(filteredUnassignedEmployees.map(emp => emp.employeeId));
    setIsUnassignedModalOpen(false);
    setIsBulkModalOpen(true);
    setBulkStep(1);
  };

  const handleSelectEmployeeForBulk = (employeeId: string) => {
    setSelectedEmployeesForBulk(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleSelectAllUnassigned = () => {
    if (selectedEmployeesForBulk.length === filteredUnassignedEmployees.length) {
      setSelectedEmployeesForBulk([]);
    } else {
      setSelectedEmployeesForBulk(filteredUnassignedEmployees.map(emp => emp.employeeId));
    }
  };

  const handleViewSchedule = (assignment: ShiftAssignment) => {
    setSelectedAssignment(assignment);
    setIsScheduleModalOpen(true);
  };

  const handleChangeAssignment = (assignment: ShiftAssignment) => {
    alert(`Change assignment for ${assignment.employeeName}`);
    setActiveActionMenu(null);
  };

  const handleViewHistory = (assignment: ShiftAssignment) => {
    alert(`View history for ${assignment.employeeName}`);
    setActiveActionMenu(null);
  };

  const handleSendNotification = (assignment: ShiftAssignment) => {
    alert(`Send notification to ${assignment.employeeName} about their shift assignment`);
    setActiveActionMenu(null);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      alert(`Assignment ${assignmentId} deleted (mock action)`);
      setActiveActionMenu(null);
    }
  };

  const getEmployeeById = (employeeId: string) => {
    return MOCK_EMPLOYEES.find(emp => emp.employeeId === employeeId);
  };

  const displayedUnassignedEmployees = useMemo(() => {
    return unassignedEmployees.slice(0, 5);
  }, [unassignedEmployees]);

  const remainingUnassignedCount = useMemo(() => {
    return unassignedEmployees.length - 5;
  }, [unassignedEmployees]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER WITH STATS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <UserPlus className="text-[#3E3B6F]" size={28} /> Shift Assignment
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Assign work schedules and calendars to your workforce</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('BY_EMPLOYEE')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'BY_EMPLOYEE' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <List size={14} /> By Employee
            </button>
            <button 
              onClick={() => setViewMode('BY_SHIFT')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'BY_SHIFT' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <LayoutGrid size={14} /> By Shift
            </button>
            <button 
              onClick={() => setViewMode('BY_TEMPLATE')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'BY_TEMPLATE' ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500'}`}
            >
              <FileText size={14} /> By Template
            </button>
          </div>
          <button 
            onClick={() => { setIsBulkModalOpen(true); setBulkStep(1); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Bulk Assign
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Assigned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#3E3B6F]">
              {MOCK_ASSIGNMENTS.filter(a => a.status === 'ACTIVE').length}
            </span>
            <span className="text-xs text-gray-400">employees</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unassigned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-600">
              {unassignedEmployees.length}
            </span>
            <span className="text-xs text-gray-400">employees</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-yellow-600">
              {MOCK_ASSIGNMENTS.filter(a => a.status === 'PENDING').length}
            </span>
            <span className="text-xs text-gray-400">approvals</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] p-5 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 text-white">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Shift Templates</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E8D5A3]">
              {MOCK_TEMPLATES.length}
            </span>
            <span className="text-xs font-bold text-white/50">active</span>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {notifications.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest flex items-center gap-2">
              <Bell size={14} /> Notifications
            </h4>
            <button 
              onClick={() => setNotifications([])}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((note, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-blue-100">
                <AlertCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium text-blue-900">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UNASSIGNED EMPLOYEES SECTION */}
      {viewMode === 'BY_EMPLOYEE' && unassignedEmployees.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <UserX size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-orange-800 uppercase tracking-widest">
                  Unassigned Employees ({unassignedEmployees.length})
                </h4>
                <p className="text-[10px] text-orange-600">Employees without shift assignments</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {remainingUnassignedCount > 0 && (
                <button 
                  onClick={() => setIsUnassignedModalOpen(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-800 hover:bg-orange-100 px-3 py-1 rounded-lg transition-all"
                >
                  View All +{remainingUnassignedCount}
                </button>
              )}
              <button 
                onClick={() => {
                  setIsUnassignedModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
              >
                <Plus size={14} /> Assign All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {displayedUnassignedEmployees.map(emp => (
              <div key={emp.id} className="bg-white rounded-xl border border-orange-200 p-4 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-sm font-bold text-orange-600">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                      <p className="text-[10px] text-gray-500">{emp.employeeId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleIndividualAssignment(emp)}
                    className=" p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                    title="Assign Shift"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <Briefcase size={10} />
                    <span>{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <MapPin size={10} />
                    <span>{emp.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <Mail size={10} />
                    <span className="truncate">{emp.email.split('@')[0]}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleIndividualAssignment(emp)}
                  className="w-full mt-3 py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> Assign Shift
                </button>
              </div>
            ))}
          </div>
          
          {remainingUnassignedCount > 0 && (
            <div className="mt-4 pt-4 border-t border-orange-200 text-center">
              <button 
                onClick={() => setIsUnassignedModalOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center justify-center gap-2 mx-auto"
              >
                <ChevronsRight size={14} /> View All {unassignedEmployees.length} Unassigned Employees
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'BY_EMPLOYEE' ? (
        <>
          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employee, ID, or shift..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3E3B6F]/10 outline-none"
              />
            </div>
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === 'ALL' ? 'All Departments' : dept}</option>
              ))}
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AssignmentStatus | 'ALL')}
              className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
              <option value="DRAFT">Unassigned</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
              <Download size={14} /> Export
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
              <Filter size={18}/>
            </button>
          </div>

          {/* ASSIGNMENTS TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Employee Details</th>
                    <th className="px-6 py-5">Shift Assignment</th>
                    <th className="px-6 py-5">Effective Period</th>
                    <th className="px-6 py-5">Work Calendar</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAssignments.map((assignment) => {
                    const employee = getEmployeeById(assignment.employeeId);
                    return (
                      <tr key={assignment.id} className="group hover:bg-gray-50/80 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                              {assignment.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{assignment.employeeName}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase">{assignment.employeeId}</p>
                              <p className="text-[10px] text-gray-500 mt-1">{assignment.department}</p>
                              {employee && (
                                <div className="flex items-center gap-2 mt-1">
                                  <Mail size={10} className="text-gray-400" />
                                  <span className="text-[9px] text-gray-500">{employee.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${SHIFT_TYPE_CONFIG[assignment.shiftType].color}`}>
                                {SHIFT_TYPE_CONFIG[assignment.shiftType].icon}
                                {SHIFT_TYPE_CONFIG[assignment.shiftType].label}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{assignment.templateName}</p>
                              <p className="text-[10px] text-gray-500">Template: {assignment.templateCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                              <CalendarDays size={14} className="text-blue-500" />
                              From: {formatDate(assignment.effectiveFrom)}
                            </div>
                            {assignment.effectiveTo && (
                              <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                <CalendarDays size={14} className="text-orange-500" />
                                To: {formatDate(assignment.effectiveTo)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 group/link cursor-pointer">
                            <Calendar size={14} className="text-gray-400 group-hover/link:text-[#3E3B6F]" />
                            <span className="text-xs font-bold text-gray-600 group-hover/link:text-[#3E3B6F]">
                              {assignment.workCalendar}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[assignment.status].color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              assignment.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' :
                              assignment.status === 'PENDING' ? 'bg-yellow-500' :
                              assignment.status === 'EXPIRED' ? 'bg-gray-400' : 'bg-blue-500'
                            }`} />
                            {STATUS_CONFIG[assignment.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleViewSchedule(assignment)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Schedule"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleChangeAssignment(assignment)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Change Assignment"
                            >
                              <ArrowRightLeft size={16} />
                            </button>
                            <div className="relative">
                              <button 
                                onClick={() => setActiveActionMenu(activeActionMenu === assignment.id ? null : assignment.id)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                                title="More actions"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {activeActionMenu === assignment.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                                  <button
                                    onClick={() => {
                                      handleSendNotification(assignment);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Bell size={14} /> Send Notification
                                  </button>
                                  <button
                                    onClick={() => handleViewHistory(assignment)}
                                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <History size={14} /> Assignment History
                                  </button>
                                  <div className="border-t border-gray-100 my-1" />
                                  <button
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 size={14} /> Delete Assignment
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredAssignments.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
                  <Users size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Assignments Found</h3>
                  <p className="text-sm font-medium mt-2">Adjust your search or create new assignments.</p>
                </div>
              )}
            </div>
            
            {/* TABLE FOOTER */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Active: {MOCK_ASSIGNMENTS.filter(a => a.status === 'ACTIVE').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Pending: {MOCK_ASSIGNMENTS.filter(a => a.status === 'PENDING').length}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>
          </div>
        </>
      ) : viewMode === 'BY_SHIFT' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_TEMPLATES.map((template) => {
            const assignments = MOCK_ASSIGNMENTS.filter(a => a.templateId === template.id && a.status === 'ACTIVE');
            return (
              <div key={template.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3E3B6F] group-hover:scale-110 transition-transform">
                  <Clock size={80} />
                </div>
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${SHIFT_TYPE_CONFIG[template.type].color} flex items-center justify-center shadow-sm`}>
                      {SHIFT_TYPE_CONFIG[template.type].icon}
                    </div>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold ${template.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {template.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{template.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold mb-2">Code: {template.code}</p>
                  {template.department && (
                    <p className="text-[10px] text-gray-500 mb-4">{template.department} • {template.location}</p>
                  )}
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
                    <div>
                      <p className="text-2xl font-black text-[#3E3B6F] tabular-nums">{assignments.length}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Assignments</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                        View List
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedEmployee(null);
                          setIsIndividualModalOpen(true);
                        }}
                        className="p-2 bg-[#3E3B6F] text-white rounded-xl hover:scale-105 transition-all"
                      >
                        <Plus size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      
        </div>
      ) : (
        // BY_TEMPLATE VIEW
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* TEMPLATE USAGE STATS */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Template Usage Distribution</h4>
                <div className="space-y-4">
                  {MOCK_TEMPLATES.map(template => {
                    const assignments = MOCK_ASSIGNMENTS.filter(a => a.templateId === template.id);
                    const percentage = (assignments.length / MOCK_ASSIGNMENTS.length) * 100;
                    return (
                      <div key={template.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black ${SHIFT_TYPE_CONFIG[template.type].color}`}>
                              {SHIFT_TYPE_CONFIG[template.type].icon}
                              {template.code}
                            </span>
                            <span className="text-xs font-bold text-gray-800">{template.name}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-600">{assignments.length} employees</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              template.type === 'FIXED' ? 'bg-blue-500' :
                              template.type === 'FLEXI' ? 'bg-green-500' :
                              template.type === 'ROTATING' ? 'bg-purple-500' :
                              template.type === 'SPLIT' ? 'bg-orange-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl text-left hover:bg-blue-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Import Assignments</p>
                        <p className="text-[10px] text-gray-500">Upload CSV file</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl text-left hover:bg-green-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Send Notifications</p>
                        <p className="text-[10px] text-gray-500">Notify assigned employees</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl text-left hover:bg-purple-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">View Calendar</p>
                        <p className="text-[10px] text-gray-500">Monthly shift calendar</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNASSIGNED EMPLOYEES MODAL */}
      {isUnassignedModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                  <UserX size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Unassigned Employees</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                    <span>{unassignedEmployees.length} Employees</span>
                    <span>•</span>
                    <span>{unassignedDepartments.length - 1} Departments</span>
                    <span>•</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      Requires Assignment
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">
                  Selected: {selectedEmployeesForBulk.length}
                </span>
                <button
                  onClick={() => setIsUnassignedModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search employees by name, ID, or department..."
                    value={unassignedSearch}
                    onChange={(e) => setUnassignedSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
                <select
                  value={selectedDepartmentFilter}
                  onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none min-w-[180px]"
                >
                  {unassignedDepartments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'ALL' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSelectAllUnassigned}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  {selectedEmployeesForBulk.length === filteredUnassignedEmployees.length ? (
                    <>
                      <CheckSquare size={14} /> Deselect All
                    </>
                  ) : (
                    <>
                      <Square size={14} /> Select All
                    </>
                  )}
                </button>
                <button
                  onClick={handleBulkAssignUnassigned}
                  disabled={selectedEmployeesForBulk.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  <Plus size={16} /> Assign Selected ({selectedEmployeesForBulk.length})
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredUnassignedEmployees.map(emp => {
                    const isSelected = selectedEmployeesForBulk.includes(emp.employeeId);
                    return (
                      <div
                        key={emp.id}
                        onClick={() => handleSelectEmployeeForBulk(emp.employeeId)}
                        className={`bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                          isSelected
                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50'
                            : 'border-gray-200 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                isSelected
                                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white'
                                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                              }`}
                            >
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                              <p className="text-[10px] text-gray-500 font-bold">{emp.employeeId}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {emp.department}
                                </span>
                                <span className="text-[10px] text-gray-400">{emp.grade}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isSelected
                                  ? 'bg-orange-500 border-orange-500 text-white'
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {isSelected && <Check size={12} />}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Briefcase size={12} />
                            <span>{emp.position}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin size={12} />
                            <span>{emp.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail size={12} />
                            <span className="truncate">{emp.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CalendarDays size={12} />
                            <span>Hired: {formatDate(emp.hireDate)}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIndividualAssignment(emp);
                          }}
                          className={`w-full mt-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'
                              : 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-100 hover:from-orange-100 hover:to-amber-100'
                          }`}
                        >
                          <Plus size={12} className="inline mr-1" /> Assign Individual Shift
                        </button>
                      </div>
                    );
                  })}
                </div>
                {filteredUnassignedEmployees.length === 0 && (
                  <div className="text-center py-12">
                    <UserX size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">
                      No Unassigned Employees Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Try adjusting your search or department filter
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {filteredUnassignedEmployees.length} employees found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {selectedEmployeesForBulk.length} selected
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsUnassignedModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssignUnassigned}
                  disabled={selectedEmployeesForBulk.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
                >
                  <UserPlus size={16} /> Assign {selectedEmployeesForBulk.length} Employees
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK ASSIGN MODAL (Keep your existing modal) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E3B6F] to-[#4A457A] flex items-center justify-center text-white shadow-lg">
                    <UserPlus size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Bulk Assignment</h3>
                    <div className="flex items-center gap-2">
                       {[1, 2, 3].map(s => (
                         <div key={s} className={`h-1 rounded-full transition-all ${bulkStep >= s ? 'w-4 bg-[#3E3B6F]' : 'w-2 bg-gray-200'}`}></div>
                       ))}
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"><X size={24}/></button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               {bulkStep === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Step 1: Target Audience Selection</h4>
                    {selectedEmployeesForBulk.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-indigo-700">Pre-selected Employees</span>
                          <span className="text-lg font-black text-indigo-800">{selectedEmployeesForBulk.length}</span>
                        </div>
                        <p className="text-xs text-indigo-600">
                          You have {selectedEmployeesForBulk.length} employees selected from the unassigned list.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-6 rounded-2xl border-2 border-[#3E3B6F] bg-[#3E3B6F]/5 space-y-3">
                          <Building2 className="text-[#3E3B6F]" size={24} />
                          <h5 className="font-bold text-gray-800 text-sm">By Criteria</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Assign based on Department, Grade, or Location.</p>
                       </div>
                       <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all space-y-3 bg-white">
                          <Upload className="text-gray-400" size={24} />
                          <h5 className="font-bold text-gray-800 text-sm">CSV Import</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Upload a list of specific employee IDs.</p>
                       </div>
                    </div>
                    <div className="space-y-4 pt-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Filters</label>
                       <div className="grid grid-cols-2 gap-4">
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                             <option>Department: Engineering</option>
                             <option>Department: All</option>
                          </select>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                             <option>Grade: E1 - E5</option>
                             <option>Grade: All</option>
                          </select>
                       </div>
                       <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-700">Employees Matching Criteria:</span>
                          <span className="text-lg font-black text-indigo-800">142</span>
                       </div>
                    </div>
                 </div>
               )}

               {bulkStep === 2 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Step 2: Define Shift Parameters</h4>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Shift Template *</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Morning Shift (9 AM - 6 PM)</option>
                             <option>Evening Shift (2 PM - 11 PM)</option>
                             <option>General Flexi</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective From *</label>
                          <input type="date" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" defaultValue="2025-01-01" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Calendar *</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Standard 5-Day (Mon-Fri)</option>
                             <option>Six-Day Week (Mon-Sat)</option>
                             <option>Rotational Roster</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punch Policy</label>
                          <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                             <option>Enforce Site Geo-fence</option>
                             <option>Mobile Only</option>
                             <option>Biometric Required</option>
                          </select>
                       </div>
                    </div>
                 </div>
               )}

               {bulkStep === 3 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2 pb-6">
                       <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
                          <CheckCircle2 size={32} />
                       </div>
                       <h4 className="text-lg font-black text-gray-800 uppercase tracking-widest">Ready to Commit</h4>
                       <p className="text-xs font-medium text-gray-500">Please review the assignment summary before finalizing.</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                       <div className="p-4 flex justify-between items-center bg-white">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact Count</span>
                          <span className="text-sm font-black text-indigo-600">142 Employees</span>
                       </div>
                       <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Template</span>
                          <span className="text-sm font-bold text-gray-800">Morning Shift</span>
                       </div>
                       <div className="p-4 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date</span>
                          <span className="text-sm font-bold text-gray-800">Jan 01, 2025</span>
                       </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                       <ShieldCheck className="text-amber-500 shrink-0" size={18} />
                       <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                         <span className="font-black">Notice:</span> This action will overwrite any existing shift assignments for the selected 142 employees starting from the effective date. This can be reverted via Version History.
                       </p>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               {bulkStep > 1 && (
                 <button onClick={() => setBulkStep(bulkStep - 1)} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                   Back
                 </button>
               )}
               <button 
                 onClick={() => {
                   if (bulkStep < 3) setBulkStep(bulkStep + 1);
                   else {
                     alert(`Bulk assignment completed for ${selectedEmployeesForBulk.length > 0 ? selectedEmployeesForBulk.length : 142} employees!`);
                     setIsBulkModalOpen(false);
                     setSelectedEmployeesForBulk([]);
                   }
                 }}
                 className="flex-1 py-3 bg-[#3E3B6F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {bulkStep === 3 ? 'Confirm & Process' : 'Next Step'} <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL ASSIGNMENT MODAL */}
      {isIndividualModalOpen && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Assign Shift</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Select multiple employees and shift templates
            </p>
          </div>
        </div>
        <button onClick={() => setIsIndividualModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
        {/* EMPLOYEE SELECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} /> Select Employees
            </h4>
            <button
              type="button"
              onClick={() => {
                // Select all unassigned employees
                const allUnassigned = MOCK_EMPLOYEES.filter(emp => {
                  const assignedEmployeeIds = MOCK_ASSIGNMENTS
                    .filter(a => a.status === 'ACTIVE' || a.status === 'PENDING')
                    .map(a => a.employeeId);
                  return !assignedEmployeeIds.includes(emp.employeeId);
                }).map(emp => emp.id);
                setSelectedEmployeeIds(selectedEmployeeIds.length === allUnassigned.length ? [] : allUnassigned);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-all"
            >
              {selectedEmployeeIds.length === MOCK_EMPLOYEES.filter(emp => {
                const assignedEmployeeIds = MOCK_ASSIGNMENTS
                  .filter(a => a.status === 'ACTIVE' || a.status === 'PENDING')
                  .map(a => a.employeeId);
                return !assignedEmployeeIds.includes(emp.employeeId);
              }).length ? 'Deselect All' : 'Select All Unassigned'}
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
            <input
              type="text"
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              placeholder="Search employees by name, ID, or department..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-gray-100">
                {filteredEmployees.map(employee => {
                  const isAssigned = MOCK_ASSIGNMENTS
                    .filter(a => a.status === 'ACTIVE' || a.status === 'PENDING')
                    .some(a => a.employeeId === employee.employeeId);
                  const isSelected = selectedEmployeeIds.includes(employee.id);
                  
                  return (
                    <div
                      key={employee.id}
                      className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-50'
                      } ${isAssigned ? 'opacity-60' : ''}`}
                      onClick={() => {
                        if (!isAssigned) {
                          if (isSelected) {
                            setSelectedEmployeeIds(prev => prev.filter(id => id !== employee.id));
                          } else {
                            setSelectedEmployeeIds(prev => [...prev, employee.id]);
                          }
                        }
                      }}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300'
                      } ${isAssigned ? 'cursor-not-allowed' : ''}`}>
                        {isSelected && <Check size={12} />}
                      </div>
                      
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-xs font-bold text-blue-600">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-800">{employee.name}</p>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {employee.employeeId}
                            </span>
                            {isAssigned && (
                              <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                                Already Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{employee.department} • {employee.position}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end text-right">
                        <span className="text-xs font-medium text-gray-500">{employee.location}</span>
                        <span className="text-[10px] text-gray-400">{employee.grade}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {selectedEmployeeIds.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-700">Selected Employees:</span>
                <span className="text-lg font-black text-blue-800">{selectedEmployeeIds.length}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEmployeeIds.slice(0, 3).map(empId => {
                  const emp = MOCK_EMPLOYEES.find(e => e.id === empId);
                  if (!emp) return null;
                  return (
                    <span key={empId} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-600 text-xs font-bold rounded-lg border border-blue-200">
                      {emp.name.split(' ')[0]}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeIds(prev => prev.filter(id => id !== empId));
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
                {selectedEmployeeIds.length > 3 && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                    +{selectedEmployeeIds.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SHIFT TEMPLATE SELECTION */}
   
        {/* ASSIGNMENT PARAMETERS */}
        <div className="space-y-6">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <CalendarDays size={16} /> Assignment Parameters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Effective From *
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="date" 
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Work Calendar *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                  value={workCalendar}
                  onChange={(e) => setWorkCalendar(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none appearance-none"
                >
                  <option value="">Select Calendar</option>
                  <option value="Standard 5-Day (Mon-Fri)">Standard 5-Day (Mon-Fri)</option>
                  <option value="Six-Day Week (Mon-Sat)">Six-Day Week (Mon-Sat)</option>
                  <option value="Creative Flex">Creative Flex</option>
                  <option value="Ramadan Calendar">Ramadan Calendar</option>
                  <option value="Rotational Roster">Rotational Roster</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Notes (Optional)
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-blue-500/5 outline-none"
              placeholder="Add any special instructions or notes for these assignments..."
              maxLength={500}
            />
            <p className="text-[10px] text-gray-400 text-right">{notes.length}/500</p>
          </div>
        </div>

        {/* SUMMARY */}
        {(selectedEmployeeIds.length > 0 || selectedTemplateIds.length > 0) && (
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <h5 className="text-xs font-bold text-gray-700 mb-3">Assignment Summary</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-lg font-black text-blue-600">{selectedEmployeeIds.length}</p>
                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Employees</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-lg font-black text-purple-600">{selectedTemplateIds.length}</p>
                <p className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">Templates</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-lg font-black text-green-600">{selectedEmployeeIds.length * selectedTemplateIds.length}</p>
                <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Total Assignments</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
        <button 
          onClick={() => {
            setIsIndividualModalOpen(false);
            setSelectedEmployeeIds([]);
            setSelectedTemplateIds([]);
            setEffectiveFrom('');
            setWorkCalendar('');
            setNotes('');
            setEmployeeSearch('');
          }}
          className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:shadow-lg transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={() => {
            if (selectedEmployeeIds.length === 0) {
              alert('Please select at least one employee');
              return;
            }
            if (selectedTemplateIds.length === 0) {
              alert('Please select at least one shift template');
              return;
            }
            if (!effectiveFrom) {
              alert('Please select an effective date');
              return;
            }
            if (!workCalendar) {
              alert('Please select a work calendar');
              return;
            }
            
            const totalAssignments = selectedEmployeeIds.length * selectedTemplateIds.length;
            alert(`Created ${totalAssignments} shift assignments successfully!\n\n${selectedEmployeeIds.length} employees × ${selectedTemplateIds.length} templates = ${totalAssignments} assignments`);
            
            setIsIndividualModalOpen(false);
            setSelectedEmployeeIds([]);
            setSelectedTemplateIds([]);
            setEffectiveFrom('');
            setWorkCalendar('');
            setNotes('');
            setEmployeeSearch('');
          }}
          disabled={selectedEmployeeIds.length === 0 || selectedTemplateIds.length === 0 || !effectiveFrom || !workCalendar}
          className="flex-[2] py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Check size={16} /> Create {selectedEmployeeIds.length * selectedTemplateIds.length} Assignments
        </button>
      </div>
    </div>
  </div>
)}
      {/* SCHEDULE VIEW MODAL */}
      {isScheduleModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Shift Schedule</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {selectedAssignment.employeeName} • {selectedAssignment.templateName}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              {/* Schedule Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Effective Period</p>
                  <p className="text-sm font-bold text-gray-800">
                    {formatDate(selectedAssignment.effectiveFrom)}
                    {selectedAssignment.effectiveTo && ` - ${formatDate(selectedAssignment.effectiveTo)}`}
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Work Calendar</p>
                  <p className="text-sm font-bold text-gray-800">{selectedAssignment.workCalendar}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">Assignment Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${STATUS_CONFIG[selectedAssignment.status].color}`}>
                    {STATUS_CONFIG[selectedAssignment.status].label}
                  </span>
                </div>
              </div>

              {/* Monthly Calendar View */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">January 2025 Schedule</h4>
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-7 bg-gray-100">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="p-3 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <div key={day} className="bg-white p-3 min-h-[80px]">
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-bold ${[6, 7, 13, 14, 20, 21, 27, 28].includes(day) ? 'text-gray-400' : 'text-gray-800'}`}>
                            {day}
                          </span>
                          {day <= 5 && (
                            <span className="text-[8px] font-bold text-green-600 bg-green-100 px-1 rounded">Assigned</span>
                          )}
                        </div>
                        {day <= 5 && (
                          <div className="mt-2 text-[8px] font-medium text-gray-600">
                            <div className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded mb-1">9:00 AM - 6:00 PM</div>
                            <div className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded">1h Break</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
              <button 
                onClick={() => setIsScheduleModalOpen(false)}
                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:shadow-lg transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => handleSendNotification(selectedAssignment)}
                className="flex-[2] py-3.5 bg-gradient-to-r from-[#3E3B6F] to-[#4A457A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:shadow-2xl hover:shadow-[#3E3B6F]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Mail size={16} /> Send Schedule to Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};