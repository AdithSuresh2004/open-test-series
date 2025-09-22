import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0 md:w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
