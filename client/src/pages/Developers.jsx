import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Github, Globe, Linkedin, Filter, X } from "lucide-react";
import SkillMultiSelect from "../components/SkillMultiSelect";

const availabilityStyles = {
  available: "bg-green-100 text-green-700",
  unavailable: "bg-red-100 text-red-600",
};

// Filter Modal Component for Mobile
const FilterModal = ({ 
  isOpen, 
  onClose, 
  searchTerm, 
  setSearchTerm, 
  skillFilter, 
  setSkillFilter, 
  availabilityFilter, 
  setAvailabilityFilter,
  clearFilters 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <div className="flex items-center gap-3">
            {(searchTerm || skillFilter.length > 0 || availabilityFilter) && (
              <button
                onClick={() => {
                  clearFilters();
                  onClose();
                }}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-5">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Search Developer</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by designation..."
              className="w-full bg-white rounded-xl border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
            <SkillMultiSelect selectedSkills={skillFilter} onChange={setSkillFilter} />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Availability</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityFilter === "available"}
                  onChange={() =>
                    setAvailabilityFilter(availabilityFilter === "available" ? "" : "available")
                  }
                  className="accent-primary w-4 h-4"
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
                  className="accent-primary w-4 h-4"
                />
                Unavailable
              </label>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full bg-primary text-white rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors mt-4"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const clearFilters = () => {
    setSearchTerm("");
    setAvailabilityFilter("");
    setSkillFilter([]);
  };

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

  // Count active filters
  const activeFilterCount = (searchTerm ? 1 : 0) + (availabilityFilter ? 1 : 0) + skillFilter.length;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
      {/* Header with Filter Button - Mobile only */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
          {developers.length > 0 && (
            <span className="text-sm text-gray-500">
              {developers.length} developer{developers.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors relative"
        >
          <Filter size={18} className="text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - developer list */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          {developers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No developers found matching your criteria.</p>
              <button 
                onClick={clearFilters}
                className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
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
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
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
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {developer.yearsOfExperience !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase size={12} />
                        {developer.yearsOfExperience} yrs experience
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium capitalize rounded-full px-3 py-1 ${
                        availabilityStyles[availabilityKey] || "bg-gray-100 text-gray-600"
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
                      {developer.skills.length > 5 && (
                        <span className="text-xs text-gray-400">
                          +{developer.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Link buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
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

        {/* Right column - filters (desktop only) */}
        <div className="hidden lg:block w-[40%] lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
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

            {/* Clear Filters Button - Desktop */}
            {(searchTerm || skillFilter.length > 0 || availabilityFilter) && (
              <button
                onClick={clearFilters}
                className="w-full mt-2 flex items-center justify-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium transition-colors py-2 border border-red-200 rounded-xl hover:bg-red-50"
              >
                <X size={16} />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        skillFilter={skillFilter}
        setSkillFilter={setSkillFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        clearFilters={clearFilters}
      />
    </div>
  );
};

export default Developers;