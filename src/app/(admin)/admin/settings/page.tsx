"use client";

import { useState } from "react";
import {
  Building2,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Percent,
  Users,
  MapPin,
  Clock,
  Save,
  CheckCircle,
} from "lucide-react";

type TabType = "general" | "payments" | "notifications" | "security" | "localization" | "fees";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general" as const, name: "General", icon: Building2 },
    { id: "payments" as const, name: "Payments", icon: CreditCard },
    { id: "fees" as const, name: "Fees & Commissions", icon: Percent },
    { id: "notifications" as const, name: "Notifications", icon: Bell },
    { id: "security" as const, name: "Security", icon: Shield },
    { id: "localization" as const, name: "Localization", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Platform Information */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Platform Information</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="NoProblem"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        defaultValue="support@noproblem.ae"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                      <input
                        type="tel"
                        defaultValue="+971 4 123 4567"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                      <input
                        type="url"
                        defaultValue="https://noproblem.ae"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Business Hours</h2>
                </div>
                <div className="p-4 space-y-3">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-700">{day}</span>
                      <input
                        type="time"
                        defaultValue={day === "Friday" ? "14:00" : "09:00"}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        defaultValue={day === "Friday" ? "22:00" : "18:00"}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      />
                      <label className="flex items-center gap-2 ml-4">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked={day !== "Sunday"} />
                        <span className="text-sm text-gray-600">Open</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Mode */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Maintenance Mode</h2>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Enable Maintenance Mode</span>
                      <p className="text-xs text-gray-500">Temporarily disable the platform for maintenance</p>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                    <textarea
                      rows={3}
                      defaultValue="We're currently performing scheduled maintenance. We'll be back shortly!"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Credit/Debit Cards</span>
                        <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Apple Pay</span>
                        <p className="text-xs text-gray-500">Mobile payments with Apple devices</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                        <p className="text-xs text-gray-500">Pay when service is completed</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Points Redemption</span>
                        <p className="text-xs text-gray-500">Allow customers to pay with earned points</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                </div>
              </div>

              {/* Payment Gateway */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payment Gateway</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gateway Provider</label>
                    <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option>Stripe</option>
                      <option>PayTabs</option>
                      <option>Telr</option>
                      <option>Network International</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        defaultValue="sk_live_xxxxxxxxxxxxx"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                      <input
                        type="password"
                        defaultValue="pk_live_xxxxxxxxxxxxx"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Enable test mode</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="space-y-6">
              {/* Platform Commission */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Platform Commission</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Commission Rate</label>
                      <div className="relative">
                        <input
                          type="number"
                          defaultValue="15"
                          className="w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Applied to all vendors by default</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Commission</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                        <input
                          type="number"
                          defaultValue="5"
                          className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category-specific Commissions */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Category Commissions</h2>
                  <p className="text-sm text-gray-500 mt-1">Override default commission by category</p>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { name: "Plumbing", rate: 15 },
                    { name: "Electrical", rate: 15 },
                    { name: "HVAC", rate: 12 },
                    { name: "Cleaning", rate: 18 },
                    { name: "Landscaping", rate: 15 },
                  ].map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <div className="relative w-24">
                        <input
                          type="number"
                          defaultValue={category.rate}
                          className="w-full px-3 py-1.5 pr-7 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Tax Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Enable VAT</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate</label>
                      <div className="relative">
                        <input
                          type="number"
                          defaultValue="5"
                          className="w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Registration Number</label>
                      <input
                        type="text"
                        defaultValue="100123456700003"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payout Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payout Frequency</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>Weekly</option>
                        <option>Bi-weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payout Day</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payout Amount</label>
                    <div className="relative w-48">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { name: "New Order", desc: "When a new order is placed", enabled: true },
                    { name: "Order Completed", desc: "When an order is marked complete", enabled: true },
                    { name: "Order Cancelled", desc: "When an order is cancelled", enabled: true },
                    { name: "Refund Request", desc: "When a refund is requested", enabled: true },
                    { name: "New Vendor Registration", desc: "When a new vendor signs up", enabled: true },
                    { name: "Vendor Approval Needed", desc: "When a vendor needs approval", enabled: true },
                    { name: "Daily Summary", desc: "Daily report of platform activity", enabled: false },
                    { name: "Weekly Summary", desc: "Weekly report of platform activity", enabled: true },
                  ].map((item) => (
                    <label key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked={item.enabled} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Email Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                      <input
                        type="email"
                        defaultValue="noreply@noproblem.ae"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                      <input
                        type="text"
                        defaultValue="NoProblem"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notification Emails</label>
                    <input
                      type="text"
                      defaultValue="admin@noproblem.ae, support@noproblem.ae"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of emails</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
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
          )}

          {activeTab === "localization" && (
            <div className="space-y-6">
              {/* Regional Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Regional Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Country</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>United Arab Emirates</option>
                        <option>Saudi Arabia</option>
                        <option>Qatar</option>
                        <option>Kuwait</option>
                        <option>Bahrain</option>
                        <option>Oman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>Asia/Dubai (GMT+4)</option>
                        <option>Asia/Riyadh (GMT+3)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>AED - UAE Dirham</option>
                        <option>SAR - Saudi Riyal</option>
                        <option>USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Language</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                    <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option>English</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Enable Arabic language</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Enable RTL support</span>
                  </label>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Service Areas</h2>
                  <button className="text-sm text-gray-600 hover:text-gray-900">Manage Areas</button>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"].map((city) => (
                      <span key={city} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        <MapPin className="h-3 w-3" />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
