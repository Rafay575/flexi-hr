

import { 
  Company, 
  Department, 
  Designation, 
  Grade, 
  Location, 
  CostCenter, 
  Division,
  GeoCountry,
  GeoState,
  GeoCity,
  CompanyLocation,
  ApiResponse,
  AuditEntry,
  AuditAction
} from '../types';

// Utils
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substring(2, 9);
const now = () => new Date().toISOString();

// ------------------------------------------------------------------
// MOCK DATABASE
// ------------------------------------------------------------------

const mockActors = [
  { id: 'u1', name: 'Admin User' },
  { id: 'u2', name: 'Sarah Jenkins' },
  { id: 'u3', name: 'Mike Ross' },
  { id: 'sys', name: 'System Automation' }
];

// Helper to generate some initial history
const generateHistory = (): AuditEntry[] => {
  const actions: AuditAction[] = ['create', 'update', 'delete', 'activate', 'deactivate'];
  const entities = ['Company', 'Department', 'Employee', 'Location', 'Grade'];
  const history: AuditEntry[] = [];
  
  const today = new Date();

  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const actor = mockActors[Math.floor(Math.random() * mockActors.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const type = entities[Math.floor(Math.random() * entities.length)];

    history.push({
      id: `hist-${i}`,
      timestamp: date.toISOString(),
      entityType: type,
      entityId: `ent-${i}`,
      entityName: `${type} ${100 + i}`,
      action,
      actor: { id: actor.id, name: actor.name },
      details: `${action.charAt(0).toUpperCase() + action.slice(1)}d ${type} record via system interface`,
      changes: action === 'update' ? { status: { from: 'inactive', to: 'active' } } : undefined
    });
  }
  
  return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

let db = {
  companies: [
    {
      id: 'c1',
      name: 'Flexi Global Inc.',
      registrationNumber: 'US-DEL-99283',
      taxId: '99-238472',
      domain: 'flexi.global',
      sector: 'Technology',
      addressLine1: '400 Market Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94111',
      fiscalYearStartMonth: 1,
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      brandColor: '#0ea5e9',
      status: 'active',
      createdAt: now(),
      updatedAt: now()
    },
    {
      id: 'c2',
      name: 'Flexi Europe GmbH',
      registrationNumber: 'DE-HRB-55421',
      taxId: 'DE882910',
      domain: 'flexi.eu',
      sector: 'Technology',
      addressLine1: 'Torstrasse 12',
      city: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      postalCode: '10119',
      fiscalYearStartMonth: 1,
      currency: 'EUR',
      timezone: 'Europe/Berlin',
      brandColor: '#6366f1',
      status: 'active',
      createdAt: now(),
      updatedAt: now()
    }
  ] as Company[],

  divisions: [
    { id: 'div1', companyId: 'c1', name: 'Technology & Product', code: 'TECH', region: 'Global', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'div2', companyId: 'c1', name: 'Sales & Marketing', code: 'GTM', region: 'North America', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'div3', companyId: 'c1', name: 'Corporate Functions', code: 'CORP', region: 'Global', status: 'active', createdAt: now(), updatedAt: now() },
    // EU Divisions
    { id: 'div4', companyId: 'c2', name: 'EU Operations', code: 'EU-OPS', region: 'EMEA', status: 'active', createdAt: now(), updatedAt: now() },
  ] as Division[],

  departments: [
    // Tech Division (c1)
    { id: 'd1', name: 'Engineering', code: 'ENG', type: 'department', parentId: null, divisionId: 'div1', headcount: 120, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'd2', name: 'Product Management', code: 'PM', type: 'department', parentId: null, divisionId: 'div1', headcount: 15, status: 'active', createdAt: now(), updatedAt: now() },
    
    // Engineering Sub-depts / Lines
    { id: 'd3', name: 'Frontend', code: 'ENG-FE', type: 'line', parentId: 'd1', divisionId: 'div1', headcount: 40, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'd4', name: 'Backend Services', code: 'ENG-BE', type: 'line', parentId: 'd1', divisionId: 'div1', headcount: 45, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'd5', name: 'DevOps', code: 'ENG-OPS', type: 'team', parentId: 'd1', divisionId: 'div1', headcount: 10, status: 'active', createdAt: now(), updatedAt: now() },

    // Corporate (c1)
    { id: 'd6', name: 'People & Culture', code: 'HR', type: 'department', parentId: null, divisionId: 'div3', headcount: 8, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'd7', name: 'Finance', code: 'FIN', type: 'department', parentId: null, divisionId: 'div3', headcount: 12, status: 'active', createdAt: now(), updatedAt: now() },
    
    // EU Ops (c2)
    { id: 'd8', name: 'Sales EU', code: 'EU-SALES', type: 'department', parentId: null, divisionId: 'div4', headcount: 25, status: 'active', createdAt: now(), updatedAt: now() },
  ] as Department[],

  grades: [
    { id: 'g1', name: 'Executive', code: 'E1', level: 10, currency: 'USD', minBaseSalary: 200000, maxBaseSalary: 400000, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'g2', name: 'Director', code: 'D1', level: 9, currency: 'USD', minBaseSalary: 160000, maxBaseSalary: 240000, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'g3', name: 'Senior Management', code: 'M2', level: 8, currency: 'USD', minBaseSalary: 140000, maxBaseSalary: 190000, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'g4', name: 'Management', code: 'M1', level: 7, currency: 'USD', minBaseSalary: 110000, maxBaseSalary: 160000, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'g5', name: 'Senior Professional', code: 'P3', level: 6, currency: 'USD', minBaseSalary: 100000, maxBaseSalary: 150000, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'g6', name: 'Professional', code: 'P2', level: 5, currency: 'USD', minBaseSalary: 80000, maxBaseSalary: 120000, status: 'active', createdAt: now(), updatedAt: now() },
  ] as Grade[],

  designations: [
    { id: 'des1', title: 'Chief Executive Officer', code: 'CEO', gradeId: 'g1', level: 10, reportsToDesignationId: null, status: 'active', createdAt: now(), updatedAt: now(), _count: { employees: 1 } },
    { id: 'des2', title: 'Chief Technology Officer', code: 'CTO', gradeId: 'g1', level: 10, reportsToDesignationId: 'des1', status: 'active', createdAt: now(), updatedAt: now(), _count: { employees: 1 } },
    { id: 'des3', title: 'VP of Engineering', code: 'VPE', gradeId: 'g2', level: 9, reportsToDesignationId: 'des2', status: 'active', departmentId: 'd1', createdAt: now(), updatedAt: now(), _count: { employees: 2 } },
    { id: 'des4', title: 'Engineering Manager', code: 'EM', gradeId: 'g4', level: 7, reportsToDesignationId: 'des3', status: 'active', departmentId: 'd1', createdAt: now(), updatedAt: now(), _count: { employees: 8 } },
    { id: 'des5', title: 'Senior Software Engineer', code: 'SSE', gradeId: 'g5', level: 6, reportsToDesignationId: 'des4', status: 'active', departmentId: 'd3', createdAt: now(), updatedAt: now(), _count: { employees: 25 } },
    { id: 'des6', title: 'Software Engineer', code: 'SE', gradeId: 'g6', level: 5, reportsToDesignationId: 'des4', status: 'active', departmentId: 'd3', createdAt: now(), updatedAt: now(), _count: { employees: 40 } },
  ] as Designation[],

  // Geography
  countries: [
    { id: 'us', name: 'United States', code: 'USA', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'de', name: 'Germany', code: 'DEU', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'in', name: 'India', code: 'IND', status: 'active', createdAt: now(), updatedAt: now() },
  ] as GeoCountry[],

  states: [
    { id: 'us-ca', name: 'California', code: 'CA', countryId: 'us', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'us-ny', name: 'New York', code: 'NY', countryId: 'us', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'de-be', name: 'Berlin', code: 'BE', countryId: 'de', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'in-ka', name: 'Karnataka', code: 'KA', countryId: 'in', status: 'active', createdAt: now(), updatedAt: now() },
  ] as GeoState[],

  cities: [
    { id: 'us-sf', name: 'San Francisco', code: 'SFO', stateId: 'us-ca', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'us-la', name: 'Los Angeles', code: 'LAX', stateId: 'us-ca', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'us-nyc', name: 'New York City', code: 'NYC', stateId: 'us-ny', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'de-ber', name: 'Berlin', code: 'BER', stateId: 'de-be', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'in-blr', name: 'Bengaluru', code: 'BLR', stateId: 'in-ka', status: 'active', createdAt: now(), updatedAt: now() },
  ] as GeoCity[],

  locations: [
    { id: 'l1', name: 'SF HQ', code: 'US-SF', type: 'headquarters', addressLine1: '400 Market St', city: 'San Francisco', state: 'CA', country: 'USA', timezone: 'America/Los_Angeles', isVirtual: false, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'l2', name: 'Berlin Hub', code: 'DE-BER', type: 'regional_office', addressLine1: 'Torstrasse 12', city: 'Berlin', state: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', isVirtual: false, status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'l3', name: 'Remote US', code: 'US-REM', type: 'remote_hub', addressLine1: 'N/A', city: 'N/A', state: 'N/A', country: 'USA', timezone: 'America/New_York', isVirtual: true, status: 'active', createdAt: now(), updatedAt: now() }
  ] as Location[],

  companyLocations: [
    { id: 'cl1', companyId: 'c1', locationId: 'l1', isPrimary: true, createdAt: now(), updatedAt: now() },
    { id: 'cl2', companyId: 'c1', locationId: 'l2', isPrimary: false, createdAt: now(), updatedAt: now() },
    { id: 'cl3', companyId: 'c2', locationId: 'l2', isPrimary: true, createdAt: now(), updatedAt: now() },
  ] as CompanyLocation[],

  costCenters: [
    { id: 'cc1', name: 'Engineering - R&D', code: 'CC-1001', departmentId: 'd1', locationId: 'l1', validFrom: '2023-01-01', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'cc2', name: 'Sales - North America', code: 'CC-2001', departmentId: 'd2', locationId: 'l1', validFrom: '2023-01-01', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'cc3', name: 'Corporate HQ', code: 'CC-0001', departmentId: 'd7', locationId: 'l1', validFrom: '2023-01-01', status: 'active', createdAt: now(), updatedAt: now() }
  ] as CostCenter[],

  auditLogs: generateHistory() as AuditEntry[]
};

// ------------------------------------------------------------------
// INTERNAL LOGGING UTILS
// ------------------------------------------------------------------

const logAudit = (
  entityType: string, 
  entityId: string, 
  entityName: string, 
  action: AuditAction, 
  changes?: Record<string, { from: any, to: any }>
) => {
  // Randomly select an actor to simulate real usage
  const actor = mockActors[Math.floor(Math.random() * mockActors.length)];

  const entry: AuditEntry = {
    id: generateId(),
    timestamp: now(),
    entityType,
    entityId,
    entityName,
    action,
    actor: { id: actor.id, name: actor.name }, 
    details: `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType}: ${entityName}`,
    changes
  };
  // Prepend to show latest first
  db.auditLogs.unshift(entry);
};

// Helper to calc diff
const getDiff = (oldObj: any, newObj: any) => {
  const changes: Record<string, { from: any, to: any }> = {};
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  
  allKeys.forEach(key => {
    if (key === 'updatedAt' || key === 'createdAt' || key === 'id') return;
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      changes[key] = { from: oldObj[key], to: newObj[key] };
    }
  });
  
  return Object.keys(changes).length > 0 ? changes : undefined;
};

// ------------------------------------------------------------------
// SERVICE LAYER (Simulating REST API)
// ------------------------------------------------------------------

export const api = {
  // --- Audit ---
  getAuditLogs: async (filters?: { entityId?: string; entityType?: string }): Promise<AuditEntry[]> => {
    await delay(300);
    let logs = db.auditLogs;
    if (filters?.entityId) {
      logs = logs.filter(l => l.entityId === filters.entityId);
    }
    if (filters?.entityType) {
      logs = logs.filter(l => l.entityType === filters.entityType);
    }
    return logs;
  },

  // --- Companies ---
  getCompanies: async (): Promise<Company[]> => {
    await delay(600);
    // Enrich with stats
    return db.companies.map(c => {
      const companyDivisions = db.divisions.filter(d => d.companyId === c.id);
      const divisionIds = companyDivisions.map(d => d.id);
      const companyDepts = db.departments.filter(dept => divisionIds.includes(dept.divisionId));
      
      const employeeCount = companyDepts.reduce((sum, d) => sum + d.headcount, 0);

      return {
        ...c,
        _count: {
          divisions: companyDivisions.length,
          departments: companyDepts.filter(d => d.type === 'department').length,
          lines: companyDepts.filter(d => d.type !== 'department').length,
          employees: employeeCount
        }
      };
    });
  },

  getCompany: async (id: string): Promise<Company | undefined> => {
    await delay(300);
    const company = db.companies.find(c => c.id === id);
    if (!company) return undefined;

    // Calculate granular stats for detail view
    const companyDivisions = db.divisions.filter(d => d.companyId === id);
    const divisionIds = companyDivisions.map(d => d.id);
    const allCompanyUnits = db.departments.filter(dept => divisionIds.includes(dept.divisionId));
    
    const departments = allCompanyUnits.filter(d => d.type === 'department');
    const lines = allCompanyUnits.filter(d => d.type !== 'department');
    const employeeCount = allCompanyUnits.reduce((sum, d) => sum + d.headcount, 0);

    const compLocs = db.companyLocations.filter(cl => cl.companyId === id);

    return {
      ...company,
      _count: {
        divisions: companyDivisions.length,
        departments: departments.length,
        lines: lines.length,
        employees: employeeCount,
        locations: compLocs.length, 
        costCenters: 4 // Mocked for now
      }
    };
  },

  addCompany: async (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> => {
    await delay(800);
    const newCompany: Company = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.companies.push(newCompany);
    logAudit('Company', newCompany.id, newCompany.name, 'create');
    return newCompany;
  },

  updateCompany: async (id: string, updates: Partial<Company>): Promise<Company> => {
    await delay(500);
    const index = db.companies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    
    const oldData = { ...db.companies[index] };
    const newData = { ...db.companies[index], ...updates, updatedAt: now() };
    db.companies[index] = newData;

    // Determine Action
    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }

    logAudit('Company', id, newData.name, action, getDiff(oldData, newData));
    return newData;
  },

  // --- Divisions ---
  getDivisions: async (): Promise<Division[]> => {
    await delay(400);
    return [...db.divisions];
  },
  
  getDivisionsByCompany: async (companyId: string): Promise<Division[]> => {
    await delay(300);
    return db.divisions.filter(d => d.companyId === companyId);
  },

  addDivision: async (data: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Promise<Division> => {
    await delay(500);
    const newDiv: Division = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.divisions.push(newDiv);
    logAudit('Division', newDiv.id, newDiv.name, 'create');
    return newDiv;
  },

  updateDivision: async (id: string, updates: Partial<Division>): Promise<Division> => {
    await delay(400);
    const index = db.divisions.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Division not found');
    
    // Guard
    if (updates.status === 'inactive' && db.divisions[index].status === 'active') {
      const hasDepts = db.departments.some(dept => dept.divisionId === id && dept.status === 'active');
      if (hasDepts) {
        throw new Error('Cannot deactivate division with active departments. Please reassign or archive departments first.');
      }
    }

    const oldData = { ...db.divisions[index] };
    const newData = { ...db.divisions[index], ...updates, updatedAt: now() };
    db.divisions[index] = newData;

    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }

    logAudit('Division', id, newData.name, action, getDiff(oldData, newData));
    return newData;
  },

  // --- Departments ---
  getDepartments: async (): Promise<Department[]> => {
    await delay(500);
    return [...db.departments];
  },

  addDepartment: async (data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    await delay(600);
    // Validation: Check if parent exists if provided
    if (data.parentId && !db.departments.find(d => d.id === data.parentId)) {
      throw new Error("Parent department does not exist");
    }
    
    const newDept: Department = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.departments.push(newDept);
    logAudit('Department', newDept.id, newDept.name, 'create');
    return newDept;
  },

  updateDepartment: async (id: string, updates: Partial<Department>): Promise<Department> => {
    await delay(500);
    const index = db.departments.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Department not found');

    const oldData = { ...db.departments[index] };
    const newData = { ...db.departments[index], ...updates, updatedAt: now() };
    db.departments[index] = newData;

    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }

    logAudit('Department', id, newData.name, action, getDiff(oldData, newData));
    return newData;
  },

  deleteDepartment: async (id: string): Promise<boolean> => {
    await delay(600);
    const dept = db.departments.find(d => d.id === id);
    if (!dept) throw new Error("Department not found");

    // Guard: Cannot delete if has children
    const hasChildren = db.departments.some(d => d.parentId === id);
    if (hasChildren) throw new Error("Cannot delete department with child units. Remove children first.");
    
    // Guard: Check for employees (Mock check)
    if (dept.headcount > 0) {
      throw new Error("Cannot delete department with active employees.");
    }

    db.departments = db.departments.filter(d => d.id !== id);
    logAudit('Department', id, dept.name, 'delete');
    return true;
  },

  // --- Designations ---
  getDesignations: async (): Promise<Designation[]> => {
    await delay(400);
    return [...db.designations];
  },

  addDesignation: async (data: Omit<Designation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Designation> => {
    await delay(500);
    const newDesg: Designation = { 
      ...data, 
      id: generateId(), 
      createdAt: now(), 
      updatedAt: now(),
      _count: { employees: 0 } 
    };
    db.designations.push(newDesg);
    logAudit('Designation', newDesg.id, newDesg.title, 'create');
    return newDesg;
  },

  updateDesignation: async (id: string, updates: Partial<Designation>): Promise<Designation> => {
    await delay(400);
    const index = db.designations.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Designation not found');

    // Guard: If deactivating, check for active employees
    if (updates.status === 'inactive' && db.designations[index].status === 'active') {
      const activeEmployees = db.designations[index]._count?.employees || 0;
      if (activeEmployees > 0) {
        throw new Error(`Cannot deactivate designation. It is currently assigned to ${activeEmployees} employees.`);
      }
    }

    const oldData = { ...db.designations[index] };
    const newData = { ...db.designations[index], ...updates, updatedAt: now() };
    db.designations[index] = newData;

    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }

    logAudit('Designation', id, newData.title, action, getDiff(oldData, newData));
    return newData;
  },

  // --- Grades ---
  getGrades: async (): Promise<Grade[]> => {
    await delay(300);
    return [...db.grades];
  },

  addGrade: async (data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Grade> => {
    await delay(500);
    const newGrade: Grade = {
      ...data,
      id: generateId(),
      createdAt: now(),
      updatedAt: now()
    };
    db.grades.push(newGrade);
    logAudit('Grade', newGrade.id, newGrade.name, 'create');
    return newGrade;
  },

  updateGrade: async (id: string, updates: Partial<Grade>): Promise<Grade> => {
    await delay(400);
    const index = db.grades.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Grade not found');

    // Guard: If deactivating, check if used by any active Designation
    if (updates.status === 'inactive' && db.grades[index].status === 'active') {
      const activeUsage = db.designations.filter(d => d.gradeId === id && d.status === 'active');
      if (activeUsage.length > 0) {
        throw new Error(`Cannot deactivate grade. It is currently used by ${activeUsage.length} active designations.`);
      }
    }

    const oldData = { ...db.grades[index] };
    const newData = { ...db.grades[index], ...updates, updatedAt: now() };
    db.grades[index] = newData;

    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }

    logAudit('Grade', id, newData.name, action, getDiff(oldData, newData));
    return newData;
  },

  // --- Geography & Locations ---
  
  getCountries: async (): Promise<GeoCountry[]> => {
    await delay(300);
    return [...db.countries];
  },

  addCountry: async (data: Omit<GeoCountry, 'id' | 'createdAt' | 'updatedAt'>): Promise<GeoCountry> => {
    await delay(400);
    const newItem = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.countries.push(newItem);
    logAudit('Country', newItem.id, newItem.name, 'create');
    return newItem;
  },

  deleteCountry: async (id: string): Promise<boolean> => {
    await delay(400);
    const country = db.countries.find(c => c.id === id);
    if (!country) throw new Error('Country not found');

    const hasChildren = db.states.some(s => s.countryId === id);
    if (hasChildren) throw new Error("Cannot delete country with associated states.");
    
    db.countries = db.countries.filter(x => x.id !== id);
    logAudit('Country', id, country.name, 'delete');
    return true;
  },

  getStates: async (countryId: string): Promise<GeoState[]> => {
    await delay(300);
    return db.states.filter(s => s.countryId === countryId);
  },

  addState: async (data: Omit<GeoState, 'id' | 'createdAt' | 'updatedAt'>): Promise<GeoState> => {
    await delay(400);
    const newItem = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.states.push(newItem);
    logAudit('State', newItem.id, newItem.name, 'create');
    return newItem;
  },

  deleteState: async (id: string): Promise<boolean> => {
    await delay(400);
    const state = db.states.find(s => s.id === id);
    if (!state) throw new Error('State not found');

    const hasChildren = db.cities.some(c => c.stateId === id);
    if (hasChildren) throw new Error("Cannot delete state with associated cities.");
    
    db.states = db.states.filter(x => x.id !== id);
    logAudit('State', id, state.name, 'delete');
    return true;
  },

  getCities: async (stateId: string): Promise<GeoCity[]> => {
    await delay(300);
    return db.cities.filter(c => c.stateId === stateId);
  },

  addCity: async (data: Omit<GeoCity, 'id' | 'createdAt' | 'updatedAt'>): Promise<GeoCity> => {
    await delay(400);
    const newItem = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.cities.push(newItem);
    logAudit('City', newItem.id, newItem.name, 'create');
    return newItem;
  },

  deleteCity: async (id: string): Promise<boolean> => {
    await delay(400);
    const city = db.cities.find(c => c.id === id);
    if (!city) throw new Error('City not found');
    
    db.cities = db.cities.filter(x => x.id !== id);
    logAudit('City', id, city.name, 'delete');
    return true;
  },

  getLocations: async (): Promise<Location[]> => {
    await delay(400);
    return [...db.locations];
  },

  addLocation: async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
    await delay(500);
    const newItem = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.locations.push(newItem);
    logAudit('Location', newItem.id, newItem.name, 'create');
    return newItem;
  },

  updateLocation: async (id: string, updates: Partial<Location>): Promise<Location> => {
    await delay(400);
    const index = db.locations.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Location not found');
    
    const oldData = { ...db.locations[index] };
    const newData = { ...db.locations[index], ...updates, updatedAt: now() };
    db.locations[index] = newData;

    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }

    logAudit('Location', id, newData.name, action, getDiff(oldData, newData));
    return newData;
  },

  deleteLocation: async (id: string): Promise<boolean> => {
    await delay(500);
    const loc = db.locations.find(l => l.id === id);
    if (!loc) throw new Error('Location not found');

    // Guard: Check usage in company mapping
    const inUse = db.companyLocations.some(cl => cl.locationId === id);
    if (inUse) throw new Error("Cannot delete location assigned to companies.");
    
    db.locations = db.locations.filter(l => l.id !== id);
    logAudit('Location', id, loc.name, 'delete');
    return true;
  },

  // --- Company Location Mapping ---

  getCompanyLocations: async (companyId: string): Promise<Array<CompanyLocation & { location: Location }>> => {
    await delay(400);
    const mappings = db.companyLocations.filter(cl => cl.companyId === companyId);
    return mappings.map(cl => {
      const location = db.locations.find(l => l.id === cl.locationId);
      if (!location) throw new Error("Data integrity error");
      return { ...cl, location };
    });
  },

  // --- Cost Centers ---
  getCostCenters: async (): Promise<CostCenter[]> => {
    await delay(300);
    return [...db.costCenters];
  },

  addCostCenter: async (data: Omit<CostCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<CostCenter> => {
    await delay(400);
    // Validation: Unique Code
    const exists = db.costCenters.some(cc => cc.code === data.code);
    if (exists) throw new Error(`Cost Center code '${data.code}' already exists.`);

    const newItem = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
    db.costCenters.push(newItem);
    logAudit('CostCenter', newItem.id, newItem.name, 'create');
    return newItem;
  },

  updateCostCenter: async (id: string, updates: Partial<CostCenter>): Promise<CostCenter> => {
    await delay(400);
    const index = db.costCenters.findIndex(cc => cc.id === id);
    if (index === -1) throw new Error('Cost Center not found');

    // Validation: Unique Code (exclude self)
    if (updates.code) {
      const exists = db.costCenters.some(cc => cc.code === updates.code && cc.id !== id);
      if (exists) throw new Error(`Cost Center code '${updates.code}' already exists.`);
    }

    const oldData = { ...db.costCenters[index] };
    const newData = { ...db.costCenters[index], ...updates, updatedAt: now() };
    db.costCenters[index] = newData;

    let action: AuditAction = 'update';
    if (updates.status && updates.status !== oldData.status) {
      action = updates.status === 'active' ? 'activate' : 'deactivate';
    }
    
    logAudit('CostCenter', id, newData.name, action, getDiff(oldData, newData));
    return newData;
  }
};