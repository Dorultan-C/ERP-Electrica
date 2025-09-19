import MainLayout from "../components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to the ERP System
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Human Resources
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Manage users, vacations, attendance, and schedules
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                Settings
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Configure company and application settings
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                Coming Soon
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Projects, Finance, Inventory, and Files modules
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
