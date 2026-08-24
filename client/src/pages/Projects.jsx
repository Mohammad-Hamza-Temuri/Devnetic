import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
                <Link
                    to="/projects/new"
                    className="rounded-xl py-2 px-5 bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
                >
                    + Create Project
                </Link>
            </div>
            {projects.length === 0 && (
                <p className="text-gray-500">No projects yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {projects.filter((project) => project.title).map((project) => (
                    <Link key={project._id} to={`/projects/${project._id}`}>
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
                    </Link>
                ))}
            </div>

        </div>
    )
}

export default Projects