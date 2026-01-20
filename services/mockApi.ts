
import { EmployeePayroll, PayrollSummary, PayrollStatus } from '../types';

const MOCK_DELAY = 500;

export const mockApi = {
  getSummary: async (): Promise<PayrollSummary> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalGross: 45800000,
          totalDeductions: 2450000,
          totalTax: 3120000,
          totalNet: 40230000,
          employeeCount: 485
        });
      }, MOCK_DELAY);
    });
  },

  getEmployees: async (): Promise<EmployeePayroll[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = ['Engineering', 'HR', 'Sales', 'Finance', 'Operations'];
        const data: EmployeePayroll[] = Array.from({ length: 15 }).map((_, i) => {
          const basic = 50000 + Math.random() * 200000;
          const allowance = basic * 0.2;
          const deduction = basic * 0.05;
          const tax = basic * 0.1;
          return {
            id: `EMP-${1000 + i}`,
            name: `Employee ${i + 1}`,
            designation: 'Senior Professional',
            department: departments[i % departments.length],
            basicSalary: basic,
            allowances: allowance,
            deductions: deduction,
            incomeTax: tax,
            netSalary: basic + allowance - deduction - tax,
            status: PayrollStatus.Approved
          };
        });
        resolve(data);
      }, MOCK_DELAY);
    });
  }
};
