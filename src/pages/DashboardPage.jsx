// DashboardPage.jsx
export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Welcome to your dashboard! This is a placeholder page.
      </p>
      <div className="mt-6 w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Add your dashboard widgets here.
        </p>
      </div>
    </div>
  );
}
