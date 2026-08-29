import { Link } from "react-router-dom";
import SiteLogo from "../assets/Devnetic-Logo-Transparent.png";

const Footer = () => {
  return (
    <footer className="px-6 lg:px-16 py-14 bg-gray-900 text-gray-300">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <img src={SiteLogo} alt="Devnetic logo" className="w-52" />
          </div>
          <p className="text-sm max-w-xs">
            A platform for developers to discover, collaborate and build
            together.
          </p>
        </div>

        {/* Platform links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login?redirect=/projects" className="hover:text-white transition-colors">Explore Projects</Link></li>
            <li><Link to="/login?redirect=/developers" className="hover:text-white transition-colors">Developers</Link></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
          </ul>
        </div>

        {/* Account links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto border-t border-gray-700 mt-10 pt-6 text-sm text-gray-400">
        © 2026 Devnetic. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;