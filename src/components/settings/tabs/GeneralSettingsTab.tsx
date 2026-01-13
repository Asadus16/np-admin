"use client";

export function GeneralSettingsTab() {
  return (
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
  );
}
