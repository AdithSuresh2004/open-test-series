import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar({ toggleSidebar = () => {} }) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-50
                       dark:bg-gray-800 dark:shadow-black/20">
      {/* Mobile Menu Button - shows on small screens, hidden on medium and up */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none
                   dark:text-gray-200 dark:hover:text-white"
        aria-label="Open menu"
        aria-controls="mobile-sidebar"
      >
        <RxHamburgerMenu className="w-6 h-6" />
      </button>

      <div className="w-full flex justify-center lg:justify-start">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Open Test Series
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
