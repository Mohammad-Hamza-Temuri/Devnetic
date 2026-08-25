import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InviteModal from "../components/InviteModal";
import { Pencil, Trash2, Plus } from "lucide-react";

const statusStyles = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-600",
};

const SingleProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`http://localhost:3000/projects/${id}`);
      const data = await res.json();
      setProject(data);
    }
    fetchProject();
  }, [id]);

  const isOwner = project && project.owner === localStorage.getItem("userId");

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to delete project");
      return;
    }

    toast.success("Project deleted");
    navigate("/projects");
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl">
      {project && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Header row - title + status badge + owner actions */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs font-medium capitalize rounded-full px-3 py-1 ${statusStyles[project.status] || "bg-gray-100 text-gray-600"
                  }`}
              >
                {project.status}
              </span>

              {isOwner && (
                <>
                  <button
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer flex items-center gap-1 p-2 rounded-lg border border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors text-xs font-medium"
                    title="Invite a developer"
                  >
                    <Plus size={16} />
                  </button>
                  <Link
                    to={`/projects/${project._id}/edit`}
                    className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors"
                    title="Edit project"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
            <InviteModal
              projectId={project?._id}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            />
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