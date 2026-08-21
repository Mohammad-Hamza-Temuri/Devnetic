
// Placeholder data - this will be replaced with real backend data
const placeholderUser = { name: "Hamza" };

const placeholderProfile = {
  headline: "Backend Developer",
  skills: ["Node.js", "Express", "MongoDB"],
  availability: "available",
};

const placeholderProjects = [
  { _id: "1", title: "Devnetic Backend", category: "Web Development", techStack: ["Node.js", "Express", "MongoDB"] },
  { _id: "2", title: "Portfolio Website", category: "Frontend", techStack: ["React", "Tailwind"] },
];

const placeholderInvitations = [
  { _id: "1", projectTitle: "Court Konnect" },
];

const Dashboard = () => {
  return (
    <div className="px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {placeholderUser.name}
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening on Devnetic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - profile + invitations */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile summary card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Your Profile</h2>
            <p className="text-lg font-medium text-gray-900">{placeholderProfile.headline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {placeholderProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3 capitalize">{placeholderProfile.availability}</p>
            <button className="mt-4 w-full rounded-xl py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors text-sm font-medium">
              Edit Profile
            </button>
          </div>

          {/* Invitations preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Invitations</h2>
            {placeholderInvitations.length === 0 ? (
              <p className="text-sm text-gray-500">No pending invitations.</p>
            ) : (
              <p className="text-sm text-gray-600">
                You have {placeholderInvitations.length} pending invitation(s).
              </p>
            )}
            <button className="mt-4 w-full rounded-xl py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors text-sm font-medium">
              View All
            </button>
          </div>
        </div>

        {/* Right column - projects feed */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
            <button className="rounded-xl py-2 px-5 bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
              + Create Project
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {placeholderProjects.map((project) => (
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
      </div>
    </div>
  );
};

export default Dashboard;