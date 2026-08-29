import { Link } from "react-router-dom";
import SiteLogo from "../assets/Devnetic-Logo-Transparent.png";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 lg:px-16 py-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={SiteLogo} alt="Devnetic logo" className="w-52" />
      </Link>

      {/* Nav links - hidden on mobile */}
      <nav className="hidden lg:flex items-center gap-8">
        <a href="#how-it-works" className="text-gray-200 hover:text-white transition-colors">
          How It Works
        </a>
        <Link to="/login?redirect=/projects" className="text-gray-200 hover:text-white transition-colors">Explore Projects</Link>
        <Link to="/login" className="text-gray-200 hover:text-white transition-colors">
          Login
        </Link>
        <Link
          to="/signup"
          className="rounded-xl py-2.5 px-6 text-white bg-primary hover:bg-primary-dark transition-colors font-medium"
        >
          Sign Up
        </Link>
      </nav>

      {/* Mobile: just show Sign Up button */}
      <Link
        to="/signup"
        className="lg:hidden rounded-xl py-2 px-5 text-white bg-primary hover:bg-primary-dark transition-colors font-medium text-sm"
      >
        Sign Up
      </Link>
    </header>
  );
};

export default Header;