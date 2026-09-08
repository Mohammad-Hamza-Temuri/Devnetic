import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1 text-gray-600 transition-colors rounded hover:text-primary"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </header>

      <main className="flex-1 min-h-screen bg-gray-50 transition-all duration-200 lg:ml-64 pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;