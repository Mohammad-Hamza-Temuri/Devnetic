import API_URL from "../config/api.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          return;
        }

        const res = await fetch(`${API_URL}/profile/${userId}`);
        const data = await res.json();

        if (!res.ok) {
          // A new user may not have a DeveloperProfile yet.
          // Keep profile as null so the dashboard does not crash.
          setProfile(null);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(null);
      }
    }

    async function fetchProjects() {
      try {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();

        if (!res.ok) {
          setProjects([]);
          return;
        }

        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      }
    }

    async function fetchInvitations() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/invitations/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setInvitations([]);
          return;
        }

        setInvitations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
        setInvitations([]);
      }
    }

    fetchInvitations();
    fetchProfile();
    fetchProjects();
  }, []);

  return (
    <div className="px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {localStorage.getItem("userName")}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening on Devnetic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - profile + invitations */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile summary card */}
          {profile ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">
                Your Profile
              </h2>

              <p className="text-lg font-medium text-gray-900">
                {profile.headline || "No headline added yet"}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No skills added yet.
                  </p>
                )}
              </div>

              {profile.availability && (
                <p className="text-sm text-gray-500 mt-3 capitalize">
                  {profile.availability}
                </p>
              )}

              <Link
                to="/profile"
                className="mt-4 w-full block text-center rounded-xl py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors text-sm font-medium"
              >
                Edit Profile
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">
                Your Profile
              </h2>

              <p className="text-sm text-gray-500">
                You haven't created your developer profile yet.
              </p>

              <Link
                to="/profile"
                className="mt-4 w-full block text-center rounded-xl py-2 bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                Create Profile
              </Link>
            </div>
          )}

          {/* Invitations preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">
              Invitations
            </h2>

            {invitations.length === 0 ? (
              <p className="text-sm text-gray-500">
                No pending invitations.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                You have {invitations.length} pending invitation(s).
              </p>
            )}

            <Link
              to="/invitations"
              className="mt-4 w-full block text-center rounded-xl py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors text-sm font-medium cursor-pointer"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Right column - projects feed */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">
              Recent Projects
            </h2>

            <Link
              to="/projects/new"
              className="rounded-xl py-2 px-5 bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              + Create Project
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects
              .slice(0, 4)
              .filter((project) => project.title)
              .map((project) => (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {project.category}
                    </p>

                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {project.owner?.name?.charAt(0).toUpperCase() || "?"}
                      </span>

                      Posted by {project.owner?.name}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;