import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const availabilityStyles = {
  available: "bg-green-100 text-green-700",
  unavailable: "bg-gray-100 text-gray-600",
};

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchDevelopers() {
      const res = await fetch("http://localhost:3000/profile");
      const data = await res.json();
      setDevelopers(data);
    }
    fetchDevelopers();
  }, []);

  function toggleExpand(e, developerId) {
    e.preventDefault(); // stop the click from also triggering the card's Link navigation
    setExpandedId((prev) => (prev === developerId ? null : developerId));
  }

  return (
    <div className="px-6 lg:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Developers</h1>

      {developers.length === 0 && (
        <p className="text-gray-500">No developers found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {developers.map((developer) => {
          const isExpanded = expandedId === developer._id;
          const skills = developer.skills || [];
          const visibleSkills = isExpanded ? skills : skills.slice(0, 4);
          const remaining = skills.length - 4;

          return (
            <Link
              key={developer._id}
              to={`/developers/${developer.user._id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Avatar + name + headline */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
                  {developer.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {developer.user?.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{developer.headline}</p>
                </div>
              </div>

              {/* Bio excerpt */}
              {developer.bio && (
                <p className="text-sm text-gray-500 mt-4 line-clamp-2">{developer.bio}</p>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {visibleSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))}

                  {!isExpanded && remaining > 0 && (
                    <button
                      onClick={(e) => toggleExpand(e, developer._id)}
                      className="text-xs text-primary font-medium hover:underline cursor-pointer"
                    >
                      +{remaining} more
                    </button>
                  )}

                  {isExpanded && skills.length > 4 && (
                    <button
                      onClick={(e) => toggleExpand(e, developer._id)}
                      className="text-xs text-primary font-medium hover:underline cursor-pointer"
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}

              {/* Availability badge */}
              <span
                className={`self-start mt-4 text-xs font-medium capitalize rounded-full px-3 py-1 ${
                  availabilityStyles[developer.availability] || "bg-gray-100 text-gray-600"
                }`}
              >
                {developer.availability}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Developers;