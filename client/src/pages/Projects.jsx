import { useEffect, useState } from "react"

const Projects = () => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            const res = await fetch("http://localhost:3000/projects");
            const data = await res.json();

            setProjects(data);
        }
        fetchProjects();
    }, [])


    return (
        <div className="px-6 lg:px-10 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Projects</h1>
            {projects.length === 0 && (
                <p className="text-gray-500">No projects yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {projects.filter((project) => project.title).map((project) => (
                    <div
                        key={project._id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{project.category}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Projects