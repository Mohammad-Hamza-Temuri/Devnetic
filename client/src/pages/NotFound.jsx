import { Link } from "react-router-dom";

const NotFound = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Page not found</h1>
        <p className="text-gray-500 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/"
            className="rounded-xl py-2.5 px-6 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors font-medium text-sm"
          >
            Back to Home
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="rounded-xl py-2.5 px-6 bg-primary text-white hover:bg-primary-dark transition-colors font-medium text-sm"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
