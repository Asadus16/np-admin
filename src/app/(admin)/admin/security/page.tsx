"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, History, AlertTriangle, Check } from "lucide-react";

const sessions = [
  { id: 1, device: "Chrome on MacOS", location: "San Francisco, CA", ip: "192.168.1.100", lastActive: "Just now", current: true },
  { id: 2, device: "Safari on iPhone", location: "San Francisco, CA", ip: "192.168.1.101", lastActive: "2 hours ago", current: false },
  { id: 3, device: "Firefox on Windows", location: "New York, NY", ip: "10.0.0.50", lastActive: "Yesterday", current: false },
];

const securityEvents = [
  { id: 1, event: "Password changed", time: "2024-03-15 10:30:00", status: "success" },
  { id: 2, event: "2FA enabled", time: "2024-03-10 14:20:00", status: "success" },
  { id: 3, event: "Failed login attempt", time: "2024-03-08 09:15:00", status: "warning" },
  { id: 4, event: "New device login", time: "2024-03-05 16:45:00", status: "info" },
];

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({ current: "", new: "", confirm: "" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Key className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Update your password regularly</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">2FA is enabled</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your account is protected with two-factor authentication.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">2FA is disabled</span>
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                Enable two-factor authentication for better security.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Active Sessions</h2>
            <p className="text-sm text-gray-500">Manage your active sessions across devices</p>
          </div>
        </div>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{session.device}</span>
                    {session.current && (
                      <span className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {session.location} - {session.ip} - {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button className="text-sm text-red-600 hover:text-red-700">Revoke</button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-red-600 hover:text-red-700">
          Revoke all other sessions
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Security Events</h2>
            <p className="text-sm text-gray-500">Recent security-related activity</p>
          </div>
        </div>
        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.status === "success" ? "bg-green-500" :
                  event.status === "warning" ? "bg-yellow-500" : "bg-blue-500"
                }`} />
                <span className="text-sm text-gray-900">{event.event}</span>
              </div>
              <span className="text-xs text-gray-500">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
