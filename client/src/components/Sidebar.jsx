import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Mail,
  LogOut,
  Users,
  X,
  Home,
} from "lucide-react";
import SiteLogo from "../assets/Devnetic Logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", path: "/profile", icon: User },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Developers", path: "/developers", icon: Users },
  { label: "Invitations", path: "/invitations", icon: Mail },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
    if (onClose) {
      onClose();
    }
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#00000B] border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Top bar: logo on left, close button on right */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-800">
          {/* Logo */}
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <img src={SiteLogo} alt="Devnetic logo" className="w-40 lg:w-52" />
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 px-4 lg:px-6 py-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-primary"
                    : "text-white hover:bg-white hover:text-primary"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section: Back to Home + Logout */}
        <div className="px-4 lg:px-6 pb-6 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-white hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}