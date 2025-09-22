import { Link, useLocation } from "react-router-dom";
import {
  FaBookOpen,
  FaFileAlt,
  FaFlask,
  FaHistory,
  FaHome,
} from "react-icons/fa";

const navItems = [
  { to: "/", icon: FaHome, label: "Dashboard" },
  { to: "/exams", icon: FaFileAlt, label: "All Mock Tests" },
  { to: "/topics", icon: FaFlask, label: "Tests by Topic" },
  { to: "/subjects", icon: FaBookOpen, label: "Tests by Subject" },
  { to: "/favorites", icon: FaFlask, label: "Saved / Favorite Tests" },
  { to: "/attempts", icon: FaHistory, label: "Your Test Results" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-20 md:w-64 bg-white shadow-md flex flex-col">
      <nav className="flex-1 flex flex-col p-2 md:p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={label} // tooltip for collapsed sidebar
              className={`flex items-center gap-2 md:gap-3 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-colors duration-200 
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
