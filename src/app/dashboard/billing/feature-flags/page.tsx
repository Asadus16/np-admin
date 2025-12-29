"use client";

import { useState } from "react";
import { Search, ToggleLeft, ToggleRight } from "lucide-react";

const featureFlags = [
  { id: 1, name: "new_vendor_onboarding", description: "Enable new vendor onboarding flow", enabled: true, environment: "production" },
  { id: 2, name: "advanced_analytics", description: "Show advanced analytics dashboard", enabled: true, environment: "production" },
  { id: 3, name: "bulk_messaging", description: "Allow bulk messaging to vendors", enabled: false, environment: "production" },
  { id: 4, name: "payment_v2", description: "Use new payment processing system", enabled: false, environment: "staging" },
  { id: 5, name: "ai_recommendations", description: "AI-powered vendor recommendations", enabled: true, environment: "staging" },
  { id: 6, name: "real_time_tracking", description: "Real-time job tracking", enabled: true, environment: "production" },
  { id: 7, name: "mobile_app_v2", description: "Enable mobile app v2 features", enabled: false, environment: "development" },
  { id: 8, name: "custom_branding", description: "Allow custom branding for vendors", enabled: true, environment: "production" },
];

export default function FeatureFlagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [flags, setFlags] = useState(featureFlags);

  const filteredFlags = flags.filter((flag) =>
    flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFlag = (id: number) => {
    setFlags(flags.map((flag) =>
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
    ));
  };

  const getEnvBadgeColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-green-50 text-green-700";
      case "staging":
        return "bg-yellow-50 text-yellow-700";
      case "development":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Feature Flags</h1>
        <p className="text-sm text-gray-500 mt-1">Manage feature toggles and rollouts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{flags.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total Flags</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-green-600">
            {flags.filter((f) => f.enabled).length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Enabled</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-400">
            {flags.filter((f) => !f.enabled).length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Disabled</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feature flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredFlags.map((flag) => (
            <div key={flag.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-gray-900">{flag.name}</code>
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${getEnvBadgeColor(flag.environment)}`}>
                    {flag.environment}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{flag.description}</p>
              </div>
              <button
                onClick={() => toggleFlag(flag.id)}
                className={`p-1 rounded transition-colors ${flag.enabled ? "text-green-600" : "text-gray-400"}`}
              >
                {flag.enabled ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>
          ))}
        </div>

        {filteredFlags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No feature flags found</p>
          </div>
        )}
      </div>
    </div>
  );
}
