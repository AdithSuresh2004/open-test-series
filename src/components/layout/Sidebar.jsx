import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaFlask,
  FaHistory,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";

export const navItems = [
  { to: "/", icon: FaHome, label: "Dashboard" },
  { to: "/exams", icon: FaFileAlt, label: "Exams" },
  { to: "/favorites", icon: FaFlask, label: "Saved Tests" },
  { to: "/attempts", icon: FaHistory, label: "Test Results" },
  { to: "/import", icon: FaCloudUploadAlt, label: "Import Data" },
  { to: "/export", icon: FaCloudDownloadAlt, label: "Export Data" },
];

export default function Sidebar({ isMobile }) {
  const location = useLocation();

  return (
    <aside
      className={`flex flex-col bg-white dark:bg-gray-800 dark:shadow-black/20 ${
        isMobile
          ? "w-full h-full fixed top-0 left-0 z-50 shadow-lg"
          : "w-64 md:flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
      }`}
    >
      <nav className="flex-1 flex flex-col p-2 md:p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={label}
              className={`flex items-center gap-2 md:gap-3 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-200"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
