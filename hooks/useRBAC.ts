
import React, { createContext, useContext, useState, useMemo } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'HR_ADMIN' | 'PAYROLL_OFFICER' | 'MANAGER' | 'EMPLOYEE';

export type FeatureKey = 
  | 'dashboard.admin' 
  | 'dashboard.team' 
  | 'dashboard.ess' 
  | 'payroll.ess' 
  | 'payroll.team' 
  | 'payroll.components' 
  | 'payroll.structures' 
  | 'payroll.process' 
  | 'loans' 
  | 'adjustments' 
  | 'increments' 
  | 'settlement' 
  | 'outputs' 
  | 'compliance' 
  | 'reports' 
  | 'ai' 
  | 'settings';

type AccessLevel = 'FULL' | 'READ' | 'NONE';

const PERMISSION_MATRIX: Record<UserRole, Record<FeatureKey, AccessLevel>> = {
  SUPER_ADMIN: {
    'dashboard.admin': 'FULL', 'dashboard.team': 'FULL', 'dashboard.ess': 'FULL',
    'payroll.ess': 'FULL', 'payroll.team': 'FULL', 'payroll.components': 'FULL',
    'payroll.structures': 'FULL', 'payroll.process': 'FULL', 'loans': 'FULL',
    'adjustments': 'FULL', 'increments': 'FULL', 'settlement': 'FULL',
    'outputs': 'FULL', 'compliance': 'FULL', 'reports': 'FULL', 'ai': 'FULL', 'settings': 'FULL'
  },
  HR_ADMIN: {
    'dashboard.admin': 'FULL', 'dashboard.team': 'FULL', 'dashboard.ess': 'FULL',
    'payroll.ess': 'FULL', 'payroll.team': 'FULL', 'payroll.components': 'FULL',
    'payroll.structures': 'FULL', 'payroll.process': 'FULL', 'loans': 'FULL',
    'adjustments': 'FULL', 'increments': 'FULL', 'settlement': 'FULL',
    'outputs': 'FULL', 'compliance': 'FULL', 'reports': 'FULL', 'ai': 'FULL', 'settings': 'FULL'
  },
  PAYROLL_OFFICER: {
    'dashboard.admin': 'FULL', 'dashboard.team': 'NONE', 'dashboard.ess': 'FULL',
    'payroll.ess': 'FULL', 'payroll.team': 'NONE', 'payroll.components': 'READ',
    'payroll.structures': 'READ', 'payroll.process': 'FULL', 'loans': 'FULL',
    'adjustments': 'FULL', 'increments': 'READ', 'settlement': 'FULL',
    'outputs': 'FULL', 'compliance': 'READ', 'reports': 'FULL', 'ai': 'FULL', 'settings': 'READ'
  },
  MANAGER: {
    'dashboard.admin': 'NONE', 'dashboard.team': 'FULL', 'dashboard.ess': 'FULL',
    'payroll.ess': 'FULL', 'payroll.team': 'FULL', 'payroll.components': 'NONE',
    'payroll.structures': 'NONE', 'payroll.process': 'NONE', 'loans': 'READ',
    'adjustments': 'NONE', 'increments': 'NONE', 'settlement': 'NONE',
    'outputs': 'NONE', 'compliance': 'NONE', 'reports': 'READ', 'ai': 'NONE', 'settings': 'NONE'
  },
  EMPLOYEE: {
    'dashboard.admin': 'NONE', 'dashboard.team': 'NONE', 'dashboard.ess': 'FULL',
    'payroll.ess': 'FULL', 'payroll.team': 'NONE', 'payroll.components': 'NONE',
    'payroll.structures': 'NONE', 'payroll.process': 'NONE', 'loans': 'READ',
    'adjustments': 'NONE', 'increments': 'NONE', 'settlement': 'NONE',
    'outputs': 'NONE', 'compliance': 'NONE', 'reports': 'NONE', 'ai': 'NONE', 'settings': 'NONE'
  }
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-red-500 text-white',
  HR_ADMIN: 'bg-purple-600 text-white',
  PAYROLL_OFFICER: 'bg-blue-600 text-white',
  MANAGER: 'bg-green-600 text-white',
  EMPLOYEE: 'bg-gray-500 text-white',
};

interface RBACContextType {
  role: UserRole;
  user: { name: string; avatar: string };
  can: (feature: FeatureKey, level?: AccessLevel) => boolean;
  setRole: (role: UserRole) => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);
const Provider = RBACContext.Provider;

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [currentUser] = useState({ name: 'Jane Doe', avatar: 'JD' });

  const can = (feature: FeatureKey, level: AccessLevel = 'READ'): boolean => {
    const userAccess = PERMISSION_MATRIX[currentRole][feature];
    if (level === 'FULL') return userAccess === 'FULL';
    if (level === 'READ') return userAccess === 'FULL' || userAccess === 'READ';
    return userAccess !== 'NONE';
  };

  const value = useMemo(() => ({
    role: currentRole,
    user: currentUser,
    can,
    setRole: setCurrentRole
  }), [currentRole, currentUser]);

  return React.createElement(Provider, { value: value }, children);
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) throw new Error('useRBAC must be used within an RBACProvider');
  return context;
};
