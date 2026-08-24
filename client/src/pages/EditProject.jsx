import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProject = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription,] = useState("");
    const [category, setCategory] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [techStack, setTechStack] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [repositoryUrl, setRepositoryUrl] = useState("");

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true);

        const requiredSkillsArray = requiredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const techStackArray = techStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                description,
                category,
                requiredSkills: requiredSkillsArray,
                techStack: techStackArray,
                startDate,
                endDate,
                repositoryUrl
            }),
        });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || "Failed to update project");
            setLoading(false);
            return;
        }
        toast.success("Project updated successfully!");
        navigate(`/projects/${id}`);
    }

    useEffect(() => {
        async function fetchProject() {
            const res = await fetch(`http://localhost:3000/projects/${id}`);
            const data = await res.json();

            setTitle(data.title);
            setDescription(data.description);
            setCategory(data.category);
            setRequiredSkills(data.requiredSkills.join(", "));
            setTechStack(data.techStack.join(", "));
            setStartDate(data.startDate ? data.startDate.slice(0, 10) : "");
            setEndDate(data.endDate ? data.endDate.slice(0, 10) : "");
            setRepositoryUrl(data.repositoryUrl);
        }
        fetchProject();
    }, [id]);

    return (
        <div className="px-6 lg:px-10 py-10 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <label className="block text-[16px] font-bold text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">
                    Required Skills <span className="font-normal text-gray-400 text-sm">(comma-separated)</span>
                </label>
                <input
                    type="text"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">
                    Tech Stack <span className="font-normal text-gray-400 text-sm">(comma-separated)</span>
                </label>
                <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. React, Express, Tailwind"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="block text-[16px] font-bold text-gray-700 mb-1">Repository Url</label>
                <input
                    type="url"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="Repository Url"
                    className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                    disabled={loading}
                    type="submit"
                    className="rounded-xl py-3 text-white bg-primary hover:bg-primary-dark transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </form>
        </div>
    )
}

export default EditProject