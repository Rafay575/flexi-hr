
import React, { useState, useEffect } from 'react';
import { useRBAC } from '../hooks/useRBAC';
import { PayrollOfficerDashboard, ManagerTeamDashboard, EmployeeESSDashboard } from './Dashboards';
import { PayrollSummary, EmployeePayroll } from '../types';
import { LayoutDashboard, UserCircle, Users } from 'lucide-react';

interface DashboardRouterProps {
  summary: PayrollSummary | null;
  employees: EmployeePayroll[];
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ summary, employees }) => {
  const { role, can } = useRBAC();
  
  // Persistent tab selection per session
  const [activeView, setActiveView] = useState<string>(() => {
    const saved = sessionStorage.getItem(`dashboard_tab_${role}`);
    if (saved) return saved;
    if (can('dashboard.admin')) return 'admin';
    if (can('dashboard.team')) return 'team';
    return 'ess';
  });

  // Reset tab if role changes significantly
  useEffect(() => {
    const saved = sessionStorage.getItem(`dashboard_tab_${role}`);
    if (saved) {
      setActiveView(saved);
    } else {
      if (can('dashboard.admin')) setActiveView('admin');
      else if (can('dashboard.team')) setActiveView('team');
      else setActiveView('ess');
    }
  }, [role, can]);

  const handleTabChange = (view: string) => {
    setActiveView(view);
    sessionStorage.setItem(`dashboard_tab_${role}`, view);
  };

  const showTabs = can('dashboard.admin') || can('dashboard.team');

  return (
    <div className="space-y-6">
      {showTabs && (
        <div className="flex items-center gap-1 p-1 bg-gray-100 w-fit rounded-xl border border-gray-200">
          {can('dashboard.admin') && (
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeView === 'admin' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
              }`}
            >
              <LayoutDashboard size={16} />
              Admin View
            </button>
          )}
          {can('dashboard.team') && (
            <button
              onClick={() => handleTabChange('team')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeView === 'team' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
              }`}
            >
              <Users size={16} />
              Team View
            </button>
          )}
          <button
            onClick={() => handleTabChange('ess')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeView === 'ess' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
            }`}
          >
            <UserCircle size={16} />
            My Payroll
          </button>
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeView === 'admin' && <PayrollOfficerDashboard summary={summary} />}
        {activeView === 'team' && <ManagerTeamDashboard employees={employees} />}
        {activeView === 'ess' && <EmployeeESSDashboard employee={employees[0] || null} />}
      </div>
    </div>
  );
};

export default DashboardRouter;
