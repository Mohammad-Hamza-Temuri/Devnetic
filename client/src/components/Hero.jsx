import { Link } from "react-router-dom";
import HeroImage from "../assets/Hero-design-1.webp";

const Hero = () => {
  return (
    <section
      className="relative flex flex-col items-center text-center px-6 pt-40 pb-24 lg:pt-48 lg:pb-32 bg-cover bg-center"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Dark overlay so text stays readable over the image */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content sits above the overlay */}
      <div className="relative z-10">
        <h1 className="text-4xl lg:text-6xl font-bold text-white max-w-3xl leading-tight capitalize">
          Build something meaningful with{" "}
          <span className="bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            the right developers.
          </span>
        </h1>

        <p className="text-gray-200 text-lg mt-6 max-w-xl mx-auto">
          Create your developer profile, discover projects, find people with
          the skills you need, and turn ideas into real products.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Link
            to="/signup"
            className="rounded-xl py-3 px-8 text-white bg-primary hover:bg-primary-dark transition-colors font-medium"
          >
            Create Your Profile
          </Link>
          <Link 
          to="/login?redirect=/projects" 
          className="rounded-xl py-3 px-8 text-white bg-white/10 border border-white/30 hover:bg-white/20 transition-colors font-medium"
          >
            Explore Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;