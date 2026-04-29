import { Briefcase, Contact, FileText, GraduationCap, Home, Image, LayoutTemplate, Milestone, Navigation, Palette, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { mutedLabelClass, panelClass } from "@/lib/adminUi";

export type AdminMapSection = {
  section: string;
  panel?: string;
  label: string;
};

type MapCard = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  panels: AdminMapSection[];
  preview: number[];
};

const mapCards: MapCard[] = [
  {
    id: "homepage",
    title: "Homepage",
    description: "Hero, about, expertise, contact CTA, and theme colors.",
    icon: Home,
    preview: [75, 100, 42, 42],
    panels: [
      { section: "homepage", panel: "hero", label: "Hero" },
      { section: "homepage", panel: "about", label: "About" },
      { section: "homepage", panel: "expertise", label: "Expertise" },
      { section: "homepage", panel: "contact-cta", label: "Contact CTA" },
      { section: "theme", panel: "brand-colors", label: "Theme" },
    ],
  },
  {
    id: "services",
    title: "Services",
    description: "Edit service cards, benefit bullets, and service icons.",
    icon: Sparkles,
    preview: [28, 28, 28, 28],
    panels: [{ section: "services", panel: "services-list", label: "Service Cards" }],
  },
  {
    id: "milestones",
    title: "Milestones",
    description: "Adjust the company timeline and highlight tags.",
    icon: Milestone,
    preview: [18, 18, 18, 18, 18],
    panels: [{ section: "milestones", panel: "timeline", label: "Timeline" }],
  },
  {
    id: "careers-page",
    title: "Careers Page",
    description: "Hero copy, career perks, openings messaging, and careers-specific CTAs.",
    icon: FileText,
    preview: [72, 40, 24, 24],
    panels: [
      { section: "careers-page", panel: "careers-hero", label: "Hero" },
      { section: "careers-page", panel: "career-perks", label: "Perks" },
      { section: "careers-page", panel: "career-positions", label: "Positions Copy" },
      { section: "careers-page", panel: "career-ctas", label: "CTAs" },
    ],
  },
  {
    id: "career-openings",
    title: "Career Openings",
    description: "Add and manage full-time role cards separately from the page layout.",
    icon: Briefcase,
    preview: [26, 26, 26, 26],
    panels: [{ section: "career-openings", panel: "career-openings-list", label: "Open Roles" }],
  },
  {
    id: "internships-page",
    title: "Internships Page",
    description: "Programme overview, preferred fields, internship perks, and cross-links.",
    icon: GraduationCap,
    preview: [66, 44, 24, 24],
    panels: [
      { section: "internships-page", panel: "internships-hero", label: "Hero" },
      { section: "internships-page", panel: "internship-programme", label: "Programme" },
      { section: "internships-page", panel: "internship-perks", label: "Perks" },
      { section: "internships-page", panel: "internship-ctas", label: "CTAs" },
    ],
  },
  {
    id: "internship-openings",
    title: "Internship Openings",
    description: "Add and manage internship listings separately from the internship page copy.",
    icon: GraduationCap,
    preview: [24, 24, 24, 24],
    panels: [{ section: "internship-openings", panel: "internship-openings-list", label: "Open Internships" }],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Shared contact details plus the contact page messages.",
    icon: Contact,
    preview: [52, 52, 22],
    panels: [
      { section: "contact", panel: "company-details", label: "Company Details" },
      { section: "contact", panel: "contact-page-copy", label: "Page Copy" },
    ],
  },
  {
    id: "page-sections",
    title: "Page Sections",
    description: "Add reusable sections like case studies, milestone blocks, stats, or CTAs to the existing site pages.",
    icon: LayoutTemplate,
    preview: [72, 28, 42, 18],
    panels: [
      { section: "page-sections", panel: "page-sections-pages", label: "Pages" },
      { section: "page-sections", panel: "page-sections-existing", label: "Built-in" },
      { section: "page-sections", panel: "page-sections-builder", label: "Builder" },
    ],
  },
  {
    id: "site-structure",
    title: "Site Structure",
    description: "Navigation, SEO, and media library.",
    icon: Navigation,
    preview: [100, 12, 48],
    panels: [
      { section: "navigation", panel: "nav-links", label: "Navigation" },
      { section: "seo", panel: "seo-pages", label: "SEO" },
      { section: "media", panel: "media-library", label: "Media" },
    ],
  },
  {
    id: "theme",
    title: "Theme",
    description: "Brand colors, surfaces, and dark-section styling.",
    icon: Palette,
    preview: [32, 18, 18, 18, 18],
    panels: [
      { section: "theme", panel: "brand-colors", label: "Brand" },
      { section: "theme", panel: "surface-colors", label: "Surfaces" },
      { section: "theme", panel: "dark-sections", label: "Dark Sections" },
    ],
  },
];

export function AdminPageMap({
  activeSection,
  activePanel,
  onSelect,
}: {
  activeSection?: string;
  activePanel?: string;
  onSelect: (section: string, panel?: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {mapCards.map((card) => (
        <div key={card.id} className={panelClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={mutedLabelClass}>Visual Map</p>
              <h3 className="mt-1 text-lg font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
            </div>
            <div className="rounded-md bg-primary/10 p-3 text-primary">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(card.panels[0].section, card.panels[0].panel)}
            className="mt-4 block w-full rounded-md border border-border p-4 text-left transition-colors hover:bg-muted"
          >
            <div className="flex h-24 items-end gap-2 rounded-md bg-muted/60 p-3">
              {card.preview.map((height, index) => (
                <span
                  key={`${card.id}-${index}`}
                  className="block flex-1 rounded-sm bg-background shadow-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            {card.panels.map((panel) => {
              const isActive = activeSection === panel.section && activePanel === panel.panel;
              return (
                <button
                  key={`${panel.section}-${panel.panel || panel.label}`}
                  type="button"
                  onClick={() => onSelect(panel.section, panel.panel)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                    isActive && "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {panel.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionJumpBar({
  title,
  description,
  sections,
  activePanel,
  onSelect,
}: {
  title: string;
  description: string;
  sections: Array<{ panel: string; label: string; icon?: LucideIcon; section?: string }>;
  activePanel?: string;
  onSelect: (panel: string, section?: string) => void;
}) {
  return (
    <section className={panelClass}>
      <p className={mutedLabelClass}>{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.panel}
            type="button"
            onClick={() => onSelect(section.panel, section.section)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
              activePanel === section.panel && "border-primary bg-primary text-primary-foreground",
            )}
          >
            {section.icon ? <section.icon className="h-4 w-4" /> : null}
            {section.label}
          </button>
        ))}
      </div>
    </section>
  );
}
