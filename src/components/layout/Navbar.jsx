import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-50">
      {/* Mobile Menu Button - shows on small screens, hidden on medium and up */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <RxHamburgerMenu className="w-6 h-6" />
      </button>

      <div className="w-full flex justify-center lg:justify-start">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Open Test Series
        </Link>
      </div>
    </header>
  );
}
