import { Link } from "react-router-dom";
import CTAImage from "../assets/Hero-design-2.webp";

const FinalCTA = () => {
  return (
    <section
      className="relative px-6 lg:px-16 py-24 text-center bg-cover bg-center"
      style={{ backgroundImage: `url(${CTAImage})` }}
    >
      {/* Overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10">
        <span className="text-white/80 font-semibold text-sm uppercase tracking-wide font-heading">
          Get Started
        </span>
        <h2 className="font-heading capitalize text-3xl lg:text-5xl font-bold text-white max-w-2xl mx-auto mt-3 leading-tight">
          Your Next Project Could Start Here
        </h2>

        <p className="text-white/80 text-lg mt-4 max-w-xl mx-auto">
          Create your profile, discover projects and find developers to build
          with.
        </p>

        <Link
          to="/signup"
          className="inline-block mt-10 rounded-xl py-3 px-8 bg-white text-primary hover:bg-gray-100 transition-colors font-semibold"
        >
          Create Your Devnetic Profile →
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;