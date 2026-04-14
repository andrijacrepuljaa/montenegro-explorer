import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import MilestonesSection from "@/components/MilestonesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";

const homeSeo = {
  title: "KGC - Management Consulting from Montenegro",
  description: "Execution-ready supply chain, project management, and digital marketing consulting from Montenegro.",
};

const Index = () => {
  usePageSeo("home", homeSeo);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <MilestonesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
