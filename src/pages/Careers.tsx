import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageSectionsRenderer } from "@/components/FlexibleSectionsRenderer";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultCareersPage } from "@/lib/cms";
import { usePageSections, usePageStructure, useSiteContent } from "@/hooks/useSiteContent";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getIconByName } from "@/lib/iconLibrary";
import { formatClosingDate } from "@/lib/openings";
import { getFlexibleSectionSurfaceMap, getSectionsForPlacement, getStructureSection, type PageSurface } from "@/lib/pageSections";
import { cn } from "@/lib/utils";

interface CareerOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[] | null;
  apply_url: string | null;
  closing_date: string | null;
}

const careersSeo = {
  title: "Careers at KGC",
  description: "Build your career in management consulting with KGC.",
};

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href);
const isRouteHref = (href: string) => href.startsWith("/");

function ActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }

  return isRouteHref(href) ? (
    <Link to={href} className={className}>{children}</Link>
  ) : (
    <a href={href} className={className}>{children}</a>
  );
}

const pageSectionClass = (surface: PageSurface, first = false) =>
  cn(
    !first && "pt-12 sm:pt-16",
    surface === "dark" && "section-dark -mx-4 px-4 pb-12 sm:-mx-6 sm:px-6 sm:pb-16 lg:-mx-12 lg:px-12",
  );

const Careers = () => {
  const [openings, setOpenings] = useState<CareerOpening[]>([]);
  const content = useSiteContent("careers.page", defaultCareersPage);
  const flexibleSections = usePageSections("careers");
  const structure = usePageStructure("careers");
  usePageSeo("careers", careersSeo);

  useEffect(() => {
    supabase
      .from("career_openings")
      .select("*")
      .eq("is_active", true)
      .eq("tab", "careers")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setOpenings(data);
      });
  }, []);

  const showHero = getStructureSection(structure, "hero")?.visible !== false;
  const showPerks = getStructureSection(structure, "perks")?.visible !== false;
  const showOpenings = getStructureSection(structure, "openings")?.visible !== false;
  const showTalentPool = getStructureSection(structure, "talent-pool")?.visible !== false;
  const heroSection = getStructureSection(structure, "hero");
  const perksSection = getStructureSection(structure, "perks");
  const openingsSection = getStructureSection(structure, "openings");
  const talentPoolSection = getStructureSection(structure, "talent-pool");
  const flexibleSectionSurfaces = getFlexibleSectionSurfaceMap("careers", flexibleSections, structure);
  const heroSurface = flexibleSectionSurfaces.hero || "light";
  const perksSurface = flexibleSectionSurfaces.perks || "light";
  const openingsSurface = flexibleSectionSurfaces.openings || "light";
  const talentPoolSurface = flexibleSectionSurfaces["talent-pool"] || "light";
  const isHeroDark = heroSurface === "dark";
  const isPerksDark = perksSurface === "dark";
  const isOpeningsDark = openingsSurface === "dark";
  const isTalentPoolDark = talentPoolSurface === "dark";

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link to="/" className="flex items-center">
            <img src={kgcLogo} alt="KGC" className="h-8" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-20 lg:px-12">
        {showHero ? (
          <section className={pageSectionClass(heroSurface, true)}>
            <motion.div
              id={heroSection?.anchor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
            >
              <div>
                <div className="accent-bar mb-6" />
                <h1 className={cn("mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl", isHeroDark && "text-hero-fg")}>{content.headline}</h1>
                <p className={cn("max-w-2xl text-base sm:text-lg", isHeroDark ? "text-hero-fg/70" : "text-muted-foreground")}>{content.intro}</p>
              </div>

              <aside className={cn("rounded-md border p-5 sm:p-6", isHeroDark ? "border-dark-border bg-dark-surface" : "border-border bg-card")}>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Also exploring internships?</p>
                <h2 className={cn("mt-2 text-lg font-semibold", isHeroDark && "text-hero-fg")}>{content.internshipsLinkTitle}</h2>
                <p className={cn("mt-2 text-sm leading-relaxed", isHeroDark ? "text-hero-fg/70" : "text-muted-foreground")}>{content.internshipsLinkBody}</p>
                <ActionLink
                  href={content.internshipsLinkHref}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {content.internshipsLinkLabel} <ArrowRight className="h-4 w-4" />
                </ActionLink>
              </aside>
            </motion.div>
          </section>
        ) : null}

        <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-hero")} embedded surfaceMap={flexibleSectionSurfaces} />

        {showPerks ? (
          <section className={pageSectionClass(perksSurface)}>
            <motion.section
              id={perksSection?.anchor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <h2 className={cn("mb-6 text-xl font-bold sm:text-2xl", isPerksDark && "text-hero-fg")}>{content.careersHeading}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                {content.careerPerks.map((perk, index) => {
                  const Icon = getIconByName(perk.iconName);
                  return (
                    <motion.div
                      key={perk.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + index * 0.06 }}
                      className={cn(
                        "rounded-md border p-5 transition-colors hover:border-primary/40 sm:p-6",
                        isPerksDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
                      )}
                    >
                      <Icon className="mb-3 h-6 w-6 text-primary sm:mb-4 sm:h-7 sm:w-7" />
                      <h3 className={cn("mb-2 text-base font-semibold sm:text-lg", isPerksDark && "text-hero-fg")}>{perk.title}</h3>
                      <p className={cn("text-sm leading-relaxed", isPerksDark ? "text-hero-fg/70" : "text-muted-foreground")}>{perk.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </section>
        ) : null}

        <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-perks")} embedded surfaceMap={flexibleSectionSurfaces} />

        {showOpenings ? (
          <section className={pageSectionClass(openingsSurface)}>
            <motion.section
              id={openingsSection?.anchor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <h2 className={cn("mb-6 text-xl font-bold sm:text-2xl", isOpeningsDark && "text-hero-fg")}>{content.positionsHeading}</h2>
              {openings.length === 0 ? (
                <div className={cn("rounded-md border p-5 sm:p-6", isOpeningsDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}>
                  <h3 className={cn("mb-2 text-base font-semibold sm:text-lg", isOpeningsDark && "text-hero-fg")}>{content.noOpeningsTitle}</h3>
                  <p className={cn("mb-4 max-w-2xl text-sm leading-relaxed", isOpeningsDark ? "text-hero-fg/70" : "text-muted-foreground")}>{content.noOpeningsBody}</p>
                  <ActionLink
                    href={content.talentPoolButtonHref}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:px-6"
                  >
                    Join Talent Pool <ArrowRight className="h-4 w-4" />
                  </ActionLink>
                </div>
              ) : (
                <div className="space-y-4">
                  {openings.map((job, index) => {
                    const applyHref = job.apply_url || content.talentPoolButtonHref;
                    const closingDate = formatClosingDate(job.closing_date);

                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.06 }}
                        className={cn(
                          "rounded-md border p-4 transition-colors hover:border-primary/30 sm:p-6",
                          isOpeningsDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
                        )}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className={cn("mb-2 text-base font-semibold sm:text-lg", isOpeningsDark && "text-hero-fg")}>{job.title}</h3>
                            <div className={cn("mb-2 flex flex-wrap gap-3 text-sm sm:gap-4", isOpeningsDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
                              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                              {closingDate ? (
                                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Closes {closingDate}</span>
                              ) : null}
                            </div>
                            <p className={cn("text-sm", isOpeningsDark ? "text-hero-fg/70" : "text-muted-foreground")}>{job.description}</p>
                            {job.requirements && job.requirements.length > 0 ? (
                              <div className="mt-4">
                                <p className={cn("text-xs font-semibold uppercase tracking-wide", isOpeningsDark ? "text-hero-fg/60" : "text-muted-foreground")}>Requirements</p>
                                <ul className={cn("mt-2 space-y-2 text-sm", isOpeningsDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                                  {job.requirements.filter(Boolean).map((requirement) => (
                                    <li key={requirement} className="flex items-start gap-2">
                                      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                      <span>{requirement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                          <ActionLink
                            href={applyHref}
                            className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:px-6"
                          >
                            Apply Now <ArrowRight className="h-4 w-4" />
                          </ActionLink>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          </section>
        ) : null}

        <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-openings")} embedded surfaceMap={flexibleSectionSurfaces} />
        <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "before-final-cta")} embedded surfaceMap={flexibleSectionSurfaces} />

        {showTalentPool ? (
          <section className={pageSectionClass(talentPoolSurface)}>
            <motion.section
              id={talentPoolSection?.anchor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className={cn(
                "rounded-md border p-6 text-center sm:p-8 lg:p-12",
                isTalentPoolDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
              )}
            >
              <h3 className={cn("mb-3 text-lg font-bold sm:text-xl", isTalentPoolDark && "text-hero-fg")}>{content.talentPoolTitle}</h3>
              <p className={cn("mx-auto mb-6 max-w-md text-sm sm:text-base", isTalentPoolDark ? "text-hero-fg/70" : "text-muted-foreground")}>{content.talentPoolBody}</p>
              <ActionLink
                href={content.talentPoolButtonHref}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:px-8 sm:py-3.5"
              >
                {content.talentPoolButtonLabel} <ArrowRight className="h-4 w-4" />
              </ActionLink>
            </motion.section>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default Careers;
