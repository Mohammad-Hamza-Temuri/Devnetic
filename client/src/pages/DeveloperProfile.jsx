import API_URL from "../config/api.js";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Github, Globe, Linkedin } from "lucide-react";
import { getAvailabilityOption } from "../config/availability.js";

const DeveloperProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`);
        const data = await res.json();
        setProfile(res.ok ? data : null);
      } catch (error) {
        console.error("Failed to fetch developer profile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-3xl">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-600 mb-4">Developer profile not found</p>
          <Link to="/developers" className="text-primary hover:underline">
            ← Back to Developers
          </Link>
        </div>
      </div>
    );
  }

  const availabilityOption = getAvailabilityOption(profile.availability);

  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl">
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Header - avatar + name + headline + availability */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shrink-0">
              {profile.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.user?.name}</h1>
              <p className="text-gray-500">{profile.headline}</p>
              {profile.availability && (
                <span
                  className={`inline-block mt-2 text-xs font-medium capitalize rounded-full px-3 py-1 ${
                    availabilityOption?.badgeClass || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {availabilityOption?.label || profile.availability}
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-600 leading-relaxed mt-6">{profile.bio}</p>
          )}

          {/* Location + experience */}
          <div className="flex gap-6 mt-5 text-sm text-gray-500">
            {profile.location && <p>📍 {profile.location}</p>}
            {profile.yearsOfExperience && (
              <p>{profile.yearsOfExperience} years of experience</p>
            )}
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-6">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <Globe size={16} />
                Portfolio
              </a>
            )}
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperProfile;