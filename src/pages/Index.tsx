import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import InteractiveGlobe from "@/components/InteractiveGlobe";
import MilestonesSection from "@/components/MilestonesSection";
import CareersSection from "@/components/CareersSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ExpertiseSection />
    <InteractiveGlobe />
    <MilestonesSection />
    <CareersSection />
    <Footer />
  </div>
);

export default Index;
