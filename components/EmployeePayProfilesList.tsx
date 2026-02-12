
import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, ShieldAlert, 
  Landmark, CheckCircle2,
  Users, Layers, Download, UserPlus,
  AlertTriangle, Settings2, Eye
} from 'lucide-react';
import { PayrollStatus } from '../types';
import { EmployeePayProfileForm } from './EmployeePayProfileForm';
import { TemplateAssignmentModal } from './TemplateAssignmentModal';

interface EmployeeProfile {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  grade: string;
  template: string | null;
  gross: number;
  overridesCount: number;
  bankInfo: boolean;
  statutoryInfo: boolean;
  status: string;
}



const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;
// Mock payroll templates with different structures for various employee categories
export const MOCK_TEMPLATES = [
  {
    id: 'TMP-001',
    name: 'ENG-SR-18',
    code: 'ENG-SR-18',
    description: 'Senior Engineering Staff - Grade G18 (Development Team)',
    type: 'STANDARD' as const,
    category: 'GRADE' as const,
    applicableTo: ['G18'],
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Basic Salary', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 50, 
        isTaxable: true, 
        isStatutory: true, 
        order: 1,
        formula: 'base * 0.5',
        remarks: 'Core salary component'
      },
      { 
        id: 'comp-2', 
        name: 'House Rent Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 40, 
        isTaxable: true, 
        isStatutory: false, 
        order: 2,
        formula: 'base * 0.4',
        remarks: 'Housing allowance as per policy'
      },
      { 
        id: 'comp-3', 
        name: 'Medical Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 15000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 3,
        formula: '15000',
        remarks: 'Non-taxable medical benefit'
      },
      { 
        id: 'comp-4', 
        name: 'Conveyance Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 8000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 4,
        formula: '8000',
        remarks: 'Transportation allowance'
      },
      { 
        id: 'comp-5', 
        name: 'Special Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 10, 
        isTaxable: true, 
        isStatutory: false, 
        order: 5,
        formula: 'base * 0.1',
        remarks: 'Performance linked allowance'
      },
      { 
        id: 'comp-6', 
        name: 'Income Tax', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FORMULA' as const, 
        value: 0, 
        isTaxable: false, 
        isStatutory: true, 
        order: 6,
        formula: 'calculateTax(totalEarnings)',
        remarks: 'As per FBR tax slabs'
      },
      { 
        id: 'comp-7', 
        name: 'EOBI', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FIXED' as const, 
        value: 530, 
        isTaxable: false, 
        isStatutory: true, 
        order: 7,
        formula: '530',
        remarks: 'Employees Old-Age Benefits Institution'
      }
    ],
    calculationRules: {
      baseAmount: 'grossSalary',
      rounding: 'UP_TO_NEAREST_100',
      proRateForPartialMonth: true,
      includeIncentives: true
    },
    totalEarnings: 100,
    totalDeductions: 10,
    netPercentage: 90,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'Admin User',
    updatedBy: 'Admin User',
    version: '1.0',
    isActive: true,
    approvalStatus: 'APPROVED',
    lastApplied: '2024-02-01',
    appliedCount: 25
  },
  {
    id: 'TMP-002',
    name: 'OPS-G15',
    code: 'OPS-G15',
    description: 'Operations Staff - Grade G15 (Admin & Support Roles)',
    type: 'STANDARD' as const,
    category: 'GRADE' as const,
    applicableTo: ['G15'],
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Basic Salary', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 50, 
        isTaxable: true, 
        isStatutory: true, 
        order: 1,
        formula: 'base * 0.5',
        remarks: 'Core salary component'
      },
      { 
        id: 'comp-2', 
        name: 'House Rent Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 40, 
        isTaxable: true, 
        isStatutory: false, 
        order: 2,
        formula: 'base * 0.4',
        remarks: 'Housing allowance'
      },
      { 
        id: 'comp-3', 
        name: 'Medical Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 10000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 3,
        formula: '10000',
        remarks: 'Non-taxable medical benefit'
      },
      { 
        id: 'comp-4', 
        name: 'Conveyance Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 5000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 4,
        formula: '5000',
        remarks: 'Transportation allowance'
      },
      { 
        id: 'comp-5', 
        name: 'Income Tax', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FORMULA' as const, 
        value: 0, 
        isTaxable: false, 
        isStatutory: true, 
        order: 5,
        formula: 'calculateTax(totalEarnings)',
        remarks: 'As per FBR tax slabs'
      },
      { 
        id: 'comp-6', 
        name: 'EOBI', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FIXED' as const, 
        value: 530, 
        isTaxable: false, 
        isStatutory: true, 
        order: 6,
        formula: '530',
        remarks: 'Statutory deduction'
      }
    ],
    calculationRules: {
      baseAmount: 'grossSalary',
      rounding: 'UP_TO_NEAREST_100',
      proRateForPartialMonth: true,
      includeIncentives: false
    },
    totalEarnings: 100,
    totalDeductions: 8,
    netPercentage: 92,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'HR Manager',
    updatedBy: 'HR Manager',
    version: '1.1',
    isActive: true,
    approvalStatus: 'APPROVED',
    lastApplied: '2024-02-01',
    appliedCount: 42
  },
  {
    id: 'TMP-003',
    name: 'EXEC-G20',
    code: 'EXEC-G20',
    description: 'Executive Level - Grade G20 (C-Level & Senior Management)',
    type: 'STANDARD' as const,
    category: 'GRADE' as const,
    applicableTo: ['G20'],
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Basic Salary', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 60, 
        isTaxable: true, 
        isStatutory: true, 
        order: 1,
        formula: 'base * 0.6',
        remarks: 'Executive basic salary'
      },
      { 
        id: 'comp-2', 
        name: 'House Rent Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 35, 
        isTaxable: true, 
        isStatutory: false, 
        order: 2,
        formula: 'base * 0.35',
        remarks: 'Executive housing allowance'
      },
      { 
        id: 'comp-3', 
        name: 'Medical Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 25000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 3,
        formula: '25000',
        remarks: 'Executive medical coverage'
      },
      { 
        id: 'comp-4', 
        name: 'Car Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 30000, 
        isTaxable: true, 
        isStatutory: false, 
        order: 4,
        formula: '30000',
        remarks: 'Company car maintenance'
      },
      { 
        id: 'comp-5', 
        name: 'Utility Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 15000, 
        isTaxable: true, 
        isStatutory: false, 
        order: 5,
        formula: '15000',
        remarks: 'Electricity, gas, phone'
      },
      { 
        id: 'comp-6', 
        name: 'Performance Bonus', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 20, 
        isTaxable: true, 
        isStatutory: false, 
        order: 6,
        formula: 'base * 0.2 * performanceFactor',
        remarks: 'Quarterly performance based'
      },
      { 
        id: 'comp-7', 
        name: 'Income Tax', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FORMULA' as const, 
        value: 0, 
        isTaxable: false, 
        isStatutory: true, 
        order: 7,
        formula: 'calculateTax(totalEarnings)',
        remarks: 'As per FBR tax slabs'
      },
      { 
        id: 'comp-8', 
        name: 'Professional Tax', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FIXED' as const, 
        value: 2000, 
        isTaxable: false, 
        isStatutory: true, 
        order: 8,
        formula: '2000',
        remarks: 'Annual professional tax'
      }
    ],
    calculationRules: {
      baseAmount: 'grossSalary',
      rounding: 'UP_TO_NEAREST_1000',
      proRateForPartialMonth: false,
      includeIncentives: true
    },
    totalEarnings: 100,
    totalDeductions: 15,
    netPercentage: 85,
    createdAt: '2024-01-20T11:45:00Z',
    updatedAt: '2024-02-01T16:20:00Z',
    createdBy: 'CEO',
    updatedBy: 'CFO',
    version: '2.0',
    isActive: true,
    approvalStatus: 'APPROVED',
    lastApplied: '2024-02-01',
    appliedCount: 8
  },
  {
    id: 'TMP-004',
    name: 'SALES-G12',
    code: 'SALES-G12',
    description: 'Sales Department - Grade G12 (Commission Based)',
    type: 'CUSTOM' as const,
    category: 'DESIGNATION' as const,
    applicableTo: ['Sales Executive', 'Sales Representative', 'Business Development'],
    effectiveFrom: '2024-02-01',
    effectiveTo: null,
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Basic Salary', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 40, 
        isTaxable: true, 
        isStatutory: true, 
        order: 1,
        formula: 'base * 0.4',
        remarks: 'Fixed base for sales staff'
      },
      { 
        id: 'comp-2', 
        name: 'Commission', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 15, 
        isTaxable: true, 
        isStatutory: false, 
        order: 2,
        formula: 'salesAmount * 0.15',
        remarks: 'Sales commission percentage'
      },
      { 
        id: 'comp-3', 
        name: 'Travel Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 8000, 
        isTaxable: true, 
        isStatutory: false, 
        order: 3,
        formula: '8000',
        remarks: 'Field travel expenses'
      },
      { 
        id: 'comp-4', 
        name: 'Communication Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 3000, 
        isTaxable: true, 
        isStatutory: false, 
        order: 4,
        formula: '3000',
        remarks: 'Phone and internet'
      },
      { 
        id: 'comp-5', 
        name: 'Income Tax', 
        type: 'DEDUCTION' as const, 
        calculationType: 'FORMULA' as const, 
        value: 0, 
        isTaxable: false, 
        isStatutory: true, 
        order: 5,
        formula: 'calculateTax(totalEarnings)',
        remarks: 'As per FBR tax slabs'
      }
    ],
    calculationRules: {
      baseAmount: 'fixedSalary',
      rounding: 'UP_TO_NEAREST_100',
      proRateForPartialMonth: true,
      includeIncentives: true,
      commissionThreshold: 50000
    },
    totalEarnings: 100,
    totalDeductions: 10,
    netPercentage: 90,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
    createdBy: 'Sales Director',
    updatedBy: 'Sales Director',
    version: '1.0',
    isActive: true,
    approvalStatus: 'PENDING',
    lastApplied: null,
    appliedCount: 0
  },
  {
    id: 'TMP-005',
    name: 'IT-SUPPORT',
    code: 'IT-SUPPORT',
    description: 'IT Support Team - All Grades (Shift Allowances Included)',
    type: 'CUSTOM' as const,
    category: 'DIVISION' as const,
    applicableTo: ['IT Department'],
    effectiveFrom: '2024-01-15',
    effectiveTo: null,
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Basic Salary', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 55, 
        isTaxable: true, 
        isStatutory: true, 
        order: 1,
        formula: 'base * 0.55',
        remarks: 'Core salary component'
      },
      { 
        id: 'comp-2', 
        name: 'Shift Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 25, 
        isTaxable: true, 
        isStatutory: false, 
        order: 2,
        formula: 'base * 0.25',
        remarks: 'For night shift duties'
      },
      { 
        id: 'comp-3', 
        name: 'Technical Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 10000, 
        isTaxable: true, 
        isStatutory: false, 
        order: 3,
        formula: '10000',
        remarks: 'Technical skills premium'
      },
      { 
        id: 'comp-4', 
        name: 'On-Call Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 5000, 
        isTaxable: true, 
        isStatutory: false, 
        order: 4,
        formula: '5000',
        remarks: '24/7 support availability'
      },
      { 
        id: 'comp-5', 
        name: 'Medical Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 12000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 5,
        formula: '12000',
        remarks: 'Health insurance coverage'
      }
    ],
    calculationRules: {
      baseAmount: 'grossSalary',
      rounding: 'UP_TO_NEAREST_100',
      proRateForPartialMonth: true,
      includeIncentives: false,
      shiftBased: true
    },
    totalEarnings: 100,
    totalDeductions: 12,
    netPercentage: 88,
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-25T11:10:00Z',
    createdBy: 'IT Manager',
    updatedBy: 'IT Manager',
    version: '1.2',
    isActive: true,
    approvalStatus: 'APPROVED',
    lastApplied: '2024-02-01',
    appliedCount: 12
  },
  {
    id: 'TMP-006',
    name: 'CONTRACTUAL',
    code: 'CONTRACTUAL',
    description: 'Contractual Employees - No Statutory Benefits',
    type: 'CUSTOM' as const,
    category: 'GROUP' as const,
    applicableTo: ['Contract Staff', 'Project Based', 'Temporary'],
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-06-30',
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Consolidated Salary', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 100, 
        isTaxable: true, 
        isStatutory: false, 
        order: 1,
        formula: 'agreedAmount',
        remarks: 'All-inclusive consolidated pay'
      },
      { 
        id: 'comp-2', 
        name: 'Withholding Tax', 
        type: 'DEDUCTION' as const, 
        calculationType: 'PERCENTAGE' as const, 
        value: 10, 
        isTaxable: false, 
        isStatutory: true, 
        order: 2,
        formula: 'totalEarnings * 0.1',
        remarks: 'WHT as per contract'
      }
    ],
    calculationRules: {
      baseAmount: 'contractAmount',
      rounding: 'NO_ROUNDING',
      proRateForPartialMonth: true,
      includeIncentives: false,
      statutoryBenefits: false
    },
    totalEarnings: 100,
    totalDeductions: 10,
    netPercentage: 90,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'HR Admin',
    updatedBy: 'HR Admin',
    version: '1.0',
    isActive: true,
    approvalStatus: 'APPROVED',
    lastApplied: '2024-02-01',
    appliedCount: 18
  },
  {
    id: 'TMP-007',
    name: 'INTERNS',
    code: 'INTERN-TMP',
    description: 'Internship Program - Stipend Structure',
    type: 'STANDARD' as const,
    category: 'GROUP' as const,
    applicableTo: ['Interns', 'Trainees'],
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    status: 'ACTIVE' as const,
    salaryComponents: [
      { 
        id: 'comp-1', 
        name: 'Monthly Stipend', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 25000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 1,
        formula: '25000',
        remarks: 'Fixed stipend amount'
      },
      { 
        id: 'comp-2', 
        name: 'Transport Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 3000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 2,
        formula: '3000',
        remarks: 'Daily commute support'
      },
      { 
        id: 'comp-3', 
        name: 'Meal Allowance', 
        type: 'EARNING' as const, 
        calculationType: 'FIXED' as const, 
        value: 5000, 
        isTaxable: false, 
        isStatutory: false, 
        order: 3,
        formula: '5000',
        remarks: 'Cafeteria meal card'
      }
    ],
    calculationRules: {
      baseAmount: 'fixedStipend',
      rounding: 'NO_ROUNDING',
      proRateForPartialMonth: true,
      includeIncentives: false,
      statutoryBenefits: false
    },
    totalEarnings: 100,
    totalDeductions: 0,
    netPercentage: 100,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    createdBy: 'Talent Acquisition',
    updatedBy: 'Talent Acquisition',
    version: '1.0',
    isActive: true,
    approvalStatus: 'APPROVED',
    lastApplied: '2024-02-01',
    appliedCount: 15
  }
];

// Extended employee profiles to match templates
export const MOCK_PROFILES: EmployeeProfile[] = [
  { 
    id: 'EMP-1001', 
    name: 'Arsalan Khan', 
    avatar: 'AK', 
    dept: 'Engineering', 
    grade: 'G18', 
    designation: 'Senior Developer',
    division: 'Technology',
    template: 'ENG-SR-18', 
    gross: 215000, 
    overridesCount: 2, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1002', 
    name: 'Saira Ahmed', 
    avatar: 'SA', 
    dept: 'HR', 
    grade: 'G15', 
    designation: 'HR Manager',
    division: 'Administration',
    template: 'OPS-G15', 
    gross: 85000, 
    overridesCount: 0, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1003', 
    name: 'Umar Farooq', 
    avatar: 'UF', 
    dept: 'Sales', 
    grade: 'G12', 
    designation: 'Sales Executive',
    division: 'Sales',
    template: 'SALES-G12', 
    gross: 45000, 
    overridesCount: 0, 
    bankInfo: false, 
    statutoryInfo: false, 
    status: 'PENDING'
  },
  { 
    id: 'EMP-1004', 
    name: 'Zainab Bibi', 
    avatar: 'ZB', 
    dept: 'Operations', 
    grade: 'G15', 
    designation: 'Ops Lead',
    division: 'Operations',
    template: 'OPS-G15', 
    gross: 92000, 
    overridesCount: 1, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1005', 
    name: 'Mustafa Kamal', 
    avatar: 'MK', 
    dept: 'Engineering', 
    grade: 'G20', 
    designation: 'CTO',
    division: 'Technology',
    template: 'EXEC-G20', 
    gross: 550000, 
    overridesCount: 4, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1006', 
    name: 'Ali Raza', 
    avatar: 'AR', 
    dept: 'IT', 
    grade: 'G14', 
    designation: 'System Administrator',
    division: 'IT',
    template: 'IT-SUPPORT', 
    gross: 68000, 
    overridesCount: 0, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1007', 
    name: 'Fatima Noor', 
    avatar: 'FN', 
    dept: 'Marketing', 
    grade: 'G13', 
    designation: 'Marketing Intern',
    division: 'Marketing',
    template: 'INTERNS', 
    gross: 25000, 
    overridesCount: 0, 
    bankInfo: false, 
    statutoryInfo: false, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1008', 
    name: 'Hassan Shah', 
    avatar: 'HS', 
    dept: 'Engineering', 
    grade: 'G16', 
    designation: 'QA Engineer',
    division: 'Technology',
    template: 'ENG-SR-18', 
    gross: 105000, 
    overridesCount: 1, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1009', 
    name: 'Ayesha Malik', 
    avatar: 'AM', 
    dept: 'Finance', 
    grade: 'G17', 
    designation: 'Financial Analyst',
    division: 'Finance',
    template: 'OPS-G15', 
    gross: 125000, 
    overridesCount: 0, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  },
  { 
    id: 'EMP-1010', 
    name: 'Bilal Ahmed', 
    avatar: 'BA', 
    dept: 'IT', 
    grade: 'G15', 
    designation: 'IT Support Specialist',
    division: 'IT',
    template: 'IT-SUPPORT', 
    gross: 75000, 
    overridesCount: 2, 
    bankInfo: true, 
    statutoryInfo: true, 
    status: 'APPROVED'
  }
];

// Update the interface to include missing fields
interface EmployeeProfile {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  grade: string;
  designation: string;
  division: string;
  template: string | null;
  gross: number;
  overridesCount: number;
  bankInfo: boolean;
  statutoryInfo: boolean;
  status: string;
}

// Types for templates


export const EmployeePayProfilesList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MISSING_TEMPLATE' | 'OVERRIDES'>('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleAssignTemplate = () => {
    console.log(`Assigning template`);
    setShowAssignModal(false);
  };
  const handleCreateTemplate = () => {
    console.log(`Assigning template`);
    setShowAssignModal(false);
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        {showAssignModal && (
  <TemplateAssignmentModal
    isOpen={showAssignModal}
    onClose={() => setShowAssignModal(false)}
    onAssign={handleAssignTemplate}
    onCreateTemplate={handleCreateTemplate}
    employees={MOCK_PROFILES}
    templates={MOCK_TEMPLATES}
  />
)}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Employee Pay Profiles</h2>
          <p className="text-sm text-gray-500">Manage individual salary mappings and exception overrides</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Download size={18} /> Export Profiles
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95" onClick={()=>setShowAssignModal(true)}>
            <UserPlus size={18} /> Assign Template
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><Users size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
            <h4 className="text-xl font-black text-gray-800">485</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">With Template</p>
            <h4 className="text-xl font-black text-gray-800">480</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Missing Config</p>
            <h4 className="text-xl font-black text-red-600">05</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Settings2 size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Overrides</p>
            <h4 className="text-xl font-black text-blue-600">23</h4>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b space-y-4 bg-white sticky top-0 z-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setFilterType('ALL')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterType === 'ALL' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
              >
                All Profiles
              </button>
              <button 
                onClick={() => setFilterType('MISSING_TEMPLATE')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterType === 'MISSING_TEMPLATE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
              >
                Missing Template
              </button>
              <button 
                onClick={() => setFilterType('OVERRIDES')}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterType === 'OVERRIDES' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
              >
                With Overrides
              </button>
            </div>
            
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by ID or name..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b sticky-header">
                <th className="px-6 py-5">Employee Info</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">Grade</th>
                <th className="px-6 py-5">Structure Template</th>
                <th className="px-6 py-5 text-right">Base Gross</th>
                <th className="px-6 py-5 text-center">Overrides</th>
                <th className="px-6 py-5 text-center">Compliance</th>
                <th className="px-6 py-5 text-right w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {MOCK_PROFILES.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                        {profile.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{profile.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{profile.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-600">{profile.dept}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded">{profile.grade}</span>
                  </td>
                  <td className="px-6 py-4">
                    {profile.template ? (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Layers size={14} />
                        <span className="font-bold text-xs">{profile.template}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-500 italic">
                        <AlertTriangle size={14} />
                        <span className="font-bold text-xs tracking-tight">Not Assigned</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-gray-800">{formatPKR(profile.gross)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {profile.overridesCount > 0 ? (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100">
                        {profile.overridesCount} Active
                      </span>
                    ) : (
                      <span className="text-gray-300">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`p-1.5 rounded-md ${profile.bankInfo ? 'text-green-500 bg-green-50' : 'text-red-400 bg-red-50 animate-pulse'}`} title={profile.bankInfo ? "Bank Account Linked" : "Missing Bank Details"}>
                        <Landmark size={16} />
                      </div>
                      <div className={`p-1.5 rounded-md ${profile.statutoryInfo ? 'text-green-500 bg-green-50' : 'text-red-400 bg-red-50 animate-pulse'}`} title={profile.statutoryInfo ? "Statutory Details Verified" : "Missing NTN/EOBI"}>
                        <ShieldAlert size={16} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1  transition-opacity">
                      <button 
                        onClick={() => setSelectedEmployee(profile)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" 
                        title="Edit Profile"
                      >
                        <Settings2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" title="View History">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>Showing 5 direct direct profiles</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-500 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-primary">Next</button>
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeePayProfileForm 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
          onSave={(data) => {
            console.log('Saved profile:', data);
            setSelectedEmployee(null);
          }} 
        />
      )}

      {/* Bulk Action Footer Bar (Conditional) */}
      <div className="p-4 bg-primary rounded-xl shadow-2xl flex items-center justify-between text-white animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">5</div>
          <p className="text-sm font-bold">Selected Employees</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest border border-white/20 transition-all">Bulk Update Grade</button>
          <button className="px-4 py-2 bg-accent text-primary rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all">Mass Assign Template</button>
        </div>
      </div>
    </div>
  );
};
