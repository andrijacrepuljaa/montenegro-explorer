import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Contact,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Milestone,
  Navigation,
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
import { CareersEditor } from "@/components/AdminCareersEditor";
import { MilestonesEditor, ServicesEditor } from "@/components/AdminDataEditors";
import { MediaEditor, NavigationEditor, SeoEditor, SettingsEditor } from "@/components/AdminUtilityEditors";

type AdminSection =
  | "dashboard"
  | "homepage"
  | "services"
  | "milestones"
  | "careers"
  | "contact"
  | "navigation"
  | "seo"
  | "media"
  | "settings";

const adminSections: Array<{ id: AdminSection; label: string; description: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Dashboard", description: "Content status and quick links", icon: LayoutDashboard },
  { id: "homepage", label: "Homepage", description: "Hero, about, expertise, and CTA copy", icon: Home },
  { id: "services", label: "Services", description: "Consulting services and benefits", icon: Sparkles },
  { id: "milestones", label: "Milestones", description: "Company timeline and highlights", icon: Milestone },
  { id: "careers", label: "Careers", description: "Open roles, internships, and page copy", icon: Briefcase },
  { id: "contact", label: "Contact Info", description: "Email, office, LinkedIn, and contact page", icon: Contact },
  { id: "navigation", label: "Navigation", description: "Header and footer links", icon: Navigation },
  { id: "seo", label: "SEO", description: "Meta titles and social sharing", icon: Search },
  { id: "media", label: "Media", description: "Upload and manage website assets", icon: Image },
  { id: "settings", label: "Settings", description: "Admin account and project notes", icon: Settings },
];

const isAdminSection = (value: string): value is AdminSection =>
  adminSections.some((section) => section.id === value);

const getInitialSection = (): AdminSection => {
  const hash = window.location.hash.replace("#", "");
  return isAdminSection(hash) ? hash : "dashboard";
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>(getInitialSection);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (isAdminSection(hash)) setActiveSection(hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const currentSection = useMemo(
    () => adminSections.find((section) => section.id === activeSection) || adminSections[0],
    [activeSection],
  );

  const goToSection = (section: AdminSection) => {
    setActiveSection(section);
    window.history.replaceState(null, "", `#${section}`);
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
          {activeSection === "dashboard" && <AdminDashboard />}
          {activeSection === "homepage" && <HomepageEditor />}
          {activeSection === "services" && <ServicesEditor />}
          {activeSection === "milestones" && <MilestonesEditor />}
          {activeSection === "careers" && <CareersEditor />}
          {activeSection === "contact" && <ContactEditor />}
          {activeSection === "navigation" && <NavigationEditor />}
          {activeSection === "seo" && <SeoEditor />}
          {activeSection === "media" && <MediaEditor />}
          {activeSection === "settings" && <SettingsEditor userEmail={user?.email} />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
