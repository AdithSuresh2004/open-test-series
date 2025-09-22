import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-700
                 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
    </button>
  );
}
