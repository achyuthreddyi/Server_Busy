export default function Home() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            This is your main dashboard. Use the sidebar navigation to explore different sections of the application.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Dashboard</h3>
              <p className="text-blue-600 text-sm">View your main dashboard and analytics</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Settings</h3>
              <p className="text-green-600 text-sm">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
