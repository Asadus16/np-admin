"use client";

import { useState } from "react";
import { Shield, Edit, Check } from "lucide-react";

const roles = [
  {
    id: 1,
    name: "Lead Technician",
    description: "Can manage other technicians and view all jobs",
    permissions: ["view_jobs", "manage_jobs", "view_team", "manage_team", "view_schedule"],
    isDefault: false,
  },
  {
    id: 2,
    name: "Technician",
    description: "Can view and manage assigned jobs",
    permissions: ["view_jobs", "manage_jobs", "view_schedule"],
    isDefault: true,
  },
  {
    id: 3,
    name: "Apprentice",
    description: "Can only view assigned jobs",
    permissions: ["view_jobs", "view_schedule"],
    isDefault: false,
  },
];

const allPermissions = [
  { id: "view_jobs", name: "View Jobs", description: "Can view job details" },
  { id: "manage_jobs", name: "Manage Jobs", description: "Can update job status and details" },
  { id: "view_team", name: "View Team", description: "Can view team member profiles" },
  { id: "manage_team", name: "Manage Team", description: "Can assign and manage team members" },
  { id: "view_schedule", name: "View Schedule", description: "Can view the calendar and schedules" },
  { id: "manage_schedule", name: "Manage Schedule", description: "Can modify schedules" },
];

export default function TechnicianRolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Technician Roles</h1>
        <p className="text-sm text-gray-500 mt-1">Define permissions for different technician roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-700">Roles</h2>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedRole.id === role.id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{role.name}</span>
                {role.isDefault && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Default</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{role.description}</p>
            </button>
          ))}
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{selectedRole.name}</h2>
                <p className="text-sm text-gray-500">{selectedRole.description}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Permissions</h3>
              <div className="space-y-3">
                {allPermissions.map((permission) => {
                  const hasPermission = selectedRole.permissions.includes(permission.id);
                  return (
                    <div
                      key={permission.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        hasPermission ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-medium ${hasPermission ? "text-green-900" : "text-gray-400"}`}>
                          {permission.name}
                        </p>
                        <p className={`text-xs ${hasPermission ? "text-green-600" : "text-gray-400"}`}>
                          {permission.description}
                        </p>
                      </div>
                      {hasPermission && <Check className="h-5 w-5 text-green-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
