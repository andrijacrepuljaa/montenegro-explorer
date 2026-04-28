import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Contact,
  FileText,
  GraduationCap,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Milestone,
  Navigation,
  Palette,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import kgcLogo from "@/assets/kgc-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { inputClass, mutedLabelClass } from "@/lib/adminUi";
import { LoadingPanel } from "@/components/AdminShared";
import { AdminDashboard } from "@/components/AdminDashboard";
import { HomepageEditor, ContactEditor } from "@/components/AdminContentEditors";
import { CareersPageEditor, CareerOpeningsEditor, InternshipOpeningsEditor, InternshipsPageEditor } from "@/components/AdminCareersEditor";
import { MilestonesEditor, ServicesEditor } from "@/components/AdminDataEditors";
import { MediaEditor, NavigationEditor, SeoEditor, SettingsEditor, ThemeEditor } from "@/components/AdminUtilityEditors";

type AdminSection =
  | "dashboard"
  | "homepage"
  | "services"
  | "milestones"
  | "careers-page"
  | "career-openings"
  | "internships-page"
  | "internship-openings"
  | "contact"
  | "navigation"
  | "seo"
  | "media"
  | "theme"
  | "settings";

const adminSections: Array<{ id: AdminSection; label: string; description: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Dashboard", description: "Content status and quick links", icon: LayoutDashboard },
  { id: "homepage", label: "Homepage", description: "Hero, about, expertise, and CTA copy", icon: Home },
  { id: "services", label: "Services", description: "Consulting services and benefits", icon: Sparkles },
  { id: "milestones", label: "Milestones", description: "Company timeline and highlights", icon: Milestone },
  { id: "careers-page", label: "Careers Page", description: "Standalone careers page layout and supporting copy", icon: FileText },
  { id: "career-openings", label: "Career Openings", description: "Full-time role listings and application links", icon: Briefcase },
  { id: "internships-page", label: "Internships Page", description: "Dedicated internship programme page content", icon: GraduationCap },
  { id: "internship-openings", label: "Internship Openings", description: "Internship role listings and application links", icon: GraduationCap },
  { id: "contact", label: "Contact Info", description: "Email, office, LinkedIn, and contact page", icon: Contact },
  { id: "navigation", label: "Navigation", description: "Header and footer links", icon: Navigation },
  { id: "seo", label: "SEO", description: "Meta titles and social sharing", icon: Search },
  { id: "media", label: "Media", description: "Upload and manage website assets", icon: Image },
  { id: "theme", label: "Theme", description: "Edit the site color groups and preview them live", icon: Palette },
  { id: "settings", label: "Settings", description: "Admin account and project notes", icon: Settings },
];

const isAdminSection = (value: string): value is AdminSection =>
  adminSections.some((section) => section.id === value);

const getHashState = (): { section: AdminSection; panel?: string } => {
  const hash = window.location.hash.replace("#", "");
  const [sectionCandidate, panelCandidate] = hash.split(":");
  return {
    section: isAdminSection(sectionCandidate) ? sectionCandidate : "dashboard",
    panel: panelCandidate || undefined,
  };
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [{ section: activeSection, panel: activePanel }, setHashState] = useState(getHashState);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const handleHashChange = () => {
      setHashState(getHashState());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const currentSection = useMemo(
    () => adminSections.find((section) => section.id === activeSection) || adminSections[0],
    [activeSection],
  );

  const goToSection = (section: AdminSection, panel?: string) => {
    setHashState({ section, panel });
    const nextHash = panel ? `#${section}:${panel}` : `#${section}`;
    window.history.replaceState(null, "", nextHash);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen bg-background"><LoadingPanel /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <img src={kgcLogo} alt="KGC" className="h-8" />
          <div>
            <p className="text-sm font-bold leading-none">KGC Admin</p>
            <p className="mt-1 text-xs text-muted-foreground">Content manager</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {adminSections.map((section) => (
            <button
              key={section.id}
              onClick={() => goToSection(section.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition-colors",
                activeSection === section.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <section.icon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">{section.label}</span>
                <span className={cn("block text-xs", activeSection === section.id ? "text-primary-foreground/75" : "text-muted-foreground")}>{section.description}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <img src={kgcLogo} alt="KGC" className="h-7 lg:hidden" />
              <div>
                <p className={mutedLabelClass}>{currentSection.label}</p>
                <p className="text-sm text-muted-foreground">{currentSection.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select className={`${inputClass} w-auto lg:hidden`} value={activeSection} onChange={(event) => goToSection(event.target.value as AdminSection)}>
                {adminSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.label}</option>
                ))}
              </select>
              <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
                Site
              </Link>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 pb-10 sm:px-6">
          {activeSection === "dashboard" && (
            <AdminDashboard
              activeSection={activeSection}
              activePanel={activePanel}
              onSelect={(section, panel) => goToSection(section as AdminSection, panel)}
            />
          )}
          {activeSection === "homepage" && (
            <HomepageEditor
              activePanel={activePanel}
              onSelectPanel={(panel, section) => goToSection((section as AdminSection | undefined) ?? "homepage", panel)}
            />
          )}
          {activeSection === "services" && (
            <ServicesEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("services", panel)}
            />
          )}
          {activeSection === "milestones" && (
            <MilestonesEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("milestones", panel)}
            />
          )}
          {activeSection === "careers-page" && (
            <CareersPageEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("careers-page", panel)}
            />
          )}
          {activeSection === "career-openings" && (
            <CareerOpeningsEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("career-openings", panel)}
            />
          )}
          {activeSection === "internships-page" && (
            <InternshipsPageEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("internships-page", panel)}
            />
          )}
          {activeSection === "internship-openings" && (
            <InternshipOpeningsEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("internship-openings", panel)}
            />
          )}
          {activeSection === "contact" && (
            <ContactEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("contact", panel)}
            />
          )}
          {activeSection === "navigation" && <NavigationEditor activePanel={activePanel} />}
          {activeSection === "seo" && <SeoEditor activePanel={activePanel} />}
          {activeSection === "media" && <MediaEditor activePanel={activePanel} />}
          {activeSection === "theme" && (
            <ThemeEditor
              activePanel={activePanel}
              onSelectPanel={(panel) => goToSection("theme", panel)}
            />
          )}
          {activeSection === "settings" && <SettingsEditor userEmail={user?.email} />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
