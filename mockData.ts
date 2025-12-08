
import { Employee, ActivityItem, StatMetric, UpcomingEvent, Transfer, ExitRequest, DepartmentChecklist, EmployeeDocument } from './types';

export const DEPARTMENTS = ['Engineering', 'Product', 'Sales', 'Marketing', 'HR', 'Operations'];
export const LOCATIONS = ['New York', 'London', 'Berlin', 'Singapore', 'Remote'];
export const ROLES = ['Software Engineer', 'Product Manager', 'Designer', 'HR Specialist', 'Sales Lead', 'Director', 'VP'];
export const GRADES = ['L1', 'L2', 'L3', 'Senior', 'Lead', 'Principal', 'Manager', 'Director'];

export const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, (_, i) => {
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const idNum = 1000 + i;
    return {
      id: `id-${i}`,
      employeeId: `EMP-${2020 + Math.floor(Math.random() * 4)}-${idNum}`,
      name: `Employee ${i + 1}`,
      role: ROLES[Math.floor(Math.random() * ROLES.length)],
      department: dept,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      grade: GRADES[Math.floor(Math.random() * GRADES.length)],
      manager: `Manager ${Math.floor(Math.random() * 10) + 1}`,
      status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'On Leave' : 'Notice Period') : 'Active',
      tags: Math.random() > 0.7 ? ['High Performer'] : [],
      email: `employee.${i + 1}@flexi.com`,
      avatar: `https://picsum.photos/100/100?random=${i}`,
      joinDate: `202${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 11) + 1}-15`
    };
  });
};

export const generateTransfers = (count: number): Transfer[] => {
    const types: Transfer['type'][] = ['Department', 'Location', 'Role', 'Promotion'];
    const statuses: Transfer['status'][] = ['Pending', 'In Progress', 'Approved', 'Rejected'];
    
    return Array.from({ length: count }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
        
        let from = '', to = '';
        if (type === 'Department') {
            from = dept;
            to = DEPARTMENTS.filter(d => d !== dept)[Math.floor(Math.random() * (DEPARTMENTS.length - 1))];
        } else if (type === 'Location') {
            from = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            to = LOCATIONS.filter(l => l !== from)[Math.floor(Math.random() * (LOCATIONS.length - 1))];
        } else {
            from = 'Senior Associate';
            to = 'Team Lead';
        }

        return {
            id: `tr-${i}`,
            employeeId: `EMP-2023-${1000+i}`,
            name: `Employee ${i + 1}`,
            avatar: `https://picsum.photos/100/100?random=${i + 50}`,
            department: dept,
            type,
            from,
            to,
            initiator: `Manager ${Math.floor(Math.random() * 5) + 1}`,
            requestDate: `Oct ${Math.floor(Math.random() * 20) + 1}, 2023`,
            effectiveDate: `Nov 01, 2023`,
            status
        };
    });
};

const getMockChecklists = (): DepartmentChecklist[] => [
    {
        id: 'cl-it', department: 'IT', status: Math.random() > 0.5 ? 'Approved' : 'Pending',
        items: [
            { id: '1', label: 'Laptop Return', status: Math.random() > 0.5 ? 'Done' : 'Pending' },
            { id: '2', label: 'Email Deactivation', status: 'Pending' },
            { id: '3', label: 'Access Card Return', status: 'Done' }
        ]
    },
    {
        id: 'cl-admin', department: 'Admin', status: 'Pending',
        items: [
            { id: '4', label: 'ID Badge Return', status: 'Done' },
            { id: '5', label: 'Desk Clearance', status: 'Pending' }
        ]
    },
    {
        id: 'cl-finance', department: 'Finance', status: 'Pending',
        items: [
            { id: '6', label: 'Pending Dues Recovery', status: 'Pending' },
            { id: '7', label: 'Full & Final Calculation', status: 'Pending' }
        ]
    }
];

export const generateExitRequests = (count: number): ExitRequest[] => {
    const types: ExitRequest['type'][] = ['Resignation', 'Termination', 'Retirement', 'Contract End', 'Resignation', 'Resignation'];
    const statuses: ExitRequest['status'][] = ['Requested', 'Interview Scheduled', 'Asset Recovery', 'Final Settlement', 'Completed'];
    const reasons = ['Better Opportunity', 'Relocation', 'Higher Studies', 'Personal Reasons', 'Health Issues', 'Career Change'];

    return Array.from({ length: count }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
            id: `ex-${i}`,
            employeeId: `EMP-202${Math.floor(Math.random() * 3)}-${1000 + i}`,
            name: `Employee ${i + 50}`,
            avatar: `https://picsum.photos/100/100?random=${i + 100}`,
            role: ROLES[Math.floor(Math.random() * ROLES.length)],
            department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
            type,
            reason: type === 'Termination' ? 'Performance' : reasons[Math.floor(Math.random() * reasons.length)],
            requestDate: `Oct ${Math.floor(Math.random() * 10) + 1}, 2023`,
            lastWorkingDay: `Nov ${Math.floor(Math.random() * 28) + 1}, 2023`,
            status,
            interviewStatus: status === 'Requested' ? 'Pending' : 'Completed',
            assetsReturned: status === 'Completed' || status === 'Final Settlement',
            checklists: getMockChecklists(),
            approvalStage: status === 'Completed' ? 'Archived' : status === 'Final Settlement' ? 'Final HR Approval' : 'Department Clearance'
        };
    });
};

export const INITIAL_STATS: StatMetric[] = [
    { id: 'total', label: 'Total Employees', value: '1,248', trend: '+2.5%', trendUp: true, color: 'blue' },
    { id: 'active', label: 'Active Employees', value: '1,180', trend: '98%', trendUp: true, color: 'success' },
    { id: 'new', label: 'New Hires (Jan)', value: '24', trend: '+12%', trendUp: true, color: 'success' },
    { id: 'exits', label: 'Exits Pending', value: '12', trend: '-2%', trendUp: false, color: 'error' },
    { id: 'transfers', label: 'Transfers In-Prog', value: '5', color: 'warning' },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
    { id: '1', user: 'Sarah Jenkins', action: 'completed onboarding for', target: 'Mike Ross', time: '2 mins ago', avatarUrl: 'https://picsum.photos/100/100?random=1', type: 'onboard' },
    { id: '2', user: 'System', action: 'processed monthly payroll', time: '1 hour ago', avatarUrl: 'https://picsum.photos/100/100?random=2', type: 'generic' },
    { id: '3', user: 'David Chen', action: 'submitted resignation', time: '3 hours ago', avatarUrl: 'https://picsum.photos/100/100?random=3', type: 'exit' },
    { id: '4', user: 'Emily Davis', action: 'updated document', target: 'Policy_2024_v2.pdf', time: '5 hours ago', avatarUrl: 'https://picsum.photos/100/100?random=4', type: 'doc' },
    { id: '5', user: 'Michael Scott', action: 'initiated transfer for', target: 'Dwight S.', time: 'Yesterday', avatarUrl: 'https://picsum.photos/100/100?random=5', type: 'transfer' },
];

export const INITIAL_UPCOMING_EVENTS: UpcomingEvent[] = [
    { id: '1', type: 'joining', name: 'Alice Cooper', role: 'UX Designer', department: 'Product', date: 'Oct 24' },
    { id: '2', type: 'joining', name: 'Bob Vance', role: 'Sales Lead', department: 'Sales', date: 'Oct 25' },
    { id: '3', type: 'exit', name: 'Carol Danvers', role: 'Engineer', department: 'Engineering', date: 'Oct 28' },
    { id: '4', type: 'joining', name: 'Dave Batista', role: 'Security', department: 'Ops', date: 'Nov 01' },
];

export const DOCUMENTS_DATA: EmployeeDocument[] = [
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