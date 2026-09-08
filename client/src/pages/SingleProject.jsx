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

  const isOwner = project && project.owner._id === localStorage.getItem("userId");

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
    <div className="min-h-screen bg-gray-50 px-6 lg:px-10 py-10">
      {project && (
        <div className="max-w-5xl mx-auto">

          {/* Top navigation */}
          <div className="mb-6">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              ← Back to Projects
            </Link>
          </div>

          {/* Project Header */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="p-8 lg:p-10">

              {/* Status + Actions */}
              <div className="flex items-center justify-between gap-4 mb-6">

                <span
                  className={`inline-flex items-center text-xs font-semibold capitalize rounded-full px-3 py-1.5 ${statusStyles[project.status] ||
                    "bg-gray-100 text-gray-600"
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                  {project.status}
                </span>

                {isOwner && (
                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => setShowModal(true)}
                      className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                      title="Invite a developer"
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline">
                        Invite Developer
                      </span>
                    </button>

                    <Link
                      to={`/projects/${project._id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                      title="Edit project"
                    >
                      <Pencil size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>

                    <button
                      onClick={handleDelete}
                      className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                )}

                <InviteModal
                  projectId={project?._id}
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                />
              </div>

              {/* Title */}
              <div className="max-w-3xl">
                <p className="text-sm font-medium text-primary mb-2">
                  {project.category}
                </p>

                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                  {project.title}
                </h1>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {project.owner?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                <p className="text-sm text-gray-500 whitespace-nowrap">
                  Posted by{" "}
                  <span className="font-medium text-gray-700">
                    {project.owner?.name}
                  </span>
                </p>
              </div>

            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Project Details */}
            <div className="p-8 lg:p-10">

              {/* Description */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  About this project
                </h2>

                <p className="text-gray-600 leading-7 max-w-4xl whitespace-pre-line">
                  {project.description}
                </p>
              </section>

              {/* Tech Stack */}
              {project.techStack?.length > 0 && (
                <>
                  <div className="border-t border-gray-100 my-8" />

                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Technology Stack
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* Repository */}
              {project.repositoryUrl && (
                <>
                  <div className="border-t border-gray-100 my-8" />

                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Project Repository
                    </h2>

                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      View Repository
                      <span>↗</span>
                    </a>
                  </section>
                </>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default SingleProject;