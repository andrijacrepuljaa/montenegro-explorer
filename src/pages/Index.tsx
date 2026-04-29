import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import MilestonesSection from "@/components/MilestonesSection";
import ContactSection from "@/components/ContactSection";
import { PageSectionsRenderer } from "@/components/FlexibleSectionsRenderer";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { usePageSections, usePageStructure } from "@/hooks/useSiteContent";
import { getFlexibleSectionSurfaceMap, getSectionsForPlacement, getStructureSection } from "@/lib/pageSections";

const homeSeo = {
  title: "KGC - Management Consulting from Montenegro",
  description: "Execution-ready supply chain, project management, and digital marketing consulting from Montenegro.",
};

const Index = () => {
  usePageSeo("home", homeSeo);
  const flexibleSections = usePageSections("home");
  const structure = usePageStructure("home");
  const heroSection = getStructureSection(structure, "hero");
  const aboutSection = getStructureSection(structure, "about");
  const expertiseSection = getStructureSection(structure, "expertise");
  const milestonesSection = getStructureSection(structure, "milestones");
  const contactSection = getStructureSection(structure, "contact");
  const flexibleSectionSurfaces = getFlexibleSectionSurfaceMap("home", flexibleSections, structure);
  const aboutSurface = flexibleSectionSurfaces.about || "light";
  const expertiseSurface = flexibleSectionSurfaces.expertise || "dark";
  const milestonesSurface = flexibleSectionSurfaces.milestones || "light";
  const contactSurface = flexibleSectionSurfaces.contact || "light";

  return (
    <div className="min-h-screen">
      <Navbar />
      {heroSection?.visible !== false ? <HeroSection sectionId={heroSection?.anchor} /> : null}
      <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-hero")} surfaceMap={flexibleSectionSurfaces} />
      {aboutSection?.visible !== false ? <AboutSection sectionId={aboutSection?.anchor} surface={aboutSurface} /> : null}
      <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-about")} surfaceMap={flexibleSectionSurfaces} />
      {expertiseSection?.visible !== false ? <ExpertiseSection sectionId={expertiseSection?.anchor} surface={expertiseSurface} /> : null}
      <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-expertise")} surfaceMap={flexibleSectionSurfaces} />
      {milestonesSection?.visible !== false ? <MilestonesSection sectionId={milestonesSection?.anchor} surface={milestonesSurface} /> : null}
      <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-milestones")} surfaceMap={flexibleSectionSurfaces} />
      <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "before-contact-cta")} surfaceMap={flexibleSectionSurfaces} />
      {contactSection?.visible !== false ? <ContactSection sectionId={contactSection?.anchor} surface={contactSurface} /> : null}
      <Footer />
    </div>
  );
};

export default Index;
