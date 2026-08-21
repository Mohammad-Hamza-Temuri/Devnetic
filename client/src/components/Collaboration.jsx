const roles = ["React Developer", "Node.js Developer", "UI/UX Designer"];

const Collaboration = () => {
  return (
    <section className="px-6 lg:px-16 py-20 lg:py-28">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide font-heading">
          Community
        </span>
        <h2 className="font-heading capitalize text-3xl lg:text-5xl font-bold text-gray-900 mt-3 leading-tight">
          Don't Just Build Alone
        </h2>
        <p className="text-gray-600 mt-4">
          Great products rarely come from one person working in isolation.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        {roles.map((role, index) => (
          <div key={role} className="w-full flex flex-col items-center gap-4">
            <div className="w-full text-center bg-white border border-gray-200 rounded-xl py-4 px-6 font-medium text-gray-800 shadow-sm">
              {role}
            </div>
            {index < roles.length - 1 && (
              <span className="text-2xl text-primary font-bold">+</span>
            )}
          </div>
        ))}

        <span className="text-2xl text-primary font-bold">+</span>

        <div className="w-full text-center bg-white border border-gray-200 rounded-xl py-4 px-6 font-medium text-gray-800 shadow-sm">
          Project Idea
        </div>

        <span className="text-3xl text-primary">↓</span>

        <div className="w-full text-center bg-primary rounded-xl py-4 px-6 font-bold text-white shadow-md font-heading">
          DEVNETIC
        </div>

        <span className="text-3xl text-primary">↓</span>

        <div className="font-heading text-xl font-semibold text-gray-900">
          Build Together
        </div>
      </div>
    </section>
  );
};

export default Collaboration;