"use client";

const NOTIFICATION_ITEMS = [
  { name: "New Order", desc: "When a new order is placed", enabled: true },
  { name: "Order Completed", desc: "When an order is marked complete", enabled: true },
  { name: "Order Cancelled", desc: "When an order is cancelled", enabled: true },
  { name: "Refund Request", desc: "When a refund is requested", enabled: true },
  { name: "New Vendor Registration", desc: "When a new vendor signs up", enabled: true },
  { name: "Vendor Approval Needed", desc: "When a vendor needs approval", enabled: true },
  { name: "Daily Summary", desc: "Daily report of platform activity", enabled: false },
  { name: "Weekly Summary", desc: "Weekly report of platform activity", enabled: true },
];

export function NotificationSettingsTab() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
        </div>
        <div className="p-4 space-y-3">
          {NOTIFICATION_ITEMS.map((item) => (
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
  );
}
