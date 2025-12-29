export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to your admin dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Section 1
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-lg">
            Content placeholder
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Section 2
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-lg">
            Content placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
