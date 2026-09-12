import API_URL from "../config/api.js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileExists, setProfileExists] = useState(false);

    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [skills, setSkills] = useState([]);
    const [githubUrl, setGithubUrl] = useState("");
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [linkedInUrl, setLinkedInUrl] = useState("");
    const [availability, setAvailability] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const method = profileExists ? "PUT" : "POST";

            const res = await fetch(`${API_URL}/profile`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    headline,
                    bio,
                    location,
                    yearsOfExperience,
                    skills,
                    githubUrl,
                    portfolioUrl,
                    linkedInUrl,
                    availability,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to save profile");
                return;
            }

            setProfileExists(true);
            toast.success(
                profileExists
                    ? "Profile updated successfully!"
                    : "Profile created successfully!"
            );
        } catch (error) {
            console.error("Profile save error:", error);
            toast.error("Something went wrong while saving your profile");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchProfile() {
            try {
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    toast.error("User information not found");
                    return;
                }

                const res = await fetch(`${API_URL}/profile/${userId}`);
                const data = await res.json();

                if (res.status === 404) {
                    // User exists, but they don't have a DeveloperProfile yet.
                    // Keep the default empty form values.
                    setProfileExists(false);
                    return;
                }

                if (!res.ok) {
                    toast.error(data.message || "Failed to load profile");
                    return;
                }

                setProfileExists(true);

                setHeadline(data.headline || "");
                setBio(data.bio || "");
                setLocation(data.location || "");
                setYearsOfExperience(data.yearsOfExperience || "");
                setSkills(Array.isArray(data.skills) ? data.skills : []);
                setGithubUrl(data.githubUrl || "");
                setPortfolioUrl(data.portfolioUrl || "");
                setLinkedInUrl(data.linkedInUrl || "");
                setAvailability(data.availability || "");
            } catch (error) {
                console.error("Profile fetch error:", error);
                toast.error("Failed to load profile");
            } finally {
                setProfileLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (profileLoading) {
        return (
            <div className="px-6 lg:px-10 py-10 max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Edit Profile
                </h1>

                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headline
                    </label>

                    <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Full Stack MERN Developer"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell other developers about yourself..."
                        rows="5"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Karachi, Pakistan"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                    </label>

                    <input
                        type="number"
                        value={yearsOfExperience}
                        onChange={(e) =>
                            setYearsOfExperience(e.target.value)
                        }
                        placeholder="e.g. 2"
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills
                    </label>

                    <input
                        type="text"
                        value={skills.join(", ")}
                        onChange={(e) =>
                            setSkills(
                                e.target.value
                                    .split(",")
                                    .map((skill) => skill.trim())
                                    .filter(Boolean)
                            )
                        }
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub URL
                    </label>

                    <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio URL
                    </label>

                    <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn URL
                    </label>

                    <input
                        type="url"
                        value={linkedInUrl}
                        onChange={(e) => setLinkedInUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                    </label>

                    <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select availability</option>
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="not-available">Not Available</option>
                    </select>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Saving..."
                        : profileExists
                            ? "Save Changes"
                            : "Create Profile"}
                </button>
            </form>
        </div>
    );
};

export default Profile;