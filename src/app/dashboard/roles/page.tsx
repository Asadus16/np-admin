"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Users, Shield, Check } from "lucide-react";

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all features",
    users: 2,
    permissions: ["all"],
    isSystem: true
  },
  {
    id: 2,
    name: "Admin",
    description: "Manage vendors, categories, and view reports",
    users: 5,
    permissions: ["vendors.manage", "categories.manage", "reports.view", "messages.manage"],
    isSystem: true
  },
  {
    id: 3,
    name: "Finance",
    description: "Manage billing, payouts, and transactions",
    users: 3,
    permissions: ["billing.manage", "transactions.view", "payouts.manage"],
    isSystem: false
  },
  {
    id: 4,
    name: "Support",
    description: "Handle messages and view vendor information",
    users: 8,
    permissions: ["messages.manage", "vendors.view", "technicians.view"],
    isSystem: false
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to dashboard",
    users: 12,
    permissions: ["dashboard.view", "reports.view"],
    isSystem: false
  },
];

const allPermissions = [
  { group: "Dashboard", permissions: ["dashboard.view", "dashboard.analytics"] },
  { group: "Vendors", permissions: ["vendors.view", "vendors.create", "vendors.edit", "vendors.delete", "vendors.manage"] },
  { group: "Categories", permissions: ["categories.view", "categories.create", "categories.edit", "categories.delete", "categories.manage"] },
  { group: "Technicians", permissions: ["technicians.view", "technicians.manage"] },
  { group: "Billing", permissions: ["billing.view", "billing.manage"] },
  { group: "Transactions", permissions: ["transactions.view", "payouts.manage"] },
  { group: "Messages", permissions: ["messages.view", "messages.manage"] },
  { group: "Reports", permissions: ["reports.view", "reports.export"] },
  { group: "Settings", permissions: ["settings.view", "settings.manage", "roles.manage", "audit.view"] },
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user roles and access control</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{role.name}</span>
                    {role.isSystem && (
                      <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">System</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                {role.users} users
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{selectedRole.name}</h2>
                <p className="text-sm text-gray-500">{selectedRole.description}</p>
              </div>
              {!selectedRole.isSystem && (
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Permissions</h3>
              <div className="space-y-4">
                {allPermissions.map((group) => (
                  <div key={group.group} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">{group.group}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {group.permissions.map((permission) => {
                        const hasPermission = selectedRole.permissions.includes("all") || selectedRole.permissions.includes(permission);
                        return (
                          <div
                            key={permission}
                            className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
                              hasPermission ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
                            }`}
                          >
                            {hasPermission && <Check className="h-4 w-4" />}
                            <span className="font-mono text-xs">{permission}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
