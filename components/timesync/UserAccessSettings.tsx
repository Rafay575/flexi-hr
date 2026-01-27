import React, { useState } from "react";
import { UserCog, Shield, Users, Plus, Search } from "lucide-react";

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export const UserAccessSettings: React.FC = () => {
  const [roles] = useState<UserRole[]>([
    {
      id: "1",
      name: "Employee",
      description: "Basic employee access - view own attendance",
      permissions: ["view_own_attendance", "request_regularization", "view_schedule"],
      userCount: 1250,
    },
    {
      id: "2",
      name: "Manager",
      description: "Team management access",
      permissions: ["view_team_attendance", "approve_requests", "manage_schedules"],
      userCount: 85,
    },
    {
      id: "3",
      name: "HR Admin",
      description: "Full HR administrative access",
      permissions: ["full_access", "manage_policies", "manage_devices"],
      userCount: 12,
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Access</h1>
          <p className="text-slate-500 mt-1">
            Manage roles and permissions for TimeSync module
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {role.userCount} users
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{role.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{role.description}</p>
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map((perm) => (
                <span
                  key={perm}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                >
                  {perm.replace(/_/g, " ")}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="text-xs text-slate-400">
                  +{role.permissions.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};