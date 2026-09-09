import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InviteModal from "../components/InviteModal";
import { 
  Pencil, Trash2, Plus, GitBranch, Tag, ExternalLink, 
  ArrowLeft, MoreVertical, Folder, FileText, Code, 
  MessageCircle, Send, User, Clock 
} from "lucide-react";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const statusIcons = {
  active: "🟢",
  completed: "✅",
  archived: "📦",
};

const SingleProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch project details
  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch {
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:3000/comments/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    
    if (id) {
      fetchComments();
    }
  }, [id]);

  const isOwner = project && project.owner._id === localStorage.getItem("userId");

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
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

      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch {
      toast.error("Something went wrong");
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.dropdown-menu')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  // Handle comment submission
  async function handleSubmitComment(e) {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3000/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment.trim() }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to post comment");
      }

      toast.success("Comment posted!");
      setNewComment("");
      
      // Refetch comments to get properly populated user data
      const refreshedRes = await fetch(`http://localhost:3000/comments/${id}`);
      if (refreshedRes.ok) {
        const refreshedComments = await refreshedRes.json();
        setComments(refreshedComments);
      }
    } catch (error) {
      toast.error(error.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle comment deletion
  async function handleDeleteComment(commentId) {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete comments");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete comment");
      }

      setComments(prev => prev.filter(comment => comment._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete comment");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <Link to="/projects" className="text-primary hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Top navigation */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>

        {/* Project Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Header with gradient accent */}
          <div className="relative h-2 bg-linear-to-r from-primary via-purple-500 to-primary"></div>

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Status + Actions */}
            <div className="flex items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-2 text-xs font-semibold capitalize rounded-full px-4 py-1.5 border ${statusStyles[project.status] ||
                    "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                >
                  <span className="text-base">{statusIcons[project.status] || "📌"}</span>
                  {project.status}
                </span>
              </div>

              {isOwner && (
                <>
                  {/* Desktop Actions */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => setShowModal(true)}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
                    >
                      <Plus size={16} />
                      <span>Invite</span>
                    </button>

                    <Link
                      to={`/projects/${project._id}/edit`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all text-sm font-medium"
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer text-sm font-medium"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Mobile Dropdown */}
                  <div className="relative sm:hidden dropdown-menu">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                      aria-label="More options"
                    >
                      <MoreVertical size={20} className="text-gray-700" />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <Plus size={18} />
                          Invite Developer
                        </button>

                        <Link
                          to={`/projects/${project._id}/edit`}
                          onClick={() => setShowDropdown(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <Pencil size={18} />
                          Edit Project
                        </Link>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleDelete();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* TWO ROWS: Row 1 - Title & Date, Row 2 - Category & Posted By */}
            <div className="space-y-6">
              {/* Row 1: Project Title & Date */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-45">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    <FileText size={14} />
                    <span>Project</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight wrap-break-word">
                    {project.title}
                  </h1>
                </div>

                {project.createdAt && (
                  <div className="shrink-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      <Clock size={14} />
                      <span>Date</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      
                      <span className="whitespace-nowrap font-medium">
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Category & Posted By */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                {project.category && (
                  <div className="shrink-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      <Tag size={14} />
                      <span>Category</span>
                    </div>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/20 text-primary text-sm font-medium whitespace-nowrap">
                      <Folder size={14} />
                      {project.category}
                    </span>
                  </div>
                )}

                <div className="shrink-0">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    <User size={14} />
                    <span>Posted by</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20 shrink-0">
                      {project.owner?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {project.owner?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Project Details */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Description */}
            <section>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                <FileText size={14} />
                <span>About this project</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-100">
                <p className="text-gray-700 leading-relaxed max-w-4xl whitespace-pre-line">
                  {project.description || "No description provided."}
                </p>
              </div>
            </section>

            {/* Tech Stack */}
            {project.techStack?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  <Code size={14} />
                  <span>Technology Stack</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-xl bg-linear-to-br from-gray-50 to-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary/50 hover:shadow-sm transition-all hover:-translate-y-0.5 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Repository */}
            {project.repositoryUrl && (
              <section>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  <GitBranch size={14} />
                  <span>Repository</span>
                </div>
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-linear-to-r from-primary to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 group"
                >
                  <GitBranch size={18} />
                  View Repository
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </section>
            )}

            {/* Comments Section */}
            <section>
              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  <MessageCircle size={14} />
                  <span>Comments</span>
                  {comments.length > 0 && (
                    <span className="ml-1 text-gray-300">({comments.length})</span>
                  )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="cursor-pointer px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium shrink-0"
                    >
                      <Send size={16} />
                      <span className="hidden sm:inline">Post</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                    <MessageCircle size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => {
                      const userId = localStorage.getItem("userId");
                      const isCommentAuthor = comment.user && comment.user._id === userId;
                      
                      return (
                        <div key={comment._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                                  {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                  {comment.user?.name || "Unknown User"}
                                </span>
                                {comment.createdAt && (
                                  <span className="text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed wrap-break-word">
                                {comment.text}
                              </p>
                            </div>
                            
                            {isCommentAuthor && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                title="Delete comment"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Invite Modal */}
        <InviteModal
          projectId={project?._id}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default SingleProject;