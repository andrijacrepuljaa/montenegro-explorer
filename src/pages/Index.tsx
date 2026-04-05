import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import InteractiveMap from "@/components/InteractiveMap";
import CareersSection from "@/components/CareersSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ExpertiseSection />
    <InteractiveMap />
    <CareersSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
