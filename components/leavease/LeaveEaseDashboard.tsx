import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Users, Briefcase, Building2, ChevronDown, Check } from "lucide-react";

// Import your existing components
import { ApplyLeaveWizard } from "@/components/ApplyLeaveWizard";
import { EmployeeView, ManagerView, HRView } from "@/components/DashboardSections";
import {  LeaveStatus } from "@/types";
import { MOCK_HISTORY } from "@/constants";

// Define role types
type UserRole = "employee" | "manager" | "hr";

// Mock data for each role
const ROLE_DATA = {
  employee: {
    name: "John Doe",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff",
    department: "Engineering",
    leaveDays: 16,
    upcomingLeave: { type: "Annual Leave", days: 3, date: "FEB 10" },
    welcomeMessage: "Ready for a break?",
    permissions: ["Apply Leave", "View Balance", "Track Requests"],
  },
  manager: {
    name: "Sarah Chen",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10B981&color=fff",
    department: "Engineering Lead",
    leaveDays: 20,
    upcomingLeave: { type: "Team Review", days: 2, date: "FEB 15" },
    welcomeMessage: "Manage your team's leave",
    permissions: ["Approve Leave", "View Team Calendar", "Analytics"],
  },
  hr: {
    name: "Alex Morgan",
    avatar: "https://ui-avatars.com/api/?name=Alex+Morgan&background=8B5CF6&color=fff",
    department: "Human Resources",
    leaveDays: 22,
    upcomingLeave: { type: "Conference", days: 4, date: "FEB 22" },
    welcomeMessage: "Configure leave policies",
    permissions: ["System Settings", "Reports", "Policy Management"],
  },
};

// Role-specific recent activities
const ROLE_ACTIVITIES = {
  employee: MOCK_HISTORY,
  manager: [
    { id: "LV-MGR-001", type: "Annual Leave", startDate: "2025-02-10", endDate: "2025-02-12", days: 3, reason: "Team member request", status: LeaveStatus.PENDING, appliedDate: "2025-01-25" },
    { id: "LV-MGR-002", type: "Sick Leave", startDate: "2025-02-05", endDate: "2025-02-05", days: 1, reason: "Team approval", status: LeaveStatus.APPROVED, appliedDate: "2025-01-20" },
    { id: "LV-MGR-003", type: "Casual Leave", startDate: "2025-02-18", endDate: "2025-02-18", days: 1, reason: "Waiting review", status: LeaveStatus.PENDING, appliedDate: "2025-01-28" },
    { id: "LV-MGR-004", type: "Parental Leave", startDate: "2025-03-01", endDate: "2025-03-15", days: 15, reason: "Approved", status: LeaveStatus.APPROVED, appliedDate: "2025-01-15" },
  ],
  hr: [
    { id: "LV-HR-001", type: "Policy Change", startDate: "2025-02-01", endDate: "2025-02-01", days: 1, reason: "System update", status: LeaveStatus.APPROVED, appliedDate: "2025-01-30" },
    { id: "LV-HR-002", type: "Annual Leave", startDate: "2025-02-25", endDate: "2025-02-28", days: 4, reason: "HR planning", status: LeaveStatus.PENDING, appliedDate: "2025-01-26" },
    { id: "LV-HR-003", type: "Training", startDate: "2025-02-20", endDate: "2025-02-21", days: 2, reason: "Approved", status: LeaveStatus.APPROVED, appliedDate: "2025-01-22" },
    { id: "LV-HR-004", type: "Conference", startDate: "2025-03-10", endDate: "2025-03-12", days: 3, reason: "Pending budget", status: LeaveStatus.PENDING, appliedDate: "2025-01-29" },
  ],
};

// Role Switcher Component
const RoleSwitcher: React.FC<{
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}> = ({ currentRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: "employee" as UserRole, label: "Employee", icon: <Users size={16} />, color: "bg-blue-100 text-blue-600" },
    { id: "manager" as UserRole, label: "Manager", icon: <Briefcase size={16} />, color: "bg-green-100 text-green-600" },
    { id: "hr" as UserRole, label: "HR Admin", icon: <Building2 size={16} />, color: "bg-purple-100 text-purple-600" },
  ];

  const currentRoleData = roles.find(r => r.id === currentRole);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
      >
        <div className={`p-1.5 rounded-lg ${currentRoleData?.color.split(' ')[0]}`}>
          <span className={currentRoleData?.color.split(' ')[1]}>
            {currentRoleData?.icon}
          </span>
        </div>
        <span className="font-medium text-sm">{currentRoleData?.label}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-56 z-50 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Switch Perspective</p>
            </div>
            <div className="py-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                    currentRole === role.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${role.color.split(' ')[0]}`}>
                      <span className={role.color.split(' ')[1]}>
                        {role.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{role.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {role.id === 'employee' ? 'Personal dashboard'
                         : role.id === 'manager' ? 'Team management'
                         : 'System configuration'}
                      </p>
                    </div>
                  </div>
                  {currentRole === role.id && (
                    <Check size={16} className="text-green-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Viewing as: <span className="font-semibold text-gray-700">{ROLE_DATA[currentRole].name}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Permission Badges Component
const PermissionBadges: React.FC<{ role: UserRole }> = ({ role }) => {
  const permissions = ROLE_DATA[role].permissions;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {permissions.map((permission, index) => (
        <span
          key={index}
          className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
        >
          {permission}
        </span>
      ))}
    </div>
  );
};

// Main Dashboard Component
const LeaveEaseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<UserRole>("employee");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const roleData = ROLE_DATA[currentRole];
  const activities = ROLE_ACTIVITIES[currentRole];
  const isEmployee = currentRole === "employee";
  const isManager = currentRole === "manager";
  const isHR = currentRole === "hr";

  const getStatusStyle = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case LeaveStatus.PENDING:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case LeaveStatus.REJECTED:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Role Switcher Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <img 
            src={roleData.avatar} 
            alt={roleData.name}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-800">{roleData.name}</h3>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {roleData.department}
              </div>
            </div>
            <PermissionBadges role={currentRole} />
          </div>
        </div>
        <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
      </div>

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Active Period: 2025
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentRole === 'employee' ? 'bg-blue-500/30' :
                currentRole === 'manager' ? 'bg-green-500/30' :
                'bg-purple-500/30'
              }`}>
                {currentRole.toUpperCase()} VIEW
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {roleData.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-white/80 max-w-md text-lg">
              You have <span className="text-yellow-300 font-bold">{roleData.leaveDays} days</span>{" "}
              of Annual Leave remaining. {roleData.welcomeMessage}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 min-w-[200px]">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2">
                Upcoming Leave
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 bg-white/20 rounded-lg">
                  <p className="text-[10px] font-bold leading-none">FEB</p>
                  <p className="text-xl font-bold">{roleData.upcomingLeave.date.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="font-bold text-sm">{roleData.upcomingLeave.type}</p>
                  <p className="text-xs text-white/70">{roleData.upcomingLeave.days} Days</p>
                </div>
              </div>
            </div>

            {isEmployee && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 flex flex-col justify-center">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                  <Plus size={18} />
                  New Application
                </button>
              </div>
            )}
            {isManager && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 flex flex-col justify-center">
                <button
                  onClick={() => navigate("/leaveease/pending-approvals")}
                  className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                  <Briefcase size={18} />
                  Review Requests
                </button>
              </div>
            )}
            {isHR && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 flex flex-col justify-center">
                <button
                  onClick={() => navigate("/leaveease/leave-types")}
                  className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                  <Building2 size={18} />
                  Configure Policies
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
      </section>

      {/* Role-specific Dashboard Views */}
      {isEmployee && (
        <>
          <EmployeeView onApply={() => setIsWizardOpen(true)} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">16</div>
                  <div className="text-sm text-blue-800 mt-1">Days Available</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-green-800 mt-1">Approved</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Upcoming Time Off</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <div>
                    <div className="font-medium">Annual Leave</div>
                    <div className="text-sm text-gray-500">Feb 10-12, 2025</div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    3 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isManager && (
        <>
          <ManagerView />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4">Team Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Approvals</span>
                  <span className="text-lg font-bold text-green-600">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Team Size</span>
                  <span className="text-lg font-bold text-gray-700">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On Leave Today</span>
                  <span className="text-lg font-bold text-amber-600">2</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4">Approval Rate</h3>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                  Review Pending Requests
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                  View Team Calendar
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                  Generate Team Report
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isHR && (
        <>
          <HRView />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">System Health</h3>
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                </div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Active Policies</h3>
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-purple-600">24</div>
                <div className="text-sm text-gray-500">Configured</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Pending Tasks</h3>
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-amber-600">8</div>
                <div className="text-sm text-gray-500">Requires Attention</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Total Employees</h3>
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-gray-700">342</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Activity */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Recent Activity ({currentRole === 'employee' ? 'Your' : currentRole === 'manager' ? 'Team' : 'System'})
            </h3>
            <p className="text-sm text-gray-500">
              {currentRole === 'employee' ? 'Your latest requests and updates'
               : currentRole === 'manager' ? 'Team leave requests requiring attention'
               : 'System-wide leave activities'}
            </p>
          </div>
          <button
            onClick={() => navigate("/leaveease/my-requests")}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Ref ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Type
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Duration
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.slice(0, 4).map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-5 font-mono text-xs text-gray-400">
                    {request.id}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-800 text-sm">
                    {request.type}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-blue-600">
                    {request.days} Days
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => navigate("/leaveease/my-requests")}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Role-specific Actions */}
      <div className={`grid grid-cols-1 ${isHR ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {isEmployee && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to make the most of your leave benefits.
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Leave Policy →
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Balance Forecast</h3>
              <p className="text-sm text-gray-600 mb-2">
                You'll accrue <span className="font-bold">2.5 days</span> next month
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </>
        )}

        {isManager && (
          <>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4">Team Coverage</h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-bold">92%</span> coverage for next week
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4">Approval Timeline</h3>
              <p className="text-sm text-gray-600">
                Average approval time: <span className="font-bold">2.3 days</span>
              </p>
            </div>
          </>
        )}

        {isHR && (
          <>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">System Analytics</h3>
              <p className="text-sm text-gray-600">
                <span className="font-bold">24%</span> increase in leave applications this month
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Compliance Status</h3>
              <p className="text-sm text-gray-600">
                <span className="font-bold">100%</span> compliant with labor laws
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Upcoming Tasks</h3>
              <p className="text-sm text-gray-600">
                <span className="font-bold">3</span> policy reviews due next week
              </p>
            </div>
          </>
        )}
      </div>

      <footer className="py-10 text-center space-y-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Powered by Flexi HRMS Engine
        </p>
        <p className="text-xs text-gray-500">
          Currently viewing as: <span className="font-semibold">{currentRole.toUpperCase()}</span> • {roleData.name} • {roleData.department}
        </p>
      </footer>

      <ApplyLeaveWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default LeaveEaseDashboard;