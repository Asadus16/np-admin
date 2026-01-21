"use client";

export function SecuritySettingsTab() {
  return (
    <div className="space-y-6">
      {/* Authentication */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Authentication</h2>
        </div>
        <div className="p-4 space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <div>
              <span className="text-sm font-medium text-gray-700">Require email verification</span>
              <p className="text-xs text-gray-500">Users must verify email before accessing account</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <div>
              <span className="text-sm font-medium text-gray-700">Enable phone OTP login</span>
              <p className="text-xs text-gray-500">Allow users to login via phone OTP</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" />
            <div>
              <span className="text-sm font-medium text-gray-700">Require 2FA for admins</span>
              <p className="text-xs text-gray-500">Force two-factor authentication for admin accounts</p>
            </div>
          </label>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Password Policy</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
            <input
              type="number"
              defaultValue="8"
              className="w-32 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Require uppercase letter</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Require number</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Require special character</span>
          </label>
        </div>
      </div>

      {/* Session Settings */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Session Settings</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue="60"
              className="w-32 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Allow &quot;Remember Me&quot; option</span>
          </label>
        </div>
      </div>
    </div>
  );
}
