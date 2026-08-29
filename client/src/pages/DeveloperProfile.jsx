import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Github, Globe, Linkedin } from "lucide-react";

const availabilityStyles = {
  available: "bg-green-100 text-green-700",
  unavailable: "bg-gray-100 text-gray-600",
};

const DeveloperProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch(`http://localhost:3000/profile/${userId}`);
      const data = await res.json();
      setProfile(data);
    }
    fetchProfile();
  }, [userId]);

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
              <span
                className={`inline-block mt-2 text-xs font-medium capitalize rounded-full px-3 py-1 ${
                  availabilityStyles[profile.availability] || "bg-gray-100 text-gray-600"
                }`}
              >
                {profile.availability}
              </span>
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