import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, User, FolderKanban, Mail, LogOut, Users } from "lucide-react";
import SiteLogo from "../assets/Devnetic Logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", path: "/profile", icon: User },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Developers", path: "/developers", icon: Users },
  { label: "Invitations", path: "/invitations", icon: Mail },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <aside className="w-64 h-screen bg-[#00000B] border-r border-gray-100 flex flex-col justify-between fixed left-0 top-0">
      <div>
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 px-6 py-6">
          <img src={SiteLogo} alt="Devnetic logo" className="w-52" />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
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
      </div>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500  hover:bg-white transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;