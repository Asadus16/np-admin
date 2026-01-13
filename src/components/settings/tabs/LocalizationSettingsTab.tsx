"use client";

import { MapPin } from "lucide-react";

const SERVICE_AREAS = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

export function LocalizationSettingsTab() {
  return (
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
            {SERVICE_AREAS.map((city) => (
              <span key={city} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                <MapPin className="h-3 w-3" />
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
