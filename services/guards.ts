
import { api } from './mockData';

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Checks if a Grade can be deactivated.
 * Rule: Cannot deactivate if assigned to active designations.
 */
export const canDeactivateGrade = async (gradeId: string): Promise<GuardResult> => {
  const designations = await api.getDesignations();
  const activeUsage = designations.filter(d => d.gradeId === gradeId && d.status === 'active');
  
  if (activeUsage.length > 0) {
    return { 
      allowed: false, 
      reason: `Cannot deactivate: Used by ${activeUsage.length} active designation(s).` 
    };
  }
  return { allowed: true };
};

/**
 * Checks if a Designation can be deactivated.
 * Rule: Cannot deactivate if assigned to employees OR used as a reporting manager.
 */
export const canDeactivateDesignation = async (designationId: string): Promise<GuardResult> => {
  const designations = await api.getDesignations();
  const target = designations.find(d => d.id === designationId);
  
  // Check 1: Active Employees
  if (target && (target._count?.employees || 0) > 0) {
    return { 
      allowed: false, 
      reason: `Cannot deactivate: Currently assigned to ${target._count?.employees} active employee(s).` 
    };
  }

  // Check 2: Reporting Hierarchy
  const children = designations.filter(d => d.reportsToDesignationId === designationId && d.status === 'active');
  if (children.length > 0) {
    return { 
      allowed: false, 
      reason: `Cannot deactivate: This is the reporting manager for ${children.length} active designation(s).` 
    };
  }

  return { allowed: true };
};

/**
 * Checks if a Division can be deactivated.
 * Rule: Cannot deactivate if it contains active departments.
 */
export const canDeactivateDivision = async (divisionId: string): Promise<GuardResult> => {
  const depts = await api.getDepartments();
  const activeDepts = depts.filter(d => d.divisionId === divisionId && d.status === 'active');
  
  if (activeDepts.length > 0) {
    return { 
      allowed: false, 
      reason: `Cannot deactivate: Contains ${activeDepts.length} active department(s). Please deactivate or move them first.` 
    };
  }
  return { allowed: true };
};

/**
 * Checks if a Department can be deactivated.
 * Rule: Cannot deactivate if it has active child units OR active headcount.
 */
export const canDeactivateDepartment = async (deptId: string): Promise<GuardResult> => {
  const allDepts = await api.getDepartments();
  const target = allDepts.find(d => d.id === deptId);

  // Check 1: Headcount
  if (target && target.headcount > 0) {
    return { 
      allowed: false, 
      reason: `Cannot deactivate: Has ${target.headcount} active employee(s).` 
    };
  }

  // Check 2: Child Units (Sub-depts or Lines)
  const activeChildren = allDepts.filter(d => d.parentId === deptId && d.status === 'active');
  if (activeChildren.length > 0) {
    return { 
      allowed: false, 
      reason: `Cannot deactivate: Contains ${activeChildren.length} active sub-unit(s).` 
    };
  }

  // Check 3: Active Cost Centers
  const costCenters = await api.getCostCenters();
  const activeCCs = costCenters.filter(cc => cc.departmentId === deptId && cc.status === 'active');
  if (activeCCs.length > 0) {
    return {
      allowed: false,
      reason: `Cannot deactivate: Linked to ${activeCCs.length} active cost center(s).`
    };
  }

  return { allowed: true };
};

/**
 * Checks if a Line/Team can be deactivated.
 * Alias for Department check as they share the same entity structure and rules (Headcount/Children).
 */
export const canDeactivateLine = canDeactivateDepartment;
