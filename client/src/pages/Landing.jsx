import Header from "../components/Header";
import Hero from "../components/Hero";
import WhatIsDevnetic from "../components/WhatIsDevnetic";
import HowItWorks from "../components/HowItWorks";
import Collaboration from "../components/Collaboration";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
 
const Landing = () => {
  return (
    <div>
      <div className="relative">
        <Header />
        <Hero />
      </div>
      <WhatIsDevnetic />
      <HowItWorks />
      <Collaboration />
      <FinalCTA />
      <Footer />
    </div>
  );
};
 
export default Landing;