import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const statusStyles = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    archived: "bg-gray-100 text-gray-600",
};

const SingleProject = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        async function fetchProject() {
            const res = await fetch(`http://localhost:3000/projects/${id}`);
            const data = await res.json();
            setProject(data);
        }
        fetchProject();
    }, [id]);

    return (
        <div className="px-6 lg:px-10 py-10 max-w-3xl">
            {project && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {/* Header row - title + status badge */}
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                        <span
                            className={`text-xs font-medium capitalize rounded-full px-3 py-1 shrink-0 ${statusStyles[project.status] || "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {project.status}
                        </span>
                    </div>

                    {/* Category */}
                    <p className="text-sm text-gray-500 mt-1">{project.category}</p>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mt-5">{project.description}</p>

                    {/* Tech stack tags */}
                    {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Repository link */}
                    {project.repositoryUrl && (
                        <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 text-primary hover:underline text-sm font-medium"
                        >
                            View Repository →
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleProject;