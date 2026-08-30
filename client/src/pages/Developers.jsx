import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Github, Globe, Linkedin } from "lucide-react";
import SkillMultiSelect from "../components/SkillMultiSelect";

const availabilityStyles = {
  available: "bg-green-100 text-green-700",
  unavailable: "bg-red-100 text-red-600",
};

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (availabilityFilter) params.append("availability", availabilityFilter);
      skillFilter.forEach((skill) => params.append("skills", skill));

      const res = await fetch(`http://localhost:3000/profile?${params.toString()}`);
      const data = await res.json();
      setDevelopers(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, availabilityFilter, skillFilter]);

  return (
    <div className="px-6 lg:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Developers</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - developer list */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          {developers.length === 0 && (
            <p className="text-gray-500">No developers found.</p>
          )}

          {developers.map((developer) => {
            const availabilityKey = developer.availability?.toLowerCase();

            return (
              <Link
                key={developer._id}
                to={`/developers/${developer.user._id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start gap-4"
              >
                {/* Avatar */}
                <div className="w-16 h-16
                 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {developer.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[18px] font-semibold text-gray-900">{developer.user?.name}</h3>
                  <p className="text-sm text-gray-500">{developer.headline}</p>
                  {developer.location && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin size={12} />
                      {developer.location}
                    </p>
                  )}

                  {/* Experience + availability row */}
                  <div className="flex items-center gap-3 mt-3">
                    {developer.yearsOfExperience !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase size={12} />
                        {developer.yearsOfExperience} yrs experience
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium capitalize rounded-full px-3 py-1 ${availabilityStyles[availabilityKey] || "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {developer.availability}
                    </span>
                  </div>

                  {/* Skills */}
                  {developer.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {developer.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Link buttons */}
                  {/* Link buttons */}
                  <div className="flex gap-2 mt-4">
                    {developer.githubUrl && (
                      <a
                        href={developer.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs bg-[#181717] text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                    {developer.linkedInUrl && (
                      <a
                        href={developer.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs bg-[#0A66C2] text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity"
                      >
                        <Linkedin size={14} />
                        LinkedIn
                      </a>
                    )}
                    {developer.portfolioUrl && (
                      <a
                        href={developer.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs bg-primary text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity"
                      >
                        <Globe size={14} />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right column - search + filters (to be wired up) */}
        <div className="w-full lg:w-[40%] bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-6 h-fit">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-4">Search by Filters</h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">Search Developer</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Designation..."
            className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Skill</label>
          <SkillMultiSelect selectedSkills={skillFilter} onChange={setSkillFilter} />

          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Availability</label>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityFilter === "available"}
                onChange={() =>
                  setAvailabilityFilter(availabilityFilter === "available" ? "" : "available")
                }
                className="accent-primary"
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityFilter === "unavailable"}
                onChange={() =>
                  setAvailabilityFilter(availabilityFilter === "unavailable" ? "" : "unavailable")
                }
                className="accent-primary"
              />
              Unavailable
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;