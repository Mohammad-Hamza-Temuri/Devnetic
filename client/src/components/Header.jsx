import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import SiteLogo from "../assets/Devnetic-Logo-Transparent.png";

const Header = () => {
  const navigate = useNavigate();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = Boolean(token && userName);
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "?";

  // Close user dropdown on outside click (desktop)
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close mobile menu when resizing up to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 lg:px-16 py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={SiteLogo} alt="Devnetic logo" className="w-52" />
        </Link>

        {/* ===== Desktop nav ===== */}
        <nav className="hidden lg:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-gray-200 hover:text-white transition-colors"
          >
            How It Works
          </a>

          {!isLoggedIn && (
            <>
              <Link
                to="/login?redirect=/projects"
                className="text-gray-200 hover:text-white transition-colors"
              >
                Explore Projects
              </Link>
              <Link
                to="/login"
                className="text-gray-200 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl py-2.5 px-6 text-white bg-primary hover:bg-primary-dark transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors cursor-pointer"
                aria-label="User menu"
                aria-expanded={isUserDropdownOpen}
              >
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {userInitial}
                </span>
                <span className="text-sm font-medium text-white">
                  {userName}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-white/70 transition-transform ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <FolderKanban size={18} />
                    Projects
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ===== Mobile: hamburger button ===== */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden text-white p-1 rounded transition-colors"
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
      </header>

      {/* ===== Mobile backdrop ===== */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* ===== Mobile slide-in drawer ===== */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-[#00000B] flex flex-col z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top bar: logo on left, close on right */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            <img src={SiteLogo} alt="Devnetic logo" className="w-36" />
          </Link>
          <button
            onClick={closeMobileMenu}
            className="text-white/70 hover:text-white p-1 rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Logged-in: user info card */}
        {isLoggedIn && (
          <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shrink-0">
              {userInitial}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-white/50">Signed in</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          <a
            href="#how-it-works"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white hover:text-primary transition-colors"
          >
            How It Works
          </a>

          {!isLoggedIn && (
            <Link
              to="/login?redirect=/projects"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white hover:text-primary transition-colors"
            >
              Explore Projects
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white hover:text-primary transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white hover:text-primary transition-colors"
              >
                <User size={18} />
                My Profile
              </Link>
              <Link
                to="/projects"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white hover:text-primary transition-colors"
              >
                <FolderKanban size={18} />
                Projects
              </Link>
            </>
          )}
        </nav>

                {/* Bottom section: Login + Sign Up (logged out) OR Logout (logged in) */}
        <div className="px-5 pb-6 pt-5 border-t border-white/10">
          {!isLoggedIn ? (
            <>
              {/* Section heading */}
              <p className="text-left text-white text-base font-semibold mb-4">
                Get started
              </p>

              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center rounded-xl py-3 border border-white/25 text-white hover:bg-white hover:text-primary transition-colors font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center rounded-xl py-3 text-white bg-primary hover:bg-primary-dark transition-colors font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header;