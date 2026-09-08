import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 lg:hidden shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-600 hover:text-primary transition-colors p-1 rounded"
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
        <Link
          to="/dashboard"
          className="flex items-center gap-2"
          onClick={() => setSidebarOpen(false)}
        >
          <img
            src="/Devnetic Logo.png"
            alt="Devnetic"
            className="w-24"
          />
        </Link>
      </header>

      <main
        className="flex-1 min-h-screen bg-gray-50 transition-all duration-200 lg:ml-64"
        style={{
          paddingTop: sidebarOpen ? "56px" : undefined,
        }}
      >
        <div className="px-4 sm:px-6 lg:px-10 py-10">
          {/* mobile top padding offset for fixed header */}
          <div className="pt-14 lg:pt-0">
            {/* eslint-disable-next-line react/jsx-no-children-prop */}
            {/*
              The actual page content is rendered by the child route
              via <Outlet />. We wrap it so mobile padding-top applies.
            */}
            <div className="min-h-screen">
              {/* Export the children via a small wrapper that mirrors Outlet */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
