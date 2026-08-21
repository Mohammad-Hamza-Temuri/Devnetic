const steps = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Tell the community who you are, what you build and what you're looking for.",
  },
  {
    number: "02",
    title: "Discover opportunities",
    description:
      "Explore projects and developers based on skills, interests and availability.",
  },
  {
    number: "03",
    title: "Start collaborating",
    description:
      "Join projects, build teams, communicate and turn ideas into something real.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-6 lg:px-16 py-20 lg:py-28 bg-gray-50">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide font-heading">
          The Process
        </span>
        <h2 className="font-heading capitalize text-3xl lg:text-5xl font-bold text-gray-900 mt-3 leading-tight">
          How Devnetic Works
        </h2>
        <p className="text-gray-600 mt-4">
          Three simple steps between you and your next collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="font-heading text-5xl font-bold text-primary mb-4">
              {step.number}
            </div>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;