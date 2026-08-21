import DevnetIllustration from "../assets/about devnetic.webp";

const WhatIsDevnetic = () => {
  return (
    <section className="px-6 lg:px-16 py-20 lg:py-28">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-6xl mx-auto">
        {/* Image - shows below content on mobile, left side on desktop */}
        <div className="w-full lg:w-1/2">
          <img
            src={DevnetIllustration}
            alt="Developers collaborating on Devnetic"
            className="w-full h-64 lg:h-auto object-cover rounded-2xl"
          />
        </div>

        {/* Content - shows above image on mobile, right side on desktop */}
        <div className="w-full lg:w-1/2">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide font-heading">
            About Us
          </span>
          <h2 className="font-heading capitalize text-3xl lg:text-5xl font-bold text-gray-900 mt-3 leading-tight">
            What is Devnetic
          </h2>
          <p className="text-gray-600 mt-5 leading-relaxed">
            Most developers juggle a scattered profile, a pile of side
            projects, and no easy way to find people to build with. Devnetic
            brings all of that into one place.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Build a profile that actually represents your skills and work.
            Browse real projects looking for collaborators, or post your own
            and let the right developers find you. When you're ready to team
            up, send an invite, get to work, and keep track of everything in
            one shared space — no scattered group chats, no guesswork.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Whether you're looking to join something new or find people for
            your next idea, Devnetic is where developers actually meet and
            build together.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIsDevnetic;