"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Percent,
  Save,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  GeneralSettingsTab,
  PaymentSettingsTab,
  FeesSettingsTab,
  NotificationSettingsTab,
  SecuritySettingsTab,
  LocalizationSettingsTab,
} from "@/components/settings/tabs";

type TabType = "general" | "payments" | "notifications" | "security" | "localization" | "fees";

const TABS = [
  { id: "general" as const, name: "General", icon: Building2 },
  { id: "payments" as const, name: "Payments", icon: CreditCard },
  { id: "fees" as const, name: "Fees & Commissions", icon: Percent },
  { id: "notifications" as const, name: "Notifications", icon: Bell },
  { id: "security" as const, name: "Security", icon: Shield },
  { id: "localization" as const, name: "Localization", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saved, setSaved] = useState(false);
  const [feesSaving, setFeesSaving] = useState(false);

  // Ref to trigger save in FeesSettingsTab
  const triggerFeesSaveRef = useRef<(() => void) | null>(null);

  const handleSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = () => {
    if (activeTab === "fees") {
      // Trigger save in FeesSettingsTab via ref
      if (triggerFeesSaveRef.current) {
        triggerFeesSaveRef.current();
      }
    } else {
      // For other tabs, just show saved state (placeholder)
      handleSaved();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={activeTab === "fees" && feesSaving}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {activeTab === "fees" && feesSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
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
            {TABS.map((tab) => (
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
          {activeTab === "general" && <GeneralSettingsTab />}
          {activeTab === "payments" && <PaymentSettingsTab />}
          {activeTab === "fees" && (
            <FeesSettingsTab
              onSaved={handleSaved}
              onSavingChange={setFeesSaving}
              triggerSaveRef={triggerFeesSaveRef}
            />
          )}
          {activeTab === "notifications" && <NotificationSettingsTab />}
          {activeTab === "security" && <SecuritySettingsTab />}
          {activeTab === "localization" && <LocalizationSettingsTab />}
        </div>
      </div>
    </div>
  );
}
