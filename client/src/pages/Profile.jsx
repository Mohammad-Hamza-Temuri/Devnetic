import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Profile = () => {

    const [loading, setLoading] = useState(false);
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

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/profile", {
            method: "PUT",
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
        console.log("Profile updated!", data);
        setLoading(false);

        if(!res.ok){
            toast.error(data.message || "Failed to update profile");
            return;
        }
        toast.success("Profile updated successfully!");
    }

    useEffect(() => {
        async function fetchProfile() {
            const userId = localStorage.getItem("userId");
            const res = await fetch(`http://localhost:3000/profile/${userId}`)

            const data = await res.json();

            setHeadline(data.headline);
            setBio(data.bio);
            setLocation(data.location);
            setYearsOfExperience(data.yearsOfExperience);
            setSkills(data.skills);
            setGithubUrl(data.githubUrl);
            setPortfolioUrl(data.portfolioUrl);
            setLinkedInUrl(data.linkedInUrl);
            setAvailability(data.availability);
        }
        fetchProfile();
    }, [])

    return (
        <div className="px-6 lg:px-10 py-10 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Headline</label>
                <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Headline"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Bio</label>
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Years of Experience</label>
                <input
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="Years Of Experience"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Skills</label>
                <input
                    type="text"
                    value={skills.join(", ")}
                    onChange={(e) => setSkills(e.target.value.split(",").map((s) => s.trim()))}
                    placeholder="Skills"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Github Url</label>
                <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="Github Url"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Portfolio Url</label>
                <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="Portfolio Url"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">LinkedIn Url</label>
                <input
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="LinkedIn Url"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Availability</label>
                <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="Availability"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                    disabled={loading}
                    type="submit"
                    className=" rounded-xl py-3 text-white bg-primary hover:bg-primary-dark transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
               
            </form>
        </div>
    )
}

export default Profile