

// Base Entity
export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// ------------------------------------------------------------------
// 1. Company Management
// ------------------------------------------------------------------
export interface Company extends Entity {
  name: string; // Required, Unique
  registrationNumber: string; // Required, Unique
  taxId?: string;
  domain?: string;
  logoUrl?: string;
  website?: string;
  sector?: string; // Industry Sector
  brandColor?: string; // Hex code
  
  // Contact Info
  addressLine1: string; // Required
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Settings
  fiscalYearStartMonth: number; // 1-12
  currency: string; // ISO Code e.g., 'USD'
  timezone?: string; // e.g. 'America/New_York'
  
  status: 'active' | 'inactive';

  // UI Helper for List View
  _count?: {
    divisions: number;
    departments: number;
    lines: number;
    employees: number;
    locations?: number;
    costCenters?: number;
  };
}

// ------------------------------------------------------------------
// 2. Organization Structure (Divisions, Departments, Lines)
// ------------------------------------------------------------------

// Division type in '../types'
// ../types
export type Division = {
 id: number;
 name: string;
 code: string;
 company_id: string; // Stays as string for Select component
 companyName?: string | null;
 region_id?: string | null;
 // status: string; <-- REMOVE THIS
 active?: boolean; // <-- ADD THIS BOOLEAN FIELD
 description?: string | null;
 headOfDivisionId?: number | null;
 createdAt?: string;
 updatedAt?: string;
};

// Also update DivisionStatus if you still use it for filtering:
export type DivisionStatus = "active" | "inactive" | "draft"; // Keep this if used for DataTable filtering


export type OrgUnitType = 'department' | 'sub-department' | 'line' | 'team';

export interface Department extends Entity {
  name: string;
  code: string; // e.g., "ENG-FE"
  type: OrgUnitType;
  
  // Hierarchy
  parentId: string | null; // For tree structure. Null = Top level department
  divisionId: string; // Link to Division
  
  // Management
  managerId?: string; // Line Manager / HOD
  costCenterId?: string; // Financial mapping
  
  // Extended Fields for Forms
  shortName?: string;
  category?: string; // e.g. 'Operational', 'Support', 'R&D'
  plannedHeadcount?: number; // Budgeted headcount for Lines

  // Stats (Computed)
  headcount: number; // Actual headcount
  
  status: 'active' | 'inactive' | 'archived';
}

// ------------------------------------------------------------------
// 3. Designation Directory & Reporting
// ------------------------------------------------------------------

export interface Grade extends Entity {
  name: string; // e.g., "Grade 10"
  code: string; // e.g., "G10"
  level: number; // Hierarchy level for sorting (1 is highest or lowest depending on policy)
  
  // Compensation Band
  currency: string;
  minBaseSalary: number;
  maxBaseSalary: number;
  
  status: 'active' | 'inactive';
}

export interface Designation extends Entity {
  title: string; // e.g., "Senior Software Engineer"
  code?: string;
  
  gradeId: string; // Link to Grade
  level: number; // Inherited from Grade or overridden
  
  departmentId?: string; // Optional: Link to specific department (Functional Area)
  
  // Reporting Chain Config
  // Defines who this designation typically reports to (Structural Reporting)
  reportsToDesignationId?: string | null; 
  
  description?: string;
  status: 'active' | 'inactive';

  _count?: {
    employees: number;
  };
}

// ------------------------------------------------------------------
// 4. Location Hierarchy & Geography
// ------------------------------------------------------------------

// Master Geography Data
export interface GeoCountry extends Entity {
  name: string;
  code: string; // ISO 2 or 3 char
  status: 'active' | 'inactive';
}

export interface GeoState extends Entity {
  name: string;
  code: string;
  countryId: string;
  status: 'active' | 'inactive';
}

export interface GeoCity extends Entity {
  name: string;
  code: string; // Optional internal code
  stateId: string;
  status: 'active' | 'inactive';
}

export type LocationType = 'headquarters' | 'regional_office' | 'branch' | 'warehouse' | 'remote_hub';

// Physical Office/Site
export interface Location extends Entity {
  name: string;
  code: string;
  type: LocationType;
  
  // Hierarchy
  parentId?: string; // e.g., Regional Office -> Branch
  
  // Address
  addressLine1: string;
  city: string;
  state: string;
  country: string; // ISO code
  timezone: string;
  
  isVirtual: boolean; // For remote hubs
  status: 'active' | 'inactive';
}

// Mapping Table: Which companies operate in which locations?
export interface CompanyLocation extends Entity {
  companyId: string;
  locationId: string;
  isPrimary: boolean; // Is this the HQ for this specific company?
}

// ------------------------------------------------------------------
// 5. Cost Centers
// ------------------------------------------------------------------

export interface CostCenter extends Entity {
  name: string;
  code: string; // GL Code
  
  managerId?: string; // Budget owner
  
  departmentId?: string; // Owner Department
  locationId?: string; // Linked Location
  
  validFrom: string;
  validTo?: string;
  
  status: 'active' | 'inactive' | 'frozen';
}

// ------------------------------------------------------------------
// 6. Audit Log
// ------------------------------------------------------------------

export type AuditAction = 'create' | 'update' | 'delete' | 'activate' | 'deactivate';

export interface AuditEntry {
  id: string;
  timestamp: string;
  entityType: string; // e.g. 'Company', 'Division'
  entityId: string;
  entityName: string;
  action: AuditAction;
  actor: {
    id: string;
    name: string;
  };
  details: string;
  changes?: Record<string, { from: any; to: any }>; // Simple diff
}

// ------------------------------------------------------------------
// 7. API Response Wrappers
// ------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}



export interface StatMetric {
  id: string;
  label: string;
  value: number | string;
  trend?: string;
  trendUp?: boolean;
  color?: 'default' | 'success' | 'warning' | 'error' | 'blue';
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target?: string;
  time: string;
  avatarUrl: string;
  type: 'onboard' | 'exit' | 'transfer' | 'doc' | 'generic';
}

export interface UpcomingEvent {
  id: string;
  type: 'joining' | 'exit';
  name: string;
  role: string;
  date: string;
  department: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  location: string;
  grade: string;
  manager?: string;
  status: 'Active' | 'On Leave' | 'Notice Period';
  tags: string[];
  email: string;
  avatar: string;
  joinDate: string;
}

export type FilterCategory = 'department' | 'location' | 'grade' | 'status' | 'tags' | 'designation';

export interface FilterState {
  department: string[];
  location: string[];
  grade: string[];
  status: string[];
  tags: string[];
  designation: string[];
}

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  isDefault?: boolean;
}

export interface Transfer {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  type: 'Department' | 'Location' | 'Role' | 'Promotion';
  from: string;
  to: string;
  initiator: string;
  requestDate: string;
  effectiveDate: string;
  status: 'Pending' | 'In Progress' | 'Approved' | 'Rejected';
}

export type ExitType = 'Resignation' | 'Termination' | 'Retirement' | 'Contract End';
export type ExitStatus = 'Requested' | 'Interview Scheduled' | 'Asset Recovery' | 'Final Settlement' | 'Completed' | 'Withdrawn';

export interface ChecklistItem {
  id: string;
  label: string;
  status: 'Pending' | 'Done' | 'Blocked';
  updatedBy?: string;
}

export interface DepartmentChecklist {
  id: string;
  department: 'IT' | 'Admin' | 'Finance' | 'HR';
  items: ChecklistItem[];
  status: 'Pending' | 'Approved';
  approver?: string;
}

export type ApprovalStage = 'Manager' | 'Department Clearance' | 'Final HR Approval' | 'Archived';

export interface ExitRequest {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  type: ExitType;
  reason: string;
  requestDate: string;
  lastWorkingDay: string;
  status: ExitStatus;
  interviewStatus?: 'Pending' | 'Scheduled' | 'Completed';
  assetsReturned?: boolean;
  
  // New fields for detailed view
  checklists?: DepartmentChecklist[];
  approvalStage?: ApprovalStage;
}

export interface DocVersion {
    version: string;
    date: string;
    user: string;
    size: string;
}

export interface EmployeeDocument {
    id: string;
    name: string;
    category: string;
    type: 'pdf' | 'jpg' | 'png' | 'docx' | 'xlsx';
    size: string;
    uploadDate: string;
    uploadedBy: string;
    versions: DocVersion[];
}


export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  ON_LEAVE = 'On Leave',
  REMOTE = 'Remote'
}

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
   CANCELLED = 'Cancelled'
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: AttendanceStatus;
  workHours: number;
}



export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  lateArrivals: number;
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled'
}

export enum LeaveType {
  ANNUAL = 'Annual Leave',
  SICK = 'Sick Leave',
  CASUAL = 'Casual Leave',
  MATERNITY = 'Maternity/Paternity',
  UNPAID = 'Unpaid Leave'
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: ApprovalStatus;
  appliedDate: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}
